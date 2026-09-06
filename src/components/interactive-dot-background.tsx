"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface InteractiveDotBackgroundProps {
    /** Mouse interaction radius */
    mouseRadius?: number;
    /** Dot color for light theme */
    lightBaseColor?: string;
    /** Dot color for dark theme */
    darkBaseColor?: string;
    /** Mouse-hover active dot color */
    activeColor?: string;
}

/**
 * Responsive config per breakpoint.
 * Tighter dots on mobile, comfortable on desktop.
 */
function getResponsiveConfig(viewportWidth: number) {
    if (viewportWidth < 480) {
        // Mobile small
        return { spacing: 14, radius: 0.8 };
    } else if (viewportWidth < 768) {
        // Mobile large
        return { spacing: 16, radius: 0.9 };
    } else if (viewportWidth < 1024) {
        // Tablet
        return { spacing: 20, radius: 1.0 };
    } else if (viewportWidth < 1440) {
        // Laptop
        return { spacing: 24, radius: 1.1 };
    } else {
        // Desktop / large
        return { spacing: 28, radius: 1.2 };
    }
}

export function InteractiveDotBackground({
    mouseRadius = 120,
    lightBaseColor = "rgba(0, 0, 0, 0.15)",
    darkBaseColor = "rgba(200, 200, 220, 0.15)",
    activeColor = "rgba(250, 1, 67, 1)",
}: InteractiveDotBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: undefined as number | undefined, y: undefined as number | undefined });
    const animFrameRef = useRef<number>(0);
    const { resolvedTheme } = useTheme();

    const themeRef = useRef(resolvedTheme);
    useEffect(() => {
        themeRef.current = resolvedTheme;
    }, [resolvedTheme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let currentRadius = 1;

        // Dot grid positions
        let dotX: Float32Array = new Float32Array(0);
        let dotY: Float32Array = new Float32Array(0);
        let dotCount = 0;

        /* ── Build grid ──────────────────────────────────────────── */
        const init = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const dpr = window.devicePixelRatio || 1;
            width = parent.clientWidth;
            height = parent.clientHeight;
            if (width === 0 || height === 0) return;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const config = getResponsiveConfig(window.innerWidth);
            const s = config.spacing;
            currentRadius = config.radius;

            const cols = Math.ceil(width / s);
            const rows = Math.ceil(height / s);
            dotCount = cols * rows;

            dotX = new Float32Array(dotCount);
            dotY = new Float32Array(dotCount);

            let i = 0;
            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    dotX[i] = col * s + s / 2;
                    dotY[i] = row * s + s / 2;
                    i++;
                }
            }
        };

        /* ── Parse rgba → {r,g,b} ───────────────────────────────── */
        const parseColor = (c: string) => {
            const m = c.match(/[\d.]+/g);
            if (!m) return { r: 255, g: 255, b: 255 };
            return { r: Number(m[0]), g: Number(m[1]), b: Number(m[2]) };
        };

        const light = parseColor(lightBaseColor);
        const dark = parseColor(darkBaseColor);
        const active = parseColor(activeColor);

        /* ── Render loop ─────────────────────────────────────────── */
        const animate = (timestamp: number) => {
            const t = timestamp / 1000;

            ctx.clearRect(0, 0, width, height);

            if (dotCount === 0) {
                init();
                animFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            const isDark = themeRef.current === "dark";
            const base = isDark ? dark : light;

            for (let i = 0; i < dotCount; i++) {
                const x = dotX[i];
                const y = dotY[i];

                // Normalise position 0→1
                const xNorm = x / width;
                const yNorm = y / height;

                // ── Rotating wave: direction slowly changes ─────────
                // The wave heading rotates full 360° every ~25 seconds,
                // so it sweeps left→right, diagonal, top→bottom,
                // right→left, and every angle in between.
                const angle = t * 0.25; // rotation speed (~25s full turn)
                const dx = Math.cos(angle);
                const dy = Math.sin(angle);

                // Project each dot's position onto the wave direction
                const projection = xNorm * dx + yNorm * dy;

                // Single clean sine wave along that direction, ~5s cycle
                const wave = Math.sin(t * 1.25 - projection * Math.PI * 2);
                // Map -1…1 → 0…1
                const waveFactor = (wave + 1) * 0.5;

                // ── Opacity: smooth pulse 0.08 → 0.70 ───────────────
                let opacity = 0.08 + waveFactor * 0.62;

                // ── Scale: gentle breathing 0.8x → 1.2x ─────────────
                let scale = 0.8 + waveFactor * 0.4;

                // ── Soft glow on bright dots ─────────────────────────
                let glowIntensity = 0;
                if (opacity > 0.5) {
                    glowIntensity = Math.min((opacity - 0.5) / 0.2, 1);
                }

                let r = base.r;
                let g = base.g;
                let b = base.b;

                // ── Mouse hover ──────────────────────────────────────
                if (mx !== undefined && my !== undefined) {
                    const dx = mx - x;
                    const dy = my - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseRadius) {
                        const intensity = 1 - dist / mouseRadius;
                        const eased = intensity * intensity * (3 - 2 * intensity);
                        r = base.r + (active.r - base.r) * eased;
                        g = base.g + (active.g - base.g) * eased;
                        b = base.b + (active.b - base.b) * eased;
                        opacity = Math.min(opacity + eased * 0.45, 1);
                        scale = scale + eased * 0.35;
                        glowIntensity = Math.max(glowIntensity, eased);
                    }
                }

                const radius = currentRadius * scale;
                const ri = Math.round(r);
                const gi = Math.round(g);
                const bi = Math.round(b);

                // ── Glow halo ────────────────────────────────────────
                if (glowIntensity > 0.05) {
                    ctx.beginPath();
                    ctx.arc(x, y, radius + 3 * glowIntensity, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${ri},${gi},${bi},${(glowIntensity * 0.18).toFixed(3)})`;
                    ctx.fill();
                }

                // ── Dot ──────────────────────────────────────────────
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ri},${gi},${bi},${opacity.toFixed(3)})`;
                ctx.fill();
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        /* ── Events ──────────────────────────────────────────────── */
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouseRef.current.x = e.touches[0].clientX - rect.left;
                mouseRef.current.y = e.touches[0].clientY - rect.top;
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = undefined;
            mouseRef.current.y = undefined;
        };

        /* ── ResizeObserver ───────────────────────────────────────── */
        const parent = canvas.parentElement;
        let resizeObserver: ResizeObserver | null = null;
        if (parent) {
            resizeObserver = new ResizeObserver(() => init());
            resizeObserver.observe(parent);
        }

        /* ── Boot ────────────────────────────────────────────────── */
        window.addEventListener("resize", init);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
        canvas.addEventListener("mouseleave", handleMouseLeave);

        init();
        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", init);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animFrameRef.current);
            resizeObserver?.disconnect();
        };
    }, [mouseRadius, lightBaseColor, darkBaseColor, activeColor]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto"
            style={{ opacity: 0.85 }}
        />
    );
}
