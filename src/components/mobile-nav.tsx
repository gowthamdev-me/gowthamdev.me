"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";
import { SearchIcon } from "@/components/ui/search";
import {
  UserIcon,
  Code2Icon,
  FolderGit2Icon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const NAV_SECTION_ITEMS = [
  { title: "About", href: "/#about", icon: UserIcon },
  { title: "Tech Stack", href: "/#stack", icon: Code2Icon },
  { title: "Projects", href: "/#projects", icon: FolderGit2Icon },
];

export function MobileNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // Close when user presses Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenSearch = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-menu"));
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Toggle Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "relative w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/50 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-200 focus:outline-none",
          className
        )}
      >
        {open ? (
          <XIcon className="w-4.5 h-4.5 transition-transform duration-200" />
        ) : (
          <MenuIcon className="w-4.5 h-4.5 transition-transform duration-200" />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop for closing when tapping outside */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[1px] md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Perfectly centered mobile menu dropdown matching header boundaries */}
          <div
            className="absolute top-[calc(100%+8px)] inset-x-0 z-50 p-1.5 sm:p-2 rounded-2xl bg-white/95 dark:bg-[#141416]/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 dark:ring-1 dark:ring-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] md:hidden animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {/* Search option in menu */}
            <button
              type="button"
              onClick={handleOpenSearch}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer bg-zinc-100/90 dark:bg-white/[0.08] hover:bg-zinc-200/80 dark:hover:bg-white/15 text-zinc-900 dark:text-zinc-100 font-semibold mb-1 transition-colors text-left"
            >
              <SearchIcon size={16} className="text-[#FA0143] shrink-0" />
              <span className="text-xs sm:text-sm">Search...</span>
              <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                ⌘K
              </kbd>
            </button>

            <div className="my-1.5 h-px bg-zinc-200/60 dark:bg-white/10" />

            {/* Section links */}
            <div className="space-y-0.5">
              {NAV_SECTION_ITEMS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
