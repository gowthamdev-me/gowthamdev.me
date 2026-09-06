import { CollapsibleList } from "@/components/collapsible-list";

import { CERTIFICATIONS } from "../../data/certifications";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";

export function Certifications() {
  return (
    <Panel id="certs">
      <PanelHeader className="px-5 sm:px-8 md:px-10 py-5 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <PanelTitle className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Certifications
            </PanelTitle>
          </div>

          <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[16px] bg-zinc-100 text-xs sm:text-sm font-semibold text-muted-foreground border border-zinc-200 dark:bg-white/5 dark:border-white/10">
            Skills
          </div>
        </div>
      </PanelHeader>

      <CollapsibleList
        items={CERTIFICATIONS}
        max={8}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  );
}

