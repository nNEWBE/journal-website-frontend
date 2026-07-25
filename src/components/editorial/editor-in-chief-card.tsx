"use client";

import Image from "next/image";
import { Award, Building2, GraduationCap, Mail, ShieldCheck } from "lucide-react";
import type { BoardMember } from "@/lib/data";

interface EditorInChiefCardProps {
  chief: BoardMember;
  managing?: BoardMember;
}

export function EditorInChiefCard({ chief, managing }: EditorInChiefCardProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
          <ShieldCheck className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-academic text-xl font-extrabold text-slate-900">
            Executive Editorial Leadership
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Senior academic leadership guiding editorial policy and review integrity
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chief Editor Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
          <div className="flex items-start gap-4">
            {chief.image ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                <Image
                  src={chief.image}
                  alt={chief.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 font-black text-xl">
                {chief.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 border border-blue-200">
                {chief.role}
              </span>
              <h3 className="mt-1.5 text-base font-extrabold text-slate-900 leading-snug">
                {chief.name}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {chief.title}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{chief.institution}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{chief.unit}</span>
            </div>
          </div>
        </div>

        {/* Managing Editor Card */}
        {managing && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              {managing.image ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                  <Image
                    src={managing.image}
                    alt={managing.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-black text-xl">
                  {managing.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800 border border-amber-200">
                  {managing.role}
                </span>
                <h3 className="mt-1.5 text-base font-extrabold text-slate-900 leading-snug">
                  {managing.name}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  {managing.title}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{managing.institution}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{managing.unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
