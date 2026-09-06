"use client";

import React, { useEffect, useState } from "react";
import { ProfileSidebar } from "./modern-profile-card";

interface HeroLayoutProps {
    children: React.ReactNode;
}

export function HeroLayout({ children }: HeroLayoutProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="w-full">
            {/* ── Mobile (< md / 768px): Clean Stacked Layout ── */}
            <div className="flex flex-col gap-3 sm:gap-5 md:hidden">
                <div className="w-full">
                    <ProfileSidebar />
                </div>
                <div className="flex flex-col gap-3 sm:gap-5">
                    {children}
                </div>
            </div>

            {/* ── Desktop & Laptop (>= md / 768px): Interactive Slide-In Scroll Animation ── */}
            <div
                className="hidden md:flex flex-row items-start"
                style={{
                    gap: isScrolled ? "28px" : "0px",
                    transition: "gap 1.25s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            >
                {/* Outer animated width wrapper */}
                <div
                    style={{
                        width: isScrolled ? "340px" : "0px",
                        transition: "width 1.25s cubic-bezier(0.22, 1, 0.36, 1)",
                        flexShrink: 0,
                    }}
                    className="sticky top-20 lg:top-24 self-start h-fit max-h-[calc(100vh-120px)] overflow-visible"
                >
                    {/* Inner sliding profile card */}
                    <div
                        style={{
                            width: "340px",
                            transform: isScrolled ? "translateX(0) scale(1)" : "translateX(-120%) scale(0.94)",
                            opacity: isScrolled ? 1 : 0,
                            transition: "transform 1.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
                            willChange: "transform, opacity",
                        }}
                    >
                        <ProfileSidebar />
                    </div>
                </div>

                {/* Right Main Content Stream */}
                <main className="flex-1 min-w-0 flex flex-col gap-5 lg:gap-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
