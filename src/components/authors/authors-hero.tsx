"use client";

import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  Scale,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

export function AuthorsHero() {
  return (
    <section
      aria-label="Author Guidelines Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                <Send className="h-3.5 w-3.5" />
                AUTHOR GUIDELINES & SUBMISSION
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                Gono Bishwabidyalay Research Instructions
              </span>
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              Author Guidelines & Manuscript Submission Framework
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
              Publish your original research, review articles, and clinical discoveries with the <strong className="text-slate-900 font-semibold">Gono Bishwabidyalay Journal of Research</strong>. We offer rigorous double-blind peer review, prompt editorial turnaround, zero author publication charges (No APC), and global open-access reach.
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Double-Blind Peer Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">14-Day Initial Decision</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Free Open Access (Zero APC)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>Submit Your Manuscript</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#checklist"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <FileCheck2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Preparation Checklist</span>
              </a>
              <Link
                href="/policies"
                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                <span>Editorial Policies</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Author Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  GB
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    SUBMISSION METRICS
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    Author Specifications
                  </p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Zero APC
              </span>
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Publication Charges</span>
                <span className="font-semibold text-emerald-700">100% Free / No Fees</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Initial Review Turnaround</span>
                <span className="font-mono font-bold text-[#1e40af]">14 Days from Intake</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Review Protocol</span>
                <span className="font-semibold text-slate-900">Double-Blind Anonymous</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Similarity Limit</span>
                <span className="font-mono font-semibold text-slate-900">&lt; 15% Similarity Check</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Citation Style</span>
                <span className="font-semibold text-slate-900">APA 7th Edition (with DOIs)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Author Rights</span>
                <span className="font-semibold text-slate-900">Author Retains Copyright</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Submission Requirement:</span>
              Authors must provide an editable manuscript (DOCX/LaTeX), anonymized peer-review version, and signed ethical declaration of originality.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
