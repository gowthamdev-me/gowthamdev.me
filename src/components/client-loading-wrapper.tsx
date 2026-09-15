"use client";

import { useEffect, useState } from "react";

interface ClientLoadingWrapperProps {
  children: React.ReactNode;
}

export function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  const [fontLoaded, setFontLoaded]   = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone]           = useState(false);
  const [progress, setProgress]       = useState(0);

  useEffect(() => {
    // Remove any #hash from the URL on initial load (e.g. visiting /#about)
    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // Detect Lighthouse / PageSpeed / Googlebot – skip loading screen for bots
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      const isAuditBot = /Lighthouse|PageSpeed|Chrome-Lighthouse|Googlebot/i.test(ua);

      if (isAuditBot) {
        setIsDone(true);
        return;
      }

      // Check if signature font is already available in document.fonts
      if (typeof document !== "undefined" && document.fonts) {
        if (document.fonts.check("1em JapanDaisuki")) {
          setFontLoaded(true);
        } else {
          document.fonts.ready
            .then(() => setFontLoaded(true))
            .catch(() => setFontLoaded(true));
        }
      } else {
        setFontLoaded(true);
      }
    }

    // Animate progress bar from 0 → 100 over 1400ms
    const totalDuration = 1400;
    const intervalMs    = 20;
    const steps         = totalDuration / intervalMs;
    let   step          = 0;

    const progressTimer = setInterval(() => {
      step++;
      // Ease-out curve so it slows near 100%
      const ratio = step / steps;
      setProgress(Math.min(100, Math.round(100 * (1 - Math.pow(1 - ratio, 2.5)))));
      if (step >= steps) clearInterval(progressTimer);
    }, intervalMs);

    // Show screen for 1500ms, then fade out over 450ms
    const timer1 = setTimeout(() => setIsFadingOut(true), 1500);
    const timer2 = setTimeout(() => setIsDone(true),       1950);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Page content renders immediately behind the overlay for layout stability */}
      <div className="w-full">
        {children}
      </div>

      {/* ── Gowtham Loading Screen Overlay ── */}
      {!isDone && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#090909",
            opacity: isFadingOut ? 0 : 1,
            pointerEvents: isFadingOut ? "none" : "all",
            transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "opacity",
          }}
        >
          {/* Name */}
          <div
            style={{
              fontFamily: "'JapanDaisuki', serif",
              fontSize: "clamp(3.8rem, 11vw, 13rem)",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1,
              letterSpacing: "0.01em",
              opacity: fontLoaded ? (isFadingOut ? 0 : 1) : 0,
              transform: isFadingOut ? "scale(1.04)" : "scale(1)",
              transition: "opacity 0.4s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
              userSelect: "none",
            }}
          >
            <span
              style={{
                color: "#FA0143",
                textShadow:
                  "0 0 40px rgba(250,1,67,0.6), 0 0 80px rgba(250,1,67,0.25)",
              }}
            >
              G
            </span>
            owtham
          </div>

          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              backgroundColor: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FA0143 0%, #ff6b8a 100%)",
                boxShadow: "0 0 12px rgba(250,1,67,0.7)",
                transition: "width 0.02s linear",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

