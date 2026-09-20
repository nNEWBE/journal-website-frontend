"use client";

import { CheckCircle2, FileText, Send, ShieldCheck, User } from "lucide-react";
import type { AuthorItem } from "./step-authors-list";
import type { ManuscriptFile } from "./step-file-upload";
import type { DeclarationsState } from "./step-declarations";

interface StepReviewSubmitProps {
  form: {
    type: string;
    topic: string;
    title: string;
    abstract: string;
    keywords: string;
    files: ManuscriptFile[];
    declarations: DeclarationsState;
  };
  authors: AuthorItem[];
  completeness: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function StepReviewSubmit({
  form,
  authors,
  completeness,
  isSubmitting,
  onSubmit,
}: StepReviewSubmitProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Pre-Submission Verification Checklist
        </h3>
        <p className="text-xs text-slate-500">
          Please review your manuscript metadata and author list prior to final submission.
        </p>
      </div>

      {/* Completeness Bar */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Submission Completeness Score</span>
          <span className="font-mono text-blue-700">{completeness}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gb-blue transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
        <div>
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700 border border-blue-200">
            {form.type} · {form.topic}
          </span>
          <h4 className="mt-2 text-base font-extrabold text-slate-900 leading-snug">
            {form.title || "Untitled Manuscript"}
          </h4>
        </div>

        {/* Keywords Summary */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Indexed Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {form.keywords ? (
              form.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
                .map((k, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-blue-50/80 px-2.5 py-1 text-xs font-semibold text-blue-800 border border-blue-200"
                  >
                    #{k}
                  </span>
                ))
            ) : (
              <span className="text-xs text-red-500 font-semibold">
                No keywords provided (Mandatory)
              </span>
            )}
          </div>
        </div>

        {/* Authors Summary */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Authors & Honorarium Accounts ({authors.length})
          </p>
          <div className="space-y-2">
            {authors.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 sm:px-3 text-xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <User className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                  <span className="font-bold text-slate-900">{a.name}</span>
                  {a.isCorresponding && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800 uppercase">
                      Corresponding
                    </span>
                  )}
                  <span className="text-slate-500 font-mono text-[11px]">({a.email})</span>
                </div>

                <div className="text-[11px] font-medium text-slate-600">
                  {a.bankName || a.accountNumber ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {a.bankName || "Bank"}: {a.accountNumber ? `••••${a.accountNumber.slice(-4)}` : "Account on file"}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">No bank info added</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Files Summary */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Files Uploaded ({form.files.length})
          </p>
          <div className="space-y-1">
            {form.files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs text-slate-700 font-medium"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  {f.name}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {f.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || completeness < 50 || !form.keywords.trim()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gb-blue-deep px-8 text-sm font-extrabold text-white shadow-lg hover:bg-gb-blue transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting Manuscript...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Finalize & Submit Manuscript
            </>
          )}
        </button>
      </div>
    </div>
  );
}
