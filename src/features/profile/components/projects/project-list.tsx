"use client";

import {
  ChevronDownIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  InfinityIcon,
  LinkIcon,
} from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Tag } from "@/components/ui/tag";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";
import { ProjectLogo } from "./project-logo";

import type { Project } from "../../types/projects";

function ProjectItemClient({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(project.isExpanded ?? false);
  const { start, end } = project.period;
  const isOngoing = !end;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.03] transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-white/[0.05] hover:border-zinc-300 dark:hover:border-white/15 hover:shadow-sm">
      <div className="flex items-center gap-2 p-2.5 sm:p-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group/project flex min-w-0 flex-1 items-center gap-3 sm:gap-4 text-left select-none"
          data-state={isOpen ? "open" : "closed"}
        >
          {/* Premium icon container */}
          <div className="relative flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-200 group-hover/project:ring-2 group-hover/project:ring-zinc-300 dark:group-hover/project:ring-white/20 group-hover/project:shadow-md">
            <ProjectLogo src={project.logo} alt={project.title} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="mb-1 leading-snug font-semibold text-balance text-zinc-900 dark:text-white">
              {project.title}
            </h3>

            <dl className="text-sm text-muted-foreground">
              <dt className="sr-only">Period</dt>
              <dd className="flex items-center gap-0.5">
                <span>{start}</span>
                <span className="font-mono">—</span>
                {isOngoing ? (
                  <>
                    <InfinityIcon
                      className="size-4.5 translate-y-[0.5px]"
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
        </button>

        <SimpleTooltip content="Open Project Link">
          <a
            className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10"
            href={addQueryParams(project.link, UTM_PARAMS)}
            target="_blank"
            rel="noopener"
          >
            <LinkIcon className="pointer-events-none size-4" />
            <span className="sr-only">Open Project Link</span>
          </a>
        </SimpleTooltip>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10 [&_svg]:size-4"
          aria-label={isOpen ? "Collapse project details" : "Expand project details"}
        >
          {isOpen ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-zinc-200 dark:border-white/10 px-4 sm:px-5 pb-4 sm:pb-5">
          {project.description && (
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a className="text-primary hover:underline" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto" {...props} />
                  ),
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          )}

          {project.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Tag>{skill}</Tag>
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

