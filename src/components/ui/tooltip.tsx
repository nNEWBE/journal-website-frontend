"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
  className?: string;
  delayMs?: number;
}

export function CustomTooltip({
  content,
  children,
  side = "right",
  disabled = false,
  className,
  delayMs = 80,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = rect.top + rect.height / 2;
    let left = rect.right + 10;

    if (side === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + 10;
    } else if (side === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - 10;
    } else if (side === "top") {
      top = rect.top - 10;
      left = rect.left + rect.width / 2;
    } else if (side === "bottom") {
      top = rect.bottom + 10;
      left = rect.left + rect.width / 2;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    updatePosition();
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isVisible) {
        updatePosition();
      }
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isVisible]);

  if (!content || disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className="relative flex w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && coords && (
        <div
          role="tooltip"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform:
              side === "right"
                ? "translateY(-50%)"
                : side === "left"
                ? "translate(-100%, -50%)"
                : side === "top"
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
          }}
          className={cn(
            "fixed z-[99999] pointer-events-none flex items-center animate-in fade-in zoom-in-95 duration-150",
            className
          )}
        >
          <div className="rounded-lg border border-white/20 bg-[#070e24]/95 px-3 py-1.5 text-xs font-semibold text-white tracking-wide shadow-2xl backdrop-blur-md whitespace-nowrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
