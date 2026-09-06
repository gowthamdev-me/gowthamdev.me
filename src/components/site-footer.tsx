import { RssIcon, Mail } from "lucide-react";

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

  const linksConfig = footerConfig.socialLinks as any;

  let adminSocialLinks: any[] = [];
  try {
    adminSocialLinks = readJsonFile<any[]>("social-links.json", []);
  } catch (error) {
    // Keep it empty, fallback to config
  }

  const getSocialUrl = (platform: string, fallback: string) => {
    const link = adminSocialLinks.find(
      (l: any) =>
        l.platform?.toLowerCase() === platform.toLowerCase() ||
        l.title?.toLowerCase() === platform.toLowerCase()
    );
    return link?.href || fallback;
  };

  const socialLinks = [
    linksConfig.twitter && {
      href: getSocialUrl("twitter", getSocialUrl("x", linksConfig.twitter)),
      label: "X / Twitter",
      icon: <Icons.x className="h-4 w-4" />,
    },
    linksConfig.github && {
      href: getSocialUrl("github", linksConfig.github),
      label: "GitHub",
      icon: <Icons.github className="h-4 w-4" />,
    },
    linksConfig.linkedin && {
      href: getSocialUrl("linkedin", linksConfig.linkedin),
      label: "LinkedIn",
      icon: <Icons.linkedin className="h-4 w-4" />,
    },
    linksConfig.instagram && {
      href: getSocialUrl("instagram", linksConfig.instagram),
      label: "Instagram",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    linksConfig.youtube && {
      href: getSocialUrl("youtube", linksConfig.youtube),
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
    <footer className="relative w-full rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] border border-border bg-card overflow-hidden">
      <div className="relative px-6 sm:px-10 py-6 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Brand name + copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <h2
            className="text-2xl font-bold inline-flex items-center tracking-normal select-none"
            style={{ fontFamily: "'JapanDaisuki', serif" }}
          >
            <span
              style={{
                color: "#FA0143",
                textShadow: "0 0 20px rgba(250, 1, 67, 0.5)",
              }}
            >
              G
            </span>
            <span className="text-zinc-900 dark:text-zinc-50">owtham</span>
          </h2>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            &copy; {year} Gowtham. All rights reserved.
          </p>
        </div>

        {/* Right: Nav Links + Socials */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {filteredLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 uppercase tracking-widest transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
