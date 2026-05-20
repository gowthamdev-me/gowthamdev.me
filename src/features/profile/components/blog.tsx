import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/data/blog";
import { readJsonFile } from "@/lib/admin-data";

import { BlogPostCard } from "./blog-post-card";
import { BlogMarquee } from "./blog-marquee";
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
  const carouselPosts = visiblePosts.slice(0, 6);

  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <Panel id="blog">
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Blog
              <sup className="ml-2 text-sm font-mono text-muted-foreground/60 select-none">
                {visiblePosts.length}
              </sup>
            </PanelTitle>
          </div>

          <Button variant="outline" asChild className="rounded-[12px] sm:rounded-[16px] h-[34px] sm:h-10 px-3 sm:px-4 bg-zinc-100 border-zinc-200 text-zinc-500 font-semibold hover:bg-zinc-200/50 hover:text-zinc-700 transition-[background-color,border-color] duration-300 ease-out gap-1.5 group/btn text-xs sm:text-sm shrink-0 dark:bg-white/5 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-300 uppercase tracking-wider">
            <Link href="/blog" className="flex items-center gap-1.5">
              Posts
              <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </PanelHeader>

      <PanelContent className="p-3 sm:p-6 md:p-8 lg:p-10 relative">
        <BlogMarquee posts={carouselPosts} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-14 bg-gradient-to-r from-background/85 dark:from-zinc-900/70 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-14 bg-gradient-to-l from-background/85 dark:from-zinc-900/70 to-transparent" />
      </PanelContent>
    </Panel>
  );
}

