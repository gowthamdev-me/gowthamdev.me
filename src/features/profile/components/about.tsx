import { Markdown } from "@/components/markdown";
import { Prose } from "@/components/ui/typography";
import { USER } from "@/data/user";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <div className="flex">
          <div className="flex-1 border-r border-edge pr-6">
            <PanelTitle>About</PanelTitle>
          </div>
          <div className="w-24 pl-6 flex items-center justify-center text-sm text-muted-foreground">
            <span>Info</span>
          </div>
        </div>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  );
}

