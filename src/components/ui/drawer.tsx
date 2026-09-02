"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  icon?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-3xl",
  full: "max-w-4xl",
};

export function CustomDrawer({
  isOpen,
  onClose,
  title,
  description,
  badge,
  icon: Icon,
  size = "lg",
  children,
  footer,
  className,
  contentClassName,
}: CustomDrawerProps) {
  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={cn(
              "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl overflow-hidden border-l border-slate-200",
              sizeClasses[size] || "max-w-xl",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white/95 px-6 py-4.5 backdrop-blur-md">
              <div className="flex items-start gap-3 min-w-0 flex-1 pr-4">
                {Icon && (
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-academic text-base font-bold text-slate-900 leading-snug truncate">
                      {title}
                    </h3>
                    {badge}
                  </div>
                  {description && (
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close drawer (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-6 text-slate-800 text-xs sidebar-scroll",
                contentClassName
              )}
            >
              {children}
            </div>

            {/* Optional Sticky Footer */}
            {footer && (
              <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-slate-50/95 px-6 py-3.5 backdrop-blur-md flex items-center justify-end gap-2.5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
