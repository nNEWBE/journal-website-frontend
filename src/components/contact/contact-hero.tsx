"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  Globe2,
  GraduationCap,
  Landmark,
  Library,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

export function ContactHero() {
  return (
    <section
      aria-label="Contact Editorial Office Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                <Mail className="h-3.5 w-3.5" />
                EDITORIAL SECRETARIAT
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                Gono Bishwabidyalay Official Communications
              </span>
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              Contact Editorial Office & Secretariat
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
              Get in direct touch with the <strong className="text-slate-900 font-semibold">Gono Bishwabidyalay Journal of Research</strong> editorial board, managing desk, and review secretariat. We welcome manuscript submissions, reviewer applications, special issue proposals, and institutional inquiries.
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">24–48h Response SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Author Tracking Helpline</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#1e40af]" />
                <span className="font-semibold text-slate-900">Official Campus Secretariat</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#inquiry-form"
                className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <span>Send Direct Inquiry</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Link
                href="/authors"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                <span>Author Guidelines</span>
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

          {/* Right Column: Secretariat Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  GB
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    SECRETARIAT DESK
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    Office Specifications
                  </p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Desk Active
              </span>
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Campus Location</span>
                <span className="font-semibold text-slate-900">Nolam, Savar, Dhaka 1344</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Primary Email</span>
                <span className="font-mono font-semibold text-[#1e40af]">editorial@gonobishwabidyalay.edu.bd</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Telephone Direct</span>
                <span className="font-mono font-semibold text-slate-900">+880-2-7740060 (Ext: 104)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Working Hours</span>
                <span className="font-semibold text-slate-900">Sun – Thu: 9:00 AM – 4:00 PM</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Response Window</span>
                <span className="font-semibold text-emerald-700">Within 24–48 Business Hours</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Manuscript Inquiries</span>
                <span className="font-semibold text-slate-900">Include Manuscript ID</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Administrative Archiving:</span>
              All communications sent to the editorial secretariat are formally logged under persistent tracking reference codes to ensure accountability.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
