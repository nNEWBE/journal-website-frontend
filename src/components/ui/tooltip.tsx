"use client";

import React, { useState } from "react";
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
  delayMs = 100,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  if (!content || disabled) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
  };

  return (
    <div
      className="relative flex w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 pointer-events-none flex items-center shadow-xl animate-in fade-in zoom-in-95 duration-150",
            sideClasses[side],
            className
          )}
        >
          <div className="rounded-lg border border-white/15 bg-[#0a122c]/95 px-2.5 py-1 text-[11px] font-semibold text-white tracking-wide shadow-2xl backdrop-blur-md whitespace-nowrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
