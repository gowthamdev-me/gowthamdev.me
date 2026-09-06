import dayjs from "dayjs";
import { getTableOfContents } from "fumadocs-core/server";
import { ArrowLeftIcon, ArrowRightIcon, CalendarDaysIcon, ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { InlineTOC } from "@/components/inline-toc";
import { MDX } from "@/components/mdx";
import { PostKeyboardShortcuts } from "@/components/post-keyboard-shortcuts";
import { LLMCopyButtonWithViewOptions } from "@/components/post-page-actions";
import { PostShareMenu } from "@/components/post-share-menu";
import { Prose } from "@/components/ui/typography";
import { SITE_INFO } from "@/config/site";
import { findNeighbour, getAllPosts, getPostBySlug } from "@/data/blog";
import { USER } from "@/data/user";
import type { Post } from "@/types/blog";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);
  if (!post) return notFound();
  const { title, description, image, createdAt, updatedAt } = post.metadata;
  const postUrl = getPostUrl(post);
  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`;
  return {
    title,
    description,
    alternates: { canonical: postUrl },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: dayjs(createdAt).toISOString(),
      modifiedTime: dayjs(updatedAt).toISOString(),
      images: { url: ogImage, width: 1200, height: 630, alt: title },
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

function getPageJsonLd(post: Post): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image: post.metadata.image || `/og/simple?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${SITE_INFO.url}${getPostUrl(post)}`,
    datePublished: dayjs(post.metadata.createdAt).toISOString(),
    dateModified: dayjs(post.metadata.updatedAt).toISOString(),
    author: { "@type": "Person", name: USER.displayName, identifier: USER.username, image: USER.avatar },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = getTableOfContents(post.content);
  const allPosts = getAllPosts();
  const { previous, next } = findNeighbour(allPosts, slug);
  const date = dayjs(post.metadata.createdAt);
  const updated = dayjs(post.metadata.updatedAt);
  const wasUpdated = !date.isSame(updated, "day");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(post)).replace(/</g, "\\u003c"),
        }}
      />
      <PostKeyboardShortcuts basePath="/blog" previous={previous} next={next} />

      {/* ── Top toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3 border-b border-zinc-100 dark:border-white/[0.06]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors group"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          All posts
        </Link>

        <div className="flex items-center gap-1.5">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getPostUrl(post)}.mdx`}
            isComponent={post.metadata.category === "components"}
          />
          <PostShareMenu url={getPostUrl(post)} />

          {previous && (
            <Link
              href={`/blog/${previous.slug}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200/80 dark:border-white/[0.08] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors"
              title="Previous post"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200/80 dark:border-white/[0.08] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors"
              title="Next post"
            >
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Hero image ──────────────────────────────────────────────────────── */}
      {post.metadata.image && (
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            fill
            priority
            quality={90}
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      )}

      {/* ── Article header ───────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 md:px-14 pt-10 sm:pt-12 pb-8 sm:pb-10 border-b border-zinc-100 dark:border-white/[0.06]">
        {/* Category / label */}
        {post.metadata.category && (
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px w-5" style={{ background: "#FA0143" }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: "#FA0143" }}>
              {post.metadata.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 mb-5 text-balance">
          {post.metadata.title}
        </h1>

        {/* Description */}
        {post.metadata.description && (
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-6">
            {post.metadata.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400 dark:text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5">
            <CalendarDaysIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <time dateTime={date.toISOString()}>{date.format("MMMM DD, YYYY")}</time>
          </span>
          {wasUpdated && (
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
              Updated {updated.format("MMM DD, YYYY")}
            </span>
          )}
          {post.metadata.new && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ background: "#FA0143" }}
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────────────────────── */}
      <Prose className="px-6 sm:px-10 md:px-14 py-10 sm:py-12 font-sans prose-base sm:prose-lg prose-p:leading-8 prose-headings:tracking-tight prose-headings:font-bold prose-a:text-[#FA0143] prose-a:no-underline hover:prose-a:underline">
        <InlineTOC items={toc} />
        <div>
          <MDX code={post.content} />
        </div>
      </Prose>

      {/* ── Previous / Next navigation ───────────────────────────────────────── */}
      {(previous || next) && (
        <div className="border-t border-zinc-100 dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 dark:divide-white/[0.06]">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="group flex flex-col gap-1.5 p-6 sm:p-8 hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 group-hover:text-[#FA0143] transition-colors">
                <ArrowLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </span>
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-snug">
                {previous.metadata.title}
              </span>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex flex-col gap-1.5 p-6 sm:p-8 sm:items-end hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors text-left sm:text-right"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 group-hover:text-[#FA0143] transition-colors">
                Next
                <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-snug">
                {next.metadata.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      )}
    </>
  );
}

function getPostUrl(post: Post) {
  return `/blog/${post.slug}`;
}