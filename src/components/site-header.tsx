import dynamic from "next/dynamic";
import Link from "next/link";

import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { NavItemGitHub } from "@/components/nav-item-github";
import { ToggleTheme } from "@/components/toggle-theme";
import { MAIN_NAV } from "@/config/site";
import { getAllPosts } from "@/data/blog";
import { cn } from "@/lib/utils";

import { SiteHeaderMark } from "./site-header-mark";
import { SiteHeaderWrapper } from "./site-header-wrapper";

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
);

const CommandMenu = dynamic(() =>
  import("@/components/command-menu").then((mod) => mod.CommandMenu)
);

export function SiteHeader() {
  const posts = getAllPosts();

  return (
    <SiteHeaderWrapper
      className={cn(
        "relative w-full bg-white/90 dark:bg-[#141416]/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[#141416]/90",
        "border border-zinc-200/90 dark:border-zinc-800/90 dark:ring-1 dark:ring-white/[0.08] rounded-2xl sm:rounded-[22px] md:rounded-[26px]",
        "transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.12)_inset]"
      )}
    >
      <div className="mx-auto px-3 sm:px-4 md:px-5">
        <div className="flex h-11 sm:h-12 md:h-13 items-center justify-between gap-2">
          {/* Logo on the left */}
          <div className="flex-shrink-0 z-10">
            <BrandContextMenu>
              <Link href="/" aria-label="Home" className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 hover:bg-zinc-100/80 dark:hover:bg-white/[0.08] active:scale-95">
                <SiteHeaderMark />
              </Link>
            </BrandContextMenu>
          </div>

          {/* Center Navigation - Perfectly centered geometrically */}
          {MAIN_NAV.length > 0 && (
            <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center justify-center pointer-events-auto">
              <DesktopNav items={MAIN_NAV} />
            </div>
          )}

          {/* Action buttons on the right */}
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 z-10">
            <CommandMenu posts={posts} />
            <NavItemGitHub />
            <ToggleTheme />
            <MobileNav className="md:hidden" items={MAIN_NAV} />
          </div>
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}

