import Link from "next/link";
import { BookOpen, Mail, MapPin, ExternalLink } from "lucide-react";
import { GbJournalLogo } from "@/components/layout/gb-logo";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="h-[2px] bg-gradient-to-r from-[color:var(--color-gb-blue)] via-[color:var(--color-gb-gold)] to-[color:var(--color-gb-red)]" />

      <div className="bg-[color:var(--color-gb-blue-deep)] text-white">
        <div className="container-x grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <div className="[&_p]:text-white">
              <GbJournalLogo />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
              A peer-reviewed, open-access academic journal published by
              Gono Bishwabidyalay for scholarly research and interdisciplinary discourse.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider text-white/35">
              <span>ISSN (Online): 2959-1082</span>
              <span>·</span>
              <span>ISSN (Print): 2959-1074</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white/40">Journal</p>
            <div className="mt-4 grid gap-2.5 text-sm text-white/60">
              <Link href="/articles" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Articles</Link>
              <Link href="/issues" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Issues & Volumes</Link>
              <Link href="/issues/current" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Current Issue</Link>
              <Link href="/authors" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Author Guidelines</Link>
              <Link href="/policies" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Publication Ethics</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white/40">Management</p>
            <div className="mt-4 grid gap-2.5 text-sm text-white/60">
              <Link href="/dashboard" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Dashboard</Link>
              <Link href="/dashboard/submissions/new" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Submit Manuscript</Link>
              <Link href="/reviewers" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Reviewer Guidance</Link>
              <Link href="/editorial-board" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Editorial Board</Link>
              <Link href="/about" className="hover:text-[color:var(--color-gb-gold)] transition-colors">About the Journal</Link>
              <Link href="/contact" className="hover:text-[color:var(--color-gb-gold)] transition-colors">Contact Us</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white/40">Contact</p>
            <div className="mt-4 grid gap-3 text-sm text-white/60">
              <span className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-[color:var(--color-gb-gold)] shrink-0" />
                <span>journal@gonouniversity.edu.bd</span>
              </span>
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-[color:var(--color-gb-gold)] shrink-0" />
                <span>Gono Bishwabidyalay<br />Savar, Dhaka 1344, Bangladesh</span>
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Google Scholar", "BanglaJOL", "Crossref"].map((db) => (
                <span
                  key={db}
                  className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/40"
                >
                  {db}
                  <ExternalLink className="h-2.5 w-2.5" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-4">
          <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/35">
            <span>© {new Date().getFullYear()} Gono Bishwabidyalay Journal of Research. All rights reserved.</span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Licensed under CC BY 4.0 · Frontend prototype
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
