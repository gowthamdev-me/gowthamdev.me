import { SimpleTooltip } from "@/components/ui/tooltip";
import { USER } from "@/data/user";
import { cn } from "@/lib/utils";
import { FlipSentences } from "@/registry/flip-sentences";

import { PronounceMyName } from "./pronounce-my-name";
import { VerifiedIcon } from "./verified-icon";

export function ProfileHeader() {
  return (
    <div className="screen-line-before screen-line-after flex border-x-2 border-edge my-4 bg-card/50 backdrop-blur-sm min-h-[170px]">
      <div className="shrink-0 border-r-2 border-edge w-[170px] flex items-center justify-center">
        <div className="mx-[4px] my-[4px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="size-[154px] rounded-full ring-2 ring-border ring-offset-2 ring-offset-background select-none object-cover"
            alt={`${USER.displayName}'s avatar`}
            src={USER.avatar}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col min-h-[170px]">
        <div
          className={cn(
            "flex grow items-end pb-2 pl-6 min-h-[85px]",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56"
          )}
        >
          <div className="line-clamp-1 font-mono text-xs text-zinc-300 select-none max-sm:hidden dark:text-zinc-800">
            {"text-3xl "}
            <span className="inline dark:hidden">text-zinc-950</span>
            <span className="hidden dark:inline">text-zinc-50</span>
            {" font-medium"}
          </div>
        </div>

        <div className="border-t border-edge flex-1">
          <div className="flex">
            <div className="flex-1 px-6 py-3 border-r border-edge">
              <h1 className="flex items-center text-3xl font-semibold leading-tight">
                {USER.displayName}
                &nbsp;
                <SimpleTooltip content="Verified">
                  <VerifiedIcon className="size-[0.6em] translate-y-px text-info select-none" />
                </SimpleTooltip>
                {USER.namePronunciationUrl && (
                  <>
                    &nbsp;
                    <PronounceMyName
                      className="translate-y-px"
                      namePronunciationUrl={USER.namePronunciationUrl}
                    />
                  </>
                )}
              </h1>
            </div>
            
            <div className="w-32 px-4 py-3 flex items-center justify-center text-sm text-muted-foreground border-r border-edge">
              <span>Profile</span>
            </div>
          </div>

          <div className="border-t border-edge px-6 py-2 min-h-[40px] flex items-center">
            <FlipSentences sentences={USER.flipSentences} />
          </div>
        </div>
      </div>
    </div>
  );
}

