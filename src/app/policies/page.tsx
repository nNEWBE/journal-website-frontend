import Link from "next/link";
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Globe2,
  LockKeyhole,
  MessageSquareWarning,
  Scale,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import { HeroActionButton } from "@/components/ui/hero-action-button";
import { SupportingTag } from "@/components/ui/badge";
import { EditorialPageHeader } from "@/components/editorial/editorial-page-header";
import { PolicyFrameworkCard } from "@/components/ui/policy-framework-card";
import { PageShell } from "@/components/layout/page-shell";
import { ProcessSteps } from "@/components/ui/process-steps";
import type { ProcessStep } from "@/components/ui/process-steps";
import { policies } from "@/lib/data";

const policyEntries = [
  {
    id: "peer-review",
    icon: Users,
    category: "Review",
    title: "Independent peer review",
    description: policies[0],
    detail:
      "Research and review articles are evaluated through a double-blind process designed to protect impartial academic judgment.",
  },
  {
    id: "declarations",
    icon: FileText,
    category: "Authorship",
    title: "Complete declarations",
    description: policies[1],
    detail:
      "Authors provide the information editors need to assess responsibility, transparency, and ethical compliance.",
  },
  {
    id: "originality",
    icon: SearchCheck,
    category: "Integrity",
    title: "Originality screening",
    description: policies[2],
    detail:
      "Every manuscript is checked before editorial assignment so potential overlap can be addressed at the appropriate stage.",
  },
  {
    id: "record-integrity",
    icon: Archive,
    category: "Published record",
    title: "Corrections and retractions",
    description: policies[3],
    detail:
      "Published records are updated through visible, accountable notices when a correction or stronger editorial action is required.",
  },
  {
    id: "open-access",
    icon: Globe2,
    category: "Access",
    title: "Author rights and open access",
    description: policies[4],
    detail:
      "Readers can access published scholarship openly while authors retain copyright in their work.",
  },
  {
    id: "confidentiality",
    icon: LockKeyhole,
    category: "Review",
    title: "Reviewer confidentiality",
    description: policies[5],
    detail:
      "Review materials remain confidential, and reviewers disclose any relationship that could affect independent assessment.",
  },
];

const editorialSafeguards: ProcessStep[] = [
  {
    number: "01",
    icon: "file",
    title: "Editorial screening",
    description: "Scope, files, declarations, and baseline ethical requirements are checked before assignment.",
  },
  {
    number: "02",
    icon: "search",
    title: "Integrity checks",
    description: "Originality and disclosure information are reviewed before the manuscript progresses.",
  },
  {
    number: "03",
    icon: "users",
    title: "Independent review",
    description: "Qualified reviewers evaluate the contribution without access to author identities.",
  },
  {
    number: "04",
    icon: "gavel",
    title: "Accountable decision",
    description: "Editors weigh the reports, revisions, evidence, and policy requirements before deciding.",
  },
  {
    number: "05",
    icon: "archive",
    title: "Record stewardship",
    description: "The published version remains connected to any later correction or editorial notice.",
  },
];

const recordActions = [
  {
    icon: CheckCircle2,
    title: "Corrections",
    text: "Material errors are clarified through a visible notice linked to the article record.",
  },
  {
    icon: MessageSquareWarning,
    title: "Expressions of concern",
    text: "Readers are alerted when a serious question requires investigation before a final outcome.",
  },
  {
    icon: Archive,
    title: "Retractions",
    text: "Articles that cannot remain part of the reliable record are clearly marked while their history is preserved.",
  },
];

export default function PoliciesPage() {
  return (
    <PageShell>
      <EditorialPageHeader
        icon={Scale}
        eyebrow="Publication ethics"
        title="Policies and research integrity"
        description="A clear framework for authors, reviewers, and editors—from submission and independent assessment to open publication and stewardship of the scholarly record."
        actions={
          <>
            <HeroActionButton
              href="#policy-directory"
              variant="primary"
              hasArrow={true}
              arrowRotateDeg={-45}
            >
              Browse Policy Directory
            </HeroActionButton>
            <HeroActionButton
              href="/contact"
              variant="secondary"
            >
              Contact Editorial Office
            </HeroActionButton>
          </>
        }
        supporting={
          <>
            <SupportingTag icon={ShieldCheck}>Research Integrity</SupportingTag>
            <SupportingTag icon={ClipboardCheck}>Transparent Review</SupportingTag>
            <SupportingTag icon={Globe2}>Open Publication</SupportingTag>
          </>
        }
        aside={<PolicyFrameworkCard />}
      />

      <section className="bg-white py-10 md:py-12">
        <div className="container-x grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gb-gold-dark)] border border-amber-400/20">
              Policy Purpose
            </span>
            <h2 className="mt-3.5 max-w-md font-academic text-2xl font-bold leading-tight tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Standards that make editorial decisions trustworthy
            </h2>
            <p className="mt-3.5 max-w-md text-xs leading-relaxed text-slate-600 md:text-sm">
              The policy framework defines what the journal expects, how work
              is assessed, and how concerns are handled before and after
              publication.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-3 border-amber-400 pl-4 py-0.5">
              <p className="font-academic text-xl font-bold leading-snug tracking-[-0.015em] text-[color:var(--color-gb-blue-deep)] md:text-2xl">
                Research integrity is a shared responsibility across authors,
                reviewers, editors, and the institution that stewards the
                journal.
              </p>
            </div>

            <div className="grid gap-3.5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:bg-slate-50">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                  Pre-Publication Assessment
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Policies are applied from initial screening through editorial
                  decision-making. They support fair assessment, complete
                  disclosure, confidentiality, and responsible communication
                  with contributors.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:bg-slate-50">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-amber-500" />
                  Post-Publication Stewardship
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  After publication, the same framework protects the reliability
                  of the scholarly record through transparent corrections,
                  notices, and durable article metadata.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5">
              {[
                { value: "6", label: "Core Standards", icon: Scale },
                { value: "Double", label: "Blind Review", icon: ShieldCheck },
                { value: "Open", label: "Reader Access", icon: Globe2 },
              ].map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 p-1.5 ${index === 0 ? "" : "border-l border-slate-200/80 pl-4"
                      }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-600">
                      <ItemIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <dt className="font-academic text-lg font-bold leading-tight text-[color:var(--color-gb-blue-deep)]">
                        {item.value}
                      </dt>
                      <dd className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        {item.label}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      <section
        id="policy-directory"
        className="scroll-mt-24 border-t border-slate-200 bg-white py-12 md:py-16"
      >
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-gold-dark)]">
              Policy directory
            </p>
            <h2 className="mt-3 font-academic text-3xl font-bold tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl">
              The journal&apos;s core publication standards
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Each standard addresses a specific point of responsibility in
              manuscript evaluation or stewardship of the published record.
            </p>
          </div>

          <div className="mt-9 overflow-hidden rounded-[20px] border border-slate-200 bg-white">
            <div className="grid lg:grid-cols-2">
              {policyEntries.map(
                ({ id, icon: Icon, category, title, description, detail }, index) => (
                  <article
                    id={id}
                    key={id}
                    className={`group scroll-mt-24 p-6 transition-colors hover:bg-[#f9faff] md:p-7 ${index < policyEntries.length - 2
                        ? "border-b border-slate-200"
                        : ""
                      } ${index % 2 === 0 ? "lg:border-r lg:border-slate-200" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] transition-colors group-hover:bg-white group-hover:shadow-sm">
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-gold-dark)]">
                          {category}
                        </p>
                        <h3 className="mt-1.5 text-base font-black text-[color:var(--color-gb-blue-deep)]">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 text-xs font-bold leading-6 text-slate-700">
                      {description}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {detail}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <ProcessSteps
        sectionLabel="Editorial safeguards"
        heading="How policy is applied to every manuscript"
        description="Five documented checkpoints connect initial screening, independent assessment, editorial judgment, and stewardship of the published record."
        steps={editorialSafeguards}
        className="border-t border-slate-100 bg-[#f7f8fc]"
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[20px] bg-[color:var(--color-gb-blue-deep)] p-7 text-white md:p-9">
            <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                <Globe2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                Author rights and access
              </p>
              <h2 className="mt-3 max-w-md font-academic text-3xl font-bold leading-tight text-white">
                Open scholarship with author-retained copyright
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/60">
                The journal&apos;s access model supports broad reading and
                responsible scholarly use while authors retain copyright in
                their published work.
              </p>
              <div className="mt-7 grid gap-3 text-xs text-white/65 sm:grid-cols-2">
                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <Globe2 className="h-3.5 w-3.5 text-emerald-300" />
                  Open reader access
                </div>
                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                  Author-retained rights
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-7 md:p-9">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                <Archive className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-gold-dark)]">
                  Published record
                </p>
                <h2 className="mt-1.5 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                  When an article record changes
                </h2>
              </div>
            </div>
            <div className="mt-6 divide-y divide-slate-100">
              {recordActions.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-xs font-black text-[color:var(--color-gb-blue-deep)]">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-6 text-slate-500">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-x mt-10">
          <div className="flex flex-col gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
                Need clarification?
              </p>
              <h2 className="mt-2 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                Discuss a policy with the editorial office
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue-deep)] px-5 text-xs font-extrabold text-white transition-colors hover:bg-[color:var(--color-gb-blue)] focus-ring"
              >
                Contact the journal
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/reviewers"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] transition-colors hover:border-[color:var(--color-gb-blue)]/25 hover:bg-[color:var(--color-gb-blue-soft)]/30 focus-ring"
              >
                Reviewer guidance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
