"use client";

import { useEffect, useState } from "react";

interface ClientLoadingWrapperProps {
  children: React.ReactNode;
}

export function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  const [fontLoaded, setFontLoaded]   = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone]           = useState(false);

  // Load signature font
  useEffect(() => {
    const font = new FontFace(
      "JapanDaisuki",
      "url(/signatur/japan-daisuki-font/JapanDaisuki-8OeaZ.otf)"
    );
    font.load()
      .then(() => {
        document.fonts.add(font);
        setFontLoaded(true);
      })
      .catch(() => setFontLoaded(true));
  }, []);

  // Hold for 1.8s → start blur/fade exit → fully unmount at 2.8s
  useEffect(() => {
    const timer1 = setTimeout(() => setIsFadingOut(true), 1800);
    const timer2 = setTimeout(() => setIsDone(true), 2800);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <>
      {/* Page content — blurred while loading, sharpens on reveal */}
      <div
        style={{
          filter: isDone ? "none" : isFadingOut ? "blur(0px)" : "blur(12px)",
          transform: isDone ? "none" : isFadingOut ? "scale(1)" : "scale(1.015)",
          opacity: isFadingOut ? 1 : 0,
          transition: isDone
            ? "none"
            : "filter 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
          willChange: "filter, transform",
        }}
      >
        {children}
      </div>

      {/* ── Gowtham Loading Screen Overlay ─────────────────────────────────── */}
      {!isDone && (
        <div
          aria-label="Loading"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#090909",
            opacity: isFadingOut ? 0 : 1,
            pointerEvents: isFadingOut ? "none" : "all",
            backdropFilter: isFadingOut ? "blur(24px)" : "blur(0px)",
            transform: isFadingOut ? "scale(1.06)" : "scale(1)",
            transition: [
              "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
              "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
              "backdrop-filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            ].join(", "),
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
              transform: fontLoaded
                ? isFadingOut ? "translateY(-8px) scale(1.04)" : "translateY(0px) scale(1)"
                : "translateY(12px) scale(0.97)",
              filter: isFadingOut ? "blur(6px)" : "blur(0px)",
              transition: [
                "opacity 0.55s cubic-bezier(0.22,1,0.36,1)",
                "transform 0.75s cubic-bezier(0.22,1,0.36,1)",
                "filter 0.75s cubic-bezier(0.22,1,0.36,1)",
              ].join(", "),
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
        </div>
      )}
    </>
  );
}
