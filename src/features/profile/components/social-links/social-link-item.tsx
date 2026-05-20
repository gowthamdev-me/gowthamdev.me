import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import type { SocialLink } from "@/features/profile/types/social-links";
import { cn } from "@/lib/utils";

export function SocialLinkItem({ icon, title, description, href }: SocialLink) {
  return (
    <a
      className={cn(
        "group/link flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 transition-[border-color,background-color,transform] duration-300 ease-out select-none",
        "dark:border-white/10 dark:bg-white/[0.02]",
        "hover:border-zinc-300 hover:bg-white hover:-translate-y-0.5",
        "dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
      )}
      href={href}
      target="_blank"
      rel="noopener"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-zinc-200/80 ring-inset dark:ring-white/10">
        <Image
          className="size-full object-cover"
          src={icon}
          alt={title}
          width={48}
          height={48}
          quality={100}
          unoptimized
        />
      </div>

      <div className="flex-1">
        <h3 className="flex items-center text-base font-semibold text-foreground">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
      </div>

      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-muted-foreground transition-colors group-hover/link:bg-zinc-200/80 group-hover/link:text-foreground dark:bg-white/5 dark:group-hover/link:bg-white/10">
        <ArrowUpRightIcon className="size-4" />
      </div>
    </a>
  );
}

