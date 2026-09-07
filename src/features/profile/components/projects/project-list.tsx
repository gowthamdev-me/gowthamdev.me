"use client";

import {
  ChevronDownIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  InfinityIcon,
  LinkIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Tag } from "@/components/ui/tag";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";
import { ProjectLogo } from "./project-logo";

import type { Project } from "../../types/projects";

function normalizeUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  return `https://${trimmed}`;
}

function ProjectItemClient({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(project.isExpanded ?? false);
  const { start, end } = project.period;
  const isOngoing = !end;
  const validUrl = normalizeUrl(project.link);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.03] transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] hover:border-zinc-300 dark:hover:border-white/15 hover:shadow-xs overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="group/project flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3.5 text-left select-none cursor-pointer outline-none"
          data-state={isOpen ? "open" : "closed"}
        >
          {/* Project icon container */}
          <div className="relative flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 shadow-xs ring-1 ring-black/5 dark:ring-white/5 transition-all duration-200 group-hover/project:ring-2 group-hover/project:ring-zinc-300 dark:group-hover/project:ring-white/20">
            <ProjectLogo src={project.logo} alt={project.title} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[13.5px] sm:text-base font-bold text-zinc-900 dark:text-white truncate leading-snug">
              {project.title}
            </h3>

            <dl className="text-[11.5px] sm:text-xs text-muted-foreground mt-0.5">
              <dt className="sr-only">Period</dt>
              <dd className="flex items-center gap-0.5">
                <span>{start}</span>
                <span className="font-mono">—</span>
                {isOngoing ? (
                  <>
                    <InfinityIcon
                      className="size-3.5 sm:size-4 translate-y-[0.5px]"
                      aria-hidden
                    />
                    <span className="sr-only">Present</span>
                  </>
                ) : (
                  <span>{end}</span>
                )}
              </dd>
            </dl>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {validUrl && (
            <SimpleTooltip content="Open Project Link">
              <a
                className="relative flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-white/10 transition-colors"
                href={addQueryParams(validUrl, UTM_PARAMS)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon className="pointer-events-none size-3.5 sm:size-4" />
                <span className="sr-only">Open Project Link</span>
              </a>
            </SimpleTooltip>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "Collapse project details" : "Expand project details"}
          >
            {isOpen ? (
              <ChevronsDownUpIcon className="size-3.5 sm:size-4" />
            ) : (
              <ChevronsUpDownIcon className="size-3.5 sm:size-4" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 border-t border-zinc-200/80 dark:border-white/10 px-3.5 sm:px-5 py-3 sm:py-4 bg-zinc-50/50 dark:bg-white/[0.01]">
          {project.description && (
            <div className="prose prose-sm dark:prose-invert max-w-none !font-sans text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-medium [&_p]:my-1.5 [&_p]:leading-relaxed [&_ul]:my-2 [&_ul]:pl-4 [&_ul]:space-y-1 [&_li]:my-0.5 [&_li]:leading-relaxed text-left break-words">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a className="text-primary hover:underline" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto rounded-lg" {...props} />
                  ),
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          )}

          {project.skills && project.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {project.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Tag className="text-[11px] sm:text-xs px-2 py-0.5">{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectList({
  projects,
  maxVisible,
}: {
  projects: Project[];
  maxVisible: number;
}) {
  const [showAll, setShowAll] = useState(false);

  const displayedProjects = showAll ? projects : projects.slice(0, maxVisible);
  const hasMore = projects.length > maxVisible;

  return (
    <div className="p-3 sm:p-4 md:p-5 space-y-2.5 sm:space-y-3">
      {displayedProjects.map((project) => (
        <ProjectItemClient key={project.id} project={project} />
      ))}

      {hasMore && (
        <div className="flex h-14 items-center justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 rounded-full px-6 h-9 text-sm font-semibold border-2 border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {showAll ? "Show Less" : "Show More"}
            <ChevronDownIcon
              className={`size-4 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

