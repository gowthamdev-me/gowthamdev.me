import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "gowthamdotcom",
    title: "gowthamdev.me",
    period: {
      start: "01.2026",
    },
    link: "https://github.com/gowtham/gowtham.com",
    skills: [
      "Open Source",
      "Next.js 15",
      "Tailwind CSS v4",
      "Radix UI",
      "Motion",
      "shadcn/ui",
      "Component Registry",
      "Vercel",
    ],
    description: `A minimal portfolio, component registry, and blog.
- Clean & modern design
- Light & Dark theme support
- vCard integration
- SEO optimization: [JSON-LD schema](https://json-ld.org), sitemap, robots
- AI-friendly [/llms.txt](https://llmstxt.org)
- Spam-protected email
- Installable PWA

Blog Features:
- MDX & Markdown support
- Syntax Highlighting for better readability
- RSS Feed for easy content distribution
- Dynamic OG Images for rich previews`,
    logo: "/uploads/1788087032723-Untitled-1__1_.png",
    isExpanded: true,
  },
];
