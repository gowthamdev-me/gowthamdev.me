import { RssIcon } from "lucide-react";

import { SITE_INFO } from "@/config/site";
import { USER } from "@/data/user";
import { readJsonFile } from "@/lib/admin-data";

import { Icons } from "./icons";

export function SiteFooter() {
  const footerConfig = USER.footer;

  const profile = readJsonFile<{ sectionVisibility?: Record<string, boolean> }>(
    "profile.json",
    {}
  );
  const visibility = profile.sectionVisibility || {};
  const visibilityMap: Record<string, string> = {
    About: "aboutMe",
    Stack: "techStack",
    Experience: "experiences",
    Projects: "projects",
    Blog: "blog",
  };

  const filteredLinks = footerConfig.navigationLinks.filter((link) => {
    const key = visibilityMap[link.label];
    return key ? visibility[key] !== false : true;
  });

  const socialLinks = [
    footerConfig.socialLinks.twitter && {
      href: footerConfig.socialLinks.twitter,
      label: "X / Twitter",
      icon: <Icons.x className="h-4 w-4" />,
    },
    footerConfig.socialLinks.github && {
      href: footerConfig.socialLinks.github,
      label: "GitHub",
      icon: <Icons.github className="h-4 w-4" />,
    },
    footerConfig.socialLinks.linkedin && {
      href: footerConfig.socialLinks.linkedin,
      label: "LinkedIn",
      icon: <Icons.linkedin className="h-4 w-4" />,
    },
    footerConfig.socialLinks.instagram && {
      href: footerConfig.socialLinks.instagram,
      label: "Instagram",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    footerConfig.socialLinks.youtube && {
      href: footerConfig.socialLinks.youtube,
      label: "YouTube",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full rounded-2xl sm:rounded-3xl border border-zinc-100 dark:border-white/[0.06] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

      {/* Subtle dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative px-6 sm:px-10 md:px-14 py-10 sm:py-12">

        {/* ── Top row: name + social icons ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">

          {/* Name + tagline */}
          <div>
            {/* Small glowing dot + label */}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: "#FA0143",
                  boxShadow: "0 0 6px rgba(250,1,67,0.8), 0 0 14px rgba(250,1,67,0.4)",
                }}
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em]"
                style={{ color: "#FA0143" }}>
                Portfolio
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              <span style={{ color: "#FA0143" }}>G</span>owtham
            </h2>
            {footerConfig.contactEmail && (
              <a
                href={`mailto:${footerConfig.contactEmail}`}
                className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                {footerConfig.contactEmail}
              </a>
            )}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="h-px bg-zinc-100 dark:bg-white/[0.06] mb-8" />

        {/* ── Nav links ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
          {filteredLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 uppercase tracking-widest transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          {footerConfig.showRSS && (
            <a
              href={`${SITE_INFO.url}/rss`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 uppercase tracking-widest transition-colors"
            >
              <RssIcon className="w-3 h-3" />
              RSS
            </a>
          )}
        </div>

        {/* ── Quote ────────────────────────────────────────────────────────── */}
        {footerConfig.quote && (
          <div className="mb-8 pl-4 border-l-2" style={{ borderColor: "#FA0143" }}>
            <p className="text-sm italic text-zinc-500 dark:text-zinc-400 leading-relaxed">
              "{footerConfig.quote.text}"
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              — {footerConfig.quote.author}
            </p>
          </div>
        )}

        {/* ── Bottom row: copyright ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-6 border-t border-zinc-100 dark:border-white/[0.06]">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {year} {footerConfig.displayName}. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {footerConfig.attribution}
          </p>
        </div>
      </div>
    </footer>
  );
}
