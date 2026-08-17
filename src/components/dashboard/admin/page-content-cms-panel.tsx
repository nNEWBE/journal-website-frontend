"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { contentApi, type PageContentDTO } from "@/lib/api";
import { AcademicDataLoader } from "@/components/ui/loader";
import { CustomModal } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PAGE_TABS = [
  {
    id: "about",
    label: "About Journal",
    route: "/about",
    icon: BookOpen,
    description: "Overview, mission, indexing criteria, and aims & scope.",
    color: "blue",
  },
  {
    id: "authors",
    label: "Author Guidelines",
    route: "/authors",
    icon: PenLine,
    description: "Manuscript preparation, submission checklist, and APC policy.",
    color: "sky",
  },
  {
    id: "policies",
    label: "Policies & Ethics",
    route: "/policies",
    icon: Shield,
    description: "Peer review framework, anti-plagiarism, and open access licensing.",
    color: "purple",
  },
  {
    id: "announcements",
    label: "Hero & Announcements",
    route: "/",
    icon: Megaphone,
    description: "Call for papers alerts, turnaround benchmarks, and home notices.",
    color: "amber",
  },
  {
    id: "contact",
    label: "Contact Office",
    route: "/contact",
    icon: Phone,
    description: "Editorial secretariat, office location, help desk, and emails.",
    color: "emerald",
  },
];

export function PageContentCMSPanel() {
  const [activeTab, setActiveTab] = useState<string>("about");
  const [sections, setSections] = useState<PageContentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<PageContentDTO | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Preview Modal
  const [previewSection, setPreviewSection] = useState<PageContentDTO | null>(null);

  // Form fields
  const [formPageKey, setFormPageKey] = useState<string>("about");
  const [formSectionKey, setFormSectionKey] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSubtitle, setFormSubtitle] = useState<string>("");
  const [formContent, setFormContent] = useState<string>("");
  const [formMetaJson, setFormMetaJson] = useState<string>("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formPublished, setFormPublished] = useState<boolean>(true);

  // Fetch sections for the current page
  const fetchSections = async (pageKey: string) => {
    try {
      setLoading(true);
      const data = await contentApi.getAdminContent(pageKey);
      setSections(data || []);
    } catch (err: any) {
      console.warn("Failed to fetch admin content, fetching public published fallback:", err.message);
      try {
        const fallback = await contentApi.getPublished(pageKey);
        setSections(fallback || []);
      } catch {
        toast.error("Failed to load page content from server.");
      }
    } finally {
      setLoading(false);
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

  // Delete Section
  const handleDeleteSection = async (section: PageContentDTO) => {
    if (!section.id) return;
    if (!confirm(`Are you sure you want to remove the section "${section.title}"?`)) return;

    try {
      await contentApi.deleteSection(section.id);
      toast.success("Section removed successfully.");
      fetchSections(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete section.");
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

  // Reset page to defaults
  const handleResetDefaults = async () => {
    const currentTabObj = PAGE_TABS.find((t) => t.id === activeTab);
    if (
      !confirm(
        `Are you sure you want to restore default academic text for "${currentTabObj?.label}"? Any custom edits on this page will be reset.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await contentApi.resetDefaults(activeTab);
      toast.success(`Default academic content restored for ${currentTabObj?.label}.`);
      fetchSections(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset content.");
      setLoading(false);
    }
  };

  const currentTabInfo = PAGE_TABS.find((t) => t.id === activeTab) || PAGE_TABS[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[color:var(--color-gb-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-300 bg-blue-50 text-blue-800 font-sans">
              Site &amp; Content Management (CMS)
            </span>
          </div>
          <h2 className="text-lg font-black text-[color:var(--color-gb-ink)] font-academic tracking-tight mt-1">
            Dynamic Page &amp; Section Publisher
          </h2>
          <p className="text-xs text-[color:var(--color-gb-muted)]">
            Edit text, upload guidelines, modify publication policies, and update announcements across the public journal portal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Section
          </button>

          <button
            onClick={handleResetDefaults}
            title="Restore default academic template"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            Reset Defaults
          </button>

          <a
            href={currentTabInfo.route}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
            View Live Page
          </a>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PAGE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden",
                isActive
                  ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105",
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {tab.route}
                </span>
              </div>

              <div>
                <p
                  className={cn(
                    "text-xs font-bold transition-colors truncate",
                    isActive ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"
                  )}
                >
                  {tab.label}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[color:var(--color-gb-border)] shadow-xs">
        <div className="flex items-center gap-2 flex-1 rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] px-3 py-1.5 focus-within:border-[color:var(--color-gb-blue)] focus-within:bg-white transition-all">
          <Search className="h-4 w-4 text-[color:var(--color-gb-muted)] shrink-0" />
          <input
            type="text"
            placeholder={`Filter ${currentTabInfo.label} sections by title, key or content...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[color:var(--color-gb-ink)] placeholder-[color:var(--color-gb-muted)] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[10px] text-slate-400 hover:text-slate-600 px-1 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 font-medium px-1">
          <span>{filteredSections.length} Sections configured</span>
        </div>
      </div>

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
              onClick={handleResetDefaults}
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
                      onClick={() => handleDeleteSection(section)}
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

      {/* Add / Edit Section Modal */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={isCreatingNew ? `Add Section to ${currentTabInfo.label}` : `Edit Section — ${formTitle}`}
        className="max-w-2xl"
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
                  "w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden",
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Body Content (Text / Markdown)
            </label>
            <textarea
              rows={6}
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
                Structured Meta JSON (Optional)
              </label>
              <span className="text-[10px] text-slate-400">For badges, checklist or stats</span>
            </div>
            <textarea
              rows={2}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              placeholder='{"issnPrint": "2073-8447", "frequency": "Biannual"}'
              value={formMetaJson}
              onChange={(e) => setFormMetaJson(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-[11px] text-slate-800 focus:border-blue-500 focus:outline-hidden overscroll-contain"
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
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-6">
              <input
                type="checkbox"
                id="formPublished"
                checked={formPublished}
                onChange={(e) => setFormPublished(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="formPublished" className="text-xs font-bold text-slate-800 cursor-pointer">
                Publish Immediately (Visible to Public)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save & Publish"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Section Live Preview Modal */}
      <CustomModal
        isOpen={!!previewSection}
        onClose={() => setPreviewSection(null)}
        title="Public Layout Live Preview"
        className="max-w-3xl"
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
                <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Structured Parameters
                  </p>
                  <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap">
                    {previewSection.metaJson}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewSection(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
