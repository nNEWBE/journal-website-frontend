"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Library,
  Link2,
  MessageCircle,
  Scale,
  ScrollText,
  Send,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

const easing = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easing },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const capabilities = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Rigorous peer review",
    text: "A transparent double-blind workflow from editorial screening through reviewer assessment and final decision.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Editorial governance",
    text: "Clear assignments, conflict checks, decision records, and issue planning for editors and section leads.",
  },
  {
    number: "03",
    icon: Library,
    title: "Long-term archiving",
    text: "Persistent DOI records, searchable references, usage metrics, and durable access to the scholarly record.",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Open scholarship",
    text: "Research published for broad discovery, responsible reuse, and meaningful academic and public reach.",
  },
];

const workflowStages = [
  {
    number: "01",
    icon: Send,
    eyebrow: "Author",
    title: "Submit the manuscript",
    text: "Upload the paper, supporting files, author details, declarations, and subject classifications through one guided submission.",
    meta: "Submission created",
    previewTitle: "New manuscript",
    previewStatus: "Ready to submit",
    previewRows: ["Article details", "Authors & affiliations", "Files & declarations"],
    progress: "100%",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    eyebrow: "Editorial office",
    title: "Initial screening",
    text: "The editorial team checks scope, completeness, ethics, originality requirements, and readiness for external review.",
    meta: "Editorial assessment",
    previewTitle: "Editorial checklist",
    previewStatus: "In screening",
    previewRows: ["Scope alignment", "Required documents", "Ethics declaration"],
    progress: "72%",
  },
  {
    number: "03",
    icon: Users,
    eyebrow: "Independent experts",
    title: "Double-blind peer review",
    text: "Qualified reviewers evaluate the methods, evidence, clarity, originality, and contribution without author identities.",
    meta: "Reviewer reports",
    previewTitle: "Peer review",
    previewStatus: "2 reviewers assigned",
    previewRows: ["Reviewer A · Submitted", "Reviewer B · In progress", "Identity protection · Active"],
    progress: "64%",
  },
  {
    number: "04",
    icon: Scale,
    eyebrow: "Section editor",
    title: "Editorial decision",
    text: "Reviewer recommendations and author revisions are assessed before an evidence-based editorial decision is recorded.",
    meta: "Decision & revision",
    previewTitle: "Decision workspace",
    previewStatus: "Revision assessed",
    previewRows: ["Reports reconciled", "Response reviewed", "Decision letter prepared"],
    progress: "88%",
  },
  {
    number: "05",
    icon: Globe2,
    eyebrow: "Journal",
    title: "Publish and discover",
    text: "Accepted work is copyedited, assigned a DOI, published open access, archived, and prepared for scholarly discovery.",
    meta: "Version of record",
    previewTitle: "Publication record",
    previewStatus: "Published",
    previewRows: ["DOI registered", "Open-access PDF", "Indexing metadata"],
    progress: "100%",
  },
];

type WorkflowStage = (typeof workflowStages)[number];

function WorkflowPreview({
  stage,
  index,
  className,
}: {
  stage: WorkflowStage;
  index: number;
  className: string;
}) {
  const Icon = stage.icon;
  const statusStyles = [
    "border-blue-100 bg-blue-50/70 text-blue-700",
    "border-amber-100 bg-amber-50/70 text-amber-700",
    "border-violet-100 bg-violet-50/70 text-violet-700",
    "border-orange-100 bg-orange-50/70 text-orange-700",
    "border-emerald-100 bg-emerald-50/70 text-emerald-700",
  ];
  const statusIcons = [CheckCircle2, ClipboardCheck, Users, Scale, Globe2];
  const StatusIcon = statusIcons[index];

  return (
    <div
      className={`workflow-preview relative rounded-[16px] border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_rgba(17,27,82,0.06)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="workflow-preview-icon flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-black text-[color:var(--color-gb-blue-deep)]">
              {stage.previewTitle}
            </p>
            <p className="mt-0.5 text-[8px] font-semibold text-slate-400">
              GB Journal workflow
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[8px] font-extrabold ${statusStyles[index]}`}
        >
          <StatusIcon className="h-3 w-3 shrink-0" />
          {stage.previewStatus}
        </span>
      </div>

      {index === 0 && (
        <div className="mt-4">
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Manuscript
          </p>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[color:var(--color-gb-blue)] shadow-sm">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-extrabold text-slate-700">
                Community-health-study.docx
              </p>
              <p className="mt-0.5 text-[8px] text-slate-400">
                Main article · 2.4 MB
              </p>
            </div>
            <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-500" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-100 px-3 py-2.5">
              <p className="text-[8px] text-slate-400">Contributors</p>
              <p className="mt-1 text-[9px] font-extrabold text-slate-700">
                3 authors
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 px-3 py-2.5">
              <p className="text-[8px] text-slate-400">Declarations</p>
              <p className="mt-1 text-[9px] font-extrabold text-emerald-700">
                Complete
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[8px] font-semibold text-slate-400">
              All required fields completed
            </span>
            <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-[color:var(--color-gb-blue)]">
              Submit
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      )}

      {index === 1 && (
        <>
          <div className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
            {stage.previewRows.map((row, rowIndex) => (
              <div
                key={row}
                className="flex items-center justify-between py-3"
              >
                <span className="text-[9px] font-bold text-slate-600">
                  {row}
                </span>
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${
                    rowIndex < 2 ? "text-emerald-500" : "text-slate-300"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[8px] font-bold text-slate-400">
              <span>{stage.meta}</span>
              <span>{stage.progress}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-slate-100">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: stage.progress }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.9, delay: 0.2, ease: easing }}
                className="block h-full rounded-full bg-[color:var(--color-gb-blue)]"
              />
            </div>
          </div>
        </>
      )}

      {index === 2 && (
        <div className="mt-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <UserRound className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[9px] font-extrabold text-slate-700">
                  Reviewer A
                </p>
                <p className="mt-0.5 text-[8px] text-slate-400">
                  Report received
                </p>
              </div>
              <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                <UserRound className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[9px] font-extrabold text-slate-700">
                  Reviewer B
                </p>
                <p className="mt-0.5 text-[8px] text-slate-400">
                  Review in progress
                </p>
              </div>
              <Clock3 className="ml-auto h-3.5 w-3.5 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
            <span className="text-[8px] font-bold text-slate-500">
              Double-blind identities protected
            </span>
          </div>
        </div>
      )}

      {index === 3 && (
        <div className="mt-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-amber-700">
                  Recommendation
                </p>
                <p className="mt-1 text-[11px] font-black text-slate-800">
                  Minor revision
                </p>
              </div>
              <span className="rounded-md bg-white px-2 py-1 text-[8px] font-extrabold text-slate-500 shadow-sm">
                2 reports
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 border-b border-slate-100 py-2.5">
            <FileCheck2 className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
            <div>
              <p className="text-[9px] font-extrabold text-slate-700">
                Author response
              </p>
              <p className="mt-0.5 text-[8px] text-slate-400">
                Revisions verified
              </p>
            </div>
            <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[8px] font-semibold text-slate-400">
              Decision letter prepared
            </span>
            <span className="text-[8px] font-extrabold text-[color:var(--color-gb-blue)]">
              Ready for editor
            </span>
          </div>
        </div>
      )}

      {index === 4 && (
        <div className="mt-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
              <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
                DOI
              </span>
            </div>
            <p className="mt-2 font-mono text-[9px] font-bold text-slate-700">
              10.5555/gbj.2026.001
            </p>
          </div>
          <div className="mt-3 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 py-3">
            <div className="text-center">
              <Download className="mx-auto h-3.5 w-3.5 text-slate-400" />
              <p className="mt-1.5 text-[8px] font-bold text-slate-600">PDF</p>
            </div>
            <div className="text-center">
              <Globe2 className="mx-auto h-3.5 w-3.5 text-slate-400" />
              <p className="mt-1.5 text-[8px] font-bold text-slate-600">Open</p>
            </div>
            <div className="text-center">
              <Library className="mx-auto h-3.5 w-3.5 text-slate-400" />
              <p className="mt-1.5 text-[8px] font-bold text-slate-600">Indexed</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[8px] font-semibold text-slate-400">
              Published July 2026
            </span>
            <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Version of record
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const values = [
  {
    icon: Scale,
    title: "Integrity",
    text: "Ethical decisions, transparent policies, and an accountable scholarly record.",
  },
  {
    icon: FileCheck2,
    title: "Rigor",
    text: "Careful peer review and editorial standards at every stage of publication.",
  },
  {
    icon: Users,
    title: "Inclusion",
    text: "Space for disciplines, methods, and research voices with different perspectives.",
  },
  {
    icon: Globe2,
    title: "Openness",
    text: "Knowledge designed to be discoverable, accessible, and useful beyond campus.",
  },
  {
    icon: HeartHandshake,
    title: "Stewardship",
    text: "Respectful support for authors, reviewers, readers, and the work they contribute.",
  },
];

const leadership = [
  {
    index: "A",
    icon: Landmark,
    title: "Editor-in-Chief",
    text: "Sets editorial direction and safeguards the journal’s academic independence.",
  },
  {
    index: "B",
    icon: ScrollText,
    title: "Managing Editor",
    text: "Coordinates submissions, review progress, production, and publication schedules.",
  },
  {
    index: "C",
    icon: GraduationCap,
    title: "Section Editors",
    text: "Bring subject expertise to evaluation, reviewer selection, and editorial decisions.",
  },
  {
    index: "D",
    icon: Users,
    title: "Editorial Board",
    text: "Advises on policy, scholarly standards, reach, and the journal’s long-term development.",
  },
];

const faqs = [
  {
    question: "What types of manuscripts does the journal accept?",
    answer:
      "The journal welcomes original research articles, review articles, case studies, short communications, perspectives, editorials, and scholarly letters across its published subject areas.",
  },
  {
    question: "How does double-blind peer review work?",
    answer:
      "Author and reviewer identities are concealed from one another. Independent subject experts assess the manuscript’s methods, evidence, originality, clarity, and scholarly contribution.",
  },
  {
    question: "How long does the review process take?",
    answer:
      "Review time varies by discipline, reviewer availability, and the revisions required. Authors can follow each editorial stage from their submission dashboard.",
  },
  {
    question: "Are there publication or submission charges?",
    answer:
      "Any applicable charges are stated in the author guidelines before submission. The journal does not introduce undisclosed fees during peer review.",
  },
  {
    question: "Can I track my manuscript after submission?",
    answer:
      "Yes. The author dashboard shows the manuscript’s current stage, editorial updates, revision requests, decisions, and publication progress.",
  },
  {
    question: "Will my published article be openly accessible?",
    answer:
      "Published articles are prepared for open discovery with a permanent article record, downloadable files, citation metadata, and DOI information where applicable.",
  },
];

export function HomeJournalStory({ topics }: { topics: string[] }) {
  const [openFaq, setOpenFaq] = useState(0);
  const workflowRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: workflowRef,
    offset: ["start 72%", "end 68%"],
  });
  const workflowProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });
  const [editorInChief, managingEditor, sectionEditors, editorialBoard] =
    leadership;
  const EditorInChiefIcon = editorInChief.icon;
  const ManagingEditorIcon = managingEditor.icon;
  const SectionEditorsIcon = sectionEditors.icon;
  const EditorialBoardIcon = editorialBoard.icon;

  return (
    <>
      <section className="story-topics relative overflow-hidden border-t border-slate-200/70 py-20 md:py-28">
        <div className="story-topics-orb pointer-events-none absolute -left-48 top-8 h-96 w-96 rounded-full blur-3xl" />
        <div className="container-x relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16"
          >
            <motion.div variants={reveal} className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="story-number">01</span>
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--color-gb-gold-dark)]">
                  Research gateway
                </span>
              </div>
              <h2 className="mt-5 max-w-lg font-academic text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-5xl">
                Explore knowledge across disciplines
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
                Find peer-reviewed research by subject, then move seamlessly
                from abstract to evidence, references, metrics, and the full
                published paper.
              </p>
              <div className="mt-7 flex items-center gap-5 border-y border-slate-200 py-4">
                {[
                  ["8", "Subject areas"],
                  ["286", "Published papers"],
                  ["Open", "Reader access"],
                ].map(([value, label], index) => (
                  <div key={label} className="contents">
                    {index > 0 && <span className="h-8 w-px bg-slate-200" />}
                    <div>
                      <p
                        className={`text-xl font-black ${
                          value === "Open"
                            ? "text-emerald-700"
                            : "text-[color:var(--color-gb-blue-deep)]"
                        }`}
                      >
                        {value}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Link
                    href={`/articles?topic=${encodeURIComponent(topic)}`}
                    key={topic}
                    className="topic-link group/topic inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.04em] text-[color:var(--color-gb-blue-deep)] shadow-sm focus-ring"
                  >
                    {topic}
                    <ArrowUpRight className="h-3 w-3 text-slate-300 transition-all duration-300 group-hover/topic:-translate-y-0.5 group-hover/topic:translate-x-0.5 group-hover/topic:text-[color:var(--color-gb-blue)]" />
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    variants={reveal}
                    key={item.title}
                    className={`capability-card group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_48px_rgba(17,27,82,0.07)] ${
                      index % 2 === 1 ? "sm:translate-y-8" : ""
                    }`}
                  >
                    <span className="absolute right-5 top-5 font-mono text-[10px] font-bold text-slate-300">
                      {item.number}
                    </span>
                    <div className="capability-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-7 font-academic text-xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-slate-500">
                      {item.text}
                    </p>
                    <div className="mt-6 h-px w-full overflow-hidden bg-slate-100">
                      <span className="capability-line block h-full w-full bg-gradient-to-r from-[color:var(--color-gb-gold)] to-[color:var(--color-gb-blue)]" />
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        ref={workflowRef}
        className="workflow-section relative overflow-hidden bg-[#fbfcff] py-20 md:py-28"
      >
        <div className="workflow-paper-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-[color:var(--color-gb-blue)]/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-[color:var(--color-gb-gold)]/[0.09] blur-3xl" />
        <div className="container-x relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={stagger}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div variants={reveal}>
              <div className="flex items-center justify-center gap-3">
                <span className="story-number">02</span>
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--color-gb-blue)]">
                  How it works
                </span>
              </div>
              <h2 className="mt-5 font-academic text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-[color:var(--color-gb-blue-deep)] md:text-5xl">
                From manuscript to
                <span className="block font-medium italic text-[color:var(--color-gb-gold-dark)]">
                  published research
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Follow a transparent editorial pathway designed to protect
                independent review, keep authors informed, and produce a trusted
                scholarly record.
              </p>
            </motion.div>
          </motion.div>

          <div className="workflow-timeline relative mx-auto mt-16 max-w-5xl">
            <div className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200 lg:left-1/2 lg:-translate-x-1/2" />
            <motion.div
              aria-hidden="true"
              style={{ scaleY: workflowProgress }}
              className="absolute bottom-4 left-[15px] top-4 w-px origin-top bg-gradient-to-b from-[color:var(--color-gb-blue)] via-[color:var(--color-gb-gold)] to-emerald-500 lg:left-1/2 lg:-translate-x-1/2"
            />

            <div className="space-y-16 md:space-y-20">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                const textOnLeft = index % 2 === 0;
                return (
                  <motion.article
                    key={stage.number}
                    initial={{
                      opacity: 0,
                      x: textOnLeft ? -36 : 36,
                      y: 18,
                    }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.68, ease: easing }}
                    className="workflow-row relative grid items-center gap-8 pl-12 lg:grid-cols-[1fr_72px_1fr] lg:gap-8 lg:pl-0"
                  >
                    <div
                      className={`workflow-copy ${
                        textOnLeft
                          ? "lg:col-start-1 lg:row-start-1 lg:text-right"
                          : "lg:col-start-3 lg:row-start-1"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          textOnLeft ? "lg:justify-end" : ""
                        }`}
                      >
                        <span className="font-mono text-[9px] font-bold text-slate-300">
                          {stage.number}
                        </span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-blue)]/10 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <p className="mt-3 text-[9px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-gold-dark)]">
                        {stage.eyebrow}
                      </p>
                      <h3 className="mt-2 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                        {stage.title}
                      </h3>
                      <p
                        className={`mt-3 text-xs leading-6 text-slate-500 ${
                          textOnLeft ? "lg:ml-auto" : ""
                        } max-w-sm`}
                      >
                        {stage.text}
                      </p>
                    </div>

                    <span className="absolute left-[15px] top-1/2 z-20 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 lg:left-1/2 lg:h-7 lg:w-7">
                      <motion.span
                        initial={{ scale: 0.55, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 0.42, ease: easing }}
                        className="workflow-node flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-gb-blue)] text-white shadow-[0_0_0_5px_rgba(31,47,130,0.10)]"
                      >
                        <Icon className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                      </motion.span>
                    </span>

                    <WorkflowPreview
                      stage={stage}
                      index={index}
                      className={
                        textOnLeft
                          ? "lg:col-start-3 lg:row-start-1"
                          : "lg:col-start-1 lg:row-start-1"
                      }
                    />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="story-values relative overflow-hidden bg-white py-20 md:py-28">
        <div className="container-x">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={stagger}
          >
            <motion.div variants={reveal} className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="story-number">03</span>
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--color-gb-gold-dark)]">
                  Principles in practice
                </span>
              </div>
              <h2 className="mt-5 font-academic text-4xl font-bold tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-5xl">
                Values that protect the work
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Every policy, review, and publication decision is shaped by
                principles designed to earn scholarly trust.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.article
                    variants={reveal}
                    key={value.title}
                    className="value-card group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-slate-50/60 p-5"
                  >
                    <span className="absolute right-4 top-4 font-mono text-[9px] font-bold text-slate-300">
                      0{index + 1}
                    </span>
                    <div className="value-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[color:var(--color-gb-blue)] shadow-sm">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <h3 className="mt-7 font-academic text-lg font-bold text-[color:var(--color-gb-blue-deep)]">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {value.text}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>

            <motion.section
              variants={reveal}
              aria-labelledby="faq-heading"
              className="faq-section relative mt-16 overflow-hidden rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,#f7f9ff_0%,#ffffff_58%,#fffaf0_100%)] p-6 shadow-[0_28px_75px_rgba(17,27,82,0.10)] md:p-9 lg:p-11"
            >
              <div className="faq-section-grid pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[color:var(--color-gb-gold)]/[0.10] blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-14">
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gb-blue)]/10 bg-white px-3 py-1.5 shadow-sm">
                    <CircleHelp className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
                      Frequently asked questions
                    </span>
                  </div>
                  <h2
                    id="faq-heading"
                    className="mt-6 font-academic text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-[2.6rem]"
                  >
                    Questions before you submit?
                  </h2>
                  <p className="mt-5 max-w-md text-xs leading-6 text-slate-500">
                    Clear answers about manuscript preparation, peer review,
                    decisions, fees, tracking, and open publication.
                  </p>
                  <div className="mt-8 rounded-[20px] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 text-xs font-black text-[color:var(--color-gb-blue-deep)]">
                      Still need guidance?
                    </h3>
                    <p className="mt-2 text-[10px] leading-5 text-slate-500">
                      The editorial office can help with scope, submission
                      requirements, and journal policies.
                    </p>
                    <Link
                      href="/contact"
                      className="group/contact mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.08em] text-[color:var(--color-gb-blue)] focus-ring"
                    >
                      Contact the editorial office
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <motion.article
                        layout
                        key={faq.question}
                        className={`faq-item overflow-hidden rounded-[18px] border bg-white/85 backdrop-blur-sm ${
                          isOpen
                            ? "border-[color:var(--color-gb-blue)]/25 shadow-[0_16px_38px_rgba(17,27,82,0.09)]"
                            : "border-slate-200/80"
                        }`}
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${index}`}
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                          className="faq-trigger flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-black transition-colors ${
                              isOpen
                                ? "bg-[color:var(--color-gb-blue-deep)] text-white"
                                : "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 text-xs font-extrabold leading-5 text-[color:var(--color-gb-blue-deep)]">
                            {faq.question}
                          </span>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                              isOpen
                                ? "rotate-180 border-[color:var(--color-gb-blue)]/20 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]"
                                : "border-slate-200 text-slate-400"
                            }`}
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`faq-answer-${index}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: easing }}
                              className="overflow-hidden"
                            >
                              <p className="border-t border-slate-100 px-16 py-4 text-[11px] leading-6 text-slate-500 sm:pl-[4.75rem] sm:pr-14">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </motion.section>

            <motion.div
              variants={reveal}
              className="leadership-panel group hidden"
            >
              <div className="leadership-panel-grid pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-[color:var(--color-gb-blue)]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-[color:var(--color-gb-gold)]/10 blur-3xl" />
              <div className="relative grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:items-center lg:gap-14">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/65">
                      Editorial governance
                    </span>
                  </div>
                  <h2 className="mt-6 font-academic text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-white md:text-[2.6rem]">
                    A clear structure for{" "}
                    <span className="text-amber-300">
                      independent decisions
                    </span>
                  </h2>
                  <p className="mt-5 max-w-md text-xs leading-6 text-white/50">
                    Responsibility moves through defined editorial roles, so
                    every manuscript receives subject expertise, consistent
                    oversight, and accountable judgment.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {[
                      { label: "Independent", icon: ShieldCheck },
                      { label: "Multidisciplinary", icon: Users },
                      { label: "Accountable", icon: Scale },
                    ].map(({ label, icon: PrincipleIcon }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[9px] font-bold text-white/55"
                        >
                          <PrincipleIcon className="h-3 w-3 text-emerald-300" />
                          {label}
                        </span>
                      ))}
                  </div>
                  <Link
                    href="/editorial-board"
                    className="group/board mt-8 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-xl shadow-black/10 hover:-translate-y-0.5 hover:bg-amber-50 focus-ring"
                  >
                    Explore the editorial board
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/board:translate-x-1" />
                  </Link>
                </div>

                <div className="governance-map relative rounded-[26px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md sm:p-6">
                  <div className="mx-auto max-w-[72%]">
                    <motion.article
                      initial={{ opacity: 0, y: -18, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{ duration: 0.55, ease: easing }}
                      className="governance-role governance-role-lead relative rounded-[20px] border border-amber-300/20 bg-amber-300/[0.09] p-4 text-center"
                    >
                      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-[color:var(--color-gb-blue-deep)] shadow-lg shadow-amber-950/10">
                        <EditorInChiefIcon className="h-4 w-4" />
                      </span>
                      <p className="mt-3 text-[8px] font-black uppercase tracking-[0.16em] text-amber-300">
                        Academic direction
                      </p>
                      <h3 className="mt-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-white">
                        {editorInChief.title}
                      </h3>
                      <p className="mx-auto mt-2 max-w-xs text-[9px] leading-4 text-white/45">
                        {editorInChief.text}
                      </p>
                    </motion.article>
                  </div>

                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.45, delay: 0.25, ease: easing }}
                    className="governance-line mx-auto h-7 w-px origin-top bg-gradient-to-b from-amber-300/70 to-white/15"
                  />

                  <div className="governance-branch relative pt-6">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{ duration: 0.55, delay: 0.38, ease: easing }}
                      className="governance-branch-line absolute left-1/4 right-1/4 top-0 h-px origin-center bg-white/15"
                    />
                    <div className="governance-branch-stem absolute left-1/4 top-0 h-6 w-px bg-white/15" />
                    <div className="governance-branch-stem absolute right-1/4 top-0 h-6 w-px bg-white/15" />
                    <motion.div variants={stagger} className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          role: managingEditor,
                          icon: ManagingEditorIcon,
                          label: "Operations",
                        },
                        {
                          role: sectionEditors,
                          icon: SectionEditorsIcon,
                          label: "Subject expertise",
                        },
                      ].map((item) => {
                        const RoleIcon = item.icon;
                        return (
                          <motion.article
                            variants={reveal}
                            key={item.role.title}
                            className="governance-role group/role rounded-[18px] border border-white/10 bg-[color:var(--color-gb-blue-deep)]/55 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="governance-role-icon flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-blue-200">
                                <RoleIcon className="h-4 w-4" />
                              </span>
                              <span className="font-mono text-[8px] font-bold text-white/20">
                                {item.role.index}
                              </span>
                            </div>
                            <p className="mt-4 text-[8px] font-black uppercase tracking-[0.14em] text-amber-300/80">
                              {item.label}
                            </p>
                            <h3 className="mt-1.5 text-[10px] font-black uppercase tracking-[0.07em] text-white">
                              {item.role.title}
                            </h3>
                            <p className="mt-2 text-[9px] leading-4 text-white/40">
                              {item.role.text}
                            </p>
                          </motion.article>
                        );
                      })}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.42, delay: 0.55, ease: easing }}
                    className="governance-line mx-auto h-7 w-px origin-top bg-white/15"
                  />

                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.55, delay: 0.4, ease: easing }}
                    className="governance-role governance-role-board flex flex-col gap-4 rounded-[18px] border border-emerald-300/15 bg-emerald-300/[0.07] p-4 sm:flex-row sm:items-center"
                  >
                    <span className="governance-role-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-300">
                      <EditorialBoardIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.08em] text-white">
                          {editorialBoard.title}
                        </h3>
                        <span className="rounded-full bg-emerald-300/10 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-emerald-300">
                          Oversight
                        </span>
                      </div>
                      <p className="mt-1.5 text-[9px] leading-4 text-white/40">
                        {editorialBoard.text}
                      </p>
                    </div>
                    <span className="hidden font-academic text-xl font-bold text-white/15 sm:block">
                      {editorialBoard.index}
                    </span>
                  </motion.article>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-28">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: easing }}
            className="story-cta group relative overflow-hidden rounded-[30px] bg-[color:var(--color-gb-blue-deep)] px-6 py-10 text-white shadow-[0_28px_70px_rgba(11,18,61,0.25)] md:px-10 md:py-12 lg:px-14"
          >
            <div className="story-cta-grid pointer-events-none absolute inset-0" />
            <div className="story-cta-glow pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[color:var(--color-gb-gold)]/20 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Submissions are open
                </div>
                <h2 className="mt-4 font-academic text-3xl font-bold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
                  Your research deserves a rigorous path to publication.
                </h2>
                <p className="mt-4 max-w-xl text-xs leading-6 text-white/55 md:text-sm">
                  Submit to a multidisciplinary, peer-reviewed journal committed
                  to editorial care, open access, and meaningful scholarly reach.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold text-white/45">
                  {["Double-blind review", "Open access", "DOI registration"].map(
                    (item) => (
                      <span key={item} className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/submissions/new"
                  className="group/submit inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-black text-[color:var(--color-gb-blue-deep)] shadow-xl hover:-translate-y-0.5 hover:bg-amber-50 focus-ring"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit manuscript
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/submit:translate-x-0.5 group-hover/submit:-translate-y-0.5" />
                </Link>
                <Link
                  href="/authors"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 text-xs font-extrabold text-white hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-ring"
                >
                  Author guidelines
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
