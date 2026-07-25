"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, CircleHelp, MessageCircle } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easing },
  },
};

const faqs = [
  {
    question: "What types of manuscripts does the journal accept?",
    answer:
      "The journal welcomes original research articles, review articles, case studies, short communications, perspectives, editorials, and scholarly letters across its published subject areas.",
  },
  {
    question: "How does double-blind peer review work?",
    answer:
      "Author and reviewer identities are concealed from one another. Independent subject experts assess the manuscript's methods, evidence, originality, clarity, and scholarly contribution.",
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
      "Yes. The author dashboard shows the manuscript's current stage, editorial updates, revision requests, decisions, and publication progress.",
  },
  {
    question: "Will my published article be openly accessible?",
    answer:
      "Published articles are prepared for open discovery with a permanent article record, downloadable files, citation metadata, and DOI information where applicable.",
  },
];

export function HomeFaqSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="container-x mt-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={reveal}
        aria-labelledby="faq-heading"
        className="faq-section relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,#f7f9ff_0%,#ffffff_58%,#fffaf0_100%)] p-6 shadow-[0_28px_75px_rgba(17,27,82,0.10)] md:p-9 lg:p-11"
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
      </motion.div>
    </div>
  );
}
