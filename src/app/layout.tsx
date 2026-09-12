import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { Person, WebSite, WithContext } from "schema-dts";

import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";
import { META_THEME_COLORS, SITE_INFO } from "@/config/site";
import { USER } from "@/data/user";
import { fontMono, fontSans } from "@/lib/fonts";

function getJsonLd(): (WithContext<WebSite> | WithContext<Person>)[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Gowtham | GowthamDev Portfolio",
      url: SITE_INFO.url,
      alternateName: [
        "gowthamdev",
        "gowtham",
        "gowtham portfolio",
        "gowtham dev",
        "gowthamdev.me",
      ],
      description: SITE_INFO.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Gowtham",
      alternateName: ["gowthamdev", "gowtham dev", "GowthamDev"],
      url: SITE_INFO.url,
      image: `${SITE_INFO.url}${USER.avatar}`,
      jobTitle: USER.jobTitle,
      description: SITE_INFO.description,
      sameAs: [
        "https://github.com/ggowt",
        "https://linkedin.com/in/ggowt",
        "https://x.com/ggowt",
        "https://instagram.com/ggowt",
      ],
      knowsAbout: [
        "Web Development",
        "Frontend Engineering",
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Full Stack Development",
        "UI/UX Design",
      ],
    },
  ];
}

// Thanks @shadcn-ui, @tailwindcss
const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}

  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
  },
  title: {
    template: `%s | GowthamDev`,
    default: `Gowtham (gowthamdev) | Web Developer Portfolio`,
  },
  description: SITE_INFO.description,
  keywords: USER.keywords.split(",").map((k) => k.trim()),
  authors: [
    {
      name: "Gowtham",
      url: SITE_INFO.url,
    },
  ],
  creator: "gowtham",
  publisher: "gowthamdev",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "Gowtham | GowthamDev",
    url: "/",
    type: "website",
    title: `Gowtham (gowthamdev) | Web Developer Portfolio`,
    description: SITE_INFO.description,
    locale: "en_US",
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: "Gowtham | GowthamDev Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Gowtham (gowthamdev) | Web Developer Portfolio`,
    description: SITE_INFO.description,
    creator: `@ggowt`,
    images: [SITE_INFO.ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
};

import { ClientLoadingWrapper } from "@/components/client-loading-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: darkModeScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <link
          rel="preload"
          href="/signatur/japan-daisuki-font/JapanDaisuki-8OeaZ.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>

      <body className="min-h-screen">
        {/* GSAP loaded with afterInteractive to prevent render blocking */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="afterInteractive"
        />
        <SmoothScroll />
        <Providers>
          <ClientLoadingWrapper>
            {children}
          </ClientLoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}

