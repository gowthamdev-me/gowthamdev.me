import { Slot as SlotPrimitive } from "radix-ui";
import React from "react";

const Slot = SlotPrimitive.Slot;

import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] border border-[rgb(179,179,179)] dark:border-white/5 bg-transparent dark:bg-zinc-900 text-[rgb(43,43,43)] dark:text-inherit shadow-xl overflow-hidden",
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
        "px-8 py-6 sm:px-10 sm:py-8 border-b border-zinc-100 dark:border-white/5 bg-[rgb(255,255,255)] dark:bg-transparent",
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
      className={cn("text-4xl font-semibold py-1", className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-body"
      className={cn(
        "p-8 sm:p-10 bg-transparent dark:bg-white/[0.02]",
        className
      )}
      {...props}
    />
  );
}

export { Panel, PanelContent, PanelHeader, PanelTitle };

