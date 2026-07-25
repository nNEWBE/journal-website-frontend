"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
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
import { articles } from "@/lib/data";

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

  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim() && selectedCategory === "All") return [];
    return articles.filter((art) => {
      const matchesCat = selectedCategory === "All" || art.topic.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesText =
        art.title.toLowerCase().includes(q) ||
        art.authors.some((a) => a.toLowerCase().includes(q)) ||
        art.topic.toLowerCase().includes(q) ||
        art.doi.toLowerCase().includes(q) ||
        art.type.toLowerCase().includes(q);
      return matchesCat && matchesText;
    });
  }, [searchQuery, selectedCategory]);

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

      {/* ── Search Modal Portal ───────────────────────────────────────────── */}
      {isSearchOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/60 backdrop-blur-md animate-in fade-in-50 duration-200">
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top search input header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manuscripts, authors, topics, or DOI..."
                className="w-full text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <span className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500">
                ESC
              </span>
            </div>

            {/* Filter category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 px-4 py-2.5 scrollbar-none">
              {["All", "Public Health", "Pharmacy", "Agriculture", "Technology"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[color:var(--color-gb-blue)] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Body Content */}
            <div className="max-h-[380px] overflow-y-auto p-4 space-y-2">
              {!searchQuery.trim() && selectedCategory === "All" ? (
                <div className="py-2 space-y-4">
                  <div>
                    <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Community Healthcare",
                        "Antimicrobial Stewardship",
                        "Climate-Resilient Agriculture",
                        "AI-Assisted Learning",
                        "Public Health Savar",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Search className="h-3 w-3 text-slate-400" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Indexed Manuscripts
                    </p>
                    <div className="space-y-1.5">
                      {articles.map((art) => (
                        <Link
                          key={art.id}
                          href={`/articles/${art.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700 border border-blue-200/50">
                                {art.topic}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">{art.publishedAt}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-1">
                              {art.title}
                            </h4>
                            <p className="mt-0.5 text-[10px] text-slate-500 truncate">
                              By {art.authors.join(", ")}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">No matching manuscripts found</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try adjusting keywords or selecting &quot;All&quot; category filter.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Found {filteredArticles.length} Result{filteredArticles.length > 1 ? "s" : ""}
                  </p>
                  {filteredArticles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/articles/${art.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700 border border-blue-200/50">
                            {art.topic}
                          </span>
                          <span className="font-mono text-[9.5px] font-semibold text-slate-400">{art.doi}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="mt-0.5 text-[10px] text-slate-500 truncate">
                          By {art.authors.join(", ")}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 bg-slate-50/70 text-[10px] text-slate-400">
              <span>Press <kbd className="rounded border border-slate-200 bg-white px-1 font-mono font-bold text-slate-600">ESC</kbd> to close</span>
              <Link
                href="/articles"
                onClick={() => setIsSearchOpen(false)}
                className="font-bold text-[color:var(--color-gb-blue)] hover:underline"
              >
                View All Articles &rarr;
              </Link>
            </div>
          </div>
          {/* Background backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsSearchOpen(false)} />
        </div>,
        document.body
      )}
    </header>
  );
}
