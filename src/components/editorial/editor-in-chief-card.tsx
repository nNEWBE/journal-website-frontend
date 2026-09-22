"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Building2,
  GraduationCap,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { BoardMember } from "@/lib/data";

interface EditorInChiefCardProps {
  chief?: BoardMember;
  managing?: BoardMember;
}

function LeadershipCard({
  member,
  badgeVariant,
}: {
  member: BoardMember;
  badgeVariant: "gold" | "blue";
}) {
  const imageSrc =
    member.imageUrl ||
    member.image ||
    (badgeVariant === "gold"
      ? "/images/avatars/dr_fatima.jpg"
      : "/images/avatars/prof_tariq.jpg");

  const detailHref = member.id
    ? `/editorial-board/${member.id}`
    : `/editorial-board`;

  const isGold = badgeVariant === "gold";

  const specializations = member.expertise
    ? member.expertise
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    : [];

  return (
    <div className="group bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xs flex flex-col justify-between p-5 sm:p-6 h-full">
      <div>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">
          {/* ── 1. Prominent Framed Portrait Photo ── */}
          <Link
            href={detailHref}
            className="relative w-32 sm:w-36 md:w-40 aspect-4/5 shrink-0 overflow-hidden rounded-xs border border-slate-200/90 shadow-2xs bg-slate-100 block group/photo"
          >
            <Image
              src={imageSrc}
              alt={member.name}
              fill
              className="object-cover object-top group-hover/photo:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
              priority
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
          </Link>

          {/* ── 2. Refined Academic Profile Information ── */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Role Badge */}
            <div className="flex items-center justify-center sm:justify-start">
              {isGold ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[10.5px] font-bold uppercase tracking-wider">
                  <Award className="h-3 w-3 text-amber-600" />
                  <span>{member.role}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1e40af] border border-blue-200/80 text-[10.5px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3 text-[#1e40af]" />
                  <span>{member.role}</span>
                </span>
              )}
            </div>

            {/* Academic Name */}
            <Link href={detailHref} className="block mt-2 group/title">
              <h3 className="font-academic text-xl sm:text-[22px] font-bold text-slate-950 group-hover/title:text-[#1e40af] transition-colors leading-snug">
                {member.name}
              </h3>
            </Link>

            {/* Department & Institution with Icons */}
            <div className="mt-2 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-700 font-medium">
                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{member.unit}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{member.institution || "Gono Bishwabidyalay"}</span>
              </div>
            </div>

            {/* Specialization Tags */}
            {specializations.length > 0 && (
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap justify-center sm:justify-start gap-1.5">
                {specializations.slice(0, 2).map((spec) => (
                  <span
                    key={spec}
                    className="inline-block px-2.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-200/70 text-[11px] font-medium rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Action Bar ── */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          href={detailHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs rounded-xs group/btn"
        >
          <span>View Full Profile</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#1e40af] transition-colors"
        >
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          <span>Contact Desk</span>
        </Link>
      </div>
    </div>
  );
}

export function EditorInChiefCard({ chief, managing }: EditorInChiefCardProps) {
  if (!chief && !managing) {
    return (
      <section aria-label="Executive Editorial Leadership" className="space-y-8">
        <div className="pb-6 border-b border-slate-200/80">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
            EXECUTIVE LEADERSHIP
          </p>
          <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] text-slate-950">
            Executive Editorial Leadership
          </h2>
        </div>
        <div className="bg-white border border-dashed border-slate-300 p-8 text-center">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-academic text-lg font-medium text-slate-800">
            Editorial Leadership Roster Updating
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            The editorial executive committee appointments are currently being updated for the upcoming publication cycle.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Executive Editorial Leadership" className="space-y-8">
      {/* Section Header */}
      <div className="pb-6 border-b border-slate-200/80">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
          EXECUTIVE LEADERSHIP
        </p>
        <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] text-slate-950">
          Executive Editorial Leadership
        </h2>
      </div>

      {/* Leadership Cards Grid: 2 in a row on md and lg screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {chief && <LeadershipCard member={chief} badgeVariant="gold" />}
        {managing && <LeadershipCard member={managing} badgeVariant="blue" />}
      </div>
    </section>
  );
}
