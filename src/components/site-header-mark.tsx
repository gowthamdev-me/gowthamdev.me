"use client";

export function SiteHeaderMark() {
  return <HeaderGowthamMark />;
}

function HeaderGowthamMark() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <span
        style={{
          fontFamily: "'JapanDaisuki', serif",
          fontSize: "1.45rem",
          color: "#FA0143",
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          userSelect: "none",
        }}
      >
        G
      </span>
    </div>
  );
}

