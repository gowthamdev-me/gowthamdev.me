import Image from "next/image";
import React from "react";

import { SimpleTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { readJsonFile } from "@/lib/admin-data";

import { TECH_STACK } from "../data/tech-stack";
import type { TechStack } from "../types/tech-stack";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

function getVisibleTechStack(): TechStack[] {
  try {
    const adminData = readJsonFile<any[]>("tech-stack.json", []);
    if (adminData.length === 0) return TECH_STACK;

    const visibleKeys = new Set(
      adminData
        .filter((item: any) => item.showInPortfolio !== false)
        .map((item: any) => item.key)
    );

    return TECH_STACK.filter((tech) => visibleKeys.has(tech.key));
  } catch {
    return TECH_STACK;
  }
}

export function TeckStack() {
  const visibleTechStack = getVisibleTechStack();

  if (visibleTechStack.length === 0) {
    return null;
  }

  return (
    <Panel id="stack">
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Stack
            </PanelTitle>
          </div>

          <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[16px] bg-zinc-100 text-xs sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10">
            Tech
          </div>
        </div>
      </PanelHeader>

      <PanelContent
        className={cn(
          "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
          "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
          "bg-zinc-950/0.75 dark:bg-white/0.75"
        )}
      >
        <ul className="flex flex-wrap gap-4 select-none">
          {visibleTechStack.map((tech) => {
            return (
              <li key={tech.key} className="flex">
                <SimpleTooltip content={tech.title}>
                  <a
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tech.title}
                  >
                    {tech.theme ? (
                      <>
                        <Image
                          src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-light.svg`}
                          alt={`${tech.title} light icon`}
                          width={32}
                          height={32}
                          className="hidden [html.light_&]:block"
                          unoptimized
                        />
                        <Image
                          src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-dark.svg`}
                          alt={`${tech.title} dark icon`}
                          width={32}
                          height={32}
                          className="hidden [html.dark_&]:block"
                          unoptimized
                        />
                      </>
                    ) : (
                      <Image
                        src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}.svg`}
                        alt={`${tech.title} icon`}
                        width={32}
                        height={32}
                        unoptimized
                      />
                    )}
                    <span className="sr-only">{tech.title}</span>
                  </a>
                </SimpleTooltip>
              </li>
            );
          })}
        </ul>
      </PanelContent>
    </Panel>
  );
}

