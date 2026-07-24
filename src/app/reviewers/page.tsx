import {
  BadgeCheck,
  BookOpen,
  ClipboardList,
  Eye,
  FlaskConical,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  Star,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { HeroActionButton } from "@/components/ui/hero-action-button";
import { CommitmentGridSection } from "@/components/ui/commitment-grid-section";

const stats = [
  { value: "14", unit: "Days", label: "Review window" },
  { value: "5", unit: "Criteria", label: "Evaluation dimensions" },
  { value: "100%", unit: "Blind", label: "Double-blind process" },
  { value: "COPE", unit: "Aligned", label: "Ethics framework" },
];

const principles = [
  {
    number: "01",
    icon: UserCheck,
    soft: "bg-blue-50",
    text: "text-blue-700",
    title: "Availability & Conflict Check",
    description:
      "Reviewers confirm subject expertise, absence of financial or personal conflict of interest, and full availability before manuscript files are unlocked.",
  },
  {
    number: "02",
    icon: FlaskConical,
    soft: "bg-violet-50",
    text: "text-violet-700",
    title: "Scientific Rigor & Methodology",
    description:
      "Evaluate scientific soundness, experiment design, data integrity, statistical validity, and clarity of research findings against field standards.",
  },
  {
    number: "03",
    icon: Lock,
    soft: "bg-slate-100",
    text: "text-slate-700",
    title: "Strict Confidentiality",
    description:
      "Manuscripts are confidential academic assets. Reviewers must not share, cite, or use any unpublished content from submitted manuscripts.",
  },
  {
    number: "04",
    icon: Scale,
    soft: "bg-amber-50",
    text: "text-amber-700",
    title: "Conflict of Interest Disclosure",
    description:
      "Any personal, institutional, or financial relationship with the authors must be disclosed before a review assignment can proceed.",
  },
  {
    number: "05",
    icon: BookOpen,
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    title: "Constructive Feedback",
    description:
      "Reports must provide clear, respectful, and actionable recommendations to help authors improve the manuscript—regardless of decision.",
  },
  {
    number: "06",
    icon: BadgeCheck,
    soft: "bg-rose-50",
    text: "text-rose-700",
    title: "COPE Ethical Alignment",
    description:
      "All reviews must align with Committee on Publication Ethics (COPE) guidelines for reviewer responsibilities and best-practice standards.",
  },
];

const criteria = [
  {
    num: "01",
    icon: Star,
    tone: "bg-amber-50 text-amber-700",
    domain: "Originality & Contribution",
    focus:
      "Does the manuscript present novel research findings or a valuable synthesis of the field?",
    scale: "1 – 5",
    anchor: "Unoriginal → Outstanding",
  },
  {
    num: "02",
    icon: FlaskConical,
    tone: "bg-violet-50 text-violet-700",
    domain: "Methodological Rigor",
    focus:
      "Are study protocols, sampling methods, and analytical tools sound and reproducible?",
    scale: "1 – 5",
    anchor: "Flawed → Exemplary",
  },
  {
    num: "03",
    icon: BadgeCheck,
    tone: "bg-emerald-50 text-emerald-700",
    domain: "Ethical Compliance",
    focus:
      "Are human/animal subject approvals, consent forms, and declarations provided?",
    scale: "Pass / Fail",
    anchor: "Flag for Editor",
  },
  {
    num: "04",
    icon: BookOpen,
    tone: "bg-sky-50 text-sky-700",
    domain: "Literature Context",
    focus:
      "Is prior research accurately cited, integrated, and adequately contextualized?",
    scale: "1 – 5",
    anchor: "Inadequate → Exhaustive",
  },
  {
    num: "05",
    icon: ClipboardList,
    tone: "bg-slate-100 text-slate-700",
    domain: "Structure & Readability",
    focus:
      "Are tables, figures, abstract, discussion, and conclusions logically formatted?",
    scale: "1 – 5",
    anchor: "Poor → Exceptional",
  },
];

const timeline = [
  {
    icon: Mail,
    step: "01",
    stage: "Invitation only",
    title: "Invitation",
    desc: "The editor shares the manuscript title and abstract before any review files are released.",
  },
  {
    icon: UserCheck,
    step: "02",
    stage: "Within 48 hours",
    title: "Acceptance",
    desc: "The reviewer confirms subject expertise, availability, and the absence of a competing interest.",
  },
  {
    icon: Eye,
    step: "03",
    stage: "After acceptance",
    title: "Secure access",
    desc: "The anonymized manuscript and supporting files become available to the confirmed reviewer.",
  },
  {
    icon: ClipboardList,
    step: "04",
    stage: "Within 14 days",
    title: "Structured review",
    desc: "The reviewer evaluates the work across five defined scholarly criteria and submits a recommendation.",
  },
  {
    icon: ShieldCheck,
    step: "05",
    stage: "Editor-led",
    title: "Editorial decision",
    desc: "The Editor-in-Chief considers the reports, evidence, and revisions before recording the final outcome.",
  },
];

import { PageHeroBanner } from "@/components/page-hero-banner";

export default function ReviewersPage() {
  return (
    <PageShell>
      {/* ── Hero ───────────────────────────────────── */}
      <PageHeroBanner
        badgeLabel="Peer Review Guidance"
        badgeIcon={Eye}
        title={
          <>
            Reviewer responsibilities{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              &amp; evaluation standards
            </span>
          </>
        }
        description="Guidance, assessment criteria, confidentiality expectations, and ethical responsibilities for invited peer reviewers at the Gono Bishwabidyalay Journal of Research."
        tags={[
          { label: "Confidential review", icon: ShieldCheck },
          { label: "Structured evaluation", icon: ClipboardList },
          { label: "Conflict disclosure", icon: Scale },
          { label: "COPE-aligned ethics", icon: BadgeCheck },
        ]}
        stats={stats.map((s) => ({
          val: `${s.value}${s.unit || ""}`,
          label: s.label,
        }))}
      />

      {/* ── Core Principles ────────────────────────── */}
      <CommitmentGridSection
        eyebrow="Reviewer Covenant"
        title="Six commitments behind every independent review"
        description="Reviewers protect unpublished work, assess evidence impartially, disclose competing interests, and give authors clear, constructive guidance."
        items={principles}
        columns={3}
        bgClass="bg-white"
        footer={
          <>
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck
                className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]"
                aria-hidden="true"
              />
              Access to a manuscript is granted solely for confidential
              scholarly evaluation.
            </p>
            <span className="inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue)]">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              COPE-aligned practice
            </span>
          </>
        }
      />

      {/* ── Review Timeline ────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-14 md:py-18">
        <div className="container-x grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
              Review process
            </p>
            <h2 className="mt-2 max-w-md font-academic text-3xl font-bold leading-tight tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl">
              The peer review lifecycle
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              A controlled pathway protects reviewer independence while keeping
              assessment timely, confidential, and accountable.
            </p>

            <dl className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {[
                {
                  icon: UserCheck,
                  value: "48 hours",
                  label: "Invitation response",
                },
                {
                  icon: Timer,
                  value: "14 days",
                  label: "Standard review window",
                },
                {
                  icon: ClipboardList,
                  value: "5 criteria",
                  label: "Structured evaluation",
                },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs font-black text-[color:var(--color-gb-blue-deep)]">
                      {value}
                    </dt>
                    <dd className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      {label}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(17,27,82,0.06)]">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-gold-dark)]">
                  Reviewer pathway
                </p>
                <h3 className="mt-1 text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                  From invitation to editorial outcome
                </h3>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[color:var(--color-gb-blue)]/10 bg-[color:var(--color-gb-blue-soft)] px-3 py-2 text-[10px] font-extrabold text-[color:var(--color-gb-blue)]">
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                Double-blind review
              </span>
            </div>

            <ol className="divide-y divide-slate-100">
              {timeline.map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.step}
                    className="group grid gap-4 p-5 transition-colors hover:bg-[#f9faff] sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center md:px-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[color:var(--color-gb-blue)] shadow-sm transition-colors group-hover:border-[color:var(--color-gb-blue)]/20 group-hover:bg-[color:var(--color-gb-blue-soft)]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-black text-[color:var(--color-gb-blue)]">
                          {step.step}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 sm:hidden">
                          {step.stage}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-xs leading-6 text-slate-500">
                        {step.desc}
                      </p>
                    </div>
                    <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 sm:inline-flex">
                      {step.stage}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="grid gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4 text-xs font-semibold text-slate-500 sm:grid-cols-2 md:px-6">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]"
                  aria-hidden="true"
                />
                Confidentiality applies at every stage
              </span>
              <span className="inline-flex items-center gap-2 sm:justify-self-end">
                <Timer
                  className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]"
                  aria-hidden="true"
                />
                Standard review window: 14 days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Evaluation Rubric ────────────────────────── */}
      <section className="bg-white py-12 md:py-16 border-t border-slate-100">
        <div className="container-x">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gb-gold-dark)] border border-amber-400/20">
              Evaluation Framework
            </span>
            <h2 className="mt-3 font-academic text-2xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              A formal rubric for scholarly quality
            </h2>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
            {/* Top Navy Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[color:var(--color-gb-blue-deep)] p-5 md:p-6 text-white">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    Evaluation Rubric
                  </p>
                  <h3 className="mt-0.5 font-academic text-base font-bold text-white">
                    Five criteria, one accountable recommendation
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 md:border-t-0 md:pt-0">
                {[
                  { value: "1", label: "Limited" },
                  { value: "3", label: "Sound" },
                  { value: "5", label: "Exemplary" },
                  { value: "P/F", label: "Ethics" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-center"
                  >
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {item.value}
                    </span>
                    <span className="text-[10px] font-medium text-white/70">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Criteria Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3.5">Evaluation Criterion</th>
                    <th className="px-5 py-3.5">Key Assessment Focus</th>
                    <th className="px-6 py-3.5 text-right">Rating Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criteria.map((row) => {
                    const Icon = row.icon;
                    const isEthics = row.scale === "Pass / Fail";

                    return (
                      <tr
                        key={row.num}
                        className="group transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-[color:var(--color-gb-blue-soft)] group-hover:text-[color:var(--color-gb-blue)]">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div>
                              <span className="font-mono text-[10px] font-extrabold text-slate-400">
                                {row.num}
                              </span>
                              <h4 className="font-academic text-xs font-bold text-[color:var(--color-gb-blue-deep)]">
                                {row.domain}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-xl px-5 py-4.5 text-xs leading-relaxed text-slate-600">
                          {row.focus}
                        </td>
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                              isEthics
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                                : "bg-slate-100 text-slate-700 border border-slate-200/60"
                            }`}
                          >
                            {row.scale}
                          </span>
                          <p className="mt-1 text-[10px] font-medium text-slate-400">
                            {row.anchor}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 text-xs font-medium text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck
                className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]"
                aria-hidden="true"
              />
              Evidence is assessed independently of author identity
            </span>
            <span className="inline-flex items-center gap-2">
              <ClipboardList
                className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]"
                aria-hidden="true"
              />
              Written analysis accompanies every rating
            </span>
          </div>
        </div>
      </section>

      {/* ── Join CTA ───────────────────────────────── */}
      <section className="container-x pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-gb-blue-deep)] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.04]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.12] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.2] blur-[60px]" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
                <Users className="h-3 w-3" />
                Reviewer Network
              </span>
              <h3 className="mt-4 font-academic text-2xl font-bold text-white md:text-3xl">
                Join our Expert<br />Peer Review Panel
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/55">
                We invite qualified researchers holding a PhD or senior academic rank to join our reviewer panel across
                public health, pharmacy, law, agriculture, and technology disciplines.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {["PhD or above", "Domain expertise", "Active researcher", "COPE commitment"].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-white/60">
                    <Star className="h-2.5 w-2.5 text-amber-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
              <HeroActionButton
                href="mailto:journal@gonouniversity.edu.bd?subject=Reviewer%20Application"
                variant="primary"
                icon={Mail}
              >
                Apply to Review
              </HeroActionButton>
              <p className="text-[10px] font-semibold text-white/35">
                Responses within 3 business days
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
