import dayjs from "dayjs";
import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPosts } from "@/data/blog";
import { BlogPostCard } from "@/features/profile/components/blog-post-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on development, design, and ideas.",
};

export default function Page() {
  const allPosts = getAllPosts();

  const sortedPosts = allPosts
    .slice()
    .sort((a, b) =>
      dayjs(b.metadata.createdAt).diff(dayjs(a.metadata.createdAt))
    );

  return (
    <div className="w-full px-3 sm:px-6 md:px-8 max-w-[1600px] mx-auto py-4 sm:py-8 lg:py-12">
      {/* Header */}
      <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-6 sm:mb-8 lg:mb-10">
        <SiteHeader />
      </div>

      {/* Page card */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-zinc-100 dark:border-white/[0.06] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

        {/* Subtle dot-grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Faint red ambient glow in top-left corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(250,1,67,0.07) 0%, transparent 70%)",
          }}
        />

        {/* ── Heading section ─────────────────────────────────────────────── */}
        <div className="px-6 sm:px-10 md:px-14 pt-10 sm:pt-14 pb-8 sm:pb-10 border-b border-zinc-100 dark:border-white/[0.06]">
          {/* Label */}
          <div className="flex items-center gap-2.5 mb-6">
            <div
              className="h-px w-6"
              style={{ background: "#FA0143" }}
            />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.28em]"
              style={{ color: "#FA0143" }}
            >
              Blog
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Writing &amp;{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Ideas</span>
              {/* thin red underline */}
              <span
                className="absolute bottom-0.5 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "rgba(250,1,67,0.35)" }}
              />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
            {metadata.description}
          </p>
        </div>

        {/* ── Posts grid ──────────────────────────────────────────────────── */}
        <div className="p-4 sm:p-6 md:p-10">
          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center gap-3 text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ background: "rgba(250,1,67,0.08)" }}
              >
                <span style={{ color: "#FA0143", fontSize: "1.2rem" }}>✍</span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No posts yet</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">Check back soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-5 lg:mt-6">
        <SiteFooter />
      </div>
    </div>
  );

}

