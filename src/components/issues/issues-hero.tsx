"use client";

import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  Library,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

interface IssuesHeroProps {
  totalIssues: number;
  totalArticles: number;
  currentVolume: string;
  totalYears: number;
}

export function IssuesHero({
  totalIssues,
  totalArticles,
  currentVolume,
  totalYears,
}: IssuesHeroProps) {
  return (
    <section
      aria-label="Issues & Volumes Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                <Library className="h-3.5 w-3.5" />
                JOURNAL ARCHIVE & EDITIONS
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                Gono Bishwabidyalay Official Repository
              </span>
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              Volumes & Published Issues Archive
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
              Browse the complete peer-reviewed publication record of the <strong className="text-slate-900 font-semibold">Gono Bishwabidyalay Journal of Research</strong>. Every volume unites multidisciplinary scholarship in health, pharmacy, agriculture, law, computing, and social welfare—freely accessible worldwide under Open Access.
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Biannual Schedule (Jan & Jul)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">100% Open Access (CC BY 4.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Double-Blind Evaluated</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/issues/current"
                className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>Read Current Issue</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-slate-500" />
                <span>Search All Articles</span>
              </Link>
              <a
                href="#volume-archive"
                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <Archive className="h-3.5 w-3.5 text-slate-500" />
                <span>Browse Past Volumes</span>
              </a>
            </div>
          </div>

          {/* Right Column: Archive Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  GB
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    ARCHIVAL CATALOG
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    Repository Overview
                  </p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                Active Archive
              </span>
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Current Edition</span>
                <span className="font-mono font-bold text-[#1e40af]">{currentVolume}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Published Issues</span>
                <span className="font-semibold text-slate-900">{totalIssues} Editions</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Historical Span</span>
                <span className="font-semibold text-slate-900">{totalYears} Archive Years</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Cataloged Articles</span>
                <span className="font-semibold text-slate-900">{totalArticles} Papers</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Official ISSN</span>
                <span className="font-mono font-semibold text-slate-900">2959-1082 (Online)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Preservation</span>
                <span className="font-semibold text-emerald-700">CrossRef DOI Permanent</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Permanent Access Guarantee:</span>
              All retrospective editions remain permanently accessible, indexed under unique CrossRef DOIs with unhindered full-text PDF downloads.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
