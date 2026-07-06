import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Download,
  FileText,
  Globe,
  Info,
  Search,
  Send,
  ShieldCheck,
  Unlock,
  Users,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { HeroSlider } from "@/components/hero-slider";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { issues, topics } from "@/lib/data";

export default function Home() {
  const currentIssue = issues[0];
  const featuredArticle = currentIssue.articles[0];

  return (
    <PageShell>
      {/* ── HERO SECTION ── Professional Journal Masthead */}
      <section className="relative overflow-hidden border-b border-[color:var(--border)]">
        {/* Deep blue masthead band */}
        <div className="hero-masthead relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white">
          <div className="absolute inset-0 hero-pattern opacity-[0.04]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-gb-blue-deep)] via-[color:var(--color-gb-blue-dark)] to-[color:var(--color-gb-blue-deep)]" />
          <div className="container-x relative z-10 py-10 md:py-14 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 items-start">
              {/* Left — Journal identity */}
              <div className="animate-rise flex flex-col justify-center">
                {/* Credibility row */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/80 backdrop-blur-sm">
                    <Unlock className="h-3 w-3 text-emerald-400" />
                    Open Access
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/80 backdrop-blur-sm">
                    <ShieldCheck className="h-3 w-3 text-[color:var(--color-gb-gold)]" />
                    Peer-Reviewed
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/[0.06] px-3 py-1 text-[10px] font-bold tracking-wider text-white/50 font-mono">
                    ISSN 2959-1082
                  </span>
                </div>

                {/* Journal title */}
                <h1 className="font-academic text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-white">
                  Gono Bishwabidyalay{" "}
                  <br className="hidden sm:block" />
                  <span className="hero-title-accent">
                    Journal of Research
                  </span>
                </h1>

                {/* Scholarly subtitle */}
                <p className="mt-4 max-w-lg text-[15px] md:text-base leading-relaxed text-white/60 font-medium">
                  An interdisciplinary, peer-reviewed journal advancing scholarly discourse across the sciences, humanities, and applied research.
                </p>

                {/* Search bar — editorial style */}
                <form
                  action="/search"
                  className="hero-search-form mt-7 flex flex-col gap-2 sm:flex-row max-w-xl"
                >
                  <div className="flex min-h-[46px] flex-1 items-center gap-3 rounded-lg bg-white/[0.08] border border-white/10 px-4 focus-within:bg-white/[0.12] focus-within:border-white/20 transition-all">
                    <Search className="h-4 w-4 text-white/40 shrink-0" />
                    <input
                      name="q"
                      placeholder="Search by title, author, DOI, keywords…"
                      className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/30 outline-none"
                    />
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-gold)] hover:bg-[color:var(--color-gb-gold-dark)] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
                    type="submit"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Search
                  </button>
                </form>

                {/* CTA buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--bangla-red)] hover:bg-[color:var(--color-gb-red-dark)] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/25 transition-all"
                  >
                    <Send className="h-4 w-4" />
                    Submit Manuscript
                  </Link>
                  <Link
                    href="/issues/current"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 px-5 py-3 text-sm font-bold text-white/90 transition-all"
                  >
                    <BookOpen className="h-4 w-4" />
                    Current Issue
                  </Link>
                </div>
              </div>

              {/* Right — Journal cover slider */}
              <div className="w-full lg:mt-0 mt-2">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics strip — integrated into hero bottom */}
        <div className="hero-stats-strip bg-white border-t border-[color:var(--border)]">
          <div className="container-x py-5 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { value: "286", label: "Published Articles", icon: FileText },
                { value: "74", label: "Active Reviewers", icon: Users },
                { value: "22", label: "Issues Archived", icon: BookOpen },
                { value: "4", label: "Volumes", icon: Globe },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-academic text-xl md:text-2xl font-extrabold text-[color:var(--green-dark)] leading-none">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] md:text-[11px] font-bold text-[color:var(--ink-muted)] uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-10 bg-white/40">
        <div className="container-x grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

          <div className="space-y-10">
            {featuredArticle && (
              <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="absolute top-0 right-0 bg-[color:var(--color-gb-gold-dark)] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg z-10">
                  Featured Article
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="w-[145px] h-[200px] shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-50 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] relative block cursor-pointer transition-all duration-300"
                  >
                    <img
                      src={featuredArticle.image || "/covers/medical.png"}
                      alt={featuredArticle.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Badge variant="warning" className="text-[9px] px-2 py-0.5 tracking-wider font-bold rounded-md mb-2">{featuredArticle.topic}</Badge>
                    <Link href={`/articles/${featuredArticle.slug}`}>
                      <h3 className="text-lg md:text-xl font-semibold font-academic text-slate-800 hover:text-[color:var(--color-gb-blue)] transition-colors leading-snug">
                        {featuredArticle.title}
                      </h3>
                    </Link>
                    <p className="mt-1.5 text-xs font-medium text-slate-400">
                      By {featuredArticle.authors.join(", ")}
                    </p>
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-500 line-clamp-3">
                      {featuredArticle.abstract}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-[10px] text-slate-300 font-mono">
                        DOI: {featuredArticle.doi}
                      </span>
                      <Link
                        href={`/articles/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-black text-[color:var(--color-gb-blue)] hover:text-[color:var(--bangla-red)] transition-colors uppercase tracking-wider"
                      >
                        Read Manuscript <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Issue Table of Contents */}
            <div>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[color:var(--border)] pb-4">
                <div>
                  <Badge variant="info" className="mb-2">Table of Contents</Badge>
                  <h2 className="font-academic mt-2 text-2xl md:text-3xl font-extrabold text-[color:var(--color-gb-blue-dark)]">
                    {currentIssue.theme}
                  </h2>
                  <p className="mt-1 text-xs font-bold text-[color:var(--ink-muted)]">
                    {currentIssue.volume}, {currentIssue.issue} &bull; Published {currentIssue.month}
                  </p>
                </div>
                <Link
                  href="/issues/current"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-[color:var(--color-gb-blue-dark)] transition-colors whitespace-nowrap"
                >
                  View Full Issue <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-6 grid gap-5 grid-cols-2 sm:grid-cols-3">
                {currentIssue.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area: Academic Metadata, Indexing & Resources */}
          <aside className="space-y-5">

            {/* Journal Metadata Card */}
            <div className="surface-elevated p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--color-gb-blue-dark)] flex items-center gap-2 border-b border-[color:var(--border)] pb-2.5">
                <Info className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                Journal Information
              </h3>
              <div className="mt-4 space-y-3 text-xs font-medium text-[color:var(--foreground)]">
                <div className="flex justify-between border-b border-[color:var(--border)] pb-2">
                  <span className="text-[color:var(--ink-muted)]">ISSN (Online)</span>
                  <span className="font-mono font-bold">2959-1082</span>
                </div>
                <div className="flex justify-between border-b border-[color:var(--border)] pb-2">
                  <span className="text-[color:var(--ink-muted)]">ISSN (Print)</span>
                  <span className="font-mono font-bold">2959-1074</span>
                </div>
                <div className="flex justify-between border-b border-[color:var(--border)] pb-2">
                  <span className="text-[color:var(--ink-muted)]">Frequency</span>
                  <span className="font-bold">Semi-annually (Jan & July)</span>
                </div>
                <div className="flex justify-between border-b border-[color:var(--border)] pb-2">
                  <span className="text-[color:var(--ink-muted)]">Publisher</span>
                  <span className="font-bold text-[color:var(--color-gb-blue-dark)] text-right">Gono Bishwabidyalay Press</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--ink-muted)]">Peer Review</span>
                  <span className="font-bold">Double Blind</span>
                </div>
              </div>
            </div>

            {/* Indexing & Abstracting Card */}
            <div className="surface-elevated p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--color-gb-blue-dark)] flex items-center gap-2 border-b border-[color:var(--border)] pb-2.5">
                <Globe className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                Indexing & Abstracting
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[color:var(--ink-muted)]">
                Indexed in and archived by the following databases:
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[10px] font-extrabold uppercase">
                {["Google Scholar", "BanglaJOL", "Crossref DOI", "ResearchGate", "DOAJ", "LOCKSS Archive"].map((item) => (
                  <div key={item} className="rounded-lg border border-[color:var(--border)] bg-slate-50 p-2 text-[color:var(--color-gb-blue-dark)] hover:bg-[color:var(--color-gb-blue-soft)] hover:border-[color:var(--color-gb-blue)] transition-colors cursor-default">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Downloads & Resources */}
            <div className="surface-elevated p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--color-gb-blue-dark)] flex items-center gap-2 border-b border-[color:var(--border)] pb-2.5">
                <FileText className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                Author Resources
              </h3>
              <div className="mt-4 space-y-2">
                {[
                  { title: "Manuscript Template", desc: "MS Word format (.docx)" },
                  { title: "Author Guidelines", desc: "Instruction PDF (1.2 MB)" },
                  { title: "Copyright Form", desc: "Transfer Agreement (.pdf)" },
                ].map((resource) => (
                  <a
                    key={resource.title}
                    href="#downloads"
                    className="flex items-center justify-between rounded-lg border border-dashed border-[color:var(--border)] bg-white p-3 text-xs hover:border-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-soft)] transition-all cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-[color:var(--color-gb-blue-dark)]">{resource.title}</p>
                      <p className="text-[10px] text-[color:var(--ink-muted)]">{resource.desc}</p>
                    </div>
                    <Download className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Announcements Box */}
            <div className="surface-elevated p-5 bg-gradient-to-br from-amber-50/80 to-amber-100/20 border-amber-200">
              <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-amber-700" />
                Call for Papers
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-amber-800">
                Manuscripts are invited for <strong>Volume 5, Issue 1 (January 2027)</strong>. Submission window is open.
              </p>
              <p className="mt-2 text-[10px] font-bold text-amber-900 uppercase">
                Deadline: November 15, 2026
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Topics and Feature Overviews */}
      <section className="section-pad border-t border-[color:var(--border)] bg-slate-50/40">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge variant="warning" className="mb-3">Browse Subject Areas</Badge>
            <h2 className="font-academic mt-4 text-2xl md:text-3xl font-extrabold leading-tight text-[color:var(--color-gb-blue-dark)]">
              Explore Academic Topics
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 text-sm">
              Discover peer-reviewed university research papers sorted by interdisciplinary fields. Access metrics, abstracts, references, and citation data for all articles.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Link
                  href={`/articles?topic=${encodeURIComponent(topic)}`}
                  key={topic}
                >
                  <Badge
                    variant="default"
                    className="hover:border-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-soft)] transition-colors cursor-pointer"
                  >
                    {topic}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ClipboardCheck,
                title: "Peer-Review Workflow",
                text: "Guided workflow tracking from initial editorial check and double-blind reviewer evaluation to final copyediting and volume scheduling.",
              },
              {
                icon: ShieldCheck,
                title: "Editorial Control",
                text: "Robust manuscript dispatching queue, conflict checks, assignment triggers, and issue building actions for editors and section heads.",
              },
              {
                icon: BookOpen,
                title: "University Archiving",
                text: "Secure repository with DOI identifiers, download counters, reference indexing, and academic citations generation.",
              },
              {
                icon: FileText,
                title: "Open Access Publishing",
                text: "Author-retained copyrights under Creative Commons licensing, ensuring widespread community distribution and maximum reach.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface-elevated p-5 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--bangla-red)] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-[color:var(--color-gb-blue-dark)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink-muted)]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

