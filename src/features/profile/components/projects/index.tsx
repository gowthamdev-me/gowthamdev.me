import { readJsonFile } from "@/lib/admin-data";

import { PROJECTS } from "../../data/projects";
import type { Project } from "../../types/projects";
import { ProjectList } from "./project-list";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel";

function parsePeriod(period: string): { start: string; end?: string } {
  const parts = period.split(/\s*-\s*/);
  return { start: parts[0]?.trim() ?? "", end: parts[1]?.trim() || undefined };
}

function adminToProject(adminProject: any, fallback?: Project): Project {
  const skills: string[] =
    typeof adminProject.skills === "string"
      ? adminProject.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(adminProject.skills)
      ? adminProject.skills
      : fallback?.skills ?? [];

  const period =
    typeof adminProject.period === "string" && adminProject.period.trim()
      ? parsePeriod(adminProject.period)
      : fallback?.period ?? { start: "" };

  return {
    id: adminProject.id ?? fallback?.id ?? "",
    title: adminProject.title || fallback?.title || "",
    description: adminProject.description || fallback?.description,
    link: adminProject.link || fallback?.link || "",
    logo: adminProject.logo || fallback?.logo,
    skills,
    period,
    isExpanded: fallback?.isExpanded,
  };
}

function getVisibleProjects(): Project[] {
  try {
    const adminProjects = readJsonFile<any[] | null>("projects.json", null);
    if (adminProjects !== null && Array.isArray(adminProjects)) {
      const fallbackMap = new Map(PROJECTS.map((p) => [p.id, p]));
      return adminProjects
        .filter((p: any) => p.showInPortfolio !== false)
        .map((p: any, index: number) => {
          const proj = adminToProject(p, fallbackMap.get(p.id));
          proj.isExpanded = index === 0;
          return proj;
        });
    }

    return PROJECTS.map((p, index) => ({ ...p, isExpanded: index === 0 }));
  } catch {
    return PROJECTS.map((p, index) => ({ ...p, isExpanded: index === 0 }));
  }
}


export function Projects() {
  const projects = getVisibleProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <Panel id="projects">
      <PanelHeader className="px-4 sm:px-8 md:px-10 py-3.5 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <PanelTitle className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight whitespace-nowrap">
            Projects
          </PanelTitle>

          <div className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-[10px] sm:rounded-[16px] bg-zinc-100 text-[11px] sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10 uppercase tracking-wider shrink-0">
            Work
          </div>
        </div>
      </PanelHeader>

      <PanelContent className="p-0 sm:p-0">
        <ProjectList projects={projects} maxVisible={3} />
      </PanelContent>
    </Panel>
  );
}

