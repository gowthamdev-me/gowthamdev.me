"use client";

import { CircleXIcon } from "lucide-react";
import React, { useOptimistic, useTransition } from "react";

import { cn } from "@/lib/utils";
import { CopyIcon } from "@/components/ui/copy";
import { CheckIcon } from "@/components/ui/check";

import { Button } from "./ui/button";

export function CopyButton({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
}) {
  const [state, setState] = useOptimistic<"idle" | "copied" | "failed">("idle");
  const [, startTransition] = useTransition();

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn("z-10 size-6 rounded-md flex items-center justify-center", className)}
      onClick={() => {
        startTransition(async () => {
          try {
            if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(value);
              setState("copied");
            } else {
              setState("failed");
            }
          } catch {
            setState("failed");
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        });
      }}
      {...props}
    >
      {state === "idle" ? (
        <CopyIcon size={14} />
      ) : state === "copied" ? (
        <CheckIcon size={14} />
      ) : state === "failed" ? (
        <CircleXIcon className="size-3" />
      ) : null}
      <span className="sr-only">Copy</span>
    </Button>
  );
}

