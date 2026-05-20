import React from "react";

import { readJsonFile } from "@/lib/admin-data";
import { SOCIAL_LINKS } from "../../data/social-links";
import type { SocialLink } from "../../types/social-links";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel";
import { SocialLinkItem } from "./social-link-item";

function getVisibleSocialLinks(): SocialLink[] {
  try {
    const adminLinks = readJsonFile<any[]>("social-links.json", []);
    if (adminLinks.length === 0) return SOCIAL_LINKS;

    // Filter only links that should be shown in portfolio
    return adminLinks
      .filter((link: any) => link.showInPortfolio !== false)
      .map((link: any) => ({
        icon: link.icon || "",
        title: link.title || "",
        description: link.description,
        href: link.href || "",
      }));
  } catch {
    return SOCIAL_LINKS;
  }
}

export function SocialLinks() {
  const links = getVisibleSocialLinks();

  if (links.length === 0) {
    return null;
  }

  return (
    <Panel>
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Social Links
              <sup className="ml-2 text-sm font-mono text-muted-foreground/60 select-none">
                {links.length}
              </sup>
            </PanelTitle>
          </div>

          <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[16px] bg-zinc-100 text-xs sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10">
            Connect
          </div>
        </div>
      </PanelHeader>

      <PanelContent className="p-4 sm:p-6 md:p-8 bg-transparent dark:bg-white/[0.02]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {links.map((link, index) => {
            return <SocialLinkItem key={index} {...link} />;
          })}
        </div>
      </PanelContent>
    </Panel>
  );
}
