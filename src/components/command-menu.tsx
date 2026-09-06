"use client";

import { useCommandState } from "cmdk";
import type { LucideProps } from "lucide-react";
import {
  BriefcaseBusinessIcon,
  CircleUserIcon,
  CornerDownLeftIcon,
  HomeIcon,
  LetterTextIcon,
  MoonStarIcon,
  RssIcon,
  SunIcon,
  TextIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SOCIAL_LINKS } from "@/features/profile/data/social-links";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/blog";
import { copyText } from "@/utils/copy";

import { SearchIcon } from "@/components/ui/search";
import { Icons } from "./icons";
import { SocialIcon } from "./social-icon";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type CommandLinkItem = {
  title: string;
  href: string;

  icon?: React.ComponentType<LucideProps>;
  iconImage?: string;
  isSocial?: boolean;
  keywords?: string[];
  openInNewTab?: boolean;
};

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Portfolio",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: RssIcon,
  },
];

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "About",
    href: "/#about",
    icon: LetterTextIcon,
  },
  {
    title: "Tech Stack",
    href: "/#stack",
    icon: Icons.ts,
  },
  {
    title: "Projects",
    href: "/#projects",
    icon: Icons.project,
  },
];

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  iconImage: item.icon,
  isSocial: true,
  openInNewTab: true,
}));

export function CommandMenu({ posts }: { posts: Post[] }) {
  const router = useRouter();

  const { setTheme, resolvedTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [socialItems, setSocialItems] = useState<CommandLinkItem[]>(SOCIAL_LINK_ITEMS);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        // Use the public /api/content endpoint — no auth required
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          const links = data?.socialLinks;
          if (Array.isArray(links) && links.length > 0) {
            const formatted = links
              .filter((link: any) => link.showInPortfolio !== false)
              .map((link: any) => ({
                title: link.title || link.platform || "",
                href: link.href || link.url || "",
                iconImage: link.icon || "",
                isSocial: true,
                openInNewTab: true,
              }));
            if (formatted.length > 0) {
              setSocialItems(formatted);
            }
          }
        }
      } catch {}
    }
    fetchSocialLinks();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
          if (
            (e.target instanceof HTMLElement && e.target.isContentEditable) ||
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
          ) {
            return;
          }

          e.preventDefault();
          setOpen((open) => !open);
        }
      },
      { signal }
    );

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const handleCustomOpen = () => setOpen(true);
    window.addEventListener("open-command-menu", handleCustomOpen);
    return () => window.removeEventListener("open-command-menu", handleCustomOpen);
  }, []);

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false);

      if (openInNewTab) {
        window.open(href, "_blank", "noopener");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const handleCopyText = useCallback((text: string, message: string) => {
    setOpen(false);
    copyText(text);
    toast.success(message);
  }, []);

  const handleThemeChange = useCallback(
    (theme: "light" | "dark" | "system") => {
      setOpen(false);
      setTheme(theme);
    },
    [setTheme]
  );

  const { blogLinks } = useMemo(
    () => ({
      blogLinks: posts
        .filter((post) => post.metadata?.category !== "components")
        .map(postToCommandLinkItem),
    }),
    [posts]
  );

  return (
    <>
      <Button
        variant="secondary"
        aria-label="Search site"
        className={cn(
          /* Hidden on mobile, visible on sm+ */
          "hidden sm:inline-flex items-center justify-center h-9 w-9 sm:h-9 sm:w-auto sm:gap-1.5 sm:rounded-full sm:px-2.5",
          "rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900",
          "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50",
          "border border-zinc-200/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200",
          "select-none"
        )}
        onClick={() => setOpen(true)}
      >
        <SearchIcon size={16} />

        <span className="font-sans text-sm/4 font-medium hidden sm:inline text-muted-foreground">
          Search
        </span>

        <CommandMenuKbd className="hidden tracking-wider sm:in-[.os-macos_&]:flex">
          ⌘K
        </CommandMenuKbd>
        <CommandMenuKbd className="hidden sm:not-[.os-macos_&]:flex">
          Ctrl K
        </CommandMenuKbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />

        <CommandList className="sm:min-h-80">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Theme switcher — top for quick access on mobile */}
          <CommandGroup heading="Theme">
            <CommandItem
              keywords={["theme"]}
              onSelect={() => handleThemeChange("light")}
            >
              <SunIcon />
              Light
            </CommandItem>
            <CommandItem
              keywords={["theme"]}
              onSelect={() => handleThemeChange("dark")}
            >
              <MoonStarIcon />
              Dark
            </CommandItem>
            <CommandItem
              keywords={["theme"]}
              onSelect={() => handleThemeChange("system")}
            >
              <Icons.contrast />
              Auto
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandLinkGroup
            heading="Navigate"
            links={PORTFOLIO_LINKS}
            onLinkSelect={handleOpenLink}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Social Links"
            links={socialItems}
            onLinkSelect={handleOpenLink}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Blog"
            links={blogLinks}
            fallbackIcon={TextIcon}
            onLinkSelect={handleOpenLink}
          />
        </CommandList>

        <CommandMenuFooter />
      </CommandDialog>
    </>
  );
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkSelect,
}: {
  heading: string;
  links: CommandLinkItem[];
  fallbackIcon?: React.ComponentType<LucideProps>;
  onLinkSelect: (href: string, openInNewTab?: boolean) => void;
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const Icon = link?.icon ?? fallbackIcon ?? React.Fragment;

        return (
          <CommandItem
            key={link.href}
            keywords={link.keywords}
            onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
          >
            {link?.isSocial || link?.iconImage ? (
              <SocialIcon
                title={link.title}
                iconUrl={link.iconImage}
                size={16}
                className="size-4 shrink-0"
              />
            ) : (
              <Icon />
            )}
            {link.title}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

type CommandKind = "command" | "page" | "link";

type CommandMetaMap = Map<
  string,
  {
    commandKind: CommandKind;
  }
>;

function buildCommandMetaMap() {
  const commandMetaMap: CommandMetaMap = new Map();


  commandMetaMap.set("Light", { commandKind: "command" });
  commandMetaMap.set("Dark", { commandKind: "command" });
  commandMetaMap.set("Auto", { commandKind: "command" });

  SOCIAL_LINK_ITEMS.forEach((item) => {
    commandMetaMap.set(item.title, {
      commandKind: "link",
    });
  });

  return commandMetaMap;
}

const COMMAND_META_MAP = buildCommandMetaMap();

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: "Run Command",
  page: "Go to Page",
  link: "Open Link",
};

function CommandMenuFooter() {
  const selectedCommandKind = useCommandState(
    (state) => COMMAND_META_MAP.get(state.value)?.commandKind ?? "page"
  );

  return (
    <>
      <div className="hidden sm:flex h-10" />

      <div className="hidden sm:flex absolute inset-x-0 bottom-0 h-10 items-center justify-between gap-2 border-t bg-zinc-100/30 px-4 text-xs font-medium dark:bg-zinc-800/30">
        <span
          className="text-muted-foreground text-lg font-bold leading-none select-none"
          style={{ fontFamily: "'JapanDaisuki', serif", letterSpacing: "0.01em" }}
        >
          <span style={{ color: "#FA0143" }}>G</span>owtham
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <span>{ENTER_ACTION_LABELS[selectedCommandKind]}</span>
          <CommandMenuKbd>
            <CornerDownLeftIcon />
          </CommandMenuKbd>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <span className="text-muted-foreground">Exit</span>
          <CommandMenuKbd>Esc</CommandMenuKbd>
        </div>
      </div>
    </>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 min-w-6 items-center justify-center gap-1 rounded-sm bg-black/5 px-1 font-sans text-[13px] font-normal text-muted-foreground shadow-[inset_0_-1px_2px] shadow-black/10 select-none dark:bg-white/10 dark:shadow-white/10 dark:text-shadow-xs [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

function postToCommandLinkItem(post: Post): CommandLinkItem {
  return {
    title: post.metadata.title,
    href: `/blog/${post.slug}`,
    keywords: post.metadata?.category === "components" ? ["component"] : undefined,
  };
}

