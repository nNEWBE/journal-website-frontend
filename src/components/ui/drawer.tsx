"use client";

import React, { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener & root scroll lock (locks both html and body to eliminate the outer window scrollbar)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Pause Lenis smooth scroll if active
    if (typeof window !== "undefined" && (window as any).__lenis) {
      (window as any).__lenis.stop();
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const isWindowScrollable =
      document.documentElement.scrollHeight > window.innerHeight ||
      document.body.scrollHeight > window.innerHeight;

    if (isWindowScrollable) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (isWindowScrollable) {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      }

      // Resume Lenis smooth scroll if active
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] flex justify-end overflow-hidden"
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer-panel"
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
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="shrink-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-4.5 shadow-xs">
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

            {/* Scrollable Content Body with dedicated visible scrollbar */}
            <div
              data-lenis-prevent="true"
              className={cn(
                "flex-1 min-h-0 overflow-y-auto p-6 text-slate-800 text-xs drawer-scroll overscroll-contain",
                contentClassName
              )}
            >
              {children}
            </div>

            {/* Optional Sticky Footer */}
            {footer && (
              <div className="shrink-0 z-20 border-t border-slate-200 bg-white px-6 py-3.5 flex items-center justify-end gap-2.5 shadow-xs">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Export Drawer alias
export const Drawer = CustomDrawer;
export type DrawerProps = CustomDrawerProps;

