"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollToSection } from "@/utils/scroll-to-section";

export function SmoothScroll() {
    useEffect(() => {
        // ── Lenis smooth scroll ──────────────────────────────────────────
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 1.5,
            wheelMultiplier: 1,
            infinite: false,
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // ── Global hash-link interceptor (safety net) ────────────────────
        // Catches any <a href="#section"> or <a href="/#section"> click
        // that wasn't individually replaced, scrolls smoothly, and removes
        // the hash from the address bar.
        function handleHashClick(e: MouseEvent) {
            const anchor = (e.target as Element)?.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href") || "";
            // Match href="#id" or href="/#id"
            const match = href.match(/^\/?#([^/]+)$/);
            if (!match) return;

            const sectionId = match[1];
            const el = document.getElementById(sectionId);
            if (!el) return;

            e.preventDefault();
            scrollToSection(sectionId);
        }

        document.addEventListener("click", handleHashClick, true);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            document.removeEventListener("click", handleHashClick, true);
        };
    }, []);

    return null;
}
