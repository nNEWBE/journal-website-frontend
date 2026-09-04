"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md text-center space-y-5">
          <div className="mx-auto w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
            !
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Critical Portal Interruption
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The root application layout experienced an unhandled system failure.
            </p>
          </div>

          {error.digest && (
            <div className="rounded-lg bg-slate-100 p-2 text-[11px] font-mono text-slate-600">
              Error Digest: {error.digest}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.location.href = "/";
              }}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
