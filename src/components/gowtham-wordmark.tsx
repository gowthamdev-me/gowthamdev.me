import React from "react";

/**
 * GowthamWordmark - The brand logotype component (Stylized "Gowtham" text)
 */
export function GowthamWordmark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 800 200"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "'JapanDaisuki', serif",
          fontSize: "120px",
          fontWeight: 700,
        }}
      >
        Gowtham
      </text>
    </svg>
  );
}

/**
 * Generates the SVG string for the Wordmark (for clipboard functionality).
 */
export function getWordmarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200"><text x="50%" y="50%" fill="${color}" text-anchor="middle" dominant-baseline="middle" style="font-family:serif;font-size:120px;font-weight:700;">Gowtham</text></svg>`;
}

