"use client";

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

interface EditorInChiefCardProps {
  chief: BoardMember;
  managing?: BoardMember;
}

export function EditorInChiefCard({ chief, managing }: EditorInChiefCardProps) {
  return (
    <section aria-label="Executive Editorial Leadership" className="space-y-8">
      {/* Section Header matching Home/About design */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
            EXECUTIVE LEADERSHIP
          </p>
          <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] text-slate-950">
            Executive Editorial Leadership
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Senior academic leaders steering journal strategy, ethical compliance, and double-blind appraisal standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor-in-Chief Card */}
        <div className="bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {chief.image ? (
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs">
                  <Image
                    src={chief.image}
                    alt={chief.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center bg-[#0b1b3d] text-white font-bold text-2xl">
                  {chief.name.charAt(0)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-[#1e40af] text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                  {chief.role}
                </span>
                <h3 className="mt-2 font-academic text-xl sm:text-2xl font-medium text-slate-950 leading-snug">
                  {chief.name}
                </h3>
                <p className="text-xs font-semibold text-[#1e40af] mt-1">
                  {chief.title}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {chief.unit} · {chief.institution}
                </p>
              </div>
            </div>

            {chief.bio && (
              <blockquote className="mt-6 border-l-2 border-[#1e40af] pl-4 py-1 bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-700 italic">
                &ldquo;{chief.bio}&rdquo;
              </blockquote>
            )}

            {chief.expertise && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Research Specialization
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {chief.expertise.split(",").map((exp) => (
                    <span
                      key={exp}
                      className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 border border-slate-200/80"
                    >
                      {exp.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Editorial Mandate 2024–2028</span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#1e40af] hover:underline"
            >
              <span>Contact Desk</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Managing Editor Card */}
        {managing && (
          <div className="bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {managing.image ? (
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs">
                    <Image
                      src={managing.image}
                      alt={managing.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 112px"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center bg-[#0b1b3d] text-white font-bold text-2xl">
                    {managing.name.charAt(0)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                    {managing.role}
                  </span>
                  <h3 className="mt-2 font-academic text-xl sm:text-2xl font-medium text-slate-950 leading-snug">
                    {managing.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#1e40af] mt-1">
                    {managing.title}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {managing.unit} · {managing.institution}
                  </p>
                </div>
              </div>

              {managing.bio && (
                <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 py-1 bg-amber-50/40 p-3 text-xs leading-relaxed text-slate-700 italic">
                  &ldquo;{managing.bio}&rdquo;
                </blockquote>
              )}

              {managing.expertise && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Research Specialization
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {managing.expertise.split(",").map((exp) => (
                      <span
                        key={exp}
                        className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 border border-slate-200/80"
                      >
                        {exp.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Workflow & Peer Integrity</span>
              <Link
                href="/authors"
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#1e40af] hover:underline"
              >
                <span>Author Guidelines</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
