"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import * as motion from "motion/react-m";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import LogoImg from "@/Logo.png";

export function SiteHeaderMark() {
  return <HeaderGowthamMark />;
}

function HeaderGowthamMark() {
  return (
    <div
      className="flex items-center justify-center w-full h-full p-0.5"
    >
      <Image
        src={LogoImg}
        alt="Gowtham Logo"
        width={48}
        height={48}
        className="w-full h-full object-contain scale-110"
        style={{
          borderRadius: 6,
          background: "transparent",
        }}
        priority
      />
    </div>
  );
}

function GowthamMarkMotion() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const distanceRef = useRef(160);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= distanceRef.current);
  });

  useEffect(() => {
    const coverMark = document.getElementById("js-cover-mark");
    if (!coverMark) return;

    distanceRef.current = calcDistance(coverMark);

    const resizeObserver = new ResizeObserver(() => {
      distanceRef.current = calcDistance(coverMark);
    });
    resizeObserver.observe(coverMark);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      className="flex items-center justify-center w-full h-full p-0.5"
      initial={{ opacity: 0, transform: "translateY(8px)" }}
      animate={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(8px)",
      }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={LogoImg}
        alt="Gowtham Logo"
        width={48}
        height={48}
        className="w-full h-full object-contain scale-110"
        style={{ borderRadius: 6, background: "transparent" }}
      />
    </motion.div>
  );
}

const calcDistance = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const scrollTop = document.documentElement.scrollTop;
  const headerHeight = 56;
  return scrollTop + rect.top + rect.height - headerHeight;
};
