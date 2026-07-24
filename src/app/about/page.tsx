import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe2,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AboutJournalStory } from "@/components/about-journal-story";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { PageShell } from "@/components/page-shell";
import { topics } from "@/lib/data";

export default function AboutPage() {
  return (
    <PageShell>
      <EditorialPageHeader
        icon={BookOpen}
        eyebrow="About the journal"
        title="Research grounded in scholarship, open to society"
        description="The Gono Bishwabidyalay Journal of Research is the university's interdisciplinary, peer-reviewed publication for rigorous inquiry, responsible debate, and research with academic and public value."
        actions={
          <>
            <Link
              href="/issues/current"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 text-xs font-black text-slate-950 shadow-md transition-colors hover:from-amber-300 hover:to-amber-400 focus-ring"
            >
              Read the current issue
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/editorial-board"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-xs font-extrabold text-white transition-colors hover:border-white/30 hover:bg-white/10 focus-ring"
            >
              Meet the editorial board
              <Users className="h-3.5 w-3.5 text-white/70" />
            </Link>
          </>
        }
        supporting={
          <>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Double-blind peer review
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5" />
              Open-access publishing
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              Published January and July
            </span>
          </>
        }
        aside={
          <div className="relative overflow-hidden rounded-[20px] bg-[color:var(--color-gb-blue-deep)] p-6 text-white shadow-[0_22px_52px_rgba(17,27,82,0.16)]">
            <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
            <div className="relative flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-amber-300">
                <Landmark className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                  Official publication
                </p>
                <h2 className="mt-1 text-xs font-black text-white">
                  Gono Bishwabidyalay
                </h2>
              </div>
            </div>
            <dl className="relative mt-2 divide-y divide-white/10">
              {[
                ["Frequency", "January and July"],
                ["Review model", "Double blind"],
                ["ISSN Online", "2959-1082"],
                ["ISSN Print", "2959-1074"],
                ["Publisher", "Gono Bishwabidyalay Press"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-5 py-3.5 text-[10px]"
                >
                  <dt className="text-white/40">{label}</dt>
                  <dd className="text-right font-bold text-white/75">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <AboutJournalStory topics={topics} />
    </PageShell>
  );
}
