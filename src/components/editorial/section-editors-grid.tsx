"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  GraduationCap,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { BoardMember } from "@/lib/data";

interface SectionEditorsGridProps {
  editors: BoardMember[];
}

export function SectionEditorsGrid({ editors }: SectionEditorsGridProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");

  const faculties = [
    { key: "all", label: "All Disciplines" },
    { key: "health", label: "Health & Medicine" },
    { key: "pharmacy", label: "Pharmacy" },
    { key: "agriculture", label: "Agriculture" },
    { key: "law", label: "Law & Bioethics" },
    { key: "tech", label: "Science & Tech" },
    { key: "social", label: "Social Sciences" },
  ];

  const filteredEditors = editors.filter((editor) => {
    if (selectedFaculty === "all") return true;
    const unitLower = (editor.unit || "").toLowerCase();
    const expertiseLower = (editor.expertise || "").toLowerCase();
    if (selectedFaculty === "health") return unitLower.includes("health") || unitLower.includes("medical");
    if (selectedFaculty === "pharmacy") return unitLower.includes("pharmacy");
    if (selectedFaculty === "agriculture") return unitLower.includes("agriculture") || unitLower.includes("veterinary");
    if (selectedFaculty === "law") return unitLower.includes("law");
    if (selectedFaculty === "tech") return unitLower.includes("computer") || unitLower.includes("microbiology");
    if (selectedFaculty === "social") return unitLower.includes("social") || unitLower.includes("sociology");
    return true;
  });

  return (
    <section aria-label="Section Editors and Discipline Chairs" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
            DISCIPLINE CHAIRS
          </p>
          <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] text-slate-950">
            Section Editors & Subject Specialists
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Faculty specialists overseeing specialized peer-review tracks, referee assignments, and initial desk assessments.
        </p>
      </div>

      {/* Faculty Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {faculties.map((f) => {
          const isActive = selectedFaculty === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelectedFaculty(f.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Section Editors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEditors.map((editor) => (
          <div
            key={editor.id}
            className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start gap-4">
                {editor.image ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs">
                    <Image
                      src={editor.image}
                      alt={editor.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-slate-100 border border-slate-200 text-[#1e40af] font-bold text-lg">
                    {editor.name.charAt(0)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                    {editor.role}
                  </span>
                  <h3 className="mt-1.5 font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                    {editor.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {editor.title}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-xs text-slate-500 font-mono border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{editor.institution}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{editor.unit}</span>
                </div>
              </div>

              {editor.expertise && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Track Specialization
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {editor.expertise}
                  </p>
                </div>
              )}

              {editor.bio && (
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500 italic border-t border-slate-100 pt-2.5">
                  &ldquo;{editor.bio}&rdquo;
                </p>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Active Review Track
              </span>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e40af] hover:underline"
              >
                <span>Track Articles</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
