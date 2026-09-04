"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  GraduationCap,
  Library,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { CustomSelect } from "@/components/ui/custom-select";
import { ContactHero } from "@/components/contact/contact-hero";
import { AdminPageEditBadge } from "@/components/ui/admin-page-edit-badge";

const roleOptions = [
  "Author / Submitter",
  "Peer Reviewer",
  "Editorial Board Member",
  "Institutional Reader / Librarian",
  "General Inquirer",
];

const topicOptions = [
  "General Manuscript Inquiry",
  "Submission & Revision Assistance",
  "Reviewer Nomination & Application",
  "Special Issue Proposal",
  "Indexing, DOI & Archiving",
  "Ethical / Copyright Inquiries",
];

const editorialDesks = [
  {
    title: "Editor-in-Chief Secretariat",
    email: "editorinchief@gonobishwabidyalay.edu.bd",
    lead: "Executive Governance & Editorial Strategy",
    scope: "Overall editorial governance, final manuscript appeals, ethics complaints, and special issue commissions.",
  },
  {
    title: "Managing Editor & Production Desk",
    email: "managing.editor@gonobishwabidyalay.edu.bd",
    lead: "Typesetting & Volume Assembly",
    scope: "Production scheduling, copyediting queries, DOI registrations, layout proofs, and volume publishing.",
  },
  {
    title: "Peer Review & Ethics Secretariat",
    email: "reviewers@gonobishwabidyalay.edu.bd",
    lead: "Review Management & COPE Audits",
    scope: "Peer reviewer registration, double-blind audit protocols, similarity checks (<15%), and referee credentials.",
  },
  {
    title: "Institutional Subscriptions & Reprints",
    email: "secretariat@gonobishwabidyalay.edu.bd",
    lead: "Archival Access & Campus Distribution",
    scope: "Institutional digital repository archiving, print copy requests, copyright clearance, and indexing inquiries.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Author / Submitter",
    subject: "General Manuscript Inquiry",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setReference(`GB-${Math.floor(Math.random() * 900000 + 100000)}`);
      setFormData({
        name: "",
        email: "",
        role: "Author / Submitter",
        subject: "General Manuscript Inquiry",
        message: "",
      });
    }, 1200);
  };

  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      <FadeIn delay={0.05}>
        <ContactHero />
      </FadeIn>

      {/* ── 2. Directory & Interactive Inquiry Form ── */}
      <section
        id="inquiry-form"
        aria-label="Editorial Contact Form & Directory"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
            {/* Left Column: Office Directory Cards */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                      CAMPUS DIRECTORY
                    </p>
                    <h2 className="font-academic text-xl font-medium text-slate-950 mt-0.5">
                      Secretariat Office Details
                    </h2>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="space-y-5 divide-y divide-slate-100 text-xs">
                  <div className="flex items-start gap-4 pt-1 first:pt-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                      <MapPin className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Postal Address</h3>
                      <p className="mt-1 text-slate-800 font-medium leading-relaxed">
                        Gono Bishwabidyalay, Nolam,<br />
                        Savar, Dhaka 1344, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                      <Mail className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Electronic Mail</h3>
                      <a
                        href="mailto:editorial@gonobishwabidyalay.edu.bd"
                        className="mt-1 inline-block font-mono font-semibold text-[#1e40af] hover:underline"
                      >
                        editorial@gonobishwabidyalay.edu.bd
                      </a>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        For manuscript status, proofing, and author support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                      <Phone className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Telephone Directory</h3>
                      <p className="mt-1 font-mono font-semibold text-slate-900">
                        +880-2-7740060 <span className="font-normal text-slate-500">(Ext: 104)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Sun – Thu, 9:00 AM – 4:00 PM (GMT+6)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                      <Clock className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Response Window</h3>
                      <p className="mt-1 text-slate-700 font-medium">
                        Within 24–48 business hours for all official tickets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manuscript tracking helper */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1e40af]">
                  <Building2 className="h-4 w-4 text-[#1e40af]" />
                  <span>Manuscript Inquiries Protocol</span>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                  When inquiring about an ongoing submission or peer-review report, please cite your official <strong className="text-slate-900 font-semibold">Manuscript Tracking ID</strong> in all communications to expedite editorial routing.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                    OFFICIAL CORRESPONDENCE
                  </p>
                  <h2 className="font-academic text-2xl font-medium text-slate-950 mt-0.5">
                    Transmit an Editorial Message
                  </h2>
                </div>
                <span className="flex h-8 w-8 items-center justify-center bg-[#0b1b3d] text-white">
                  <MessageSquare className="h-4 w-4" />
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Prof. Dr. Farhana Rahman"
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="author@university.edu.bd"
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Academic Role
                    </label>
                    <CustomSelect
                      options={roleOptions}
                      value={formData.role}
                      onChange={(val) => setFormData({ ...formData, role: val })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Topic Category
                    </label>
                    <CustomSelect
                      options={topicOptions}
                      value={formData.subject}
                      onChange={(val) => setFormData({ ...formData, subject: val })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Detailed Inquiry / Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter details of your inquiry, referencing your manuscript ID or institutional affiliation if applicable..."
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-800 font-medium leading-relaxed focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold">Message Logged Successfully</p>
                      <p className="mt-0.5 text-emerald-800">
                        Your inquiry has been assigned Tracking Reference <strong className="font-mono">{reference}</strong>. Our editorial desk will reply within 24–48 hours.
                      </p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 text-rose-900 text-xs">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                    <p>Please fill out all required fields before transmitting your message.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Departmental Editorial Desks ── */}
      <section
        aria-label="Departmental Desks"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                SPECIALIZED DIRECTORY
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Departmental Editorial Desks
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Connect directly with specialized desks handling governance, copyediting, peer review audits, and archival distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {editorialDesks.map((desk) => (
              <div
                key={desk.title}
                className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2 py-0.5 border border-blue-100">
                    {desk.lead}
                  </span>

                  <h3 className="mt-3 font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                    {desk.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                    {desk.scope}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-200/80">
                  <a
                    href={`mailto:${desk.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1e40af] hover:underline break-all"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{desk.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Integrated Campus Location Map ── */}
      <section
        aria-label="Campus Location Map"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-slate-50/80 border-b border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                  PHYSICAL HEADQUARTERS
                </p>
                <h3 className="font-academic text-xl font-medium text-slate-950 mt-0.5">
                  Gono Bishwabidyalay Campus Map
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nolam, Savar, Dhaka 1344, Bangladesh
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Gono+Bishwabidyalay,+Nolam,+Savar,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] hover:underline"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="relative h-[360px] w-full bg-slate-100">
              <iframe
                title="Gono Bishwabidyalay Location Map"
                src="https://maps.google.com/maps?q=Gono+Bishwabidyalay,+Nolam,+Savar,+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Call for Manuscripts CTA ── */}
      <section
        aria-label="Call for Papers CTA"
        className="py-14 sm:py-20 bg-white"
      >
        <div className="container-x">
          <div className="relative overflow-hidden bg-[#060e22] text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
            {/* Top gold-to-blue accent line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-500 to-transparent" />

            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
              {/* Left Column: Call for Papers */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <FileText className="h-3.5 w-3.5" />
                  <span>CALL FOR PAPERS · VOL. 2026/2027</span>
                </div>

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.025em] text-white leading-[1.15]">
                  Ready to Submit Your Manuscript?
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Submit your research across health sciences, pharmacy, agriculture, law, computing, and social welfare. Enjoy rapid 14-day initial review and free Open Access publication.
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    14-Day Initial Review
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    Global Open Access Reach
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Double-Blind Verification
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Submit Manuscript</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/authors"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Author Guidelines</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Editorial Secretariat Contact Card */}
              <div className="bg-white/[0.05] border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                      EDITORIAL SECRETARIAT
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Author Desk
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Direct Inquiry Helpline
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Have questions regarding manuscript formatting or track assignments? Contact the editorial staff directly.
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Editorial Email</p>
                        <a
                          href="mailto:editorial@gonobishwabidyalay.edu.bd"
                          className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                        >
                          editorial@gonobishwabidyalay.edu.bd
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Campus Location</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href="#inquiry-form"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                  >
                    <span>Submit Inquiry Online</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdminPageEditBadge pageKey="contact" />
    </PageShell>
  );
}
