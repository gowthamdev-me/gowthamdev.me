import React from "react";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SOURCE_CODE_GITHUB_URL } from "@/config/site";

export function NavItemGitHub() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 hover:from-zinc-200 hover:to-zinc-300 dark:hover:from-zinc-700 dark:hover:to-zinc-800 border border-zinc-200/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200" 
      asChild
    >
      <a href={SOURCE_CODE_GITHUB_URL} target="_blank" rel="noopener">
        <Github className="w-4 sm:w-5 h-4 sm:h-5" />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
  );
}

