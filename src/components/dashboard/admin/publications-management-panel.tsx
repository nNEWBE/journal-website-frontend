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
  Copy,
  Check,
  RotateCcw,
  LayoutGrid,
  List,
  Eye,
  FileText,
  FileCheck2,
  Calendar,
  CalendarDays,
  Layers,
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
import { CustomSelect } from "@/components/ui/custom-select";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { KpiStatCard } from "@/components/dashboard/kpi-stat-card";
import { DashboardTableHeader } from "@/components/dashboard/dashboard-table-header";
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

let publicationsCache: {
  articles: Article[];
  issues: IssueData[];
  timestamp: number;
} | null = null;

export function PublicationsManagementPanel() {
  const [articlesList, setArticlesList] = useState<Article[]>(() => publicationsCache?.articles || initialArticles);
  const [issuesList, setIssuesList] = useState<IssueData[]>(() => publicationsCache?.issues || []);
  const [loading, setLoading] = useState<boolean>(!publicationsCache);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "citations" | "downloads" | "views" | "title">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // Selected Article for Detail Inspection Drawer/Modal
  const [inspectedArticle, setInspectedArticle] = useState<Article | null>(null);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<"apa" | "harvard" | "vancouver" | "bibtex">("apa");
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [isMetricsUpdating, setIsMetricsUpdating] = useState<string | null>(null);

  // Fetch publications from API or merge with defaults (with SWR caching)
  const loadPublications = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      publicationsCache = null;
      setIsRefreshing(true);
    } else {
      const hasCache = !!publicationsCache;
      if (hasCache) {
        setArticlesList(publicationsCache!.articles);
        setIssuesList(publicationsCache!.issues);
        setLoading(false);
        if (Date.now() - publicationsCache!.timestamp < 60000) {
          return;
        }
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
    }

    try {
      // 1. Fetch articles from backend API (bypass cache if manual refresh)
      const fetchOptions: RequestInit = isManualRefresh
        ? { cache: "no-store", headers: { "Cache-Control": "no-cache" } }
        : {};

      const [artRes, issRes] = await Promise.allSettled([
        articlesApi.list({ size: 100 }, fetchOptions),
        issuesApi.list(fetchOptions),
      ]);

      let finalArticles = initialArticles;
      let finalIssues: IssueData[] = [];

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
            views: Number(a.metrics?.views ?? a.views ?? 0),
            downloads: Number(a.metrics?.downloads ?? a.downloads ?? 0),
            citations: Number(a.metrics?.citations ?? a.citations ?? 0),
          },
          keywords: Array.isArray(a.keywords) ? a.keywords : [],
          sections: a.sections || [],
          image: a.image || a.imageUrl || "/covers/medical.png",
          pdf: a.pdf || a.pdfUrl || "",
        }));

        finalArticles = backendArticles;
        setArticlesList(finalArticles);
      } else if (!publicationsCache) {
        setArticlesList(initialArticles);
      }

      if (issRes.status === "fulfilled" && Array.isArray(issRes.value)) {
        finalIssues = issRes.value;
        setIssuesList(finalIssues);
      }

      publicationsCache = {
        articles: finalArticles,
        issues: finalIssues,
        timestamp: Date.now(),
      };

      if (isManualRefresh) {
        toast.success("Publications repository refreshed from database");
      }
    } catch (err) {
      console.warn("Using offline publications repository:", err);
      if (!publicationsCache) {
        setArticlesList(initialArticles);
      }
      if (isManualRefresh) {
        toast.error("Failed to refresh publications repository");
      }
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

  // Options for CustomSelect filters
  const topicOptions = useMemo(
    () => [
      { value: "all", label: "All Disciplines" },
      ...dynamicTopics.map((t) => ({ value: t, label: t })),
    ],
    [dynamicTopics]
  );

  const typeOptions = useMemo(
    () => [
      { value: "all", label: "All Types" },
      ...dynamicTypes.map((t) => ({ value: t, label: t })),
    ],
    [dynamicTypes]
  );

  const issueOptions = useMemo(
    () => [
      { value: "all", label: "All Issues" },
      ...dynamicIssues,
    ],
    [dynamicIssues]
  );

  const yearOptions = useMemo(
    () => [
      { value: "all", label: "All Years" },
      ...dynamicYears.map((yr) => ({ value: yr, label: yr })),
    ],
    [dynamicYears]
  );

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "citations", label: "Most Cited" },
    { value: "downloads", label: "Most Downloads" },
    { value: "views", label: "Most Viewed" },
    { value: "title", label: "Title (A → Z)" },
  ];

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
  }, [articlesList, searchQuery, selectedType, selectedTopic, selectedIssue, selectedYear, sortBy]);

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
    return count;
  }, [searchQuery, selectedType, selectedTopic, selectedIssue, selectedYear]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedTopic("all");
    setSelectedIssue("all");
    setSelectedYear("all");
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

  // Readership telemetry handlers
  const handleResetMetrics = async (slug: string) => {
    try {
      setIsMetricsUpdating(slug);
      await articlesApi.resetMetrics(slug);
      setArticlesList((prev) =>
        prev.map((a) =>
          a.slug === slug
            ? { ...a, metrics: { views: 0, downloads: 0, citations: 0 } }
            : a
        )
      );
      if (inspectedArticle?.slug === slug) {
        setInspectedArticle((prev) =>
          prev ? { ...prev, metrics: { views: 0, downloads: 0, citations: 0 } } : null
        );
      }
      publicationsCache = null;
      toast.success("Readership metrics reset to 0 for this publication");
    } catch (err: any) {
      toast.error("Failed to reset metrics", { description: err?.message });
    } finally {
      setIsMetricsUpdating(null);
    }
  };

  const handleResetAllMetrics = async () => {
    try {
      setIsMetricsUpdating("all");
      await articlesApi.resetAllMetrics();
      setArticlesList((prev) =>
        prev.map((a) => ({
          ...a,
          metrics: { views: 0, downloads: 0, citations: 0 },
        }))
      );
      if (inspectedArticle) {
        setInspectedArticle((prev) =>
          prev ? { ...prev, metrics: { views: 0, downloads: 0, citations: 0 } } : null
        );
      }
      publicationsCache = null;
      toast.success("All publication metrics successfully reset to 0!");
    } catch (err: any) {
      toast.error("Failed to reset all metrics", { description: err?.message });
    } finally {
      setIsMetricsUpdating(null);
    }
  };

  const handleSimulateView = async (slug: string) => {
    try {
      setIsMetricsUpdating(slug);
      await articlesApi.trackView(slug);
      setArticlesList((prev) =>
        prev.map((a) =>
          a.slug === slug
            ? {
              ...a,
              metrics: {
                ...a.metrics,
                views: (a.metrics?.views || 0) + 1,
              },
            }
            : a
        )
      );
      if (inspectedArticle?.slug === slug) {
        setInspectedArticle((prev) =>
          prev
            ? {
              ...prev,
              metrics: {
                ...prev.metrics,
                views: (prev.metrics?.views || 0) + 1,
              },
            }
            : null
        );
      }
      publicationsCache = null;
      toast.success("Telemetry test: +1 View recorded in live database");
    } catch (err: any) {
      toast.error("Failed to record view", { description: err?.message });
    } finally {
      setIsMetricsUpdating(null);
    }
  };

  const handleSimulateDownload = async (slug: string) => {
    try {
      setIsMetricsUpdating(slug);
      await articlesApi.trackDownload(slug);
      setArticlesList((prev) =>
        prev.map((a) =>
          a.slug === slug
            ? {
              ...a,
              metrics: {
                ...a.metrics,
                downloads: (a.metrics?.downloads || 0) + 1,
              },
            }
            : a
        )
      );
      if (inspectedArticle?.slug === slug) {
        setInspectedArticle((prev) =>
          prev
            ? {
              ...prev,
              metrics: {
                ...prev.metrics,
                downloads: (prev.metrics?.downloads || 0) + 1,
              },
            }
            : null
        );
      }
      publicationsCache = null;
      toast.success("Telemetry test: +1 PDF Download recorded in live database");
    } catch (err: any) {
      toast.error("Failed to record download", { description: err?.message });
    } finally {
      setIsMetricsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Actions ── */}
      <DashboardHeaderActions>
        <button
          type="button"
          onClick={() => loadPublications(true)}
          disabled={isRefreshing}
          title="Refresh database records"
          className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RotateCcw className={cn("h-3.5 w-3.5 text-slate-500", isRefreshing && "animate-spin text-blue-600")} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>

        <button
          type="button"
          onClick={handleExportCSV}
          title="Export filtered records as CSV"
          className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-white bg-gb-blue hover:bg-gb-blue-dark border border-gb-blue rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-white" />
          <span>Export CSV</span>
        </button>
      </DashboardHeaderActions>

      {/* ── KPI Metric Badges ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiStatCard
          label="Total Publications"
          value={stats.totalPubs}
          icon={FileText}
          accent="blue"
          isLoading={loading}
        />
        <KpiStatCard
          label="Total Citations"
          value={stats.totalCitations}
          icon={Quote}
          accent="emerald"
          isLoading={loading}
        />
        <KpiStatCard
          label="Full Downloads"
          value={stats.totalDownloads}
          icon={FileDown}
          accent="amber"
          isLoading={loading}
        />
        <KpiStatCard
          label="Total Reads"
          value={stats.totalViews}
          icon={Eye}
          accent="indigo"
          isLoading={loading}
        />
      </div>

      {/* ── Filter Dropdowns Center ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3">
        {/* Filter Dropdowns Row using CustomSelect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* 1. Research Discipline */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Discipline
            </label>
            <CustomSelect
              options={topicOptions}
              value={selectedTopic}
              onChange={setSelectedTopic}
              size="form"
              className="w-full"
            />
          </div>

          {/* 2. Article Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Article Type
            </label>
            <CustomSelect
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
              size="form"
              className="w-full"
            />
          </div>

          {/* 3. Issue & Volume */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Issue / Volume
            </label>
            <CustomSelect
              options={issueOptions}
              value={selectedIssue}
              onChange={setSelectedIssue}
              size="form"
              className="w-full"
            />
          </div>

          {/* 4. Publication Year */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Year
            </label>
            <CustomSelect
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              size="form"
              className="w-full"
            />
          </div>

          {/* 5. Sort By */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <CustomSelect
              options={sortOptions}
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              size="form"
              className="w-full"
            />
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
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedTopic !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                <span>Discipline: {selectedTopic}</span>
                <button
                  type="button"
                  onClick={() => setSelectedTopic("all")}
                  className="hover:text-indigo-900 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold">
                <span>Type: {selectedType}</span>
                <button
                  type="button"
                  onClick={() => setSelectedType("all")}
                  className="hover:text-amber-950 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedIssue !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-semibold">
                <span>Issue: {selectedIssue}</span>
                <button
                  type="button"
                  onClick={() => setSelectedIssue("all")}
                  className="hover:text-teal-900 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedYear !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                <span>Year: {selectedYear}</span>
                <button
                  type="button"
                  onClick={() => setSelectedYear("all")}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* ── Main Publications Section Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table / Grid Header Controls */}
        <DashboardTableHeader
          icon={BookMarked}
          title="Published Manuscripts"
          totalCount={filteredArticles.length}
          subtitle="double-blind peer review"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search title, author, DOI..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content Body */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching publications found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search criteria, clearing discipline or type filters, or reset the filters to view all published articles.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gb-blue hover:bg-blue-700 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* ── TABLE VIEW ── */

          <div className="overflow-x-auto overflow-y-visible overscroll-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4 min-w-75">Publication Title & DOI</th>
                  <th className="py-3 px-4 min-w-50">Authors & Department</th>
                  <th className="py-3 px-4 min-w-40">Track & Type</th>
                  <th className="py-3 px-4 min-w-30">Issue / Date</th>
                  <th className="py-3 px-4 min-w-50 text-center">Readership & Impact</th>
                  <th className="py-3 px-4 text-right min-w-30">Actions</th>
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
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-gb-blue text-[11px] font-bold">
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
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Views Pill */}
                          <div
                            className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/70 text-blue-700 transition-colors cursor-default"
                            title={`${article.metrics?.views || 0} Total Article Views`}
                          >
                            <Eye className="h-3 w-3 text-blue-500 shrink-0" />
                            <span className="font-mono text-[11px] font-bold">
                              {(article.metrics?.views || 0).toLocaleString()}
                            </span>
                            <span className="text-[9px] font-semibold text-blue-500 uppercase">reads</span>
                          </div>

                          {/* Downloads Pill */}
                          <div
                            className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/70 text-emerald-700 transition-colors cursor-default"
                            title={`${article.metrics?.downloads || 0} Full PDF Downloads`}
                          >
                            <FileDown className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span className="font-mono text-[11px] font-bold">
                              {(article.metrics?.downloads || 0).toLocaleString()}
                            </span>
                            <span className="text-[9px] font-semibold text-emerald-500 uppercase">pdf</span>
                          </div>

                          {/* Citations Pill */}
                          <div
                            className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg bg-purple-50/90 hover:bg-purple-100/90 border border-purple-200/70 text-purple-700 transition-colors cursor-default"
                            title={`${article.metrics?.citations || 0} Academic Citations`}
                          >
                            <Quote className="h-3 w-3 text-purple-500 shrink-0" />
                            <span className="font-mono text-[11px] font-bold">
                              {(article.metrics?.citations || 0).toLocaleString()}
                            </span>
                            <span className="text-[9px] font-semibold text-purple-500 uppercase">cites</span>
                          </div>
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
        ) : (
          /* ── EDITORIAL CARD VIEW (2 SIDE BY SIDE) ── */
          <div className="p-4 sm:p-5 bg-slate-50/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((article) => {
            const imageUrl = getCoverImage(article);
            return (
              <article
                key={article.id || article.slug}
                onClick={() => setInspectedArticle(article)}
                className="bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[135px_1fr] lg:grid-cols-[145px_1fr] gap-3.5 sm:gap-4 items-start">
                  {/* Article Image Container */}
                  <div className="relative aspect-4/3 sm:aspect-3/4 w-full overflow-hidden bg-slate-950 border border-slate-200/80 shrink-0 block">
                    <Image
                      src={imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 639px) 100vw, 145px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 right-2 inline-block bg-slate-900/90 text-white px-2 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider truncate">
                      {article.topic}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between h-full min-w-0">
                    <div>
                      {/* Type Badge & Date */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1e40af] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider border border-blue-100">
                          <FileText className="h-3 w-3" />
                          {article.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-slate-500">
                          <CalendarDays className="h-3 w-3 text-slate-400" />
                          {article.publishedAt || "January 2026"}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="mt-1.5 font-academic text-[15px] sm:text-base font-medium leading-snug text-slate-950 group-hover:text-[#1e40af] transition-colors line-clamp-2">
                        {article.title}
                      </h2>

                      {/* Authors */}
                      <p className="mt-1 text-xs font-semibold text-slate-600 truncate">
                        {article.authors.join(", ")}
                      </p>

                      {/* Abstract Preview */}
                      {article.abstract && (
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                          {article.abstract}
                        </p>
                      )}
                    </div>

                    {/* Footer: Metrics & Read Full Article */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 text-[10px] sm:text-[10.5px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {(article.metrics?.views || 0).toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3 text-slate-400" />
                          {(article.metrics?.downloads || 0).toLocaleString()} pdfs
                        </span>
                      </div>

                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Read ${article.title}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline shrink-0"
                      >
                        <span>Read Full Article</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
            </div>
          </div>
        )}
      </div>
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
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
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
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
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-gb-blue text-xs font-bold">
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

            {/* Readership & Live Telemetry Section */}
            <div className="p-4 bg-linear-to-br from-slate-900 via-slate-850 to-slate-950 rounded-2xl text-white shadow-md border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live Readership & Impact Telemetry
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Active Supabase Telemetry
                </span>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-blue-300">
                    <span className="text-[11px] font-semibold">Article Reads</span>
                    <Eye className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <p className="font-mono text-xl sm:text-2xl font-black mt-2 text-white">
                    {(inspectedArticle.metrics?.views || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Starts from 0</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="text-[11px] font-semibold">PDF Downloads</span>
                    <FileDown className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="font-mono text-xl sm:text-2xl font-black mt-2 text-white">
                    {(inspectedArticle.metrics?.downloads || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click tracked</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-purple-300">
                    <span className="text-[11px] font-semibold">Citations</span>
                    <Quote className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <p className="font-mono text-xl sm:text-2xl font-black mt-2 text-white">
                    {(inspectedArticle.metrics?.citations || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Academic impact</p>
                </div>
              </div>

              {/* Telemetry Actions (Test Increment / Reset) */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateView(inspectedArticle.slug)}
                    disabled={isMetricsUpdating === inspectedArticle.slug}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Simulate +1 view"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>+1 View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateDownload(inspectedArticle.slug)}
                    disabled={isMetricsUpdating === inspectedArticle.slug}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Simulate +1 download"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>+1 Download</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleResetMetrics(inspectedArticle.slug)}
                  disabled={isMetricsUpdating === inspectedArticle.slug}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  title="Reset metrics for this publication to 0"
                >
                  <RotateCcw className={cn("h-3.5 w-3.5", isMetricsUpdating === inspectedArticle.slug && "animate-spin")} />
                  <span>Reset to 0</span>
                </button>
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Abstract</p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 wrap-break-word break-all">
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
                          ? "bg-gb-blue text-white shadow-xs"
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
