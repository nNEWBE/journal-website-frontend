"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOptionObject {
  value: string;
  label: string;
}

export type SelectOption = string | SelectOptionObject;

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  variant?: "default" | "dark";
  direction?: "auto" | "down" | "up";
  disabled?: boolean;
  size?: "default" | "sm" | "form";
}

export function CustomSelect({
  options,
  value,
  onChange,
  className,
  placeholder = "Select option",
  variant = "default",
  direction = "down",
  disabled = false,
  size = "default",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      if (direction === "down") {
        setOpenUpward(false);
        return;
      }
      if (direction === "up") {
        setOpenUpward(true);
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Only open upward if space below is severely restricted and space above is abundant
      setOpenUpward(spaceBelow < 180 && spaceAbove > 240);
    }
  }, [isOpen, direction]);

  const isDark = variant === "dark";
  const isSm = size === "sm";
  const isForm = size === "form";

  // Normalize options
  const normalizedOptions: SelectOptionObject[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value || placeholder;

  return (
    <div ref={containerRef} className={cn("relative w-full", isSm ? "min-w-[120px]" : "min-w-[140px]", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "select-trigger flex w-full items-center justify-between gap-2 shadow-xs transition-all outline-none text-left",
          isForm
            ? "h-[38px] min-h-[38px] px-3 py-2 rounded-lg text-xs font-normal text-slate-800"
            : isSm
            ? "min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold"
            : "min-h-[42px] px-3.5 py-2.5 rounded-xl text-xs font-semibold",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isDark
            ? "border border-white/15 bg-white/10 text-white hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-0"
            : isForm
            ? "border border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:outline-none"
            : "border border-slate-200 bg-white font-bold text-slate-800 hover:border-slate-300 focus:border-slate-300 focus:outline-none focus:ring-0"
        )}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            isDark ? "text-white/60" : "text-slate-400",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute z-[100] w-full min-w-[140px] max-h-60 overflow-y-auto rounded-xl shadow-2xl animate-fade p-1.5",
            isDark
              ? "border border-white/15 bg-[#0c1338] text-white backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              : "border border-[color:var(--border)] bg-white",
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "select-option flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors cursor-pointer",
                  isDark
                    ? isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    : isSelected
                    ? "bg-[color:var(--green-soft)] text-[color:var(--green-dark)] hover:bg-[color:var(--green-soft)]"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span className="truncate capitalize">{option.label}</span>
                {isSelected && (
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 ml-2",
                      isDark ? "text-amber-400" : "text-[color:var(--university-green)]"
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
