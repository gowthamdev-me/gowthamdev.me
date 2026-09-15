import React from "react";

import { getAllPosts } from "@/data/blog";
import { readJsonFile } from "@/lib/admin-data";
import { BlogAccordion } from "./blog-accordion";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

function getVisibleBlogPosts() {
  const allPosts = getAllPosts();

  try {
    const adminPosts = readJsonFile<any[]>("blog-posts.json", []);
    if (adminPosts.length === 0) return allPosts;

    const visibilityBySlug = new Map<string, boolean>();
    adminPosts.forEach((post: any) => {
      if (typeof post?.slug === "string") {
        visibilityBySlug.set(post.slug, post.showInPortfolio !== false);
      }
    });

    return allPosts.filter((post) => {
      const visible = visibilityBySlug.get(post.slug);
      return visible === undefined ? true : visible;
    });
  } catch {
    return allPosts;
  }
}

export function Blog() {
  const visiblePosts = getVisibleBlogPosts();
  const accordionPosts = visiblePosts.slice(0, 6);

  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <Panel id="blog">
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Blog
            </PanelTitle>
          </div>
        </div>
      </PanelHeader>

      <PanelContent className="p-3 sm:p-5 md:p-6 lg:p-8">
        <BlogAccordion posts={accordionPosts} />
      </PanelContent>
    </Panel>
  );
}

