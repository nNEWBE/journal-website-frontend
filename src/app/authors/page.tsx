import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileCheck2,
  FileText,
  FlaskConical,
  Globe2,
  Library,
  Mail,
  MessageSquareText,
  PenLine,
  Scale,
  Send,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articleTypes, policies } from "@/lib/data";

const articleTypeDetails = {
  "Research Article": {
    icon: FlaskConical,
    description: "Original methods, results, analysis, and scholarly conclusions.",
  },
  "Review Article": {
    icon: Library,
    description: "Critical synthesis of established and emerging evidence.",
  },
  "Case Study": {
    icon: ClipboardCheck,
    description: "Focused analysis of a specific practice, setting, or intervention.",
  },
  "Short Communication": {
    icon: MessageSquareText,
    description: "Concise reporting of timely findings or methodological advances.",
  },
  Perspective: {
    icon: Eye,
    description: "Evidence-informed interpretation of an important academic question.",
  },
  Editorial: {
    icon: PenLine,
    description: "Authoritative commentary on policy, practice, or scholarly direction.",
  },
  Letter: {
    icon: Mail,
    description: "Focused correspondence responding to published research or debate.",
  },
} as const;

const preparationItems = [
  {
    icon: FileText,
    title: "Main manuscript",
    text: "A complete, editable document following the selected article structure.",
  },
  {
    icon: Users,
    title: "Authors and affiliations",
    text: "Names, institutional details, contribution roles, and corresponding author.",
  },
  {
    icon: BookOpen,
    title: "Abstract and keywords",
    text: "A concise summary with accurate subject terms for discovery and indexing.",
  },
  {
    icon: ShieldCheck,
    title: "Ethics declarations",
    text: "Ethical approval, consent, conflicts, funding, and responsible AI-use details.",
  },
  {
    icon: UploadCloud,
    title: "Supporting files",
    text: "Figures, tables, datasets, appendices, and supplementary materials.",
  },
  {
    icon: Eye,
    title: "Blinded review copy",
    text: "Remove author identities and institutional clues from the review version.",
  },
];

const submissionSteps = [
  {
    number: "01",
    icon: FileCheck2,
    title: "Prepare",
    text: "Choose the article type and complete every required file and declaration.",
  },
  {
    number: "02",
    icon: Send,
    title: "Submit",
    text: "Enter manuscript metadata, upload files, and confirm the submission.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Peer review",
    text: "Track screening, reviewer assessment, decisions, and requested revisions.",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Publish",
    text: "Approved work is prepared as the version of record and made discoverable.",
  },
];

export default function AuthorsPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white">
        <div className="pointer-events-none absolute inset-0 hero-pattern" />
        <div className="container-x relative grid gap-10 py-14 md:py-18 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/70 backdrop-blur-md">
              <PenLine className="h-3.5 w-3.5 text-white/60" />
              <span>For Authors</span>
            </span>
            <h1 className="mt-5 font-academic text-4xl font-bold leading-[1.06] tracking-[-0.035em] text-white md:text-5xl">
              Prepare your manuscript with confidence
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
              Follow clear requirements for manuscript structure, ethical
              declarations, supporting files, and double-blind peer review
              before beginning your submission.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 text-xs font-black text-slate-950 shadow-md transition-all hover:from-amber-300 hover:to-amber-400 focus-ring"
              >
                <span>Start a submission</span>
              </Link>
              <Link
                href="/policies"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-xs font-extrabold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 focus-ring"
              >
                <span>Review journal policies</span>
                <Scale className="h-3.5 w-3.5 text-white/70" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-[10px] font-bold text-white/60">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Double-blind review
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 text-sky-400" />
                Open-access publishing
              </span>
              <span className="inline-flex items-center gap-2">
                <ClipboardCheck className="h-3.5 w-3.5 text-amber-400" />
                Trackable workflow
              </span>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.06] p-6 text-white shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 hero-pattern" />
            <div className="relative flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-amber-300 backdrop-blur-md">
                <ClipboardCheck className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-xs font-black text-white">
                  Submission brief
                </h2>
                <p className="mt-1 text-[9px] font-semibold text-white/50">
                  Four essentials before upload
                </p>
              </div>
            </div>
            <div className="relative mt-2 divide-y divide-white/10">
              {[
                "Select the correct manuscript type",
                "Prepare a blinded review document",
                "Confirm authorship and contribution roles",
                "Complete ethics and funding declarations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 py-3.5 text-[10px] font-bold text-white/65"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/submissions/new"
              className="relative mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] transition-colors hover:bg-amber-50 focus-ring"
            >
              Open submission form
              <Send className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
            Accepted formats
          </p>
          <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
            Choose the right article type
          </h2>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Select the format that best represents the purpose, evidence, and
            intended contribution of your manuscript.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid lg:grid-cols-2">
          {articleTypes.map((type, index) => {
            const detail =
              articleTypeDetails[type as keyof typeof articleTypeDetails];
            const Icon = detail?.icon || FileText;
            const isLast = index === articleTypes.length - 1;
            return (
              <article
                key={type}
                className={`group grid grid-cols-[34px_42px_minmax(0,1fr)] gap-4 border-b border-slate-200 p-5 transition-colors hover:bg-[#f9faff] ${
                  index % 2 === 0 ? "lg:border-r" : ""
                } ${isLast ? "lg:col-span-2 lg:border-r-0" : ""}`}
              >
                <span className="pt-2 font-mono text-[9px] font-black text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] transition-colors group-hover:bg-white group-hover:shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                    {type}
                  </h3>
                  <p className="mt-1.5 text-[10px] leading-5 text-slate-500">
                    {detail?.description}
                  </p>
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f7f8fc] py-12 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
              Manuscript preparation
            </p>
            <h2 className="mt-2 max-w-md font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
              Build a complete submission package
            </h2>
            <p className="mt-4 max-w-md text-xs leading-6 text-slate-500">
              Prepare each item before opening the form. A complete package
              moves through editorial screening faster and reduces avoidable
              revision requests.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]" />
              <p className="text-[10px] leading-5 text-slate-500">
                Editable documents are required for production. Keep a separate
                anonymized version for peer review.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 md:px-6">
            {preparationItems.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="grid grid-cols-[28px_40px_minmax(0,1fr)] gap-4 border-b border-slate-100 py-5 last:border-b-0"
              >
                <span className="pt-2 font-mono text-[9px] font-black text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xs font-black text-[color:var(--color-gb-blue-deep)]">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[10px] leading-5 text-slate-500">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
            Publication workflow
          </p>
          <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
            From manuscript to publication
          </h2>
        </div>

        <div className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
          <div className="pointer-events-none absolute left-[6%] right-[6%] top-[20px] hidden h-px bg-slate-200 md:block" />
          {submissionSteps.map(({ number, icon: Icon, title, text }) => (
            <article
              key={number}
              className="relative"
            >
              <div className="relative flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[color:var(--color-gb-blue)] shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[9px] font-black text-slate-300">
                  {number}
                </span>
              </div>
              <h3 className="mt-5 text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                {title}
              </h3>
              <p className="mt-2 max-w-[230px] text-[10px] leading-5 text-slate-500">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pb-14 md:pb-18">
        <div className="grid gap-8 overflow-hidden rounded-[22px] bg-[color:var(--color-gb-blue-deep)] p-7 text-white md:grid-cols-[minmax(0,1fr)_340px] md:items-center md:p-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Editorial requirements
            </p>
            <h2 className="mt-3 max-w-2xl font-academic text-3xl font-bold text-white">
              Submit work that is complete, ethical, and ready for review
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-white/55">
              Every manuscript is screened for scope, completeness,
              originality, ethical compliance, and suitability for independent
              assessment.
            </p>
          </div>
          <div className="grid gap-2">
            {policies.slice(0, 3).map((policy) => (
              <div
                key={policy}
                className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-[9px] font-semibold leading-5 text-white/65"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                {policy}
              </div>
            ))}
            <Link
              href="/policies"
              className="mt-2 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-amber-300 focus-ring"
            >
              Read all policies
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
