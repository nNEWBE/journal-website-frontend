"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    // If on a dashboard route, do not run smooth scrolling
    if (isDashboard) {
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.destroy();
        (window as any).__lenis = null;
      }
      return;
    }

    // Initialize Lenis smooth scroll engine for public content pages
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    if (typeof window !== "undefined") {
      (window as any).__lenis = lenis;
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    }

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Smooth Anchor Link Interceptor
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (
        anchor &&
        anchor.hash &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        const targetElement = document.querySelector(anchor.hash) as HTMLElement | null;
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -30,
            duration: 1.2,
          });
          window.history.pushState(null, "", anchor.hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      if (typeof window !== "undefined") {
        (window as any).__lenis = null;
      }
    };
  }, [isDashboard, pathname]);

  return null;
}

