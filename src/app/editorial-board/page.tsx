import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Landmark,
  Library,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { boardMembers } from "@/lib/data";
import { EditorialBoardHero } from "@/components/editorial/editorial-board-hero";
import { EditorInChiefCard } from "@/components/editorial/editor-in-chief-card";
import { SectionEditorsGrid } from "@/components/editorial/section-editors-grid";
import { AdvisoryCouncilSection } from "@/components/editorial/advisory-council-section";

export const metadata: Metadata = {
  title: "Editorial Board & Governance — GB Journal of Research",
  description:
    "Meet the academic leadership, section editors, and international advisory council of the Gono Bishwabidyalay Journal of Research. Discover our COPE-aligned governance charter and double-blind peer review oversight.",
};

const GOVERNANCE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Editorial Independence",
    subtitle: "Merit-Based Outcomes",
    description:
      "All manuscript decisions are made strictly on academic merit, research rigor, and peer review outcomes, without influence from commercial, institutional, or political interests.",
  },
  {
    icon: Scale,
    title: "COPE Code of Conduct",
    subtitle: "Ethical Integrity",
    description:
      "Our governance model strictly follows the Committee on Publication Ethics (COPE) guidelines for handling authorship disputes, conflict disclosures, and data integrity verification.",
  },
  {
    icon: Users,
    title: "Double-Blind Review Integrity",
    subtitle: "Objective Appraisal",
    description:
      "Author identities and reviewer details remain completely concealed throughout the evaluation cycle, ensuring objective and impartial scholarly assessment.",
  },
  {
    icon: BookOpen,
    title: "Transparent Retractions & Appeals",
    subtitle: "Accountable Record",
    description:
      "Defined protocols for post-publication corrections, retractions, expressions of concern, and author appeal procedures maintain the highest standards of the scholarly record.",
  },
];

export default function EditorialBoardPage() {
  const chief =
    boardMembers.find((m) => m.role === "Editor-in-Chief") || boardMembers[0];
  const managing =
    boardMembers.find((m) => m.role === "Managing Editor") || boardMembers[1];
  const sectionEditors = boardMembers.filter(
    (m) => m.role !== "Editor-in-Chief" && m.role !== "Managing Editor"
  );

  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      <FadeIn delay={0.05}>
        <EditorialBoardHero />
      </FadeIn>

      <div className="bg-[#fbfcff] py-14 sm:py-20 border-b border-slate-200/80">
        <div className="container-x space-y-16 sm:space-y-20">
          {/* ── 2. Executive Leadership ── */}
          <FadeIn delay={0.1}>
            <EditorInChiefCard chief={chief} managing={managing} />
          </FadeIn>

          {/* ── 3. Section Editors Grid ── */}
          <FadeIn delay={0.15}>
            <SectionEditorsGrid editors={sectionEditors} />
          </FadeIn>

          {/* ── 4. International Advisory Council ── */}
          <FadeIn delay={0.2}>
            <AdvisoryCouncilSection />
          </FadeIn>
        </div>
      </div>

      {/* ── 5. Editorial Governance Charter ── */}
      <section
        aria-label="Editorial Governance Charter"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                GOVERNANCE CHARTER
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Ethical Principles & Review Oversight
              </h2>
            </div>
            <Link
              href="/policies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
            >
              <span>View Full Editorial Policies</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {GOVERNANCE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-slate-50/60 border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                      {pillar.subtitle}
                    </p>
                    <h3 className="font-academic text-lg font-medium text-slate-950 mt-1">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Join the Peer Review Panel & Contact Desk ── */}
      <section
        aria-label="Join Reviewer Panel and Contact"
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
              {/* Left Column: Reviewer Recruitment */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <Users className="h-3.5 w-3.5" />
                  <span>JOIN OUR ACADEMIC COMMUNITY</span>
                </div>

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.025em] text-white leading-[1.15]">
                  Become a Peer Reviewer for GB Journal
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  We invite active researchers, faculty members, and clinical specialists across health sciences, pharmacy, agriculture, engineering, and social development to join our verified peer reviewer panel.
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Double-Blind Accreditation
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Award className="h-3.5 w-3.5 text-amber-300" />
                    Reviewer Certificates
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    Flexible Review Cycles
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/reviewers"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Apply as Peer Reviewer</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Submit Manuscript</span>
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
                      Office
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Board Inquiries & Nominations
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Have questions regarding editorial nominations, special issues, or board governance? Contact the secretariat office directly.
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
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">University Campus</p>
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
    </PageShell>
  );
}
