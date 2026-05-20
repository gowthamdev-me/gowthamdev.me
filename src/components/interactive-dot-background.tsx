"use client";

import React, { useEffect, useRef } from "react";

interface InteractiveDotBackgroundProps {
    spacing?: number;
    baseRadius?: number;
    mouseRadius?: number;
    baseColor?: string;
    activeColor?: string;
}

export function InteractiveDotBackground({
    spacing = 25,
    baseRadius = 2,
    mouseRadius = 100,
    baseColor = "rgba(0, 0, 0, 0.1)",
    activeColor = "rgba(250, 1, 67, 1)", // Matching the brand G color
}: InteractiveDotBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: undefined as number | undefined, y: undefined as number | undefined });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width: number;
        let height: number;
        let dots: Dot[] = [];
        let currentSpacing = spacing;

        class Dot {
            x: number;
            y: number;
            radius: number;
            color: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.radius = baseRadius;
                this.color = baseColor;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }

            update() {
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                if (mx !== undefined && my !== undefined) {
                    const dx = mx - this.x;
                    const dy = my - this.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < mouseRadius) {
                        const intensity = 1 - distance / mouseRadius;
                        this.radius = baseRadius + intensity * 2;
                        this.color = activeColor.replace(/[\d.]+\)$/g, `${0.1 + intensity * 0.9})`);
                    } else {
                        this.radius = baseRadius;
                        this.color = baseColor;
                    }
                } else {
                    this.radius = baseRadius;
                    this.color = baseColor;
                }

                this.draw();
            }
        }

        const getResponsiveSpacing = () => {
            // Increase spacing on both mobile and desktop view
            if (typeof window !== "undefined") {
                if (window.innerWidth >= 768) {
                    return spacing * 1.5; // 50% more spacing on desktop
                } else {
                    return spacing * 1.3; // 30% more spacing on mobile
                }
            }
            return spacing;
        };

        const init = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            width = canvas.width = parent.clientWidth;
            height = canvas.height = parent.clientHeight;
            dots = [];
            currentSpacing = getResponsiveSpacing();

            for (let x = 0; x < width; x += currentSpacing) {
                for (let y = 0; y < height; y += currentSpacing) {
                    dots.push(new Dot(x + currentSpacing / 2, y + currentSpacing / 2));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            dots.forEach((dot) => dot.update());
            requestAnimationFrame(animate);
        };

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

        window.addEventListener("resize", init);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        init();
        animate();

        return () => {
            window.removeEventListener("resize", init);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [spacing, baseRadius, mouseRadius, baseColor, activeColor]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}

