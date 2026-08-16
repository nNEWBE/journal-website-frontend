import Link from "next/link";
import { LockOpen, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#050e24] text-white border-t border-slate-800">
      <div className="container-x py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1.1fr] gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative shrink-0 overflow-hidden bg-white shadow-sm ring-1 ring-white/10 h-[52px] w-[52px] flex items-center justify-center p-1">
                <img
                  src="/gb-logo-official.png"
                  alt="Gono Bishwabidyalay emblem"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <p className="font-ui text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  GB Journal
                </p>
                <p className="font-bangla text-xs font-semibold text-amber-400/90 mt-0.5">
                  গণ বিশ্ববিদ্যালয়
                </p>
              </div>
            </Link>
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90 max-w-xs">
              Gono Bishwabidyalay Journal of Research — advancing interdisciplinary discovery through rigorous peer review and open access scholarship.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <LockOpen className="h-4 w-4 text-amber-400" />
              <span>Open Access · Peer Reviewed</span>
            </div>
            <Link
              href="/"
              className="inline-block text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
            >
              journal.gonobishwabidyalay.edu.bd
            </Link>
          </div>

          {/* Journals */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              JOURNALS
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  All Journals
                </Link>
              </li>
              <li>
                <Link href="/issues/current" className="hover:text-white transition-colors">
                  Current Issue
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Articles in Press
                </Link>
              </li>
              <li>
                <Link href="/issues" className="hover:text-white transition-colors">
                  Special Issues
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Top Cited Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              FOR AUTHORS
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/dashboard/submissions/new" className="hover:text-white transition-colors">
                  Submit Manuscript
                </Link>
              </li>
              <li>
                <Link href="/reviewers" className="hover:text-white transition-colors">
                  For Reviewers
                </Link>
              </li>
              <li>
                <Link href="/authors" className="hover:text-white transition-colors">
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-white transition-colors">
                  Ethics & Policies
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-white transition-colors">
                  Publication Fees
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              ABOUT
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/editorial-board" className="hover:text-white transition-colors">
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              CONTACT
            </p>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <a href="mailto:editorial@gonobishwabidyalay.edu.bd" className="hover:underline">
                  editorial@gonobishwabidyalay.edu.bd
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>+880 (2) 779-2220</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer Bottom Bar */}
      <div className="border-t border-slate-800/80 py-5 bg-[#030a1b]">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} GB Journal of Research · Gono Bishwabidyalay. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/policies" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

