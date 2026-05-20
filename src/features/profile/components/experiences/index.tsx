import React from "react";

import { readJsonFile } from "@/lib/admin-data";

import { EXPERIENCES } from "../../data/experiences";
import type { Experience } from "../../types/experiences";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ExperienceItem } from "./experience-item";

function getVisibleExperiences(): Experience[] {
  try {
    const adminExperiences = readJsonFile<any[]>("experiences.json", []);
    if (adminExperiences.length === 0) return EXPERIENCES;

    const visibilityMap = new Map<string, boolean>();
    adminExperiences.forEach((item: any) => {
      visibilityMap.set(item.id, item.showInPortfolio !== false);
    });

    return EXPERIENCES.filter((experience) => {
      const visible = visibilityMap.get(experience.id);
      return visible === undefined ? true : visible;
    });
  } catch {
    return EXPERIENCES;
  }
}

export function Experiences() {
  const experiences = getVisibleExperiences();

  if (experiences.length === 0) {
    return null;
  }

  return (
    <Panel id="experience">
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Experience
            </PanelTitle>
          </div>

          <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[16px] bg-zinc-100 text-xs sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10">
            Journey
          </div>
        </div>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {experiences.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  );
}

