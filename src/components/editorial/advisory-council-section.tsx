"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Globe2,
  GraduationCap,
  Landmark,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { advisoryCouncil } from "@/lib/data";

export function AdvisoryCouncilSection() {
  return (
    <section aria-label="International Advisory Council" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
            GLOBAL PERSPECTIVE
          </p>
          <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] text-slate-950">
            International & Regional Advisory Council
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Senior academic scholars providing interdisciplinary counsel, global peer reviewer connections, and international research standards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {advisoryCouncil.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                {member.image ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af]">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2 py-0.5 border border-blue-100">
                  {member.country}
                </span>
              </div>

              <h3 className="font-academic text-lg font-medium text-slate-950 mt-4 leading-snug">
                {member.name}
              </h3>
              <p className="text-[11px] font-semibold text-[#1e40af] mt-0.5">
                {member.role}
              </p>

              <div className="mt-4 space-y-1 text-xs text-slate-500 font-mono border-t border-slate-100 pt-3">
                <p className="font-semibold text-slate-800">{member.institution}</p>
                <p className="text-[11px] text-slate-500">{member.field}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                <Globe2 className="h-3 w-3" />
                Advisory Oversight
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
