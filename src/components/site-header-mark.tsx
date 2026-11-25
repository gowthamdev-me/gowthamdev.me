"use client";

export function SiteHeaderMark() {
  return <HeaderGowthamMark />;
}

function HeaderGowthamMark() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <span
        className="text-[1.45rem] sm:text-[1.7rem] font-black select-none leading-none flex items-center justify-center"
        style={{
          fontFamily: "'JapanDaisuki', serif",
          color: "#FA0143",
          WebkitTextStroke: "1.4px #FA0143",
          transform: "translate(0.5px, 3px)",
        }}
      >
        G
      </span>
    </div>
  );
}

