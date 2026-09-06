"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "@/components/ui/arrow-up";

export function ScrollTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    // Show earlier (after 180px scroll) instead of waiting for the very bottom
    setVisible(latestValue >= 180);

    const prev = scrollY.getPrevious() ?? 0;
    const diff = latestValue - prev;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  return (
    <button
      type="button"
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      aria-label="Scroll to top"
      className={cn(
        "[--bottom:1rem] lg:[--bottom:1.75rem]",
        "fixed right-4 bottom-[calc(var(--bottom,1rem)+env(safe-area-inset-bottom,0px))] z-50 lg:right-6",
        "size-10 sm:size-12 rounded-full",
        "bg-zinc-950/90 dark:bg-black/90 text-white",
        "border border-white/20 dark:border-white/15",
        "backdrop-blur-xl shadow-[0_0_20px_rgba(250,1,67,0.35)] hover:shadow-[0_0_30px_rgba(250,1,67,0.6)]",
        "hover:bg-[#FA0143] hover:border-[#FA0143] hover:scale-110 active:scale-95",
        "transition-all duration-300 ease-out group flex items-center justify-center cursor-pointer select-none",
        "data-[visible=false]:pointer-events-none data-[visible=false]:scale-75 data-[visible=false]:opacity-0 data-[visible=false]:translate-y-4",
        "data-[visible=true]:scale-100 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0",
        className
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
        <ArrowUpIcon size={18} className="text-white" />
      </div>
      <span className="sr-only">Scroll to top</span>
    </button>
  );
}

