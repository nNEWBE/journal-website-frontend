"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  boxClassName?: string;
  id?: string;
}

export function CustomCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
  boxClassName,
  id,
}: CustomCheckboxProps) {
  const sizeBoxMap = {
    sm: "h-4 w-4 rounded",
    md: "h-4.5 w-4.5 rounded-md",
    lg: "h-5 w-5 rounded-md",
  };

  const sizeIconMap = {
    sm: "h-3 w-3 stroke-[3]",
    md: "h-3.5 w-3.5 stroke-[3]",
    lg: "h-4 w-4 stroke-[3]",
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "group inline-flex items-center gap-2.5 select-none transition-all duration-150 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => {
            if (!disabled) {
              onChange(e.target.checked);
            }
          }}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "border transition-all duration-150 flex items-center justify-center shadow-2xs",
            sizeBoxMap[size] || sizeBoxMap.md,
            checked
              ? "bg-[#0b1b3d] border-[#0b1b3d] text-white shadow-xs ring-2 ring-blue-900/10"
              : "border-slate-300 bg-white group-hover:border-slate-400 group-hover:bg-slate-50",
            boxClassName
          )}
        >
          <Check
            className={cn(
              "transition-all duration-150",
              sizeIconMap[size] || sizeIconMap.md,
              checked ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
          />
        </div>
      </div>

      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && (
            <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900 leading-tight">
              {label}
            </div>
          )}
          {description && (
            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}
    </label>
  );
}
