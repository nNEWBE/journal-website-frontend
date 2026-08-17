import { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  Lock,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareWarning,
  Scale,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { PoliciesHero } from "@/components/policies/policies-hero";
import { AdminPageEditBadge } from "@/components/ui/admin-page-edit-badge";

export const metadata: Metadata = {
  title: "Editorial Policies & Publication Ethics — GB Journal of Research",
  description:
    "Explore the comprehensive ethical framework, double-blind peer review policies, plagiarism thresholds, authorship standards, and open-access licensing of the Gono Bishwabidyalay Journal of Research.",
};

const POLICY_DIRECTORY = [
  {
    id: "peer-review",
    category: "Peer Review Integrity",
    number: "01",
    icon: Users,
    title: "Double-Blind Peer Review Policy",
    statement:
      "All original research, short communications, and systematic reviews undergo rigorous double-blind evaluation by at least two independent subject specialists.",
    compliance: [
      "Author names, institutions, and acknowledgements are stripped prior to reviewer dispatch.",
      "Reviewers must declare absence of personal, academic, or financial competing interests.",
      "Editorial decisions are based exclusively on academic merit, validity, and methodological soundness.",
    ],
  },
  {
    id: "authorship-ai",
    category: "Authorship & AI Use",
    number: "02",
    icon: FileText,
    title: "Authorship Criteria & AI Transparency",
    statement:
      "Authorship credit must follow ICMJE guidelines. AI and LLM tools cannot be listed as authors and must be transparently disclosed.",
    compliance: [
      "Every listed author must have made substantial contributions to design, data acquisition, or analysis.",
      "Any generative AI usage in data generation, analysis, or drafting must be explicitly stated in the Methods.",
      "Corresponding author takes institutional responsibility for all communication and data integrity.",
    ],
  },
  {
    id: "originality-plagiarism",
    category: "Originality & Plagiarism",
    number: "03",
    icon: SearchCheck,
    title: "Plagiarism & Similarity Screening",
    statement:
      "Every submission is screened via Crossref Similarity Check (iThenticate) before assignment to handling editors.",
    compliance: [
      "Overall similarity index must strictly remain below 15%, with no single source exceeding 3%.",
      "Self-plagiarism and redundant publication of previously copyrighted material are strictly prohibited.",
      "Manuscripts showing unreferenced text matching will be rejected immediately at desk screening.",
    ],
  },
  {
    id: "research-ethics",
    category: "Research Ethics & Approvals",
    number: "04",
    icon: Scale,
    title: "Human & Animal Research Approvals",
    statement:
      "Studies involving human subjects, patient records, or animal models must demonstrate formal institutional ethical clearance.",
    compliance: [
      "Human studies must comply with the Declaration of Helsinki and include IRB/Ethics Committee approval numbers.",
      "Informed written consent must be documented for all patient-derived clinical data and photographs.",
      "Animal experiments must adhere to ARRIVE guidelines and national veterinary welfare standards.",
    ],
  },
  {
    id: "open-access-rights",
    category: "Licensing & Copyright",
    number: "05",
    icon: Globe2,
    title: "Open Access & Creative Commons CC BY 4.0",
    statement:
      "Published scholarship is distributed freely and immediately worldwide under the Creative Commons Attribution 4.0 International License.",
    compliance: [
      "Authors retain unrestricted copyright and intellectual property rights in their work.",
      "Readers are permitted to share, copy, distribute, and adapt the material with appropriate academic attribution.",
      "Permanent DOIs are registered via CrossRef with automatic preservation in institutional repositories.",
    ],
  },
  {
    id: "confidentiality-recusal",
    category: "Editorial Governance",
    number: "06",
    icon: LockKeyhole,
    title: "Confidentiality & Conflict Recusal",
    statement:
      "Manuscript files, data, reviewer reports, and editorial deliberations are strictly confidential academic assets.",
    compliance: [
      "Editors and reviewers are barred from citing, using, or discussing unpublished manuscript contents.",
      "Board members submitting manuscripts are completely blind to the handling editor and reviewer assignments.",
      "Editors immediately recuse themselves from handling submissions from their own department or collaborators.",
    ],
  },
];

const EDITORIAL_SAFEGUARDS = [
  {
    step: "01",
    title: "Initial Desk Intake & Scope Screening",
    description:
      "Editorial secretariat verifies submission completeness, author declarations, ethics documentation, and journal scope alignment.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Automated Plagiarism & Similarity Check",
    description:
      "Crossref Similarity Check verifies originality against billions of published articles and web repositories prior to editor review.",
    icon: SearchCheck,
  },
  {
    step: "03",
    title: "Double-Blind Referee Assignment",
    description:
      "Section Editor appoints independent, non-conflicted reviewers who appraise the anonymized manuscript across 5 criteria.",
    icon: Users,
  },
  {
    step: "04",
    title: "Merit-Based Editorial Decision",
    description:
      "Editor-in-Chief synthesizes independent referee reports to issue an objective determination: Accept, Revise, or Reject.",
    icon: Scale,
  },
  {
    step: "05",
    title: "Permanent Open Access & CrossMark Indexing",
    description:
      "Final articles receive permanent CrossRef DOIs, CrossMark metadata integrity tracking, and open CC BY 4.0 deposition.",
    icon: Archive,
  },
];

const RECORD_ACTIONS = [
  {
    icon: CheckCircle2,
    title: "Corrigenda & Addenda (Corrections)",
    subtitle: "Material Accuracy",
    description:
      "Material errors of fact, calculation, or mislabeled figures that do not undermine the central scientific conclusions are corrected via a linked formal Corrigendum notice permanently tied to the DOI.",
  },
  {
    icon: MessageSquareWarning,
    title: "Expressions of Concern",
    subtitle: "Active Investigation",
    description:
      "When serious concerns regarding research integrity, data fabrication, or authorship disputes arise and an investigation is pending, an official Expression of Concern is appended to alert the academic community.",
  },
  {
    icon: Archive,
    title: "Formal Article Retractions",
    subtitle: "Preserving Scholarly Record",
    description:
      "If findings are proven unreliable due to misconduct or honest error, the article is formally retracted in accordance with COPE Retraction Guidelines. The PDF remains in the archive with a prominent retraction watermark.",
  },
];

export default function PoliciesPage() {
  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      <FadeIn delay={0.05}>
        <PoliciesHero />
      </FadeIn>

      {/* ── 2. Pre-Publication vs Post-Publication Integrity Architecture ── */}
      <section
        aria-label="Integrity Architecture"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                GOVERNANCE ARCHITECTURE
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.25rem] font-medium tracking-[-0.02em] text-slate-950">
                Dual-Stage Research Integrity Framework
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                The journal protects scholarly reliability through rigorous pre-publication assessment and permanent, accountable post-publication stewardship.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-3 border-[#1e40af] pl-4 py-1 bg-white p-4 border border-slate-200/80 shadow-2xs">
                <p className="font-academic text-lg sm:text-xl font-medium text-slate-950 leading-snug">
                  Research integrity is a shared institutional covenant upheld by authors, peer reviewers, handling editors, and university leadership.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200/90 p-6 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-[#1e40af] font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-[#1e40af]" />
                    <span>Pre-Publication Safeguards</span>
                  </div>
                  <h3 className="font-academic text-base font-medium text-slate-950 mt-2">
                    Screening, Blind Review & Verification
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    Every submission undergoes automated similarity checks, IRB ethics validation, and double-blind appraisal by qualified subject experts before editorial acceptance.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/90 p-6 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-[#1e40af] font-bold text-xs uppercase tracking-wider">
                    <Globe2 className="h-4 w-4 text-[#1e40af]" />
                    <span>Post-Publication Stewardship</span>
                  </div>
                  <h3 className="font-academic text-base font-medium text-slate-950 mt-2">
                    Open Access, CrossMark & Corrections
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    Published works are maintained under permanent CrossRef DOIs with active CrossMark status tracking, transparent errata notices, and unhindered CC BY 4.0 access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Core Policy Directory (6 Pillar Standards) ── */}
      <section
        id="policy-directory"
        aria-label="Core Policy Directory"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                POLICY DIRECTORY
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Core Publication Standards & Mandates
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Each standard governs specific responsibilities across manuscript preparation, peer assessment, and permanent archiving.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {POLICY_DIRECTORY.map((policy) => {
              const Icon = policy.icon;
              return (
                <div
                  key={policy.id}
                  id={policy.id}
                  className="bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2.5 py-0.5 border border-blue-100">
                        {policy.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-400">
                        Policy {policy.number}
                      </span>
                    </div>

                    <div className="mt-4 flex items-start gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] mt-0.5">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-academic text-lg sm:text-xl font-medium text-slate-950 leading-snug">
                          {policy.title}
                        </h3>
                        <p className="mt-2 text-xs font-medium text-slate-700 leading-relaxed">
                          {policy.statement}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Compliance Checklist
                      </p>
                      {policy.compliance.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. The 5-Checkpoint Editorial Safeguard Workflow ── */}
      <section
        aria-label="Editorial Safeguards"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                EDITORIAL SAFEGUARDS
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                How Policy is Enforced on Every Manuscript
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Five sequential checkpoints ensure every published paper meets verified standards of ethics, reproducibility, and originality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-10">
            {EDITORIAL_SAFEGUARDS.map((guard) => {
              const Icon = guard.icon;
              return (
                <div
                  key={guard.step}
                  className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-xs font-bold text-[#1e40af]">
                        Stage {guard.step}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h3 className="font-academic text-sm sm:text-base font-medium text-slate-950 mt-4 leading-snug">
                      {guard.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {guard.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Corrections, Expressions of Concern & Retractions Framework ── */}
      <section
        aria-label="Corrections and Retractions"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                RECORD INTEGRITY
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Post-Publication Amendments & Retractions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              When published evidence requires clarification or withdrawal, transparent notices preserve the historical accuracy of the scholarly record.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {RECORD_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                      <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2 py-0.5 border border-blue-100">
                        {action.subtitle}
                      </span>
                    </div>

                    <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 mt-4 leading-snug">
                      {action.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Policy Consultation & Editorial Secretariat CTA ── */}
      <section
        aria-label="Policy Consultation and Contact"
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
              {/* Left Column: Policy Consultation */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <Scale className="h-3.5 w-3.5" />
                  <span>ETHICS CONSULTATION</span>
                </div>

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.025em] text-white leading-[1.15]">
                  Questions Regarding Journal Policies or Ethics?
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  If you require clarification on authorship eligibility, copyright permissions, data deposition protocols, or bioethical documentation, our Editorial Secretariat is available to assist.
                </p>

                {/* Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    COPE Compliance Advisory
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    Open Access Rights Guidance
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Archive className="h-3.5 w-3.5 text-amber-300" />
                    DOI & Archiving Support
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="mailto:editorial@gonobishwabidyalay.edu.bd?subject=Policy%20Inquiry%20GB%20Journal"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Contact Editorial Office</span>
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
                      Ethics Desk
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Research Governance Office
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Direct inquiries regarding research compliance, authorship declarations, or institutional agreements.
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Official Email</p>
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

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Response SLA</p>
                        <p className="text-xs text-emerald-300 mt-0.5">
                          Official response within 1–2 working business days
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
                    <span>Visit Contact Directory</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdminPageEditBadge pageKey="policies" />
    </PageShell>
  );
}
