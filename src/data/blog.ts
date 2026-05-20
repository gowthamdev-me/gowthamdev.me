import fs from "fs";
import matter from "gray-matter";
import path from "path";
import * as yaml from "js-yaml";

import type { Post, PostMetadata } from "@/types/blog";
import { readJsonFile } from "@/lib/admin-data";

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent, {
    engines: {
      yaml: (s) => yaml.load(s) as object,
    },
  });

  return {
    metadata: file.data as PostMetadata,
    content: file.content,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}


export function getAllPosts(): Post[] {
  // 1. Get all MDX files content
  const mdxDir = path.join(process.cwd(), "src/content/blog");
  const mdxDataMap = new Map<string, Post>();
  
  if (fs.existsSync(mdxDir)) {
    const mdxFiles = fs.readdirSync(mdxDir).filter(f => path.extname(f) === ".mdx");
    for (const file of mdxFiles) {
      const slug = path.basename(file, ".mdx");
      const { metadata, content } = readMDXFile(path.join(mdxDir, file));
      mdxDataMap.set(slug, { metadata, slug, content });
    }
  }

  // 2. Get admin-controlled posts
  let adminPosts: any[] = [];
  try {
    adminPosts = readJsonFile<any[]>("blog-posts.json", []);
  } catch {
    // If json fails, fallback to just showing MDX posts if any
    return Array.from(mdxDataMap.values()).sort((a, b) => 
      new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
    );
  }

  // If we have no admin posts yet, show all MDX posts
  if (adminPosts.length === 0) {
    return Array.from(mdxDataMap.values()).sort((a, b) => 
      new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
    );
  }

  // 3. Filter and Map admin posts to Post type
  const posts = adminPosts
    .filter(p => p.showInPortfolio !== false && p.published !== false)
    .map(p => {
      const mdxPost = mdxDataMap.get(p.slug);
      
      // Prefer JSON data if it exists, fallback to MDX frontmatter/content
      const metadata: PostMetadata = {
        title: p.title || mdxPost?.metadata.title || "",
        description: p.excerpt || mdxPost?.metadata.description || "",
        image: p.coverImage || mdxPost?.metadata.image || "",
        category: p.category || mdxPost?.metadata.category || "",
        createdAt: p.createdAt || mdxPost?.metadata.createdAt || "",
        updatedAt: p.updatedAt || mdxPost?.metadata.updatedAt || p.createdAt || "",
      };

      return {
        metadata,
        slug: p.slug,
        content: p.content || mdxPost?.content || "",
      } as Post;
    });

  return posts.sort((a, b) => 
    new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
  );
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.metadata?.category === category);
}

export function findNeighbour(posts: Post[], slug: string) {
  const len = posts.length;

  for (let i = 0; i < len; ++i) {
    if (posts[i].slug === slug) {
      return {
        previous: i > 0 ? posts[i - 1] : null,
        next: i < len - 1 ? posts[i + 1] : null,
      };
    }
  }

  return { previous: null, next: null };
}

