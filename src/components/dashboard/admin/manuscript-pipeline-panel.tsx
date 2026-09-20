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
  CheckCircle2,
  RefreshCw,
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
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { CustomSelect } from "@/components/ui/custom-select";
import { DashboardTableHeader } from "@/components/dashboard/dashboard-table-header";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
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
  canAdvance,
  advanceSubmission,
  triggerAssignReviewer,
  triggerViewInfo,
}: {
  sub: Submission;
  canAdvance: boolean;
  advanceSubmission: (id: string) => void;
  triggerAssignReviewer: (sub: Submission) => void;
  triggerViewInfo: (sub: Submission) => void;
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

              {/* Assign Reviewers */}
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

              {/* Advance Workflow */}
              {canAdvance && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    advanceSubmission(sub.id);
                  }}
                  className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <CheckCircle2 className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                  <span>Advance Workflow</span>
                </button>
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

  // Modals & Drawers
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

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

  const statusOptions = useMemo(() => {
    const presentStatuses = new Set<string>();
    submissions.forEach((s) => {
      if (s.status) presentStatuses.add(s.status);
    });

    const standardStatuses = [
      "Awaiting Editor",
      "Under Review",
      "In Desk Review",
      "Reviews Complete",
      "Revisions Requested",
      "Revision Requested",
      "Accepted",
      "Published",
      "Rejected",
    ];

    const ordered: string[] = [];
    standardStatuses.forEach((st) => {
      if (presentStatuses.has(st)) {
        ordered.push(st);
        presentStatuses.delete(st);
      }
    });
    presentStatuses.forEach((st) => ordered.push(st));
    standardStatuses.forEach((st) => {
      if (!ordered.includes(st)) ordered.push(st);
    });

    return [
      { value: "all", label: "All Statuses" },
      ...ordered.map((st) => ({ value: st, label: st })),
    ];
  }, [submissions]);

  const filtered = useMemo(() => {
    let result = submissions;
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) =>
        [s.id, s.title, s.status, s.author, ...(s.reviewers || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return result;
  }, [submissions, searchQuery, statusFilter]);

  function advanceSubmission(id: string) {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    const transitions: Record<string, string> = {
      "Awaiting Editor": "Under Review",
      "Under Review": "Reviews Complete",
      "Reviews Complete": "Accepted",
      Accepted: "Published",
      "Revision Requested": "Revised Manuscript Submitted",
      "Revised Manuscript Submitted": "Under Review",
    };
    const nextStatus = transitions[sub.status] ?? "Under Review";
    const newSubs = submissions.map((s) =>
      s.id === id ? { ...s, status: nextStatus, updated: "Just now" } : s
    );
    setSubmissions(newSubs);
    toast.success(`Status advanced to "${nextStatus}".`);
  }

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
          >
            {/* Status Filter Select */}
            <div className="w-full sm:w-44 md:w-48 shrink-0">
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
          </DashboardTableHeader>

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
                          canAdvance={true}
                          advanceSubmission={advanceSubmission}
                          triggerAssignReviewer={(s) => {
                            setSelectedSubmission(s);
                            setIsAssignModalOpen(true);
                          }}
                          triggerViewInfo={(s) => {
                            setSelectedSubmission(s);
                            setIsInfoModalOpen(true);
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
                      canAdvance={true}
                      advanceSubmission={advanceSubmission}
                      triggerAssignReviewer={(s) => {
                        setSelectedSubmission(s);
                        setIsAssignModalOpen(true);
                      }}
                      triggerViewInfo={(s) => {
                        setSelectedSubmission(s);
                        setIsInfoModalOpen(true);
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
            <button
              type="button"
              onClick={() => toast.success("Downloading manuscript package...")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download All Files</span>
            </button>
          </div>
        }
      >
        {selectedSubmission && (
          <div className="space-y-6">
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
    </div>
  );
}
