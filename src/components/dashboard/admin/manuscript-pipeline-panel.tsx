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
import { CustomDrawer } from "@/components/ui/drawer";
import { AssignReviewerModal } from "../workspace/assign-reviewer-modal";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
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
    openUp: boolean;
  }>({ top: 0, left: 0, openUp: false });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < 220;
      const top = openUp ? rect.top : rect.bottom + 6;
      const left = rect.right - 208;
      setMenuCoords({ top, left: Math.max(16, left), openUp });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-ink)] shadow-2xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        title="Actions options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: menuCoords.openUp ? "auto" : `${menuCoords.top}px`,
              bottom: menuCoords.openUp
                ? `${window.innerHeight - menuCoords.top + 6}px`
                : "auto",
              left: `${menuCoords.left}px`,
              zIndex: 999999,
            }}
            className="w-52 rounded-xl border border-[color:var(--color-gb-border)] bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              Actions · {sub.id}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerViewInfo(sub);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Inspect Manuscript</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerAssignReviewer(sub);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Assign Reviewers</span>
            </button>

            {canAdvance && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  advanceSubmission(sub.id);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Advance Workflow</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                toast.success(`Downloading assets for ${sub.id}...`);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-t border-slate-100 mt-1 pt-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Files</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}

export function ManuscriptPipelinePanel() {
  const [submissions, setSubmissions] = useState<Submission[]>(seedSubmissions);
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
      try {
        const res = await editorApi.listSubmissions();
        if (res?.content && Array.isArray(res.content) && res.content.length > 0) {
          setSubmissions(res.content);
        }
      } catch (err) {
        // Fallback to baseline seed data
      }
    }
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await editorApi.listSubmissions();
      if (res?.content && Array.isArray(res.content) && res.content.length > 0) {
        setSubmissions(res.content);
      }
      toast.success("Pipeline synchronized with backend");
    } catch {
      toast.info("Pipeline refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

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
          className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Submission</span>
        </Link>
      </DashboardHeaderActions>

      {/* KPI Stats Cards */}
      <DashboardStatsGrid submissions={submissions} />

      {/* Main Pipeline Table Card */}
      <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[color:var(--color-gb-border)] px-4 sm:px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[color:var(--color-gb-blue-soft)] flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[color:var(--color-gb-ink)] uppercase tracking-wider">
                Active Manuscripts
              </h2>
              <p className="text-[11px] text-slate-500" suppressHydrationWarning>
                {mounted ? `${filtered.length} record${filtered.length !== 1 ? "s" : ""}` : "Loading..."} · double-blind peer review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-gb-border)] bg-white px-3 py-1.5 focus-within:border-[color:var(--color-gb-blue)] focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-2xs">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manuscripts, authors, IDs..."
                className="w-48 sm:w-64 bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {!mounted ? (
          <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-[color:var(--color-gb-blue)] border-t-transparent animate-spin mb-2.5" />
            <span>Synchronizing manuscript pipeline...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No Manuscripts Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              No records match your query &quot;{searchQuery}&quot;. Clear search filter or verify submission ID.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear Search
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
                  {filtered.map((sub) => (
                    <TableRow key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <TableCell className="max-w-[300px]">
                        <span className="font-mono text-[10px] font-black text-[color:var(--color-gb-red)]">
                          {sub.id}
                        </span>
                        <p className="mt-0.5 text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {sub.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {sub.type} · {sub.author}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={sub.status} />
                        <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="h-2.5 w-2.5" />
                          {sub.updated}
                        </p>
                      </TableCell>
                      <TableCell>
                        {sub.reviewers?.length ? (
                          <div className="space-y-0.5">
                            {sub.reviewers.map((r, i) => (
                              <p
                                key={i}
                                className="text-[10px] font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1"
                              >
                                <span className="h-1 w-1 rounded-full bg-blue-500" />
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
              {filtered.map((sub) => (
                <div key={sub.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] font-black text-red-600">
                        {sub.id}
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
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {sub.updated}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span>Score: <strong className="text-slate-800 font-sans">{sub.score}</strong></span>
                      <span>Due: {sub.due}</span>
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
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
                    Submitted Date
                  </p>
                  <p className="text-xs font-extrabold text-slate-800">
                    {(selectedSubmission as any).submittedDate || selectedSubmission.updated}
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract */}
            {(selectedSubmission as any).abstract && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Abstract
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {(selectedSubmission as any).abstract}
                </p>
              </div>
            )}

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
