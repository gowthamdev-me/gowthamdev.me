import { BrandContextMenu } from "@/components/brand-context-menu";
import { GowthamMark } from "@/components/gowtham-mark";
import { InteractiveDotBackground } from "@/components/interactive-dot-background";
import { cn } from "@/lib/utils";

export function ProfileCover() {
  return (
    <BrandContextMenu>
      <div
        className={cn(
          "relative aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1] border border-zinc-100 dark:border-white/5 select-none overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] bg-white dark:bg-zinc-900 shadow-sm",
          "flex items-center justify-center text-black dark:text-white"
        )}
      >
        <InteractiveDotBackground
          baseColor="rgba(0, 0, 0, 0.15)"
          activeColor="rgba(250, 1, 67, 1)"
          spacing={10}
          baseRadius={0.5}
        />
        <GowthamMark id="js-cover-mark" className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-bold" />
      </div>
    </BrandContextMenu>
  );
}

