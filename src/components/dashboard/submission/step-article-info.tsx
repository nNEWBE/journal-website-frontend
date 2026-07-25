"use client";

import { CustomSelect } from "@/components/ui/custom-select";
import { articleTypes, topics } from "@/lib/data";
import { ClipboardCheck, Eye, FileText, FlaskConical, Library, Mail, MessageSquareText, PenLine } from "lucide-react";

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
};

export function StepArticleInfo({ form, onChange }: StepArticleInfoProps) {
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
                className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[color:var(--color-gb-blue)] bg-blue-50/40 shadow-xs ring-1 ring-[color:var(--color-gb-blue)]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-[color:var(--color-gb-blue)] text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </span>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[color:var(--color-gb-blue)]" />
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
          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] transition-colors"
        />
      </div>

      {/* Abstract */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Structured Abstract <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={form.abstract}
          onChange={(e) => onChange("abstract", e.target.value)}
          placeholder="Provide background, methods, key results, and conclusion (150–300 words)..."
          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-normal text-slate-800 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] transition-colors resize-y"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Keywords (comma separated)
        </label>
        <input
          type="text"
          value={form.keywords}
          onChange={(e) => onChange("keywords", e.target.value)}
          placeholder="Public Health, Savar, Community Health, Healthcare Access"
          className="w-full rounded-xl border border-slate-300 p-3 text-xs font-semibold text-slate-800 outline-none focus:border-[color:var(--color-gb-blue)] transition-colors"
        />
      </div>
    </div>
  );
}
