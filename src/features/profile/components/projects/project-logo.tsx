"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Icons } from "@/components/icons";

export function ProjectLogo({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className="size-full flex items-center justify-center select-none bg-gradient-to-br from-zinc-700 to-zinc-800 dark:from-zinc-700 dark:to-zinc-900"
        aria-hidden="true"
      >
        <Icons.project className="size-6 text-zinc-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className="size-full select-none object-cover"
      width={56}
      height={56}
      unoptimized
      aria-hidden="true"
      onError={() => setHasError(true)}
    />
  );
}
