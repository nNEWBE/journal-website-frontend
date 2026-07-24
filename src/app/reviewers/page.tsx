import {
  Award,
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

const stats = [
  { value: "14", unit: "Days", label: "Review window" },
  { value: "5", unit: "Criteria", label: "Evaluation dimensions" },
  { value: "100%", unit: "Blind", label: "Double-blind process" },
  { value: "COPE", unit: "Aligned", label: "Ethics framework" },
];

const principles = [
  {
    icon: UserCheck,
    color: "from-blue-600 to-indigo-700",
    soft: "bg-blue-50",
    text: "text-blue-700",
    title: "Availability & Conflict Check",
    description:
      "Reviewers confirm subject expertise, absence of financial or personal conflict of interest, and full availability before manuscript files are unlocked.",
  },
  {
    icon: FlaskConical,
    color: "from-violet-600 to-purple-700",
    soft: "bg-violet-50",
    text: "text-violet-700",
    title: "Scientific Rigor & Methodology",
    description:
      "Evaluate scientific soundness, experiment design, data integrity, statistical validity, and clarity of research findings against field standards.",
  },
  {
    icon: Lock,
    color: "from-slate-700 to-slate-900",
    soft: "bg-slate-100",
    text: "text-slate-700",
    title: "Strict Confidentiality",
    description:
      "Manuscripts are confidential academic assets. Reviewers must not share, cite, or use any unpublished content from submitted manuscripts.",
  },
  {
    icon: Scale,
    color: "from-amber-500 to-orange-600",
    soft: "bg-amber-50",
    text: "text-amber-700",
    title: "Conflict of Interest Disclosure",
    description:
      "Any personal, institutional, or financial relationship with the authors must be disclosed before a review assignment can proceed.",
  },
  {
    icon: BookOpen,
    color: "from-emerald-600 to-teal-700",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    title: "Constructive Feedback",
    description:
      "Reports must provide clear, respectful, and actionable recommendations to help authors improve the manuscript—regardless of decision.",
  },
  {
    icon: BadgeCheck,
    color: "from-rose-600 to-red-700",
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
    domain: "Originality & Contribution",
    focus:
      "Does the manuscript present novel research findings or a valuable synthesis of the field?",
    scale: "1 – 5",
    anchor: "Unoriginal → Outstanding",
  },
  {
    num: "02",
    domain: "Methodological Rigor",
    focus:
      "Are study protocols, sampling methods, and analytical tools sound and reproducible?",
    scale: "1 – 5",
    anchor: "Flawed → Exemplary",
  },
  {
    num: "03",
    domain: "Ethical Compliance",
    focus:
      "Are human/animal subject approvals, consent forms, and declarations provided?",
    scale: "Pass / Fail",
    anchor: "Flag for Editor",
  },
  {
    num: "04",
    domain: "Literature Context",
    focus:
      "Is prior research accurately cited, integrated, and adequately contextualized?",
    scale: "1 – 5",
    anchor: "Inadequate → Exhaustive",
  },
  {
    num: "05",
    domain: "Structure & Readability",
    focus:
      "Are tables, figures, abstract, discussion, and conclusions logically formatted?",
    scale: "1 – 5",
    anchor: "Poor → Exceptional",
  },
];

const timeline = [
  { icon: Mail, step: "01", title: "Invitation", desc: "Editor sends invitation with manuscript title and abstract only" },
  { icon: UserCheck, step: "02", title: "Acceptance", desc: "Reviewer confirms availability and absence of conflict within 48 hours" },
  { icon: Eye, step: "03", title: "Full Access", desc: "Anonymized manuscript files unlock for the confirmed reviewer" },
  { icon: ClipboardList, step: "04", title: "Structured Review", desc: "Reviewer submits evaluation against five dimensions within 14 days" },
  { icon: ShieldCheck, step: "05", title: "Editorial Decision", desc: "Editor-in-Chief reaches final decision based on peer reports" },
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
      <section className="container-x py-14 md:py-18">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
              Core Principles
            </p>
            <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Reviewer Expectations & Responsibilities
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-slate-500 md:text-right">
            Every invited reviewer must uphold these six foundational commitments throughout the review process.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_rgba(11,18,61,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_36px_rgba(11,18,61,0.10)]"
              >
                {/* gradient top accent */}
                <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${p.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${p.soft}`}>
                  <Icon className={`h-5 w-5 ${p.text}`} />
                </div>
                <h3 className="font-academic text-[15px] font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-xs leading-5.5 text-slate-500 font-medium">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Review Timeline ────────────────────────── */}
      <section className="bg-[#f5f7fb] py-14 md:py-18">
        <div className="container-x">
          <div className="mb-10">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
              Process
            </p>
            <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              The Peer Review Lifecycle
            </h2>
          </div>

          <div className="relative">
            {/* connector line */}
            <div className="absolute left-[22px] top-0 hidden h-full w-[2px] bg-gradient-to-b from-[color:var(--color-gb-blue)]/30 via-[color:var(--color-gb-gold)]/40 to-transparent md:block" />

            <div className="flex flex-col gap-5">
              {timeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative flex items-start gap-5">
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-gb-blue-deep)] shadow-md">
                      <Icon className="h-4 w-4 text-amber-300" />
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                          Step {step.step}
                        </span>
                        <span className="h-px flex-1 bg-slate-100" />
                      </div>
                      <h3 className="mt-1 font-academic text-base font-bold text-[color:var(--color-gb-blue-deep)]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 font-medium">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Evaluation Matrix ──────────────────────── */}
      <section className="container-x py-14 md:py-18">
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
            Evaluation Framework
          </p>
          <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
            Manuscript Evaluation Criteria Matrix
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
            Our double-blind peer review form assesses manuscripts against five core scholarly dimensions using a standardised scoring protocol.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(11,18,61,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[color:var(--color-gb-blue-deep)] text-[10px] font-extrabold uppercase tracking-wider text-white/60">
                  <th className="py-4 pl-6 pr-4 w-8">#</th>
                  <th className="py-4 px-4">Evaluation Dimension</th>
                  <th className="py-4 px-4 hidden md:table-cell">Key Assessment Focus</th>
                  <th className="py-4 pl-4 pr-6">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criteria.map((row) => (
                  <tr key={row.num} className="group transition-colors hover:bg-[color:var(--color-gb-blue-soft)]/40">
                    <td className="py-4 pl-6 pr-4">
                      <span className="font-black text-slate-200 text-base">{row.num}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{row.domain}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500 md:hidden">{row.focus}</p>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-slate-500 leading-5">{row.focus}</td>
                    <td className="py-4 pl-4 pr-6">
                      <span className="inline-flex flex-col">
                        <span className="font-black text-[color:var(--color-gb-blue)] text-sm">{row.scale}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{row.anchor}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <a
                href="mailto:journal@gonouniversity.edu.bd?subject=Reviewer%20Application"
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3.5 text-sm font-black text-[color:var(--color-gb-blue-deep)] shadow-[0_6px_24px_rgba(217,154,34,0.35)] transition-all hover:from-amber-300 hover:to-amber-400 hover:shadow-[0_8px_30px_rgba(217,154,34,0.45)] hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                Apply to Review
              </a>
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
