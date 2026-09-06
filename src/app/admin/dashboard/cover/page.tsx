"use client";

import { useEffect, useState } from "react";
import {
  BlinkingSquaresCanvas,
  DEFAULT_COVER_SETTINGS,
  type BlinkingSquaresSettings,
} from "@/components/ui/blinking-squares";

/* ── UI primitives ─────────────────────────────────────────────────── */

function CardTitle({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 pb-1 border-b border-zinc-700/30 flex items-center gap-1.5">
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-zinc-800/80 last:border-0">
      <span className="text-[11px] text-zinc-300 shrink-0 font-medium">{label}</span>
      <div className="flex-1 flex justify-end items-center">{children}</div>
    </div>
  );
}

function Slider({ value, onChange, min, max, step = 1, label }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; label?: string | number;
}) {
  return (
    <div className="flex items-center gap-1.5 w-full max-w-[170px] justify-end">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-20 sm:w-24 h-1.5 bg-zinc-700 rounded-lg accent-blue-500 cursor-pointer"
      />
      <span className="text-[10px] text-zinc-400 w-11 text-right tabular-nums font-mono">{label ?? value}</span>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-7.5 h-4 rounded-full transition-colors duration-200 focus:outline-none ${value ? "bg-blue-600" : "bg-zinc-700"}`}
      style={{ width: "30px", height: "16px" }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow-sm ${
          value ? "translate-x-3.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Select({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-[11px] rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28 sm:w-32"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-900 border border-zinc-700/80 text-white text-[11px] rounded-lg px-2 py-0.5 w-28 sm:w-32 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
    />
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        value={value.startsWith("#") ? value : "#FA0143"}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
      />
      <span className="text-[10px] text-zinc-400 font-mono w-14 text-right truncate">{value}</span>
    </div>
  );
}

const PRESETS: Record<string, string[]> = {
  "Red / White": ["#FFFFFF", "#FF3B30", "#000000", "#FFFFFF", "#FF3B30"],
  "Ocean":       ["#00A9FF", "#3DDC97", "#8B94A3", "#EDEDED", "#00A9FF"],
  "Sunset":      ["#FFAB00", "#FF2975", "#BB29FF", "#29D9FF", "#FFFFFF"],
  "Mono White":  ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
  "Gold":        ["#FFD700", "#FFA500", "#FFFFFF", "#FFD700", "#FFA500"],
};

/* ── Exact Home Page Cover Text Renderer ───────────────────────────── */
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

/* ── Exact Home Page Cover Preview Component ───────────────────────── */
function ExactProfileCoverPreview({ settings }: { settings: BlinkingSquaresSettings }) {
  const fontSize = `clamp(1.3rem, ${settings.textFontSize * 0.07}vw + 0.8rem, ${settings.textFontSize / 11}rem)`;
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
      ? "items-start pt-3 sm:pt-4"
      : settings.textPosition === "bottom"
      ? "items-end pb-3 sm:pb-4"
      : "items-center";

  return (
    <div className="relative w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1] max-h-[160px] select-none overflow-hidden rounded-[18px] sm:rounded-[24px] lg:rounded-[32px] bg-black border border-zinc-800 shadow-2xl">
      {/* Blinking squares canvas - exact home page component */}
      <BlinkingSquaresCanvas {...settings} />

      {/* Brand text overlay - exact home page rendering */}
      {settings.textEnabled && (
        <div className={`relative z-10 flex flex-row items-center justify-center gap-2.5 sm:gap-4 h-full w-full pointer-events-none ${positionClass}`}>
          {settings.textPrefix && (
            <span
              style={fontStyle}
              className="inline-block drop-shadow-md"
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
          {settings.textName && (
            <span
              style={fontStyle}
              className="inline-block drop-shadow-md"
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
  );
}

/* ── Main Admin Page ────────────────────────────────────────────────── */
export default function AdminCoverPage() {
  const [settings, setSettings] = useState<BlinkingSquaresSettings>(DEFAULT_COVER_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/cover-settings")
      .then((r) => r.json())
      .then((data) => { if (data && !data.error) setSettings({ ...DEFAULT_COVER_SETTINGS, ...data }); })
      .catch(() => {});
  }, []);

  const set = <K extends keyof BlinkingSquaresSettings>(key: K) =>
    (val: BlinkingSquaresSettings[K]) => setSettings((s) => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/cover-settings", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings),
      });
      setMessage(res.ok ? "Saved successfully!" : "Save failed");
    } catch { setMessage("Error saving"); }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-2.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Cover Background
            <span className="text-[10px] font-normal px-2 py-0.5 bg-zinc-800 border border-zinc-700/60 text-zinc-400 rounded-full">
              Live Home Preview
            </span>
          </h1>
          <p className="text-[11px] text-zinc-400">Customizes hero banner pattern, animation speed, fade, and signature text</p>
        </div>
        <div className="flex items-center gap-2">
          {message && (
            <span className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-medium ${
              message.includes("Saved") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              {message}
            </span>
          )}
          <button
            type="button"
            onClick={() => setSettings(DEFAULT_COVER_SETTINGS)}
            className="px-3 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-all border border-zinc-700/60 font-medium"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-3.5 py-1 text-[11px] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── EXACT FULL-WIDTH HOME COVER PREVIEW ── */}
      <ExactProfileCoverPreview settings={settings} />

      {/* ── 3 COMPACT CONTROL COLUMNS (FIT ON ONE SCREEN) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-start">
        
        {/* COLUMN 1: Background Animation */}
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-2.5 backdrop-blur-sm shadow-sm">
          <CardTitle icon="⬛">Background Animation</CardTitle>
          <div className="space-y-0.5">
            <Row label="Grid Size">
              <Slider value={settings.gridSize} onChange={set("gridSize")} min={4} max={120} />
            </Row>
            <Row label="Fill (%)">
              <Slider value={settings.fillPercent} onChange={set("fillPercent")} min={10} max={100} />
            </Row>
            <Row label="Color Mode">
              <Select
                value={settings.colorMode}
                onChange={set("colorMode") as (v: string) => void}
                options={[{ value: "single", label: "Single Color" }, { value: "multiple", label: "Multi Palette" }]}
              />
            </Row>
            {settings.colorMode === "single" ? (
              <Row label="Square Color">
                <ColorPicker value={settings.squareColor} onChange={set("squareColor")} />
              </Row>
            ) : (
              <Row label="Palette">
                <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                  {Object.entries(PRESETS).map(([name, cols]) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => set("colors")(cols)}
                      title={name}
                      className="flex gap-0.5 p-1 rounded bg-zinc-900 border border-zinc-700 hover:border-blue-400 transition-all"
                    >
                      {cols.map((c, i) => (
                        <span key={i} style={{ background: c }} className="w-2.5 h-2.5 rounded-[2px] block" />
                      ))}
                    </button>
                  ))}
                </div>
              </Row>
            )}
            <Row label="Speed">
              <Slider value={settings.twinkleSpeed} onChange={set("twinkleSpeed")} min={1} max={100} />
            </Row>
            <Row label="Opacity">
              <Slider
                value={settings.opacity}
                onChange={set("opacity")}
                min={0}
                max={1}
                step={0.01}
                label={settings.opacity.toFixed(2)}
              />
            </Row>
            <Row label="Blur (px)">
              <Slider value={settings.blur} onChange={set("blur")} min={0} max={40} />
            </Row>
          </div>
        </div>

        {/* COLUMN 2: Text & Typography */}
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-2.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-700/30">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span>✏️</span>
              <span>Text &amp; Font</span>
            </span>
            <Toggle value={settings.textEnabled} onChange={set("textEnabled")} />
          </div>
          {settings.textEnabled ? (
            <div className="space-y-0.5">
              <Row label="Prefix Word">
                <TextInput value={settings.textPrefix} onChange={set("textPrefix")} placeholder="I'm" />
              </Row>
              <Row label="Name Word">
                <TextInput value={settings.textName} onChange={set("textName")} placeholder="Gowtham" />
              </Row>
              <Row label="Font Size">
                <Slider
                  value={settings.textFontSize}
                  onChange={set("textFontSize")}
                  min={16}
                  max={100}
                  label={`${(settings.textFontSize / 10).toFixed(1)}rem`}
                />
              </Row>
              <Row label="Weight">
                <Select
                  value={String(settings.textWeight)}
                  onChange={(v) => set("textWeight")(Number(v) as BlinkingSquaresSettings["textWeight"])}
                  options={[
                    { value: "400", label: "400 - Regular" },
                    { value: "500", label: "500 - Medium" },
                    { value: "600", label: "600 - SemiBold" },
                    { value: "700", label: "700 - Bold" },
                    { value: "800", label: "800 - ExtraBold" },
                    { value: "900", label: "900 - Black" },
                  ]}
                />
              </Row>
              <Row label="Spacing">
                <Slider
                  value={settings.textLetterSpacing}
                  onChange={set("textLetterSpacing")}
                  min={-10}
                  max={50}
                  label={`${(settings.textLetterSpacing / 100).toFixed(2)}em`}
                />
              </Row>
              <Row label="Position">
                <Select
                  value={settings.textPosition}
                  onChange={set("textPosition") as (v: string) => void}
                  options={[
                    { value: "top", label: "Top" },
                    { value: "center", label: "Center" },
                    { value: "bottom", label: "Bottom" },
                  ]}
                />
              </Row>
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500 py-6 text-center italic">Text overlay disabled</p>
          )}
        </div>

        {/* COLUMN 3: Colors, Fade & Cursor */}
        <div className="space-y-2.5">
          {/* Colors & Glow */}
          {settings.textEnabled && (
            <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-2.5 backdrop-blur-sm shadow-sm">
              <CardTitle icon="🎨">Colors &amp; Glow</CardTitle>
              <div className="space-y-0.5">
                <Row label="Accent Color">
                  <ColorPicker value={settings.textAccentColor} onChange={set("textAccentColor")} />
                </Row>
                <Row label="Text Color">
                  <ColorPicker value={settings.textColor} onChange={set("textColor")} />
                </Row>
                <Row label="Glow Effect">
                  <Toggle value={settings.textGlow} onChange={set("textGlow")} />
                </Row>
                {settings.textGlow && (
                  <Row label="Glow Color">
                    <TextInput
                      value={settings.textGlowColor}
                      onChange={set("textGlowColor")}
                      placeholder="rgba(250,1,67,0.55)"
                    />
                  </Row>
                )}
              </div>
            </div>
          )}

          {/* Fade & Cursor Interaction */}
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-2.5 backdrop-blur-sm shadow-sm">
            <CardTitle icon="🌫️">Fade &amp; Cursor</CardTitle>
            <div className="space-y-0.5">
              <Row label="Fade Dir">
                <Select
                  value={settings.fadeDirection}
                  onChange={set("fadeDirection") as (v: string) => void}
                  options={[
                    { value: "none", label: "None" },
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                    { value: "top", label: "Top" },
                    { value: "bottom", label: "Bottom" },
                  ]}
                />
              </Row>
              <Row label="Fade (%)">
                <Slider value={settings.fadePercent} onChange={set("fadePercent")} min={0} max={100} />
              </Row>
              <Row label="Cursor Glow">
                <Toggle value={settings.hasCursorInteraction} onChange={set("hasCursorInteraction")} />
              </Row>
              {settings.hasCursorInteraction && (
                <>
                  <Row label="Radius (px)">
                    <Slider value={settings.cursorRadius} onChange={set("cursorRadius")} min={10} max={400} />
                  </Row>
                  <Row label="Boost (%)">
                    <Slider value={settings.cursorBoost} onChange={set("cursorBoost")} min={0} max={100} />
                  </Row>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


