"use client";

import React, { useState, useEffect } from "react";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  UserCheck,
  FileText,
  Building2,
  Mail,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  Check,
  Plus,
  Activity,
  Award,
  BarChart2,
  Zap,
  TrendingUp,
  Target,
  Layers,
  Loader2,
  Calendar,
  X,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { Submission } from "@/lib/data";
import { editorApi, type ReviewerPerformanceStats } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ReviewerUser {
  id: number;
  fullName: string;
  email: string;
  institution?: string;
  department?: string;
}

interface AssignReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onAssign: (subId: string, reviewerName: string, reviewerId?: number, dueDate?: string) => void;
  onUnassign?: (subId: string, reviewerName: string, reviewerId?: number) => void;
}

function getInitials(name: string): string {
  if (!name) return "R";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const chartConfig: ChartConfig = {
  days: {
    label: "Turnaround Days",
    color: "#1f2f82",
  },
  target: {
    label: "Admin Target (14d)",
    color: "#ef4444",
  },
  completed: {
    label: "Evaluations Completed",
    color: "#1f2f82",
  },
  onTime: {
    label: "Delivered On-Time",
    color: "#059669",
  },
};

function TurnaroundTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1 z-50">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-1 font-bold text-slate-900">
        <span>{data.paper}</span>
        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
          {data.variance}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 text-[11px] text-slate-600">
        <span>Turnaround:</span>
        <span className="font-extrabold text-slate-950 font-mono">{data.days} Days</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400">
        <span>Admin Target:</span>
        <span className="font-semibold font-mono">14 Days</span>
      </div>
    </div>
  );
}

function MonthlyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1.5 z-50 min-w-32">
      <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 text-[11px]">
        {label} Reviews
      </p>
      {payload.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color || item.fill }} />
            <span className="text-slate-600 font-medium">
              {item.name === "completed" ? "Total Reviewed" : "On-Time"}:
            </span>
          </div>
          <span className="font-mono font-black text-slate-950">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

const INSTRUCTION_PRESETS = [
  "Standard 14-day turnaround requested",
  "Focus on research methodology & data integrity",
  "Double-blind appraisal compliance required",
  "Priority review for special issue consideration",
];

const DUE_DATE_PRESETS = [
  { label: "7 Days (Express)", days: 7 },
  { label: "14 Days (Standard)", days: 14 },
  { label: "21 Days (Detailed)", days: 21 },
  { label: "30 Days (Extended)", days: 30 },
];

export function AssignReviewerModal({
  isOpen,
  onClose,
  submission,
  onAssign,
  onUnassign,
}: AssignReviewerModalProps) {
  const [assignedReviewers, setAssignedReviewers] = useState<string[]>(() => submission?.reviewers || []);
  const [stagedRemovals, setStagedRemovals] = useState<string[]>([]);
  const [reviewersList, setReviewersList] = useState<ReviewerUser[]>([]);
  const [selectedReviewerName, setSelectedReviewerName] = useState<string>("");
  const [invitationNote, setInvitationNote] = useState("");
  const [loadingReviewers, setLoadingReviewers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      setAssignedReviewers(submission.reviewers || []);
      setStagedRemovals([]);
    }
  }, [submission, isOpen]);

  const handleToggleStageRemoval = (reviewerName: string) => {
    setStagedRemovals((prev) =>
      prev.includes(reviewerName)
        ? prev.filter((r) => r !== reviewerName)
        : [...prev, reviewerName]
    );
  };
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [chartView, setChartView] = useState<"turnaround" | "velocity">("turnaround");
  const [perfStats, setPerfStats] = useState<ReviewerPerformanceStats | null>(null);
  const [loadingPerf, setLoadingPerf] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadReviewers() {
      setLoadingReviewers(true);
      try {
        const users = await editorApi.getReviewers();
        if (users && Array.isArray(users) && users.length > 0) {
          const mapped: ReviewerUser[] = users.map((u: any) => ({
            id: u.id,
            fullName: u.fullName || u.name || u.email,
            email: u.email,
            institution: u.institution,
            department: u.department,
          }));
          setReviewersList(mapped);
          setSelectedReviewerName(mapped[0].fullName);
        } else {
          setReviewersList([]);
          setSelectedReviewerName("");
        }
      } catch (err) {
        console.error("Failed to load reviewers:", err);
      } finally {
        setLoadingReviewers(false);
      }
    }

    loadReviewers();
  }, [isOpen]);

  const selectedReviewer = reviewersList.find((r) => r.fullName === selectedReviewerName);

  useEffect(() => {
    if (!selectedReviewer?.id) {
      setPerfStats(null);
      return;
    }

    let isCurrent = true;
    setLoadingPerf(true);

    editorApi
      .getReviewerPerformance(selectedReviewer.id)
      .then((data) => {
        if (isCurrent) {
          setPerfStats(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load reviewer performance stats:", err);
        if (isCurrent) {
          setPerfStats({
            reviewerId: selectedReviewer.id,
            reviewerName: selectedReviewer.fullName,
            email: selectedReviewer.email,
            activeReviews: 0,
            completedReviews: 0,
            totalInvitations: 0,
            maxCapacity: 3,
            onTimeTargetRate: null,
            avgTurnaroundDays: null,
            rating: null,
            stressLevel: "Low Stress",
            stressVariant: "emerald",
            currentActivityText: "Fully Available • No active reviews in queue",
            turnaroundHistory: [],
            monthlyActivity: [],
          });
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoadingPerf(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedReviewer?.id]);

  const handleApplyPreset = (preset: string) => {
    if (!invitationNote.trim()) {
      setInvitationNote(preset);
    } else if (!invitationNote.includes(preset)) {
      setInvitationNote(`${invitationNote.trim()}\n• ${preset}`);
    }
  };

  const handleSelectDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;
    if (!selectedReviewerName && stagedRemovals.length === 0) return;

    setIsSubmitting(true);
    try {
      const targetNumericId = submission.rawId || (submission as any)?.id;

      // 1. Process all staged referee unassignments
      if (stagedRemovals.length > 0 && targetNumericId) {
        for (const revName of stagedRemovals) {
          const matchingUser = reviewersList.find(
            (r) => r.fullName.trim().toLowerCase() === revName.trim().toLowerCase()
          );
          const matchingReview = submission.reviews?.find(
            (r) =>
              r.reviewerName?.trim().toLowerCase() === revName.trim().toLowerCase() ||
              r.reviewerEmail?.trim().toLowerCase() === matchingUser?.email?.trim().toLowerCase()
          );

          try {
            await editorApi.removeReviewer(targetNumericId, {
              reviewerId: matchingUser?.id,
              assignmentId: matchingReview?.id,
              reviewerName: revName,
            });
            onUnassign?.(submission.id, revName, matchingUser?.id);
          } catch (err: any) {
            console.error(`Failed to unassign referee ${revName}:`, err);
            toast.error(err?.message || `Failed to unassign ${revName}.`);
          }
        }

        toast.success(
          `Unassigned ${stagedRemovals.length} referee${stagedRemovals.length > 1 ? "s" : ""}. Notification email dispatched.`
        );
        setAssignedReviewers((prev) => prev.filter((r) => !stagedRemovals.includes(r)));
      }

      // 2. Assign new referee if selected
      if (selectedReviewerName) {
        const matched = reviewersList.find((r) => r.fullName === selectedReviewerName);
        const isoDueDate = dueDate ? new Date(`${dueDate}T23:59:59.000Z`).toISOString() : undefined;
        await onAssign(submission.id, selectedReviewerName, matched?.id, isoDueDate);
        setAssignedReviewers((prev) => Array.from(new Set([...prev, selectedReviewerName])));
        toast.success(`Assigned ${selectedReviewerName} to ${submission.id}.`);
      }

      setStagedRemovals([]);
      onClose();
    } catch (err: any) {
      console.error("Failed to commit reviewer updates:", err);
      toast.error(err?.message || "Failed to commit reviewer updates.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!submission) return null;

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Peer Reviewer"
      description="Select a qualified referee and review their historical workload & performance analytics."
      icon={UserCheck}
      size="lg"
      badge={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 font-mono text-[11px] font-bold text-gb-blue shadow-2xs">
          <FileText className="h-3 w-3 text-blue-600" />
          {submission.id}
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Manuscript Overview Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-linear-to-br from-slate-50/90 via-blue-50/20 to-slate-50/60 p-4.5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-100/70 border border-blue-200/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-900">
              <FileText className="h-3 w-3 text-blue-700" />
              <span>Manuscript Overview</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs">
                {submission.type || "Research Article"}
              </span>
            </div>
          </div>

          <h4 className="font-academic text-[13px] sm:text-sm font-extrabold text-slate-900 leading-snug tracking-tight">
            {submission.title}
          </h4>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/70 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-[10px] font-black text-white shadow-2xs">
                {submission.author ? submission.author.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block -mb-0.5 uppercase tracking-wider">
                  Submitting Author
                </span>
                <span className="font-bold text-slate-900">{submission.author}</span>
              </div>
            </div>

            {submission.topic && (
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block -mb-0.5 uppercase tracking-wider">
                  Subject Domain
                </span>
                <span className="font-semibold text-slate-700 truncate max-w-50 inline-block">
                  {submission.topic}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Existing Assigned Reviewers Alert */}
        {assignedReviewers && assignedReviewers.length > 0 && (
          <div className="rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50/70 to-amber-50/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Users className="h-4 w-4 text-amber-700" />
                <span>Currently Assigned Referees ({assignedReviewers.length})</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
                Active In Peer Review
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {assignedReviewers.map((rev, i) => {
                const isStaged = stagedRemovals.includes(rev);
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 rounded-xl border pl-2.5 pr-1.5 py-1 text-xs font-bold shadow-2xs transition-all ${
                      isStaged
                        ? "bg-rose-50 border-rose-300 text-rose-800"
                        : "bg-white border-amber-200/90 text-amber-900 group hover:border-rose-300"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
                        isStaged
                          ? "bg-rose-200 text-rose-900"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rev.charAt(0).toUpperCase()}
                    </span>
                    <span className={isStaged ? "line-through decoration-rose-500/70 opacity-75" : ""}>
                      {rev}
                    </span>
                    {isStaged && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-100/80 border border-rose-200 px-1 py-0.2 rounded">
                        To Unassign
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStageRemoval(rev);
                      }}
                      className={`ml-0.5 p-0.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center ${
                        isStaged
                          ? "text-rose-700 hover:text-slate-950 hover:bg-rose-200"
                          : "text-amber-600/70 hover:text-rose-600 hover:bg-rose-100/80"
                      }`}
                      title={isStaged ? `Undo removal of referee ${rev}` : `Unassign referee ${rev}`}
                      aria-label={isStaged ? `Undo removal of referee ${rev}` : `Unassign referee ${rev}`}
                    >
                      {isStaged ? (
                        <RotateCcw className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3 stroke-[2.5]" />
                      )}
                    </button>
                  </span>
                );
              })}
            </div>

            {stagedRemovals.length > 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-2.5 flex items-center justify-between text-xs text-rose-900 animate-in fade-in-50 duration-200">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>
                    <strong>{stagedRemovals.length} referee{stagedRemovals.length > 1 ? "s" : ""}</strong> marked for removal. Will be unassigned and notified by email upon clicking <strong>Confirm</strong> below.
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setStagedRemovals([])}
                  className="text-[10px] font-black text-rose-700 hover:text-rose-950 underline cursor-pointer shrink-0 ml-2"
                >
                  Undo All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviewer Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-gb-blue" />
              <span>Select Peer Reviewer</span>
              <span className="text-rose-500">*</span>
            </label>
            {reviewersList.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400">
                {reviewersList.length} Qualified {reviewersList.length === 1 ? "Reviewer" : "Reviewers"} Available
              </span>
            )}
          </div>

          <CustomSelect
            size="form"
            options={
              reviewersList.length > 0
                ? reviewersList.map((r) => ({
                    value: r.fullName,
                    label: r.institution ? `${r.fullName} (${r.institution})` : r.fullName,
                  }))
                : [loadingReviewers ? "Loading reviewers..." : "No reviewers registered"]
            }
            value={selectedReviewerName}
            onChange={setSelectedReviewerName}
            placeholder={loadingReviewers ? "Loading active reviewers..." : "Choose a reviewer"}
          />

          {/* Detailed Selected Reviewer Card */}
          {selectedReviewer && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-700 to-indigo-800 text-white font-black text-sm shadow-xs">
                  {getInitials(selectedReviewer.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-extrabold text-xs text-slate-950 truncate">
                      {selectedReviewer.fullName}
                    </h5>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Verified Referee
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-slate-500">
                    {selectedReviewer.institution && (
                      <span className="flex items-center gap-1.5 truncate">
                        <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>
                          {selectedReviewer.department ? `${selectedReviewer.department}, ` : ""}
                          {selectedReviewer.institution}
                        </span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 truncate text-slate-400">
                      <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{selectedReviewer.email}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Editorial Instructions & Quick Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span>Editorial Instructions</span>
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Turnaround &amp; Guidelines
            </span>
          </div>

          {/* Quick Presets Pills */}
          <div className="flex flex-wrap gap-1.5">
            {INSTRUCTION_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-gb-blue hover:border-blue-200 transition-colors cursor-pointer"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>{preset}</span>
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={invitationNote}
            onChange={(e) => setInvitationNote(e.target.value)}
            placeholder="Add special evaluation guidelines, turnaround deadlines, or specific areas of interest for this referee..."
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-gb-blue focus:ring-2 focus:ring-blue-100/60 overflow-y-auto overscroll-contain resize-y transition-all leading-relaxed"
          />
        </div>

        {/* Review Completion Deadline Section */}
        <div className="rounded-2xl border border-blue-200/80 bg-linear-to-br from-blue-50/40 via-white to-slate-50/60 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100/70 text-blue-700 border border-blue-200">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <label htmlFor="review-due-date" className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <span>Review Completion Deadline</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Target date by which the reviewer must complete evaluation
                </span>
              </div>
            </div>
            {dueDate && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100/80 border border-blue-300 text-blue-900 shadow-2xs">
                <Calendar className="h-3 w-3 text-blue-700" />
                <span>
                  Due: {new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </span>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase tracking-wider">Quick Presets:</span>
            {DUE_DATE_PRESETS.map((preset) => {
              const targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + preset.days);
              const targetStr = targetDate.toISOString().split("T")[0];
              const isSelected = dueDate === targetStr;
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handleSelectDays(preset.days)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[10px] font-bold border transition-all cursor-pointer",
                    isSelected
                      ? "bg-gb-blue border-gb-blue text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-gb-blue hover:border-blue-200"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Date Picker Input */}
          <div>
            <input
              id="review-due-date"
              type="date"
              value={dueDate}
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-gb-blue focus:ring-2 focus:ring-blue-100 cursor-pointer"
            />
          </div>
        </div>

        {/* Reviewer Performance & Capacity Analytics with Real Data */}
        {loadingPerf ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col items-center justify-center gap-2 min-h-48 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-gb-blue" />
            <p className="text-xs font-bold text-slate-700">Loading Referee Analytics</p>
            <p className="text-[10px] text-slate-400">Querying real-time evaluation history from the archive...</p>
          </div>
        ) : selectedReviewer && perfStats ? (
          (() => {
            const stats = perfStats;
            const hasMonthlyData = stats.monthlyActivity?.some((m) => m.completed > 0);
            const hasTurnaroundData = stats.turnaroundHistory && stats.turnaroundHistory.length > 0;

            return (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-4 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-gb-blue border border-blue-200/70 shadow-2xs">
                      <BarChart2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900">
                        Referee Performance &amp; Workload
                      </h5>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Target date compliance, stress index &amp; queue status
                      </p>
                    </div>
                  </div>
                  {stats.rating !== null && stats.completedReviews > 0 ? (
                    <div className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                      <Award className="h-3 w-3 text-amber-500" />
                      <span>{stats.rating.toFixed(1)} / 5.0 Rating</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      <Award className="h-3 w-3 text-slate-400" />
                      <span>New Referee • Unrated</span>
                    </div>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* On-Time Target Compliance */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                        Target Date
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="text-base font-black text-emerald-950">
                      {stats.onTimeTargetRate !== null && stats.completedReviews > 0
                        ? `${stats.onTimeTargetRate}%`
                        : stats.completedReviews === 0
                        ? "100%"
                        : "0%"}
                    </div>
                    <p className="text-[9px] text-emerald-700 font-medium leading-tight">
                      {stats.completedReviews > 0
                        ? "On-time completion within admin deadline"
                        : "100% capacity available • 0 overdue reviews"}
                    </p>
                  </div>

                  {/* Turnaround */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                        Turnaround
                      </span>
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="text-base font-black text-blue-950">
                      {stats.avgTurnaroundDays !== null && stats.completedReviews > 0
                        ? `${stats.avgTurnaroundDays}d`
                        : "—"}
                    </div>
                    <p className="text-[9px] text-blue-700 font-medium leading-tight">
                      {stats.completedReviews > 0
                        ? "Avg. turnaround (Admin target: 14d)"
                        : "No completed reviews yet (Target: 14d)"}
                    </p>
                  </div>

                  {/* Stress Level */}
                  <div
                    className={cn(
                      "rounded-xl border p-2.5 space-y-1",
                      stats.stressVariant === "emerald"
                        ? "border-emerald-100 bg-emerald-50/40"
                        : stats.stressVariant === "amber"
                        ? "border-amber-100 bg-amber-50/40"
                        : "border-rose-100 bg-rose-50/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider",
                          stats.stressVariant === "emerald"
                            ? "text-emerald-900"
                            : stats.stressVariant === "amber"
                            ? "text-amber-900"
                            : "text-rose-900"
                        )}
                      >
                        Stress Index
                      </span>
                      <Activity
                        className={cn(
                          "h-3.5 w-3.5",
                          stats.stressVariant === "emerald"
                            ? "text-emerald-600"
                            : stats.stressVariant === "amber"
                            ? "text-amber-600"
                            : "text-rose-600"
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "text-base font-black truncate",
                        stats.stressVariant === "emerald"
                          ? "text-emerald-950"
                          : stats.stressVariant === "amber"
                          ? "text-amber-950"
                          : "text-rose-950"
                      )}
                    >
                      {stats.stressLevel}
                    </div>
                    <p
                      className={cn(
                        "text-[9px] font-medium leading-tight",
                        stats.stressVariant === "emerald"
                          ? "text-emerald-700"
                          : stats.stressVariant === "amber"
                          ? "text-amber-700"
                          : "text-rose-700"
                      )}
                    >
                      {stats.activeReviews} of {stats.maxCapacity} active review slots used
                    </p>
                  </div>
                </div>

                {/* Interactive Chart Section */}
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 space-y-2.5">
                  {/* Chart Header & Tab Toggles */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                      {chartView === "turnaround" ? (
                        <>
                          <Target className="h-3.5 w-3.5 text-blue-600" />
                          <span>Turnaround vs. 14-Day Admin Target</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Monthly Review Volume &amp; On-Time Delivery</span>
                        </>
                      )}
                    </div>

                    {/* Chart Mode Switcher */}
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setChartView("turnaround")}
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer",
                          chartView === "turnaround"
                            ? "bg-gb-blue text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        Target Velocity
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartView("velocity")}
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer",
                          chartView === "velocity"
                            ? "bg-gb-blue text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        Monthly Trends
                      </button>
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="h-36 w-full pt-1">
                    {chartView === "turnaround" ? (
                      hasTurnaroundData ? (
                        <ChartContainer config={chartConfig} className="h-36 w-full">
                          <BarChart
                            data={stats.turnaroundHistory}
                            margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                              dataKey="paper"
                              tickLine={false}
                              axisLine={false}
                              fontSize={10}
                              stroke="#64748b"
                            />
                            <YAxis
                              domain={[0, (dataMax: number) => Math.max(16, Math.ceil(dataMax + 2))]}
                              tickLine={false}
                              axisLine={false}
                              fontSize={10}
                              stroke="#64748b"
                              tickCount={5}
                              unit="d"
                            />
                            <ReferenceLine
                              y={14}
                              stroke="#ef4444"
                              strokeDasharray="3 3"
                              label={{
                                value: "14d Target",
                                position: "insideTopRight",
                                fill: "#e11d48",
                                fontSize: 9,
                                fontWeight: 800,
                              }}
                            />
                            <Tooltip content={<TurnaroundTooltip />} />
                            <Bar dataKey="days" radius={[5, 5, 0, 0]} maxBarSize={28}>
                              {stats.turnaroundHistory.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.days <= (entry.target || 14) ? "#1f2f82" : "#ef4444"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      ) : (
                        <div className="h-36 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-xl bg-white/60">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-gb-blue mb-1.5 shadow-2xs">
                            <Target className="h-4 w-4" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">No Historical Evaluations</p>
                          <p className="text-[10px] text-slate-500 max-w-sm mt-0.5 leading-normal">
                            This referee has 0 completed reviews in the journal archive. Turnaround velocity vs. the 14-day admin target will automatically record here after their first completed manuscript evaluation.
                          </p>
                        </div>
                      )
                    ) : (
                      hasMonthlyData ? (
                        <ChartContainer config={chartConfig} className="h-36 w-full">
                          <AreaChart
                            data={stats.monthlyActivity}
                            margin={{ top: 10, right: 8, left: -24, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1f2f82" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#1f2f82" stopOpacity={0.0} />
                              </linearGradient>
                              <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                              dataKey="month"
                              tickLine={false}
                              axisLine={false}
                              fontSize={10}
                              stroke="#64748b"
                            />
                            <YAxis
                              domain={[0, (dataMax: number) => Math.max(3, Math.ceil(dataMax + 1))]}
                              allowDecimals={false}
                              tickLine={false}
                              axisLine={false}
                              fontSize={10}
                              stroke="#64748b"
                              tickCount={4}
                            />
                            <Tooltip content={<MonthlyTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="completed"
                              name="completed"
                              stroke="#1f2f82"
                              fill="url(#colorCompleted)"
                              strokeWidth={2}
                            />
                            <Area
                              type="monotone"
                              dataKey="onTime"
                              name="onTime"
                              stroke="#059669"
                              fill="url(#colorOnTime)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ChartContainer>
                      ) : (
                        <div className="h-36 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-xl bg-white/60">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-1.5 shadow-2xs">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">No Monthly Volume On Record</p>
                          <p className="text-[10px] text-slate-500 max-w-sm mt-0.5 leading-normal">
                            Monthly evaluation velocity and on-time completion trends will track and visualize here once peer reviews are submitted.
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Chart Subtitle / Legend */}
                  {chartView === "turnaround" ? (
                    hasTurnaroundData ? (
                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-xs bg-gb-blue inline-block" />
                          <span>Actual Turnaround</span>
                        </span>
                        <span className="flex items-center gap-1 text-rose-600 font-bold">
                          <span className="h-0.5 w-3 border-t-2 border-dashed border-rose-500 inline-block" />
                          <span>14-Day Admin Target Line</span>
                        </span>
                      </div>
                    ) : null
                  ) : hasMonthlyData ? (
                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-xs bg-gb-blue inline-block" />
                        <span>Total Completed</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="h-2 w-2 rounded-xs bg-emerald-600 inline-block" />
                        <span>On-Time within Target</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Reviewer Workload & Capacity Slots Widget */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3">
                  {/* Widget Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100/70 text-gb-blue shadow-2xs">
                        <Layers className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">
                        Reviewer Capacity Slots
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs">
                        {stats.completedReviews} Lifetime Completed
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border",
                          stats.activeReviews === 0
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : stats.activeReviews < stats.maxCapacity
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                        )}
                      >
                        {stats.activeReviews} of {stats.maxCapacity} Slots Occupied
                      </span>
                    </div>
                  </div>

                  {/* 3 Concurrent Review Slots Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: stats.maxCapacity }).map((_, slotIdx) => {
                      const isOccupied = slotIdx < stats.activeReviews;
                      const isNextTarget = slotIdx === stats.activeReviews;

                      if (isOccupied) {
                        return (
                          <div
                            key={slotIdx}
                            className="rounded-xl border border-blue-200 bg-white p-2.5 space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">
                                Slot {slotIdx + 1}
                              </span>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                              </span>
                            </div>
                            <div className="text-[11px] font-bold text-slate-900 truncate">
                              In Progress
                            </div>
                            <span className="inline-block text-[9px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                              Under Review
                            </span>
                          </div>
                        );
                      }

                      if (isNextTarget) {
                        return (
                          <div
                            key={slotIdx}
                            className="rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-2.5 space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                                Slot {slotIdx + 1}
                              </span>
                              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            </div>
                            <div className="text-[11px] font-extrabold text-emerald-950 truncate">
                              Target Slot
                            </div>
                            <span className="inline-block text-[9px] font-black text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-1.5 py-0.5 rounded">
                              Assigned Here
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={slotIdx}
                          className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-2.5 space-y-1.5 opacity-80"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Slot {slotIdx + 1}
                            </span>
                            <span className="h-2 w-2 rounded-full bg-slate-200"></span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Open Buffer
                          </div>
                          <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                            Available
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Activity Summary Footnote */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{stats.currentActivityText}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                      {stats.maxCapacity - stats.activeReviews} Slots Free
                    </span>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center text-slate-500 space-y-1">
            <Activity className="h-5 w-5 mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-700">Select a referee to view performance stats</p>
            <p className="text-[10px] text-slate-400">
              Evaluates targeted deadline compliance, workload stress index, and current queue activities.
            </p>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold">
            {stagedRemovals.length > 0 ? (
              <span className="text-rose-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>
                  {stagedRemovals.length} referee{stagedRemovals.length > 1 ? "s" : ""} pending unassignment
                </span>
              </span>
            ) : (
              <span className="text-slate-400">All reviewer updates require confirmation</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!selectedReviewerName && stagedRemovals.length === 0)}
              className="inline-flex items-center gap-2 rounded-xl bg-gb-blue px-6 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-gb-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>
                    {stagedRemovals.length > 0 && selectedReviewerName
                      ? "Confirm & Save Changes"
                      : stagedRemovals.length > 0
                      ? `Confirm & Unassign (${stagedRemovals.length})`
                      : "Confirm & Assign Reviewer"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </CustomDrawer>
  );
}
