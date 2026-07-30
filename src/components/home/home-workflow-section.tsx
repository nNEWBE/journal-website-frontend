"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Globe2,
  Library,
  Link2,
  Scale,
  Send,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

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
    "border-blue-200/80 bg-blue-50/80 text-blue-800",
    "border-amber-200/80 bg-amber-50/80 text-amber-800",
    "border-violet-200/80 bg-violet-50/80 text-violet-800",
    "border-orange-200/80 bg-orange-50/80 text-orange-800",
    "border-emerald-200/80 bg-emerald-50/80 text-emerald-800",
  ];
  const statusIcons = [CheckCircle2, ClipboardCheck, Users, Scale, Globe2];
  const StatusIcon = statusIcons[index];

  return (
    <div
      className={`workflow-preview relative rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_16px_45px_rgba(11,18,61,0.07)] transition-all duration-300 hover:shadow-[0_22px_55px_rgba(11,18,61,0.11)] ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="workflow-preview-icon flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] shadow-xs">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs font-black text-[color:var(--color-gb-blue-deep)]">
              {stage.previewTitle}
            </p>
            <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
              GB Journal workflow
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-black shadow-2xs ${statusStyles[index]}`}
        >
          <StatusIcon className="h-3.5 w-3.5 shrink-0" />
          {stage.previewStatus}
        </span>
      </div>

      {index === 0 && (
        <div className="mt-4">
          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
            Manuscript
          </p>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[color:var(--color-gb-blue)] shadow-2xs">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[9.5px] font-extrabold text-slate-700">
                Community-health-study.docx
              </p>
              <p className="mt-0.5 text-[8px] font-medium text-slate-400">
                Main article · 2.4 MB
              </p>
            </div>
            <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5">
              <p className="text-[8px] font-bold text-slate-400">Contributors</p>
              <p className="mt-1 text-[9.5px] font-black text-slate-700">
                3 authors
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5">
              <p className="text-[8px] font-bold text-slate-400">Declarations</p>
              <p className="mt-1 text-[9.5px] font-black text-emerald-700">
                Complete
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[8px] font-semibold text-slate-400">
              All required fields completed
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-black text-[color:var(--color-gb-blue)]">
              Submit
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      )}

      {index === 1 && (
        <>
          <div className="mt-4 space-y-2">
            {stage.previewRows.map((row, rowIndex) => {
              const isCompleted = rowIndex < 2;
              return (
                <div
                  key={row}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-all ${
                    isCompleted
                      ? "border-emerald-100/90 bg-emerald-50/40 text-slate-800"
                      : "border-slate-100 bg-slate-50/60 text-slate-500"
                  }`}
                >
                  <span className="text-[10px] font-extrabold text-slate-700">
                    {row}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/80 px-2 py-0.5 text-[8.5px] font-black text-emerald-700">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[8.5px] font-bold text-slate-400">
                      <Clock3 className="h-3 w-3 text-slate-400" />
                      Pending
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                {stage.meta}
              </span>
              <span className="font-mono text-xs font-black text-[color:var(--color-gb-blue-deep)]">
                {stage.progress}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 p-0.5">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: stage.progress }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.9, delay: 0.2, ease: easing }}
                className="block h-full rounded-full bg-gradient-to-r from-[color:var(--color-gb-blue-deep)] via-[color:var(--color-gb-blue)] to-amber-400 shadow-2xs"
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

export function HomeWorkflowSection() {
  const workflowRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: workflowRef,
    offset: ["start 80%", "end 70%"],
  });
  const workflowProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section
      ref={workflowRef}
      className="workflow-section relative overflow-hidden bg-[#fbfcff] py-16 sm:py-20 md:py-28 touch-pan-y"
    >
      <div className="workflow-paper-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-[color:var(--color-gb-blue)]/[0.05] blur-2xl sm:blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-[color:var(--color-gb-gold)]/[0.07] blur-2xl sm:blur-3xl" />
      <div className="container-x relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08, margin: "0px 0px -20px 0px" }}
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
            <h2 className="mt-4 font-academic text-3xl sm:text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-[color:var(--color-gb-blue-deep)] md:text-5xl">
              From manuscript to
              <span className="block font-medium italic text-[color:var(--color-gb-gold-dark)]">
                published research
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-500">
              Follow a transparent editorial pathway designed to protect
              independent review, keep authors informed, and produce a trusted
              scholarly record.
            </p>
          </motion.div>
        </motion.div>

        <div className="workflow-timeline relative mx-auto mt-12 sm:mt-16 max-w-5xl">
          <div className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200 lg:left-1/2 lg:-translate-x-1/2" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: workflowProgress }}
            className="absolute bottom-4 left-[15px] top-4 w-0.5 origin-top bg-gradient-to-b from-[color:var(--color-gb-blue-deep)] via-[color:var(--color-gb-blue)] to-amber-400 lg:left-1/2 lg:-translate-x-1/2 transform-gpu"
          />

          <div className="space-y-12 sm:space-y-16 md:space-y-20">
            {workflowStages.map((stage, index) => {
              const Icon = stage.icon;
              const textOnLeft = index % 2 === 0;

              const leftElement = (
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
                    <span className="inline-flex items-center rounded-md border border-[color:var(--color-gb-gold-dark)]/25 bg-amber-400/10 px-2 py-0.5 font-mono text-xs font-black text-[color:var(--color-gb-gold-dark)]">
                      {stage.number}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-blue)]/10 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="mt-3 text-[9px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-gold-dark)]">
                    {stage.eyebrow}
                  </p>
                  <h3 className="mt-2 font-academic text-xl sm:text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                    {stage.title}
                  </h3>
                  <p
                    className={`mt-2.5 text-xs leading-6 text-slate-500 ${
                      textOnLeft ? "lg:ml-auto" : ""
                    } max-w-sm`}
                  >
                    {stage.text}
                  </p>
                </div>
              );

              const rightElement = (
                <WorkflowPreview
                  stage={stage}
                  index={index}
                  className={
                    textOnLeft
                      ? "lg:col-start-3 lg:row-start-1"
                      : "lg:col-start-1 lg:row-start-1"
                  }
                />
              );

              return (
                <motion.article
                  key={stage.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05, margin: "0px 0px -20px 0px" }}
                  className="workflow-row relative grid items-center gap-6 pl-10 sm:gap-8 sm:pl-12 lg:grid-cols-[1fr_72px_1fr] lg:gap-8 lg:pl-0 transform-gpu overflow-x-hidden"
                >
                  {/* Left side element */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -60 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.55, delay: 0.12, ease: easing }}
                    style={{ willChange: "transform, opacity" }}
                    className={`transform-gpu will-change-transform ${
                      textOnLeft ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"
                    }`}
                  >
                    {textOnLeft ? leftElement : rightElement}
                  </motion.div>

                  {/* Center Node Icon */}
                  <span className="absolute left-[15px] top-1/2 z-20 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 lg:left-1/2 lg:h-7 lg:w-7">
                    <motion.span
                      variants={{
                        hidden: { scale: 0, opacity: 0 },
                        visible: { scale: 1, opacity: 1 },
                      }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      style={{ willChange: "transform, opacity" }}
                      className="workflow-node flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-gb-blue)] text-white shadow-[0_0_0_5px_rgba(31,47,130,0.10)] transform-gpu will-change-transform"
                    >
                      <Icon className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                    </motion.span>
                  </span>

                  {/* Right side element */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 60 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.55, delay: 0.12, ease: easing }}
                    style={{ willChange: "transform, opacity" }}
                    className={`transform-gpu will-change-transform ${
                      textOnLeft ? "lg:col-start-3 lg:row-start-1" : "lg:col-start-3 lg:row-start-1"
                    }`}
                  >
                    {textOnLeft ? rightElement : leftElement}
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
