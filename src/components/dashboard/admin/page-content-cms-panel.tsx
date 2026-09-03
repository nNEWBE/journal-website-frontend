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
} from "lucide-react";
import { toast } from "sonner";
import { contentApi, type PageContentDTO } from "@/lib/api";
import { AcademicDataLoader } from "@/components/ui/loader";
import { CustomModal } from "@/components/ui/modal";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { CustomSelect } from "@/components/ui/custom-select";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { DashboardSearchFilterBar } from "@/components/dashboard/dashboard-search-bar";
import { cn } from "@/lib/utils";

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
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        section.published ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    {section.published ? "Published (Live)" : "Draft (Hidden)"}
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

                  {section.id && (
                    <button
                      onClick={() => setSectionToDelete(section)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

                {section.metaJson && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Structured Meta JSON attached
                    </span>
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
      >
        <form onSubmit={handleSaveSection} className="space-y-4">
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Body Content (Text / Markdown)
            </label>
            <textarea
              rows={8}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              placeholder="Enter academic content, guidelines, or policy clauses..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 leading-relaxed focus:border-blue-500 focus:outline-hidden font-sans overscroll-contain overflow-y-auto"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Structured Meta (JSON configuration)
              </label>
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(formMetaJson || "{}");
                    setFormMetaJson(JSON.stringify(parsed, null, 2));
                    toast.success("JSON formatted cleanly!");
                  } catch {
                    toast.error("Invalid JSON syntax.");
                  }
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Format JSON
              </button>
            </div>
            <textarea
              rows={4}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              placeholder='{ "icon": "shield", "order": 1 }'
              value={formMetaJson}
              onChange={(e) => setFormMetaJson(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-[11px] font-mono text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-hidden overscroll-contain overflow-y-auto bg-slate-50"
            />
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isFormDirty}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save & Publish"}
            </button>
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

      {/* Delete Section Confirmation Modal */}
      <CustomModal
        isOpen={!!sectionToDelete}
        onClose={() => setSectionToDelete(null)}
        title="Delete Content Section?"
        className="max-w-md"
      >
        {sectionToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
              <Trash2 className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-950 mb-0.5">
                  Are you sure you want to remove &quot;{sectionToDelete.title}&quot;?
                </p>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Section key <code className="font-mono bg-rose-100/80 px-1 py-0.5 rounded text-[11px]">{sectionToDelete.sectionKey}</code> will be permanently removed from the public portal.
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeleting ? "Deleting..." : "Delete Section"}
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
