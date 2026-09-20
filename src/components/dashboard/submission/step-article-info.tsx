"use client";

import { CustomSelect } from "@/components/ui/custom-select";
import { articleTypes, topics } from "@/lib/data";
import { Check, ClipboardCheck, Eye, FileText, FlaskConical, Library, Mail, MessageSquareText, PenLine, Scale } from "lucide-react";

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
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Structured Abstract <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={form.abstract}
          onChange={(e) => onChange("abstract", e.target.value)}
          placeholder="Provide background, methods, key results, and conclusion (150–300 words)..."
          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-normal text-slate-800 outline-none focus:border-gb-blue focus:ring-1 focus:ring-gb-blue transition-colors resize-y"
        />
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
