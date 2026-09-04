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
  TrendingUp,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Compass,
  Calendar,
  Globe,
  Clock,
  Play,
  Download,
  Mail,
  Brain,
  Stethoscope,
  Cog,
  Globe2,
  BarChart3,
  ShieldPlus,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { contentApi, articlesApi, type PageContentDTO } from "@/lib/api";
import { articles as initialArticles, type Article } from "@/lib/data";
import { specialIssueCalls } from "@/components/home/home-calls-for-papers";
import { latestArticles } from "@/components/home/home-latest-research";
import { mostReadArticles } from "@/components/home/home-most-read";
import { topicList } from "@/components/home/home-explore-topics";
import { featuredJournals } from "@/components/home/home-featured-journals";
import { communityArticles } from "@/components/home/home-research-community";
import { FAQ_ITEMS } from "@/components/home/home-faq-section";
import { CmsSectionTabs } from "./cms-section-tabs";
import { broadcastSectionVisibility, broadcastSectionOrderChange } from "@/lib/cms-visibility";
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

export interface EditableTopic {
  id: string;
  name: string;
  iconName: string;
  href: string;
}

export const DEFAULT_TOPICS: EditableTopic[] = [
  { id: "ai", name: "Artificial Intelligence", iconName: "Brain", href: "/articles?topic=Technology" },
  { id: "medicine", name: "Medicine", iconName: "Stethoscope", href: "/articles?topic=Medical+Sciences" },
  { id: "engineering", name: "Engineering", iconName: "Cog", href: "/articles?topic=Technology" },
  { id: "climate-science", name: "Climate Science", iconName: "Globe2", href: "/articles?topic=Agriculture" },
  { id: "data-science", name: "Data Science", iconName: "BarChart3", href: "/articles?topic=Technology" },
  { id: "social-research", name: "Social Research", iconName: "Users", href: "/articles?topic=Social+Sciences" },
  { id: "public-health", name: "Public Health", iconName: "ShieldPlus", href: "/articles?topic=Public+Health" },
  { id: "business", name: "Business", iconName: "Briefcase", href: "/articles?topic=Social+Sciences" },
];

export const TOPIC_ICON_OPTIONS = [
  { name: "Brain", label: "Artificial Intelligence", icon: Brain },
  { name: "Stethoscope", label: "Medicine & Healthcare", icon: Stethoscope },
  { name: "Cog", label: "Engineering & Tech", icon: Cog },
  { name: "Globe2", label: "Climate & Earth Sciences", icon: Globe2 },
  { name: "BarChart3", label: "Data Science & Analytics", icon: BarChart3 },
  { name: "Users", label: "Social & Behavioral Research", icon: Users },
  { name: "ShieldPlus", label: "Public Health & Safety", icon: ShieldPlus },
  { name: "Briefcase", label: "Business & Management", icon: Briefcase },
  { name: "GraduationCap", label: "Academic Education", icon: GraduationCap },
  { name: "BookOpen", label: "Humanities & Literature", icon: BookOpen },
  { name: "Library", label: "Law & Policy", icon: Library },
  { name: "FileText", label: "General Research", icon: FileText },
  { name: "Tag", label: "Special Focus Track", icon: Tag },
  { name: "Compass", label: "Interdisciplinary", icon: Compass },
  { name: "Shield", label: "Security & Governance", icon: Shield },
  { name: "TrendingUp", label: "Economics & Finance", icon: TrendingUp },
];

export function getSectionTopics(sec?: PageContentDTO | null): EditableTopic[] {
  if (!sec) return DEFAULT_TOPICS;
  try {
    if (sec.metaJson) {
      const meta = JSON.parse(sec.metaJson);
      if (Array.isArray(meta.topics) && meta.topics.length > 0) {
        return meta.topics;
      }
    }
  } catch {}
  return DEFAULT_TOPICS;
}

export interface HomeSectionMeta {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortDesc: string;
}

export const HOME_SECTION_CONFIG: Record<string, HomeSectionMeta> = {
  "hero-main": {
    label: "Hero Banner",
    icon: HomeIcon,
    shortDesc: "Main headline, ISSN badges, CTAs & featured research carousel",
  },
  "latest-research": {
    label: "Latest Research",
    icon: FileText,
    shortDesc: "Recently accepted and published scholarly articles",
  },
  "current-issue": {
    label: "Current Issue",
    icon: BookOpen,
    shortDesc: "Active volume/issue, cover metadata, and PDF downloads",
  },
  "most-read": {
    label: "Most Read",
    icon: TrendingUp,
    shortDesc: "Trending manuscripts and highest cited publications",
  },
  "explore-topics": {
    label: "Topics",
    icon: Tag,
    shortDesc: "Discipline categories and research faculty tracks",
  },
  "featured-journals": {
    label: "Featured",
    icon: Library,
    shortDesc: "Specialized biannual series and journal editions",
  },
  "call-for-papers": {
    label: "Call for Papers",
    icon: Megaphone,
    shortDesc: "Active thematic call deadlines and fast-track submission",
  },
  "research-community": {
    label: "Community",
    icon: Users,
    shortDesc: "Faculty spotlights and annual symposium announcements",
  },
  "home-faq": {
    label: "FAQ",
    icon: HelpCircle,
    shortDesc: "Frequently asked questions for prospective authors",
  },
  "journal-stats": {
    label: "Metrics & Stats",
    icon: BarChart2,
    shortDesc: "Editorial turnaround benchmarks, stats & newsletter alert",
  },
  "scope-tracks": {
    label: "Research Scope",
    icon: BookMarked,
    shortDesc: "Academic faculty scope and research tracks",
  },
};

export const ALL_PAGE_SECTION_CONFIGS: Record<
  string,
  Record<string, HomeSectionMeta>
> = {
  home: HOME_SECTION_CONFIG,
  about: {
    overview: {
      label: "Overview",
      icon: BookOpen,
      shortDesc: "Journal overview and academic background",
    },
    "aims-scope": {
      label: "Aims & Scope",
      icon: Compass,
      shortDesc: "Academic mission, research themes, and scope",
    },
    "indexing-metrics": {
      label: "Indexing & Metrics",
      icon: BarChart2,
      shortDesc: "ISSN details, indexing databases, and citation metrics",
    },
    indexing: {
      label: "Indexing & Metrics",
      icon: BarChart2,
      shortDesc: "ISSN details, indexing databases, and citation metrics",
    },
    mission: {
      label: "Mission & Vision",
      icon: Shield,
      shortDesc: "Publication mission and dedication to open science",
    },
  },
  "editorial-board": {
    leadership: {
      label: "Editor-in-Chief",
      icon: Users,
      shortDesc: "Editorial leadership and academic chairs",
    },
    "section-editors": {
      label: "Section Editors",
      icon: BookMarked,
      shortDesc: "Discipline-specific section editors and associate editors",
    },
    advisory: {
      label: "Advisory Council",
      icon: Shield,
      shortDesc: "International academic advisory council members",
    },
    "advisory-council": {
      label: "Advisory Council",
      icon: Shield,
      shortDesc: "International academic advisory council members",
    },
    governance: {
      label: "Editorial Charter",
      icon: FileText,
      shortDesc: "Editorial governance and appointment charter",
    },
    "governance-charter": {
      label: "Editorial Charter",
      icon: FileText,
      shortDesc: "Editorial governance and appointment charter",
    },
  },
  authors: {
    guidelines: {
      label: "Manuscript Prep",
      icon: PenLine,
      shortDesc: "Manuscript preparation and typography guidelines",
    },
    checklist: {
      label: "Checklist",
      icon: CheckCircle2,
      shortDesc: "Pre-submission verification checklist",
    },
    "submission-checklist": {
      label: "Checklist",
      icon: CheckCircle2,
      shortDesc: "Pre-submission verification checklist",
    },
    "apc-waiver": {
      label: "APC & Fee Policy",
      icon: Tag,
      shortDesc: "Article processing charge schedule and waiver policy",
    },
    templates: {
      label: "Templates",
      icon: FileText,
      shortDesc: "LaTeX and MS Word document submission templates",
    },
  },
  reviewers: {
    "review-protocol": {
      label: "Review Protocol",
      icon: CheckCircle2,
      shortDesc: "Double-blind evaluation protocol and workflow",
    },
    "peer-review-protocol": {
      label: "Review Protocol",
      icon: CheckCircle2,
      shortDesc: "Double-blind evaluation protocol and workflow",
    },
    guidelines: {
      label: "Guidelines",
      icon: FileText,
      shortDesc: "Peer reviewer responsibilities and criteria",
    },
    "evaluation-rubrics": {
      label: "Rubrics",
      icon: Sliders,
      shortDesc: "Manuscript evaluation rubrics and recommendation categories",
    },
    "reviewer-ethics": {
      label: "Ethics & COI",
      icon: Shield,
      shortDesc: "Conflict of interest disclosure and ethical standards",
    },
    recognition: {
      label: "Recognition",
      icon: BookmarkCheck,
      shortDesc: "Academic recognition and reviewer certificates",
    },
    "reviewer-benefits": {
      label: "Recognition",
      icon: BookmarkCheck,
      shortDesc: "Academic recognition and reviewer certificates",
    },
  },
  policies: {
    "peer-review": {
      label: "Double-Blind",
      icon: Users,
      shortDesc: "Double-blind evaluation framework and integrity",
    },
    "ethics-plagiarism": {
      label: "Ethics & Plagiarism",
      icon: Shield,
      shortDesc: "COPE compliance and plagiarism screening thresholds",
    },
    "open-access": {
      label: "Open Access",
      icon: BookOpen,
      shortDesc: "Creative Commons CC BY 4.0 license and terms",
    },
    "conflict-interest": {
      label: "Conflict of Interest",
      icon: AlertCircle,
      shortDesc: "Author and reviewer conflict disclosure protocols",
    },
  },
  issues: {
    "current-volume": {
      label: "Current Issue",
      icon: Layers,
      shortDesc: "Active volume release and cover narrative",
    },
    "archives-catalog": {
      label: "Archive Catalog",
      icon: BookOpen,
      shortDesc: "Published biannual issues archive directory",
    },
    "special-issues": {
      label: "Special Issues",
      icon: BookmarkCheck,
      shortDesc: "Special issue collections and call for guest editors",
    },
  },
  articles: {
    "directory-header": {
      label: "Articles Directory",
      icon: FileText,
      shortDesc: "Searchable research repository header",
    },
    "indexing-info": {
      label: "DOI & Metadata",
      icon: BarChart2,
      shortDesc: "Digital object identifier and CrossRef registry",
    },
    metrics: {
      label: "Metrics & Citations",
      icon: TrendingUp,
      shortDesc: "Citation metrics and turnaround stats",
    },
  },
  contact: {
    secretariat: {
      label: "Secretariat",
      icon: Phone,
      shortDesc: "Editorial secretariat contact details and emails",
    },
    "office-info": {
      label: "Secretariat",
      icon: Phone,
      shortDesc: "Editorial secretariat contact details and emails",
    },
    location: {
      label: "Campus Location",
      icon: HomeIcon,
      shortDesc: "Campus office address and building details",
    },
    support: {
      label: "Help Desk",
      icon: HelpCircle,
      shortDesc: "Editorial help desk and inquiry support",
    },
    inquiries: {
      label: "Inquiries",
      icon: PenLine,
      shortDesc: "Correspondence address and contact inquiry form",
    },
  },
};

export function getSectionMeta(pageKey: string, sectionKey: string, sectionTitle?: string): HomeSectionMeta {
  const pageConfig = ALL_PAGE_SECTION_CONFIGS[pageKey];
  if (pageConfig && pageConfig[sectionKey]) {
    return pageConfig[sectionKey];
  }
  if (HOME_SECTION_CONFIG[sectionKey]) {
    return HOME_SECTION_CONFIG[sectionKey];
  }

  // Generate a clean truncated label
  let label = sectionTitle || sectionKey;
  if (label.toLowerCase().includes("scope") || label.toLowerCase().includes("domain")) {
    label = "Research Scope";
  } else if (label.length > 18) {
    const words = label.split(/[\s&—:-]+/).filter(Boolean);
    if (words.length >= 2 && (words[0].length + words[1].length < 16)) {
      label = `${words[0]} ${words[1]}`;
    } else {
      label = label.slice(0, 16).trim() + "...";
    }
  }

  return {
    label,
    icon: Layers,
    shortDesc: sectionTitle || sectionKey,
  };
}

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

// Canonical sequence of sections matching the live homepage and page layouts
export const CANONICAL_SECTION_ORDER: Record<string, string[]> = {
  home: [
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
  ],
  about: [
    "overview",
    "aims-scope",
    "indexing-metrics",
    "indexing",
    "mission",
  ],
  "editorial-board": [
    "leadership",
    "section-editors",
    "advisory",
    "advisory-council",
    "governance",
    "governance-charter",
  ],
  authors: [
    "guidelines",
    "checklist",
    "submission-checklist",
    "apc-waiver",
    "templates",
  ],
  reviewers: [
    "review-protocol",
    "peer-review-protocol",
    "benefits",
    "reviewer-benefits",
    "ethics",
    "guidelines",
  ],
  policies: [
    "peer-review",
    "ethics-plagiarism",
    "open-access",
  ],
  contact: [
    "office-info",
    "editorial-contacts",
    "map-location",
  ],
};

export const sortSectionsByCanonicalOrder = (
  pageKey: string,
  sectionList: PageContentDTO[]
): PageContentDTO[] => {
  const canonicalList = CANONICAL_SECTION_ORDER[pageKey] || [];

  return [...sectionList]
    .sort((a, b) => {
      const orderA = a.displayOrder;
      const orderB = b.displayOrder;

      // If displayOrder is explicitly set on both and they differ, prioritize displayOrder
      if (typeof orderA === "number" && typeof orderB === "number" && orderA !== orderB) {
        return orderA - orderB;
      }

      const aKey = a.sectionKey;
      const bKey = b.sectionKey;

      const aIdx = canonicalList.indexOf(aKey);
      const bIdx = canonicalList.indexOf(bKey);

      // If both are in canonical sequence, sort strictly by homepage/page sequence
      if (aIdx !== -1 && bIdx !== -1) {
        return aIdx - bIdx;
      }
      // Canonical sections always precede custom/unknown ones
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;

      // Fall back to title
      return (a.title || aKey).localeCompare(b.title || bKey);
    })
    .map((sec, idx) => ({
      ...sec,
      displayOrder: typeof sec.displayOrder === "number" ? sec.displayOrder : idx + 1,
    }));
};

interface SectionHeaderBarProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  section: PageContentDTO;
  secIndex: number;
  totalSections: number;
  onMoveOrder: (index: number, direction: "up" | "down") => void;
  onTogglePublish: (section: PageContentDTO) => void;
  onEdit: () => void;
}

function SectionHeaderBar({
  icon: Icon,
  title,
  subtitle,
  badge,
  section,
  secIndex,
  totalSections,
  onMoveOrder,
  onTogglePublish,
  onEdit,
}: SectionHeaderBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-900 border border-blue-200">
              #{secIndex >= 0 ? secIndex + 1 : 1}
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {title}
            </h4>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
        {/* Reorder Arrows (Move Up / Move Down) */}
        <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => onMoveOrder(secIndex, "up")}
            disabled={secIndex <= 0}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 transition-all cursor-pointer"
            title="Move section up (earlier in page layout)"
            aria-label="Move section up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveOrder(secIndex, "down")}
            disabled={secIndex >= totalSections - 1}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 transition-all cursor-pointer"
            title="Move section down (later in page layout)"
            aria-label="Move section down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Realtime Visibility Switch */}
        <div className="inline-flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            {section.published ? (
              <Eye className="h-3 w-3 text-emerald-600" />
            ) : (
              <EyeOff className="h-3 w-3 text-slate-400" />
            )}
            <span>Visibility:</span>
          </span>
          <button
            type="button"
            onClick={() => onTogglePublish(section)}
            className={cn(
              "relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
              section.published ? "bg-emerald-500" : "bg-slate-300"
            )}
            role="switch"
            aria-checked={section.published}
            title={
              section.published
                ? "Click to turn off and hide on live page (save to apply)"
                : "Click to turn on and show on live page (save to apply)"
            }
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                section.published ? "translate-x-3.5" : "translate-x-0"
              )}
            />
          </button>
          <span
            className={cn(
              "text-[10.5px] font-bold",
              section.published ? "text-emerald-700" : "text-slate-500"
            )}
          >
            {section.published ? "Visible" : "Hidden"}
          </span>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>Edit Content</span>
        </button>
      </div>
    </div>
  );
}

const cmsCache: Record<string, { data: PageContentDTO[]; timestamp: number }> = {};

export function PageContentCMSPanel({ initialPageKey = "home" }: { initialPageKey?: string }) {
  const [activeTab, setActiveTab] = useState<string>(initialPageKey);
  const [sections, setSections] = useState<PageContentDTO[]>(() =>
    sortSectionsByCanonicalOrder(initialPageKey, cmsCache[initialPageKey]?.data || [])
  );
  const [loading, setLoading] = useState<boolean>(!cmsCache[initialPageKey]?.data || cmsCache[initialPageKey].data.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSectionByPage, setActiveSectionByPage] = useState<Record<string, string>>({
    home: "hero-main",
  });

  const currentSectionKey = useMemo(() => {
    const saved = activeSectionByPage[activeTab];
    if (saved && sections.some((s) => s.sectionKey === saved)) {
      return saved;
    }
    return sections[0]?.sectionKey || "";
  }, [activeSectionByPage, activeTab, sections]);

  const setCurrentSectionKey = (key: string) => {
    setActiveSectionByPage((prev) => ({
      ...prev,
      [activeTab]: key,
    }));
  };

  useEffect(() => {
    if (initialPageKey && initialPageKey !== activeTab) {
      setActiveTab(initialPageKey);
    }
  }, [initialPageKey]);

  useEffect(() => {
    if (sections.length > 0) {
      const current = activeSectionByPage[activeTab];
      if (!current || !sections.some((s) => s.sectionKey === current)) {
        setActiveSectionByPage((prev) => ({
          ...prev,
          [activeTab]: sections[0].sectionKey,
        }));
      }
    }
  }, [activeTab, sections]);



  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<PageContentDTO | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Preview & Confirm Modals
  const [previewSection, setPreviewSection] = useState<PageContentDTO | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<PageContentDTO | null>(null);
  const [articleToRemove, setArticleToRemove] = useState<{
    section?: PageContentDTO;
    articleId: string;
    articleTitle: string;
    articleAuthors?: string;
    isFromModal?: boolean;
  } | null>(null);
  const [isRemovingArticle, setIsRemovingArticle] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Topic Management Modal & Confirmation States
  const [isTopicModalOpen, setIsTopicModalOpen] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<EditableTopic | null>(null);
  const [topicTargetSection, setTopicTargetSection] = useState<PageContentDTO | null>(null);
  const [topicFormName, setTopicFormName] = useState<string>("");
  const [topicFormId, setTopicFormId] = useState<string>("");
  const [topicFormIcon, setTopicFormIcon] = useState<string>("Brain");
  const [topicFormHref, setTopicFormHref] = useState<string>("/articles?topic=");
  const [topicToDelete, setTopicToDelete] = useState<{
    section: PageContentDTO;
    topic: EditableTopic;
  } | null>(null);
  const [isSavingTopic, setIsSavingTopic] = useState<boolean>(false);

  // Pending layout/visibility changes and Save button states
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [isSavingPageChanges, setIsSavingPageChanges] = useState<boolean>(false);

  const generateSnapshot = (secs: PageContentDTO[]) => {
    return JSON.stringify(
      secs.map((s) => ({
        key: s.sectionKey,
        published: s.published !== false,
        displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : 0,
      }))
    );
  };

  const hasPendingChanges = useMemo(() => {
    if (!savedSnapshot || sections.length === 0) return false;
    return generateSnapshot(sections) !== savedSnapshot;
  }, [sections, savedSnapshot]);

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

  // Extract selected articles for hero section in the active view
  const getHeroSelectedArticles = (section: PageContentDTO) => {
    try {
      const meta = section.metaJson ? JSON.parse(section.metaJson) : {};
      let articleIds: string[] = [];
      if (Array.isArray(meta.selectedArticleIds) && meta.selectedArticleIds.length > 0) {
        articleIds = meta.selectedArticleIds;
      } else if (Array.isArray(meta.featuredSlides) && meta.featuredSlides.length > 0) {
        articleIds = meta.featuredSlides.map((s: any) => s.id || s.slug || s.title);
      } else {
        articleIds = initialArticles.slice(0, 4).map((a) => a.slug || a.id);
      }

      return articleIds.map((idOrSlug, index) => {
        const art =
          allArticles.find((a) => a.slug === idOrSlug || a.id === idOrSlug) ||
          initialArticles.find((a) => a.slug === idOrSlug || a.id === idOrSlug);

        const slide = Array.isArray(meta.featuredSlides)
          ? meta.featuredSlides.find(
              (s: any) => s.id === idOrSlug || s.slug === idOrSlug || s.title === idOrSlug
            )
          : null;

        const title = art?.title || slide?.title || idOrSlug;
        const authors = art?.authors
          ? Array.isArray(art.authors)
            ? art.authors.join(", ")
            : art.authors
          : slide?.authors || "Editorial Research Group";
        const topic = art?.topic || slide?.journalCategory || "Multidisciplinary Science";
        const volume = art?.volume
          ? `${art.volume}, ${art.issue || "Issue 1"}`
          : slide?.volumeIssue || "Vol. 14, No. 2";
        const doi = art?.doi || slide?.doi || "10.5555/gbj.2025";
        const image = art
          ? getArticleCover(art)
          : slide?.image || "/images/hero/molecular_inhibitors.jpg";
        const slug = art?.slug || art?.id || idOrSlug;

        return {
          id: idOrSlug,
          slug,
          title,
          authors,
          topic,
          volume,
          doi,
          image,
          slideNumber: index + 1,
        };
      });
    } catch {
      return [];
    }
  };

  const handleSaveHeroArticles = async (
    section: PageContentDTO,
    articleIds: string[]
  ) => {
    try {
      let currentMeta: Record<string, any> = {};
      if (section.metaJson) {
        try {
          currentMeta = JSON.parse(section.metaJson);
        } catch {
          currentMeta = {};
        }
      }
      currentMeta.selectedArticleIds = articleIds;
      currentMeta.featuredSlides = articleIds.map((id, index) => {
        const art =
          allArticles.find((a) => a.slug === id || a.id === id) ||
          initialArticles.find((a) => a.slug === id || a.id === id);
        return {
          id: art?.slug || id,
          num: String(index + 1).padStart(2, "0"),
          category: "FEATURED RESEARCH",
          journalCategory: art?.topic || "Multidisciplinary Science",
          isOpenAccess: true,
          title: art?.title || "Research Manuscript",
          shortTitle: art?.title || "Research Manuscript",
          authors: Array.isArray(art?.authors)
            ? art.authors.join(", ")
            : art?.authors || "Editorial Research Group",
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

      const updatedMetaJson = JSON.stringify(currentMeta, null, 2);
      await contentApi.updateSection(section.pageKey, section.sectionKey, {
        ...section,
        metaJson: updatedMetaJson,
      });

      setSections((prev) =>
        prev.map((s) =>
          s.pageKey === section.pageKey && s.sectionKey === section.sectionKey
            ? { ...s, metaJson: updatedMetaJson }
            : s
        )
      );

      if (cmsCache[section.pageKey]) {
        cmsCache[section.pageKey].data = cmsCache[section.pageKey].data.map((s) =>
          s.pageKey === section.pageKey && s.sectionKey === section.sectionKey
            ? { ...s, metaJson: updatedMetaJson }
            : s
        );
      }

      if (formSectionKey === section.sectionKey && formPageKey === section.pageKey) {
        setFormMetaJson(updatedMetaJson);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update hero publications.");
    }
  };

  const handleQuickReorderHeroArticle = async (
    section: PageContentDTO,
    currentIndex: number,
    direction: "up" | "down"
  ) => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const heroArticles = getHeroSelectedArticles(section);
    if (targetIndex < 0 || targetIndex >= heroArticles.length) return;

    const newArticleIds = heroArticles.map((a) => a.id);
    const temp = newArticleIds[currentIndex];
    newArticleIds[currentIndex] = newArticleIds[targetIndex];
    newArticleIds[targetIndex] = temp;

    await handleSaveHeroArticles(section, newArticleIds);
    toast.success("Hero slide lineup reordered successfully!");
  };

  const handleConfirmRemoveArticle = async () => {
    if (!articleToRemove) return;
    setIsRemovingArticle(true);
    try {
      if (articleToRemove.isFromModal) {
        handleRemoveArticleFromCarousel(articleToRemove.articleId);
      } else if (articleToRemove.section) {
        const heroArticles = getHeroSelectedArticles(articleToRemove.section);
        const newArticleIds = heroArticles
          .map((a) => a.id)
          .filter((id) => id !== articleToRemove.articleId);
        await handleSaveHeroArticles(articleToRemove.section, newArticleIds);
        toast.info("Publication removed from hero carousel.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to remove publication.");
    } finally {
      setIsRemovingArticle(false);
      setArticleToRemove(null);
    }
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
      setSavedSnapshot(generateSnapshot(cached.data));
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
      const sorted = sortSectionsByCanonicalOrder(pageKey, data || []);
      setSections(sorted);
      setSavedSnapshot(generateSnapshot(sorted));
      cmsCache[pageKey] = { data: sorted, timestamp: Date.now() };
    } catch (err: any) {
      console.warn("Failed to fetch admin content, fetching public published fallback:", err.message);
      try {
        const fallback = await contentApi.getPublished(pageKey);
        const sorted = sortSectionsByCanonicalOrder(pageKey, fallback || []);
        setSections(sorted);
        setSavedSnapshot(generateSnapshot(sorted));
        cmsCache[pageKey] = { data: sorted, timestamp: Date.now() };
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

  // Section tabs for currently active CMS page
  const pageSectionTabs = useMemo(() => {
    if (sections.length === 0) return [];

    return sections.map((sec) => {
      const pageConfig = ALL_PAGE_SECTION_CONFIGS[activeTab];
      const knownDef = pageConfig?.[sec.sectionKey] || HOME_SECTION_CONFIG[sec.sectionKey];

      if (knownDef) {
        return {
          key: sec.sectionKey,
          label: knownDef.label,
          icon: knownDef.icon,
          shortDesc: knownDef.shortDesc,
          isCustom: false,
          published: sec.published,
        };
      }

      // Format custom or unconfigured sections with clean short label
      let label = sec.title || sec.sectionKey;
      if (label.toLowerCase().includes("scope") || label.toLowerCase().includes("domain")) {
        label = "Research Scope";
      } else if (label.length > 16) {
        const words = label.split(/[\s&—:-]+/).filter(Boolean);
        label = words.slice(0, 2).join(" ");
      }

      return {
        key: sec.sectionKey,
        label,
        icon: FileText,
        shortDesc: sec.subtitle || `${sec.title || sec.sectionKey} section`,
        isCustom: !CORE_SECTION_KEYS.has(sec.sectionKey),
        published: sec.published,
      };
    });
  }, [activeTab, sections]);

  // Matches across all sections for search guidance
  const searchMatchesAcrossAll = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.subtitle?.toLowerCase().includes(q) ||
        s.sectionKey?.toLowerCase().includes(q) ||
        s.content?.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  // Filtered sections by active section tab and search
  const filteredSections = useMemo(() => {
    let result = sections;

    // When a section tab is selected, filter to only show that section
    if (currentSectionKey) {
      const match = result.filter((s) => s.sectionKey === currentSectionKey);
      if (match.length > 0) {
        result = match;
      }
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.subtitle?.toLowerCase().includes(q) ||
        s.sectionKey?.toLowerCase().includes(q) ||
        s.content?.toLowerCase().includes(q)
    );
  }, [sections, currentSectionKey, searchQuery]);

  // Active section metadata and sequential navigation for the active page
  const activeSectionMeta = useMemo(() => {
    return pageSectionTabs.find((t) => t.key === currentSectionKey) || null;
  }, [pageSectionTabs, currentSectionKey]);

  const currentSectionIndex = useMemo(() => {
    return sections.findIndex((s) => s.sectionKey === currentSectionKey);
  }, [currentSectionKey, sections]);

  const prevSectionKey = useMemo(() => {
    if (currentSectionIndex <= 0) return null;
    return sections[currentSectionIndex - 1]?.sectionKey || null;
  }, [currentSectionIndex, sections]);

  const nextSectionKey = useMemo(() => {
    if (currentSectionIndex === -1 || currentSectionIndex >= sections.length - 1) return null;
    return sections[currentSectionIndex + 1]?.sectionKey || null;
  }, [currentSectionIndex, sections]);

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

      // Broadcast visibility change to homepage in realtime
      broadcastSectionVisibility(formPageKey, payload.sectionKey, formPublished);

      setIsEditModalOpen(false);
      if (payload.sectionKey) {
        setActiveSectionByPage((prev) => ({
          ...prev,
          [formPageKey]: payload.sectionKey,
        }));
      }
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

  // Toggle Publish Status locally (Save button becomes active to persist)
  const handleTogglePublish = (section: PageContentDTO) => {
    const nextPublished = !section.published;
    setSections((prev) =>
      prev.map((s) =>
        s.pageKey === section.pageKey && s.sectionKey === section.sectionKey
          ? { ...s, published: nextPublished }
          : s
      )
    );
  };

  // Reorder Sections locally (Save button becomes active to persist)
  const handleMoveSectionOrder = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    const reordered = copy.map((sec, i) => ({
      ...sec,
      displayOrder: i + 1,
    }));

    setSections(reordered);
    setCurrentSectionKey(moved.sectionKey);
  };

  // Save Layout Order and Visibility Changes to Database
  const handleSavePageChanges = async () => {
    if (!hasPendingChanges || isSavingPageChanges) return;

    try {
      setIsSavingPageChanges(true);

      let oldList: Array<{ key: string; published: boolean; displayOrder: number }> = [];
      try {
        oldList = JSON.parse(savedSnapshot);
      } catch {}
      const oldMap = new Map(oldList.map((item) => [item.key, item]));

      // Identify changed sections
      const changedSections = sections.filter((s) => {
        const old = oldMap.get(s.sectionKey);
        if (!old) return true;
        return (
          (s.published !== false) !== old.published ||
          (s.displayOrder ?? 0) !== old.displayOrder
        );
      });

      let orderChanged = false;

      await Promise.all(
        changedSections.map(async (sec) => {
          await contentApi.updateSection(sec.pageKey, sec.sectionKey, {
            ...sec,
            published: sec.published !== false,
            displayOrder: sec.displayOrder,
          });

          const old = oldMap.get(sec.sectionKey);
          if (!old || (sec.published !== false) !== old.published) {
            broadcastSectionVisibility(sec.pageKey, sec.sectionKey, sec.published !== false);
          }
          if (!old || (sec.displayOrder ?? 0) !== old.displayOrder) {
            orderChanged = true;
          }
        })
      );

      if (orderChanged) {
        broadcastSectionOrderChange(activeTab);
      }

      // Update local CMS cache and saved snapshot
      cmsCache[activeTab] = { data: sections, timestamp: Date.now() };
      setSavedSnapshot(generateSnapshot(sections));

      toast.success("Page layout order and visibility changes saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save page changes.");
    } finally {
      setIsSavingPageChanges(false);
    }
  };

  // Discard Pending Changes
  const handleDiscardPageChanges = () => {
    if (!savedSnapshot) return;
    try {
      const list: Array<{ key: string; published: boolean; displayOrder: number }> =
        JSON.parse(savedSnapshot);
      const map = new Map(list.map((item) => [item.key, item]));

      const restored = [...sections]
        .map((s) => {
          const orig = map.get(s.sectionKey);
          if (!orig) return s;
          return {
            ...s,
            published: orig.published,
            displayOrder: orig.displayOrder,
          };
        })
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      setSections(restored);
      toast.info("Unsaved changes discarded.");
    } catch {}
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

  // Open Add Topic Modal
  const handleOpenAddTopic = (sec: PageContentDTO) => {
    setTopicTargetSection(sec);
    setEditingTopic(null);
    setTopicFormName("");
    setTopicFormId("");
    setTopicFormIcon("Brain");
    setTopicFormHref("/articles?topic=");
    setIsTopicModalOpen(true);
  };

  // Open Edit Topic Modal
  const handleOpenEditTopic = (sec: PageContentDTO, topic: EditableTopic) => {
    setTopicTargetSection(sec);
    setEditingTopic(topic);
    setTopicFormName(topic.name);
    setTopicFormId(topic.id);
    setTopicFormIcon(topic.iconName || "Brain");
    setTopicFormHref(topic.href);
    setIsTopicModalOpen(true);
  };

  // Save Topic (Add or Edit)
  const handleSaveTopic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicTargetSection) return;
    if (!topicFormName.trim()) {
      toast.error("Please enter a discipline name.");
      return;
    }

    const autoId =
      topicFormId.trim() ||
      topicFormName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newTopic: EditableTopic = {
      id: autoId,
      name: topicFormName.trim(),
      iconName: topicFormIcon || "Brain",
      href:
        topicFormHref.trim() ||
        `/articles?topic=${encodeURIComponent(topicFormName.trim())}`,
    };

    const currentTopics = getSectionTopics(topicTargetSection);
    let updatedTopics: EditableTopic[];

    if (editingTopic) {
      updatedTopics = currentTopics.map((t) =>
        t.id === editingTopic.id ? newTopic : t
      );
    } else {
      if (currentTopics.some((t) => t.id === newTopic.id)) {
        toast.error(`A discipline with ID "${newTopic.id}" already exists.`);
        return;
      }
      updatedTopics = [...currentTopics, newTopic];
    }

    try {
      setIsSavingTopic(true);
      let meta: Record<string, any> = {};
      try {
        meta = topicTargetSection.metaJson
          ? JSON.parse(topicTargetSection.metaJson)
          : {};
      } catch {
        meta = {};
      }

      const updatedMetaJson = JSON.stringify({ ...meta, topics: updatedTopics });
      await contentApi.updateSection(topicTargetSection.pageKey, topicTargetSection.sectionKey, {
        metaJson: updatedMetaJson,
      });

      // Update state locally immediately
      setSections((prev) =>
        prev.map((s) =>
          s.id === topicTargetSection.id ||
          (s.pageKey === topicTargetSection.pageKey &&
            s.sectionKey === topicTargetSection.sectionKey)
            ? { ...s, metaJson: updatedMetaJson }
            : s
        )
      );

      toast.success(
        editingTopic
          ? `Discipline "${newTopic.name}" updated successfully.`
          : `Discipline "${newTopic.name}" added successfully.`
      );
      setIsTopicModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save discipline.");
    } finally {
      setIsSavingTopic(false);
    }
  };

  // Confirm Delete Topic
  const handleConfirmDeleteTopic = async () => {
    if (!topicToDelete) return;
    const { section: sec, topic } = topicToDelete;
    const currentTopics = getSectionTopics(sec);
    const updatedTopics = currentTopics.filter((t) => t.id !== topic.id);

    try {
      setIsSavingTopic(true);
      let meta: Record<string, any> = {};
      try {
        meta = sec.metaJson ? JSON.parse(sec.metaJson) : {};
      } catch {
        meta = {};
      }

      const updatedMetaJson = JSON.stringify({ ...meta, topics: updatedTopics });
      await contentApi.updateSection(sec.pageKey, sec.sectionKey, {
        metaJson: updatedMetaJson,
      });

      setSections((prev) =>
        prev.map((s) =>
          s.id === sec.id ||
          (s.pageKey === sec.pageKey && s.sectionKey === sec.sectionKey)
            ? { ...s, metaJson: updatedMetaJson }
            : s
        )
      );

      toast.success(`Discipline "${topic.name}" deleted successfully.`);
      setTopicToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete discipline.");
    } finally {
      setIsSavingTopic(false);
    }
  };

  const currentTabInfo = PAGE_TABS.find((t) => t.id === activeTab) || PAGE_TABS[0];

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <DashboardHeaderActions>
        {hasPendingChanges && (
          <button
            type="button"
            onClick={handleDiscardPageChanges}
            disabled={isSavingPageChanges}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Discard</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSavePageChanges}
          disabled={!hasPendingChanges || isSavingPageChanges}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm",
            hasPendingChanges
              ? "bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] text-white cursor-pointer hover:shadow hover:-translate-y-0.5 ring-2 ring-blue-500/30"
              : "bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed opacity-75"
          )}
          title={
            hasPendingChanges
              ? "Click to save layout order and visibility changes"
              : "No unsaved changes"
          }
        >
          <Save className="h-4 w-4" />
          <span>
            {isSavingPageChanges
              ? "Saving Changes..."
              : hasPendingChanges
              ? "Save Changes"
              : "Saved"}
          </span>
          {hasPendingChanges && (
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </DashboardHeaderActions>



      {/* Reusable Section Tabs for all CMS Pages */}
      {sections.length > 0 && (
        <CmsSectionTabs
          title={`${currentTabInfo.label} Sections`}
          subtitle="Select a section tab to configure its layout, content, and visibility"
          icon={currentTabInfo.icon || Layers}
          tabs={pageSectionTabs}
          activeTabKey={currentSectionKey}
          onTabChange={setCurrentSectionKey}
          currentIndex={currentSectionIndex}
          totalCount={sections.length}
        />
      )}

      {/* Search & Filter Bar */}
      <DashboardSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={
          activeSectionMeta
            ? `Filter within ${activeSectionMeta.label} or search content...`
            : `Filter ${currentTabInfo.label} sections by title, key or content...`
        }
      >
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {sections.length > 0
            ? `Section ${currentSectionIndex >= 0 ? currentSectionIndex + 1 : 1} of ${sections.length}`
            : "0 Sections"}
        </span>
      </DashboardSearchFilterBar>

      {/* Search Guidance Banner when 0 results in current tab but found in other sections */}
      {filteredSections.length === 0 && searchMatchesAcrossAll.length > 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 text-center shadow-xs">
          <Search className="h-7 w-7 text-blue-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800">
            No matching content in "{activeSectionMeta?.label || currentSectionKey}"
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Matching content found in other sections of {currentTabInfo.label}:
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {searchMatchesAcrossAll.map((sec) => (
              <button
                key={sec.sectionKey}
                type="button"
                onClick={() => setCurrentSectionKey(sec.sectionKey)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer"
              >
                <span>
                  Switch to{" "}
                  {ALL_PAGE_SECTION_CONFIGS[activeTab]?.[sec.sectionKey]?.label ||
                    HOME_SECTION_CONFIG[sec.sectionKey]?.label ||
                    sec.title ||
                    sec.sectionKey}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

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
        <>
          <div className="space-y-3.5">
          {filteredSections.map((section, idx) => {
            const secIndex = sections.findIndex(
              (s) => s.pageKey === section.pageKey && s.sectionKey === section.sectionKey
            );

            return (
              <React.Fragment key={section.id || `${section.pageKey}-${section.sectionKey}`}>
                {/* 1. HERO BANNER & CAROUSEL SECTION */}
                {section.pageKey === "home" && section.sectionKey === "hero-main" && (() => {
                  let meta: Record<string, any> = {};
                  try {
                    meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                  } catch {
                    meta = {};
                  }
                  const heroArticles = getHeroSelectedArticles(section);

                  return (
                    <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={BookMarked}
                        title={section.title || "Academic Research Hero Banner & Carousel"}
                        subtitle={
                          section.subtitle ||
                          "Main headline, ISSN badges, CTAs & featured research carousel."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {heroArticles.length} Slides Active
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4-Column Key Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Sliders className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Active Carousel Slides
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {heroArticles.length} Featured Slides
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <RotateCcw className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Slide Transition
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            5-Second Auto-Advance
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Access Policy
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Gold Open Access
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Globe className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Indexing & DOI
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            CrossRef Registered
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Headline & Overview */}
                    {section.content && (
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>Hero Headline & Mission Statement</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                          {section.content}
                        </div>
                      </div>
                    )}

                    {/* Hero Carousel Slides Cards */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Selected Publications for Hero Carousel
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            {heroArticles.length} Active Slides
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          Featured research showcased in the hero visualizer
                        </span>
                      </div>

                      {heroArticles.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                          <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-700">No publications selected for hero carousel</p>
                          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                            Select publications from your repository to display them in the homepage hero slides.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {heroArticles.map((art, artIdx) => (
                            <div
                              key={art.id}
                              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
                            >
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                  <div className="flex flex-col items-center justify-center shrink-0">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1e40af] text-white font-mono text-xs font-bold shadow-2xs">
                                      {String(artIdx + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                      Slide
                                    </span>
                                  </div>

                                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                    <img
                                      src={art.image}
                                      alt=""
                                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70">
                                        {art.topic}
                                      </span>
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                        Open Access
                                      </span>
                                      {art.volume && (
                                        <span className="text-[10.5px] text-slate-400 font-mono">
                                          {art.volume}
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                      {art.title}
                                    </h5>

                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                                      <span className="flex items-center gap-1 text-slate-600 truncate max-w-[320px]">
                                        <Users className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{art.authors}</span>
                                      </span>
                                      {art.doi && (
                                        <span className="font-mono text-[10px] text-slate-400">
                                          DOI: {art.doi}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 border-t md:border-t-0 pt-2.5 md:pt-0 w-full md:w-auto justify-end">
                                  <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200/70">
                                    <button
                                      type="button"
                                      onClick={() => handleQuickReorderHeroArticle(section, artIdx, "up")}
                                      disabled={artIdx === 0}
                                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-25 transition-all cursor-pointer"
                                      title="Move slide earlier in carousel"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickReorderHeroArticle(section, artIdx, "down")}
                                      disabled={artIdx === heroArticles.length - 1}
                                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-25 transition-all cursor-pointer"
                                      title="Move slide later in carousel"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                  </div>

                                  <a
                                    href={`/articles/${art.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                                    title="View manuscript article page"
                                  >
                                    <ExternalLink className="h-3 w-3 text-slate-400" />
                                    <span className="hidden sm:inline">View</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setArticleToRemove({
                                        section,
                                        articleId: art.id,
                                        articleTitle: art.title,
                                        articleAuthors: art.authors,
                                      })
                                    }
                                    className="h-8 w-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                                    title="Remove from hero carousel (keeps article in repository)"
                                    aria-label="Remove from hero carousel"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 2. LATEST RESEARCH SECTION */}
              {section.pageKey === "home" && section.sectionKey === "latest-research" && (() => {
                let meta: Record<string, any> = {};
                try {
                  meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                } catch {
                  meta = {};
                }

                return (
                  <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={FileText}
                        title={section.title || "Latest Research"}
                        subtitle={
                          section.subtitle ||
                          "Recent breakthroughs and peer-reviewed scholarly papers from our global community."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {latestArticles.length} Manuscripts Active
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4-Column Key Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Shield className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Editorial Standard
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Double-Blind Peer Review
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Featured Manuscripts
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {latestArticles.length} Recent Papers
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Access License
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Open Access (CC-BY 4.0)
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <ExternalLink className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            View All Catalog Link
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {meta.viewAllText || "View all articles"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Scope & Description */}
                    {section.content && (
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>Curatorial Scope & Editorial Description</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                          {section.content}
                        </div>
                      </div>
                    )}

                    {/* Manuscripts List */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Latest Manuscripts Featured on Homepage
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            {latestArticles.length} Live Papers
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          4-column research showcase displayed to public visitors
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {latestArticles.map((art, artIdx) => (
                          <div
                            key={art.id}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
                          >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                <div className="flex flex-col items-center justify-center shrink-0">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1e40af] text-white font-mono text-xs font-bold shadow-2xs">
                                    {String(artIdx + 1).padStart(2, "0")}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                    Paper
                                  </span>
                                </div>

                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                  <img
                                    src={art.image}
                                    alt=""
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/80">
                                      {art.tags}
                                    </span>
                                    <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                      Peer Reviewed
                                    </span>
                                  </div>

                                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                    {art.title}
                                  </h5>

                                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                                    <span className="flex items-center gap-1 text-slate-600 truncate max-w-[280px]">
                                      <Users className="h-3 w-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{art.authors}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                      <Library className="h-3 w-3 text-slate-400 shrink-0" />
                                      <span>{art.journal}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-400">
                                      <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                      <span>{art.date}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <a
                                  href={art.articleHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <ExternalLink className="h-3 w-3 text-slate-400" />
                                  <span>View Article</span>
                                </a>
                                <a
                                  href={art.pdfHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <FileText className="h-3 w-3 text-slate-500" />
                                  <span>Download PDF</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 3. CURRENT ISSUE SECTION */}
              {section.pageKey === "home" && section.sectionKey === "current-issue" && (() => {
                let meta: Record<string, any> = {};
                try {
                  meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                } catch {
                  meta = {};
                }

                const journalName = meta.journalName || "Nexus Journal of Molecular Sciences";
                const volumeIssue = meta.volumeIssue || "Vol. 12, No. 4";
                const issueDate = meta.issueDate || section.subtitle || "May 2025";
                const publicationDate = meta.publicationDate || "May 15, 2025";
                const issnPrint = meta.issnPrint || "2073-8447";
                const issnOnline = meta.issnOnline || "2790-2188";
                const featuredPaperTitle =
                  meta.featuredPaperTitle ||
                  "Machine learning-guided discovery of allosteric inhibitors targeting emergent viral polymerases";
                const browseHref = meta.browseHref || "/issues/current";

                return (
                  <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={BookOpen}
                        title={section.title || "Current Issue — Active Edition"}
                        subtitle={
                          section.subtitle ||
                          "Active volume, issue metadata, cover graphic, and PDF downloads."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {volumeIssue}
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4-Column Key Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Library className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Journal Masthead
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {journalName}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Volume & Issue
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {volumeIssue}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Publication Date
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {publicationDate}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Tag className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Registered ISSNs
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            P: {issnPrint} | O: {issnOnline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Scope Card */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>Editorial Scope & Issue Overview</span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        {section.content ||
                          "This issue features cutting-edge research at the intersection of molecular biology, chemical biology, and computational science. Highlighted studies explore emerging therapeutic targets, novel biomolecular mechanisms, and innovative methodologies advancing precision medicine and translational discovery."}
                      </div>
                    </div>

                    {/* Lead Paper & Magazine Cover Showcase */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Active Issue Publication Showcase
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            Lead Issue Release
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          Cover visualizer and lead paper featured on the homepage
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row gap-5 items-center">
                        <div className="relative w-32 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border border-slate-300 shadow-md bg-[#061026]">
                          <img
                            src="/images/hero/molecular_inhibitors.jpg"
                            alt="Current Issue Cover"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-2 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-cyan-300 tracking-wider">GBJ</span>
                            <span className="text-[8px] font-medium text-white/90">{volumeIssue}</span>
                          </div>
                        </div>

                        <div className="space-y-2.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/80">
                              Featured Lead Research Paper
                            </span>
                            <span className="text-[10.5px] text-slate-500 font-medium">
                              {journalName} • {issueDate}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {featuredPaperTitle}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            Lead breakthrough paper featured on the issue cover with open-access repository distribution and full editorial commentary.
                          </p>

                          <div className="flex items-center gap-2.5 pt-1">
                            <a
                              href={browseHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Browse Complete Issue</span>
                            </a>
                            <a
                              href="/articles/community-healthcare-access-savar"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5 text-slate-400" />
                              <span>Read Featured Paper</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 4. MOST READ SECTION */}
              {section.pageKey === "home" && section.sectionKey === "most-read" && (() => {
                let meta: Record<string, any> = {};
                try {
                  meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                } catch {
                  meta = {};
                }

                return (
                  <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={TrendingUp}
                        title={section.title || "Most Read — Trending Publications"}
                        subtitle={
                          section.subtitle ||
                          "Trending manuscripts and highest cited publications across the academic network."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {mostReadArticles.length} Ranked Manuscripts
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4-Column Key Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Ranked Articles
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {mostReadArticles.length} Trending Papers
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Eye className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Peak Readership
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            12.4K+ Global Readers
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Evaluation Window
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Past 90 Days Rolling
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <BarChart2 className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Ranking Metric
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Views & Citations
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Scope (if present) */}
                    {section.content && (
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>Editorial Description</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                          {section.content}
                        </div>
                      </div>
                    )}

                    {/* Ranked Articles List */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Ranked Manuscripts Featured on Homepage
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            Top {mostReadArticles.length} Trending
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          Ordered by global readership and citation engagement
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {mostReadArticles.map((item, rIdx) => (
                          <div
                            key={item.rank}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
                          >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                <div className="flex flex-col items-center justify-center shrink-0">
                                  <span
                                    className={cn(
                                      "flex h-7 w-7 items-center justify-center rounded-xl font-mono text-xs font-bold shadow-2xs text-white",
                                      rIdx === 0 ? "bg-amber-500" : "bg-[#1e40af]"
                                    )}
                                  >
                                    {item.rank}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                    Rank #{rIdx + 1}
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/80">
                                      {item.type}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                                      <Eye className="h-3 w-3 text-slate-400" />
                                      <span>{item.views}</span>
                                    </span>
                                  </div>

                                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                    {item.title}
                                  </h5>

                                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                                    <span className="flex items-center gap-1 text-slate-600">
                                      <Library className="h-3 w-3 text-slate-400 shrink-0" />
                                      <span>{item.journal}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-400">
                                      <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                      <span>{item.date}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <ExternalLink className="h-3 w-3 text-slate-400" />
                                  <span>Read Paper</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 5. EXPLORE TOPICS SECTION */}
              {section.pageKey === "home" &&
                (section.sectionKey === "explore-topics" ||
                  section.sectionKey === "scope-tracks") &&
                (() => {
                  const topics = getSectionTopics(section);

                  return (
                    <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={Tag}
                        title={section.title || "Explore by Topic — Academic Disciplines"}
                        subtitle={
                          section.subtitle ||
                          "Discipline categories and research faculty tracks available for exploration."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {topics.length} Research Tracks
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                      {/* 4-Column Key Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Tag className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Discipline Tracks
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {topics.length} Subject Areas
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Compass className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Coverage Breadth
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              Multidisciplinary
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <Search className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Navigation Routing
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              Article Search Filters
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Repository Indexing
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              Full-Text Cross-Query
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Editorial Scope (if present) */}
                      {section.content && (
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                            <FileText className="h-3.5 w-3.5 text-blue-600" />
                            <span>Editorial Overview</span>
                          </div>
                          <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                            {section.content}
                          </div>
                        </div>
                      )}

                      {/* Topics Grid with Add / Edit / Delete */}
                      <div className="space-y-3 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                              Discipline Categories Featured on Homepage
                            </h5>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                              {topics.length} Disciplines
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                              Interactive faculty tracks directing authors and readers
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenAddTopic(section)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add Discipline</span>
                            </button>
                          </div>
                        </div>

                        {topics.length === 0 ? (
                          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                            <Tag className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-700">No discipline categories added yet</p>
                            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                              Add academic disciplines to categorize publications and guide research discovery on the homepage.
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenAddTopic(section)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-2xs"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add First Discipline</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {topics.map((topic) => {
                              const iconOption =
                                TOPIC_ICON_OPTIONS.find((opt) => opt.name === topic.iconName) ||
                                TOPIC_ICON_OPTIONS[0];
                              const IconComponent = iconOption.icon;

                              return (
                                <div
                                  key={topic.id}
                                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
                                >
                                  <div>
                                    {/* Top Row: Icon on left, Edit & Delete buttons on right */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-2xs shrink-0">
                                        <IconComponent className="h-5 w-5" />
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditTopic(section, topic)}
                                          className="h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                          title={`Edit ${topic.name}`}
                                          aria-label={`Edit ${topic.name}`}
                                        >
                                          <Edit className="h-3.5 w-3.5" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            setTopicToDelete({
                                              section,
                                              topic,
                                            })
                                          }
                                          className="h-7 w-7 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                          title={`Delete ${topic.name}`}
                                          aria-label={`Delete ${topic.name}`}
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Name & ID */}
                                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                                      {topic.name}
                                    </h5>
                                    <p className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                                      ID: {topic.id}
                                    </p>
                                  </div>

                                  {/* Bottom: Scholarly Track & Browse link */}
                                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-slate-500">
                                      Scholarly Track
                                    </span>
                                    <a
                                      href={topic.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                                    >
                                      <span>Browse</span>
                                      <ArrowRight className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* 6. FEATURED JOURNALS SECTION */}
              {section.pageKey === "home" && section.sectionKey === "featured-journals" && (() => {
                return (
                  <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={Library}
                        title={section.title || "Featured Journals — Specialized Editions"}
                        subtitle={
                          section.subtitle ||
                          "Specialized biannual series and peer-reviewed journal editions."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {featuredJournals.length} Active Journals
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4-Column Key Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Library className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Featured Serials
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {featuredJournals.length} Indexed Serials
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Shield className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Editorial Model
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Continuous Online Publishing
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Globe className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Global Impact
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Worldwide Citation Index
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Access Model
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Open Access Repository
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Scope */}
                    {section.content && (
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>Editorial Overview</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                          {section.content}
                        </div>
                      </div>
                    )}

                    {/* Journal Cards List */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Specialized Journals Featured on Homepage
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            {featuredJournals.length} Active Serials
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          High-impact peer-reviewed journals published under Nexus Press
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {featuredJournals.map((fj, fjIdx) => (
                          <div
                            key={fj.id}
                            className="group rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
                          >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                                <div className="relative h-20 w-16 sm:h-22 sm:w-18 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                  <img
                                    src={fj.image}
                                    alt=""
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/80">
                                      {fj.category}
                                    </span>
                                    <span className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1">
                                      <BookOpen className="h-3 w-3 text-slate-400" />
                                      <span>{fj.latestIssue}</span>
                                    </span>
                                  </div>

                                  <h5 className="text-sm font-bold text-slate-900 leading-snug">
                                    {fj.title}
                                  </h5>

                                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                    {fj.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <a
                                  href={fj.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <ExternalLink className="h-3 w-3 text-slate-400" />
                                  <span>View Journal</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 7. CALL FOR PAPERS SECTION */}
              {section.pageKey === "home" &&
                (section.sectionKey === "call-for-papers" ||
                  section.sectionKey === "calls-for-papers") &&
                (() => {
                  let meta: Record<string, any> = {};
                  try {
                    meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                  } catch {
                    meta = {};
                  }

                  const badge = meta.badge || "Active Call";
                  const deadline = meta.deadline || "October 31, 2026";
                  const targetVolume = meta.targetVolume || "Volume 14, Issue 2";
                  const fastTrack = meta.fastTrack || "Available / 2-Week Window";

                  return (
                    <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={Megaphone}
                        title={section.title || "Call for Papers — Upcoming Issue"}
                        subtitle={
                          section.subtitle ||
                          "Submission Deadline: October 31, 2026 | Fast-Track Review Available"
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {badge}
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                      {/* 4-Column Key Parameters Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Tag className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Call Status Badge
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {badge}
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Calendar className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Submission Deadline
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {deadline}
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Target Volume & Issue
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {targetVolume}
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Fast-Track Review
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {fastTrack}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Editorial Scope & Invitation Card */}
                      {section.content && (
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                            <FileText className="h-3.5 w-3.5 text-blue-600" />
                            <span>Editorial Scope & Manuscript Invitation</span>
                          </div>
                          <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                            {section.content}
                          </div>
                        </div>
                      )}

                      {/* Thematic Special Issue Tracks List */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                              Thematic Special Issues Featured on Homepage
                            </h5>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                              {specialIssueCalls.length} Special Issues
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                            Multidisciplinary thematic research calls
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {specialIssueCalls.map((call, cIdx) => (
                            <div
                              key={call.id}
                              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
                            >
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1e40af] text-white font-mono text-xs font-bold shadow-2xs shrink-0">
                                    {String(cIdx + 1).padStart(2, "0")}
                                  </span>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span
                                        className={cn(
                                          "text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200/80",
                                          call.badgeColor
                                        )}
                                      >
                                        {call.badge}
                                      </span>
                                      <span className="text-[11px] font-medium text-slate-500">
                                        {call.journal}
                                      </span>
                                    </div>

                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                                      {call.title}
                                    </h5>

                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                                      <span className="flex items-center gap-1 text-slate-600">
                                        <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span>Submission Deadline: {call.deadline}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                  <a
                                    href={call.href || "/articles"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <ExternalLink className="h-3 w-3 text-slate-400" />
                                    <span>View Track</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* 8. RESEARCH COMMUNITY SECTION */}
              {section.pageKey === "home" && section.sectionKey === "research-community" && (() => {
                return (
                  <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={Users}
                        title={section.title || "From Our Research Community"}
                        subtitle={
                          section.subtitle ||
                          "Faculty spotlights, author interviews, and annual symposium announcements."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {communityArticles.length} Community Highlights
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4-Column Key Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Users className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Active Features
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {communityArticles.length} Spotlight Stories
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Play className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Media Formats
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Interviews, Recaps & Video
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Megaphone className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Outreach Lead
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Author Outreach Committee
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Globe className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Community Reach
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            Global Academic Network
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Scope */}
                    {section.content && (
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>Editorial Description</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                          {section.content}
                        </div>
                      </div>
                    )}

                    {/* Community Articles List */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Community Highlights Featured on Homepage
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            {communityArticles.length} Featured Highlights
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          Author interviews, symposium recaps, and video discussions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {communityArticles.map((ca, caIdx) => (
                          <div
                            key={ca.id}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
                          >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                <div className="flex flex-col items-center justify-center shrink-0">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1e40af] text-white font-mono text-xs font-bold shadow-2xs">
                                    {String(caIdx + 1).padStart(2, "0")}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                    Story
                                  </span>
                                </div>

                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                  <img
                                    src={ca.image}
                                    alt=""
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/80">
                                      {ca.tag}
                                    </span>
                                    {ca.isVideo && (
                                      <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                                        <Play className="h-2.5 w-2.5" />
                                        <span>Video Recording</span>
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                                    {ca.title}
                                  </h5>

                                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                    {ca.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <a
                                  href={ca.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <ExternalLink className="h-3 w-3 text-slate-400" />
                                  <span>{ca.actionText}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 9. HOME FAQ SECTION */}
              {section.pageKey === "home" &&
                (section.sectionKey === "home-faq" || section.sectionKey === "faq") &&
                (() => {
                  return (
                    <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={HelpCircle}
                        title={section.title || "Frequently Asked Questions — Author Guidance"}
                        subtitle={
                          section.subtitle ||
                          "Frequently asked questions for prospective authors, peer reviewers, and researchers."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            {FAQ_ITEMS.length} Questions & Answers
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                      {/* 4-Column Key Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <HelpCircle className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Guidance Questions
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {FAQ_ITEMS.length} Author Q&As
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <FileText className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Key Topics
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              Scope, Review, APCs, Access
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <Shield className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Review Protocol
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              Double-Blind Evaluation
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Mail className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Author Support
                            </p>
                            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              Editorial Desk Helpdesk
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Editorial Scope (if present) */}
                      {section.content && (
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2">
                          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                            <FileText className="h-3.5 w-3.5 text-blue-600" />
                            <span>Editorial Overview</span>
                          </div>
                          <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                            {section.content}
                          </div>
                        </div>
                      )}

                      {/* FAQ Cards List */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                              Frequently Asked Questions Featured on Homepage
                            </h5>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                              {FAQ_ITEMS.length} Author Q&As
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                            Clear guidelines covering submissions, timelines, and open scholarship
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {FAQ_ITEMS.map((faq, fIdx) => (
                            <div
                              key={faq.id}
                              className="group rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-2.5"
                            >
                              <div className="flex items-start gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1e40af] text-white font-mono text-[11px] font-bold shadow-2xs shrink-0 mt-0.5">
                                  Q{fIdx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/80">
                                      {faq.category}
                                    </span>
                                  </div>
                                  <h5 className="text-sm font-bold text-slate-900 leading-snug">
                                    {faq.question}
                                  </h5>
                                </div>
                              </div>

                              {faq.highlight && (
                                <div className="ml-9 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2 text-xs font-semibold text-blue-900">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                  <span>{faq.highlight}</span>
                                </div>
                              )}

                              <div className="ml-9 text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 font-sans">
                                {faq.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* 10. JOURNAL STATS & NEWSLETTER SECTION */}
              {section.pageKey === "home" && section.sectionKey === "journal-stats" && (() => {
                let meta: Record<string, any> = {};
                try {
                  meta = section.metaJson ? JSON.parse(section.metaJson) : {};
                } catch {
                  meta = {};
                }

                const articlesPublished = meta.articlesPublished || "12,486+";
                const globalReaders = meta.globalReaders || "85,000+";
                const acceptanceRate = meta.acceptanceRate || "34%";
                const reviewersActive = meta.reviewersActive || "140+";
                const newsletterTitle = meta.newsletterTitle || "Stay Updated — Research Newsletter";
                const newsletterSubtitle =
                  meta.newsletterSubtitle ||
                  "Subscribe to our newsletter for the latest research highlights, journal updates, and open access content.";

                return (
                  <div className="space-y-4">
                      {/* Section Header Bar */}
                      <SectionHeaderBar
                        icon={BarChart2}
                        title={section.title || "Advancing knowledge. Driving impact."}
                        subtitle={
                          section.subtitle ||
                          "Key highlights, editorial turnaround benchmarks & newsletter alert."
                        }
                        badge={
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/80">
                            Live Impact Metrics
                          </span>
                        }
                        section={section}
                        secIndex={secIndex}
                        totalSections={sections.length}
                        onMoveOrder={handleMoveSectionOrder}
                        onTogglePublish={handleTogglePublish}
                        onEdit={() => openEditModal(section)}
                      />

                    {/* 4 Live Key Metrics Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Articles Published
                          </p>
                          <p className="text-base font-extrabold text-slate-900 truncate font-mono">
                            {articlesPublished}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-medium">Peer-Reviewed Papers</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Global Readers
                          </p>
                          <p className="text-base font-extrabold text-slate-900 truncate font-mono">
                            {globalReaders}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-medium">Annual Active Scholars</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Acceptance Rate
                          </p>
                          <p className="text-base font-extrabold text-slate-900 truncate font-mono">
                            {acceptanceRate}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-medium">Selective Peer Review</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Active Reviewers
                          </p>
                          <p className="text-base font-extrabold text-slate-900 truncate font-mono">
                            {reviewersActive}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-medium">Subject Specialists</p>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Turnaround Benchmarks Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Editorial Turnaround & SLA Benchmarks
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70">
                            Verified Academic SLAs
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          Average turnaround from submission to publication
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            <span>Initial Desk Screening</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 font-mono mt-1">3–5 Business Days</p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">Editorial scope and plagiarism clearance</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                            <Clock className="h-3.5 w-3.5 text-indigo-600" />
                            <span>First Review Decision</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 font-mono mt-1">4–6 Weeks</p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">Independent double-blind peer review</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Production to DOI</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 font-mono mt-1">48 Hours</p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">Online publication post-acceptance</p>
                        </div>
                      </div>
                    </div>

                    {/* Newsletter Box Preview */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                        <Mail className="h-3.5 w-3.5 text-blue-600" />
                        <span>{newsletterTitle}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                          Active Dispatch Portal
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        {newsletterSubtitle}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* 11. GENERAL SECTION LAYOUT (FALLBACK FOR ANY OTHER PAGE OR CUSTOM SECTIONS) */}
              {!(
                section.pageKey === "home" &&
                [
                  "hero-main",
                  "latest-research",
                  "current-issue",
                  "most-read",
                  "explore-topics",
                  "scope-tracks",
                  "featured-journals",
                  "call-for-papers",
                  "calls-for-papers",
                  "research-community",
                  "home-faq",
                  "faq",
                  "journal-stats",
                ].includes(section.sectionKey)
              ) && (
                <div
                  className={cn(
                    "group rounded-2xl border bg-white p-5 transition-all duration-200 shadow-xs hover:shadow-md space-y-3.5",
                    section.published
                      ? "border-[color:var(--color-gb-border)] hover:border-blue-300"
                      : "border-amber-200 bg-amber-50/20"
                  )}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                        {(() => {
                          const IconComponent =
                            ALL_PAGE_SECTION_CONFIGS[section.pageKey]?.[section.sectionKey]?.icon ||
                            HOME_SECTION_CONFIG[section.sectionKey]?.icon ||
                            Layers;
                          return <IconComponent className="h-5 w-5" />;
                        })()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center justify-center h-5 w-5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10.5px] font-bold">
                            #{secIndex >= 0 ? secIndex + 1 : idx + 1}
                          </span>
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80">
                            {section.sectionKey}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-academic mt-1 truncate">
                          {section.title}
                        </h4>
                        {section.subtitle && (
                          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                            {section.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      {/* Reorder Arrows (Move Up / Move Down) */}
                      <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200/90 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleMoveSectionOrder(secIndex, "up")}
                          disabled={secIndex <= 0}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-25 transition-all cursor-pointer"
                          title="Move section up (earlier in page layout)"
                          aria-label="Move section up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSectionOrder(secIndex, "down")}
                          disabled={secIndex >= sections.length - 1}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-25 transition-all cursor-pointer"
                          title="Move section down (later in page layout)"
                          aria-label="Move section down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Section Visibility Switch */}
                      <div className="inline-flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
                        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                          {section.published ? (
                            <Eye className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-slate-400" />
                          )}
                          <span>Visibility:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(section)}
                          className={cn(
                            "relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                            section.published ? "bg-emerald-500" : "bg-slate-300"
                          )}
                          role="switch"
                          aria-checked={section.published}
                          title={
                            section.published
                              ? "Click to turn off and hide on live page in realtime"
                              : "Click to turn on and show on live page in realtime"
                          }
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                              section.published ? "translate-x-3.5" : "translate-x-0"
                            )}
                          />
                        </button>
                        <span
                          className={cn(
                            "text-[10.5px] font-bold",
                            section.published ? "text-emerald-700" : "text-slate-500"
                          )}
                        >
                          {section.published ? "Visible" : "Hidden"}
                        </span>
                      </div>

                      <button
                        onClick={() => openEditModal(section)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Content</span>
                      </button>

                      {!CORE_SECTION_KEYS.has(section.sectionKey) && section.id && (
                        <button
                          onClick={() => setSectionToDelete(section)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-rose-700 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Remove custom section"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    {section.content && (
                      <div className="rounded-xl bg-slate-50/80 p-3.5 text-xs text-slate-700 leading-relaxed border border-slate-200/60 font-sans whitespace-pre-line line-clamp-3">
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
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-medium bg-slate-100/90 text-slate-700 border border-slate-200/80"
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
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        </div>

        {/* Sequential Navigation Footer across all CMS Pages */}
        {sections.length > 1 && filteredSections.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
            <div>
              {prevSectionKey ? (
                <button
                  type="button"
                  onClick={() => setCurrentSectionKey(prevSectionKey)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    Previous:{" "}
                    {ALL_PAGE_SECTION_CONFIGS[activeTab]?.[prevSectionKey]?.label ||
                      HOME_SECTION_CONFIG[prevSectionKey]?.label ||
                      prevSectionKey}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">
                Section {currentSectionIndex + 1} of {sections.length}
              </span>
            </div>

            <div>
              {nextSectionKey ? (
                <button
                  type="button"
                  onClick={() => setCurrentSectionKey(nextSectionKey)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-all cursor-pointer"
                >
                  <span>
                    Next:{" "}
                    {ALL_PAGE_SECTION_CONFIGS[activeTab]?.[nextSectionKey]?.label ||
                      HOME_SECTION_CONFIG[nextSectionKey]?.label ||
                      nextSectionKey}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Final Section</span>
                </div>
              )}
            </div>
          </div>
        )}
        </>
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

          {/* Dedicated Section Visibility Settings Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs",
                    formPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {formPublished ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span>Section Visibility on Live Page</span>
                    <span
                      className={cn(
                        "text-[10.5px] font-bold px-2 py-0.5 rounded-full border",
                        formPublished
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      )}
                    >
                      {formPublished ? "Visible (Turned On)" : "Hidden (Turned Off)"}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formPublished
                      ? "This section is currently visible to readers. Turn off and save to immediately hide it on the live page in realtime."
                      : "This section is currently turned off and hidden from public visitors on the live page."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFormPublished(!formPublished)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                    formPublished ? "bg-emerald-500" : "bg-slate-300"
                  )}
                  role="switch"
                  aria-checked={formPublished}
                  title={formPublished ? "Turn off visibility" : "Turn on visibility"}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                      formPublished ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-xs font-bold w-14",
                    formPublished ? "text-emerald-700" : "text-slate-500"
                  )}
                >
                  {formPublished ? "Visible" : "Hidden"}
                </span>
              </div>
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
                    <p className="text-[11px] text-slate-400 mt-1">Select articles from the repository below to display them on the homepage.</p>
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
                              onClick={() => {
                                const art =
                                  allArticles.find((a) => a.slug === artId || a.id === artId) ||
                                  initialArticles.find((a) => a.slug === artId || a.id === artId);
                                setArticleToRemove({
                                  articleId: artId,
                                  articleTitle: art?.title || "Research Publication",
                                  articleAuthors:
                                    typeof art?.authors === "string"
                                      ? art.authors
                                      : Array.isArray(art?.authors)
                                      ? art.authors.join(", ")
                                      : undefined,
                                  isFromModal: true,
                                });
                              }}
                              className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer ml-1"
                              title="Unselect from homepage hero (publication remains safely in repository)"
                              aria-label="Unselect from carousel"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

      {/* Remove Publication from Hero Carousel Confirmation Modal */}
      <CustomModal
        isOpen={!!articleToRemove}
        onClose={() => {
          if (!isRemovingArticle) setArticleToRemove(null);
        }}
        title="Remove Publication from Carousel?"
        className="max-w-md"
      >
        {articleToRemove && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
              <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {articleToRemove.articleTitle}
                </p>
                {articleToRemove.articleAuthors && (
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {articleToRemove.articleAuthors}
                  </p>
                )}
                <div className="mt-2.5 pt-2 border-t border-rose-200/60">
                  <p className="text-[11.5px] text-rose-800 leading-relaxed">
                    This publication will be unselected from the homepage hero carousel.
                    The research manuscript remains <strong>completely safe</strong> in the publications repository.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setArticleToRemove(null)}
                disabled={isRemovingArticle}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveArticle}
                disabled={isRemovingArticle}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isRemovingArticle ? "Removing..." : "Remove from Hero"}
              </button>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Add / Edit Discipline Category Modal */}
      <CustomModal
        isOpen={isTopicModalOpen}
        onClose={() => {
          if (!isSavingTopic) setIsTopicModalOpen(false);
        }}
        title={editingTopic ? "Edit Discipline Category" : "Add Discipline Category"}
        description={
          editingTopic
            ? "Modify discipline title, tracking ID, faculty icon, or exploration route."
            : "Create a new academic discipline category to feature on the homepage."
        }
        className="max-w-lg"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Discipline Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topicFormName}
              onChange={(e) => {
                const val = e.target.value;
                setTopicFormName(val);
                if (!editingTopic) {
                  const generated = val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                  setTopicFormId(generated);
                  setTopicFormHref(`/articles?topic=${encodeURIComponent(val)}`);
                }
              }}
              placeholder="e.g. Artificial Intelligence, Molecular Biology"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Discipline ID / Slug
              </label>
              <input
                type="text"
                value={topicFormId}
                onChange={(e) => setTopicFormId(e.target.value)}
                placeholder="e.g. ai, medicine"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-colors"
              />
              <p className="text-[10.5px] text-slate-400 mt-1">Unique identifier used for faculty track keying</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Browse Route / URL
              </label>
              <input
                type="text"
                value={topicFormHref}
                onChange={(e) => setTopicFormHref(e.target.value)}
                placeholder="/articles?topic=Technology"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-colors"
              />
              <p className="text-[10.5px] text-slate-400 mt-1">Target link when readers click Browse</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Category Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 max-h-48 overflow-y-auto">
              {TOPIC_ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = topicFormIcon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setTopicFormIcon(opt.name)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center",
                      isSelected
                        ? "border-blue-500 bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
                    )}
                    title={opt.label}
                  >
                    <IconComp className="h-4 w-4 shrink-0" />
                    <span className="text-[9.5px] truncate w-full mt-1">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTopicModalOpen(false)}
              disabled={isSavingTopic}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingTopic || !topicFormName.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {isSavingTopic
                ? "Saving..."
                : editingTopic
                ? "Update Discipline"
                : "Add Discipline"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Delete Discipline Category Confirmation Modal */}
      <CustomModal
        isOpen={Boolean(topicToDelete)}
        onClose={() => {
          if (!isSavingTopic) setTopicToDelete(null);
        }}
        title="Delete Discipline Category?"
        className="max-w-md"
      >
        {topicToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
              <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {topicToDelete.topic.name}
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  ID: {topicToDelete.topic.id}
                </p>
                <div className="mt-2.5 pt-2 border-t border-rose-200/60">
                  <p className="text-[11.5px] text-rose-800 leading-relaxed">
                    This discipline category will be removed from the homepage explore tracks and public navigation.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTopicToDelete(null)}
                disabled={isSavingTopic}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTopic}
                disabled={isSavingTopic}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isSavingTopic ? "Deleting..." : "Yes, Delete Discipline"}
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
