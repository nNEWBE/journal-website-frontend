"use client";

import React, { useState, useEffect, useMemo, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
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
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { articles as initialArticles, articleTypes as defaultArticleTypes, topics as defaultTopics, Article } from "@/lib/data";
import { articlesApi, issuesApi, IssueData } from "@/lib/api";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomSelect, formatEnumToTitleCase } from "@/components/ui/custom-select";
import { ActiveFilterBar, type ActiveFilterChip } from "@/components/dashboard/active-filter-bar";
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

function PublicationActionsDropdown({
  article,
  onInspect,
  onCopyDoi,
}: {
  article: Article;
  onInspect: (article: Article) => void;
  onCopyDoi: (doi: string, e: React.MouseEvent) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 224;
      const menuHeight = 190;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < menuHeight + 20 && rect.top > menuHeight;

      const left = Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth));
      const top = openUp
        ? Math.max(8, rect.top - menuHeight - 6)
        : Math.min(window.innerHeight - menuHeight - 8, rect.bottom + 6);

      setMenuCoords({ top, left });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
          isOpen && "bg-slate-100 text-slate-700 ring-2 ring-slate-200"
        )}
        title="Publication Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Transparent backdrop to capture outside clicks */}
            <div
              className="fixed inset-0 z-9998 bg-black/5"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              onContextMenu={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            {/* Menu Container */}
            <div
              style={{
                position: "fixed",
                top: `${menuCoords.top}px`,
                left: `${menuCoords.left}px`,
                zIndex: 9999,
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-56 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-100 text-left font-sans"
            >
              {/* Header inside menu showing publication identity */}
              <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-slate-100 mb-1">
                <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-xs">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                    {article.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono truncate leading-tight mt-0.5">
                    {article.doi}
                  </p>
                </div>
              </div>

              {/* View Details */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onInspect(article);
                }}
                className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
              >
                <Eye className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>View Details</span>
              </button>

              {/* Open Public Article */}
              <Link
                href={`/articles/${article.slug}`}
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
              >
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>Open Public Article</span>
              </Link>

              {/* Copy DOI */}
              <button
                type="button"
                disabled={!article.doi}
                onClick={(e) => {
                  setIsOpen(false);
                  onCopyDoi(article.doi, e);
                }}
                className={cn(
                  "group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors text-left",
                  article.doi
                    ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 cursor-pointer"
                    : "text-slate-400 cursor-not-allowed opacity-60"
                )}
              >
                <Copy className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>{article.doi ? "Copy DOI" : "DOI Pending"}</span>
              </button>

              {/* Download PDF */}
              {article.pdf && (
                <>
                  <div className="my-1 border-t border-slate-100" />
                  <a
                    href={article.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <Download className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                    <span>Download PDF</span>
                  </a>
                </>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
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
          issue: a.issueLabel || a.issue || "",
          volume: a.volumeLabel || a.volume || "",
          pages: a.pages || "",
          doi: a.doi || "",
          publishedAt: a.publishedAt || "",
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

  const publicationChips = useMemo(() => {
    const list: ActiveFilterChip[] = [];
    if (searchQuery.trim()) {
      list.push({
        id: "search",
        label: `Keyword: "${searchQuery.trim()}"`,
        colorClass: "bg-blue-50 text-blue-700",
        onRemove: () => setSearchQuery(""),
      });
    }
    if (selectedTopic !== "all") {
      list.push({
        id: "topic",
        label: `Discipline: ${formatEnumToTitleCase(selectedTopic)}`,
        colorClass: "bg-indigo-50 text-indigo-700",
        onRemove: () => setSelectedTopic("all"),
      });
    }
    if (selectedType !== "all") {
      list.push({
        id: "type",
        label: `Type: ${formatEnumToTitleCase(selectedType)}`,
        colorClass: "bg-amber-50 text-amber-800",
        onRemove: () => setSelectedType("all"),
      });
    }
    if (selectedIssue !== "all") {
      const issueLabel = dynamicIssues.find((i) => i.value === selectedIssue)?.label || selectedIssue;
      list.push({
        id: "issue",
        label: `Issue: ${issueLabel}`,
        colorClass: "bg-teal-50 text-teal-700",
        onRemove: () => setSelectedIssue("all"),
      });
    }
    if (selectedYear !== "all") {
      list.push({
        id: "year",
        label: `Year: ${selectedYear}`,
        colorClass: "bg-slate-100 text-slate-700",
        onRemove: () => setSelectedYear("all"),
      });
    }
    if (sortBy !== "newest") {
      const sortLabel = sortOptions.find((s) => s.value === sortBy)?.label || sortBy;
      list.push({
        id: "sort",
        label: `Sort: ${sortLabel}`,
        colorClass: "bg-purple-50 text-purple-700",
        onRemove: () => setSortBy("newest"),
      });
    }
    return list;
  }, [searchQuery, selectedTopic, selectedType, selectedIssue, selectedYear, sortBy, dynamicIssues]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedTopic("all");
    setSelectedIssue("all");
    setSelectedYear("all");
    setSortBy("newest");
  };

  // Copy DOI handler
  const handleCopyDoi = (doi?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!doi || !doi.trim()) {
      toast.info("DOI Pending", {
        description: "Official DOI has not yet been minted for this publication.",
      });
      return;
    }
    navigator.clipboard.writeText(doi);
    setCopiedDoi(doi);
    toast.success("DOI copied to clipboard", {
      description: doi,
      duration: 2500,
    });
    setTimeout(() => setCopiedDoi(null), 2000);
  };

  // Citation generator string with standard In-Press / Advance Online Publication support
  const generateCitation = (art: Article, format: "apa" | "harvard" | "vancouver" | "bibtex") => {
    const authorStr = art.authors && art.authors.length > 0 ? art.authors.join(", ") : "GB Journal Contributor";
    const yearMatch = art.publishedAt?.match(/\b(20\d{2})\b/);
    const pubYear = yearMatch ? yearMatch[1] : "2026";

    const volNum = art.volume?.replace(/[^0-9]/g, "");
    const issueNum = art.issue?.replace(/[^0-9]/g, "");
    const hasIssueInfo = !!(volNum && issueNum);
    const pagesStr = art.pages?.trim();
    const doiClean = art.doi?.trim();
    const doiUrl = doiClean ? (doiClean.startsWith("http") ? doiClean : `https://doi.org/${doiClean}`) : "";

    switch (format) {
      case "apa":
        if (hasIssueInfo && pagesStr) {
          return `${authorStr} (${pubYear}). ${art.title}. Gono Bishwabidyalay Journal of Research, ${volNum}(${issueNum}), ${pagesStr}.${doiUrl ? ` ${doiUrl}` : ""}`;
        }
        return `${authorStr} (${pubYear}). ${art.title}. Gono Bishwabidyalay Journal of Research. Advance online publication.${doiUrl ? ` ${doiUrl}` : ""}`;

      case "harvard":
        if (hasIssueInfo && pagesStr) {
          return `${authorStr}, ${pubYear}. ${art.title}. Gono Bishwabidyalay Journal of Research, ${art.volume || `Vol. ${volNum}`}, no. ${art.issue || issueNum}, pp.${pagesStr}.`;
        }
        return `${authorStr}, ${pubYear}. ${art.title}. Gono Bishwabidyalay Journal of Research (in press).`;

      case "vancouver":
        if (hasIssueInfo && pagesStr) {
          return `${authorStr}. ${art.title}. Gono Bishwabidyalay J Res. ${pubYear};${volNum}(${issueNum}):${pagesStr}.${doiClean ? ` doi:${doiClean}` : ""}`;
        }
        return `${authorStr}. ${art.title}. Gono Bishwabidyalay J Res. [Epub ahead of print].${doiClean ? ` doi:${doiClean}` : ""}`;

      case "bibtex":
        return `@article{gbj_${(art.slug || art.id).replace(/[^a-zA-Z0-9]/g, "_")},
  title={${art.title}},
  author={${(art.authors || []).join(" and ")}},
  journal={Gono Bishwabidyalay Journal of Research},
  ${hasIssueInfo ? `volume={${volNum}},\n  number={${issueNum}},` : `note={Advance Online Publication / In Press},`}
  ${pagesStr ? `pages={${pagesStr}},` : ""}
  year={${pubYear}}${doiClean ? `,\n  doi={${doiClean}}` : ""}
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

        {/* Active Filters Bar & Counter using standard ActiveFilterBar */}
        <ActiveFilterBar
          totalCount={articlesList.length}
          filteredCount={filteredArticles.length}
          itemLabel="publications"
          chips={publicationChips}
          onResetAll={resetFilters}
        />
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
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                  <th className="py-3 px-4 w-12 text-slate-400 font-mono text-[11px]">#</th>
                  <th className="py-3 px-4 min-w-70">Publication</th>
                  <th className="py-3 px-4 min-w-40">Authors</th>
                  <th className="py-3 px-4 min-w-32">Track & Type</th>
                  <th className="py-3 px-4 min-w-36">Issue / Date</th>
                  <th className="py-3 px-4 text-right w-16">Actions</th>
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
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] w-12">
                        {idx + 1}
                      </td>

                      {/* 2. Publication Title & DOI */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-200/80 shrink-0 shadow-2xs group-hover:border-blue-300 transition-all">
                            <Image
                              src={getCoverImage(article)}
                              alt={article.title}
                              fill
                              sizes="40px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug text-xs">
                              {article.title}
                            </p>
                            {article.doi ? (
                              <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                                {article.doi}
                              </p>
                            ) : (
                              <p className="font-sans text-[10px] text-amber-600 font-medium mt-0.5">
                                DOI Pending
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3. Authors */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-700 line-clamp-1 text-xs">
                          {article.authors.join(", ")}
                        </p>
                      </td>

                      {/* 4. Track & Type */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 text-xs">
                          {article.topic}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {article.type}
                        </p>
                      </td>

                      {/* 5. Issue / Date */}
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                        <p className="font-medium text-slate-800 whitespace-nowrap">
                          {article.volume && article.issue ? (
                            `${article.volume} • ${article.issue}`
                          ) : article.volume || article.issue ? (
                            article.volume || article.issue
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
                              In Press / Online First
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">
                          {article.publishedAt || "Recently Published"}
                        </p>
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <PublicationActionsDropdown
                          article={article}
                          onInspect={() => setInspectedArticle(article)}
                          onCopyDoi={(doi, e) => handleCopyDoi(doi, e)}
                        />
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
        title="Publication Overview"
        description={
          inspectedArticle
            ? `${inspectedArticle.volume || "Volume 4"} • ${inspectedArticle.issue || "Issue 2"} • Published ${inspectedArticle.publishedAt || "July 2026"}`
            : "Scholarly record metadata and citation details"
        }
        badge={
          inspectedArticle ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Open Access
            </span>
          ) : null
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b1b3d] hover:bg-[#162c60] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
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
          <div className="space-y-5 text-left p-0.5">
            {/* 1. Article Hero Showcase Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-linear-to-br from-slate-50/80 via-white to-slate-50/40 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                {/* Book Cover Thumbnail */}
                <div className="relative w-24 sm:w-28 aspect-3/4 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-md shrink-0">
                  <Image
                    src={getCoverImage(inspectedArticle)}
                    alt={inspectedArticle.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 inline-block bg-slate-900/90 text-white px-1.5 py-0.5 text-center text-[8.5px] font-bold uppercase tracking-wider truncate rounded">
                    {inspectedArticle.topic}
                  </span>
                </div>

                {/* Article Header Details */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-gb-blue text-xs font-bold border border-blue-100">
                      <FileText className="h-3 w-3" />
                      {inspectedArticle.type}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      Open Access
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight font-academic">
                    {inspectedArticle.title}
                  </h2>

                  <div className="pt-0.5 space-y-1">
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{inspectedArticle.authors.join(", ")}</span>
                    </p>
                    {inspectedArticle.department && (
                      <p className="text-[11px] text-slate-500 pl-5">
                        {inspectedArticle.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Metadata Grid (Clean 4-col card) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Volume & Issue */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-slate-400" />
                    Issue
                  </p>
                  <p className="font-semibold text-slate-800 whitespace-nowrap">
                    {inspectedArticle.volume && inspectedArticle.issue ? (
                      `${inspectedArticle.volume} • ${inspectedArticle.issue}`
                    ) : inspectedArticle.volume || inspectedArticle.issue ? (
                      inspectedArticle.volume || inspectedArticle.issue
                    ) : (
                      <span className="text-amber-700 font-medium text-[11px]">In Press (Ahead of Issue)</span>
                    )}
                  </p>
                </div>

                {/* Published Date */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Published
                  </p>
                  <p className="font-semibold text-slate-800 whitespace-nowrap">
                    {inspectedArticle.publishedAt || "Recently Published"}
                  </p>
                </div>

                {/* Page Range */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-slate-400" />
                    Pages
                  </p>
                  <p className="font-semibold text-slate-800 whitespace-nowrap">
                    {inspectedArticle.pages?.trim() ? (
                      inspectedArticle.pages
                    ) : (
                      <span className="text-amber-700 font-medium text-[11px]">In Press (Unpaginated)</span>
                    )}
                  </p>
                </div>

                {/* DOI */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-slate-400" />
                      DOI
                    </span>
                    {inspectedArticle.doi && (
                      <button
                        type="button"
                        onClick={() => handleCopyDoi(inspectedArticle.doi)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-[10px] cursor-pointer flex items-center gap-0.5"
                        title="Copy DOI"
                      >
                        {copiedDoi === inspectedArticle.doi ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </p>
                  {inspectedArticle.doi ? (
                    <p className="font-mono text-[11px] font-semibold text-slate-800 truncate" title={inspectedArticle.doi}>
                      {inspectedArticle.doi}
                    </p>
                  ) : (
                    <p className="font-sans text-[11px] text-amber-600 font-medium italic">
                      Pending Assignment
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Readership & Academic Impact (Premium Academic Card) */}
            <div className="rounded-2xl border border-slate-200/90 bg-linear-to-br from-white via-slate-50/40 to-blue-50/20 p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Readership & Live Impact Telemetry
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  Active Telemetry
                </span>
              </div>

              {/* 3 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Views */}
                <div className="bg-white rounded-xl p-3.5 border border-blue-100 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-blue-700">
                    <span className="text-xs font-bold text-slate-600">Total Reads</span>
                    <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Eye className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="font-mono text-2xl font-black mt-2 text-slate-900">
                    {(inspectedArticle.metrics?.views || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Global readers</p>
                </div>

                {/* PDF Downloads */}
                <div className="bg-white rounded-xl p-3.5 border border-emerald-100 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="text-xs font-bold text-slate-600">PDF Downloads</span>
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <FileDown className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="font-mono text-2xl font-black mt-2 text-slate-900">
                    {(inspectedArticle.metrics?.downloads || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Direct downloads</p>
                </div>

                {/* Citations */}
                <div className="bg-white rounded-xl p-3.5 border border-purple-100 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-purple-700">
                    <span className="text-xs font-bold text-slate-600">Citations</span>
                    <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Quote className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="font-mono text-2xl font-black mt-2 text-slate-900">
                    {(inspectedArticle.metrics?.citations || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Scholarly citations</p>
                </div>
              </div>

              {/* Simulation Toolbar for Admin testing */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateView(inspectedArticle.slug)}
                    disabled={isMetricsUpdating === inspectedArticle.slug}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    title="Simulate +1 view"
                  >
                    <Eye className="h-3 w-3" />
                    <span>+1 Read</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateDownload(inspectedArticle.slug)}
                    disabled={isMetricsUpdating === inspectedArticle.slug}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    title="Simulate +1 download"
                  >
                    <FileDown className="h-3 w-3" />
                    <span>+1 PDF</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleResetMetrics(inspectedArticle.slug)}
                  disabled={isMetricsUpdating === inspectedArticle.slug}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  title="Reset metrics for this publication to 0"
                >
                  <RotateCcw className={cn("h-3 w-3", isMetricsUpdating === inspectedArticle.slug && "animate-spin")} />
                  <span>Reset</span>
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
