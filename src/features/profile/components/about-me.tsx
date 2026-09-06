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
      <div className="px-4 sm:px-8 md:px-10 py-3.5 sm:py-6 border-b border-zinc-100 dark:border-white/5 bg-transparent">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white py-0.5 whitespace-nowrap">
            About Me
          </h2>

          <div className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-[10px] sm:rounded-[16px] bg-zinc-100 text-[11px] sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10 uppercase tracking-wider shrink-0">
            Info
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-12 py-4 sm:py-7 space-y-4 sm:space-y-5">
        {paragraphs.map((paragraph, index) => {
          return (
            <p
              key={index}
              className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-left break-words"
            >
              {paragraph}
            </p>
          );
        })}
      </div>
    </Panel>
  );
}

