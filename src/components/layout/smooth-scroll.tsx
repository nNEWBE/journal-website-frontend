"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    // 1. Intercept internal anchor link clicks for smooth animated scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (
        anchor &&
        anchor.hash &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.pushState(null, "", anchor.hash);
        }
      }
    };

    // 2. High-performance scroll optimization: temporarily disable hover repaint triggers during fast scrolling
    let scrollTimer: NodeJS.Timeout | null = null;
    const body = document.body;

    const handleScroll = () => {
      if (!body.classList.contains("is-scrolling")) {
        body.classList.add("is-scrolling");
      }
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        body.classList.remove("is-scrolling");
      }, 150);
    };

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return null;
}
