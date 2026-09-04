"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Mail,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    // Log error to console for diagnostic reporting
    console.error("Portal Runtime Exception:", error);
  }, [error]);

  return (
    <PageShell>
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/30 via-white to-slate-50/50">
        <div className="w-full max-w-2xl mx-auto space-y-8 text-center">
          {/* Top Status & Warning Badge */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-bold shadow-2xs">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>Portal Synchronization Notice • Error 500</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-academic font-bold text-slate-900 tracking-tight">
              An Unexpected System Interruption Occurred
            </h1>

            <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              The academic portal encountered a temporary execution issue while processing your request.
              Our technical administrators have received the incident log.
            </p>
          </div>

          {/* Data Safety Assurance Banner */}
          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-emerald-900 text-xs font-medium max-w-lg mx-auto text-left shadow-2xs">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-bold text-emerald-950">Your Data & Submissions Are Safe</p>
              <p className="text-[11px] text-emerald-800/90 mt-0.5">
                Manuscript drafts, peer review scorecards, and uploaded files are persisted and uncorrupted.
              </p>
            </div>
          </div>

          {/* Primary Recovery Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Reload Page</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Home className="h-4 w-4 text-slate-500" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>Report Issue</span>
            </Link>
          </div>

          {/* Technical Diagnostic Details (Expandable) */}
          <div className="pt-4 border-t border-slate-200/70 text-left max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5 font-mono">
                <FileCode className="h-3.5 w-3.5 text-slate-400" />
                <span>Technical Diagnostics {error.digest ? `(${error.digest})` : ""}</span>
              </span>
              {showTechnicalDetails ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-2.5 rounded-xl bg-slate-900 text-slate-200 p-4 text-[11px] font-mono leading-relaxed overflow-x-auto space-y-1.5 border border-slate-800">
                <p className="text-rose-400 font-bold">
                  {error.name || "Error"}: {error.message || "An unspecified application error occurred."}
                </p>
                {error.digest && (
                  <p className="text-slate-400">
                    Incident Digest Token: <span className="text-amber-300 font-semibold">{error.digest}</span>
                  </p>
                )}
                <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  Time: {new Date().toISOString()} • Environment: Production/Development Hybrid
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
