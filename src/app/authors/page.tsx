"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileCheck2,
  FileText,
  FlaskConical,
  Globe2,
  Layers,
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
import { PageShell } from "@/components/layout/page-shell";
import { ProcessSteps } from "@/components/ui/process-steps";
import type { ProcessStep } from "@/components/ui/process-steps";
import { PublishingCharterSection } from "@/components/ui/publishing-charter-section";
import { articleTypes, policies } from "@/lib/data";

const articleTypeDetails = {
  "Research Article":   { icon: FlaskConical,       description: "Original methods, results, analysis, and scholarly conclusions."              },
  "Review Article":     { icon: Library,             description: "Critical synthesis of established and emerging evidence."                      },
  "Case Study":         { icon: ClipboardCheck,      description: "Focused analysis of a specific practice, setting, or intervention."           },
  "Short Communication":{ icon: MessageSquareText,   description: "Concise reporting of timely findings or methodological advances."              },
  Perspective:          { icon: Eye,                 description: "Evidence-informed interpretation of an important academic question."            },
  Editorial:            { icon: PenLine,             description: "Authoritative commentary on policy, practice, or scholarly direction."         },
  Letter:               { icon: Mail,                description: "Focused correspondence responding to published research or debate."             },
} as const;

const preparationItems = [
  { icon: FileText,    title: "Main manuscript",        text: "A complete, editable document following the selected article structure."           },
  { icon: Users,       title: "Authors & affiliations", text: "Names, institutional details, contribution roles, and corresponding author."       },
  { icon: BookOpen,    title: "Abstract & keywords",    text: "A concise summary with accurate subject terms for discovery and indexing."         },
  { icon: ShieldCheck, title: "Ethics declarations",    text: "Ethical approval, consent, conflicts, funding, and responsible AI-use details."   },
  { icon: UploadCloud, title: "Supporting files",       text: "Figures, tables, datasets, appendices, and supplementary materials."              },
  { icon: Eye,         title: "Blinded review copy",    text: "Remove author identities and institutional clues from the review version."        },
];

const authorProcessSteps: ProcessStep[] = [
  {
    number: "01",
    icon: "file",
    title: "Prepare",
    description: "Choose the article type and complete every required file and declaration.",
  },
  {
    number: "02",
    icon: "search",
    title: "Submit",
    description: "Enter manuscript metadata, upload files, and confirm the submission.",
  },
  {
    number: "03",
    icon: "users",
    title: "Peer review",
    description: "Track screening, double-blind peer assessment, and reviewer evaluation.",
  },
  {
    number: "04",
    icon: "clipboard",
    title: "Revision",
    description: "Address reviewer recommendations and upload revised manuscript files.",
  },
  {
    number: "05",
    icon: "book",
    title: "Publish",
    description: "Approved work receives a DOI, final proofing, and global open-access publication.",
  },
];

const stepColors = [
  { ring: "ring-[color:var(--color-gb-blue)]",    bg: "bg-[color:var(--color-gb-blue-soft)]",     text: "text-[color:var(--color-gb-blue)]"      },
  { ring: "ring-amber-400",                        bg: "bg-amber-50",                              text: "text-amber-600"                          },
  { ring: "ring-violet-500",                       bg: "bg-violet-50",                             text: "text-violet-600"                         },
  { ring: "ring-emerald-500",                      bg: "bg-emerald-50",                            text: "text-emerald-600"                        },
];

export default function AuthorsPage() {
  return (
    <PageShell>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)]">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.13] blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

        <div className="container-x relative grid gap-12 py-16 md:py-20 lg:grid-cols-[1fr_380px] lg:items-center lg:py-24">
          {/* Left */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm">
              <PenLine className="h-3.5 w-3.5 text-amber-300" />
              For Authors
            </span>
            <h1 className="mt-5 font-academic text-4xl font-bold leading-[1.07] tracking-[-0.03em] text-white md:text-5xl lg:text-[3.4rem]">
              Prepare your manuscript<br />
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                with confidence
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/55">
              Follow clear requirements for manuscript structure, ethical declarations, supporting files,
              and double-blind peer review before beginning your submission.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-sm transition-all hover:bg-amber-50 hover:-translate-y-0.5 hover:shadow-md"
              >
                Start a submission
                <Send className="h-4 w-4" />
              </Link>
              <Link
                href="/policies"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-white/20 bg-white/[0.07] px-6 text-sm font-extrabold text-white backdrop-blur-sm transition-all hover:bg-white/[0.12] hover:-translate-y-0.5"
              >
                Review journal policies
                <Scale className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-6 text-[11px] font-bold text-white/50">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                Double-blind review
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 text-amber-300" />
                Open-access publishing
              </span>
              <span className="inline-flex items-center gap-2">
                <ClipboardCheck className="h-3.5 w-3.5 text-amber-300" />
                Trackable workflow
              </span>
            </div>
          </div>

          {/* Right: checklist card */}
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="border-b border-white/10 px-6 py-4">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">Submission brief</p>
              <h2 className="mt-1 text-sm font-black text-white">Four essentials before upload</h2>
            </div>
            <div className="divide-y divide-white/[0.07] px-6">
              {[
                "Select the correct manuscript type",
                "Prepare a blinded review document",
                "Confirm authorship and contribution roles",
                "Complete ethics and funding declarations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-4 text-[11px] font-semibold text-white/65">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 pt-4">
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-extrabold text-[color:var(--color-gb-blue-deep)] transition-all hover:bg-amber-50"
              >
                Open submission form
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Types ────────────────────────── */}
      <section className="container-x py-14 md:py-18">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
              Accepted formats
            </p>
            <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Choose the right article type
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-5 text-slate-500 md:text-right">
            Select the format that best represents the purpose, evidence, and intended contribution of your manuscript.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(11,18,61,0.05)]">
          <div className="grid lg:grid-cols-2">
            {articleTypes.map((t, i) => {
              const detail = articleTypeDetails[t as keyof typeof articleTypeDetails];
              const Icon = detail?.icon || FileText;
              const isLast = i === articleTypes.length - 1;
              return (
                <article
                  key={t}
                  className={`group flex items-start gap-4 border-b border-slate-100 p-5 transition-colors hover:bg-[color:var(--color-gb-blue-soft)]/30 ${
                    i % 2 === 0 ? "lg:border-r lg:border-slate-100" : ""
                  } ${isLast ? "lg:col-span-2 lg:border-r-0" : ""}`}
                >
                  <span className="font-mono text-[9px] font-black text-slate-200 pt-0.5 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] transition-colors group-hover:bg-[color:var(--color-gb-blue-deep)] group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[color:var(--color-gb-blue-deep)]">{t}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{detail?.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Submission Checklist ─────────────────── */}
      <section className="border-y border-slate-200 bg-[#f5f7fb] py-14 md:py-18">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
              Manuscript preparation
            </p>
            <h2 className="mt-2 max-w-sm font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Build a complete submission package
            </h2>
            <p className="mt-4 max-w-sm text-xs leading-6 text-slate-500">
              Prepare each item before opening the form. A complete package moves through editorial screening faster and reduces avoidable revision requests.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]" />
              <p className="text-[10px] leading-5 text-slate-500">
                Editable documents are required for production. Keep a separate anonymized version for peer review.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            {preparationItems.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="group grid grid-cols-[28px_40px_minmax(0,1fr)] gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 transition-colors hover:bg-[color:var(--color-gb-blue-soft)]/20"
              >
                <span className="pt-1 font-mono text-[9px] font-black text-slate-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] transition-colors group-hover:bg-[color:var(--color-gb-blue-deep)] group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[color:var(--color-gb-blue-deep)]">{title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Publication Workflow ─────────────────── */}
      <ProcessSteps
        sectionNumber="04"
        sectionLabel="Publication workflow"
        heading="From manuscript to publication"
        description="A transparent 4-stage process guiding your research from initial submission to global indexing."
        steps={authorProcessSteps}
        bannerTitle="Documented editorial pathway"
        footerNote="A traceable route from initial files to the published record."
        badgeText="COPE-Aligned Practice"
      />

      {/* ── Policy CTA ───────────────────────────── */}
      <section className="container-x pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-gb-blue-deep)] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.04]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.12] blur-[80px]" />

          <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-amber-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Editorial requirements
              </p>
              <h2 className="mt-3 font-academic text-2xl font-bold text-white md:text-3xl">
                Submit work that is complete, ethical, and ready for review
              </h2>
              <p className="mt-3 max-w-xl text-xs leading-6 text-white/55">
                Every manuscript is screened for scope, completeness, originality, ethical compliance, and suitability for independent assessment.
              </p>
            </div>

            <div className="space-y-2">
              {policies.slice(0, 3).map((policy) => (
                <div
                  key={policy}
                  className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[10px] font-semibold leading-5 text-white/65"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {policy}
                </div>
              ))}
              <Link
                href="/policies"
                className="mt-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-300 hover:text-amber-200 transition-colors"
              >
                Read all policies
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
