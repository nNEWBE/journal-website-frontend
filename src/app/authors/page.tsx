"use client";

import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  FlaskConical,
  Globe2,
  GraduationCap,
  Layers,
  Library,
  Mail,
  MapPin,
  MessageSquareText,
  PenLine,
  Scale,
  Send,
  ShieldCheck,
  Tag,
  UploadCloud,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { AuthorsHero } from "@/components/authors/authors-hero";
import { AdminPageEditBadge } from "@/components/ui/admin-page-edit-badge";
import { articleTypes } from "@/lib/data";

const articleTypeDetails: Record<
  string,
  {
    icon: typeof FlaskConical;
    wordLimit: string;
    description: string;
    structure: string;
  }
> = {
  "Research Article": {
    icon: FlaskConical,
    wordLimit: "4,000 – 8,000 words",
    description: "Original empirical investigations, laboratory experiments, clinical trials, or field studies presenting novel findings.",
    structure: "Abstract · Introduction · Materials & Methods · Results · Discussion · References",
  },
  "Review Article": {
    icon: Library,
    wordLimit: "5,000 – 10,000 words",
    description: "Comprehensive, critical evaluations of published literature identifying current knowledge gaps and future research trends.",
    structure: "Abstract · Introduction · Methodological Synthesis · Thematic Sections · Future Directions · References",
  },
  "Case Study": {
    icon: ClipboardCheck,
    wordLimit: "2,500 – 4,500 words",
    description: "In-depth explorations of specific institutional interventions, clinical cases, legal precedents, or community health initiatives.",
    structure: "Abstract · Introduction · Case Presentation · Diagnostic / Intervention Assessment · Discussion · References",
  },
  "Short Communication": {
    icon: MessageSquareText,
    wordLimit: "1,500 – 3,000 words",
    description: "Concise preliminary reports of significant findings, methodological innovations, or urgent scientific discoveries.",
    structure: "Abstract · Context & Findings · Methods Summary · Results & Implications · References",
  },
  Perspective: {
    icon: Eye,
    wordLimit: "2,000 – 4,000 words",
    description: "Scholarly, evidence-informed opinions offering fresh interpretations of pressing academic debates or emerging controversies.",
    structure: "Abstract · Current Scholarly Context · Critical Perspective · Policy & Research Implications · References",
  },
  Editorial: {
    icon: PenLine,
    wordLimit: "1,000 – 2,500 words",
    description: "Authoritative commentary from the Editorial Board or guest editors highlighting thematic volumes, policy reforms, or symposium topics.",
    structure: "Executive Overview · Thematic Synthesis · Editorial Call to Action · References",
  },
  Letter: {
    icon: Mail,
    wordLimit: "800 – 1,500 words",
    description: "Scholarly correspondence offering constructive critiques, secondary analyses, or extensions of recently published articles in GB Journal.",
    structure: "Specific Article Reference · Methodological Critique · Corroborating Data · References",
  },
  "Policy Brief": {
    icon: Scale,
    wordLimit: "2,500 – 4,000 words",
    description: "Action-oriented analyses translating rigorous scientific evidence into actionable public health, agricultural, or legal policy directives.",
    structure: "Executive Summary · Policy Context · Evidence Critique · Concrete Policy Recommendations · References",
  },
};

const preparationItems = [
  {
    icon: FileText,
    title: "Main Editable Manuscript",
    desc: "Complete document (DOCX or LaTeX) with title, abstract, keywords, body sections, tables, and references.",
    spec: "Double-spaced, 12pt Times New Roman, line numbering enabled.",
  },
  {
    icon: Eye,
    title: "Anonymized Blinded Review Copy",
    desc: "A separate version with all author names, institutional affiliations, acknowledgments, and self-identifying citations excised for double-blind review.",
    spec: "Required for peer review. No institutional identifiers.",
  },
  {
    icon: Users,
    title: "Title Page & Author Affiliations",
    desc: "Standalone document listing full author names, institutional affiliations, ORCID IDs, and corresponding author email address.",
    spec: "Includes contributor credit statement (CRediT taxonomy).",
  },
  {
    icon: BookOpen,
    title: "Structured Abstract & Keywords",
    desc: "A 250-word structured abstract (Background, Methods, Results, Conclusions) alongside 4–6 MeSH/thematic index keywords.",
    spec: "No undefined abbreviations or uncited references.",
  },
  {
    icon: ShieldCheck,
    title: "Ethics & Compliance Declarations",
    desc: "Formal statements declaring Institutional Review Board (IRB) approval, informed patient/subject consent, funding sources, and conflict of interest.",
    spec: "Mandatory for all clinical, animal, and human studies.",
  },
  {
    icon: UploadCloud,
    title: "High-Resolution Artwork & Tables",
    desc: "Figures submitted as standalone 300+ DPI TIFF/PNG files. Tables provided in editable format with clear captions and footnotes.",
    spec: "RGB/CMYK 300 DPI minimum for photographs and micrographs.",
  },
];

const publicationWorkflow = [
  {
    step: "01",
    title: "Manuscript Intake & Screening",
    timeline: "Days 1 – 3",
    description: "The Managing Editor screens the submission for scope adherence, formatting compliance, and performs automated similarity check (< 15% threshold via Turnitin/iThenticate).",
  },
  {
    step: "02",
    title: "Section Editor Assignment",
    timeline: "Days 4 – 5",
    description: "The Editor-in-Chief assigns the manuscript to a specialized Section Editor who confirms disciplinary fit and nominates independent external reviewers.",
  },
  {
    step: "03",
    title: "Double-Blind Peer Review",
    timeline: "Days 6 – 20",
    description: "Two or more independent reviewers evaluate methodology, statistical validity, reproducibility, and contribution. An editorial decision is rendered.",
  },
  {
    step: "04",
    title: "Copyediting & DOI Publication",
    timeline: "Days 21 – 28",
    description: "Accepted manuscripts undergo professional copyediting, author proof approval, persistent CrossRef DOI registration, and immediate global Open Access publishing.",
  },
];

export default function AuthorsPage() {
  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      <FadeIn delay={0.05}>
        <AuthorsHero />
      </FadeIn>

      {/* ── 2. Accepted Manuscript Formats & 8 Article Types ── */}
      <section
        aria-label="Accepted Article Formats"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                ACCEPTED FORMATS
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Manuscript Categories & Requirements
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Select the article format that best represents your study design, evidence base, and intended scholarly contribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {articleTypes.map((typeKey, idx) => {
              const detail = articleTypeDetails[typeKey] || {
                icon: FileText,
                wordLimit: "3,000 – 6,000 words",
                description: "Scholarly research contribution meeting journal standards.",
                structure: "Abstract · Introduction · Methods · Results · Discussion · References",
              };
              const Icon = detail.icon;

              return (
                <div
                  key={typeKey}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <span className="font-mono text-xs font-bold text-[#1e40af]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 font-mono text-[10px] font-semibold">
                        {detail.wordLimit}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                        {typeKey}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {detail.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 bg-slate-50 p-2.5 text-[10.5px] text-slate-500 font-mono">
                    <strong className="text-slate-800 font-semibold block mb-0.5">Required Structure:</strong>
                    {detail.structure}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. 6-Item Manuscript Preparation Package ── */}
      <section
        id="checklist"
        aria-label="Submission Preparation Package"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
            {/* Left Column: Guidance Summary */}
            <div className="lg:sticky lg:top-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                SUBMISSION PREPARATION
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-slate-950">
                Complete Submission Package Checklist
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ensure every element is prepared before starting the online submission workflow. Submissions with complete metadata and properly formatted anonymized files proceed directly to review without administrative delay.
              </p>

              <div className="mt-6 bg-slate-50 border border-slate-200/90 p-5 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Article Processing Charges (No APC):</strong> Publishing is fully funded by the university.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Author Copyright:</strong> Authors retain unrestricted copyright under CC BY 4.0.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Fast Initial Decision:</strong> Receive first-round reviewer feedback within 14 days.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/dashboard/submissions/new"
                  className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                >
                  <span>Open Submission Portal</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: 6 Checklist Cards */}
            <div className="space-y-4">
              {preparationItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-slate-50/70 border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-start gap-4 shadow-2xs hover:border-slate-300 transition-all group"
                  >
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-xs text-[#1e40af] bg-blue-50 border border-blue-200 px-2 py-1">
                        0{idx + 1}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center bg-[#0b1b3d] text-white shrink-0">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {item.desc}
                      </p>
                      <p className="mt-2 text-[11px] font-mono text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 inline-block">
                        <strong>Standard:</strong> {item.spec}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The 4-Stage Editorial & Publication Pathway ── */}
      <section
        aria-label="Editorial Workflow"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                EDITORIAL PATHWAY
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                The 4-Stage Peer Review & Publication Journey
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              From initial file upload to CrossRef DOI indexation, experience an accountable and transparent editorial pathway.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {publicationWorkflow.map((stage) => (
              <div
                key={stage.step}
                className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-mono text-xs font-bold text-[#1e40af] bg-blue-50 border border-blue-100 px-2 py-0.5">
                      Stage {stage.step}
                    </span>
                    <span className="font-mono text-[10.5px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                      {stage.timeline}
                    </span>
                  </div>

                  <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                    {stage.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-[#1e40af]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Quality Assurance Check</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Technical Formatting & Citation Specifications ── */}
      <section
        aria-label="Formatting Specifications"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                TECHNICAL SPECIFICATIONS
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Formatting, References & Data Protocols
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Standardized formatting guidelines ensuring seamless copyediting, machine indexability, and cross-disciplinary citation clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950">
                  APA 7th Edition Citations
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  All references must follow the American Psychological Association (APA) 7th Edition format. Inclusion of active https://doi.org/... links is mandatory for all digital sources.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                Format: Author, A. (Year). Title. Journal, Vol(Issue), Pages. DOI
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                  <UploadCloud className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950">
                  300+ DPI High-Resolution Figures
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Graphics, charts, and micrographs must be submitted in TIFF, PNG, or vector PDF format at 300 DPI minimum for color and 600 DPI for line drawings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                Vector / 300 DPI raster with clear axis units and legends
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                  <Archive className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950">
                  Open Data & FAIR Availability
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Authors are strongly encouraged to deposit raw underlying datasets and code in open scholarly repositories (Dryad, Zenodo, Figshare, GitHub) with permanent DOIs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                FAIR Principles (Findable, Accessible, Interoperable, Reusable)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Call for Manuscripts CTA ── */}
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
                  Ready to Publish Your Research?
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Join leading international researchers publishing high-impact discoveries in health, pharmacy, agriculture, law, computing, and social welfare. Zero submission or publication fees.
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    14-Day First Decision
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    100% Free Open Access
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Double-Blind Peer Review
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Submit Your Manuscript</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/policies"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Editorial Policies</span>
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
                    Manuscript Inquiries & Support
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Need assistance with manuscript preparation or have questions regarding journal scope? Contact our editorial staff directly.
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
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                  >
                    <span>Contact Editorial Office</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdminPageEditBadge pageKey="authors" />
    </PageShell>
  );
}
