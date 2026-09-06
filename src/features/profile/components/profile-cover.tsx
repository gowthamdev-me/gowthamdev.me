"use client";

import { useEffect, useState } from "react";
import { BrandContextMenu } from "@/components/brand-context-menu";
import { BlinkingSquaresCanvas, DEFAULT_COVER_SETTINGS, type BlinkingSquaresSettings } from "@/components/ui/blinking-squares";

function renderAccentText(text: string, accentColor: string, baseColor: string, glow: boolean, glowColor: string) {
  if (!text) return null;
  const first = text[0];
  const rest = text.slice(1);
  return (
    <>
      <span
        style={{
          color: accentColor,
          textShadow: glow ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}` : "none",
        }}
      >
        {first}
      </span>
      <span style={{ color: baseColor }}>{rest}</span>
    </>
  );
}

export function ProfileCover({
  initialSettings,
}: {
  initialSettings?: Partial<BlinkingSquaresSettings> | null;
}) {
  const [settings, setSettings] = useState<BlinkingSquaresSettings>(() => ({
    ...DEFAULT_COVER_SETTINGS,
    ...(initialSettings || {}),
  }));

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.coverSettings && typeof data.coverSettings === "object") {
          setSettings({ ...DEFAULT_COVER_SETTINGS, ...data.coverSettings });
        }
      })
      .catch(() => {});
  }, []);

  const fontSize = `clamp(1.5rem, ${settings.textFontSize * 0.07}vw + 0.8rem, ${settings.textFontSize / 11}rem)`;
  const letterSpacing = `${settings.textLetterSpacing / 100}em`;
  const fontStyle: React.CSSProperties = {
    fontFamily: "'JapanDaisuki', serif",
    fontSize,
    fontWeight: settings.textWeight,
    letterSpacing,
    lineHeight: 1.1,
  };

  const positionClass =
    settings.textPosition === "top"
      ? "items-start pt-4 sm:pt-6"
      : settings.textPosition === "bottom"
      ? "items-end pb-4 sm:pb-6"
      : "items-center";

  return (
    <BrandContextMenu>
      <div className="relative aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1] select-none overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] bg-black border border-zinc-800">
        {/* Blinking squares background */}
        <BlinkingSquaresCanvas {...settings} />

        {/* Brand text overlay */}
        {settings.textEnabled && (
          <div className={`relative z-10 flex flex-row items-center justify-center gap-2.5 sm:gap-4 h-full w-full pointer-events-none ${positionClass}`}>
            {/* Prefix word e.g. "I'm" */}
            {settings.textPrefix && (
              <span
                style={fontStyle}
                className="inline-block"
              >
                {renderAccentText(
                  settings.textPrefix,
                  settings.textAccentColor,
                  settings.textColor,
                  settings.textGlow,
                  settings.textGlowColor,
                )}
              </span>
            )}
            {/* Name word e.g. "Gowtham" */}
            {settings.textName && (
              <span
                style={fontStyle}
                className="inline-block"
              >
                {renderAccentText(
                  settings.textName,
                  settings.textAccentColor,
                  settings.textColor,
                  settings.textGlow,
                  settings.textGlowColor,
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </BrandContextMenu>
  );
}
