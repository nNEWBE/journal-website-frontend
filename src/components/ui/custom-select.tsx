"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  className,
  placeholder = "Select option",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div ref={containerRef} className={cn("relative min-w-[180px]", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2.5 rounded-lg border border-[color:var(--border)] bg-white px-3.5 py-3 text-xs font-bold text-slate-800 shadow-sm transition-all hover:border-slate-300 focus:border-[color:var(--university-green)] focus:ring-1 focus:ring-[color:var(--university-green)] outline-none text-left"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-lg border border-[color:var(--border)] bg-white p-1.5 shadow-xl animate-fade">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer",
                  isSelected && "bg-[color:var(--green-soft)] text-[color:var(--green-dark)] hover:bg-[color:var(--green-soft)]"
                )}
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[color:var(--university-green)] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
