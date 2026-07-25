"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, Send } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

export function HomeCtaSection() {
  return (
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
  );
}
