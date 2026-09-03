"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Calendar,
  Layers,
  CheckCircle2,
  Edit,
  ExternalLink,
  RotateCcw,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { issuesApi, adminApi, IssueData } from "@/lib/api";
import { CustomModal } from "@/components/ui/modal";
import { CustomDrawer } from "@/components/ui/drawer";
import { AcademicDataLoader } from "@/components/ui/loader";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { cn } from "@/lib/utils";

let issueCache: { data: IssueData[]; timestamp: number } | null = null;

export function IssueManagementPanel() {
  const [issues, setIssues] = useState<IssueData[]>(() => issueCache?.data || []);
  const [loading, setLoading] = useState<boolean>(!issueCache?.data || issueCache.data.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Create issue modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volume, setVolume] = useState("4");
  const [number, setNumber] = useState("2");
  const [year, setYear] = useState("2026");
  const [title, setTitle] = useState("Special Issue on Advances in Pharmaceutical Chemistry");
  const [description, setDescription] = useState("Original research on drug synthesis, pharmaceutical biotechnology, and clinical drug delivery systems.");
  const [coverUrl, setCoverUrl] = useState("");

  const loadIssues = async (force = false) => {
    const hasCache = issueCache?.data && issueCache.data.length > 0;
    if (hasCache && !force) {
      setIssues(issueCache!.data);
      setLoading(false);
      if (Date.now() - issueCache!.timestamp < 60000) {
        return;
      }
      setIsRefreshing(true);
    } else if (!hasCache) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await issuesApi.getAll();
      if (Array.isArray(data)) {
        setIssues(data);
        issueCache = { data, timestamp: Date.now() };
      }
    } catch (err: any) {
      if (!hasCache) {
        toast.error("Failed to load issues", { description: err.message });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleSetCurrent = async (issueId: number | string) => {
    try {
      toast.loading("Setting current active issue...", { id: `current-${issueId}` });
      await adminApi.setCurrentIssue(issueId);
      setIssues((prev) => {
        const next = prev.map((i) => ({
          ...i,
          isCurrent: i.id === issueId || String(i.id) === String(issueId),
        }));
        issueCache = { data: next, timestamp: Date.now() };
        return next;
      });
      toast.success("Active issue updated successfully", { id: `current-${issueId}` });
    } catch (err: any) {
      toast.error("Failed to update active issue", {
        id: `current-${issueId}`,
        description: err.message,
      });
    }
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const created = await adminApi.createIssue({
        volume: parseInt(volume) || 1,
        number: parseInt(number) || 1,
        year: year.trim() || new Date().getFullYear().toString(),
        title: title.trim(),
        description: description.trim(),
        coverImageUrl: coverUrl.trim() || undefined,
        status: "OPEN",
      });

      toast.success("New issue created successfully!");
      setIsModalOpen(false);
      loadIssues(true);
    } catch (err: any) {
      toast.error("Failed to create issue", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <DashboardHeaderActions>
        <button
          onClick={() => loadIssues(true)}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          title="Refresh issues list"
        >
          <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-blue-600")} />
          <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Issue</span>
        </button>
      </DashboardHeaderActions>

      {/* Issues Grid */}
      {loading ? (
        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white shadow-xs">
          <AcademicDataLoader
            title="Loading Journal Issues"
            subtitle="Fetching publication volumes, releases, and article catalogues..."
          />
        </div>
      ) : issues.length === 0 ? (
        <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-12 text-center shadow-sm">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Journal Issues Registered Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click &quot;Create New Issue&quot; above to initialize Volume 1, Issue 1 for article publishing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => {
            const isCurrent = (issue as any).isCurrent || (issue as any).current;
            return (
              <div
                key={issue.id}
                className={cn(
                  "rounded-2xl border bg-white p-5 shadow-sm transition-all relative overflow-hidden flex flex-col justify-between",
                  isCurrent
                    ? "border-blue-500 ring-2 ring-blue-500/10 shadow-md"
                    : "border-[color:var(--color-gb-border)] hover:border-slate-300"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      <Layers className="h-3 w-3" />
                      Vol {issue.volume}, No {issue.number} ({issue.year})
                    </span>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Current Issue
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {issue.status || "Open"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-[color:var(--color-gb-ink)] font-academic leading-snug line-clamp-2">
                    {issue.title || `Volume ${issue.volume}, Issue ${issue.number}`}
                  </h3>

                  {issue.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {issue.articlesCount || 0} Article{(issue.articlesCount || 0) !== 1 ? "s" : ""}
                  </span>

                  {!isCurrent && (
                    <button
                      onClick={() => handleSetCurrent(issue.id)}
                      className="text-[11px] font-bold text-[color:var(--color-gb-blue)] hover:underline cursor-pointer"
                    >
                      Set as Active Release
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Issue Drawer */}
      <CustomDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Volume & Issue"
        description="Initialize a publication issue to assemble accepted peer-reviewed articles."
        icon={BookOpen}
        size="lg"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Volume *</label>
              <input
                type="number"
                required
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Issue Number *</label>
              <input
                type="number"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Year *</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Issue Title (Optional / Special Topic)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Regular Issue or Special Topic Theme"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Scope & Editorial Overview</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the disciplinary scope or themes in this volume issue..."
              className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cover Image URL (Optional)</label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[color:var(--color-gb-blue)] text-white font-bold hover:bg-[color:var(--color-gb-blue-dark)] shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Issue"}
            </button>
          </div>
        </form>
      </CustomDrawer>
    </div>
  );
}
