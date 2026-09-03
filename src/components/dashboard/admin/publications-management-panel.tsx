"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookMarked,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  LayoutGrid,
  List,
  Eye,
  FileText,
  FileCheck2,
  Calendar,
  Layers,
  Sparkles,
  Quote,
  Share2,
  ChevronRight,
  BookOpen,
  Users,
  ShieldCheck,
  X,
  Clock,
  ArrowUpRight,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { articles as initialArticles, articleTypes as defaultArticleTypes, topics as defaultTopics, Article } from "@/lib/data";
import { articlesApi, issuesApi, IssueData } from "@/lib/api";
import { CustomDrawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

function getCoverImage(article: Article): string {
  if (article.image && typeof article.image === "string" && article.image.trim()) {
    return article.image;
  }
  const topic = (article.topic || "").toLowerCase();
  if (topic.includes("pharmacy") || topic.includes("drug")) return "/covers/pharmacy.png";
  if (topic.includes("tech") || topic.includes("computer") || topic.includes("ai")) return "/covers/technology.png";
  if (topic.includes("agri") || topic.includes("farm") || topic.includes("climate") || topic.includes("crop")) return "/covers/agriculture.png";
  if (topic.includes("law") || topic.includes("justice") || topic.includes("governance")) return "/covers/law.png";
  return "/covers/medical.png";
}

export function PublicationsManagementPanel() {
  const [articlesList, setArticlesList] = useState<Article[]>(initialArticles);
  const [issuesList, setIssuesList] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [openAccessOnly, setOpenAccessOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "citations" | "downloads" | "views" | "title">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // Selected Article for Detail Inspection Drawer/Modal
  const [inspectedArticle, setInspectedArticle] = useState<Article | null>(null);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<"apa" | "harvard" | "vancouver" | "bibtex">("apa");
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Fetch publications from API or merge with defaults
  const loadPublications = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // 1. Fetch articles from backend API
      const [artRes, issRes] = await Promise.allSettled([
        articlesApi.list({ size: 100 }),
        issuesApi.list(),
      ]);

      if (artRes.status === "fulfilled" && artRes.value?.content && artRes.value.content.length > 0) {
        // Harmonize backend articles with fallback data if needed
        const backendArticles: Article[] = artRes.value.content.map((a: any) => ({
          id: a.articleId || a.id || `ART-${a.slug}`,
          slug: a.slug,
          title: a.title,
          type: a.type || "Research Article",
          topic: a.topic || "Interdisciplinary",
          department: a.department || "Faculty of Health Sciences",
          authors: Array.isArray(a.authors) ? a.authors : (typeof a.authors === "string" ? [a.authors] : ["GB Journal Research Contributor"]),
          abstract: a.abstract || a.abstractText || "",
          issue: a.issueLabel || a.issue || "Issue 2",
          volume: a.volumeLabel || a.volume || "Volume 4",
          pages: a.pages || "1-15",
          doi: a.doi || `10.5555/gbj.2026.${a.slug}`,
          publishedAt: a.publishedAt || "July 2026",
          metrics: {
            views: a.metrics?.views ?? a.views ?? 120,
            downloads: a.metrics?.downloads ?? a.downloads ?? 45,
            citations: a.metrics?.citations ?? a.citations ?? 2,
          },
          keywords: Array.isArray(a.keywords) ? a.keywords : [],
          sections: a.sections || [],
          image: a.image || a.imageUrl || "/covers/medical.png",
          pdf: a.pdf || a.pdfUrl || "",
        }));

        // Merge: keep all backend articles, plus any initial static articles not yet in backend
        const existingSlugs = new Set(backendArticles.map((b) => b.slug));
        const merged = [
          ...backendArticles,
          ...initialArticles.filter((init) => !existingSlugs.has(init.slug)),
        ];
        setArticlesList(merged);
      } else {
        // If backend returned empty or errored, use initialArticles
        setArticlesList(initialArticles);
      }

      if (issRes.status === "fulfilled" && Array.isArray(issRes.value)) {
        setIssuesList(issRes.value);
      }
    } catch (err) {
      console.warn("Using offline publications repository:", err);
      setArticlesList(initialArticles);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, []);

  // Compute available filter options dynamically from data
  const dynamicTopics = useMemo(() => {
    const topicSet = new Set<string>();
    defaultTopics.forEach((t) => topicSet.add(t));
    articlesList.forEach((a) => {
      if (a.topic) topicSet.add(a.topic);
    });
    return Array.from(topicSet).sort();
  }, [articlesList]);

  const dynamicTypes = useMemo(() => {
    const typeSet = new Set<string>();
    defaultArticleTypes.forEach((t) => typeSet.add(t));
    articlesList.forEach((a) => {
      if (a.type) typeSet.add(a.type);
    });
    return Array.from(typeSet).sort();
  }, [articlesList]);

  const dynamicIssues = useMemo(() => {
    const issueMap = new Map<string, string>();
    articlesList.forEach((a) => {
      if (a.issue) {
        const key = `${a.volume ? a.volume + " • " : ""}${a.issue}`;
        issueMap.set(a.issue, key);
      }
    });
    return Array.from(issueMap.entries()).map(([val, label]) => ({
      value: val,
      label,
    }));
  }, [articlesList]);

  const dynamicYears = useMemo(() => {
    const yearSet = new Set<string>();
    articlesList.forEach((a) => {
      const match = a.publishedAt?.match(/\b(20\d{2})\b/);
      if (match) yearSet.add(match[1]);
    });
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [articlesList]);

  // Filter and sort the articles
  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) => {
      // 1. Search Query Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesAbstract = article.abstract?.toLowerCase().includes(q);
        const matchesDoi = article.doi?.toLowerCase().includes(q);
        const matchesId = article.id?.toLowerCase().includes(q);
        const matchesAuthor = article.authors?.some((author) =>
          author.toLowerCase().includes(q)
        );
        const matchesKeyword = article.keywords?.some((kw) =>
          kw.toLowerCase().includes(q)
        );
        const matchesDept = article.department?.toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesAbstract &&
          !matchesDoi &&
          !matchesId &&
          !matchesAuthor &&
          !matchesKeyword &&
          !matchesDept
        ) {
          return false;
        }
      }

      // 2. Type Filter
      if (selectedType !== "all" && article.type !== selectedType) {
        return false;
      }

      // 3. Topic Filter
      if (selectedTopic !== "all" && article.topic !== selectedTopic) {
        return false;
      }

      // 4. Issue Filter
      if (selectedIssue !== "all" && article.issue !== selectedIssue) {
        return false;
      }

      // 5. Year Filter
      if (selectedYear !== "all") {
        if (!article.publishedAt?.includes(selectedYear)) {
          return false;
        }
      }

      // 6. Open Access filter
      if (openAccessOnly) {
        // Articles in GB Journal are open access unless specified
        return true;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "citations") {
        return (b.metrics?.citations || 0) - (a.metrics?.citations || 0);
      }
      if (sortBy === "downloads") {
        return (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0);
      }
      if (sortBy === "views") {
        return (b.metrics?.views || 0) - (a.metrics?.views || 0);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        return (a.id || "").localeCompare(b.id || "");
      }
      // default: newest
      return (b.id || "").localeCompare(a.id || "");
    });
  }, [articlesList, searchQuery, selectedType, selectedTopic, selectedIssue, selectedYear, openAccessOnly, sortBy]);

  // Overall Statistics KPIs
  const stats = useMemo(() => {
    const totalPubs = articlesList.length;
    const totalCitations = articlesList.reduce((acc, a) => acc + (a.metrics?.citations || 0), 0);
    const totalDownloads = articlesList.reduce((acc, a) => acc + (a.metrics?.downloads || 0), 0);
    const totalViews = articlesList.reduce((acc, a) => acc + (a.metrics?.views || 0), 0);

    return { totalPubs, totalCitations, totalDownloads, totalViews };
  }, [articlesList]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedType !== "all") count++;
    if (selectedTopic !== "all") count++;
    if (selectedIssue !== "all") count++;
    if (selectedYear !== "all") count++;
    if (openAccessOnly) count++;
    return count;
  }, [searchQuery, selectedType, selectedTopic, selectedIssue, selectedYear, openAccessOnly]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedTopic("all");
    setSelectedIssue("all");
    setSelectedYear("all");
    setOpenAccessOnly(false);
    setSortBy("newest");
  };

  // Copy DOI handler
  const handleCopyDoi = (doi: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(doi);
    setCopiedDoi(doi);
    toast.success("DOI copied to clipboard", {
      description: doi,
      duration: 2500,
    });
    setTimeout(() => setCopiedDoi(null), 2000);
  };

  // Citation generator string
  const generateCitation = (art: Article, format: "apa" | "harvard" | "vancouver" | "bibtex") => {
    const authorStr = art.authors.join(", ");
    const yearMatch = art.publishedAt?.match(/\b(20\d{2})\b/);
    const pubYear = yearMatch ? yearMatch[1] : "2026";

    switch (format) {
      case "apa":
        return `${authorStr} (${pubYear}). ${art.title}. Gono Bishwabidyalay Journal of Research, ${art.volume?.replace("Volume ", "") || "4"}(${art.issue?.replace("Issue ", "") || "2"}), ${art.pages || "1-15"}. https://doi.org/${art.doi}`;
      case "harvard":
        return `${authorStr}, ${pubYear}. ${art.title}. Gono Bishwabidyalay Journal of Research, ${art.volume || "Vol. 4"}, no. ${art.issue || "2"}, pp.${art.pages || "1-15"}.`;
      case "vancouver":
        return `${authorStr}. ${art.title}. Gono Bishwabidyalay J Res. ${pubYear};${art.volume?.replace("Volume ", "") || "4"}(${art.issue?.replace("Issue ", "") || "2"}):${art.pages || "1-15"}. doi:${art.doi}`;
      case "bibtex":
        return `@article{gbj_${art.slug.replace(/[^a-zA-Z0-9]/g, "_")},
  title={${art.title}},
  author={${art.authors.join(" and ")}},
  journal={Gono Bishwabidyalay Journal of Research},
  volume={${art.volume?.replace("Volume ", "") || "4"}},
  number={${art.issue?.replace("Issue ", "") || "2"}},
  pages={${art.pages || "1-15"}},
  year={${pubYear}},
  doi={${art.doi}}
}`;
    }
  };

  const handleCopyCitation = (art: Article) => {
    const text = generateCitation(art, citationFormat);
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    toast.success(`Citation copied in ${citationFormat.toUpperCase()} format!`);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    try {
      const headers = ["ID", "Title", "Type", "Topic", "Department", "Authors", "Volume", "Issue", "Pages", "DOI", "Published At", "Views", "Downloads", "Citations", "URL"];
      const rows = filteredArticles.map((a) => [
        `"${a.id}"`,
        `"${a.title.replace(/"/g, '""')}"`,
        `"${a.type}"`,
        `"${a.topic}"`,
        `"${a.department || ""}"`,
        `"${a.authors.join("; ")}"`,
        `"${a.volume}"`,
        `"${a.issue}"`,
        `"${a.pages}"`,
        `"${a.doi}"`,
        `"${a.publishedAt}"`,
        a.metrics.views,
        a.metrics.downloads,
        a.metrics.citations,
        `"https://journal.gonobishwabidyalay.edu.bd/articles/${a.slug}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `gb_journal_publications_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Publications catalog exported as CSV!");
    } catch (err: any) {
      toast.error("Export failed", { description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-[color:var(--color-gb-blue)] flex items-center justify-center shadow-xs">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                All Publications Repository
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Comprehensive directory of peer-reviewed articles, scholarly DOIs, and readership analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => loadPublications(true)}
            disabled={isRefreshing}
            title="Refresh database records"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-blue-600")} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Export filtered records as CSV"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/articles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[color:var(--color-gb-blue)] hover:bg-blue-700 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Public Archive</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Metric Badges ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Publications</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalPubs}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Quote className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Citations</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalCitations}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Downloads</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalDownloads.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reads</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Control Center ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Top Filter Row: Search + View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author name, DOI (e.g. 10.5555), abstract keyword, or article ID..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Layout Switcher (Grid vs Table) */}
          <div className="flex items-center gap-1.5 self-end md:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
              title="Dense Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
              title="Card Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* 1. Research Discipline */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Discipline
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Disciplines</option>
              {dynamicTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Article Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Article Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Types</option>
              {dynamicTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Issue & Volume */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Issue / Volume
            </label>
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Issues</option>
              {dynamicIssues.map((iss) => (
                <option key={iss.value} value={iss.value}>
                  {iss.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Publication Year */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Years</option>
              {dynamicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Sort By */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="citations">Most Cited</option>
              <option value="downloads">Most Downloads</option>
              <option value="views">Most Viewed</option>
              <option value="title">Title (A → Z)</option>
            </select>
          </div>

          {/* 6. Open Access Checkbox Pill */}
          <div className="flex flex-col justify-end">
            <button
              onClick={() => setOpenAccessOnly((prev) => !prev)}
              className={cn(
                "h-[35px] flex items-center justify-center gap-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none",
                openAccessOnly
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
            >
              <ShieldCheck className={cn("h-3.5 w-3.5", openAccessOnly ? "text-emerald-600" : "text-slate-400")} />
              <span>Open Access</span>
            </button>
          </div>
        </div>

        {/* Active Filters Bar & Counter */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredArticles.length}</span> of{" "}
              {articlesList.length} publications
            </span>

            {/* Filter Chips */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold">
                <span>Keyword: &ldquo;{searchQuery}&rdquo;</span>
                <button onClick={() => setSearchQuery("")} className="hover:text-blue-900 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedTopic !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                <span>Discipline: {selectedTopic}</span>
                <button onClick={() => setSelectedTopic("all")} className="hover:text-indigo-900 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold">
                <span>Type: {selectedType}</span>
                <button onClick={() => setSelectedType("all")} className="hover:text-amber-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedIssue !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-semibold">
                <span>Issue: {selectedIssue}</span>
                <button onClick={() => setSelectedIssue("all")} className="hover:text-teal-900 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedYear !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                <span>Year: {selectedYear}</span>
                <button onClick={() => setSelectedYear("all")} className="hover:text-slate-900 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {openAccessOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <span>Open Access Only</span>
                <button onClick={() => setOpenAccessOnly(false)} className="hover:text-emerald-900 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* ── Publications Content ── */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching publications found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria, clearing discipline or type filters, or reset the filters to view all published articles.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[color:var(--color-gb-blue)] hover:bg-blue-700 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* ── TABLE VIEW ── */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto overflow-y-visible overscroll-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4 min-w-[320px]">Publication Title & DOI</th>
                  <th className="py-3 px-4 min-w-[200px]">Authors & Department</th>
                  <th className="py-3 px-4 min-w-[150px]">Track & Type</th>
                  <th className="py-3 px-4 min-w-[140px]">Issue / Date</th>
                  <th className="py-3 px-4 min-w-[130px] text-center">Readership</th>
                  <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article, idx) => {
                  return (
                    <tr
                      key={article.id || article.slug}
                      onClick={() => setInspectedArticle(article)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* 1. Index */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* 2. Title & DOI with Cover Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shrink-0 shadow-2xs group-hover:border-blue-300 transition-all">
                            <Image
                              src={getCoverImage(article)}
                              alt={article.title}
                              fill
                              sizes="56px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {article.title}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap text-[11px]">
                              <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                {article.doi}
                              </span>
                              <button
                                onClick={(e) => handleCopyDoi(article.doi, e)}
                                className="text-slate-400 hover:text-blue-600 p-0.5 transition-colors cursor-pointer"
                                title="Copy DOI"
                              >
                                {copiedDoi === article.doi ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                Open Access
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Authors & Dept */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {article.authors.join(", ")}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {article.department || "Academic Faculty"}
                        </p>
                      </td>

                      {/* 4. Track & Type */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-[color:var(--color-gb-blue)] text-[11px] font-bold">
                            {article.topic}
                          </span>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {article.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Issue / Date */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <p className="font-semibold text-slate-800">
                          {article.volume} • {article.issue}
                        </p>
                        <p className="text-slate-500">{article.publishedAt || "July 2026"}</p>
                      </td>

                      {/* 6. Readership Metrics */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/50 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-600" title="Views">
                            <Eye className="h-3 w-3 text-slate-400" />
                            {article.metrics?.views || 0}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600" title="Downloads">
                            <FileDown className="h-3 w-3 text-slate-400" />
                            {article.metrics?.downloads || 0}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-emerald-700" title="Citations">
                            <Quote className="h-3 w-3 text-emerald-500" />
                            {article.metrics?.citations || 0}
                          </span>
                        </div>
                      </td>

                      {/* 7. Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectedArticle(article)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Inspect metadata & citation"
                          >
                            Details
                          </button>

                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Open public article view"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── CARD GRID VIEW ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => {
            return (
              <div
                key={article.id || article.slug}
                onClick={() => setInspectedArticle(article)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 cursor-pointer group"
              >
                <div className="space-y-3">
                  {/* Card Cover Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-200/80 group-hover:border-blue-400 transition-all shadow-2xs">
                    <Image
                      src={getCoverImage(article)}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold shadow-2xs">
                        {article.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="h-3 w-3" />
                        Open Access
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                        {article.topic}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-xs text-slate-600 line-clamp-1 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">{article.authors.join(", ")}</span>
                  </p>

                  {/* Abstract preview */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.abstract || "Published scientific manuscript."}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {article.volume} • {article.issue}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span>{article.doi}</span>
                      <button
                        onClick={(e) => handleCopyDoi(article.doi, e)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="Copy DOI"
                      >
                        {copiedDoi === article.doi ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]" title="Total views">
                      <Eye className="h-3 w-3 text-slate-400" />
                      {article.metrics?.views || 0}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]" title="PDF downloads">
                      <FileDown className="h-3 w-3 text-slate-400" />
                      {article.metrics?.downloads || 0}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700" title="Citations">
                      <Quote className="h-3 w-3 text-emerald-500" />
                      {article.metrics?.citations || 0} citations
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* ── Article Inspection Drawer ── */}
      <CustomDrawer
        isOpen={Boolean(inspectedArticle)}
        onClose={() => setInspectedArticle(null)}
        title={inspectedArticle?.title || "Publication Details"}
        description={
          inspectedArticle
            ? `${inspectedArticle.volume || "Volume 4"} • ${inspectedArticle.issue || "Issue 2"} — DOI: ${inspectedArticle.doi}`
            : "Scholarly record metadata and citation details"
        }
        icon={BookOpen}
        size="xl"
        footer={
          inspectedArticle ? (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setInspectedArticle(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
              <div className="flex items-center gap-2">
                {inspectedArticle.pdf && (
                  <a
                    href={inspectedArticle.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </a>
                )}
                <Link
                  href={`/articles/${inspectedArticle.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <span>Open Public Article</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : null
        }
      >
        {inspectedArticle && (
          <div className="space-y-5 text-left p-1">
            {/* Modal Cover Image Banner */}
            <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xs">
              <Image
                src={getCoverImage(inspectedArticle)}
                alt={inspectedArticle.title}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold shadow-xs">
                  {inspectedArticle.topic}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Open Access Publication
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[color:var(--color-gb-blue)] text-xs font-bold">
                {inspectedArticle.topic}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                {inspectedArticle.type}
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {inspectedArticle.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {inspectedArticle.department || "Academic Department"}
              </p>
            </div>

            {/* Author Attribution */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authors</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {inspectedArticle.authors.join(", ")}
              </p>
            </div>

            {/* Issue, Volume & DOI Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <p className="text-[10px] font-bold uppercase text-slate-400">Volume & Issue</p>
                <p className="font-semibold text-slate-800 mt-0.5">{inspectedArticle.volume} • {inspectedArticle.issue}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <p className="text-[10px] font-bold uppercase text-slate-400">Page Range</p>
                <p className="font-semibold text-slate-800 mt-0.5">{inspectedArticle.pages || "1-15"}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <p className="text-[10px] font-bold uppercase text-slate-400">Published</p>
                <p className="font-semibold text-slate-800 mt-0.5">{inspectedArticle.publishedAt || "July 2026"}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <p className="text-[10px] font-bold uppercase text-slate-400">DOI</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-mono text-[11px] text-slate-700 truncate">{inspectedArticle.doi}</span>
                  <button
                    onClick={() => handleCopyDoi(inspectedArticle.doi)}
                    className="text-slate-400 hover:text-blue-600 shrink-0"
                    title="Copy DOI"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Abstract</p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {inspectedArticle.abstract}
              </p>
            </div>

            {/* Keywords */}
            {inspectedArticle.keywords && inspectedArticle.keywords.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keywords</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {inspectedArticle.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citation Formatter Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Quote className="h-3.5 w-3.5 text-blue-600" />
                  <span>Cite This Publication</span>
                </div>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  {(["apa", "harvard", "vancouver", "bibtex"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setCitationFormat(fmt)}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded uppercase cursor-pointer transition-all",
                        citationFormat === fmt
                          ? "bg-[color:var(--color-gb-blue)] text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 select-all leading-relaxed whitespace-pre-wrap">
                {generateCitation(inspectedArticle, citationFormat)}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleCopyCitation(inspectedArticle)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}
      </CustomDrawer>
    </div>
  );
}
