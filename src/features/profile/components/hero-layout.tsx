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
            {/* ── Mobile (< md / 768px): Profile Sidebar on top ── */}
            <div className="w-full md:hidden mb-3 sm:mb-5">
                <ProfileSidebar />
            </div>

            {/* ── Main Layout: Sidebar + Unified Content Stream ── */}
            <div
                className="flex flex-row items-start"
                style={{
                    gap: isScrolled ? "28px" : "0px",
                    transition: "gap 1.25s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            >
                {/* Desktop sliding profile sidebar */}
                <div
                    style={{
                        width: isScrolled ? "340px" : "0px",
                        transition: "width 1.25s cubic-bezier(0.22, 1, 0.36, 1)",
                        flexShrink: 0,
                    }}
                    className="hidden md:block sticky top-20 lg:top-24 self-start h-fit max-h-[calc(100vh-120px)] overflow-visible"
                >
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

                {/* Right Main Content Stream (Single instance for accurate DOM IDs & smooth scrolling) */}
                <main className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-5 lg:gap-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
