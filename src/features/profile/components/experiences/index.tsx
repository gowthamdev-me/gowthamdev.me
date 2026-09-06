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

    const existingMap = new Map(EXPERIENCES.map((e) => [String(e.id), e]));
    return adminExperiences
      .filter((item: any) => item.showInPortfolio !== false)
      .map((item: any) => {
        const existing = existingMap.get(String(item.id));
        if (existing) return existing;
        return {
          id: String(item.id),
          companyName: item.companyName,
          companyLogo: item.companyLogo,
          isCurrentEmployer: item.isCurrentEmployer,
          positions: [
            {
              id: `${item.id}-pos`,
              title: item.position || "",
              employmentPeriod: { start: item.period || "" },
              employmentType: item.employmentType,
              description: item.description,
              skills: item.skills ? item.skills.split(",").map((s: string) => s.trim()) : [],
            },
          ],
        };
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
            <PanelTitle className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
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

