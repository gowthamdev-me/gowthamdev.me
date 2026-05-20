import React from "react";

import { USER } from "@/data/user";
import { readJsonFile } from "@/lib/admin-data";

import { Panel } from "./panel";

type ProfileData = {
  about?: string;
};

function getAboutContent() {
  try {
    const profile = readJsonFile<ProfileData>("profile.json", {
      about: USER.about,
    });

    const about = profile.about?.trim();
    return about && about.length > 0 ? about : USER.about.trim();
  } catch {
    return USER.about.trim();
  }
}

export function AboutMe() {
  const content = getAboutContent();
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <Panel>
      <div className="px-5 sm:px-8 md:px-10 py-5 sm:py-7 border-b border-zinc-100 dark:border-white/5 bg-[rgb(255,255,255)] dark:bg-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight py-1">
              About Me
            </h2>
          </div>

          <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[16px] bg-zinc-100 text-xs sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10 uppercase tracking-wider">
            Info
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 md:px-12 py-5 sm:py-8 space-y-4 sm:space-y-5">
        {paragraphs.map((paragraph, index) => {
          return (
            <p
              key={index}
              className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
            >
              {paragraph}
            </p>
          );
        })}
      </div>
    </Panel>
  );
}

