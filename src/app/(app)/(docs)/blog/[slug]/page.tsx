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

      {/* ── Top Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-8 md:px-10 py-3.5 sm:py-5 border-b border-zinc-100 dark:border-white/5">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeftIcon className="size-3.5 sm:size-4 transition-transform group-hover:-translate-x-0.5" />
          <span>All articles</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <PostShareMenu url={getPostUrl(post)} />

          {previous && (
            <Link
              href={`/blog/${previous.slug}`}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              title="Previous article"
              aria-label="Previous article"
            >
              <ArrowLeftIcon className="size-3.5" />
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              title="Next article"
              aria-label="Next article"
            >
              <ArrowRightIcon className="size-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Article Header ───────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 pt-8 sm:pt-12 pb-6 sm:pb-8 border-b border-zinc-100 dark:border-white/5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground mb-3 sm:mb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <CalendarDaysIcon className="size-3.5" />
            <time dateTime={date.toISOString()}>{date.format("MMMM DD, YYYY")}</time>
          </span>
          {wasUpdated && (
            <span className="flex items-center gap-1.5 font-medium">
              <ClockIcon className="size-3.5" />
              Updated {updated.format("MMM DD, YYYY")}
            </span>
          )}
          {post.metadata.category && (
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {post.metadata.category}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.2] mb-3 sm:mb-4">
          {post.metadata.title}
        </h1>

        {post.metadata.description && (
          <p className="text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed max-w-3xl">
            {post.metadata.description}
          </p>
        )}
      </div>

      {/* ── Cover Image (Clean Presentation) ─────────────────────────────────── */}
      {post.metadata.image && (
        <div className="px-5 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-8">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              priority
              quality={95}
              unoptimized
              className="object-cover object-center"
            />
          </div>
        </div>
      )}

      {/* ── Article Content ──────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">
        <Prose className="max-w-3xl mx-auto font-sans prose-base sm:prose-lg leading-relaxed text-zinc-700 dark:text-zinc-300 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <InlineTOC items={toc} />
          <div>
            <MDX code={post.content} />
          </div>
        </Prose>
      </div>

      {/* ── Previous / Next Navigation ───────────────────────────────────────── */}
      {(previous || next) && (
        <div className="border-t border-zinc-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 dark:divide-white/5">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="group flex flex-col gap-1.5 p-5 sm:p-7 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </span>
              <span className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug">
                {previous.metadata.title}
              </span>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex flex-col gap-1.5 p-5 sm:p-7 sm:items-end hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-left sm:text-right"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Next
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug">
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
