"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  GraduationCap,
  Landmark,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

export function ReviewersHero() {
  return (
    <section
      aria-label="Reviewer Guidelines Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                <Eye className="h-3.5 w-3.5" />
                PEER REVIEW STANDARDS
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                Gono Bishwabidyalay Research Evaluation
              </span>
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              Reviewer Responsibilities & Evaluation Framework
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
              Independent peer reviewers are the cornerstone of scholarly integrity at the <strong className="text-slate-900 font-semibold">Gono Bishwabidyalay Journal of Research</strong>. Our reviewers provide constructive, impartial, and evidence-grounded assessments under strict double-blind confidentiality.
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">100% Double-Blind Process</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">14-Day Review Window</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">COPE-Aligned Ethics</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:editorial@gonobishwabidyalay.edu.bd?subject=Reviewer%20Application"
                className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>Apply as Peer Reviewer</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#rubric"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <FileCheck2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Evaluation Rubric</span>
              </a>
              <Link
                href="/authors"
                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                <span>Author Guidelines</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Reviewer Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  GB
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    REVIEW PROTOCOL
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    Reviewer Specifications
                  </p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                COPE Standard
              </span>
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Review Model</span>
                <span className="font-semibold text-slate-900">Double-Blind Anonymous</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Turnaround Target</span>
                <span className="font-mono font-bold text-[#1e40af]">14 Days from Access</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Invitation Response</span>
                <span className="font-semibold text-slate-900">Within 48 Hours</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Evaluation Dimensions</span>
                <span className="font-semibold text-slate-900">5 Structured Criteria</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Recognition</span>
                <span className="font-semibold text-emerald-700">Official Certificate</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Confidentiality</span>
                <span className="font-semibold text-slate-900">Strict Non-Disclosure</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Ethical Covenant:</span>
              Reviewers must declare any potential competing interest prior to accessing manuscript files. Unpublished material cannot be cited or reused.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
