"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const missingBankAuthors = authors.filter(
    (a) => !a.bankName?.trim() || !a.accountNumber?.trim() || !a.accountHolderName?.trim()
  );
  const hasMissingBank = missingBankAuthors.length > 0;
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

        {/* Abstract Summary */}
        {form.abstract && (
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Structured Abstract
              </p>
              <span className="text-[10.5px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {form.abstract.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 shadow-2xs">
              <p
                className={cn(
                  "text-xs text-slate-700 leading-relaxed whitespace-pre-wrap wrap-break-word",
                  !isAbstractExpanded && form.abstract.length > 280 && "line-clamp-4"
                )}
              >
                {form.abstract}
              </p>
              {form.abstract.length > 280 && (
                <button
                  type="button"
                  onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                  className="mt-2.5 text-[11px] font-bold text-gb-blue hover:text-gb-blue-dark inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {isAbstractExpanded ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span>Read Full Abstract</span>
                      <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

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
                  {a.bankName?.trim() && a.accountNumber?.trim() && a.accountHolderName?.trim() ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 font-semibold shadow-2xs">
                      <Check className="h-3 w-3 text-emerald-600" />
                      {a.bankName}: ••••{a.accountNumber.slice(-4)} ({a.accountHolderName})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      Missing Bank Details (Mandatory)
                    </span>
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
            {form.files.length > 0 ? (
              form.files.map((f, i) => (
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
              ))
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                No manuscript file uploaded (Mandatory)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Missing Bank Details Warning Banner */}
      {hasMissingBank && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 flex items-start gap-3 text-xs text-red-900 shadow-2xs">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Missing Mandatory Bank Details</p>
            <p className="text-red-700 leading-relaxed">
              University finance mandates valid bank account details for every contributing author before manuscript submission.
              Missing for: <strong>{missingBankAuthors.map((a) => a.name).join(", ")}</strong>. Please return to Step 2 (Authors) to add bank information.
            </p>
          </div>
        </div>
      )}

      {/* Missing Files Warning Banner */}
      {form.files.length === 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 flex items-start gap-3 text-xs text-red-900 shadow-2xs">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Missing Blinded Manuscript File</p>
            <p className="text-red-700 leading-relaxed">
              At least one blinded manuscript file (PDF or DOCX) is required for peer review. Please return to Step 3 (Files) to upload your manuscript file.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
