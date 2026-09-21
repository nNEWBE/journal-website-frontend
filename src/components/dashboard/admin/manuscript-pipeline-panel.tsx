"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ClipboardCheck,
  Search,
  SearchX,
  X,
  Plus,
  Clock,
  UserCheck,
  MoreVertical,
  Download,
  BookOpen,
  User as UserIcon,
  Calendar,
  FileText,
  ChevronRight,
  ShieldCheck,
  Eye,
  RefreshCw,
  Rocket,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  submissions as seedSubmissions,
  type Role,
  type Submission,
} from "@/lib/data";
import { editorApi } from "@/lib/api";
import { statusConfig } from "../workspace/workspace-data";
import { DashboardStatsGrid } from "../workspace/dashboard-stats-grid";
import { PipelineContentSkeleton } from "../workspace/pipeline-content-skeleton";
import { CustomDrawer } from "@/components/ui/drawer";
import { AssignReviewerModal } from "../workspace/assign-reviewer-modal";
import { PublishToIssueModal } from "../workspace/publish-to-issue-modal";
import { EditorialDecisionModal } from "../workspace/editorial-decision-modal";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { CustomSelect } from "@/components/ui/custom-select";
import { DashboardTableHeader } from "@/components/dashboard/dashboard-table-header";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { ActiveFilterBar, type ActiveFilterChip } from "@/components/dashboard/active-filter-bar";
import { formatDateTime, formatDate, cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function getStatusConfig(status: string) {
  return (
    statusConfig[status] ?? {
      label: status,
      classes: "bg-slate-50 text-slate-600 border-slate-200",
      icon: FileText,
    }
  );
}

function StatusPill({ status }: { status: string }) {
  const cfg = getStatusConfig(status);
  const StatusIcon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${cfg.classes}`}
    >
      <StatusIcon className="h-3 w-3 shrink-0" />
      {cfg.label}
    </span>
  );
}

function RowActionsDropdown({
  sub,
  triggerAssignReviewer,
  triggerViewInfo,
  triggerPublish,
  triggerDecision,
}: {
  sub: Submission;
  triggerAssignReviewer: (sub: Submission) => void;
  triggerViewInfo: (sub: Submission) => void;
  triggerPublish: (sub: Submission) => void;
  triggerDecision: (sub: Submission) => void;
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
      const menuWidth = 230;
      const menuHeight = 220;
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
    <div className="inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
          isOpen && "bg-slate-100 text-slate-700 ring-2 ring-slate-200"
        )}
        title="Manuscript Actions"
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
              {/* Header inside menu showing manuscript identity */}
              <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-slate-100 mb-1">
                <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 text-slate-600 font-bold text-xs">
                  <FileText className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                    {sub.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                    {sub.id} · {sub.author}
                  </p>
                </div>
              </div>

              {/* Inspect Manuscript */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerViewInfo(sub);
                }}
                className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
              >
                <Eye className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>Inspect Manuscript</span>
              </button>

              {/* Schedule & Publish to Issue (for accepted or in-production papers) */}
              {(sub.status === "ACCEPTED" ||
                sub.status === "COPYEDITING" ||
                sub.status === "PROOFING" ||
                sub.status === "SCHEDULED") && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    triggerPublish(sub);
                  }}
                  className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <Rocket className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Schedule & Publish to Issue</span>
                </button>
              )}

              {/* Make Editorial Decision (for under-review or submitted papers) */}
              {sub.status !== "PUBLISHED" &&
                sub.status !== "REJECTED" &&
                sub.status !== "ACCEPTED" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      triggerDecision(sub);
                    }}
                    className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <ShieldCheck className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                    <span>Make Editorial Decision</span>
                  </button>
                )}

              {/* Assign Reviewers */}
              {sub.status !== "PUBLISHED" && sub.status !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    triggerAssignReviewer(sub);
                  }}
                  className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <UserCheck className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                  <span>Assign Reviewers</span>
                </button>
              )}

              {/* View in Publications (if already published) */}
              {sub.status === "PUBLISHED" && (
                <Link
                  href="/dashboard/publications"
                  onClick={() => setIsOpen(false)}
                  className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-950 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <BookOpen className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
                  <span>View in Publications</span>
                </Link>
              )}

              {/* Download Files */}
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  toast.success(`Downloading assets for ${sub.id}...`);
                }}
                className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
              >
                <Download className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>Download Files</span>
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

let pipelineCache: { data: Submission[]; timestamp: number } | null = null;

export function ManuscriptPipelinePanel() {
  const [submissions, setSubmissions] = useState<Submission[]>(() => pipelineCache?.data || []);
  const [isLoading, setIsLoading] = useState(() => !pipelineCache);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modals & Drawers
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedForPublish, setSelectedForPublish] = useState<Submission | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedForDecision, setSelectedForDecision] = useState<Submission | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const handlePublishedSuccess = (updatedSub: Submission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? { ...s, status: "PUBLISHED" } : s))
    );
    if (pipelineCache) {
      pipelineCache = {
        ...pipelineCache,
        data: pipelineCache.data.map((s) =>
          s.id === updatedSub.id ? { ...s, status: "PUBLISHED" } : s
        ),
      };
    }
    if (selectedSubmission?.id === updatedSub.id) {
      setSelectedSubmission({ ...selectedSubmission, status: "PUBLISHED" });
    }
  };

  const handleDecisionSuccess = (updatedSub: Submission, decision: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
    if (pipelineCache) {
      pipelineCache = {
        ...pipelineCache,
        data: pipelineCache.data.map((s) =>
          s.id === updatedSub.id ? updatedSub : s
        ),
      };
    }
    if (selectedSubmission?.id === updatedSub.id) {
      setSelectedSubmission(updatedSub);
    }
  };

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (pipelineCache && Date.now() - pipelineCache.timestamp < 45000) {
        setSubmissions(pipelineCache.data);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await editorApi.listSubmissions();
        if (res?.content && Array.isArray(res.content) && res.content.length > 0) {
          const formatted = res.content.map((item: any) => ({
            ...item,
            updated: formatDateTime(item.updated || item.updatedAt || item.createdAt),
            due: formatDate(item.due),
          }));
          setSubmissions(formatted);
          pipelineCache = { data: formatted, timestamp: Date.now() };
        } else if (!pipelineCache) {
          setSubmissions(seedSubmissions);
        }
      } catch (err) {
        if (!pipelineCache) {
          setSubmissions(seedSubmissions);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await editorApi.listSubmissions();
      if (res?.content && Array.isArray(res.content) && res.content.length > 0) {
        const formatted = res.content.map((item: any) => ({
          ...item,
          updated: formatDateTime(item.updated || item.updatedAt || item.createdAt),
          due: formatDate(item.due),
        }));
        setSubmissions(formatted);
        pipelineCache = { data: formatted, timestamp: Date.now() };
      }
      toast.success("Pipeline synchronized with backend");
    } catch {
      toast.info("Pipeline refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCleanLabel = (str?: string) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const statusOptions = useMemo(() => {
    const presentStatuses = new Set<string>();
    submissions.forEach((s) => {
      if (s.status) presentStatuses.add(s.status);
    });

    const standardStatuses = [
      { key: "SUBMITTED", label: "Submitted" },
      { key: "DRAFT", label: "Draft" },
      { key: "WITH_EDITOR", label: "Awaiting Editor" },
      { key: "INITIAL_CHECK", label: "In Desk Review" },
      { key: "UNDER_REVIEW", label: "Under Review" },
      { key: "REVIEWER_INVITATION", label: "Reviewer Invitation" },
      { key: "REVIEWS_COMPLETE", label: "Reviews Complete" },
      { key: "REVISION_REQUESTED", label: "Revisions Requested" },
      { key: "COPYEDITING", label: "Copyediting" },
      { key: "PROOFING", label: "Proofing" },
      { key: "SCHEDULED", label: "Scheduled" },
      { key: "ACCEPTED", label: "Accepted" },
      { key: "PUBLISHED", label: "Published" },
      { key: "REJECTED", label: "Rejected" },
    ];

    const options: { value: string; label: string }[] = [
      { value: "all", label: "All Statuses" },
    ];

    const addedCleanLabels = new Set<string>();
    // 1. Add standard statuses that are present in the submissions
    standardStatuses.forEach((std) => {
      const isPresent = Array.from(presentStatuses).some(
        (st) =>
          st.toLowerCase() === std.key.toLowerCase() ||
          st.toLowerCase() === std.label.toLowerCase() ||
          st.toLowerCase().replace(/_/g, " ") === std.label.toLowerCase() ||
          (std.label === "Awaiting Editor" && (st.toLowerCase() === "with_editor" || st.toLowerCase() === "with editor")) ||
          (std.label === "In Desk Review" && (st.toLowerCase() === "initial_check" || st.toLowerCase() === "initial check"))
      );
      if (isPresent && !addedCleanLabels.has(std.label.toLowerCase())) {
        options.push({ value: std.label, label: std.label });
        addedCleanLabels.add(std.label.toLowerCase());
      }
    });

    // 2. Add other present statuses with clean Title Case labels
    presentStatuses.forEach((st) => {
      const clean = formatCleanLabel(st);
      if (!addedCleanLabels.has(clean.toLowerCase())) {
        options.push({ value: clean, label: clean });
        addedCleanLabels.add(clean.toLowerCase());
      }
    });

    // 3. Append remaining standard statuses that weren't present
    standardStatuses.forEach((std) => {
      if (!addedCleanLabels.has(std.label.toLowerCase())) {
        options.push({ value: std.label, label: std.label });
        addedCleanLabels.add(std.label.toLowerCase());
      }
    });

    return options;
  }, [submissions]);

  const topicOptions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => {
      const t = s.topic || (s as any).track;
      if (t) set.add(formatCleanLabel(t));
    });
    return [
      { value: "all", label: "All Disciplines" },
      ...Array.from(set).sort().map((t) => ({ value: t, label: t })),
    ];
  }, [submissions]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => {
      if (s.type) set.add(formatCleanLabel(s.type));
    });
    return [
      { value: "all", label: "All Types" },
      ...Array.from(set).sort().map((t) => ({ value: t, label: t })),
    ];
  }, [submissions]);

  const sortOptions = [
    { value: "newest", label: "Recently Updated" },
    { value: "oldest", label: "Oldest First" },
    { value: "score_desc", label: "Highest Review Score" },
    { value: "score_asc", label: "Lowest Review Score" },
  ];

  const filtered = useMemo(() => {
    let result = submissions;
    if (statusFilter !== "all") {
      const sf = statusFilter.toLowerCase().replace(/_/g, " ");
      result = result.filter((s) => {
        const st = (s.status || "").toLowerCase().replace(/_/g, " ");
        const isDirectMatch =
          st === sf ||
          s.status?.toLowerCase() === statusFilter.toLowerCase() ||
          s.status?.toLowerCase().replace(/_/g, " ") === sf;
        if (isDirectMatch) return true;

        const isWithEditor =
          (st === "with editor" || st === "awaiting editor") &&
          (sf === "with editor" || sf === "awaiting editor");
        if (isWithEditor) return true;

        const isDeskReview =
          (st === "initial check" || st === "in desk review") &&
          (sf === "initial check" || sf === "in desk review");
        if (isDeskReview) return true;

        const isRevision =
          (st === "revisions requested" || st === "revision requested") &&
          (sf === "revisions requested" || sf === "revision requested");
        if (isRevision) return true;

        return false;
      });
    }
    if (topicFilter !== "all") {
      result = result.filter((s) => {
        const t = formatCleanLabel(s.topic || (s as any).track || "");
        return t.toLowerCase() === topicFilter.toLowerCase();
      });
    }
    if (typeFilter !== "all") {
      result = result.filter((s) => {
        const t = formatCleanLabel(s.type || "");
        return t.toLowerCase() === typeFilter.toLowerCase();
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) =>
        [s.id, s.title, s.status, s.author, s.topic, s.type, ...(s.reviewers || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return (new Date(a.updated || 0).getTime() || 0) - (new Date(b.updated || 0).getTime() || 0);
      }
      if (sortBy === "score_desc") {
        return (b.score || 0) - (a.score || 0);
      }
      if (sortBy === "score_asc") {
        return (a.score || 0) - (b.score || 0);
      }
      return (new Date(b.updated || 0).getTime() || 0) - (new Date(a.updated || 0).getTime() || 0);
    });
  }, [submissions, searchQuery, statusFilter, topicFilter, typeFilter, sortBy]);

  const chips = useMemo(() => {
    const list: ActiveFilterChip[] = [];
    if (searchQuery.trim()) {
      list.push({
        id: "search",
        label: `Keyword: "${searchQuery.trim()}"`,
        colorClass: "bg-blue-50 text-blue-700",
        onRemove: () => setSearchQuery(""),
      });
    }
    if (statusFilter !== "all") {
      const matchedLabel =
        statusOptions.find(
          (o) => o.value.toLowerCase() === statusFilter.toLowerCase()
        )?.label || formatCleanLabel(statusFilter);
      list.push({
        id: "status",
        label: `Status: ${matchedLabel}`,
        colorClass: "bg-indigo-50 text-indigo-700",
        onRemove: () => setStatusFilter("all"),
      });
    }
    if (topicFilter !== "all") {
      list.push({
        id: "topic",
        label: `Discipline: ${topicFilter}`,
        colorClass: "bg-teal-50 text-teal-700",
        onRemove: () => setTopicFilter("all"),
      });
    }
    if (typeFilter !== "all") {
      list.push({
        id: "type",
        label: `Type: ${typeFilter}`,
        colorClass: "bg-amber-50 text-amber-800",
        onRemove: () => setTypeFilter("all"),
      });
    }
    if (sortBy !== "newest") {
      const sortLabel = sortOptions.find((o) => o.value === sortBy)?.label || sortBy;
      list.push({
        id: "sort",
        label: `Sort: ${sortLabel}`,
        colorClass: "bg-slate-100 text-slate-700",
        onRemove: () => setSortBy("newest"),
      });
    }
    return list;
  }, [searchQuery, statusFilter, topicFilter, typeFilter, sortBy, statusOptions]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTopicFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
  };


  function handleAssignReviewerSubmit(subId: string, reviewerName: string) {
    const newSubs = submissions.map((s) => {
      if (s.id !== subId) return s;
      const reviewers = Array.from(new Set([...s.reviewers, reviewerName]));
      const status = s.status === "Awaiting Editor" ? "Under Review" : s.status;
      return { ...s, reviewers, status, updated: "Just now" };
    });
    setSubmissions(newSubs);
    toast.success(`Assigned ${reviewerName} to ${subId}.`);
  }

  function updateDueDate(id: string, newDate: string) {
    const newSubs = submissions.map((s) =>
      s.id === id ? { ...s, due: newDate, updated: "Just now" } : s
    );
    setSubmissions(newSubs);
    toast.success(`Due date updated to ${newDate}.`);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <DashboardHeaderActions>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Refresh Pipeline"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>
        <Link
          href="/dashboard/submissions/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Submission</span>
        </Link>
      </DashboardHeaderActions>

      {/* KPI Stats Cards */}
      <DashboardStatsGrid submissions={submissions} isLoading={!mounted || isLoading} />

      {/* Filter Dropdowns Row using CustomSelect */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3.5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Manuscript Status
            </label>
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              size="form"
              placeholder="All Statuses"
              className="w-full"
              triggerClassName="h-9 min-h-9 rounded-xl border-slate-200/90 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Discipline / Track
            </label>
            <CustomSelect
              options={topicOptions}
              value={topicFilter}
              onChange={setTopicFilter}
              size="form"
              placeholder="All Disciplines"
              className="w-full"
              triggerClassName="h-9 min-h-9 rounded-xl border-slate-200/90 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Article Type
            </label>
            <CustomSelect
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              size="form"
              placeholder="All Types"
              className="w-full"
              triggerClassName="h-9 min-h-9 rounded-xl border-slate-200/90 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Sort By
            </label>
            <CustomSelect
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              size="form"
              placeholder="Sort By"
              className="w-full"
              triggerClassName="h-9 min-h-9 rounded-xl border-slate-200/90 text-xs font-medium"
            />
          </div>
        </div>

        {/* Active Filter Bar */}
        <ActiveFilterBar
          totalCount={submissions.length}
          filteredCount={filtered.length}
          itemLabel="manuscripts"
          chips={chips}
          onResetAll={resetAllFilters}
          className="px-0 pt-3 pb-0 bg-transparent border-t border-slate-100"
        />
      </div>

      {/* Main Pipeline Table Card */}
      {!mounted || (isLoading && submissions.length === 0) ? (
        <PipelineContentSkeleton rows={6} />
      ) : (
        <div className="rounded-2xl border border-(--color-gb-border) bg-white shadow-xs overflow-hidden">
          {/* Table Header Controls */}
          <DashboardTableHeader
            icon={ClipboardCheck}
            title="Active Manuscripts"
            totalCount={filtered.length}
            subtitle="double-blind peer review"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search manuscripts, authors, IDs..."
          />

          {/* Content */}
          {filtered.length === 0 ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No Manuscripts Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {searchQuery && statusFilter !== "all"
                ? `No records match "${searchQuery}" with status "${statusFilter}".`
                : searchQuery
                ? `No records match your query "${searchQuery}".`
                : `No manuscripts currently found with status "${statusFilter}".`}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-3.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto overflow-y-visible overscroll-y-auto">
              <Table minWidth={780}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-slate-400 font-mono text-[11px]">#</TableHead>
                    {["Manuscript", "Status", "Reviewers", "Score", "Due Date", "Actions"].map((h) => (
                      <TableHead
                        key={h}
                        className={h === "Actions" ? "text-right" : ""}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((sub, idx) => (
                    <TableRow key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <TableCell className="text-slate-400 font-mono text-[11px] w-12">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="max-w-75">
                        <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {sub.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {sub.type} · {sub.author}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={sub.status} />
                        <p
                          className="mt-1 text-[10px] text-slate-500 flex items-center gap-1 font-medium whitespace-nowrap"
                          suppressHydrationWarning
                        >
                          <Clock className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                          {formatDateTime(sub.updated || (sub as any).updatedAt || (sub as any).createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        {sub.reviewers?.length ? (
                          <div className="space-y-0.5">
                            {sub.reviewers.map((r, i) => (
                              <p
                                key={i}
                                className="text-[10px] font-semibold text-slate-700 whitespace-nowrap"
                              >
                                {r}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-slate-400">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${sub.score >= 80
                                ? "bg-emerald-500"
                                : sub.score >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                                }`}
                              style={{ width: `${sub.score}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-slate-800">
                            {sub.score}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CustomDatePicker
                          value={sub.due}
                          onChange={(d) => updateDueDate(sub.id, d)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <RowActionsDropdown
                          sub={sub}
                          triggerAssignReviewer={(s) => {
                            setSelectedSubmission(s);
                            setIsAssignModalOpen(true);
                          }}
                          triggerViewInfo={(s) => {
                            setSelectedSubmission(s);
                            setIsInfoModalOpen(true);
                          }}
                          triggerPublish={(s) => {
                            setSelectedForPublish(s);
                            setIsPublishModalOpen(true);
                          }}
                          triggerDecision={(s) => {
                            setSelectedForDecision(s);
                            setIsDecisionModalOpen(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((sub, idx) => (
                <div key={sub.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        #{idx + 1}
                      </span>
                      <h4 className="mt-0.5 text-xs font-bold text-slate-900 leading-snug">
                        {sub.title}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {sub.type} · {sub.author}
                      </p>
                    </div>
                    <StatusPill status={sub.status} />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium" suppressHydrationWarning>
                      <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                      {formatDateTime(sub.updated || (sub as any).updatedAt || (sub as any).createdAt)}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span>Score: <strong className="text-slate-800 font-sans">{sub.score}</strong></span>
                      <span suppressHydrationWarning>Due: {formatDate(sub.due)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <RowActionsDropdown
                      sub={sub}
                      triggerAssignReviewer={(s) => {
                        setSelectedSubmission(s);
                        setIsAssignModalOpen(true);
                      }}
                      triggerViewInfo={(s) => {
                        setSelectedSubmission(s);
                        setIsInfoModalOpen(true);
                      }}
                      triggerPublish={(s) => {
                        setSelectedForPublish(s);
                        setIsPublishModalOpen(true);
                      }}
                      triggerDecision={(s) => {
                        setSelectedForDecision(s);
                        setIsDecisionModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      )}

      {/* Manuscript Detail Drawer */}
      <CustomDrawer
        isOpen={isInfoModalOpen && Boolean(selectedSubmission)}
        onClose={() => setIsInfoModalOpen(false)}
        title={selectedSubmission?.title || "Manuscript Details"}
        description={
          selectedSubmission
            ? `${(selectedSubmission as any).track || selectedSubmission.type} • ID: ${selectedSubmission.id}`
            : undefined
        }
        icon={BookOpen}
        size="xl"
        badge={
          selectedSubmission ? (() => {
            const cfg = getStatusConfig(selectedSubmission.status);
            const StatusIcon = cfg.icon;
            return (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}
              >
                <StatusIcon className="h-3 w-3" />
                {cfg.label}
              </span>
            );
          })() : null
        }
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.success("Downloading manuscript package...")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Files</span>
              </button>

              {(selectedSubmission?.status === "ACCEPTED" ||
                selectedSubmission?.status === "COPYEDITING" ||
                selectedSubmission?.status === "PROOFING" ||
                selectedSubmission?.status === "SCHEDULED") && (
                <button
                  type="button"
                  onClick={() => {
                    setIsInfoModalOpen(false);
                    setSelectedForPublish(selectedSubmission);
                    setIsPublishModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Rocket className="h-3.5 w-3.5" />
                  <span>Schedule & Publish</span>
                </button>
              )}

              {selectedSubmission?.status !== "PUBLISHED" &&
                selectedSubmission?.status !== "REJECTED" &&
                selectedSubmission?.status !== "ACCEPTED" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsInfoModalOpen(false);
                      setSelectedForDecision(selectedSubmission);
                      setIsDecisionModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Editorial Decision</span>
                  </button>
                )}

              {selectedSubmission?.status === "PUBLISHED" && (
                <Link
                  href="/dashboard/publications"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View in Publications</span>
                </Link>
              )}
            </div>
          </div>
        }
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Editorial Governance & Production Stage Banner */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
              {(selectedSubmission.status === "ACCEPTED" ||
                selectedSubmission.status === "COPYEDITING" ||
                selectedSubmission.status === "PROOFING" ||
                selectedSubmission.status === "SCHEDULED") && (
                <div className="rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50/80 via-white to-blue-50/30 p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                        <Rocket className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          Ready for Issue Scheduling & DOI Minting
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Peer review is complete and manuscript is accepted. Assign Volume, Issue & mint official CrossRef DOI.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForPublish(selectedSubmission);
                        setIsPublishModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <Rocket className="h-3.5 w-3.5" />
                      <span>Schedule & Publish to Issue</span>
                    </button>
                  </div>
                </div>
              )}

              {(selectedSubmission.status === "SUBMITTED" ||
                selectedSubmission.status === "INITIAL_CHECK" ||
                selectedSubmission.status === "WITH_EDITOR" ||
                selectedSubmission.status === "UNDER_REVIEW" ||
                selectedSubmission.status === "REVISION_REQUESTED") && (
                <div className="rounded-xl border border-blue-100 bg-linear-to-r from-blue-50/70 via-slate-50 to-white p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          Peer Review & Editorial Evaluation
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Assign double-blind referees, evaluate peer reviews, or record an official editorial decision.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAssignModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span>Assign Reviewer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedForDecision(selectedSubmission);
                          setIsDecisionModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gb-blue hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Make Decision</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedSubmission.status === "PUBLISHED" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        Published in Official Research Repository
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Official DOI registered • Sequenced in journal volume • Live metrics active.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/publications"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <span>View in Publications</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Author info */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <UserIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Corresponding Author
                  </p>
                  <p className="text-xs font-extrabold text-slate-800">
                    {selectedSubmission.author}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last Updated / Submitted
                  </p>
                  <p className="text-xs font-extrabold text-slate-800" suppressHydrationWarning>
                    {formatDateTime((selectedSubmission as any).submittedDate || selectedSubmission.updated || (selectedSubmission as any).updatedAt || (selectedSubmission as any).createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract */}
            {((selectedSubmission as any).abstractText || (selectedSubmission as any).abstract) && (
              <div className="space-y-2 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Abstract
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 wrap-break-word break-all whitespace-pre-wrap">
                  {(selectedSubmission as any).abstractText || (selectedSubmission as any).abstract}
                </p>
              </div>
            )}

            {/* Attached Documents */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Attached Documents ({selectedSubmission.files?.length || 0})
              </h3>
              {selectedSubmission.files && selectedSubmission.files.length > 0 ? (
                <div className="space-y-2">
                  {selectedSubmission.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {file.originalFilename || "Manuscript Document"}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {file.fileType || "PDF"} {file.sizeBytes ? `• ${(file.sizeBytes / 1024).toFixed(0)} KB` : ""}
                          </span>
                        </div>
                      </div>
                      {file.downloadUrl && (
                        <a
                          href={file.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors shrink-0"
                        >
                          <span>Open PDF</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                  No document files attached.
                </p>
              )}
            </div>

            {/* Reviewers Assigned */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Peer Reviewers ({selectedSubmission.reviewers?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSubmission.reviewers && selectedSubmission.reviewers.length > 0 ? (
                  selectedSubmission.reviewers.map((r, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No reviewers assigned yet
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CustomDrawer>

      {/* Assign Modal */}
      <AssignReviewerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        submission={selectedSubmission}
        onAssign={handleAssignReviewerSubmit}
      />

      {/* Publish to Issue Modal */}
      <PublishToIssueModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setSelectedForPublish(null);
        }}
        submission={selectedForPublish}
        onPublished={handlePublishedSuccess}
      />

      {/* Editorial Decision Modal */}
      <EditorialDecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false);
          setSelectedForDecision(null);
        }}
        submission={selectedForDecision}
        onDecisionMade={handleDecisionSuccess}
        onOpenPublishModal={(sub) => {
          setSelectedForPublish(sub);
          setIsPublishModalOpen(true);
        }}
      />
    </div>
  );
}
