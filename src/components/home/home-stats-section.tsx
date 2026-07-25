"use client";

import { motion } from "framer-motion";
import {
  FileCheck2,
  Globe2,
  HeartHandshake,
  Scale,
  Users,
} from "lucide-react";
import { HomeFaqSection } from "@/components/home/home-faq-section";

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

export function HomeStatsSection() {
  return (
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
        </motion.div>
      </div>

      {/* FAQ accordion rendered inside the values section — matching original structure */}
      <HomeFaqSection />
    </section>
  );
}
