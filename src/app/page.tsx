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
  Target,
  Eye,
  Flag,
  Rocket,
  Sparkles,
  Shield,
  Cpu,
  HeartHandshake,
  Activity,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { HeroSlider } from "@/components/hero-slider";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { issues, topics } from "@/lib/data";

function LinkedinIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

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
                      className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/30 outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      style={{ outline: "none", boxShadow: "none" }}
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
                      <p className="text-xl md:text-2xl font-black text-[color:var(--green-dark)] leading-none">
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



      {/* ── MISSION & VISION + JOURNEY ── */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-t border-[color:var(--border)]">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column: Mission, Vision & Scope */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-gb-blue-soft)] border border-blue-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--color-gb-blue)] mb-3">
                  Our Purpose
                </span>
                <h3 className="font-academic text-2xl sm:text-3xl font-black text-slate-955">
                  Mission, Vision & Scope
                </h3>
              </div>
              <div className="space-y-6">
                {/* Mission */}
                <div className="flex gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Mission</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      To champion and disseminate peer-reviewed research by providing a robust, open-access platform that connects scholars, faculty, and students, while maintaining absolute editorial integrity and publication quality.
                    </p>
                  </div>
                </div>

                {/* Vision */}
                <div className="flex gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Vision</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      To establish the Gono Bishwabidyalay Journal of Research as a premier interdisciplinary academic repository, inspiring scientific discovery and addressing national and global challenges through open research.
                    </p>
                  </div>
                </div>

                {/* Scope & Mandate */}
                <div className="flex gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Scope & Mandate</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      Publishing diverse research across healthcare, clinical sciences, engineering, social sciences, and humanities, facilitating rigorous peer review and academic discourse for a worldwide scholarly community.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Our Journey (Timeline) */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-gb-blue-soft)] border border-blue-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--color-gb-blue)] mb-3">
                  Our Growth
                </span>
                <h3 className="font-academic text-2xl sm:text-3xl font-black text-slate-955">
                  Our Journey
                </h3>
              </div>

              {/* Timeline Container */}
              <div className="relative pl-6 border-l-2 border-slate-150 space-y-8 mt-4">
                {[
                  { year: "2016", title: "Portal Established", desc: "The Gono Bishwabidyalay Journal portal was founded to archive and showcase university research.", icon: Flag },
                  { year: "2018", title: "First Release", desc: "Launched our digital platform to host peer-reviewed journals and manage publications online.", icon: Rocket },
                  { year: "2020", title: "Global Indexing", desc: "Expanded indexation and achieved international visibility for our scholarly articles.", icon: Globe },
                  { year: "2022", title: "Modern Workflow", desc: "Introduced advanced submission tracking, editorial dashboards, and automated review tasks.", icon: Sparkles },
                  { year: "2024+", title: "Future Forward", desc: "Continuing to support open access publishing and promote academic research excellence globally.", icon: ArrowRight },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.year} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-200 group-hover:border-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-blue-soft)] transition-colors z-10">
                        <Icon className="h-3 w-3 text-slate-400 group-hover:text-[color:var(--color-gb-blue)] transition-colors" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[color:var(--color-gb-gold)]">{item.year}</span>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mt-0.5">{item.title}</h4>
                        <p className="text-[11px] leading-relaxed text-slate-500 mt-1 max-w-md">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES & LEADERSHIP ── */}
      <section className="py-16 md:py-24 bg-white border-t border-[color:var(--border)]">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column: Our Core Values */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-gb-blue-soft)] border border-blue-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--color-gb-blue)] mb-3">
                  What We Stand For
                </span>
                <h3 className="font-academic text-2xl sm:text-3xl font-black text-slate-955">
                  Our Core Values
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { title: "Integrity", desc: "We Uphold the highest ethical standards in everything we do.", icon: Shield },
                  { title: "Innovation", desc: "We build smart solutions that solve real problems for real people.", icon: Cpu },
                  { title: "Collaboration", desc: "We believe in the power of community and shared knowledge.", icon: Users },
                  { title: "Impact", desc: "We are committed to advancing research and societal progress.", icon: Activity },
                  { title: "Customer Success", desc: "Our users' success is our mission. We're here to help.", icon: HeartHandshake },
                ].map((val) => {
                  const Icon = val.icon;
                  return (
                    <div key={val.title} className="flex gap-3.5 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{val.title}</h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{val.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Our Leadership */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-gb-blue-soft)] border border-blue-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--color-gb-blue)] mb-3">
                  The Team
                </span>
                <h3 className="font-academic text-2xl sm:text-3xl font-black text-slate-955">
                  Our Leadership
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { name: "Dr. Emily Parker", role: "Co-Founder & Editor-in-Chief", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
                  { name: "Michael Chen", role: "Co-Founder & CTO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" },
                  { name: "Priya Nair", role: "Head of Product", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
                  { name: "James Wilson", role: "Head of Customer Success", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200" },
                ].map((member) => (
                  <div key={member.name} className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-[color:var(--color-gb-blue)] transition-colors">
                      <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mt-3.5">{member.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{member.role}</p>
                    <a
                      href="#linkedin"
                      className="mt-3 text-slate-300 hover:text-[color:var(--color-gb-blue)] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="pt-8 pb-16 bg-transparent">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[color:var(--color-gb-blue-dark)] to-[color:var(--color-gb-blue-deep)] text-white p-8 md:p-12 border border-[color:var(--color-gb-blue)]/20 shadow-xl">
            <div className="absolute inset-0 opacity-[0.03] bg-[size:30px_30px]" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black tracking-tight font-academic">
                  Ready to transform your publishing workflow?
                </h3>
                <p className="text-xs md:text-sm text-blue-100/70 font-semibold max-w-xl">
                  Join our academic portal at Gono Bishwabidyalay to publish scholarly research smarter, faster, and with absolute integrity.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-center">
                <Link
                  href="/dashboard/submissions/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-md transition-all active:scale-[0.98]"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all active:scale-[0.98]"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageShell>
  );
}

