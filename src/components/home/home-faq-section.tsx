"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  FileText,
  HelpCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FadeIn } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";

interface FaqItem {
  id: string;
  category: "all" | "scope" | "review" | "ethics" | "access";
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "scope",
    question: "What types of manuscripts does GB Journal accept?",
    answer:
      "GB Journal welcomes original research articles, comprehensive review papers, clinical case studies, technical notes, and scholarly commentaries across multidisciplinary fields including Medical & Health Sciences, Engineering, Biological Sciences, and Social Research. All submissions must represent unpublished, original inquiry.",
    highlight: "Original research, reviews, case studies & perspectives accepted.",
  },
  {
    id: "faq-2",
    category: "review",
    question: "How does the double-blind peer review process operate?",
    answer:
      "To safeguard objectivity and academic rigor, author identities and reviewer identities are completely concealed from each other. Each manuscript is evaluated by at least two independent subject specialists who assess methodology, ethical compliance, data validity, clarity, and contribution to the discipline.",
    highlight: "Strictly anonymous review by 2+ qualified independent experts.",
  },
  {
    id: "faq-3",
    category: "review",
    question: "What is the typical turnaround timeline from submission to decision?",
    answer:
      "Initial editorial desk screening is conducted within 3 to 5 business days. The comprehensive peer review process generally spans 4 to 6 weeks depending on reviewer availability and required revisions. Authors receive instant milestone notifications and live tracking in their author portal.",
    highlight: "Desk screening in 3–5 days; peer review decision within 4–6 weeks.",
  },
  {
    id: "faq-4",
    category: "ethics",
    question: "Are there publication charges or Article Processing Charges (APCs)?",
    answer:
      "GB Journal is committed to equitable open scholarship. Publication policies, institutional support, and any applicable open-access processing charges are fully disclosed before submission. Generous waiver programs are available for researchers and students without dedicated grant funding.",
    highlight: "Transparent fee structure with institutional waiver support.",
  },
  {
    id: "faq-5",
    category: "access",
    question: "How can I track my submitted manuscript after submission?",
    answer:
      "Once submitted, authors can track every evaluation phase in real-time through the Research Workspace dashboard. Status stages include Initial Screening, In Peer Review, Revision Requested, Accepted, and Published Online. Instant email notifications are dispatched at every milestone.",
    highlight: "Real-time lifecycle tracking directly via the author portal.",
  },
  {
    id: "faq-6",
    category: "access",
    question: "Will published articles receive permanent DOI and open access indexing?",
    answer:
      "Yes. All published papers are permanently indexed with a registered CrossRef DOI, citation metadata, and downloadable PDF files. Articles are distributed globally under Creative Commons licensing to maximize research dissemination and academic impact.",
    highlight: "Instant worldwide open access with permanent CrossRef DOIs.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Questions" },
  { key: "scope", label: "Scope & Submissions" },
  { key: "review", label: "Peer Review" },
  { key: "ethics", label: "Ethics & APCs" },
  { key: "access", label: "Tracking & Access" },
] as const;

export function HomeFaqSection() {
  const [section, setSection] = useState<PageContentDTO | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string>("faq-1");

  useEffect(() => {
    let active = true;
    contentApi
      .getPublished("home")
      .then((sections) => {
        if (!active) return;
        const s = sections.find((sec) => sec.sectionKey === "home-faq");
        if (s) setSection(s);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (section && section.published === false) {
    return null;
  }

  const title = section?.title || "Frequently Asked Questions";

  const meta = (() => {
    try {
      return section?.metaJson ? JSON.parse(section.metaJson) : {};
    } catch {
      return {};
    }
  })();

  const dynamicFaqs: FaqItem[] =
    Array.isArray(meta.faqs) && meta.faqs.length > 0
      ? meta.faqs.map((f: any, idx: number) => ({
          id: `dyn-faq-${idx}`,
          category: "all",
          question: f.q || "Scholarly Inquiry",
          answer: f.a || "",
        }))
      : FAQ_ITEMS;

  const filteredFaqs =
    activeCategory === "all"
      ? dynamicFaqs
      : dynamicFaqs.filter((item) => item.category === activeCategory);

  return (
    <section
      aria-label="Frequently Asked Questions"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header matching other homepage sections */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {title}
            </h2>
            {section?.subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                {section.subtitle}
              </p>
            )}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
          >
            <span>Contact Editorial Office</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Category Filters Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                    : "bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px] gap-8 lg:gap-12 mt-8">
          {/* Left Column: Accordion Items */}
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              const formattedIndex = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={faq.id}
                  className={`border transition-colors ${
                    isOpen
                      ? "border-slate-400/80 bg-slate-50/40 shadow-2xs"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? "" : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${
                          isOpen ? "text-[#1e40af]" : "text-slate-400"
                        }`}
                      >
                        {formattedIndex}
                      </span>
                      <h3
                        className={`font-ui text-sm sm:text-[15px] font-bold leading-snug tracking-tight transition-colors ${
                          isOpen ? "text-[#0b1b3d]" : "text-slate-900"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-transform duration-200 mt-0.5 ${
                        isOpen
                          ? "rotate-180 border-[#1e40af] bg-[#1e40af]/10 text-[#1e40af]"
                          : "border-slate-200 text-slate-400 bg-white"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-slate-200/70"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-4 space-y-3">
                          <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600">
                            {faq.answer}
                          </p>
                          {faq.highlight && (
                            <div className="flex items-center gap-2 bg-blue-50/70 border-l-2 border-[#1e40af] px-3.5 py-2 text-[11px] font-semibold text-[#1e40af]">
                              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                              <span>{faq.highlight}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Editorial Support Card */}
          <div className="space-y-6">
            <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center bg-[#0b1b3d] text-white">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      EDITORIAL DESK
                    </p>
                    <h3 className="font-academic text-lg font-medium text-slate-950">
                      Need custom guidance?
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                  Have specific inquiries regarding manuscript scope, special issues, or submission formatting? Our editorial staff is here to help.
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-200/70 pt-5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Mail className="h-4 w-4 text-[#1e40af] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Email Editorial Office</p>
                      <a
                        href="mailto:editorial@gonobishwabidyalay.edu.bd"
                        className="text-[11px] text-[#1e40af] hover:underline"
                      >
                        editorial@gonobishwabidyalay.edu.bd
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <BookOpen className="h-4 w-4 text-[#1e40af] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Author Guidelines</p>
                      <Link
                        href="/authors"
                        className="text-[11px] text-[#1e40af] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Review submission format</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FileText className="h-4 w-4 text-[#1e40af] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Publication Ethics</p>
                      <Link
                        href="/policies"
                        className="text-[11px] text-[#1e40af] hover:underline inline-flex items-center gap-1"
                      >
                        <span>COPE compliance & peer review policy</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/70">
                <Link
                  href="/dashboard/submissions/new"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3 text-xs font-semibold transition-colors"
                >
                  <span>Submit Manuscript Now</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
