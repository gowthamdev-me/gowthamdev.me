import { Slot as SlotPrimitive } from "radix-ui";
import React from "react";

const Slot = SlotPrimitive.Slot;

import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] border border-border bg-card text-card-foreground overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "px-4 sm:px-8 md:px-10 py-3.5 sm:py-6 border-b border-zinc-100 dark:border-white/5 bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "h2";

  return (
    <Comp
      data-slot="panel-title"
      className={cn(
        "text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white py-0.5 whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-body"
      className={cn(
        "p-4 sm:p-8 md:p-10 bg-transparent dark:bg-white/[0.02]",
        className
      )}
      {...props}
    />
  );
}

export { Panel, PanelContent, PanelHeader, PanelTitle };

