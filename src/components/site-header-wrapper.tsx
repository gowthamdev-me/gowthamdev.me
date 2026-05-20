"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState, useRef } from "react";

export function SiteHeaderWrapper(props: React.ComponentProps<"header">) {
  const { scrollY } = useScroll();

  const [affix, setAffix] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setAffix(latestValue >= 8);

    // Check if we're on mobile at runtime (max-width: 768px for md breakpoint)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    // Hide/show nav on MOBILE ONLY based on scroll direction
    if (isMobile) {
      const scrollDelta = latestValue - lastScrollYRef.current;
      
      if (scrollDelta > 5 && latestValue > 50) {
        // Scrolling down - hide completely
        setIsVisible(false);
      } else if (scrollDelta < -10) {
        // Scrolling up - show immediately
        setIsVisible(true);
      }
    } else {
      // Desktop: always show header
      setIsVisible(true);
    }

    lastScrollYRef.current = latestValue;
  });

  return (
    <header
      data-affix={affix}
      className="transition-transform duration-300 sm:translate-y-0"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(calc(-100% - 20px))",
      }}
      {...props}
    />
  );
}

