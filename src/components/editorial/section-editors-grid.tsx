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
      <div className="pb-6 border-b border-slate-200/80">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
          DISCIPLINE CHAIRS
        </p>
        <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] text-slate-950">
          Section Editors & Subject Specialists
        </h2>
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
      {filteredEditors.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 p-8 text-center">
          <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            No section editors currently assigned in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEditors.map((editor) => {
            const editorImage =
              editor.imageUrl ||
              editor.image ||
              (editor.name?.includes("Rehana")
                ? "/images/avatars/dr_rehana.jpg"
                : editor.name?.includes("Mahbub")
                  ? "/images/avatars/prof_mahmud.jpg"
                  : editor.name?.includes("Nasima")
                    ? "/images/avatars/dr_ayesha.jpg"
                    : "/images/avatars/dr_fatima.jpg");

            const detailHref = editor.id
              ? `/editorial-board/${editor.id}`
              : `/editorial-board`;

            return (
              <div
                key={editor.id}
                className="group bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <Link
                      href={detailHref}
                      className="relative h-20 w-18 shrink-0 overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs block"
                    >
                      <Image
                        src={editorImage}
                        alt={editor.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[9.5px] font-bold uppercase tracking-wider border border-blue-100">
                        {editor.role}
                      </span>
                      <Link href={detailHref} className="block mt-1">
                        <h3 className="font-academic text-base font-bold text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                          {editor.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {editor.unit}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {editor.institution || "Gono Bishwabidyalay"}
                      </p>
                    </div>
                  </div>

                  {editor.expertise && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-[11.5px] text-slate-500 line-clamp-1">
                        <span className="font-semibold text-slate-600">Track:</span>{" "}
                        {editor.expertise}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    COPE Oversight
                  </span>
                  <Link
                    href={detailHref}
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#1e40af] hover:underline"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
