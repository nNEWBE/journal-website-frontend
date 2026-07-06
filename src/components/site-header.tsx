"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Send,
  User as UserIcon,
  X,
} from "lucide-react";
import { GbJournalLogo } from "@/components/gb-logo";
import { navLinks } from "@/lib/data";
import { getSession, clearSession, type User } from "@/lib/auth";

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    clearSession();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50">
      <style>{`
        @keyframes waveFlow {
          from { background-position-x: 0; }
          to { background-position-x: -20px; }
        }
        .animate-wave-flow {
          animation: waveFlow 0.8s linear infinite;
        }
      `}</style>
      {/* Top institutional banner */}
      <div className="bg-[color:var(--color-gb-blue-deep)] text-white/70">
        <div className="container-x flex h-8 items-center justify-between text-[10px] font-bold tracking-wider">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3 w-3 text-[color:var(--color-gb-gold)]" />
            <span className="hidden sm:inline uppercase">Gono Bishwabidyalay Research Publication System</span>
            <span className="sm:hidden uppercase">GB Journal</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-white/50">Signed in:</span>
                <span className="font-extrabold text-white/90">{user.name}</span>
                <span className="text-[9px] uppercase bg-white/10 px-1.5 py-0.5 rounded font-black text-[color:var(--color-gb-gold)] border border-white/10">
                  {user.role}
                </span>
              </div>
            ) : (
              <div className="hidden items-center gap-4 md:flex">
                <Link href="/about" className="hover:text-white transition-colors">ISSN 2959-1082</Link>
                <Link href="/policies" className="hover:text-white transition-colors">Ethics</Link>
                <Link href="/reviewers" className="hover:text-white transition-colors">Reviewers</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tri-color accent strip */}
      <div className="h-[2px] bg-gradient-to-r from-[color:var(--color-gb-blue)] via-[color:var(--color-gb-gold)] to-[color:var(--color-gb-red)]" />

      {/* Main Navigation Bar */}
      <div
        className={`border-b border-[color:var(--border)] bg-white/95 backdrop-blur-xl transition-shadow duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container-x flex min-h-16 items-center justify-between gap-4 py-2.5">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <GbJournalLogo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-[13px] font-bold text-[color:var(--color-gb-blue-dark)] hover:text-[color:var(--bangla-red)] transition-colors group"
              >
                {item.label}
                <span 
                  className="absolute inset-x-3 bottom-0 h-[6px] opacity-0 translate-y-[2px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none animate-wave-flow"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 6' fill='none' stroke='%23e11d48' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M0 3Q5 0 10 3T20 3'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "20px 6px"
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--ink-muted)] hover:bg-slate-50 hover:text-[color:var(--color-gb-blue)] transition-colors"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Link>

            <Link
              href={user ? "/dashboard/submissions/new" : "/login"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--bangla-red)] hover:bg-[color:var(--color-gb-red-dark)] px-4 py-2 text-[12px] font-extrabold text-white shadow-sm transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Submit</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-3.5 py-2 text-[12px] font-bold text-[color:var(--color-gb-blue-dark)] transition-colors"
                  title="Go to Dashboard"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 px-3 py-2 text-[12px] font-bold text-red-600 transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-3.5 py-2 text-[12px] font-bold text-[color:var(--color-gb-blue-dark)] transition-colors"
                title="Access Workspace"
              >
                <UserIcon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--color-gb-blue-dark)] hover:bg-slate-50 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {menuOpen && (
          <div className="container-x border-t border-[color:var(--border)] py-4 lg:hidden animate-fade">
            <nav className="grid gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-lg px-4 py-2.5 text-sm font-bold text-[color:var(--color-gb-blue-dark)] hover:bg-[color:var(--color-gb-blue-soft)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="border-t border-[color:var(--border)] mt-2 pt-2 grid gap-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-[color:var(--color-gb-blue-dark)] hover:bg-[color:var(--color-gb-blue-soft)]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] mt-2 transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  Login to Workspace
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
