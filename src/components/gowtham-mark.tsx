import React from "react";

/**
 * GowthamMark - The brand mark/logo component (Stylized 'G')
 */
export function GowthamMark(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props;
  return (
    <div
      className={`font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground inline-flex items-center justify-center ${className || ""}`}
      style={{
        fontFamily: "'JapanDaisuki', serif",
      }}
      {...rest}
    >
      <span
        style={{
          color: "#FA0143",
          textShadow: "0 0 20px rgba(250, 1, 67, 0.5)",
        }}
      >
        G
      </span>
      <span className="text-black dark:text-white">owtham</span>
    </div>
  );
}

/**
 * Generates the SVG string for the Mark (for clipboard functionality).
 */
export function getMarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><text x="50%" y="56%" fill="${color}" text-anchor="middle" dominant-baseline="middle" style="font-family:serif;font-size:188px;font-weight:700;">G</text></svg>`;
}
