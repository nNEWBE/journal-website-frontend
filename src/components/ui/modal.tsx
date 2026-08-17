"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: CustomModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press and lock page scroll completely
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Pause Lenis smooth scroll if active
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow || "unset";
        document.documentElement.style.overflow = originalHtmlOverflow || "unset";

        if (typeof window !== "undefined" && (window as any).__lenis) {
          (window as any).__lenis.start();
        }

        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "relative w-full max-w-md rounded-xl border border-[color:var(--border)] bg-white p-6 shadow-2xl focus:outline-none max-h-[90vh] overflow-y-auto",
              className
            )}
            data-lenis-prevent="true"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[color:var(--border)]">
              <div>
                <h3 className="font-academic text-base font-extrabold text-[color:var(--green-dark)]">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                type="button"
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                title="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
