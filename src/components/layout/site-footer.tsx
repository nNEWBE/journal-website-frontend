import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Landmark,
  Mail,
  MapPin,
  PenLine,
  Phone,
} from "lucide-react";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-[12.5px] text-slate-300/85 hover:text-white transition-colors"
      >
        <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          {children}
        </span>
      </Link>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#050d21] text-white border-t border-slate-800/90">
      <div className="container-x py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Brand Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative shrink-0 overflow-hidden rounded-md bg-white p-1.5 shadow-md ring-1 ring-white/15 h-12 w-12 flex items-center justify-center">
                <img
                  src="/gb-logo-official.png"
                  alt="Gono Bishwabidyalay emblem"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="font-ui text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors block">
                  GB Journal
                </span>
                <span className="font-bangla text-xs font-semibold text-amber-400/90 block -mt-0.5">
                  গণ বিশ্ববিদ্যালয়
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90 max-w-sm">
              Gono Bishwabidyalay Journal of Research — advancing interdisciplinary discovery through rigorous double-blind peer review and open access scholarship.
            </p>
          </div>

          {/* Journals (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3.5">
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-sm bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                <BookOpen className="h-3 w-3" />
              </span>
              <span className="text-xs font-bold uppercase tracking-normal text-white">
                JOURNALS
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300/90">
              <FooterLink href="/articles">All Articles</FooterLink>
              <FooterLink href="/issues/current">Current Issue</FooterLink>
              <FooterLink href="/issues">Issue Archives</FooterLink>
              <FooterLink href="/articles?sort=views">Most Viewed Articles</FooterLink>
              <FooterLink href="/articles?sort=downloads">Most Downloaded</FooterLink>
            </ul>
          </div>

          {/* For Authors (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3.5">
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-sm bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                <PenLine className="h-3 w-3" />
              </span>
              <span className="text-xs font-bold uppercase tracking-normal text-white">
                FOR AUTHORS
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300/90">
              <FooterLink href="/dashboard/submissions/new">Submit Manuscript</FooterLink>
              <FooterLink href="/authors">Author Guidelines</FooterLink>
              <FooterLink href="/reviewers">Reviewer Guidelines</FooterLink>
              <FooterLink href="/policies">Publication Ethics</FooterLink>
              <FooterLink href="/policies">Publication Fees & Waivers</FooterLink>
            </ul>
          </div>

          {/* About (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3.5">
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-sm bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                <Landmark className="h-3 w-3" />
              </span>
              <span className="text-xs font-bold uppercase tracking-normal text-white">
                ABOUT
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300/90">
              <FooterLink href="/about">About the Journal</FooterLink>
              <FooterLink href="/editorial-board">Editorial Board</FooterLink>
              <FooterLink href="/editorial-board">Advisory Council</FooterLink>
              <FooterLink href="/policies">Peer Review Model</FooterLink>
              <FooterLink href="/contact">Contact Editorial Office</FooterLink>
            </ul>
          </div>

          {/* Contact (3 cols) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3.5">
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-sm bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                <Mail className="h-3 w-3" />
              </span>
              <span className="text-xs font-bold uppercase tracking-normal text-white">
                CONTACT
              </span>
            </div>
            <div className="space-y-3 text-xs text-slate-300/90">
              <a
                href="mailto:editorial@gonobishwabidyalay.edu.bd"
                className="group flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-all">
                  <Mail className="h-3 w-3" />
                </span>
                <span className="text-[11.5px] truncate font-medium text-slate-300 group-hover:text-amber-200 transition-colors">
                  editorial@gonobishwabidyalay.edu.bd
                </span>
              </a>

              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-slate-400 mt-0.5">
                  <MapPin className="h-3 w-3" />
                </span>
                <span className="text-[11.5px] leading-relaxed text-slate-300">
                  Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh
                </span>
              </div>

              <a
                href="tel:+88027792220"
                className="group flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-all">
                  <Phone className="h-3 w-3" />
                </span>
                <span className="text-[11.5px] font-medium text-slate-300 group-hover:text-amber-200 transition-colors">
                  +880 (2) 779-2220
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer Bottom Bar */}
      <div className="border-t border-slate-800/90 py-5 bg-[#030819]">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-center md:text-left">
            <span>© {new Date().getFullYear()} GB Journal of Research · Gono Bishwabidyalay.</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-400">All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] sm:text-xs text-slate-400">
            <Link href="/policies" className="group inline-flex items-center gap-1 hover:text-slate-200 transition-colors">
              <ChevronRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              <span>Privacy Policy</span>
            </Link>
            <Link href="/policies" className="group inline-flex items-center gap-1 hover:text-slate-200 transition-colors">
              <ChevronRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              <span>Terms of Use</span>
            </Link>
            <Link href="/policies" className="group inline-flex items-center gap-1 hover:text-slate-200 transition-colors">
              <ChevronRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              <span>Ethics & Malpractice</span>
            </Link>
            <Link href="/about" className="group inline-flex items-center gap-1 hover:text-slate-200 transition-colors">
              <ChevronRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              <span>Accessibility</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

