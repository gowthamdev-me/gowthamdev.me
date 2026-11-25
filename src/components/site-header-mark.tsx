"use client";

export function SiteHeaderMark() {
  return <HeaderGowthamMark />;
}

function HeaderGowthamMark() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <span
        className="text-[1.35rem] sm:text-[1.6rem] font-black select-none leading-none flex items-center justify-center"
        style={{
          fontFamily: "'JapanDaisuki', serif",
          color: "#FA0143",
          WebkitTextStroke: "1.1px #FA0143",
          transform: "translate(0.5px, 1px)",
        }}
      >
        G
      </span>
    </div>
  );
}

