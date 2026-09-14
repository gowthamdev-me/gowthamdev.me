"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  Flame,
  Snowflake,
  Trees,
  Droplets,
  Sun,
  Sparkles,
  ArrowUpRight,
  Code,
  Terminal,
  Zap,
  Star,
  Globe,
  Heart,
} from "lucide-react";

import type { Post } from "@/types/blog";
import { cn } from "@/lib/utils";

// Exact default colors matching the user's SCSS snippet
const OPTION_COLORS = [
  "#ED5565",
  "#FC6E51",
  "#FFCE54",
  "#2ECC71",
  "#5D9CEC",
  "#AC92EC",
];

// Fallback images matching Victor of Valencia tumblr photos from the user's code/image
const FALLBACK_IMAGES = [
  "https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg",
  "https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg",
  "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg",
  "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg",
  "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg",
];

const ICONS = [Flame, Snowflake, Trees, Droplets, Sun, Sparkles];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  snowflake: Snowflake,
  trees: Trees,
  droplets: Droplets,
  sun: Sun,
  sparkles: Sparkles,
  code: Code,
  terminal: Terminal,
  zap: Zap,
  star: Star,
  globe: Globe,
  heart: Heart,
};

function isImageUrl(val: string): boolean {
  if (!val) return false;
  return (
    val.startsWith("/") ||
    val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("data:") ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(val)
  );
}

function getResolvedImage(image: string | undefined, index: number): string {
  if (!image || image.includes("assets.gowthamdev.me")) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  }
  return image;
}

interface BlogAccordionProps {
  posts: Post[];
}

export function BlogAccordion({ posts }: BlogAccordionProps) {
  const router = useRouter();

  // Show 5 items like in the screenshot
  const items = posts.slice(0, 5);

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    // Default to the 5th (last) card like in the user's reference image
    return items.length > 0 ? items.length - 1 : 0;
  });

  if (!items || items.length === 0) {
    return null;
  }

  const handleCardClick = (index: number, slug: string) => {
    if (activeIndex === index) {
      router.push(`/blog/${slug}`);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="blog-options">
        {items.map((post, index) => {
          const isActive = activeIndex === index;
          const color = OPTION_COLORS[index % OPTION_COLORS.length];
          const DefaultIconComponent = ICONS[index % ICONS.length];
          const customIcon = post.metadata.icon?.trim();
          const hasCustomImage = customIcon ? isImageUrl(customIcon) : false;
          const MappedIcon = customIcon ? ICON_MAP[customIcon.toLowerCase()] : null;
          const date = dayjs(post.metadata.createdAt).format("MMM DD, YYYY");
          const bgImage = getResolvedImage(post.metadata.image, index);

          return (
            <div
              key={post.slug}
              onClick={() => handleCardClick(index, post.slug)}
              style={
                {
                  "--optionBackground": `url(${bgImage})`,
                  "--defaultBackground": color,
                } as React.CSSProperties
              }
              className={cn(
                "blog-option",
                isActive ? "active" : "",
                items.length === 1 && "!max-w-none w-full"
              )}
            >
              {/* Dark bottom shadow overlay */}
              <div className="shadow" />

              {/* Label bar with icon and details */}
              <div className="label">
                <div
                  className="icon"
                  style={{
                    color: color,
                  }}
                  title={post.metadata.title}
                >
                  {hasCustomImage ? (
                    <img
                      src={customIcon}
                      alt="Icon"
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-full"
                    />
                  ) : MappedIcon ? (
                    <MappedIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  ) : (
                    <DefaultIconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  )}
                </div>

                <div className="info">
                  <div className="main">{post.metadata.title}</div>
                  <div className="sub">{post.metadata.description || date}</div>
                </div>

                {isActive && (
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto mr-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-zinc-950 backdrop-blur-md border border-white/25 text-xs font-semibold transition-all duration-300 shadow-md group/btn"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
