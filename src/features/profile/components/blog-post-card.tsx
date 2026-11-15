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
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.03] transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] hover:border-zinc-300 dark:hover:border-white/15 hover:shadow-xs"
    >
      {/* Cover image */}
      {post.metadata.image ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-white/10">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            loading="lazy"
            unoptimized
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          {post.metadata.new && (
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-900/80 text-white dark:bg-white/90 dark:text-zinc-900 backdrop-blur-sm">
              New
            </span>
          )}
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-white/10">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Article
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 gap-3">
        {/* Date and category */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDaysIcon className="size-3.5 shrink-0" />
          <time dateTime={date.toISOString()}>
            {date.format("MMM DD, YYYY")}
          </time>
          {post.metadata.category && (
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
              {post.metadata.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {post.metadata.title}
        </h3>

        {/* Description */}
        {post.metadata.description && (
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal line-clamp-2 leading-relaxed flex-1">
            {post.metadata.description}
          </p>
        )}

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">
          <span>Read article</span>
          <span className="flex items-center justify-center size-7 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all">
            <ArrowUpRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
