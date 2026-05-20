"use client";

import { ArrowUpIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= 400);

    const prev = scrollY.getPrevious() ?? 0;
    const diff = latestValue - prev;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        "[--bottom:0.75rem] lg:[--bottom:1.5rem]",
        "fixed right-3 bottom-[calc(var(--bottom,0.75rem)+env(safe-area-inset-bottom,0px))] z-50 lg:right-6",
        "h-11 w-11 rounded-full duration-300 data-[scroll-direction=down]:opacity-100 data-[scroll-direction=up]:opacity-100 data-[visible=false]:opacity-0",
        className
      )}
      variant="default"
      size="icon:lg"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <ArrowUpIcon className="size-5" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  );
}
