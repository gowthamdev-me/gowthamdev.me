import React from "react";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { readJsonFile } from "@/lib/admin-data";

export function NavItemGitHub() {
  let githubUrl = SOURCE_CODE_GITHUB_URL;

  try {
    const adminLinks = readJsonFile<any[]>("social-links.json", []);
    const githubLink = adminLinks.find(
      (link: any) =>
        link.platform?.toLowerCase() === "github" ||
        link.title?.toLowerCase() === "github"
    );
    if (githubLink && githubLink.href) {
      githubUrl = githubLink.href;
    }
  } catch (error) {
    // Fallback to default config
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="GitHub Repository"
      className="relative w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 hover:from-zinc-200 hover:to-zinc-300 dark:hover:from-zinc-700 dark:hover:to-zinc-800 border border-zinc-200/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200" 
      asChild
    >
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
        <Github className="w-4 sm:w-5 h-4 sm:h-5" />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
  );
}

