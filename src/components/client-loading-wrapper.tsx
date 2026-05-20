"use client";

import { useEffect, useRef, useState } from "react";

interface ClientLoadingWrapperProps {
  children: React.ReactNode;
}

const PATH_1 =
  "M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262";

const PATH_2 =
  "M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012";

const STROKE_DARK = "#1e1e1e";
const STROKE_RED  = "#FA0143";

function waitForGsap(): Promise<any> {
  return new Promise((resolve) => {
    if ((window as any).gsap) { resolve((window as any).gsap); return; }
    const id = setInterval(() => {
      if ((window as any).gsap) { clearInterval(id); resolve((window as any).gsap); }
    }, 30);
    setTimeout(() => clearInterval(id), 10_000);
  });
}

function nextPaint(): Promise<void> {
  return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
}

// ─── Phase machine ────────────────────────────────────────────────────────────
// "brand"      → black backdrop + Gowtham text visible
// "drawing-in" → brand text fades, SVG paths draw IN (covering viewport)
// "drawing-out"→ backdrop REMOVED (SVG fully covers screen at this moment),
//                SVG paths draw OUT revealing pre-rendered page below
// "done"       → SVG overlay removed, page fully visible
// ─────────────────────────────────────────────────────────────────────────────
type Phase = "brand" | "drawing-in" | "drawing-out" | "done";

export function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  const [phase, setPhase]           = useState<Phase>("brand");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [lineReady, setLineReady]   = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // ── Font ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const font = new FontFace(
      "JapanDaisuki",
      "url(/signatur/japan-daisuki-font/JapanDaisuki-8OeaZ.otf)"
    );
    font.load()
      .then(() => { document.fonts.add(font); setFontLoaded(true); })
      .catch(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    if (!fontLoaded) return;
    const t = setTimeout(() => setLineReady(true), 180);
    return () => clearTimeout(t);
  }, [fontLoaded]);

  // ── Animation sequence ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // ① Brand screen for 1.4 s
      await new Promise<void>((res) => setTimeout(res, 1_400));
      if (cancelled) return;

      // ② Start drawing-in (brand text fades)
      setPhase("drawing-in");
      await nextPaint(); // let React commit + svgRef settle
      if (cancelled || !svgRef.current) return;

      const gsap = await waitForGsap();
      if (cancelled || !svgRef.current) return;

      const paths = Array.from(
        svgRef.current.querySelectorAll<SVGPathElement>("path")
      );

      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      // ③ leave(): paths draw IN → viewport is fully covered by strokes
      await new Promise<void>((res) => {
        const tl = gsap.timeline({ onComplete: res });
        paths.forEach((p) =>
          tl.to(p, {
            strokeDashoffset: 0,
            attr: { "stroke-width": 700 },
            duration: 0.85,
            ease: "power2.inOut",
          }, 0)
        );
      });
      if (cancelled) return;

      // ④ NOW drop the black backdrop — the SVG strokes are 100% covering the
      //    screen so the user never sees it disappear. The pre-rendered page
      //    is already sitting below, waiting to be revealed.
      setPhase("drawing-out");
      await nextPaint();
      if (cancelled) return;

      // ⑤ enter(): paths draw OUT → reveals the page directly (no backdrop)
      await new Promise<void>((res) => {
        const tl = gsap.timeline({ onComplete: res });
        paths.forEach((p) => {
          const len = p.getTotalLength();
          tl.to(p, {
            strokeDashoffset: -len,
            attr: { "stroke-width": 200 },
            duration: 0.85,
            ease: "power2.inOut",
            onComplete: () => gsap.set(p, { strokeDashoffset: len }),
          }, 0);
        });
      });

      // ⑥ Animation complete — remove SVG overlay entirely
      if (!cancelled) setPhase("done");
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/*
       * Page content — ALWAYS rendered.
       * During the brand/drawing-in phases it sits behind the black backdrop.
       * During drawing-out the backdrop is gone and the SVG paths draw back to
       * reveal the page with zero delay.
       */}
      {children}

      {/* ── Black backdrop — visible only during brand + drawing-in ───────── */}
      {phase !== "drawing-out" && phase !== "done" && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "#090909",
            // Pointer-events block clicks during loading
            pointerEvents: "all",
          }}
        />
      )}

      {/* ── Brand screen (Gowtham text) — visible only during brand ─────────── */}
      {(phase === "brand" || phase === "drawing-in") && (
        <div
          aria-label="Loading"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9001,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: phase === "brand" ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <h1
            style={{
              fontFamily: fontLoaded ? "'JapanDaisuki', serif" : "serif",
              fontSize: "clamp(3.8rem, 11vw, 13rem)",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1,
              letterSpacing: "0.01em",
              opacity: fontLoaded ? 1 : 0,
              transform: fontLoaded ? "translateY(0px)" : "translateY(12px)",
              transition:
                "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <span
              style={{
                color: "#FA0143",
                textShadow:
                  "0 0 40px rgba(250,1,67,0.55), 0 0 80px rgba(250,1,67,0.2)",
              }}
            >
              G
            </span>
            owtham
          </h1>

          <div
            style={{
              marginTop: "1.2rem",
              height: "1.5px",
              width: lineReady ? "68px" : "0px",
              background: "#FA0143",
              borderRadius: "1px",
              boxShadow:
                "0 0 10px rgba(250,1,67,0.7), 0 0 28px rgba(250,1,67,0.25)",
              transition: "width 0.7s 0.1s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      )}

      {/* ── SVG stroke overlay — present during drawing-in and drawing-out ──── */}
      {phase !== "done" && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1.5)",
            width: "100%",
            height: "100%",
            zIndex: 9002,
            pointerEvents: "none",
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 2453 2535"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Start invisible — GSAP will initialise with real getTotalLength() */}
            <path
              d={PATH_1}
              stroke={STROKE_DARK}
              strokeWidth="200"
              strokeLinecap="round"
              style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }}
            />
            <path
              d={PATH_2}
              stroke={STROKE_RED}
              strokeWidth="200"
              strokeLinecap="round"
              style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }}
            />
          </svg>
        </div>
      )}
    </>
  );
}
