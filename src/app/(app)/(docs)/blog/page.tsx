import dayjs from "dayjs";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_INFO } from "@/config/site";
import { USER } from "@/data/user";
import { getAllPosts } from "@/data/blog";
import { BlogPostCard } from "@/features/profile/components/blog-post-card";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/features/profile/components/panel";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore articles, tutorials, and engineering insights on modern web development, Next.js architecture, and UI engineering by Gowtham.",
  alternates: {
    canonical: `${SITE_INFO.url}/blog`,
  },
  openGraph: {
    title: "Blog | Gowtham",
    description:
      "Explore articles, tutorials, and engineering insights on modern web development, Next.js architecture, and UI engineering by Gowtham.",
    url: `${SITE_INFO.url}/blog`,
    type: "website",
    siteName: SITE_INFO.name,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: "Gowtham | Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Gowtham",
    description:
      "Explore articles, tutorials, and engineering insights on modern web development, Next.js architecture, and UI engineering by Gowtham.",
    creator: `@${USER.username}`,
    images: [SITE_INFO.ogImage],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_INFO.url,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${SITE_INFO.url}/blog`,
        },
      ],
    },
    {
      "@type": "Blog",
      "@id": `${SITE_INFO.url}/blog#blog`,
      "name": "Gowtham's Blog",
      "description":
        "Articles, tutorials, and engineering insights on modern web development, Next.js architecture, and UI engineering.",
      "url": `${SITE_INFO.url}/blog`,
      "publisher": {
        "@type": "Person",
        "name": USER.displayName,
        "url": SITE_INFO.url,
      },
    },
  ],
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
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14 py-4 sm:py-6 lg:py-8 min-h-screen flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div>
        {/* Header */}
        <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-2 sm:mb-3 lg:mb-5">
          <SiteHeader />
        </div>

        {/* Main Panel matching homepage */}
        <Panel className="mb-6 sm:mb-8">
          <PanelHeader className="px-4 sm:px-8 md:px-10 py-3.5 sm:py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/"
                  className="flex size-8 sm:size-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-white/10 transition-colors"
                  title="Back to home"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <PanelTitle className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight whitespace-nowrap">
                  Blog
                </PanelTitle>
              </div>

              <div className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-[10px] sm:rounded-[16px] bg-zinc-100 text-[11px] sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10 uppercase tracking-wider shrink-0">
                {sortedPosts.length} {sortedPosts.length === 1 ? "Article" : "Articles"}
              </div>
            </div>
          </PanelHeader>

          <PanelContent className="p-4 sm:p-6 md:p-8">
            {sortedPosts.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-2 text-center">
                <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  No articles published yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Check back soon for new articles and updates.
                </p>
              </div>
            ) : isSingle ? (
              /* ── Single Article Editorial Layout ── */
              <div className="w-full">
                <Link
                  href={`/blog/${sortedPosts[0].slug}`}
                  className="group flex flex-col lg:flex-row rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.03] hover:bg-zinc-50 dark:hover:bg-white/[0.05] hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-200 overflow-hidden"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:w-7/12 min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200/80 dark:border-white/10">
                    {sortedPosts[0].metadata.image ? (
                      <Image
                        src={sortedPosts[0].metadata.image}
                        alt={sortedPosts[0].metadata.title}
                        fill
                        priority
                        unoptimized
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground uppercase tracking-widest">
                        Article
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8 lg:w-5/12 gap-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        <Calendar className="size-3.5" />
                        <time dateTime={dayjs(sortedPosts[0].metadata.createdAt).toISOString()}>
                          {dayjs(sortedPosts[0].metadata.createdAt).format("MMM DD, YYYY")}
                        </time>
                        {sortedPosts[0].metadata.category && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                            {sortedPosts[0].metadata.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-white group-hover:text-primary transition-colors duration-200 mb-2.5">
                        {sortedPosts[0].metadata.title}
                      </h3>

                      {sortedPosts[0].metadata.description && (
                        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed line-clamp-4">
                          {sortedPosts[0].metadata.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">
                      <span>Read article</span>
                      <div className="flex size-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all">
                        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : sortedPosts.length === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {sortedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {sortedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </PanelContent>
        </Panel>
      </div>

      {/* Footer matching homepage */}
      <div className="mt-2 sm:mt-3 lg:mt-5" data-section="footer">
        <SiteFooter />
      </div>
    </div>
  );
}
