"use client";

import { MailIcon, ArrowUpRight, Sparkles } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { decodeEmail } from "@/utils/string";

export function EmailItem({ email }: { email: string }) {
  const isClient = useIsClient();
  const emailDecoded = decodeEmail(email);

  return (
    <div className="relative group mt-5 mb-2">
      <a
        href={isClient ? `mailto:${emailDecoded}` : "#"}
        className="relative flex items-center justify-between w-full p-3 sm:p-4 bg-gradient-to-r from-zinc-100/50 to-zinc-50 dark:from-[#222526]/50 dark:to-[#222526]/80 rounded-[20px] border border-border transition-all duration-300 hover:border-[#A3E635]/50 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(163,230,53,0.15)]"
      >
        {/* Animated Background Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#A3E635]/0 via-[#A3E635]/15 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />

        <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 min-w-0">
          <div className="flex items-center justify-center size-10 sm:size-12 rounded-[14px] bg-card dark:bg-secondary shadow-sm border border-border text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-[#A3E635] group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 ease-out shrink-0">
            <MailIcon className="size-5 sm:size-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#A3E635] flex items-center gap-1.5 mb-1.5 leading-none">
              Let&apos;s Connect 
              <Sparkles className="size-3 text-[#A3E635] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100" />
            </span>
            <span className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white truncate pr-2 leading-none">
              {isClient ? emailDecoded : "[Email protected]"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-center size-8 sm:size-10 shrink-0 rounded-[12px] bg-zinc-200/50 dark:bg-[#353A3E] text-zinc-500 dark:text-zinc-400 group-hover:bg-[#A3E635] group-hover:text-black group-hover:scale-105 transition-all duration-300 ease-out shadow-sm relative z-10">
          <ArrowUpRight className="size-4 sm:size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </a>
    </div>
  );
}
