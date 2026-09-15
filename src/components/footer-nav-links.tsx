"use client";

import { scrollToSection, getSectionId } from "@/utils/scroll-to-section";

interface FooterNavLink {
  label: string;
  href: string;
}

export function FooterNavLinks({ links }: { links: FooterNavLink[] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map((link, i) => {
        const sectionId = getSectionId(link.href);
        if (sectionId) {
          // Section link — scroll without hash in URL
          return (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSection(sectionId)}
              className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 uppercase tracking-widest transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </button>
          );
        }
        // Regular page link
        return (
          <a
            key={i}
            href={link.href}
            className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 uppercase tracking-widest transition-colors duration-200"
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
