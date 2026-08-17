"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CustomSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  disabled?: boolean;
}

export function CustomSlider({
  min = 1,
  max = 3,
  step = 0.05,
  value,
  onChange,
  className,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
  disabled = false,
}: CustomSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clamp & calculate percentage
  const safeVal = Math.min(max, Math.max(min, value));
  const percentage = Math.min(100, Math.max(0, ((safeVal - min) / (max - min)) * 100));

  const updateFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackWidth = rect.width;
      if (trackWidth <= 0) return;

      const offsetX = Math.min(Math.max(0, clientX - rect.left), trackWidth);
      const rawRatio = offsetX / trackWidth;
      const rawValue = min + rawRatio * (max - min);

      // Quantize to step
      const steppedValue = Math.round(rawValue / step) * step;
      const finalValue = Math.min(max, Math.max(min, Number(steppedValue.toFixed(4))));

      onChange(finalValue);
    },
    [min, max, step, onChange, disabled]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateFromPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || e.touches.length !== 1) return;
    setIsDragging(true);
    updateFromPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateFromPosition(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        updateFromPosition(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
      window.addEventListener("touchcancel", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchcancel", handleMouseUp);
    };
  }, [isDragging, updateFromPosition]);

  return (
    <div className={cn("flex items-center gap-2.5 select-none w-full", className)}>
      {/* Optional Left Action Icon / Button */}
      {leftIcon && (
        <button
          type="button"
          onClick={onLeftClick}
          disabled={disabled || value <= min}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {leftIcon}
        </button>
      )}

      {/* Slider Track Container */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          "relative flex-1 h-6 flex items-center cursor-pointer group py-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {/* Background Track */}
        <div
          className="w-full bg-slate-200 overflow-hidden relative shadow-inner"
          style={{
            height: "6px",
            borderRadius: "9999px",
          }}
        >
          {/* Active Colored Fill Progress Bar */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
            style={{
              width: `${percentage}%`,
              borderRadius: "9999px",
              transition: isDragging ? "none" : "width 0.08s ease",
            }}
          />
        </div>

        {/* Floating Custom Circular Vector Thumb */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          style={{
            left: `${percentage}%`,
            width: "32px",
            height: "32px",
          }}
        >
          <svg
            width={isDragging ? 26 : 22}
            height={isDragging ? 26 : 22}
            viewBox="0 0 24 24"
            className="overflow-visible transition-all duration-75"
          >
            {/* Outer Glow on drag */}
            {isDragging && (
              <circle
                cx="12"
                cy="12"
                r="11.5"
                fill="rgba(37, 99, 235, 0.3)"
              />
            )}
            {/* Main Blue Circle */}
            <circle
              cx="12"
              cy="12"
              r="8.5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Inner White Dot */}
            <circle
              cx="12"
              cy="12"
              r="2.5"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Optional Right Action Icon / Button */}
      {rightIcon && (
        <button
          type="button"
          onClick={onRightClick}
          disabled={disabled || value >= max}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
}
