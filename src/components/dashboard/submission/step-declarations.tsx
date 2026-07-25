"use client";

import { ShieldCheck } from "lucide-react";

export interface DeclarationsState {
  noConflict: boolean;
  ethicsApproved: boolean;
  fundingDisclosed: boolean;
  aiDisclosed: boolean;
  originalWork: boolean;
  customNotes: string;
}

interface StepDeclarationsProps {
  declarations: DeclarationsState;
  onChange: (field: keyof DeclarationsState, value: any) => void;
}

const checkboxes: { key: keyof DeclarationsState; title: string; desc: string }[] = [
  {
    key: "originalWork",
    title: "Original Work & Unublished Status",
    desc: "I confirm that this manuscript is original, has not been published previously, and is not currently under consideration by any other journal.",
  },
  {
    key: "noConflict",
    title: "Conflict of Interest Disclosure",
    desc: "All authors declare no commercial, financial, or personal relationships that could inappropriately influence or bias this research.",
  },
  {
    key: "ethicsApproved",
    title: "Ethical Approval & Participant Consent",
    desc: "Research involving human participants or animal models received prior approval from an institutional ethics review committee.",
  },
  {
    key: "fundingDisclosed",
    title: "Funding & Grant Acknowledgement",
    desc: "All sources of financial support, grant numbers, and institutional funding for this project have been fully acknowledged.",
  },
  {
    key: "aiDisclosed",
    title: "Generative AI Compliance Statement",
    desc: "Generative AI or machine learning tools, if used, were restricted to language polishing and are explicitly documented in the methods.",
  },
];

export function StepDeclarations({
  declarations,
  onChange,
}: StepDeclarationsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Ethical Declarations & COPE Compliance
          </h3>
          <p className="text-xs text-slate-500">
            Check all statements to confirm compliance with Gono Bishwabidyalay publication ethics.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {checkboxes.map((item) => {
          const isChecked = Boolean(declarations[item.key]);
          return (
            <label
              key={item.key}
              className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all cursor-pointer ${
                isChecked
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange(item.key, e.target.checked)}
                className="mt-0.5 h-4.5 w-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Additional Ethical or Disclosure Notes (Optional)
        </label>
        <textarea
          rows={3}
          value={declarations.customNotes}
          onChange={(e) => onChange("customNotes", e.target.value)}
          placeholder="e.g. Protocol #2026-PH-04 approved by GB Institutional Review Board..."
          className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 transition-colors resize-y"
        />
      </div>
    </div>
  );
}
