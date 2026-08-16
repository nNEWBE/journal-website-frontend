"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function CustomCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  id,
}: CustomCheckboxProps) {
  return (
    <label
      htmlFor={id}
      onClick={(e) => {
        if (disabled) return;
        // If clicking a link inside description, don't toggle
        if ((e.target as HTMLElement).tagName === "A") return;
        onChange(!checked);
      }}
      className={cn(
        "group flex items-start gap-3.5 select-none transition-all duration-150 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "h-5 w-5 rounded-md border transition-all duration-200 flex items-center justify-center shadow-xs",
            checked
              ? "bg-[color:var(--color-gb-blue)] border-[color:var(--color-gb-blue)] text-white ring-2 ring-blue-500/20"
              : "border-slate-300 bg-white group-hover:border-slate-400 group-hover:bg-slate-50"
          )}
        >
          <Check
            className={cn(
              "h-3.5 w-3.5 transition-all duration-200 stroke-[3]",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
          />
        </div>
      </div>

      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && (
            <div className="text-xs font-bold text-slate-900 leading-tight">
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
