import { ArrowUpRightIcon } from "lucide-react";

import { SocialIcon } from "@/components/social-icon";
import type { SocialLink } from "@/features/profile/types/social-links";
import { cn } from "@/lib/utils";

export function SocialLinkItem({ icon, title, description, href }: SocialLink) {
  return (
    <a
      className={cn(
        "group/link flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white/70 p-2.5 sm:p-4 transition-[border-color,background-color,transform] duration-300 ease-out select-none",
        "dark:border-white/10 dark:bg-white/[0.02]",
        "hover:border-zinc-300 hover:bg-white hover:-translate-y-0.5",
        "dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
      )}
      href={href}
      target="_blank"
      rel="noopener"
    >
      <div className="relative size-9 sm:size-11 shrink-0 overflow-hidden rounded-lg sm:rounded-xl ring-1 ring-zinc-200/80 ring-inset dark:ring-white/10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-foreground">
        <SocialIcon
          title={title}
          iconUrl={icon}
          size={20}
          className="size-5 sm:size-6"
        />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <h3 className="text-[13.5px] sm:text-base font-bold text-foreground truncate leading-tight">
          {title}
        </h3>

        {description && (
          <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium truncate mt-0.5">
            {description}
          </p>
        )}
      </div>

      <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-muted-foreground transition-colors group-hover/link:bg-zinc-200/80 group-hover/link:text-foreground dark:bg-white/5 dark:group-hover/link:bg-white/10">
        <ArrowUpRightIcon className="size-3.5 sm:size-4" />
      </div>
    </a>
  );
}

