"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// ── SVG path data — identical to SVG-Page-transition-main ────────────────────
const PATH_1 =
  "M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262";

const PATH_2 =
  "M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012";

// ── Portfolio brand colors ─────────────────────────────────────────────────────
const STROKE_DARK = "#1e1e1e";
const STROKE_RED  = "#FA0143";

// ── Poll until GSAP is available ──────────────────────────────────────────────
function waitForGsap(): Promise<any> {
  return new Promise((resolve) => {
    if ((window as any).gsap) { resolve((window as any).gsap); return; }
    const id = setInterval(() => {
      if ((window as any).gsap) { clearInterval(id); resolve((window as any).gsap); }
    }, 30);
    setTimeout(() => clearInterval(id), 10_000);
  });
}

function isInternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("http") && !href.startsWith(window.location.origin)) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// PageTransition
//
// HOW THE TIMING IS FIXED:
//   Old approach: listen to usePathname → fires AFTER page already rendered
//                 → new page flashes, THEN animation shows (wrong order)
//
//   New approach:
//     1. Intercept <a> clicks at document level (before navigation)
//     2. preventDefault → run leave() (paths draw IN, cover screen)
//     3. router.push(href)   → new page renders under the covered screen
//     4. usePathname fires   → run enter() (paths draw OUT, reveal new page)
//
//   Result: old page → cover → new page revealed (correct order, no flash)
// ─────────────────────────────────────────────────────────────────────────────
export function PageTransition() {
  const router      = useRouter();
  const pathname    = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const svgRef      = useRef<SVGSVGElement>(null);

  // Shared state between click handler and pathname listener
  const isLeaving   = useRef(false); // leave() is running
  const pendingEnter = useRef(false); // pathname changed while leaving → run enter()

  // ── Initialise path dash on mount ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      await waitForGsap();
      if (!svgRef.current) return;
      Array.from(svgRef.current.querySelectorAll<SVGPathElement>("path")).forEach(
        (p) => {
          const len = p.getTotalLength();
          p.style.strokeDasharray  = String(len);
          p.style.strokeDashoffset = String(len); // invisible at rest
        }
      );
    })();
  }, []);

  // ── enter() helper — draw paths OUT, reveal page ──────────────────────────
  const runEnter = async () => {
    const gsap = await waitForGsap();
    if (!svgRef.current) return;
    const paths = Array.from(
      svgRef.current.querySelectorAll<SVGPathElement>("path")
    );
    await new Promise<void>((res) => {
      const tl = gsap.timeline({ onComplete: res });
      paths.forEach((p) => {
        const len = p.getTotalLength();
        tl.to(p, {
          strokeDashoffset: -len,
          attr: { "stroke-width": 200 },
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: () => gsap.set(p, { strokeDashoffset: len }),
        }, 0);
      });
    });
  };

  // ── Intercept ALL internal <a> clicks before navigation ───────────────────
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!isInternalHref(href)) return;

      // Normalise to pathname
      const targetPath = href.startsWith("/")
        ? href.split("?")[0]
        : new URL(href, window.location.origin).pathname;

      // Skip if same page or already animating
      if (targetPath === window.location.pathname) return;
      if (isLeaving.current) return;

      e.preventDefault();
      isLeaving.current = true;
      pendingEnter.current = false;

      const gsap = await waitForGsap();
      if (!svgRef.current) { isLeaving.current = false; return; }

      const paths = Array.from(
        svgRef.current.querySelectorAll<SVGPathElement>("path")
      );

      // ── leave(): draw paths IN — cover current page ─────────────────────
      await new Promise<void>((res) => {
        const tl = gsap.timeline({ onComplete: res });
        paths.forEach((p) => {
          tl.to(p, {
            strokeDashoffset: 0,
            attr: { "stroke-width": 700 },
            duration: 0.7,
            ease: "power2.inOut",
          }, 0);
        });
      });

      // Navigate — new page loads under the covered screen
      router.push(href);

      // If pathname already changed by now (fast navigation), run enter immediately
      if (pendingEnter.current) {
        pendingEnter.current = false;
        isLeaving.current = false;
        await runEnter();
      } else {
        isLeaving.current = false;
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ── Detect pathname change → run enter() ──────────────────────────────────
  useEffect(() => {
    // Skip the initial mount (not a navigation)
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    if (isLeaving.current) {
      // leave() is still running — signal it to run enter() when done
      pendingEnter.current = true;
    } else {
      // leave() already finished — run enter() now
      runEnter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── SVG always in DOM; paths are invisible at rest ────────────────────────
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(1.5)",
        width: "100%",
        height: "100%",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 2453 2535"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Paths start invisible — GSAP initialises the real dasharray on mount */}
        <path d={PATH_1} stroke={STROKE_DARK} strokeWidth="200" strokeLinecap="round"
          style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }} />
        <path d={PATH_2} stroke={STROKE_RED}  strokeWidth="200" strokeLinecap="round"
          style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }} />
      </svg>
    </div>
  );
}
