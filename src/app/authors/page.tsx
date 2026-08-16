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
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { CtaBanner } from "@/components/ui/cta-banner";
import { ProcessSteps, type ProcessStep } from "@/components/ui/process-steps";
import { PublishingCharterSection } from "@/components/ui/publishing-charter-section";
import { SectionBadge } from "@/components/ui/section-badge";
import { articleTypes, policies } from "@/lib/data";

const articleTypeDetails = {
  "Research Article":   { icon: FlaskConical,       description: "Original methods, results, analysis, and scholarly conclusions."              },
  "Review Article":     { icon: Library,             description: "Critical synthesis of established and emerging evidence."                      },
  "Case Study":         { icon: ClipboardCheck,      description: "Focused analysis of a specific practice, setting, or intervention."           },
  "Short Communication":{ icon: MessageSquareText,   description: "Concise reporting of timely findings or methodological advances."              },
  Perspective:          { icon: Eye,                 description: "Evidence-informed interpretation of an important academic question."            },
  Editorial:            { icon: PenLine,             description: "Authoritative commentary on policy, practice, or scholarly direction."         },
  Letter:               { icon: Mail,                description: "Focused correspondence responding to published research or debate."             },
  "Policy Brief":       { icon: Scale,               description: "Actionable analysis translating academic research into policy recommendations." },
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
    title: "Manuscript Preparation & Submission",
    description: "Prepare your manuscript according to guidelines and submit all files and declarations online.",
  },
  {
    number: "02",
    icon: "shield",
    title: "Editorial Screening & Pre-Check",
    description: "The editorial office conducts plagiarism checks, scope verification, and ethics compliance audits.",
  },
  {
    number: "03",
    icon: "users",
    title: "Double-Blind Peer Review",
    description: "Independent peer reviewers evaluate scholarly rigor, methodologies, and original contributions.",
  },
  {
    number: "04",
    icon: "book",
    title: "Final Decision & Publication",
    description: "Accepted manuscripts undergo copyediting, proofing, DOI assignment, and open-access publication.",
  },
];

export default function AuthorsPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)]">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.13] blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

        <div className="container-x relative py-14 md:py-20">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              <Send className="h-3 w-3" />
              Author guidelines & submission
            </span>
            <h1 className="mt-3.5 max-w-2xl font-academic text-3xl font-bold tracking-tight text-white md:text-5xl">
              Publish your research with Gono Bishwabidyalay
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-6 text-white/65 md:text-sm md:leading-7">
              A transparent, peer-reviewed, open-access home for research across sciences, health, social studies, and humanities.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-lg transition-all hover:bg-amber-50 hover:shadow-xl active:scale-[0.98]"
              >
                Submit your manuscript
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#guidelines"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-xs transition-all hover:bg-white/20"
              >
                Read author guidelines
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick overview grid */}
      <section className="border-b border-slate-200/80 bg-slate-50/60 py-10">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Globe2,
              title: "Open access",
              desc: "Immediate, free access to all published articles worldwide under CC BY 4.0 license.",
            },
            {
              icon: Users,
              title: "Double-blind review",
              desc: "Independent peer assessment ensuring rigor, fairness, and constructive editorial feedback.",
            },
            {
              icon: ShieldCheck,
              title: "COPE-aligned ethics",
              desc: "Rigorous research integrity standards covering authorship, consent, and conflict disclosures.",
            },
            {
              icon: Library,
              title: "Indexing & DOIs",
              desc: "Every article is assigned a Crossref DOI and submitted to leading academic databases.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[color:var(--color-gb-blue-deep)]">{title}</h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accepted Manuscript Formats (Article Types) */}
      <section className="container-x py-14 md:py-18">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionBadge number="01" label="Accepted formats" className="mb-2" />
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
                  } ${isLast && articleTypes.length % 2 !== 0 ? "lg:col-span-2 lg:border-r-0" : ""}`}
                >
                  <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[color:var(--color-gb-blue)] transition-colors pt-0.5 w-6 shrink-0">
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

      {/* Submission Checklist */}
      <section className="border-y border-slate-200 bg-[#f5f7fb] py-14 md:py-18" id="guidelines">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionBadge number="02" label="Manuscript preparation" className="mb-2" />
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
                <span className="pt-1 font-mono text-xs font-bold text-slate-400 group-hover:text-[color:var(--color-gb-blue)] transition-colors">
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

      {/* Publication Workflow */}
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

      {/* Submission CTA */}
      <section className="container-x pb-16 md:pb-20">
        <CtaBanner
          badgeText="Submissions are open"
          heading="Your research deserves a rigorous path to publication."
          description="Submit to a multidisciplinary, peer-reviewed journal committed to editorial care, open access, and meaningful scholarly reach."
          features={["Double-blind review", "Open access", "DOI registration"]}
          primaryButtonText="Submit manuscript"
          primaryButtonHref="/dashboard/submissions/new"
          secondaryButtonText="Author guidelines"
          secondaryButtonHref="#guidelines"
        />
      </section>
    </PageShell>
  );
}
