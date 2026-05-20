"use client";

import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

export function ProjectShowMore({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && children}

      <div className="flex h-14 items-center justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full px-6 h-9 text-sm font-semibold border-2 border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {isOpen ? "Show Less" : "Show More"}
          <ChevronDownIcon
            className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </>
  );
}

