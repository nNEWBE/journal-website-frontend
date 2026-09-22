"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOptionObject {
  value: string;
  label: string;
  style?: React.CSSProperties;
}

export type SelectOption = string | SelectOptionObject;

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  placeholder?: string;
  variant?: "default" | "dark";
  direction?: "auto" | "down" | "up";
  align?: "left" | "right";
  disabled?: boolean;
  size?: "default" | "sm" | "form" | "toolbar";
}

export function formatEnumToTitleCase(str?: string): string {
  if (!str) return "";
  const preserved = new Set(["DOI", "PDF", "ORCID", "ISSN", "ISBN", "URL", "ID", "API", "AI"]);
  if (preserved.has(str)) return str;

  // Check if string contains underscores or is all-uppercase (with letters, length > 1)
  // e.g. "SUBMITTED", "REVIEWER_INVITATION", "DRAFT", "REVIEWS_COMPLETE", "UNDER_REVIEW"
  if (str.includes("_") || (str.length > 1 && str === str.toUpperCase() && /[A-Z]/.test(str))) {
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w) => {
        if (preserved.has(w.toUpperCase())) return w.toUpperCase();
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(" ");
  }

  return str;
}

export function CustomSelect({
  options,
  value,
  onChange,
  className,
  triggerClassName,
  menuClassName,
  optionClassName,
  placeholder = "Select option",
  variant = "default",
  direction = "down",
  align = "left",
  disabled = false,
  size = "default",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [fixedCoords, setFixedCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent | PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isToolbar = size === "toolbar";

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updateCoords = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        const shouldOpenUp =
          direction === "up" ||
          (direction !== "down" && spaceBelow < 220 && spaceAbove > 200);

        const targetWidth = Math.max(rect.width, isToolbar ? 190 : 140);
        let left = rect.left;
        if (align === "right" || left + targetWidth > viewportWidth - 12) {
          left = Math.max(12, rect.right - targetWidth);
        }

        setOpenUpward(shouldOpenUp);
        setFixedCoords({
          top: shouldOpenUp ? undefined : rect.bottom + 4,
          bottom: shouldOpenUp ? viewportHeight - rect.top + 4 : undefined,
          left,
          width: targetWidth,
        });
      };

      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
      return () => {
        window.removeEventListener("scroll", updateCoords, true);
        window.removeEventListener("resize", updateCoords);
      };
    } else {
      setFixedCoords(null);
    }
  }, [isOpen, direction, align, isToolbar]);

  const isDark = variant === "dark";
  const isSm = size === "sm";
  const isForm = size === "form";

  // Normalize options and ensure labels are cleanly formatted in Title Case
  const normalizedOptions: SelectOptionObject[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: formatEnumToTitleCase(opt) };
    }
    return {
      value: opt.value,
      label: formatEnumToTitleCase(opt.label),
      style: opt.style,
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const rawDisplay = selectedOption ? selectedOption.label : value || placeholder;
  const displayLabel = rawDisplay === placeholder ? placeholder : formatEnumToTitleCase(rawDisplay);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        !className?.includes("w-") && (isToolbar ? "w-auto" : "w-full"),
        isToolbar ? "min-w-fit" : isSm ? "min-w-30" : "min-w-35",
        className
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "select-trigger flex w-full items-center justify-between gap-1.5 shadow-xs transition-all outline-none text-left cursor-pointer",
          isToolbar
            ? "h-7 min-h-7 px-2 py-0.5 rounded-sm text-xs font-medium border border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            : isForm
              ? "h-9.5 min-h-9.5 px-3 py-2 rounded-lg text-xs font-normal text-slate-800 border border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:outline-none"
              : isSm
                ? "min-h-8 px-2.5 py-1 rounded-lg text-xs font-semibold"
                : "min-h-10.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isDark
            ? "border border-white/15 bg-white/10 text-white hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-0"
            : !isToolbar && !isForm
              ? "border border-slate-200 bg-white font-bold text-slate-800 hover:border-slate-300 focus:border-slate-300 focus:outline-none focus:ring-0"
              : "",
          triggerClassName
        )}
      >
        <span className="truncate" style={selectedOption?.style}>{displayLabel}</span>
        <ChevronDown
          className={cn(
            "shrink-0 transition-transform duration-200",
            isToolbar ? "h-3 w-3 text-slate-400" : "h-3.5 w-3.5",
            isDark ? "text-white/60" : "text-slate-400",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div
          style={
            isToolbar && fixedCoords
              ? {
                position: "fixed",
                top: fixedCoords.top !== undefined ? `${fixedCoords.top}px` : undefined,
                bottom: fixedCoords.bottom !== undefined ? `${fixedCoords.bottom}px` : undefined,
                left: `${fixedCoords.left}px`,
                width: `${fixedCoords.width}px`,
                zIndex: 99999,
              }
              : undefined
          }
          className={cn(
            isToolbar && fixedCoords ? "fixed z-99999" : "absolute z-100",
            "max-h-64 overflow-y-auto rounded-md shadow-2xl animate-fade p-1 select-none",
            isToolbar ? "min-w-44 border border-slate-300 bg-white text-slate-800" : "w-full min-w-35 p-1.5",
            isDark
              ? "border border-white/15 bg-[#0c1338] text-white backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              : "border border-slate-200 bg-white text-slate-800",
            !isToolbar && (openUpward ? "bottom-full mb-1" : "top-full mt-1"),
            !isToolbar && (align === "right" ? "right-0 left-auto" : "left-0"),
            menuClassName
          )}
        >
          {normalizedOptions.map((option, idx) => {
            const isSelected = option.value === value;
            return (
              <button
                key={`${option.value}-${idx}`}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "select-option flex w-full items-center justify-between rounded-md text-left text-xs transition-colors cursor-pointer",
                  isToolbar ? "py-1 px-2 text-[11.5px] font-medium" : "px-2.5 py-1.5 font-semibold",
                  isDark
                    ? isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    : isSelected
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50",
                  optionClassName
                )}
              >
                <span className="truncate" style={option.style}>{option.label}</span>
                {isSelected && (
                  <Check
                    className={cn(
                      "shrink-0 ml-2",
                      isToolbar ? "h-3 w-3" : "h-3.5 w-3.5",
                      isDark ? "text-amber-400" : "text-blue-600"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
