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
        "w-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-900/70",
        "border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl sm:rounded-3xl",
        "transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)]"
      )}
    >
      <div className="mx-auto px-2 sm:px-5 md:px-6">
        <div className="flex h-12 sm:h-14 items-center">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <BrandContextMenu>
              <Link href="/" aria-label="Home" className="flex items-center justify-center w-9 sm:w-11 h-9 sm:h-11 rounded-lg transition-colors duration-200 hover:bg-zinc-100/80 dark:hover:bg-white/[0.06]">
                <SiteHeaderMark />
              </Link>
            </BrandContextMenu>
          </div>

          {/* Center Navigation */}
          <div className="flex-1 flex items-center justify-center">
            <DesktopNav items={MAIN_NAV} />
          </div>

          {/* Action buttons on the right */}
          <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1">
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

