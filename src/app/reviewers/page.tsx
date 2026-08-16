import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  Star,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { ReviewersHero } from "@/components/reviewers/reviewers-hero";

export const metadata: Metadata = {
  title: "Reviewer Guidelines & Evaluation Rubric — GB Journal of Research",
  description:
    "Explore reviewer expectations, evaluation rubric, confidentiality protocols, and COPE-aligned standards for peer reviewers at the Gono Bishwabidyalay Journal of Research.",
};

const COVENANT_PRINCIPLES = [
  {
    number: "01",
    icon: UserCheck,
    title: "Availability & Conflict Check",
    subtitle: "Pre-Review Declaration",
    description:
      "Reviewers must confirm subject-matter expertise, absence of institutional or personal conflicts of interest, and availability to complete review within 14 days before manuscript files are unlocked.",
  },
  {
    number: "02",
    icon: FlaskConical,
    title: "Methodological Soundness",
    subtitle: "Scientific Rigor",
    description:
      "Evaluate research hypotheses, experimental controls, data reproducibility, sampling validity, and statistical analysis against discipline-specific international standards.",
  },
  {
    number: "03",
    icon: Lock,
    title: "Absolute Confidentiality",
    subtitle: "Privileged Information",
    description:
      "Manuscripts under review are privileged academic property. Reviewers must never distribute, quote, upload to generative AI, or appropriate unpublished concepts or data.",
  },
  {
    number: "04",
    icon: Scale,
    title: "Objective Conflict Disclosure",
    subtitle: "Unbiased Appraisal",
    description:
      "If a reviewer discovers the identity of the author during assessment or realizes a competing professional connection, they must immediately notify the editor and recuse themselves.",
  },
  {
    number: "05",
    icon: BookOpen,
    title: "Constructive & Actionable Feedback",
    subtitle: "Scholarly Mentorship",
    description:
      "Review reports must be clear, respectful, and evidence-supported. Critique should pinpoint specific deficiencies and offer actionable suggestions to strengthen the work.",
  },
  {
    number: "06",
    icon: ShieldCheck,
    title: "COPE Ethical Alignment",
    subtitle: "Integrity Compliance",
    description:
      "Assessments strictly comply with Committee on Publication Ethics (COPE) Ethical Guidelines for Peer Reviewers, upholding transparency, rigor, and mutual respect.",
  },
];

const REVIEW_LIFECYCLE = [
  {
    step: "01",
    stage: "Initial Invitation",
    timeframe: "Day 0",
    icon: Mail,
    title: "Invitation & Abstract Assessment",
    description:
      "The Section Editor sends an invitation with the anonymized title, abstract, and review deadline. The reviewer decides whether the topic fits their core expertise.",
  },
  {
    step: "02",
    stage: "Formal Acceptance",
    timeframe: "Within 48 Hours",
    icon: UserCheck,
    title: "Conflict & Commitment Declaration",
    description:
      "The reviewer accepts the invitation online, certifying zero conflict of interest and committing to the 14-day turnaround.",
  },
  {
    step: "03",
    stage: "Secure Examination",
    timeframe: "Days 1–10",
    icon: Eye,
    title: "Double-Blind Manuscript Appraisal",
    description:
      "The full anonymized manuscript and supplementary datasets become accessible through the secure portal for thorough analysis.",
  },
  {
    step: "04",
    stage: "Rubric Submission",
    timeframe: "By Day 14",
    icon: ClipboardList,
    title: "Structured Rubric & Recommendations",
    description:
      "The reviewer scores the 5 criteria, provides confidential comments to the editor, and submits itemized constructive feedback for the authors.",
  },
  {
    step: "05",
    stage: "Editorial Determination",
    timeframe: "Post-Review",
    icon: ShieldCheck,
    title: "Editorial Synthesis & Certificate",
    description:
      "The Editor-in-Chief synthesizes referee reports to render the editorial verdict (Accept, Minor/Major Revision, or Reject) and issues an official Reviewer Certificate.",
  },
];

const RUBRIC_CRITERIA = [
  {
    num: "01",
    icon: Award,
    domain: "Originality & Scholarly Contribution",
    category: "Novelty & Significance",
    focus:
      "Does the manuscript present novel empirical findings, innovative theoretical insights, or a valuable critical synthesis that significantly advances the disciplinary state-of-the-art?",
    scale: "1 – 5 Scale",
    anchor: "Marginal to Exceptional Impact",
  },
  {
    num: "02",
    icon: FlaskConical,
    domain: "Methodological Rigor & Data Validity",
    category: "Scientific Soundness",
    focus:
      "Are experimental protocols, sampling criteria, statistical analyses, and reproducibility documentation sound, robust, and appropriately controlled against international benchmarks?",
    scale: "1 – 5 Scale",
    anchor: "Flawed to Highly Replicable",
  },
  {
    num: "03",
    icon: ShieldCheck,
    domain: "Ethical Compliance & Biosafety",
    category: "Integrity & Governance",
    focus:
      "Are institutional ethical approvals (IRB / Animal Welfare), informed consent protocols, conflict of interest declarations, and funding disclosures fully verified and documented?",
    scale: "Pass / Fail",
    anchor: "Mandatory Ethical Clearance",
  },
  {
    num: "04",
    icon: BookOpen,
    domain: "Literature Context & Critical Grounding",
    category: "Contextual Depth",
    focus:
      "Is contemporary peer-reviewed literature comprehensively integrated, accurately cited, and fairly synthesized without selective omissions or biased historiography?",
    scale: "1 – 5 Scale",
    anchor: "Deficient to Masterful Synthesis",
  },
  {
    num: "05",
    icon: FileText,
    domain: "Structure, Clarity & Data Presentation",
    category: "Scholarly Communication",
    focus:
      "Are figures, tables, supplementary data sets, and analytical arguments formatted clearly, logically organized, and written in concise academic English?",
    scale: "1 – 5 Scale",
    anchor: "Unclear to Exemplary Presentation",
  },
];

const RECOGNITION_BENEFITS = [
  {
    icon: Award,
    title: "Official Reviewer Certificate",
    description:
      "Every completed peer review is authenticated with an official, verifiable digital certificate issued by the Gono Bishwabidyalay Editorial Secretariat.",
  },
  {
    icon: Users,
    title: "Editorial Board Progression",
    description:
      "Outstanding and consistently punctual reviewers are given first consideration for appointment as Section Editors and Editorial Board members.",
  },
  {
    icon: FileText,
    title: "Annual Index Acknowledgement",
    description:
      "Reviewers are publicly acknowledged in the annual journal index volume and on the journal’s permanent academic registry portal.",
  },
  {
    icon: ArrowUpRight,
    title: "Fast-Track Author Priority",
    description:
      "Active reviewers receive priority processing and fee waivers on their own subsequent research submissions to the journal.",
  },
];

export default function ReviewersPage() {
  return (
    <PageShell>
      {/* ── 1. Hero Section ── */}
      <FadeIn delay={0.05}>
        <ReviewersHero />
      </FadeIn>

      {/* ── 2. The Six Reviewer Commitments (Covenant) ── */}
      <section
        aria-label="Reviewer Covenant"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                REVIEWER COVENANT
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                Six Commitments Behind Every Peer Appraisal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Reviewers safeguard unpublished science, assess evidence objectively, and deliver constructive feedback to advance scholarly discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {COVENANT_PRINCIPLES.map((covenant) => {
              const Icon = covenant.icon;
              return (
                <div
                  key={covenant.number}
                  className="bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-xs font-bold text-[#1e40af]">
                        {covenant.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {covenant.subtitle}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                        {covenant.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {covenant.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>COPE Compliance Enforced</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. The 5-Stage Peer Review Lifecycle ── */}
      <section
        aria-label="Peer Review Lifecycle"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">
          {/* Left Column: Timeline Overview & Metrics */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                REVIEW WORKFLOW
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.25rem] font-medium tracking-[-0.02em] text-slate-950">
                The 5-Stage Review Lifecycle
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                A structured, timed workflow ensures unbiased peer appraisal while maintaining predictable turnaround times for authors and editors.
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/90 divide-y divide-slate-200/80 text-xs">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="h-4 w-4 text-[#1e40af]" />
                  <span className="font-medium text-slate-700">Invitation Response</span>
                </div>
                <span className="font-mono font-bold text-slate-900">Within 48h</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Timer className="h-4 w-4 text-[#1e40af]" />
                  <span className="font-medium text-slate-700">Standard Review Window</span>
                </div>
                <span className="font-mono font-bold text-[#1e40af]">14 Days</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ClipboardList className="h-4 w-4 text-[#1e40af]" />
                  <span className="font-medium text-slate-700">Evaluation Criteria</span>
                </div>
                <span className="font-mono font-bold text-slate-900">5 Dimensions</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-100 text-xs text-[#1e40af] leading-relaxed">
              <span className="font-bold block mb-1">Double-Blind Guarantee:</span>
              Reviewers never see author names, affiliations, or acknowledgements. Author copy excludes all reviewer identities.
            </div>
          </div>

          {/* Right Column: 5 Sequential Timeline Cards */}
          <div className="space-y-4">
            {REVIEW_LIFECYCLE.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.step}
                  className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-5 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex sm:flex-col items-center sm:items-center justify-between sm:justify-start gap-2 shrink-0">
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Step {phase.step}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950">
                        {phase.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10.5px] font-mono font-semibold border border-slate-200/80">
                        {phase.timeframe}
                      </span>
                    </div>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Formal 5-Dimension Evaluation Rubric ── */}
      <section
        id="rubric"
        aria-label="Evaluation Rubric"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                EVALUATION RUBRIC
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                Five Structured Assessment Dimensions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Each manuscript is rated across five standardized criteria accompanied by itemized written feedback and recommendations.
            </p>
          </div>

          {/* Rubric Table Container */}
          <div className="mt-10 bg-white border border-slate-300 shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="bg-[#0b1b3d] text-white px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/10 text-amber-300">
                  <ClipboardList className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-academic text-lg sm:text-xl font-medium text-white">
                    Objective Peer Review Scorecard
                  </h3>
                  <p className="text-xs text-slate-300 font-normal">
                    Standardized double-blind evaluation matrix across five weighted dimensions.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-block px-3 py-1 bg-white/10 border border-white/15 text-[11px] font-mono text-slate-200">
                  5 Dimensions · 1–5 Scoring Scale
                </span>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                    <th className="px-6 py-3.5 w-[320px] sm:w-[360px]">Evaluation Dimension</th>
                    <th className="px-6 py-3.5">Assessment Focus & Verification Guidelines</th>
                    <th className="px-6 py-3.5 text-right w-64 min-w-[220px]">Rating Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/90">
                  {RUBRIC_CRITERIA.map((criterion) => {
                    const Icon = criterion.icon;
                    const isEthics = criterion.scale === "Pass / Fail";
                    return (
                      <tr
                        key={criterion.num}
                        className="hover:bg-blue-50/40 border-l-3 border-l-transparent hover:border-l-[#1e40af] transition-all group"
                      >
                        <td className="px-6 py-5 align-top">
                          <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50/80 border border-blue-100/90 text-[#1e40af] group-hover:bg-[#0b1b3d] group-hover:text-white transition-colors">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className="inline-block bg-blue-50 text-[#1e40af] px-1.5 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider border border-blue-100 whitespace-nowrap">
                                  Criterion {criterion.num}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                  {criterion.category}
                                </span>
                              </div>
                              <h4 className="font-academic text-[14.5px] font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                                {criterion.domain}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top text-xs leading-relaxed text-slate-600 font-medium pr-4">
                          {criterion.focus}
                        </td>
                        <td className="px-6 py-5 align-top text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold font-mono border shadow-2xs ${
                                isEthics
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-blue-50 text-[#1e40af] border-blue-200"
                              }`}
                            >
                              {isEthics && <ShieldCheck className="h-3 w-3 text-emerald-600" />}
                              <span>{criterion.scale}</span>
                            </span>
                            <p className="text-[10.5px] font-semibold text-slate-500 text-right leading-tight">
                              {criterion.anchor}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scorecard Footnote */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af] shrink-0" />
                <span className="text-[11.5px] font-medium">
                  <strong>Threshold for Recommendation:</strong> Aggregate minimum score of 18/25 points with an unconditional Ethical Clearance.
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0">
                COPE Guideline Matrix v4.2
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Reviewer Recognition & Accreditation Benefits ── */}
      <section
        aria-label="Reviewer Recognition and Benefits"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                SCHOLARLY RECOGNITION
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                Reviewer Accreditation & Community Benefits
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              We value the time and expertise of our reviewers with authenticated credentials, annual public recognition, and priority consideration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {RECOGNITION_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-academic text-base font-medium text-slate-950 leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Join the Expert Reviewer Panel & Secretariat CTA ── */}
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
                  <span>JOIN THE REVIEWER PANEL</span>
                </div>

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.025em] text-white leading-[1.15]">
                  Apply to Join Our Expert Referee Network
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  We welcome qualified researchers holding a doctoral degree (PhD), clinical fellowship, or senior academic rank with an active publication record in health, pharmacy, agriculture, law, computing, or social sciences.
                </p>

                {/* Eligibility Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
                    PhD / Senior Academic Rank
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <FileCheck2 className="h-3.5 w-3.5 text-blue-400" />
                    Active Publishing Record
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    COPE Ethics Commitment
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="mailto:editorial@gonobishwabidyalay.edu.bd?subject=Reviewer%20Application%20GB%20Journal"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Submit Reviewer Application</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/editorial-board"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Editorial Board</span>
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
                      Reviewer Desk
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Reviewer Inquiries & Support
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Need assistance with manuscript access, rubric scoring, or timeline extension requests? Reach our editorial team directly.
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Direct Email</p>
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
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Secretariat Office</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Turnaround Standard</p>
                        <p className="text-xs text-emerald-300 mt-0.5">
                          Reviewer support desk responds within 24–48 hours
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
                    <span>Contact Editorial Secretariat</span>
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
