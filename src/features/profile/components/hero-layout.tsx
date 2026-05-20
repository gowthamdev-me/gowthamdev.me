"use client";

import { useEffect, useState } from "react";
import { useScroll, useTransform, useSpring } from "motion/react";
import * as motion from "motion/react-m";
import { ProfileSidebar } from "./modern-profile-card";

/** Returns the card column width in px for the current viewport (0 on mobile/tablet) */
function useCardWidth() {
    const [cardWidth, setCardWidth] = useState(0);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w >= 1536) setCardWidth(420);       // 2xl
            else if (w >= 1280) setCardWidth(380);  // xl
            else if (w >= 1024) setCardWidth(340);  // lg
            else setCardWidth(0);                   // mobile/tablet: stacked
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return cardWidth;
}

/** Returns true once the component has mounted (avoids SSR mismatch) */
function useIsMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

interface HeroLayoutProps {
    children: React.ReactNode;
}

export function HeroLayout({ children }: HeroLayoutProps) {
    const cardWidth = useCardWidth();
    const isDesktop = cardWidth > 0;

    // scrollY is a live MotionValue — updates every frame
    const { scrollY } = useScroll();

    // Scroll 0→300px drives the card column width and x-slide
    const rawWidth = useTransform(scrollY, [0, 300], [0, cardWidth]);
    const rawX     = useTransform(scrollY, [0, 300], [-cardWidth, 0]);

    // Light spring makes the card follow scroll smoothly
    const animWidth = useSpring(rawWidth, { stiffness: 120, damping: 22, mass: 0.6 });
    const animX     = useSpring(rawX,     { stiffness: 120, damping: 22, mass: 0.6 });

    // ── Mobile & tablet: stacked layout ──────────────────────────────────────────
    // Mobile  (<640px) : card full width, stacked
    // Tablet  (640-1023px): card wider (max-w-md), centered, properly proportioned
    if (!isDesktop) {
        return (
            <div className="flex flex-col gap-3 sm:gap-4">
                {/* Card: full width on mobile, wider & centred on tablet */}
                <div className="w-full sm:max-w-md sm:mx-auto">
                    <ProfileSidebar />
                </div>
                {/* Content sections below */}
                <div className="flex flex-col gap-2 sm:gap-3">
                    {children}
                </div>
            </div>
        );
    }

    // ── Desktop ────────────────────────────────────────────────────────────────
    // IMPORTANT: Use overflow:"clip" (not "hidden") on the row.
    // "clip" visually clips the sliding card without creating a scroll container,
    // so position:sticky still works on the card inside.
    return (
        <div className="flex flex-row gap-4" style={{ overflow: "clip" }}>

            {/* ── Left: animated card column ──
                - self-stretch makes this column as tall as the right content
                - overflow:clip clips the card during slide-in, sticky still works */}
            <div className="shrink-0 self-stretch" style={{ overflow: "clip" }}>

                {/* Width expands from 0 → cardWidth as user scrolls */}
                <motion.div
                    style={{
                        width: animWidth,
                        height: "100%",
                        overflow: "clip",
                    }}
                >
                    {/* Card slides from left → right in sync with scroll */}
                    <motion.div
                        style={{
                            width: cardWidth,
                            x: animX,
                            height: "100%",
                        }}
                    >
                        {/* Sticky wrapper — card stays fixed while right side scrolls */}
                        <div
                            className="sticky z-30 h-full"
                            style={{
                                top: "calc(1.5rem + 56px + 0.75rem)",
                                height: "calc(100vh - 1.5rem - 56px - 0.75rem - 1.5rem)",
                            }}
                        >
                            <ProfileSidebar />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── Right: content — always flex-1, bio visible from start ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3 lg:gap-4">
                {children}
            </div>
        </div>
    );
}
