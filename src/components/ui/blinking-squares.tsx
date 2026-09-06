"use client";

import { useEffect, useRef } from "react";

export interface BlinkingSquaresSettings {
  gridSize: number;
  fillPercent: number;
  colorMode: "single" | "multiple";
  squareColor: string;
  colors: string[];
  twinkleSpeed: number;
  opacity: number;
  fadeDirection: "none" | "left" | "right" | "top" | "bottom";
  fadePercent: number;
  fadeIntensity: number;
  hasCursorInteraction: boolean;
  cursorRadius: number;
  cursorBoost: number;
  blur: number;
  // ── Text / Font settings ────────────────────────────────────────
  textEnabled: boolean;
  textPrefix: string;       // e.g. "I'm"
  textName: string;         // e.g. "Gowtham"
  textFontSize: number;     // rem * 10, e.g. 48 = 4.8rem
  textAccentColor: string;  // color of first letter of each word
  textColor: string;        // rest of the text color
  textWeight: number;       // font-weight: 400 | 500 | 600 | 700 | 800 | 900
  textLetterSpacing: number; // em * 100, e.g. 1 = 0.01em
  textGlow: boolean;        // enable/disable text shadow glow
  textGlowColor: string;    // glow color (rgba)
  textPosition: "top" | "center" | "bottom"; // vertical position
}

export const DEFAULT_COVER_SETTINGS: BlinkingSquaresSettings = {
  gridSize: 57,
  fillPercent: 53,
  colorMode: "multiple",
  squareColor: "#FFFFFF",
  colors: ["#FFFFFF", "#FF3B30", "#000000", "#FFFFFF", "#FF3B30"],
  twinkleSpeed: 5,
  opacity: 1,
  fadeDirection: "bottom",
  fadePercent: 45,
  fadeIntensity: 40,
  hasCursorInteraction: true,
  cursorRadius: 299,
  cursorBoost: 71,
  blur: 0,
  // text defaults
  textEnabled: true,
  textPrefix: "I'm",
  textName: "Gowtham",
  textFontSize: 48,
  textAccentColor: "#FA0143",
  textColor: "#FFFFFF",
  textWeight: 700,
  textLetterSpacing: 1,
  textGlow: true,
  textGlowColor: "rgba(250,1,67,0.55)",
  textPosition: "center",
};

function parseColor(c: string): [number, number, number] {
  if (!c) return [255, 255, 255];
  const s = c.trim();
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((v) => parseFloat(v.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  return [255, 255, 255];
}

interface CellData {
  phase: number;
  rate: number;
  tint: number;
}

export function BlinkingSquaresCanvas({
  gridSize,
  fillPercent,
  colorMode,
  squareColor,
  colors,
  twinkleSpeed,
  opacity,
  fadeDirection,
  fadePercent,
  fadeIntensity,
  hasCursorInteraction,
  cursorRadius,
  cursorBoost,
  blur,
  style,
}: BlinkingSquaresSettings & { style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const cellsRef = useRef<CellData[]>([]);
  const cellsKeyRef = useRef("");
  const startRef = useRef(performance.now());
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  // Keep latest props accessible in the RAF loop without restarts
  const propsRef = useRef({
    gridSize, fillPercent, colorMode, squareColor, colors,
    twinkleSpeed, opacity, fadeDirection, fadePercent, fadeIntensity,
    hasCursorInteraction, cursorRadius, cursorBoost, blur,
  });
  propsRef.current = {
    gridSize, fillPercent, colorMode, squareColor, colors,
    twinkleSpeed, opacity, fadeDirection, fadePercent, fadeIntensity,
    hasCursorInteraction, cursorRadius, cursorBoost, blur,
  };

  function ensureCells(cols: number, rows: number) {
    const key = `${cols}x${rows}`;
    if (cellsKeyRef.current === key && cellsRef.current.length === cols * rows) return;
    const arr: CellData[] = new Array(cols * rows);
    for (let i = 0; i < arr.length; i++) {
      const s1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const s2 = Math.sin(i * 7.137 + 33.71) * 12345.6789;
      const r2 = s2 - Math.floor(s2);
      const s3 = Math.sin(i * 3.51 + 5.91) * 9876.54321;
      const r3 = s3 - Math.floor(s3);
      arr[i] = { phase: r1 * Math.PI * 2, rate: 0.6 + r2 * 0.8, tint: r3 };
    }
    cellsRef.current = arr;
    cellsKeyRef.current = key;
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    function resize(entry?: ResizeObserverEntry) {
      if (!canvas || !container) return;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const cr = entry?.contentRect;
      const rectW = cr?.width ?? container.clientWidth;
      const rectH = cr?.height ?? container.clientHeight;
      const w = Math.max(1, Math.floor(rectW));
      const h = Math.max(1, Math.floor(rectH));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      cellsKeyRef.current = "";
    }

    resize();
    const ro = new ResizeObserver((entries) => resize(entries[0]));
    ro.observe(container);
    startRef.current = performance.now();

    function draw(now: number) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { w, h } = sizeRef.current;
      if (w <= 0 || h <= 0) return;

      const p = propsRef.current;
      const cells = Math.max(2, Math.floor(p.gridSize));
      const longSide = Math.max(w, h);
      const cellSize = longSide / cells;
      const cols = Math.max(1, Math.ceil(w / cellSize));
      const rows = Math.max(1, Math.ceil(h / cellSize));
      ensureCells(cols, rows);

      ctx.clearRect(0, 0, w, h);

      const palette: [number, number, number][] =
        p.colorMode === "multiple" && Array.isArray(p.colors) && p.colors.length > 0
          ? p.colors.slice(0, 5).map((c) => parseColor(c))
          : [parseColor(p.squareColor)];

      const t = (now - startRef.current) / 1000;
      const speed = Math.max(0, p.twinkleSpeed) * 0.05;
      const masterOpacity = Math.max(0, Math.min(1, p.opacity));
      const fill = Math.max(0.1, Math.min(1, (p.fillPercent ?? 70) / 100));
      const inset = (1 - fill) * 0.5;

      const f = Math.max(0, Math.min(1, (p.fadePercent ?? 0) / 100));
      const fStart = 1 - f;
      const fEnd = 1;
      const noFade = f <= 0;
      const falloff = 0.2 + (Math.max(0, Math.min(100, p.fadeIntensity ?? 25)) / 100) * 5.8;

      const cursor = pointerRef.current;
      const hasCursor = p.hasCursorInteraction && cursor.active;
      const cr2 = Math.max(1, p.cursorRadius) ** 2;
      const cb = Math.max(0, p.cursorBoost) / 100;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const cell = cellsRef.current[i];
          if (!cell) continue;

          let u = 0;
          switch (p.fadeDirection) {
            case "left": u = 1 - x / Math.max(1, cols - 1); break;
            case "top": u = 1 - y / Math.max(1, rows - 1); break;
            case "bottom": u = y / Math.max(1, rows - 1); break;
            case "none": u = 0; break;
            default: u = x / Math.max(1, cols - 1);
          }

          let envelope = 1;
          if (p.fadeDirection !== "none" && !noFade) {
            if (u > fStart) {
              if (u >= fEnd) {
                envelope = 0;
              } else {
                const k = (u - fStart) / Math.max(0.0001, fEnd - fStart);
                envelope = Math.pow(1 - k, falloff);
              }
            }
          }

          const cx = x * cellSize;
          const cy = y * cellSize;

          let reveal = 0;
          if (hasCursor) {
            const dx = cx + cellSize * 0.5 - cursor.x;
            const dy = cy + cellSize * 0.5 - cursor.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < cr2) {
              const k = 1 - d2 / cr2;
              reveal = k * k * cb;
            }
          }

          const osc = 0.5 + 0.5 * Math.sin(t * speed * cell.rate * Math.PI * 2 + cell.phase);
          const finalAlpha = Math.min(1, envelope + reveal) * osc * masterOpacity;
          if (finalAlpha <= 0.002) continue;

          const ci = palette.length > 1
            ? Math.min(palette.length - 1, Math.floor(cell.tint * palette.length))
            : 0;
          const [r, g, b] = palette[ci];
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${finalAlpha.toFixed(3)})`;
          ctx.fillRect(cx + cellSize * inset, cy + cellSize * inset, cellSize * fill, cellSize * fill);
        }
      }
    }

    function loop(now: number) {
      draw(now);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onLeave = () => { pointerRef.current = { x: -9999, y: -9999, active: false }; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          filter: blur > 0 ? `blur(${blur}px)` : "none",
        }}
      />
    </div>
  );
}
