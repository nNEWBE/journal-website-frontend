"use client";

import React, { useState } from "react";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  ClipboardCheck,
  FileText,
  Download,
  ExternalLink,
  Star,
  MessageSquare,
  Lock,
  Send,
} from "lucide-react";
import type { Submission } from "@/lib/data";

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onSubmit: (payload: {
    recommendation: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";
    score: number;
    reviewComments: string;
    confidentialComments?: string;
  }) => Promise<void> | void;
}

const RECOMMENDATION_OPTIONS = [
  "Accept as is (ACCEPT)",
  "Minor Revisions (MINOR_REVISION)",
  "Major Revisions (MAJOR_REVISION)",
  "Reject (REJECT)",
];

export function SubmitReviewModal({
  isOpen,
  onClose,
  submission,
  onSubmit,
}: SubmitReviewModalProps) {
  const [selectedRec, setSelectedRec] = useState<string>(RECOMMENDATION_OPTIONS[0]);
  const [score, setScore] = useState<number>(85);
  const [reviewComments, setReviewComments] = useState<string>("");
  const [confidentialComments, setConfidentialComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!submission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComments.trim()) {
      return;
    }

    let recommendationCode: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT" = "ACCEPT";
    if (selectedRec.includes("MINOR_REVISION")) recommendationCode = "MINOR_REVISION";
    else if (selectedRec.includes("MAJOR_REVISION")) recommendationCode = "MAJOR_REVISION";
    else if (selectedRec.includes("REJECT")) recommendationCode = "REJECT";

    setIsSubmitting(true);
    try {
      await onSubmit({
        recommendation: recommendationCode,
        score,
        reviewComments: reviewComments.trim(),
        confidentialComments: confidentialComments.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Peer Review Evaluation"
      description={`Submit your blind peer review assessment for manuscript ${submission.id}.`}
      icon={ClipboardCheck}
      size="lg"
      badge={
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
          {submission.id}
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs min-w-0">
        {/* Manuscript Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              Manuscript Under Review
            </span>
            <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              {submission.type}
            </span>
          </div>

          <h4 className="font-academic text-sm font-bold text-slate-900 leading-snug break-all wrap-anywhere">
            {submission.title}
          </h4>

          {submission.abstractText && (
            <div className="pt-2 border-t border-slate-200/60 min-w-0">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Abstract Summary</p>
              <p className="text-slate-600 line-clamp-3 leading-relaxed wrap-break-word break-all whitespace-pre-wrap">
                {submission.abstractText}
              </p>
            </div>
          )}

          {/* Attached Files / PDF Access */}
          <div className="pt-2 border-t border-slate-200/60">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
              Attached Files ({submission.files?.length || 0})
            </p>
            {submission.files && submission.files.length > 0 ? (
              <div className="space-y-1.5">
                {submission.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">
                        {file.originalFilename || "Manuscript Document"}
                      </span>
                    </div>
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-bold text-slate-700 transition-colors shrink-0"
                    >
                      <span>View / Download</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-[11px]">No documents attached to this submission.</p>
            )}
          </div>
        </div>

        {/* Recommendation */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Editorial Recommendation <span className="text-rose-500">*</span>
          </label>
          <CustomSelect
            size="form"
            options={RECOMMENDATION_OPTIONS}
            value={selectedRec}
            onChange={setSelectedRec}
            placeholder="Select recommendation"
          />
        </div>

        {/* Numerical Score */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Scientific Quality Score (1 - 100)
            </label>
            <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              {score} / 100
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1 (Unacceptable)</span>
            <span>50 (Marginal)</span>
            <span>75 (Good)</span>
            <span>100 (Exceptional)</span>
          </div>
        </div>

        {/* Comments for Author and Editor */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            Evaluation Comments (Visible to Author & Editor) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            placeholder="Detail your scientific review: strengths, methodology critiques, suggested improvements, literature gaps..."
            className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Confidential Comments for Editor Only */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            Confidential Notes for Editor Only (Optional)
          </label>
          <textarea
            rows={2}
            value={confidentialComments}
            onChange={(e) => setConfidentialComments(e.target.value)}
            placeholder="Private notes concerning originality, ethical considerations, or conflicts..."
            className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !reviewComments.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gb-blue px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSubmitting ? "Submitting Review..." : "Submit Review"}</span>
          </button>
        </div>
      </form>
    </CustomDrawer>
  );
}
