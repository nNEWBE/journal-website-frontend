"use client";

import { CustomSelect } from "@/components/ui/custom-select";
import { articleTypes, topics } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileText,
  FlaskConical,
  Info,
  Library,
  Mail,
  MessageSquareText,
  PenLine,
  Scale,
} from "lucide-react";

interface StepArticleInfoProps {
  form: {
    type: string;
    topic: string;
    title: string;
    abstract: string;
    keywords: string;
  };
  onChange: (field: string, value: any) => void;
}

const formatIcons: Record<string, any> = {
  "Research Article": FlaskConical,
  "Review Article": Library,
  "Case Study": ClipboardCheck,
  "Short Communication": MessageSquareText,
  Perspective: Eye,
  Editorial: PenLine,
  Letter: Mail,
  "Policy Brief": Scale,
};

const formatDescriptions: Record<string, string> = {
  "Research Article":
    "Original empirical findings, novel methodology, and comprehensive scholarly analysis. (4,000–8,000 words)",
  "Review Article":
    "Systematic synthesis, critical evaluation, and emerging insights across published literature. (5,000–9,000 words)",
  "Case Study":
    "In-depth investigation of a specific institutional, clinical, or field intervention. (2,500–5,000 words)",
  "Short Communication":
    "Timely reporting of high-impact preliminary findings or urgent methodological advances. (1,500–3,000 words)",
  Perspective:
    "Evidence-informed commentary on important academic, policy, or research trends. (2,000–4,000 words)",
  Editorial:
    "Authoritative editorial commentary commissioned or written on scholarly directions. (1,000–2,500 words)",
  Letter:
    "Focused scholarly correspondence responding to recently published articles or debates. (800–1,500 words)",
  "Policy Brief":
    "Action-oriented analysis translating academic research into policy recommendations. (2,000–4,000 words)",
};

export function StepArticleInfo({ form, onChange }: StepArticleInfoProps) {
  const abstractWordCount = form.abstract.trim()
    ? form.abstract.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const minWords = 150;
  const maxWords = 300;
  const wordsNeeded = Math.max(0, minWords - abstractWordCount);
  const progressPercent = Math.min(100, Math.round((abstractWordCount / minWords) * 100));

  return (
    <div className="space-y-6">
      {/* Article Type Selection */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Select Article Type
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articleTypes.map((t) => {
            const IconComponent = formatIcons[t] || FileText;
            const isSelected = form.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange("type", t)}
                className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${isSelected
                  ? "border-gb-blue bg-blue-50/40 shadow-xs ring-1 ring-gb-blue"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected
                        ? "bg-gb-blue text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                        }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-gb-blue" />
                    )}
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-slate-900">{t}</h4>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                    {formatDescriptions[t] || "Standard academic manuscript format."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic discipline */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Research Discipline & Topic
        </label>
        <CustomSelect
          options={topics}
          value={form.topic}
          onChange={(val) => onChange("topic", val)}
          className="w-full"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Manuscript Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g. Primary Healthcare Access & Community Referral Patterns in Rural Savar"
          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold text-slate-900 outline-none focus:border-gb-blue focus:ring-1 focus:ring-gb-blue transition-colors"
        />
      </div>

      {/* Abstract */}
      <div>
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Structured Abstract <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border",
                abstractWordCount === 0
                  ? "bg-slate-50 text-slate-500 border-slate-200"
                  : abstractWordCount < minWords
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : abstractWordCount <= maxWords
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              )}
            >
              {abstractWordCount === 0 ? (
                <span>0 / {minWords} min words</span>
              ) : abstractWordCount < minWords ? (
                <>
                  <AlertCircle className="h-3 w-3 shrink-0 text-amber-600" />
                  <span>
                    {abstractWordCount} / {minWords} min words ({wordsNeeded} more needed)
                  </span>
                </>
              ) : abstractWordCount <= maxWords ? (
                <>
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                  <span>{abstractWordCount} words (Minimum met)</span>
                </>
              ) : (
                <>
                  <Info className="h-3 w-3 shrink-0 text-blue-600" />
                  <span>{abstractWordCount} words (150–300 recommended)</span>
                </>
              )}
            </span>
          </div>
        </div>
        <textarea
          rows={6}
          value={form.abstract}
          onChange={(e) => onChange("abstract", e.target.value)}
          placeholder="Provide background, methods, key results, and conclusion (150–300 words)..."
          className={cn(
            "w-full rounded-xl border p-3.5 text-sm font-normal text-slate-800 outline-none transition-all resize-y",
            abstractWordCount > 0 && abstractWordCount < minWords
              ? "border-amber-300 bg-amber-50/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              : "border-slate-300 focus:border-gb-blue focus:ring-1 focus:ring-gb-blue"
          )}
        />
        {/* Progress bar towards minimum words */}
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              abstractWordCount < minWords
                ? "bg-amber-500"
                : abstractWordCount <= maxWords
                ? "bg-emerald-500"
                : "bg-blue-600"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1">
          <span>
            Mandatory requirement: Minimum <strong>150 words</strong>. Recommended range: <strong>150–300 words</strong>.
          </span>
          {abstractWordCount < minWords ? (
            <span className="font-semibold text-amber-600">
              {abstractWordCount === 0
                ? "150 words required to unlock next step"
                : `${wordsNeeded} more ${wordsNeeded === 1 ? "word" : "words"} needed to unlock next step`}
            </span>
          ) : (
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Word count requirement satisfied
            </span>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Keywords (comma separated) <span className="text-red-500">*</span>
          </label>
          {form.keywords.trim() && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              {form.keywords.split(",").filter((k) => k.trim().length > 0).length} keywords identified
            </span>
          )}
        </div>
        <input
          type="text"
          value={form.keywords}
          onChange={(e) => onChange("keywords", e.target.value)}
          placeholder="e.g. Primary Healthcare, Savar, Community Referral, Health Policy"
          className={`w-full rounded-xl border p-3 text-xs font-semibold outline-none transition-colors ${!form.keywords.trim()
            ? "border-slate-300 text-slate-800 focus:border-gb-blue"
            : "border-blue-300 bg-blue-50/20 text-slate-900 focus:border-gb-blue"
            }`}
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          Mandatory for cross-referencing and indexing. Provide at least 3 to 6 keywords separated by commas.
        </p>
      </div>
    </div>
  );
}
