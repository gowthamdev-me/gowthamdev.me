import dayjs from "dayjs";

import { CollapsibleList } from "@/components/collapsible-list";

import { AWARDS } from "../../data/awards";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { AwardItem } from "./award-item";

const SORTED_AWARDS = [...AWARDS].sort((a, b) => {
  return dayjs(b.date).diff(dayjs(a.date));
});

export function Awards() {
  return (
    <Panel id="awards">
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Honors & Awards
              <sup className="ml-2 text-sm font-mono text-muted-foreground/60 select-none">
                {AWARDS.length}
              </sup>
            </PanelTitle>
          </div>

          <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[16px] bg-zinc-100 text-xs sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10">
            Prizes
          </div>
        </div>
      </PanelHeader>

      <CollapsibleList
        items={SORTED_AWARDS}
        max={8}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <AwardItem award={item} />}
      />
    </Panel>
  );
}

