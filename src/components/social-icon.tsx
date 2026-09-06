"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GlobeIcon } from "lucide-react";
import { getSocialIcon } from "./icons";
import { cn } from "@/lib/utils";

interface SocialIconProps {
  title: string;
  iconUrl?: string;
  className?: string;
  size?: number;
}

export function SocialIcon({ title, iconUrl, className, size = 16 }: SocialIconProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackSvg = getSocialIcon(title, { className: cn("size-full", className) });

  if (iconUrl && !hasError) {
    return (
      <Image
        src={iconUrl}
        alt={title}
        width={size}
        height={size}
        unoptimized
        className={cn("object-cover rounded-sm shrink-0", className)}
        onError={() => setHasError(true)}
      />
    );
  }

  if (fallbackSvg) {
    return <span className={cn("inline-flex items-center justify-center shrink-0", className)}>{fallbackSvg}</span>;
  }

  return <GlobeIcon className={cn("shrink-0", className)} size={size} />;
}
