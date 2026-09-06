"use client";

import { useTheme } from "next-themes";
import React, { useCallback } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useClickSound } from "@/hooks/use-click-sound";
import { useMetaColor } from "@/hooks/use-meta-color";
import { SunIcon } from "@/components/ui/sun";
import { MoonIcon } from "@/components/ui/moon";

import { Button } from "./ui/button";

export function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  const { setMetaColor } = useMetaColor();

  const playClick = useClickSound();

  const handleToggle = useCallback(() => {
    playClick();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor, playClick]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Toggle theme"
      className="relative w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 hover:from-zinc-200 hover:to-zinc-300 dark:hover:from-zinc-700 dark:hover:to-zinc-800 border border-zinc-200/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center" 
      onClick={handleToggle}
    >
      <MoonIcon size={18} className="hidden dark:block" />
      <SunIcon size={18} className="block dark:hidden" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}

