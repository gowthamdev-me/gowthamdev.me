import dayjs from "dayjs";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Sparkles } from "lucide-react";

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

  const isSingle = sortedPosts.length === 1;

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 min-h-screen flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-4 sm:mb-6 lg:mb-8">
          <SiteHeader />
        </div>

        {/* Main Card Container */}
        <div className="relative rounded-[24px] sm:rounded-[32px] border border-border bg-card shadow-sm overflow-hidden mb-6 sm:mb-8">
          {/* Subtle background ambient texture & glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(250,1,67,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Heading section */}
          <div className="px-6 sm:px-10 md:px-12 pt-8 sm:pt-12 pb-6 sm:pb-8 border-b border-border/70">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FA0143]/10 border border-[#FA0143]/20 text-[11px] font-bold text-[#FA0143] uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>Articles &amp; Insights</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              Writing &amp;{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Ideas</span>
                <span
                  className="absolute bottom-0.5 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: "rgba(250,1,67,0.4)" }}
                />
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed font-normal">
              A curated collection of thoughts, tutorials, and insights on development, design engineering, and modern web architecture.
            </p>
          </div>

          {/* Posts list */}
          <div className="p-6 sm:p-10">
            {sortedPosts.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-3 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                  style={{ background: "rgba(250,1,67,0.08)" }}
                >
                  <span style={{ color: "#FA0143", fontSize: "1.4rem" }}>✍</span>
                </div>
                <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  No articles published yet
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Check back soon for upcoming articles and updates.
                </p>
              </div>
            ) : isSingle ? (
              /* ── Single Post Featured Layout ── */
              <div className="max-w-4xl mx-auto">
                <Link
                  href={`/blog/${sortedPosts[0].slug}`}
                  className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image side */}
                  <div className="relative aspect-[16/10] md:aspect-auto md:w-1/2 overflow-hidden bg-zinc-950 shrink-0">
                    {sortedPosts[0].metadata.image ? (
                      <Image
                        src={sortedPosts[0].metadata.image}
                        alt={sortedPosts[0].metadata.title}
                        fill
                        priority
                        unoptimized
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-zinc-900">
                        <span className="text-xs font-mono text-[#FA0143] tracking-widest uppercase">
                          Featured Article
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
                    <span
                      className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white shadow-md"
                      style={{ background: "#FA0143" }}
                    >
                      Featured
                    </span>
                  </div>

                  {/* Content side */}
                  <div className="flex flex-col justify-between p-6 sm:p-8 md:w-1/2 gap-4">
                    <div>
                      {/* Date & category */}
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <time dateTime={dayjs(sortedPosts[0].metadata.createdAt).toISOString()}>
                          {dayjs(sortedPosts[0].metadata.createdAt).format("MMMM DD, YYYY")}
                        </time>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-[#FA0143] transition-colors duration-200 mb-3">
                        {sortedPosts[0].metadata.title}
                      </h2>

                      {/* Excerpt */}
                      {sortedPosts[0].metadata.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                          {sortedPosts[0].metadata.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom row: Read Article action */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#FA0143]">
                        Read full article
                      </span>
                      <div className="w-9 h-9 rounded-full bg-[#FA0143]/10 text-[#FA0143] flex items-center justify-center group-hover:bg-[#FA0143] group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : sortedPosts.length === 2 ? (
              /* ── Exactly 2 Posts Balanced 2-Column Grid ── */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              /* ── 3+ Posts Grid ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simplified Footer */}
      <div className="mt-2">
        <SiteFooter variant="compact" />
      </div>
    </div>
  );
}
