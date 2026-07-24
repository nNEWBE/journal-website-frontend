"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  PenLine,
  Scale,
  Search,
  Send,
  ShieldCheck,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { GbJournalLogo } from "@/components/gb-logo";
import { getSession, clearSession, type User } from "@/lib/auth";

export type NavSubItem = {
  label: string;
  href: string;
  description: string;
  icon: typeof BookOpen;
};

export type NavItem = {
  label: string;
  href: string;
  dropdownHeader?: string;
  footerHref?: string;
  footerLabel?: string;
  dropdown?: NavSubItem[];
};

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About & Governance",
    href: "/about",
    dropdownHeader: "Learn about our institution, leadership & ethics",
    footerHref: "/about",
    footerLabel: "View full journal overview",
    dropdown: [
      {
        label: "About the Journal",
        href: "/about",
        description: "Scope, open access mandate & editorial vision",
        icon: BookOpen,
      },
      {
        label: "Editorial Board",
        href: "/editorial-board",
        description: "Academic leadership & discipline chairs",
        icon: Users,
      },
      {
        label: "Reviewer Guidelines",
        href: "/reviewers",
        description: "Peer-review standards & reviewer panel",
        icon: ShieldCheck,
      },
      {
        label: "Ethics & Policies",
        href: "/policies",
        description: "COPE compliance, copyright & retractions",
        icon: Scale,
      },
    ],
  },
  {
    label: "Issues & Articles",
    href: "/issues",
    dropdownHeader: "Browse published volumes, editions & indexed papers",
    footerHref: "/articles",
    footerLabel: "Search all articles",
    dropdown: [
      {
        label: "All Issues & Archive",
        href: "/issues",
        description: "Browse complete publication record by year",
        icon: Library,
      },
      {
        label: "Search Articles",
        href: "/articles",
        description: "Filter indexed papers by topic, DOI & keywords",
        icon: FileText,
      },
    ],
  },
  {
    label: "For Authors",
    href: "/authors",
    dropdownHeader: "Guidelines & submission portal",
    footerHref: "/dashboard/submissions/new",
    footerLabel: "Submit your manuscript",
    dropdown: [
      {
        label: "Author Guidelines",
        href: "/authors",
        description: "Manuscript structure, formatting & checklist",
        icon: PenLine,
      },
      {
        label: "Submit Manuscript",
        href: "/dashboard/submissions/new",
        description: "Online manuscript submission portal",
        icon: Send,
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

function getIsRouteActive(pathname: string, label: string): boolean {
  if (label === "Home") return pathname === "/";
  if (
    pathname.startsWith("/about") ||
    pathname.startsWith("/policies") ||
    pathname.startsWith("/editorial-board") ||
    pathname.startsWith("/reviewers")
  ) {
    return label === "About & Governance";
  }
  if (pathname.startsWith("/issues") || pathname.startsWith("/articles")) {
    return label === "Issues & Articles";
  }
  if (
    pathname.startsWith("/authors") ||
    pathname.startsWith("/submit") ||
    pathname.startsWith("/dashboard")
  ) {
    return label === "For Authors";
  }
  if (pathname.startsWith("/contact")) {
    return label === "Contact";
  }
  return false;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const sessionTimer = window.setTimeout(() => {
      setUser(getSession());
    }, 0);

    return () => window.clearTimeout(sessionTimer);
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
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <GbJournalLogo className="max-[380px]:gap-0 max-[380px]:[&>div:first-child]:h-[42px] max-[380px]:[&>div:first-child]:w-[42px] max-[380px]:[&>div:last-child]:hidden" />
          </Link>

          {/* Desktop Navigation with Hover Dropdowns */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setActiveTab(null)}
          >
            {mainNav.map((item, idx) => {
              const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
              const isActive = activeTab === idx;
              const isRouteActive = getIsRouteActive(pathname, item.label);

              const animName = direction === "right" ? "slideInFromRight" : "slideInFromLeft";

              return (
                <div
                  key={item.label}
                  className="relative py-1"
                  onMouseEnter={() => {
                    if (activeTab !== idx) {
                      setDirection(activeTab !== null && idx > activeTab ? "right" : "left");
                      setActiveTab(idx);
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold transition-colors ${
                      isActive
                        ? "text-[color:var(--bangla-red)]"
                        : isRouteActive
                        ? "text-[color:var(--color-gb-blue)] font-black"
                        : "text-[color:var(--color-gb-blue-dark)] hover:text-[color:var(--color-gb-blue)]"
                    }`}
                  >
                    <span className="relative py-0.5">
                      <span>{item.label}</span>

                      {/* Wavy line indicator (Only under text) */}
                      <span
                        className={`absolute inset-x-0 -bottom-1 h-[6px] transition-all duration-300 pointer-events-none animate-wave-flow ${
                          isActive || isRouteActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-[2px]"
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 6' fill='none' stroke='${
                            isActive ? "%23e11d48" : "%231f2f82"
                          }' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M0 3Q5 0 10 3T20 3'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "repeat-x",
                          backgroundSize: "20px 6px",
                        }}
                      />
                    </span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 opacity-60 transition-transform duration-250 ${
                          isActive
                            ? "rotate-180 opacity-100 text-[color:var(--bangla-red)]"
                            : isRouteActive
                            ? "opacity-100 text-[color:var(--color-gb-blue)]"
                            : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasDropdown && (
                    <div
                      className={`absolute left-0 top-full pt-2 z-50 min-w-[300px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 invisible translate-y-2 scale-[0.97] pointer-events-none"
                      }`}
                    >
                      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(11,18,61,0.12)] overflow-hidden">
                        {/* Section label */}
                        <div className="px-4 pt-3 pb-1.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#1f2f82]/50">{item.label}</p>
                        </div>

                        {/* Items */}
                        <div key={activeTab} className="grid gap-0.5 px-2 pb-2">
                          {item.dropdown!.map((sub, idxSub) => {
                            const SubIcon = sub.icon;
                            const isSubActive =
                              pathname === sub.href ||
                              (sub.href !== "/" && pathname.startsWith(sub.href));

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                style={{
                                  animation: isActive
                                    ? `${animName} 380ms cubic-bezier(0.16,1,0.3,1) both`
                                    : "none",
                                  animationDelay: isActive ? `${idxSub * 50}ms` : "0ms",
                                }}
                                className={`group/sub flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer transition-all duration-150 ${
                                  isSubActive
                                    ? "bg-[#1f2f82]/6 font-bold text-[#1f2f82]"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                                    isSubActive
                                      ? "bg-[#1f2f82] text-white shadow-xs"
                                      : "bg-slate-100 text-slate-500 group-hover/sub:bg-[#1f2f82] group-hover/sub:text-white"
                                  }`}
                                >
                                  <SubIcon className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <p
                                      className={`text-[12px] font-semibold transition-colors duration-150 ${
                                        isSubActive
                                          ? "text-[#1f2f82] font-extrabold"
                                          : "text-slate-700 group-hover/sub:text-slate-900"
                                      }`}
                                    >
                                      {sub.label}
                                    </p>
                                    {isSubActive && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#1f2f82] shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[10px] leading-4 text-slate-400 font-medium">
                                    {sub.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Footer link */}
                        {item.footerHref && (
                          <div className="border-t border-slate-100 px-4 py-2">
                            <Link
                              href={item.footerHref}
                              className="text-[11px] font-semibold text-[#1f2f82]/70 hover:text-[#1f2f82] transition-colors duration-150"
                            >
                              {item.footerLabel}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue-deep)] px-3 py-2 text-[12px] font-extrabold text-white shadow-xs transition-all hover:bg-[color:var(--color-gb-blue)] sm:px-4"
              aria-label={user ? "Submit a new manuscript" : "Sign in to submit a manuscript"}
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
        {menuOpen && (
          <div className="container-x border-t border-[color:var(--border)] py-4 lg:hidden animate-fade">
            <nav className="grid gap-1">
              {mainNav.map((item) => {
                const hasSub = Boolean(item.dropdown && item.dropdown.length > 0);
                const isOpen = openMobileSub === item.label;
                const isMobileRouteActive = getIsRouteActive(pathname, item.label);

                return (
                  <div key={item.label} className="grid gap-1">
                    <div
                      className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                        isMobileRouteActive
                          ? "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] font-black"
                          : "text-[color:var(--color-gb-blue-dark)] hover:bg-slate-50"
                      }`}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex-1"
                      >
                        {item.label}
                      </Link>
                      {hasSub && (
                        <button
                          onClick={() => setOpenMobileSub(isOpen ? null : item.label)}
                          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {hasSub && isOpen && (
                      <div className="ml-4 grid gap-1 border-l-2 border-[color:var(--color-gb-blue-soft)] pl-3 my-1">
                        {item.dropdown!.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;

                          return (
                            <Link
                              key={sub.href + sub.label}
                              href={sub.href}
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                isSubActive
                                  ? "bg-[color:var(--color-gb-blue)] text-white font-extrabold"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? "text-amber-300" : "text-[color:var(--color-gb-blue)]"}`} />
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

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
