"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  FileCheck2,
  Globe2,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";

export function AboutJournalHero() {
  return (
    <section
      aria-label="About the Journal Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                <BookOpen className="h-3.5 w-3.5" />
                ABOUT THE JOURNAL
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                Gono Bishwabidyalay Official Publication
              </span>
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              Advancing interdisciplinary scholarship through rigorous peer review and open dissemination
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
              The <strong className="text-slate-900 font-semibold">Gono Bishwabidyalay Journal of Research</strong> (GB Journal) is the flagship peer-reviewed, open-access scholarly publication of Gono Bishwabidyalay. We publish original research across health sciences, pharmacy, veterinary medicine, biotechnology, agriculture, engineering, and social development.
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Double-Blind Peer Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Gold Open Access (CC BY 4.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Biannual (January & July)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Avg. 18 Days to First Decision</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>Submit Manuscript</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/issues/current"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>Read Current Issue</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/editorial-board"
                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <span>Editorial Board</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Publication Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  GB
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    OFFICIAL RECORD
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    Journal Specifications
                  </p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Active
              </span>
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Publisher</span>
                <span className="font-semibold text-slate-900 text-right">Gono Bishwabidyalay Press</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Online ISSN</span>
                <span className="font-mono font-bold text-slate-900">2959-1082</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Print ISSN</span>
                <span className="font-mono font-bold text-slate-900">2959-1074</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">DOI Prefix</span>
                <span className="font-mono font-bold text-[#1e40af]">10.5555/gbj</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Publication Frequency</span>
                <span className="font-semibold text-slate-900">Biannual (2 Issues/Year)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Review Model</span>
                <span className="font-semibold text-slate-900">Double-Blind Peer Review</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Publishing Model</span>
                <span className="font-semibold text-emerald-700">Open Access (CC BY 4.0)</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Permanent Archiving:</span>
              Articles are indexed in CrossRef, Google Scholar, BanglaJOL, and institutional university repositories.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
