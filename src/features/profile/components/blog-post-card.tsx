import dayjs from "dayjs";
import { ArrowUpRightIcon, CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { Post } from "@/types/blog";

export function BlogPostCard({ post }: { post: Post }) {
  const date = dayjs(post.metadata.createdAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow duration-300"
    >


      {/* ── Cover image ────────────────────────────────────────────────────── */}
      {post.metadata.image ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-accent">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            loading="lazy"
            unoptimized
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle dark overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* New badge */}
          {post.metadata.new && (
            <span
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white"
              style={{ background: "#FA0143" }}
            >
              New
            </span>
          )}
        </div>
      ) : (
        /* Placeholder when no image: dark gradient block */
        <div className="relative aspect-[16/9] w-full overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)" }}
        >
          <span
            className="font-mono text-xs uppercase tracking-[0.25em] opacity-30"
            style={{ color: "#FA0143" }}
          >
            Article
          </span>
        </div>
      )}

      {/* ── Card body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5 gap-3">

        {/* Date chip */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <CalendarDaysIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <time dateTime={date.toISOString()}>
            {date.format("MMM DD, YYYY")}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-2 group-hover:text-[#FA0143] transition-colors duration-300">
          {post.metadata.title}
        </h3>

        {/* Description */}
        {post.metadata.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium line-clamp-2 leading-relaxed flex-1">
            {post.metadata.description}
          </p>
        )}

        {/* ── Footer row ─────────────────────────────────────────────────── */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Read article
          </span>
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-300 group-hover:text-white"
            style={{
              background: "rgba(250,1,67,0.08)",
              color: "#FA0143",
            }}
          >
            <ArrowUpRightIcon
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
