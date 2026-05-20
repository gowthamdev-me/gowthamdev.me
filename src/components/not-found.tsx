import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[calc(100svh-5.5rem)] flex-col items-center justify-center",
        className
      )}
    >
      <div
        className="select-none"
        style={{
          fontFamily: "'JapanDaisuki', 'Georgia', serif",
          fontSize: "8rem",
          lineHeight: 1,
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "2px var(--foreground)",
          letterSpacing: "-0.02em",
        }}
      >
        G
      </div>

      <h1
        className="mt-8 mb-6 text-7xl font-medium"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: "0.1em",
        }}
      >
        404
      </h1>

      <Link
        href="/"
        className="flex items-center gap-2 rounded-full px-6 h-9 text-sm font-semibold border-2 border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Go to Home
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}

