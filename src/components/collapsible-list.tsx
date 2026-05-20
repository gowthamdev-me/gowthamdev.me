import { ChevronDownIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Slot = SlotPrimitive.Slot;

export function CollapsibleList<T>({
  items,
  max = 3,

  keyExtractor,
  renderItem,
}: {
  items: T[];
  max?: number;

  keyExtractor?: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <Collapsible>
      {items.slice(0, max).map((award, index) => (
        <Slot
          key={typeof keyExtractor === "function" ? keyExtractor(award) : index}
          className="border-b border-edge"
        >
          {renderItem(award)}
        </Slot>
      ))}

      <CollapsibleContent>
        {items.slice(max).map((award, index) => (
          <Slot
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(award)
                : max + index
            }
            className="border-b border-edge"
          >
            {renderItem(award)}
          </Slot>
        ))}
      </CollapsibleContent>

      {items.length > max && (
        <div className="flex h-14 items-center justify-center pb-px">
          <CollapsibleTrigger asChild>
            <Button
              className="group/collapsible-trigger flex rounded-full px-6 h-9 text-sm font-semibold gap-2 border-2 border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
              variant="ghost"
            >
              <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
                Show More
              </span>

              <span className="hidden group-data-[state=open]/collapsible-trigger:block">
                Show Less
              </span>

              <ChevronDownIcon
                className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible-trigger:rotate-180"
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  );
}

