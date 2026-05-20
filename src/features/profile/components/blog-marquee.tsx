"use client";

import type { Post } from "@/types/blog";

import { BlogPostCard } from "./blog-post-card";

export function BlogMarquee({ posts }: { posts: Post[] }) {
  return (
    <div className="overflow-hidden blog-marquee-zone">
      <div className="blog-marquee-track flex w-max gap-2 sm:gap-4 lg:gap-5 pb-1 sm:pb-2">
        {posts.map((post) => (
          <div key={`set-a-${post.slug}`} className="shrink-0 w-[240px] sm:w-[320px] lg:w-[360px]">
            <BlogPostCard post={post} />
          </div>
        ))}

        {posts.map((post) => (
          <div key={`set-b-${post.slug}`} className="shrink-0 w-[240px] sm:w-[320px] lg:w-[360px]" aria-hidden>
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

