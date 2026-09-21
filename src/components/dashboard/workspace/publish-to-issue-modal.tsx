"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Quote,
  Loader2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomSelect } from "@/components/ui/custom-select";
import type { Submission } from "@/lib/data";
import { editorApi, issuesApi, type IssueData } from "@/lib/api";

export function getTopicCover(topic?: string): string {
  const t = (topic || "").toLowerCase();
  if (t.includes("pharmacy") || t.includes("drug")) return "/covers/pharmacy.png";
  if (t.includes("tech") || t.includes("computer") || t.includes("ai") || t.includes("data"))
    return "/covers/technology.png";
  if (t.includes("agri") || t.includes("farm") || t.includes("crop") || t.includes("climate"))
    return "/covers/agriculture.png";
  if (t.includes("law") || t.includes("justice") || t.includes("governance")) return "/covers/law.png";
  return "/covers/medical.png";
}

interface PublishToIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onPublished?: (updatedSub: Submission) => void;
}

export function PublishToIssueModal({
  isOpen,
  onClose,
  submission,
  onPublished,
}: PublishToIssueModalProps) {
  const [issues, setIssues] = useState<IssueData[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [startPage, setStartPage] = useState<string>("83");
  const [endPage, setEndPage] = useState<string>("98");
  const [doi, setDoi] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [citationFormat, setCitationFormat] = useState<"apa" | "harvard" | "vancouver">("apa");

  // Load issues on open
  useEffect(() => {
    if (!isOpen) return;

    async function fetchIssues() {
      setLoadingIssues(true);
      try {
        const list = await issuesApi.list();
        if (Array.isArray(list) && list.length > 0) {
          setIssues(list);
          const current = list.find((i) => i.current || i.isCurrent) || list[0];
          setSelectedIssueId(current.id);
        } else {
          // Fallback issues if database is empty
          const defaults: IssueData[] = [
            {
              id: 1,
              issueKey: "vol4-iss1",
              volumeLabel: "Volume 4",
              issueLabel: "Issue 1",
              year: "2026",
              month: "January 2026",
              title: "Public Health and Healthcare Delivery in South Asia",
              articleCount: 6,
              current: true,
            },
            {
              id: 2,
              issueKey: "vol4-iss2",
              volumeLabel: "Volume 4",
              issueLabel: "Issue 2",
              year: "2026",
              month: "July 2026",
              title: "Emerging Technologies, Artificial Intelligence & Ethics",
              articleCount: 4,
              current: false,
            },
          ];
          setIssues(defaults);
          setSelectedIssueId(defaults[0].id);
        }
      } catch (err) {
        console.warn("Could not fetch issues:", err);
      } finally {
        setLoadingIssues(false);
      }
    }

    fetchIssues();
  }, [isOpen]);

  // Generate suggested DOI when submission changes
  useEffect(() => {
    if (!submission) return;
    const subNum = String(submission.id || "").replace(/\D/g, "") || "001";
    setDoi(`10.5555/gbj.2026.${subNum.padStart(3, "0")}`);
  }, [submission]);

  const selectedIssue = useMemo(() => {
    return issues.find((i) => i.id === selectedIssueId) || null;
  }, [issues, selectedIssueId]);

  const formattedPages = useMemo(() => {
    if (startPage && endPage) return `${startPage}-${endPage}`;
    if (startPage) return `${startPage}`;
    return "1-15";
  }, [startPage, endPage]);

  // Real-time APA / Harvard / Vancouver citation preview
  const citationPreview = useMemo(() => {
    if (!submission) return "";
    const authorStr = submission.author || "GB Journal Author";
    const year = selectedIssue?.year || "2026";
    const volNum = selectedIssue?.volumeLabel?.replace(/[^0-9]/g, "") || "4";
    const issNum = selectedIssue?.issueLabel?.replace(/[^0-9]/g, "") || "1";
    const doiClean = doi.trim();

    if (citationFormat === "apa") {
      return `${authorStr} (${year}). ${submission.title}. Gono Bishwabidyalay Journal of Research, ${volNum}(${issNum}), ${formattedPages}. https://doi.org/${doiClean}`;
    }
    if (citationFormat === "harvard") {
      return `${authorStr}, ${year}. ${submission.title}. Gono Bishwabidyalay Journal of Research, Vol. ${volNum}, no. ${issNum}, pp.${formattedPages}.`;
    }
    return `${authorStr}. ${submission.title}. Gono Bishwabidyalay J Res. ${year};${volNum}(${issNum}):${formattedPages}. doi:${doiClean}`;
  }, [submission, selectedIssue, formattedPages, doi, citationFormat]);

  if (!submission) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId) {
      toast.error("Please select a target Journal Issue");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Publishing manuscript to issue repository...", {
      description: "Minting DOI, assigning volume & issue sequence...",
    });

    try {
      const targetNumericId = submission.rawId || Number(String(submission.id).replace(/\D/g, "")) || 1;
      const res = await editorApi.publishSubmission(
        targetNumericId,
        selectedIssueId,
        doi.trim(),
        formattedPages
      );

      toast.success("Publication Finalized Successfully!", {
        id: toastId,
        description: `Manuscript ${submission.id} is now published in ${selectedIssue?.volumeLabel} ${selectedIssue?.issueLabel} with DOI ${doi}.`,
        duration: 5000,
      });

      if (onPublished) {
        onPublished({
          ...submission,
          status: "PUBLISHED",
        });
      }
      onClose();
    } catch (err: any) {
      console.error("Publishing error:", err);
      toast.error("Publication Failed", {
        id: toastId,
        description: err?.message || "Could not publish submission. Please check issue assignment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const coverUrl = getTopicCover((submission as any).track || submission.topic);

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Editorial Production & Issue Scheduling"
      description="Schedule accepted manuscript into an official journal issue, specify pagination, and mint its official CrossRef DOI."
      icon={Rocket}
      size="xl"
      badge={
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
          Ready for Publication
        </span>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="publish-to-issue-form"
            disabled={isSubmitting || !doi.trim() || !selectedIssueId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gb-blue hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Publishing to Issue...</span>
              </>
            ) : (
              <>
                <Rocket className="h-3.5 w-3.5" />
                <span>Confirm & Publish Article</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="publish-to-issue-form" onSubmit={handlePublish} className="space-y-6 text-xs">
        {/* 1. Showcase Header: Manuscript Overview Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Topic Book Cover Preview */}
            <div className="relative w-20 sm:w-24 aspect-3/4 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm shrink-0">
              <Image
                src={coverUrl}
                alt="Journal Volume Cover"
                fill
                sizes="96px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-1 left-1 right-1 inline-block bg-slate-900/90 text-white px-1 py-0.5 text-center text-[7.5px] font-bold uppercase tracking-wider truncate rounded">
                {(submission as any).track || submission.topic || "Research"}
              </span>
            </div>

            {/* Manuscript Metadata */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-gb-blue border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  <FileText className="h-3 w-3" />
                  {submission.type || "Research Article"}
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                  <ShieldCheck className="h-3 w-3" />
                  Open Access
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  ID: {submission.id}
                </span>
              </div>

              <h3 className="font-academic text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {submission.title}
              </h3>

              <p className="text-[11px] text-slate-600 font-medium">
                <strong>Author:</strong> {submission.author}
                {submission.submittingAuthor?.department && (
                  <span className="text-slate-400"> • {submission.submittingAuthor.department}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Step: Target Journal Issue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span>1. Target Journal Issue</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400">Where this paper will be indexed</span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {issues.map((iss) => {
              const isSelected = selectedIssueId === iss.id;
              return (
                <button
                  key={iss.id}
                  type="button"
                  onClick={() => setSelectedIssueId(iss.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isSelected
                    ? "border-gb-blue bg-blue-50/50 shadow-2xs ring-1 ring-gb-blue"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      {iss.volumeLabel || "Volume 4"} • {iss.issueLabel || `Issue ${iss.id}`}
                    </span>
                    {iss.current && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    {iss.title || `${iss.month || "2026"} Edition`}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span>{iss.month || iss.year}</span>
                    <span>{iss.articleCount || 0} articles scheduled</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Step: Sequence & Page Numbers + DOI */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Page Range */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5 items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span>2. Page Span in Bound Issue</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    placeholder="83"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-gb-blue focus:ring-1 focus:ring-gb-blue"
                  />
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block">Start Page</span>
                </div>
                <span className="text-slate-400 font-bold self-center">to</span>
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    placeholder="101"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-gb-blue focus:ring-1 focus:ring-gb-blue"
                  />
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block">End Page</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Final formatted span: <strong className="text-slate-700">{formattedPages}</strong>
              </p>
            </div>

            {/* DOI Assignment */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5 items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>3. Official CrossRef DOI</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.5555/gbj.2026.005"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono font-semibold text-slate-900 outline-none focus:border-gb-blue focus:ring-1 focus:ring-gb-blue"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Resolves at: <span className="text-blue-600 underline">https://doi.org/{doi}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4. Live Citation Preview */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <Quote className="h-3.5 w-3.5 text-blue-600" />
              <span>Scholarly Citation Preview</span>
            </div>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              {(["apa", "harvard", "vancouver"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-2 py-0.5 text-[9.5px] font-bold rounded uppercase cursor-pointer transition-all ${citationFormat === fmt
                    ? "bg-gb-blue text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">
            {citationPreview}
          </div>
        </div>
      </form>
    </CustomDrawer>
  );
}
