"use client";

import { LinkIcon, ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { copyText } from "@/utils/copy";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function PostShareMenu({ url }: { url: string }) {
  const absoluteUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
      ? new URL(url, window.location.origin).toString()
      : url;

  const urlEncoded = encodeURIComponent(absoluteUrl);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon:sm"
          className="rounded-lg border border-zinc-200/80 dark:border-white/[0.08] bg-white/60 dark:bg-zinc-900/60 text-muted-foreground hover:text-foreground hover:bg-zinc-100/80 dark:hover:bg-white/[0.06]"
        >
          <ShareIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        collisionPadding={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem
          onClick={() => {
            copyText(absoluteUrl);
            toast.success("Copied link");
          }}
        >
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://x.com/intent/tweet?url=${urlEncoded}`}
            target="_blank"
            rel="noopener"
          >
            <Icons.x />
            Share on X
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
            target="_blank"
            rel="noopener"
          >
            <Icons.linkedin />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

