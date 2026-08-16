"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Send,
  User as UserIcon,
  X,
} from "lucide-react";
import { GbJournalLogo } from "@/components/layout/gb-logo";
import { getSession, clearSession, setSession, type User } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearAuth, setUser as setReduxUser } from "@/redux/features/auth/authSlice";
import { SiteHeaderNav } from "@/components/header/site-header-nav";
import { HeaderSearchModal } from "@/components/header/header-search-modal";
import { MobileNavDrawer } from "@/components/header/mobile-nav-drawer";
import { toast } from "sonner";

export { mainNav, type NavItem, type NavSubItem } from "@/components/header/nav-data";

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    } else {
      const session = getSession();
      if (session) {
        setUser(session);
        dispatch(setReduxUser(session));
      } else {
        authApi.getMe()
          .then((me) => {
            if (me) {
              const u: User = {
                email: me.email,
                name: me.name || me.fullName,
                role: me.role,
                title: me.title || "Academic Member",
                department: me.department,
                institution: me.institution,
                avatar: me.avatar || me.avatarUrl,
              };
              setUser(u);
              setSession(u);
              dispatch(setReduxUser(u));
            }
          })
          .catch(() => {});
      }
    }
  }, [reduxUser, dispatch]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    toast.success("Logged out successfully", {
      description: "You have been signed out of your account.",
    });
    clearSession();
    dispatch(clearAuth());
    setUser(null);
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <style>{`
        @keyframes waveFlow {
          from { background-position-x: 0; }
          to { background-position-x: -20px; }
        }
        .animate-wave-flow {
          animation: waveFlow 0.8s linear infinite;
        }
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Top institutional banner */}
      <div className="bg-[color:var(--color-gb-blue-deep)] text-white/70">
        <div className="container-x flex h-8 items-center justify-between text-[10px] font-bold tracking-wider">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3 w-3 text-[color:var(--color-gb-gold)]" />
            <span className="hidden sm:inline uppercase">
              Gono Bishwabidyalay Research Publication System
            </span>
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
                <Link href="/about" className="hover:text-white transition-colors">
                  ISSN 2959-1082
                </Link>
                <Link href="/policies" className="hover:text-white transition-colors">
                  Ethics
                </Link>
                <Link href="/reviewers" className="hover:text-white transition-colors">
                  Reviewers
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tri-color accent strip */}
      <div className="h-[2px] bg-gradient-to-r from-[color:var(--color-gb-blue)] via-[color:var(--color-gb-gold)] to-[color:var(--color-gb-red)]" />

      {/* Main Navigation Bar */}
      <div
        className={`border-b border-[color:var(--border)] bg-white/95 backdrop-blur-xl transition-all duration-200 ${
          scrolled ? "shadow-lg shadow-slate-900/10" : ""
        }`}
      >
        <div className="container-x flex min-h-16 items-center justify-between gap-4 py-2.5">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <GbJournalLogo className="max-[380px]:gap-0 max-[380px]:[&>div:first-child]:h-[42px] max-[380px]:[&>div:first-child]:w-[42px] max-[380px]:[&>div:last-child]:hidden" />
          </Link>

          {/* Desktop Navigation */}
          <SiteHeaderNav />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--ink-muted)] hover:bg-slate-50 hover:text-[color:var(--color-gb-blue)] transition-colors cursor-pointer"
              title="Search manuscripts (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href={user ? "/dashboard/submissions/new" : "/login"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue-deep)] px-3 py-2 text-[12px] font-extrabold text-white shadow-xs transition-all hover:bg-[color:var(--color-gb-blue)] sm:px-4"
              aria-label={
                user ? "Submit a new manuscript" : "Sign in to submit a manuscript"
              }
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-white px-2.5 py-2 text-[12px] font-bold text-[color:var(--color-gb-blue-dark)] transition-colors hover:bg-slate-50 min-[440px]:px-3.5"
                title="Access Workspace"
              >
                <UserIcon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                <span className="hidden min-[440px]:inline">Login</span>
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
        <MobileNavDrawer
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Global Search Modal */}
      <HeaderSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
