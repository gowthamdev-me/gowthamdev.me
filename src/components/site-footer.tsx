import { RssIcon } from "lucide-react";

import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { USER } from "@/data/user";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";

import { readJsonFile } from "@/lib/admin-data";

export function SiteFooter() {
  const footerConfig = USER.footer;

  // Read section visibility to sync with home page
  const profile = readJsonFile<{ sectionVisibility?: Record<string, boolean> }>(
    "profile.json",
    {}
  );
  const visibility = profile.sectionVisibility || {};

  // Map of link labels to visibility keys
  const visibilityMap: Record<string, string> = {
    About: "aboutMe",
    Stack: "techStack",
    Experience: "experiences",
    Projects: "projects",
    Blog: "blog",
  };

  const filteredLinks = footerConfig.navigationLinks.filter((link) => {
    const visibilityKey = visibilityMap[link.label];
    if (visibilityKey) {
      return visibility[visibilityKey] !== false;
    }
    return true; // Home or other links are always visible
  });

  return (
    <footer className="max-w-screen overflow-x-hidden bg-white dark:bg-zinc-900 rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] border border-zinc-100 dark:border-white/5 shadow-sm">
      <div className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Brand Name */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {footerConfig.displayName}
            </h2>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center gap-6 mb-8">
            {footerConfig.socialLinks.twitter && (
              <a
                href={footerConfig.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter/X"
              >
                <Icons.x className="h-5 w-5" />
              </a>
            )}
            {footerConfig.socialLinks.linkedin && (
              <a
                href={footerConfig.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Icons.linkedin className="h-5 w-5" />
              </a>
            )}
            {footerConfig.socialLinks.instagram && (
              <a
                href={footerConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {footerConfig.socialLinks.github && (
              <a
                href={footerConfig.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Icons.github className="h-5 w-5" />
              </a>
            )}
            {footerConfig.socialLinks.youtube && (
              <a
                href={footerConfig.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm">
            {filteredLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Quote */}
          {footerConfig.quote && (
            <div className="text-center mb-8">
              <blockquote className="text-sm text-muted-foreground italic">
                "{footerConfig.quote.text}" — {footerConfig.quote.author}
              </blockquote>
            </div>
          )}

          {/* Optional RSS and DMCA links */}
          {(footerConfig.showRSS || footerConfig.showDMCA) && (
            <div className="flex justify-center items-center gap-4 pt-4 border-t border-border">
              {footerConfig.showRSS && (
                <a
                  className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  href={`${SITE_INFO.url}/rss`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RssIcon className="size-4 mr-1" />
                  <span className="text-xs">RSS</span>
                </a>
              )}

              {footerConfig.showDMCA && (
                <a
                  className="flex text-muted-foreground transition-colors hover:text-foreground"
                  href={
                    process.env.NEXT_PUBLIC_DMCA_URL ||
                    "https://www.dmca.com/ProtectionPro.aspx"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.dmca className="h-4 w-auto" />
                  <span className="sr-only">DMCA.com Protection Status</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

