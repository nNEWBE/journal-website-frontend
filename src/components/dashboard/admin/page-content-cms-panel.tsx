"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  BookOpen,
  PenLine,
  Shield,
  Megaphone,
  Phone,
  Layers,
  Save,
  Search,
  AlertCircle,
  HelpCircle,
  Home as HomeIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  BookmarkCheck,
  Library,
  ArrowUp,
  ArrowDown,
  Check,
  Image as ImageIcon,
  X,
  Sliders,
  Tag,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { contentApi, articlesApi, type PageContentDTO } from "@/lib/api";
import { articles as initialArticles, type Article } from "@/lib/data";
import { AcademicDataLoader } from "@/components/ui/loader";
import { CustomModal } from "@/components/ui/modal";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { CustomSelect } from "@/components/ui/custom-select";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { DashboardSearchFilterBar } from "@/components/dashboard/dashboard-search-bar";
import { cn } from "@/lib/utils";

// Core seeded sections that should never be permanently deleted; only selected or unselected
const CORE_SECTION_KEYS = new Set([
  "hero-main",
  "latest-research",
  "current-issue",
  "most-read",
  "explore-topics",
  "featured-journals",
  "call-for-papers",
  "research-community",
  "home-faq",
  "journal-stats",
  "scope-tracks",
  "overview",
  "mission",
  "aims-scope",
  "indexing",
  "guidelines",
  "submission-checklist",
  "apc-waiver",
  "peer-review",
  "ethics-plagiarism",
  "open-access",
  "office-info",
  "governance-charter",
  "advisory-council",
  "peer-review-protocol",
  "reviewer-benefits",
]);

const PAGE_TABS = [
  {
    id: "home",
    label: "Home Page",
    route: "/",
    icon: HomeIcon,
    description: "Hero showcase, call for papers banner, turnaround metrics, and research tracks.",
    color: "amber",
  },
  {
    id: "about",
    label: "About Journal",
    route: "/about",
    icon: BookOpen,
    description: "Overview, mission, indexing criteria, and aims & scope.",
    color: "blue",
  },
  {
    id: "editorial-board",
    label: "Editorial Board",
    route: "/editorial-board",
    icon: Users,
    description: "Academic leadership, section editors, governance charter, and advisory council.",
    color: "indigo",
  },
  {
    id: "authors",
    label: "Author Guidelines",
    route: "/authors",
    icon: PenLine,
    description: "Manuscript preparation, submission checklist, templates, and APC policy.",
    color: "sky",
  },
  {
    id: "reviewers",
    label: "Reviewer Guidelines",
    route: "/reviewers",
    icon: CheckCircle2,
    description: "Peer review protocol, evaluation rubrics, reviewer ethics, and academic recognition.",
    color: "teal",
  },
  {
    id: "policies",
    label: "Policies & Ethics",
    route: "/policies",
    icon: Shield,
    description: "Peer review framework, anti-plagiarism screening, COPE compliance, and open access.",
    color: "purple",
  },
  {
    id: "issues",
    label: "Issues Archive",
    route: "/issues",
    icon: Layers,
    description: "Current volume, published archives, biannual issue catalog, and table of contents.",
    color: "rose",
  },
  {
    id: "articles",
    label: "Articles & Papers",
    route: "/articles",
    icon: FileText,
    description: "Searchable manuscript directory, indexing metrics, PDF downloads, and DOI links.",
    color: "cyan",
  },
  {
    id: "contact",
    label: "Contact Office",
    route: "/contact",
    icon: Phone,
    description: "Editorial secretariat, physical office location, help desk, and inquiry emails.",
    color: "emerald",
  },
];

const cmsCache: Record<string, { data: PageContentDTO[]; timestamp: number }> = {};

export function PageContentCMSPanel() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sections, setSections] = useState<PageContentDTO[]>(() => cmsCache["home"]?.data || []);
  const [loading, setLoading] = useState<boolean>(!cmsCache["home"]?.data || cmsCache["home"].data.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Horizontal scroll tabs state
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateTabsScroll = () => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsContainerRef.current) return;
    const offset = 260;
    tabsContainerRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const timer = setTimeout(updateTabsScroll, 100);
    window.addEventListener("resize", updateTabsScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTabsScroll);
    };
  }, []);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<PageContentDTO | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Preview & Confirm Modals
  const [previewSection, setPreviewSection] = useState<PageContentDTO | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<PageContentDTO | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Form fields
  const [formPageKey, setFormPageKey] = useState<string>("about");
  const [formSectionKey, setFormSectionKey] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSubtitle, setFormSubtitle] = useState<string>("");
  const [formContent, setFormContent] = useState<string>("");
  const [formMetaJson, setFormMetaJson] = useState<string>("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formPublished, setFormPublished] = useState<boolean>(true);

  // Publications repository integration for homepage carousel
  const [allArticles, setAllArticles] = useState<Article[]>(initialArticles);
  const [articleSearch, setArticleSearch] = useState<string>("");

  useEffect(() => {
    async function loadRepoArticles() {
      try {
        const res = await articlesApi.list({ size: 100 });
        if (res?.content && res.content.length > 0) {
          setAllArticles(res.content);
        }
      } catch {
        // fallback to initialArticles
      }
    }
    loadRepoArticles();
  }, []);

  const getArticleCover = (art: Article) => {
    if (art.image && typeof art.image === "string" && art.image.trim()) {
      return art.image;
    }
    const topic = (art.topic || "").toLowerCase();
    if (topic.includes("pharmacy") || topic.includes("drug")) return "/images/hero/molecular_inhibitors.jpg";
    if (topic.includes("tech") || topic.includes("computer") || topic.includes("ai")) return "/images/hero/quantum_computing.jpg";
    if (topic.includes("agri") || topic.includes("farm") || topic.includes("climate") || topic.includes("crop")) return "/images/hero/crop_genomics.jpg";
    if (topic.includes("cell") || topic.includes("medic") || topic.includes("health")) return "/images/hero/pulmonary_fibrosis.jpg";
    return "/images/hero/molecular_inhibitors.jpg";
  };

  const selectedArticleIds: string[] = useMemo(() => {
    try {
      if (!formMetaJson) return [];
      const parsed = JSON.parse(formMetaJson);
      return Array.isArray(parsed.selectedArticleIds) ? parsed.selectedArticleIds : [];
    } catch {
      return [];
    }
  }, [formMetaJson]);

  const updateMetaWithArticles = (articleIds: string[]) => {
    try {
      const currentMeta = formMetaJson ? JSON.parse(formMetaJson) : {};
      currentMeta.selectedArticleIds = articleIds;
      currentMeta.featuredSlides = articleIds.map((id, index) => {
        const art = allArticles.find((a) => a.slug === id || a.id === id) || initialArticles.find((a) => a.slug === id || a.id === id);
        return {
          id: art?.slug || id,
          num: String(index + 1).padStart(2, "0"),
          category: "FEATURED RESEARCH",
          journalCategory: art?.topic || "Multidisciplinary Science",
          isOpenAccess: true,
          title: art?.title || "Research Manuscript",
          shortTitle: art?.title || "Research Manuscript",
          authors: Array.isArray(art?.authors) ? art.authors.join(", ") : (art?.authors || "Editorial Research Group"),
          journal: "GB Journal of Science & Technology",
          journalHref: "/issues/current",
          volumeIssue: art?.volume ? `${art.volume}, ${art.issue || "Issue 1"}` : "Vol. 14, No. 2",
          publishDate: art?.publishedAt || "June 2025",
          abstract: art?.abstract || "",
          doi: art?.doi || "10.5555/gbj.2025",
          doiHref: art?.doi ? `https://doi.org/${art.doi}` : undefined,
          image: art ? getArticleCover(art) : "/images/hero/molecular_inhibitors.jpg",
          articleHref: `/articles/${art?.slug || id}`,
          issueHref: "/issues/current",
        };
      });
      setFormMetaJson(JSON.stringify(currentMeta, null, 2));
    } catch {
      setFormMetaJson(JSON.stringify({ selectedArticleIds: articleIds }, null, 2));
    }
  };

  const handleAddArticleToCarousel = (art: Article) => {
    const artId = art.slug || art.id;
    if (selectedArticleIds.includes(artId)) return;
    const nextIds = [...selectedArticleIds, artId];
    updateMetaWithArticles(nextIds);
    toast.success(`"${art.title.slice(0, 30)}..." added to carousel!`);
  };

  const handleRemoveArticleFromCarousel = (artId: string) => {
    const nextIds = selectedArticleIds.filter((id) => id !== artId);
    updateMetaWithArticles(nextIds);
    toast.info("Removed from carousel.");
  };

  const handleMoveArticleOrder = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= selectedArticleIds.length) return;
    const nextIds = [...selectedArticleIds];
    const temp = nextIds[idx];
    nextIds[idx] = nextIds[targetIdx];
    nextIds[targetIdx] = temp;
    updateMetaWithArticles(nextIds);
  };

  const handleLoadDefaultArticles = () => {
    const defaultSlugs = initialArticles.slice(0, 4).map((a) => a.slug || a.id);
    updateMetaWithArticles(defaultSlugs);
    toast.success("Loaded 4 recommended research papers from publications repository!");
  };

  // Structured Meta field-level helpers (No raw JSON needed by user)
  const parsedMeta: Record<string, any> = useMemo(() => {
    try {
      if (!formMetaJson) return {};
      return JSON.parse(formMetaJson);
    } catch {
      return {};
    }
  }, [formMetaJson]);

  const updateMetaField = (key: string, value: any) => {
    try {
      const current = formMetaJson ? JSON.parse(formMetaJson) : {};
      if (value === undefined || value === "") {
        delete current[key];
      } else {
        current[key] = value;
      }
      setFormMetaJson(JSON.stringify(current));
    } catch {
      setFormMetaJson(JSON.stringify({ [key]: value }));
    }
  };

  const removeMetaField = (key: string) => {
    try {
      const current = formMetaJson ? JSON.parse(formMetaJson) : {};
      delete current[key];
      setFormMetaJson(JSON.stringify(current));
    } catch {
      setFormMetaJson("{}");
    }
  };

  const [newCustomKey, setNewCustomKey] = useState("");
  const [newCustomVal, setNewCustomVal] = useState("");
  const [isAddingCustomParam, setIsAddingCustomParam] = useState(false);
  const [newTrackInput, setNewTrackInput] = useState("");

  const handleAddCustomParam = () => {
    if (!newCustomKey.trim()) {
      toast.error("Please enter a parameter name.");
      return;
    }
    updateMetaField(newCustomKey.trim(), newCustomVal.trim());
    setNewCustomKey("");
    setNewCustomVal("");
    setIsAddingCustomParam(false);
    toast.success(`Parameter "${newCustomKey.trim()}" added.`);
  };

  const knownSectionKeys = useMemo(() => {
    const set = new Set(["selectedArticleIds", "featuredSlides"]);
    if (formSectionKey === "journal-stats") {
      ["turnaroundDays", "acceptanceRate", "reviewersActive", "indexedArticles", "articlesPublished", "globalReaders", "newsletterTitle", "newsletterSubtitle"].forEach((k) => set.add(k));
    } else if (formSectionKey === "hero-main") {
      ["badge", "issnPrint", "issnOnline", "primaryCtaText", "secondaryCtaText"].forEach((k) => set.add(k));
    } else if (formSectionKey === "call-for-papers") {
      ["badge", "deadline", "targetVolume", "fastTrack"].forEach((k) => set.add(k));
    } else if (formSectionKey === "latest-research") {
      ["viewAllText", "viewAllHref", "selectedArticleIds"].forEach((k) => set.add(k));
    } else if (formSectionKey === "current-issue") {
      ["journalName", "volumeIssue", "issueDate", "publicationDate", "issnPrint", "issnOnline", "featuredPaperTitle", "doiPrefix", "browseHref", "pdfHref"].forEach((k) => set.add(k));
    } else if (formSectionKey === "most-read") {
      ["articleCount", "selectedArticleIds"].forEach((k) => set.add(k));
    } else if (formSectionKey === "explore-topics" || formSectionKey === "scope-tracks" || Array.isArray(parsedMeta.tracks)) {
      set.add("tracks");
    } else if (formSectionKey === "featured-journals") {
      ["category"].forEach((k) => set.add(k));
    } else if (formSectionKey === "research-community") {
      ["spotlightAuthor", "spotlightTitle", "symposium"].forEach((k) => set.add(k));
    } else if (formSectionKey === "home-faq") {
      set.add("faqs");
    } else if (formSectionKey === "office-info" || formPageKey === "contact") {
      ["email", "phone", "location", "office"].forEach((k) => set.add(k));
    }
    return set;
  }, [formSectionKey, formPageKey, parsedMeta]);

  const customMetaEntries = useMemo(() => {
    return Object.entries(parsedMeta).filter(([k]) => !knownSectionKeys.has(k));
  }, [parsedMeta, knownSectionKeys]);

  // Initial snapshot to track dirty form state
  const [initForm, setInitForm] = useState<{
    pageKey: string;
    sectionKey: string;
    title: string;
    subtitle: string;
    content: string;
    metaJson: string;
    displayOrder: number;
    published: boolean;
  } | null>(null);

  const isFormDirty = useMemo(() => {
    if (!initForm) return false;
    if (isCreatingNew) {
      return Boolean(formTitle.trim() && formSectionKey.trim());
    }
    return (
      formPageKey !== initForm.pageKey ||
      formSectionKey !== initForm.sectionKey ||
      formTitle !== initForm.title ||
      formSubtitle !== initForm.subtitle ||
      formContent !== initForm.content ||
      formMetaJson !== initForm.metaJson ||
      formDisplayOrder !== initForm.displayOrder ||
      formPublished !== initForm.published
    );
  }, [
    initForm,
    isCreatingNew,
    formPageKey,
    formSectionKey,
    formTitle,
    formSubtitle,
    formContent,
    formMetaJson,
    formDisplayOrder,
    formPublished,
  ]);

  // Fetch sections for the current page
  const fetchSections = async (pageKey: string, force = false) => {
    const cached = cmsCache[pageKey];
    if (cached?.data && !force) {
      setSections(cached.data);
      setLoading(false);
      if (Date.now() - cached.timestamp < 60000) {
        return;
      }
      setIsRefreshing(true);
    } else if (!cached?.data) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await contentApi.getAdminContent(pageKey);
      setSections(data || []);
      cmsCache[pageKey] = { data: data || [], timestamp: Date.now() };
    } catch (err: any) {
      console.warn("Failed to fetch admin content, fetching public published fallback:", err.message);
      try {
        const fallback = await contentApi.getPublished(pageKey);
        setSections(fallback || []);
        cmsCache[pageKey] = { data: fallback || [], timestamp: Date.now() };
      } catch {
        if (!cached?.data) {
          toast.error("Failed to load page content from server.");
        }
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSections(activeTab);
  }, [activeTab]);

  // Filtered sections by search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.subtitle?.toLowerCase().includes(q) ||
        s.sectionKey?.toLowerCase().includes(q) ||
        s.content?.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  // Open Edit Modal
  const openEditModal = (section: PageContentDTO) => {
    setEditingSection(section);
    setIsCreatingNew(false);
    setFormPageKey(section.pageKey);
    setFormSectionKey(section.sectionKey);
    setFormTitle(section.title);
    setFormSubtitle(section.subtitle || "");
    setFormContent(section.content || "");
    setFormMetaJson(section.metaJson || "");
    setFormDisplayOrder(section.displayOrder || 1);
    setFormPublished(section.published);
    setInitForm({
      pageKey: section.pageKey,
      sectionKey: section.sectionKey,
      title: section.title,
      subtitle: section.subtitle || "",
      content: section.content || "",
      metaJson: section.metaJson || "",
      displayOrder: section.displayOrder || 1,
      published: section.published,
    });
    setIsEditModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingSection(null);
    setIsCreatingNew(true);
    setFormPageKey(activeTab);
    setFormSectionKey("");
    setFormTitle("");
    setFormSubtitle("");
    setFormContent("");
    setFormMetaJson("");
    setFormDisplayOrder(sections.length + 1);
    setFormPublished(true);
    setInitForm({
      pageKey: activeTab,
      sectionKey: "",
      title: "",
      subtitle: "",
      content: "",
      metaJson: "",
      displayOrder: sections.length + 1,
      published: true,
    });
    setIsEditModalOpen(true);
  };

  // Save Section Form
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSectionKey.trim()) {
      toast.error("Section Key and Title are required.");
      return;
    }

    try {
      setSaving(true);
      const payload: PageContentDTO = {
        pageKey: formPageKey,
        sectionKey: formSectionKey.trim().toLowerCase().replaceAll(/[^a-z0-9-_]/g, "-"),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        content: formContent || undefined,
        metaJson: formMetaJson.trim() || undefined,
        displayOrder: Number(formDisplayOrder) || 1,
        published: formPublished,
      };

      if (isCreatingNew) {
        await contentApi.createSection(payload);
        toast.success(`New section "${payload.title}" created successfully!`);
      } else {
        await contentApi.updateSection(formPageKey, formSectionKey, payload);
        toast.success(`Section "${payload.title}" updated successfully!`);
      }

      setIsEditModalOpen(false);
      fetchSections(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to save section.");
    } finally {
      setSaving(false);
    }
  };

  // Confirm and Execute Delete Section
  const handleExecuteDeleteSection = async () => {
    if (!sectionToDelete?.id) return;

    try {
      setIsDeleting(true);
      await contentApi.deleteSection(sectionToDelete.id);
      toast.success(`Section "${sectionToDelete.title}" removed successfully.`);
      setSectionToDelete(null);
      fetchSections(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete section.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (section: PageContentDTO) => {
    try {
      const updated = await contentApi.updateSection(section.pageKey, section.sectionKey, {
        published: !section.published,
      });
      toast.success(
        `Section is now ${updated.published ? "Published (Live)" : "Draft (Hidden)"}`
      );
      fetchSections(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  // Confirm and Execute Reset page to defaults
  const handleExecuteResetDefaults = async () => {
    const currentTabObj = PAGE_TABS.find((t) => t.id === activeTab);

    try {
      setIsResetting(true);
      await contentApi.resetDefaults(activeTab);
      toast.success(`Default academic content restored for ${currentTabObj?.label}.`);
      setIsResetConfirmOpen(false);
      fetchSections(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset content.");
    } finally {
      setIsResetting(false);
    }
  };

  const currentTabInfo = PAGE_TABS.find((t) => t.id === activeTab) || PAGE_TABS[0];

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <DashboardHeaderActions>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Section</span>
        </button>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          title="Restore default academic template"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset Defaults</span>
        </button>

        <a
          href={currentTabInfo.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs"
        >
          <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
          <span>View Live Page</span>
        </a>
      </DashboardHeaderActions>

      {/* Page Tabs as Compact Horizontal Bar */}
      <div className="relative border-b border-slate-200/90 bg-white/70 backdrop-blur-xs rounded-xl p-1 shadow-2xs">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-3 bg-gradient-to-r from-white via-white/90 to-transparent">
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div
          ref={tabsContainerRef}
          onScroll={updateTabsScroll}
          className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-0.5"
        >
          {PAGE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 border",
                  isActive
                    ? "bg-white border-blue-200 text-blue-900 shadow-xs font-bold ring-1 ring-blue-500/20"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md transition-colors",
                    isActive
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                  )}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "bg-slate-100 text-slate-400 group-hover:text-slate-500"
                  )}
                >
                  {tab.route}
                </span>
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-3 bg-gradient-to-l from-white via-white/90 to-transparent">
            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <DashboardSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={`Filter ${currentTabInfo.label} sections by title, key or content...`}
      >
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {filteredSections.length} Sections configured
        </span>
      </DashboardSearchFilterBar>

      {/* Content Section List */}
      {loading ? (
        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-12 shadow-xs">
          <AcademicDataLoader
            title={`Loading ${currentTabInfo.label} content...`}
            subtitle="Connecting to Content Management System"
          />
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <Layers className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No sections found for this page</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Get started by creating a new customizable section or restore the verified academic defaults.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Section
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              Load Academic Defaults
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredSections.map((section, idx) => (
            <div
              key={section.id || `${section.pageKey}-${section.sectionKey}`}
              className={cn(
                "group rounded-2xl border bg-white p-5 transition-all duration-200 shadow-xs hover:shadow-md",
                section.published
                  ? "border-[color:var(--color-gb-border)] hover:border-blue-300"
                  : "border-amber-200 bg-amber-50/20"
              )}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                    #{section.displayOrder || idx + 1}
                  </span>

                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80">
                    {section.sectionKey}
                  </span>

                  <button
                    onClick={() => handleTogglePublish(section)}
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer inline-flex items-center gap-1",
                      section.published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    )}
                    title={section.published ? "Click to unselect from page" : "Click to select and publish to page"}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        section.published ? "bg-emerald-500" : "bg-slate-400"
                      )}
                    />
                    {section.published
                      ? (activeTab === "home" ? "Selected on Home" : "Published (Live)")
                      : (activeTab === "home" ? "Not Selected (Hidden)" : "Hidden (Draft)")}
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewSection(section)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    Preview
                  </button>

                  <button
                    onClick={() => openEditModal(section)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100/80 transition-colors cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5 text-blue-600" />
                    Edit Content
                  </button>

                  {/* For built-in sections: Unselect/Select toggle instead of permanent delete */}
                  {CORE_SECTION_KEYS.has(section.sectionKey) ? (
                    <button
                      onClick={() => handleTogglePublish(section)}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                        section.published
                          ? "text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200"
                          : "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
                      )}
                      title={section.published ? "Unselect from homepage (keeps all content safe)" : "Select to show on homepage"}
                    >
                      {section.published ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                          <span>Unselect</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                          <span>Select</span>
                        </>
                      )}
                    </button>
                  ) : (
                    section.id && (
                      <button
                        onClick={() => setSectionToDelete(section)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Unselect & remove custom section"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 font-academic">
                  {section.title}
                </h4>
                {section.subtitle && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {section.subtitle}
                  </p>
                )}

                {section.content && (
                  <div className="mt-3 rounded-xl bg-slate-50/80 p-3 text-xs text-slate-700 leading-relaxed border border-slate-200/60 font-sans whitespace-pre-line line-clamp-3">
                    {section.content}
                  </div>
                )}

                {section.metaJson && (() => {
                  try {
                    const meta = JSON.parse(section.metaJson);
                    const entries = Object.entries(meta).filter(
                      ([k]) => k !== "selectedArticleIds" && k !== "featuredSlides"
                    );
                    if (entries.length === 0) return null;
                    return (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {entries.slice(0, 5).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            <span className="text-slate-400 capitalize">
                              {k.replace(/([A-Z])/g, " $1")}:
                            </span>
                            <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                              {Array.isArray(v) ? `${v.length} items` : String(v)}
                            </span>
                          </span>
                        ))}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}

                {section.pageKey === "home" && section.sectionKey === "hero-main" && (
                  <div className="mt-3.5 p-3.5 rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <BookMarked className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900">
                            Homepage Featured Research Carousel
                          </h5>
                          {(() => {
                            try {
                              const meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                              const count = Array.isArray(meta.selectedArticleIds)
                                ? meta.selectedArticleIds.length
                                : (Array.isArray(meta.featuredSlides) ? meta.featuredSlides.length : 4);
                              return (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                                  {count} Publications Selected
                                </span>
                              );
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                        <p className="text-[11.5px] text-slate-500 mt-0.5">
                          Controls the interactive 4-slide research visualizer on the main journal homepage.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditModal(section)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer shrink-0"
                    >
                      <Library className="h-3.5 w-3.5" />
                      <span>Select Publications</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Section Drawer */}
      <CustomDrawer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={isCreatingNew ? `Add Section to ${currentTabInfo.label}` : `Edit Section — ${formTitle}`}
        description="Configure and publish academic content sections across the journal portal."
        icon={Edit}
        size="xl"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="page-section-form"
              disabled={saving || !isFormDirty}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving Changes..." : "Save & Publish"}
            </button>
          </div>
        }
      >
        <form id="page-section-form" onSubmit={handleSaveSection} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Page
              </label>
              <CustomSelect
                value={formPageKey}
                onChange={(val) => setFormPageKey(val)}
                options={PAGE_TABS.map((t) => ({ value: t.id, label: t.label }))}
                size="form"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section Unique Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. aims-scope, ethics, fee-waiver"
                value={formSectionKey}
                onChange={(e) => setFormSectionKey(e.target.value)}
                disabled={!isCreatingNew}
                required
                className={cn(
                  "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden",
                  !isCreatingNew && "bg-slate-100 text-slate-500 cursor-not-allowed"
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Double-Blind Peer Review Framework"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subtitle / Lead Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Rigorous, unbiased, and transparent scientific evaluation."
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Featured Publications Selector for Home Page Hero Carousel */}
          {formPageKey === "home" && (formSectionKey === "hero-main" || formSectionKey === "featured-research" || isCreatingNew) && (
            <div className="rounded-2xl border-2 border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-slate-50/40 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <BookMarked className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                      <span>Homepage Featured Research Carousel</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/70">
                        {selectedArticleIds.length} Publications Chosen
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Choose which publications appear on the homepage hero carousel. Unselecting here will never delete or alter manuscripts in your publications repository.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadDefaultArticles}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Load Top 4 Defaults</span>
                </button>
              </div>

              {/* Currently Selected Carousel Slides (Ordered 01, 02, 03, 04...) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Active Carousel Lineup ({selectedArticleIds.length} Slides)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Recommended: 4 articles for full grid layout
                  </span>
                </div>

                {selectedArticleIds.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">
                    <p className="font-medium text-slate-700">No publications selected yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">The homepage will display default editorial highlights.</p>
                    <button
                      type="button"
                      onClick={handleLoadDefaultArticles}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                      <span>Click to load 4 recommended papers from publications repository</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedArticleIds.map((artId, idx) => {
                      const art = allArticles.find((a) => a.slug === artId || a.id === artId) || initialArticles.find((a) => a.slug === artId || a.id === artId);
                      const cover = art ? getArticleCover(art) : "/images/hero/molecular_inhibitors.jpg";
                      return (
                        <div
                          key={artId}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:border-blue-200 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#1e40af] text-white font-mono text-xs font-bold shadow-2xs">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                              <img src={cover} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {art?.title || artId}
                              </p>
                              <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                {Array.isArray(art?.authors) ? art.authors.join(", ") : art?.authors || "Academic Researchers"} • <span className="font-semibold text-blue-700">{art?.topic || "Science"}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveArticleOrder(idx, "up")}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25 cursor-pointer transition-colors"
                              title="Move Slide Up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveArticleOrder(idx, "down")}
                              disabled={idx === selectedArticleIds.length - 1}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25 cursor-pointer transition-colors"
                              title="Move Slide Down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveArticleFromCarousel(artId)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer ml-1"
                              title="Unselect from homepage hero (publication remains safely in repository)"
                            >
                              <X className="h-3 w-3 text-slate-400" />
                              <span>Unselect</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add More Publications from Repository */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Add Publications from Repository
                  </label>
                  <span className="text-[10.5px] text-slate-500 font-medium">
                    {allArticles.length} total publications
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search publications by title, author, topic, or DOI..."
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                  {articleSearch && (
                    <button
                      type="button"
                      onClick={() => setArticleSearch("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 drawer-scroll">
                  {allArticles
                    .filter((art) => {
                      if (!articleSearch.trim()) return true;
                      const q = articleSearch.toLowerCase();
                      return (
                        art.title?.toLowerCase().includes(q) ||
                        art.topic?.toLowerCase().includes(q) ||
                        (Array.isArray(art.authors) ? art.authors.join(" ") : art.authors || "").toLowerCase().includes(q) ||
                        art.doi?.toLowerCase().includes(q)
                      );
                    })
                    .slice(0, 20)
                    .map((art) => {
                      const artId = art.slug || art.id;
                      const isSelected = selectedArticleIds.includes(artId);
                      const cover = getArticleCover(art);
                      return (
                        <div
                          key={artId}
                          className={cn(
                            "flex items-center justify-between gap-2.5 p-2 rounded-xl border transition-all text-xs",
                            isSelected
                              ? "border-blue-200 bg-blue-50/60"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                              <img src={cover} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 truncate text-[11.5px]">
                                {art.title}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {Array.isArray(art.authors) ? art.authors[0] : art.authors} • <span className="text-blue-700 font-medium">{art.topic}</span>
                              </p>
                            </div>
                          </div>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-1 rounded-lg shrink-0 border border-blue-200/80">
                              <Check className="h-3 w-3" />
                              Selected
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddArticleToCarousel(art)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 border border-blue-200 hover:border-blue-600"
                            >
                              <Plus className="h-3 w-3" />
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Body Content (Text / Markdown)
            </label>
            <textarea
              rows={6}
              placeholder="Enter academic content, guidelines, or policy clauses..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 leading-relaxed focus:border-blue-500 focus:outline-hidden font-sans resize-y"
            />
          </div>

          {/* Section Settings & Parameters (Human-friendly UI, No Raw JSON) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <Sliders className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Section Parameters & Key Metrics
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Configure display metrics, identifiers, and parameters without raw code.
                  </p>
                </div>
              </div>
            </div>

            {/* Case A: Journal Benchmarks & Turnaround Metrics */}
            {formSectionKey === "journal-stats" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    First Decision Turnaround
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18 Days"
                    value={parsedMeta.turnaroundDays || ""}
                    onChange={(e) => updateMetaField("turnaroundDays", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Average peer review speed</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Overall Acceptance Rate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 34%"
                    value={parsedMeta.acceptanceRate || ""}
                    onChange={(e) => updateMetaField("acceptanceRate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Scientific selectivity benchmark</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Active Peer Reviewers
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 140+"
                    value={parsedMeta.reviewersActive || ""}
                    onChange={(e) => updateMetaField("reviewersActive", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Global reviewer pool size</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Indexed Scientific Articles
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 380+"
                    value={parsedMeta.indexedArticles || ""}
                    onChange={(e) => updateMetaField("indexedArticles", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Total papers indexed</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Total Articles Published
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12,486+"
                    value={parsedMeta.articlesPublished || ""}
                    onChange={(e) => updateMetaField("articlesPublished", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Total scholarly outputs</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Global Readers & Downloads
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 85,000+"
                    value={parsedMeta.globalReaders || ""}
                    onChange={(e) => updateMetaField("globalReaders", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">International reader footprint</span>
                </div>

                <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Newsletter Box Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stay informed with GB Journal research alerts"
                    value={parsedMeta.newsletterTitle || ""}
                    onChange={(e) => updateMetaField("newsletterTitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Newsletter Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Receive curated research highlights and call announcements..."
                    value={parsedMeta.newsletterSubtitle || ""}
                    onChange={(e) => updateMetaField("newsletterSubtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case: Latest Research Settings */}
            {formSectionKey === "latest-research" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    View All Action Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. View all articles"
                    value={parsedMeta.viewAllText || ""}
                    onChange={(e) => updateMetaField("viewAllText", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    View All Link Route
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /articles"
                    value={parsedMeta.viewAllHref || ""}
                    onChange={(e) => updateMetaField("viewAllHref", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case: Current Issue Details */}
            {formSectionKey === "current-issue" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Journal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nexus Journal of Molecular Sciences"
                    value={parsedMeta.journalName || ""}
                    onChange={(e) => updateMetaField("journalName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Volume & Issue Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vol. 12, No. 4"
                    value={parsedMeta.volumeIssue || ""}
                    onChange={(e) => updateMetaField("volumeIssue", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Issue Release Date / Month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. May 2025"
                    value={parsedMeta.issueDate || ""}
                    onChange={(e) => updateMetaField("issueDate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. May 15, 2025"
                    value={parsedMeta.publicationDate || ""}
                    onChange={(e) => updateMetaField("publicationDate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Print ISSN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2073-8447"
                    value={parsedMeta.issnPrint || ""}
                    onChange={(e) => updateMetaField("issnPrint", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Online ISSN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2790-2188"
                    value={parsedMeta.issnOnline || ""}
                    onChange={(e) => updateMetaField("issnOnline", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Featured Research Paper Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Machine learning-guided discovery of allosteric inhibitors..."
                    value={parsedMeta.featuredPaperTitle || ""}
                    onChange={(e) => updateMetaField("featuredPaperTitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Browse Issue URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /issues/current"
                    value={parsedMeta.browseHref || ""}
                    onChange={(e) => updateMetaField("browseHref", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Download Issue PDF URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /pdfs/current-issue.pdf"
                    value={parsedMeta.pdfHref || ""}
                    onChange={(e) => updateMetaField("pdfHref", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case: Research Community Spotlight */}
            {formSectionKey === "research-community" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Spotlight Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Aisha Rahman, PhD"
                    value={parsedMeta.spotlightAuthor || ""}
                    onChange={(e) => updateMetaField("spotlightAuthor", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Annual Symposium Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Research Symposium 2026"
                    value={parsedMeta.symposium || ""}
                    onChange={(e) => updateMetaField("symposium", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case B: Hero Main Settings */}
            {formSectionKey === "hero-main" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Header Masthead Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Official Biannual Journal"
                    value={parsedMeta.badge || ""}
                    onChange={(e) => updateMetaField("badge", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Print ISSN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2073-8447"
                    value={parsedMeta.issnPrint || ""}
                    onChange={(e) => updateMetaField("issnPrint", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Online ISSN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2790-2188"
                    value={parsedMeta.issnOnline || ""}
                    onChange={(e) => updateMetaField("issnOnline", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Primary Action Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Submit Manuscript"
                    value={parsedMeta.primaryCtaText || ""}
                    onChange={(e) => updateMetaField("primaryCtaText", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Secondary Action Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Explore Latest Issue"
                    value={parsedMeta.secondaryCtaText || ""}
                    onChange={(e) => updateMetaField("secondaryCtaText", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case C: Call For Papers */}
            {formSectionKey === "call-for-papers" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Call Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Active Call"
                    value={parsedMeta.badge || ""}
                    onChange={(e) => updateMetaField("badge", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Submission Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 31, 2026"
                    value={parsedMeta.deadline || ""}
                    onChange={(e) => updateMetaField("deadline", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Volume & Issue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Volume 14, Issue 2"
                    value={parsedMeta.targetVolume || ""}
                    onChange={(e) => updateMetaField("targetVolume", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Fast-Track Review Status
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Available / 2-Week Window"
                    value={parsedMeta.fastTrack || ""}
                    onChange={(e) => updateMetaField("fastTrack", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case D: Editorial Office / Contact Info */}
            {(formSectionKey === "office-info" || formPageKey === "contact") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Official Editorial Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. journal@gonouniversity.edu.bd"
                    value={parsedMeta.email || ""}
                    onChange={(e) => updateMetaField("email", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Office Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +880-2-7792225"
                    value={parsedMeta.phone || ""}
                    onChange={(e) => updateMetaField("phone", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mirzanagar, Savar, Dhaka 1344"
                    value={parsedMeta.location || ""}
                    onChange={(e) => updateMetaField("location", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Room / Building
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Administrative Building, Room 204"
                    value={parsedMeta.office || ""}
                    onChange={(e) => updateMetaField("office", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Case E: Research Scope Tracks / Explore Topics (List / Tags) */}
            {(formSectionKey === "scope-tracks" || formSectionKey === "explore-topics" || Array.isArray(parsedMeta.tracks)) && (
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Disciplines & Research Tracks / Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(parsedMeta.tracks) ? parsedMeta.tracks : []).map((track: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    >
                      <Tag className="h-3 w-3 text-blue-600" />
                      <span>{track}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const list = Array.isArray(parsedMeta.tracks) ? parsedMeta.tracks : [];
                          updateMetaField("tracks", list.filter((_: any, idx: number) => idx !== tIdx));
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type new topic (e.g. Biomedical Engineering)..."
                    value={newTrackInput}
                    onChange={(e) => setNewTrackInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newTrackInput.trim()) {
                          const current = Array.isArray(parsedMeta.tracks) ? parsedMeta.tracks : [];
                          updateMetaField("tracks", [...current, newTrackInput.trim()]);
                          setNewTrackInput("");
                        }
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTrackInput.trim()) {
                        const current = Array.isArray(parsedMeta.tracks) ? parsedMeta.tracks : [];
                        updateMetaField("tracks", [...current, newTrackInput.trim()]);
                        setNewTrackInput("");
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case: Frequently Asked Questions (FAQ) */}
            {formSectionKey === "home-faq" && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Frequently Asked Questions ({(Array.isArray(parsedMeta.faqs) ? parsedMeta.faqs : []).length} Q&As)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = Array.isArray(parsedMeta.faqs) ? parsedMeta.faqs : [];
                      updateMetaField("faqs", [...current, { q: "New Question", a: "Answer text goes here." }]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(Array.isArray(parsedMeta.faqs) ? parsedMeta.faqs : []).map((faq: any, fIdx: number) => (
                    <div key={fIdx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold font-mono text-slate-400">Q{fIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = Array.isArray(parsedMeta.faqs) ? parsedMeta.faqs : [];
                            updateMetaField("faqs", current.filter((_: any, idx: number) => idx !== fIdx));
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer text-xs"
                          title="Remove FAQ"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Question title..."
                        value={faq.q || ""}
                        onChange={(e) => {
                          const current = Array.isArray(parsedMeta.faqs) ? [...parsedMeta.faqs] : [];
                          current[fIdx] = { ...current[fIdx], q: e.target.value };
                          updateMetaField("faqs", current);
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer explanation..."
                        value={faq.a || ""}
                        onChange={(e) => {
                          const current = Array.isArray(parsedMeta.faqs) ? [...parsedMeta.faqs] : [];
                          current[fIdx] = { ...current[fIdx], a: e.target.value };
                          updateMetaField("faqs", current);
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 resize-y"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom or Additional Parameters (Key-Value) */}
            {customMetaEntries.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <label className="block text-[11px] font-bold text-slate-700">
                  Additional Parameters
                </label>
                <div className="space-y-2">
                  {customMetaEntries.map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="text"
                        disabled
                        value={key}
                        className="w-1/3 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-600 font-mono"
                      />
                      <input
                        type="text"
                        value={typeof val === "object" ? JSON.stringify(val) : String(val)}
                        onChange={(e) => updateMetaField(key, e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetaField(key)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete parameter"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Custom Parameter Action */}
            <div className="pt-1">
              {isAddingCustomParam ? (
                <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Parameter name (e.g. reviewWindow)"
                      value={newCustomKey}
                      onChange={(e) => setNewCustomKey(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 21 Days)"
                      value={newCustomVal}
                      onChange={(e) => setNewCustomVal(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustomParam(false);
                        setNewCustomKey("");
                        setNewCustomVal("");
                      }}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomParam}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      Save Parameter
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomParam(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Custom Parameter</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={formDisplayOrder}
                onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center sm:pt-6">
              <CustomCheckbox
                id="formPublished"
                checked={formPublished}
                onChange={setFormPublished}
                label="Publish Immediately (Visible to Public)"
              />
            </div>
          </div>
        </form>
      </CustomDrawer>

      {/* Section Live Preview Drawer */}
      <CustomDrawer
        isOpen={!!previewSection}
        onClose={() => setPreviewSection(null)}
        title="Public Layout Live Preview"
        description="Inspect the rendered layout of this section before releasing to public readers."
        icon={Eye}
        size="xl"
      >
        {previewSection && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-300 bg-blue-50 text-blue-800 font-sans">
                  {previewSection.pageKey.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  #{previewSection.sectionKey}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-academic tracking-tight">
                {previewSection.title}
              </h3>
              {previewSection.subtitle && (
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {previewSection.subtitle}
                </p>
              )}

              <div className="my-4 border-t border-slate-100" />

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {previewSection.content || "No body content entered for this section."}
              </div>

              {previewSection.metaJson && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Structured Parameters
                  </p>
                  <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap">
                    {previewSection.metaJson}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewSection(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </CustomDrawer>

      {/* Reset Defaults Confirmation Modal */}
      <CustomModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Restore Default Academic Content?"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <RotateCcw className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              This will overwrite any custom additions or edits on the <strong>{currentTabInfo.label}</strong> page with the official Gono Bishwabidyalay peer review charter defaults.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteResetDefaults}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {isResetting ? "Restoring..." : "Yes, Restore Defaults"}
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Remove Custom Section Confirmation Modal */}
      <CustomModal
        isOpen={!!sectionToDelete}
        onClose={() => setSectionToDelete(null)}
        title="Unselect & Remove Custom Section?"
        className="max-w-md"
      >
        {sectionToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <EyeOff className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 mb-0.5">
                  Unselect &quot;{sectionToDelete.title}&quot; from this page?
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This custom section will be removed from the public portal display. Your publications, manuscripts, and portal records are never deleted and remain safely preserved in the system.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSectionToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteSection}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-900 transition-all cursor-pointer disabled:opacity-50"
              >
                <EyeOff className="h-3.5 w-3.5" />
                {isDeleting ? "Unselecting..." : "Unselect from Page"}
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
