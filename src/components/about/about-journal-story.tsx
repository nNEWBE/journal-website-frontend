"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck2,
  FileText,
  Globe,
  Globe2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Library,
  Link2,
  LockOpen,
  Mail,
  PawPrint,
  Pill,
  Scale,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Users,
} from "lucide-react";
import { boardMembers } from "@/lib/data";

interface TopicInfo {
  name: string;
  icon: typeof HeartPulse;
  description: string;
  count: string;
}

const SCOPE_TOPICS: TopicInfo[] = [
  {
    name: "Medical & Health Sciences",
    icon: Stethoscope,
    description:
      "Clinical medicine, epidemiology, public health interventions, diagnostic advancements, and community health models.",
    count: "48+ Articles",
  },
  {
    name: "Pharmacy & Pharmacology",
    icon: Pill,
    description:
      "Antimicrobial stewardship, pharmaceutical formulation, drug design, natural product evaluation, and clinical pharmacy.",
    count: "36+ Articles",
  },
  {
    name: "Biological & Life Sciences",
    icon: HeartPulse,
    description:
      "Molecular biology, microbiology, genomics, bioinformatics, and cellular mechanisms in human health.",
    count: "32+ Articles",
  },
  {
    name: "Veterinary & Animal Sciences",
    icon: PawPrint,
    description:
      "Zoonotic disease transmission, veterinary clinical research, animal immunology, and livestock welfare.",
    count: "24+ Articles",
  },
  {
    name: "Agricultural & Environmental Sciences",
    icon: Sprout,
    description:
      "Climate-resilient agriculture, soil health, crop genetics, sustainable agro-ecosystems, and environmental remediation.",
    count: "29+ Articles",
  },
  {
    name: "Engineering & Applied Technology",
    icon: Cpu,
    description:
      "Biomedical instrumentation, machine learning in healthcare, renewable energy systems, and software engineering.",
    count: "26+ Articles",
  },
  {
    name: "Social Sciences & Development",
    icon: Users,
    description:
      "Community development, health economics, educational policy, social equity, and public welfare administration.",
    count: "31+ Articles",
  },
  {
    name: "Law, Bioethics & Governance",
    icon: Scale,
    description:
      "Bioethics, public health law, intellectual property in research, and institutional governance frameworks.",
    count: "18+ Articles",
  },
];

const PUBLICATION_BENCHMARKS = [
  {
    value: "18 Days",
    label: "Avg. First Decision",
    subtext: "Prompt initial desk screening and reviewer allocation",
    icon: Clock,
  },
  {
    value: "42 Days",
    label: "Submission to Publish",
    subtext: "Efficient double-blind review and layout production",
    icon: Calendar,
  },
  {
    value: "100%",
    label: "CrossRef DOI Minting",
    subtext: "Permanent digital identifiers and metadata deposition",
    icon: Link2,
  },
  {
    value: "0 BDT",
    label: "Submission Fees",
    subtext: "Transparent policies with zero hidden author fees",
    icon: Award,
  },
];

const EDITORIAL_LIFECYCLE = [
  {
    stage: "01",
    title: "Manuscript Submission",
    timeline: "Day 0",
    description:
      "Authors submit files, structured abstracts, author affiliations, conflict of interest declarations, and ethical approval certificates via the online portal.",
    icon: FileText,
  },
  {
    stage: "02",
    title: "Initial Desk Screening",
    timeline: "Days 3–5",
    description:
      "The Editor-in-Chief and Associate Editors perform initial appraisal for journal scope, academic originality, and automated plagiarism compliance (similarity < 15%).",
    icon: ShieldCheck,
  },
  {
    stage: "03",
    title: "Double-Blind Peer Review",
    timeline: "Weeks 2–4",
    description:
      "Manuscripts are assigned to two or more independent external peer reviewers. Author identities and reviewer details remain strictly concealed.",
    icon: Users,
  },
  {
    stage: "04",
    title: "Revisions & Editorial Decision",
    timeline: "Weeks 4–6",
    description:
      "Authors receive detailed reviewer comments and editorial decision (Accept, Minor Revision, Major Revision, or Reject). Revisions are re-evaluated promptly.",
    icon: Scale,
  },
  {
    stage: "05",
    title: "Production & Open Access",
    timeline: "Within 7 Days",
    description:
      "Accepted papers undergo copyediting, layout typesetting, DOI registration with CrossRef, and immediate worldwide open-access publication.",
    icon: Globe2,
  },
];

const PUBLISHING_CHARTER = [
  {
    id: "pc-1",
    title: "Rigorous Double-Blind Review",
    subtitle: "Objective Academic Assessment",
    description:
      "Every original article is scrutinized by at least two qualified subject specialists without bias, ensuring merit-based publication.",
    icon: ShieldCheck,
  },
  {
    id: "pc-2",
    title: "Universal Open Access",
    subtitle: "Zero Paywall Policy",
    description:
      "All accepted papers are published under Creative Commons CC BY 4.0, allowing free reading, downloading, sharing, and citations globally.",
    icon: LockOpen,
  },
  {
    id: "pc-3",
    title: "COPE Ethics Alignment",
    subtitle: "High Standard of Integrity",
    description:
      "The journal adheres to the Committee on Publication Ethics (COPE) guidelines for handling authorship disputes, retractions, and data integrity.",
    icon: Scale,
  },
  {
    id: "pc-4",
    title: "Permanent DOI & Archiving",
    subtitle: "Enduring Scholarly Record",
    description:
      "Every paper receives a persistent CrossRef DOI, preserved in institutional archives and digital indexing services for perpetual availability.",
    icon: Archive,
  },
];

const INDEXING_REGISTRIES = [
  {
    name: "CrossRef",
    type: "Permanent DOI Indexing",
    description: "Every published article is minted with a persistent digital object identifier for global citation tracking.",
    icon: Link2,
    badge: "Active DOI Minting",
  },
  {
    name: "Google Scholar",
    type: "Automated Academic Crawling",
    description: "Full-text indexing with complete metadata tags for maximum visibility in academic search results.",
    icon: GraduationCap,
    badge: "Indexed",
  },
  {
    name: "BanglaJOL",
    type: "Regional Journal Repository",
    description: "Registered repository participant promoting South Asian scholarly output and regional scientific impact.",
    icon: Library,
    badge: "Listed Journal",
  },
  {
    name: "Creative Commons",
    type: "Open Access License (CC BY 4.0)",
    description: "Permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.",
    icon: Globe2,
    badge: "Open License",
  },
];

export function AboutJournalStory({ topics }: { topics?: string[] }) {
  // Extract key editorial leaders for the governance preview section
  const editorialLeaders = boardMembers.slice(0, 4);

  return (
    <div className="space-y-0">
      {/* ── Section 1: Academic Mission & Institutional Purpose ── */}
      <section
        aria-label="Mission and Purpose"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                MISSION & PURPOSE
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                A University Journal with Public Purpose
              </h2>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
            >
              <span>Explore Published Research</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mt-10 items-start">
            <div>
              <blockquote className="border-l-3 border-[#1e40af] pl-5 py-1">
                <p className="font-academic text-xl sm:text-2xl font-medium leading-snug text-slate-950">
                  &ldquo;Helping credible, peer-reviewed research travel from author to global reader through open discovery and scholarly integrity.&rdquo;
                </p>
              </blockquote>

              <p className="mt-6 text-sm leading-relaxed text-slate-600">
                Founded under the academic stewardship of <strong className="text-slate-900 font-semibold">Gono Bishwabidyalay</strong>, the journal serves as an inclusive platform for rigorous empirical inquiry, innovative methodologies, and transformative research that addresses both regional challenges and global scientific frontiers.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Our editorial board maintains uncompromising academic standards while ensuring equitable access for emerging and established researchers worldwide.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="font-academic lining-nums text-2xl sm:text-3xl font-medium text-slate-950">
                    8+
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] mt-1">
                    Academic Fields
                  </p>
                </div>
                <div>
                  <p className="font-academic lining-nums text-2xl sm:text-3xl font-medium text-slate-950">
                    2x
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] mt-1">
                    Yearly Issues
                  </p>
                </div>
                <div>
                  <p className="font-academic lining-nums text-2xl sm:text-3xl font-medium text-emerald-700">
                    100%
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] mt-1">
                    Open Access
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af] mb-4">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="font-ui text-sm font-bold text-slate-950">
                  Publication Scope
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Original research articles, systematic reviews, short communications, and case studies chosen strictly on academic merit.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af] mb-4">
                  <Landmark className="h-5 w-5" />
                </span>
                <h3 className="font-ui text-sm font-bold text-slate-950">
                  University Stewardship
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Sustained institutional support from Gono Bishwabidyalay ensuring permanent digital preservation and editorial autonomy.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af] mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="font-ui text-sm font-bold text-slate-950">
                  Peer Review Integrity
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Strict double-blind peer review safeguarding impartial appraisal and constructive feedback for all authors.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af] mb-4">
                  <Globe className="h-5 w-5" />
                </span>
                <h3 className="font-ui text-sm font-bold text-slate-950">
                  Global Dissemination
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Immediate worldwide dissemination with full machine-readable metadata, CrossRef DOI indexing, and open citations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Key Publication Benchmarks ── */}
      <section
        aria-label="Publication Benchmarks"
        className="py-12 sm:py-16 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PUBLICATION_BENCHMARKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-slate-50/60 border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center bg-white border border-slate-200/80 text-[#1e40af] mb-4 shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font-academic lining-nums text-3xl font-medium text-slate-950">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3: Aims & Scope Across Disciplines ── */}
      <section
        aria-label="Aims and Scope"
        className="py-14 sm:py-20 bg-slate-50/40 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                AIMS & SCOPE
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Interdisciplinary Subject Coverage
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              GB Journal bridges disciplinary boundaries across healthcare, biotechnology, engineering, and social development.
            </p>
          </div>

          {/* 4x2 Discipline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {SCOPE_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.name}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-2xs transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] font-bold font-mono text-slate-400">
                        {topic.count}
                      </span>
                    </div>

                    <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 mt-4 leading-snug">
                      {topic.name}
                    </h3>

                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                      href="/articles"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] hover:underline"
                    >
                      <span>View Subject Articles</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4: Editorial Leadership & Academic Governance ── */}
      <section
        aria-label="Editorial Leadership"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                EDITORIAL LEADERSHIP
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Academic Governance & Editorial Board
              </h2>
            </div>
            <Link
              href="/editorial-board"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
            >
              <span>Meet Full Editorial Board</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {editorialLeaders.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border border-slate-200/80 mb-4">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Users className="h-10 w-10" />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0b1b3d]/90 text-white text-[9px] font-bold uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>

                  <h3 className="font-academic text-base font-bold text-slate-950">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-medium text-[#1e40af] mt-0.5">
                    {member.title}
                  </p>
                  <p className="text-[10.5px] text-slate-500 mt-1 font-mono">
                    {member.institution}
                  </p>
                  {member.expertise && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">Expertise:</span>{" "}
                      {member.expertise}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href="/editorial-board"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e40af] hover:underline"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Editorial & Peer Review Lifecycle ── */}
      <section
        aria-label="Editorial Lifecycle"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="pb-8 sm:pb-10 border-b border-slate-200/80">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              EDITORIAL WORKFLOW
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              The Peer Review & Publication Lifecycle
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every submission traverses a transparent, documented route from initial desk appraisal to final digital publication.
            </p>
          </div>

          {/* 5-Step Process Timeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
            {EDITORIAL_LIFECYCLE.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.stage}
                  className="bg-white border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs relative"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-base font-bold text-[#1e40af]">
                        {step.stage}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5">
                        {step.timeline}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-slate-900">
                      <Icon className="h-4 w-4 text-[#1e40af] shrink-0" />
                      <h3 className="font-ui text-sm font-bold leading-tight">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 6: Publishing Charter & Ethical Standards ── */}
      <section
        aria-label="Publishing Charter"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                PUBLISHING CHARTER
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Ethical Standards & Author Commitments
              </h2>
            </div>
            <Link
              href="/policies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
            >
              <span>View Full Journal Policies</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {PUBLISHING_CHARTER.map((charter) => {
              const Icon = charter.icon;
              return (
                <div
                  key={charter.id}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                      {charter.subtitle}
                    </p>
                    <h3 className="font-academic text-lg font-medium text-slate-950 mt-1">
                      {charter.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {charter.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 7: Indexing, Registries & Permanent Archiving ── */}
      <section
        aria-label="Indexing and Registries"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="pb-8 sm:pb-10 border-b border-slate-200/80">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              DISCOVERY & PRESERVATION
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              Indexing Registries & Open Discovery
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              GB Journal articles are structured for machine harvesting, global bibliographic indexation, and permanent academic preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {INDEXING_REGISTRIES.map((reg) => {
              const Icon = reg.icon;
              return (
                <div
                  key={reg.name}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                        {reg.badge}
                      </span>
                    </div>

                    <h3 className="font-academic text-xl font-medium text-slate-950 mt-4">
                      {reg.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      {reg.type}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {reg.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 8: Institutional Stewardship & Submit Action Box ── */}
      <section
        aria-label="Institutional Stewardship & Submission"
        className="py-14 sm:py-20 bg-white"
      >
        <div className="container-x">
          <div className="bg-[#0b1b3d] text-white p-8 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-center">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-[0.16em]">
                  <Landmark className="h-4 w-4" />
                  <span>Institutional Governance</span>
                </div>
                <h2 className="mt-3 font-academic text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-white leading-tight">
                  Published with Academic Integrity by Gono Bishwabidyalay
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  The journal operates under the oversight of university leadership, independent editorial panels, and global peer reviewers. We invite researchers, clinicians, and scholars to contribute their original research.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Submit Your Manuscript</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/editorial-board"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Meet Editorial Board</span>
                  </Link>
                </div>
              </div>

              {/* Editorial Contact Snapshot */}
              <div className="bg-white/5 border border-white/10 p-6 sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                  EDITORIAL DESK
                </p>
                <h3 className="mt-1 font-academic text-lg font-medium text-white">
                  Manuscript Inquiries & Support
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Have questions about scope, special issues, or author guidelines? Contact the editorial staff directly.
                </p>

                <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                    <a
                      href="mailto:editorial@gonobishwabidyalay.edu.bd"
                      className="hover:text-white underline text-slate-200"
                    >
                      editorial@gonobishwabidyalay.edu.bd
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Library className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutJournalStory;
