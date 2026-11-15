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
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
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
      <div className="flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 border-b border-border/70">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider group"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to all posts
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
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors"
              title="Previous post"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors"
              title="Next post"
            >
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Hero image with ambient backdrop ──────────────────────────────────── */}
      {post.metadata.image && (
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] overflow-hidden bg-zinc-950 flex items-center justify-center border-b border-border/70">
          <Image
            src={post.metadata.image}
            alt=""
            fill
            aria-hidden="true"
            unoptimized
            className="object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
          />
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            fill
            priority
            quality={95}
            unoptimized
            className="object-contain object-center p-3 sm:p-6"
          />
        </div>
      )}

      {/* ── Article header ───────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 md:px-14 lg:px-20 pt-8 sm:pt-12 pb-8 sm:pb-10 border-b border-border/70">
        {/* Category / label */}
        {post.metadata.category && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FA0143]/10 border border-[#FA0143]/20 text-[11px] font-bold text-[#FA0143] uppercase tracking-widest mb-4">
            <span>{post.metadata.category}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          {post.metadata.title}
        </h1>

        {/* Description */}
        {post.metadata.description && (
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl mb-6">
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
      <div className="px-6 sm:px-10 md:px-14 lg:px-20 py-10 sm:py-14">
        <Prose className="max-w-4xl mx-auto font-sans prose-base sm:prose-lg prose-p:leading-8 prose-headings:tracking-tight prose-headings:font-bold prose-a:text-[#FA0143] prose-a:no-underline hover:prose-a:underline">
          <InlineTOC items={toc} />
          <div>
            <MDX code={post.content} />
          </div>
        </Prose>
      </div>

      {/* ── Previous / Next navigation ───────────────────────────────────────── */}
      {(previous || next) && (
        <div className="border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/70">
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