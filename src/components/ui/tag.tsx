import React from "react";

import { cn } from "@/lib/utils";

function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100/70 dark:bg-white/[0.06] px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-200/60 dark:hover:bg-white/10 shadow-2xs",
        className
      )}
      {...props}
    />
  );
}

export { Tag };

