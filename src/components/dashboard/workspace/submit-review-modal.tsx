"use client";

import React, { useState, useMemo } from "react";
import { CustomDrawer } from "@/components/ui/drawer";
import {
  ClipboardCheck,
  FileText,
  Download,
  ExternalLink,
  Star,
  MessageSquare,
  Lock,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileEdit,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Award,
  BookOpen,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Submission } from "@/lib/data";

export type RecommendationType = "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onSubmit: (payload: {
    recommendation: RecommendationType;
    score: number;
    reviewComments: string;
    confidentialComments?: string;
  }) => Promise<void> | void;
}

interface RecommendationCard {
  id: RecommendationType;
  title: string;
  subtitle: string;
  badge: string;
  badgeClass: string;
  selectedRing: string;
  selectedBg: string;
  activeIconBg: string;
  inactiveIconBg: string;
  selectedBadge: string;
  icon: React.ElementType;
}

const RECOMMENDATION_CARDS: RecommendationCard[] = [
  {
    id: "ACCEPT",
    title: "Accept As Is",
    subtitle: "High scholarly rigor and sound conclusions. Ready for publication without further revision.",
    badge: "Direct Acceptance",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    selectedRing: "border-emerald-500 ring-2 ring-emerald-500/20",
    selectedBg: "bg-emerald-50/60",
    activeIconBg: "bg-emerald-600 text-white shadow-2xs",
    inactiveIconBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    selectedBadge: "bg-emerald-600 text-white",
    icon: CheckCircle2,
  },
  {
    id: "MINOR_REVISION",
    title: "Minor Revisions",
    subtitle: "Conceptually robust. Requires minor textual clarifications, figure polishing, or citation updates.",
    badge: "Minor Edits (7-14 Days)",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    selectedRing: "border-blue-500 ring-2 ring-blue-500/20",
    selectedBg: "bg-blue-50/60",
    activeIconBg: "bg-blue-600 text-white shadow-2xs",
    inactiveIconBg: "bg-blue-50 text-blue-700 border border-blue-100",
    selectedBadge: "bg-blue-600 text-white",
    icon: FileEdit,
  },
  {
    id: "MAJOR_REVISION",
    title: "Major Revisions",
    subtitle: "Promising investigation requiring substantial new data, methodological clarifications, or rewrites.",
    badge: "Substantial Rework",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    selectedRing: "border-amber-500 ring-2 ring-amber-500/20",
    selectedBg: "bg-amber-50/60",
    activeIconBg: "bg-amber-600 text-white shadow-2xs",
    inactiveIconBg: "bg-amber-50 text-amber-700 border border-amber-100",
    selectedBadge: "bg-amber-600 text-white",
    icon: RotateCcw,
  },
  {
    id: "REJECT",
    title: "Reject",
    subtitle: "Manuscript fails to meet academic standards, contains critical flaws, or lacks scientific novelty.",
    badge: "Declined",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    selectedRing: "border-rose-500 ring-2 ring-rose-500/20",
    selectedBg: "bg-rose-50/60",
    activeIconBg: "bg-rose-600 text-white shadow-2xs",
    inactiveIconBg: "bg-rose-50 text-rose-700 border border-rose-100",
    selectedBadge: "bg-rose-600 text-white",
    icon: XCircle,
  },
];

const SCORE_PRESETS = [
  { val: 50, label: "50 • Marginal", tier: "Marginal" },
  { val: 75, label: "75 • Good", tier: "Good" },
  { val: 85, label: "85 • Strong", tier: "Strong" },
  { val: 95, label: "95 • Exceptional", tier: "Exceptional" },
];

const REVIEW_TEMPLATES = [
  {
    label: "Formal Review Outline",
    text: `1. Overall Scholarly Assessment
[Provide a summary of the paper's primary contribution and significance to the research domain]

2. Methodological Rigor & Technical Correctness
• Experimental design & controls:
• Sampling validity and statistical repeatability:
• Data interpretation:

3. Key Strengths
• 
• 

4. Areas for Revision / Constructive Critiques
Major Points:
1. 
2. 

Minor Points & Typographical Corrections:
1. 
2. 

5. Final Recommendation
[Summarize concluding advice to the authors and editorial team]`,
  },
  {
    label: "Minor Revision Note",
    text: `The manuscript presents a timely and well-conceived investigation. The overall methodology is robust, but several minor issues should be addressed before final publication:
1. Clarify the sampling protocol described in Section 2.2.
2. Review Table 1 and ensure all statistical acronyms are defined in the footnote.
3. Update references with relevant recent studies from 2024 to 2026.`,
  },
  {
    label: "Direct Acceptance Note",
    text: `The manuscript is thoroughly researched, methodologically sound, and clearly organized. The empirical findings are adequately supported by the data, and the conclusions make a worthwhile contribution to the field. I recommend accepting the manuscript in its current form.`,
  },
];

export function SubmitReviewModal({
  isOpen,
  onClose,
  submission,
  onSubmit,
}: SubmitReviewModalProps) {
  const [recommendation, setRecommendation] = useState<RecommendationType>("ACCEPT");
  const [score, setScore] = useState<number>(85);
  const [reviewComments, setReviewComments] = useState<string>("");
  const [confidentialComments, setConfidentialComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

  // Rubric Dimensions
  const [novelty, setNovelty] = useState<string>("High");
  const [methodology, setMethodology] = useState<string>("Robust");
  const [clarity, setClarity] = useState<string>("Clear");
  const [citations, setCitations] = useState<string>("Comprehensive");

  if (!submission) return null;

  const scoreTier = useMemo(() => {
    if (score >= 85) {
      return {
        tier: "Exceptional / High Rigor",
        color: "text-emerald-700",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        barGradient: "bg-linear-to-r from-emerald-500 to-teal-500",
        thumbBorder: "border-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.35)]",
        dotBg: "bg-emerald-600",
      };
    }
    if (score >= 70) {
      return {
        tier: "Good Scholarly Quality",
        color: "text-blue-700",
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
        barGradient: "bg-linear-to-r from-blue-600 to-indigo-600",
        thumbBorder: "border-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.35)]",
        dotBg: "bg-blue-600",
      };
    }
    if (score >= 50) {
      return {
        tier: "Marginal / Revisions Needed",
        color: "text-amber-700",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        barGradient: "bg-linear-to-r from-amber-500 to-orange-500",
        thumbBorder: "border-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.35)]",
        dotBg: "bg-amber-500",
      };
    }
    return {
      tier: "Substandard / Critical Concerns",
      color: "text-rose-700",
      badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
      barGradient: "bg-linear-to-r from-rose-500 to-red-500",
      thumbBorder: "border-rose-600 shadow-[0_2px_8px_rgba(244,63,94,0.35)]",
      dotBg: "bg-rose-600",
    };
  }, [score]);

  const starRating = useMemo(() => {
    return Math.min(5, Math.max(1, Math.ceil(score / 20)));
  }, [score]);

  const wordCount = useMemo(() => {
    const trimmed = reviewComments.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [reviewComments]);

  const handleApplyTemplate = (templateText: string) => {
    if (reviewComments.trim()) {
      setReviewComments((prev) => `${prev}\n\n${templateText}`);
    } else {
      setReviewComments(templateText);
    }
  };

  const handleInsertRubric = () => {
    const rubricText = `Evaluator Rubric Summary:
• Originality & Novelty: ${novelty}
• Methodological Soundness: ${methodology}
• Clarity & Presentation: ${clarity}
• Literature & Citations: ${citations}
• Overall Scientific Quality Score: ${score} / 100`;

    if (reviewComments.trim()) {
      setReviewComments((prev) => `${rubricText}\n\n${prev}`);
    } else {
      setReviewComments(rubricText);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComments.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        recommendation,
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
      description={`Submit double-blind evaluation, recommendation, and comments for manuscript ${submission.id}.`}
      icon={ClipboardCheck}
      size="lg"
      badge={
        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 border border-emerald-200">
          {submission.id}
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs min-w-0 pb-6">
        {/* Manuscript Overview Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-linear-to-b from-slate-50/90 via-white to-slate-50/40 p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 font-bold text-[10.5px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Double-Blind Peer Review</span>
            </span>
            <div className="flex items-center gap-1.5">
              {submission.topic && (
                <span className="rounded-md bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                  {submission.topic}
                </span>
              )}
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                {submission.type || "Research Article"}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-academic text-base sm:text-lg font-bold text-slate-900 leading-snug break-normal">
              {submission.title}
            </h4>
          </div>

          {/* Abstract with smooth expand/collapse */}
          {submission.abstractText && (
            <div className="rounded-xl border border-slate-200/70 bg-white p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Abstract Summary
                </span>
                <button
                  type="button"
                  onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <span>{isAbstractExpanded ? "Show less" : "Read full abstract"}</span>
                  {isAbstractExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
              <p
                className={cn(
                  "text-slate-600 leading-relaxed text-[11.5px] transition-all",
                  !isAbstractExpanded && "line-clamp-3"
                )}
              >
                {submission.abstractText}
              </p>
            </div>
          )}

          {/* Attached Files Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Manuscript Documents ({submission.files?.length || 0})
              </span>
            </div>
            {submission.files && submission.files.length > 0 ? (
              <div className="space-y-2">
                {submission.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-xs truncate">
                          {file.originalFilename || "Manuscript Document"}
                        </p>
                        <p className="text-[10.5px] text-slate-400">
                          Blind Galley Proof • Ready for Review
                        </p>
                      </div>
                    </div>
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Read / Download</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-slate-200 bg-white text-center text-slate-400 italic text-[11px]">
                No files uploaded with this submission.
              </div>
            )}
          </div>
        </div>

        {/* 1. Editorial Recommendation Selection Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Editorial Recommendation</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <span className="text-[11px] text-slate-500">
              Select one primary recommendation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RECOMMENDATION_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = recommendation === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setRecommendation(card.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden",
                    isSelected
                      ? `${card.selectedRing} ${card.selectedBg} shadow-xs`
                      : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs"
                  )}
                >
                  <div>
                    {/* Header Row: Icon on Left, Status Badge on Right */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center justify-center h-8 w-8 rounded-xl transition-all",
                          isSelected ? card.activeIconBg : card.inactiveIconBg
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>

                      {isSelected ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs",
                            card.selectedBadge
                          )}
                        >
                          <Check className="h-3 w-3 stroke-3" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border",
                            card.badgeClass
                          )}
                        >
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {card.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Bottom Scope pill when selected */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">Scope:</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold border",
                          card.badgeClass
                        )}
                      >
                        {card.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Scientific Quality Score Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-linear-to-b from-white to-slate-50/40 p-4 sm:p-5 space-y-4 shadow-2xs">
          {/* Header Row with Icon, Title, and 5-Star Rating */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-xs shrink-0">
                <Star className="h-5 w-5 fill-white drop-shadow-xs" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Scientific Quality Score</span>
                  <span className="text-[11px] font-semibold text-slate-400">(1 – 100)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quantify overall academic rigor, empirical strength, and methodology.
                </p>
              </div>
            </div>

            {/* Right: Interactive 5-Star Display + Score Pill */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* 5-Star Interactive Rating Bar */}
              <div className="flex items-center gap-1 bg-white border border-slate-200/90 px-2.5 py-1.5 rounded-xl shadow-2xs">
                {[1, 2, 3, 4, 5].map((starIdx) => {
                  const isFilled = starRating >= starIdx;
                  return (
                    <button
                      key={starIdx}
                      type="button"
                      onClick={() => setScore(starIdx * 20)}
                      className="transition-transform hover:scale-125 active:scale-95 cursor-pointer p-0.5"
                      title={`Rate ${starIdx} Star${starIdx > 1 ? "s" : ""} (${starIdx * 20} / 100)`}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isFilled
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.5)]"
                            : "text-slate-200 fill-slate-100"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Unified Tier & Numeric Badge */}
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-all", scoreTier.badgeBg)}>
                <span>{scoreTier.tier}</span>
                <span className="h-3 w-px bg-current opacity-25" />
                <span className="font-mono text-sm font-black tracking-tight">{score}</span>
                <span className="text-[10px] font-normal opacity-70">/ 100</span>
              </div>
            </div>
          </div>

          {/* Premium Custom Interactive Slider */}
          <div className="space-y-2 pt-1">
            <div className="relative w-full py-3 select-none flex items-center">
              {/* Base track */}
              <div className="h-3 w-full rounded-full bg-slate-100 border border-slate-200/90 overflow-hidden relative shadow-inner">
                {/* Dynamic colored progress fill */}
                <div
                  className={cn("h-full rounded-full transition-all duration-75", scoreTier.barGradient)}
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* Milestone Dots along the track */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex justify-between px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-xs" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-xs" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-xs" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-xs" />
              </div>

              {/* Actual Native Input (invisible on top for native drag/touch/keyboard) */}
              <input
                type="range"
                min={1}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                aria-label="Scientific Quality Score"
              />

              {/* Visual custom slider knob */}
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-75 flex flex-col items-center"
                style={{ left: `calc(${score}% - ${(score / 100) * 24}px)` }}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full bg-white border-2 shadow-md flex items-center justify-center transition-all",
                    scoreTier.thumbBorder
                  )}
                >
                  <div className={cn("h-2 w-2 rounded-full transition-colors", scoreTier.dotBg)} />
                </div>
              </div>
            </div>

            {/* Clickable Milestone Labels */}
            <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-500 pt-0.5">
              <button
                type="button"
                onClick={() => setScore(1)}
                className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform" />
                <span>1 (Unacceptable)</span>
              </button>
              <button
                type="button"
                onClick={() => setScore(50)}
                className="hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                <span>50 (Marginal)</span>
              </button>
              <button
                type="button"
                onClick={() => setScore(75)}
                className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                <span>75 (Good)</span>
              </button>
              <button
                type="button"
                onClick={() => setScore(100)}
                className="hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                <span>100 (Exceptional)</span>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-slate-100">
            <span className="text-[10.5px] font-bold text-slate-400">Quick Presets:</span>
            {SCORE_PRESETS.map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setScore(p.val)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer",
                  score === p.val
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Dimensional Rubric Assessment */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-blue-600" />
                <span>Rubric Dimensions</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Quickly rate four core dimensions to frame your critique.
              </p>
            </div>
            <button
              type="button"
              onClick={handleInsertRubric}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer hover:underline"
            >
              + Insert Rubric into Comments
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Novelty */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <span className="text-[10.5px] font-bold text-slate-600">Originality & Novelty:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["High", "Moderate", "Limited"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNovelty(opt)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all cursor-pointer",
                      novelty === opt
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <span className="text-[10.5px] font-bold text-slate-600">Methodological Soundness:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["Robust", "Minor Gaps", "Flawed"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMethodology(opt)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all cursor-pointer",
                      methodology === opt
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <span className="text-[10.5px] font-bold text-slate-600">Clarity & Presentation:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["Clear", "Readable", "Needs Editing"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setClarity(opt)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all cursor-pointer",
                      clarity === opt
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Citations */}
            <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <span className="text-[10.5px] font-bold text-slate-600">Literature & Citations:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["Comprehensive", "Adequate", "Incomplete"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCitations(opt)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all cursor-pointer",
                      citations === opt
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Public Review Comments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
              <span>Evaluation Comments (Visible to Author & Editor)</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <span className="text-[11px] font-medium text-slate-500">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          </div>

          {/* Quick templates toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10.5px] font-bold text-slate-400">Quick Templates:</span>
            {REVIEW_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => handleApplyTemplate(tmpl.text)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold border border-slate-200 transition-all cursor-pointer"
              >
                + {tmpl.label}
              </button>
            ))}
          </div>

          <textarea
            rows={7}
            required
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            placeholder="Detail your scientific review: strengths, methodology critiques, suggested improvements, literature gaps..."
            className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed shadow-2xs"
          />
        </div>

        {/* 5. Confidential Notes to Editor */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white shrink-0 shadow-2xs">
                <Lock className="h-3.5 w-3.5" />
              </span>
              <div>
                <label className="text-xs font-bold text-slate-900 block">
                  Confidential Notes for Editor Only (Optional)
                </label>
                <p className="text-[11px] text-slate-500">
                  Authors will never see these remarks. Use for ethical concerns, conflicts of interest, or candid remarks.
                </p>
              </div>
            </div>
          </div>

          <textarea
            rows={3}
            value={confidentialComments}
            onChange={(e) => setConfidentialComments(e.target.value)}
            placeholder="Private notes concerning originality, ethical considerations, or conflicts..."
            className="w-full rounded-xl border border-amber-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-2xs"
          />
        </div>

        {/* Sticky / Padded Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Recommendation:{" "}
            <strong className="text-slate-800">
              {RECOMMENDATION_CARDS.find((c) => c.id === recommendation)?.title}
            </strong>{" "}
            • Score: <strong className="text-slate-800">{score}/100</strong>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reviewComments.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gb-blue px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-all hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Submitting Evaluation..." : "Submit Peer Review"}</span>
            </button>
          </div>
        </div>
      </form>
    </CustomDrawer>
  );
}
