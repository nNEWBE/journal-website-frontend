"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Search,
  UserCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import type { Submission } from "@/lib/data";
import { statusConfig } from "./workspace-data";

interface ArticleDetailDrawerProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleDetailDrawer({
  submission,
  isOpen,
  onClose,
}: ArticleDetailDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (typeof window !== "undefined" && (window as any).__lenis) {
      (window as any).__lenis.stop();
    }

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.paddingRight = "";
      // Instantly restore scroll position without animation
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
      document.documentElement.style.scrollBehavior = "";

      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !submission || typeof window === "undefined") return null;

  const cfg = statusConfig[submission.status] ?? {
    label: submission.status,
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Search,
  };
  const StatusIcon = cfg.icon;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden">
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-[color:var(--color-gb-blue-soft)] px-2.5 py-1 font-mono text-xs font-black text-[color:var(--color-gb-blue)]">
              {submission.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}
            >
              <StatusIcon className="h-3 w-3" />
              {cfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
            title="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {(submission as any).track || submission.type}
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900 leading-snug">
              {submission.title}
            </h2>
          </div>

          {/* Author info */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Corresponding Author
                </p>
                <p className="text-xs font-extrabold text-slate-800">
                  {submission.author}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Submitted Date
                </p>
                <p className="text-xs font-extrabold text-slate-800">
                  {(submission as any).submittedDate || submission.updated}
                </p>
              </div>
            </div>
          </div>

          {/* Abstract */}
          {(submission as any).abstract && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Abstract
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {(submission as any).abstract}
              </p>
            </div>
          )}

          {/* Reviewers Assigned */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Peer Reviewers ({submission.reviewers.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {submission.reviewers.length > 0 ? (
                submission.reviewers.map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    {r}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No reviewers assigned yet
                </span>
              )}
            </div>
          </div>

          {/* Download attachments placeholder */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              Manuscript Files (PDF, DOCX)
            </span>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue)] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer">
              <Download className="h-3.5 w-3.5" />
              Download All
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>,
    document.body
  );
}
