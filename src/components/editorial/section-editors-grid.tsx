"use client";

import Image from "next/image";
import { Building2, GraduationCap, Users } from "lucide-react";
import type { BoardMember } from "@/lib/data";

interface SectionEditorsGridProps {
  editors: BoardMember[];
}

export function SectionEditorsGrid({ editors }: SectionEditorsGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Users className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-academic text-xl font-extrabold text-slate-900">
            Section Editors & Discipline Chairs
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Subject-matter experts managing specialized peer-review tracks
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {editors.map((editor) => (
          <div
            key={editor.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start gap-3.5">
                {editor.image ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
                    <Image
                      src={editor.image}
                      alt={editor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-lg">
                    {editor.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-extrabold uppercase text-blue-800 border border-blue-200/60">
                    {editor.unit}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-slate-900 leading-snug">
                    {editor.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {editor.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{editor.institution}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{editor.title}</span>
                </div>
              </div>
            </div>

            {editor.bio && (
              <p className="mt-4 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3 italic line-clamp-2">
                &ldquo;{editor.bio}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
