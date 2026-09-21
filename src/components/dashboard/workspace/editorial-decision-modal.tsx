"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  FileText,
  Loader2,
  AlertCircle,
  Send,
  User,
  Calendar,
  Award,
  Mail,
  FileCheck2,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  Info,
  Bookmark,
  BookOpen,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { CustomDrawer } from "@/components/ui/drawer";
import type { Submission } from "@/lib/data";
import { editorApi } from "@/lib/api";

type DecisionType = "ACCEPT" | "REVISION_REQUESTED" | "REJECT";
type RevisionKind = "MINOR" | "MAJOR";

const decisionTemplates: Record<DecisionType, { label: string; text: string; kind?: RevisionKind }[]> = {
  ACCEPT: [
    {
      label: "Standard Formal Acceptance",
      text: `Dear Author,

We are pleased to inform you that your manuscript has been formally accepted for publication in the Gono Bishwabidyalay Journal of Research. 

The editorial board and peer review panel were impressed with the scholarly rigor of your investigation, the clarity of your methodology, and the novelty of your findings. Your manuscript will now move directly into copyediting and issue pagination.

Thank you for publishing your research with the Gono Bishwabidyalay Journal of Research. Congratulations on this publication.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
    {
      label: "Accept with Minor Proofing",
      text: `Dear Author,

Your manuscript has been accepted for publication subject to final author proofing. 

Please review the forthcoming typeset galley proofs carefully when delivered by the editorial office, and ensure all author institutional affiliations, funding statements, and figure legends are fully verified.

Thank you for contributing to the Gono Bishwabidyalay Journal of Research.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
    {
      label: "Expedited Priority Publication",
      text: `Dear Author,

We are delighted to accept your paper for expedited scheduling in our forthcoming issue. Given the topical relevance and impact of your work, the editorial office will fast-track copyediting and CrossRef DOI minting.

The managing editor will follow up regarding volume pagination and final metadata confirmation.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
  ],
  REVISION_REQUESTED: [
    {
      label: "Minor Revisions (14 Days)",
      kind: "MINOR",
      text: `Dear Author,

The peer review process for your manuscript is complete. The reviewers and editorial board find substantial merit in your work; however, publication is contingent upon addressing minor revisions.

Please prepare:
1. An itemized, point-by-point rebuttal responding to each reviewer remark.
2. A revised manuscript with all modifications clearly highlighted.
3. Updated high-resolution figures or references if requested.

Please submit your revised files through the author portal within 14 calendar days.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
    {
      label: "Major Revisions (30 Days)",
      kind: "MAJOR",
      text: `Dear Author,

Thank you for submitting your manuscript. Following in-depth peer review, the reviewers have identified several critical areas requiring major revision before this paper can be considered for publication.

Key aspects requiring attention include experimental validation, deeper literature context, and comprehensive statistical reporting as detailed in the referee comments below.

Please upload your revised manuscript accompanied by a detailed point-by-point response letter within 30 calendar days. Your revision will be sent back to the referees for re-evaluation.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
    {
      label: "Clarify Methods & Data",
      kind: "MINOR",
      text: `Dear Author,

The editorial board requests clarification regarding your methodology and data reproducibility. Specifically, please ensure sampling protocols, ethical approval references, and data availability statements are explicitly articulated in the revised manuscript.

Please submit your revised version within 14 days.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
  ],
  REJECT: [
    {
      label: "Out of Journal Scope",
      text: `Dear Author,

Thank you for submitting your manuscript to the Gono Bishwabidyalay Journal of Research. 

Following careful evaluation by the editorial board, we have determined that the core subject matter of your paper falls outside the current indexing scope and editorial aims of our journal sections. We encourage you to seek publication in a venue specializing in this research domain.

We wish you the best in placing your work elsewhere.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
    {
      label: "Methodological Shortcomings",
      text: `Dear Author,

Thank you for submitting your manuscript to the Gono Bishwabidyalay Journal of Research. 

Following thorough peer review, our independent referees have identified fundamental methodological and analytical limitations that prevent us from accepting this manuscript for publication. The detailed reviewer assessments are attached below for your reference.

We hope these evaluations will be constructive as you continue your investigation.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
    {
      label: "Editorial Quota / High Competition",
      text: `Dear Author,

Thank you for considering the Gono Bishwabidyalay Journal of Research. Due to the high volume of submissions received and strict acceptance quotas for the current publishing volume, the editorial board is unable to accept your manuscript for publication.

This decision reflects editorial space constraints rather than a definitive judgment on the quality of your research. We wish you continued success with your academic endeavors.

Sincerely,
Editorial Board
Gono Bishwabidyalay Journal of Research`,
    },
  ],
};

interface EditorialDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onDecisionMade?: (updatedSub: Submission, decision: string) => void;
  onOpenPublishModal?: (sub: Submission) => void;
}

export function EditorialDecisionModal({
  isOpen,
  onClose,
  submission,
  onDecisionMade,
  onOpenPublishModal,
}: EditorialDecisionModalProps) {
  const [decision, setDecision] = useState<DecisionType>("ACCEPT");
  const [revisionKind, setRevisionKind] = useState<RevisionKind>("MINOR");
  const [note, setNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [showInternalNote, setShowInternalNote] = useState(false);
  const [showAbstract, setShowAbstract] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default template when decision type changes
  useEffect(() => {
    const templates = decisionTemplates[decision];
    if (decision === "REVISION_REQUESTED") {
      const match = templates.find((t) => t.kind === revisionKind) || templates[0];
      setNote(match.text);
    } else {
      setNote(templates[0]?.text || "");
    }
  }, [decision, revisionKind]);

  if (!submission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(`Registering editorial decision: ${decision}...`);

    try {
      const targetNumericId = submission.rawId || Number(String(submission.id).replace(/\D/g, "")) || 1;
      
      // Combine note with internal note if provided
      const fullNote = internalNote.trim()
        ? `${note.trim()}\n\n[INTERNAL EDITORIAL OFFICE NOTE]:\n${internalNote.trim()}`
        : note.trim();

      await editorApi.makeDecision(targetNumericId, {
        decision,
        note: fullNote || undefined,
      });

      const decisionLabel =
        decision === "ACCEPT"
          ? "Accepted for Publication"
          : decision === "REVISION_REQUESTED"
          ? "Revision Requested"
          : "Declined";

      toast.success(`Editorial Decision Recorded: ${decisionLabel}`, {
        id: toastId,
        description: `Official letter dispatched to corresponding author (${submission.author}).`,
      });

      const updated: Submission = {
        ...submission,
        status:
          decision === "ACCEPT"
            ? "ACCEPTED"
            : decision === "REVISION_REQUESTED"
            ? "REVISION_REQUESTED"
            : "REJECTED",
      };

      if (onDecisionMade) {
        onDecisionMade(updated, decision);
      }

      onClose();

      // If accepted, immediately offer to open the Publish to Issue modal!
      if (decision === "ACCEPT" && onOpenPublishModal) {
        setTimeout(() => {
          onOpenPublishModal(updated);
        }, 300);
      }
    } catch (err: any) {
      console.error("Editorial decision error:", err);
      toast.error("Failed to Record Decision", {
        id: toastId,
        description: err?.message || "An error occurred while submitting decision.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Locate manuscript file
  const manuscriptFile = submission.files?.find(
    (f) => f.fileType === "MANUSCRIPT" || f.originalFilename?.toLowerCase().endsWith(".pdf")
  ) || submission.files?.[0];

  const manuscriptDownloadUrl = manuscriptFile
    ? manuscriptFile.downloadUrl || `/api/v1/files/${(manuscriptFile as any).storedFilename}`
    : null;

  // Review metrics & score calculation
  const score = submission.score || 0;
  const scoreColor =
    score >= 75
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : score >= 50
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-rose-700 bg-rose-50 border-rose-200";

  const completedReviews = submission.reviews?.filter((r) => r.status === "COMPLETED" || r.reviewComments) || [];

  // Append reviewer feedback to letter
  const handleAppendReviewerComments = () => {
    if (completedReviews.length === 0) {
      toast.info("No completed referee reports found on this manuscript.");
      return;
    }

    const reportsText = completedReviews
      .map(
        (rev, idx) =>
          `\n\n------------------------------------------------------------\nREFEREE REPORT ${idx + 1} (${rev.recommendation || "Evaluation"})\n------------------------------------------------------------\n${
            rev.reviewComments || "No public comments entered."
          }`
      )
      .join("\n");

    setNote((prev) => `${prev.trim()}${reportsText}`);
    toast.success("Appended referee evaluation reports to decision letter.");
  };

  const wordCount = note.trim().split(/\s+/).filter(Boolean).length;
  const charCount = note.length;

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Record Editorial Decision"
      description="Evaluate referee findings, select authoritative decision, and dispatch official author notice."
      icon={ShieldCheck}
      size="xl"
      badge={
        <span className="rounded-md bg-blue-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-800">
          #{submission.id}
        </span>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <span className="hidden sm:inline-block text-[11px] text-slate-400">
              Current Status: <strong className="text-slate-700 font-mono">{submission.status}</strong>
            </span>
          </div>

          <button
            type="submit"
            form="editorial-decision-form"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50 ${
              decision === "ACCEPT"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : decision === "REVISION_REQUESTED"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Recording Decision...</span>
              </>
            ) : decision === "ACCEPT" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm Acceptance & Proceed</span>
              </>
            ) : decision === "REVISION_REQUESTED" ? (
              <>
                <RotateCcw className="h-4 w-4" />
                <span>Dispatch Revision Request</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>Confirm Manuscript Decline</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="editorial-decision-form" onSubmit={handleSubmit} className="space-y-6 text-xs pb-4">
        {/* 1. Manuscript Intelligence & Context Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-gb-blue border border-blue-200/70 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                <FileText className="h-3 w-3" />
                {submission.type || "Research Article"}
              </span>
              <span className="inline-block bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                {(submission as any).track || submission.topic || "General Sciences"}
              </span>
            </div>

            {/* Score Pill */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${scoreColor}`}>
              <Award className="h-3.5 w-3.5" />
              <span>Consensus Score: {score} / 100</span>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {submission.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <User className="h-3.5 w-3.5 text-slate-400" />
                {submission.author}
              </span>
              {submission.submittingAuthor?.department && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{submission.submittingAuthor.department}</span>
                </>
              )}
              {submission.submittingAuthor?.email && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 flex items-center gap-1 font-mono text-[10px]">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {submission.submittingAuthor.email}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Toolbar: Manuscript PDF & Abstract Disclosure */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 flex-wrap">
            {manuscriptDownloadUrl && (
              <a
                href={manuscriptDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-blue-600" />
                <span>Download Manuscript PDF</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowAbstract(!showAbstract)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              <span>{showAbstract ? "Hide Abstract" : "Inspect Abstract"}</span>
              {showAbstract ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* Collapsible Abstract Content */}
          {showAbstract && (
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed text-xs space-y-2">
              <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                Manuscript Abstract
              </p>
              <p className="text-slate-600 text-justify font-sans">
                {submission.abstractText || "No abstract provided for this submission."}
              </p>
              {submission.keywords && (
                <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Keywords:</span>
                  {submission.keywords.split(/[,;]/).map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Peer Review Consensus Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Assigned Referees
              </p>
              <p className="font-bold text-slate-800 mt-0.5">
                {submission.reviewers?.length || 0} Evaluators
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Referee Consensus
              </p>
              <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {score >= 75 ? "Recommend Acceptance" : score >= 50 ? "Recommend Revisions" : "Recommend Rejection"}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Editorial Authority
              </p>
              <p className="font-bold text-slate-800 mt-0.5">
                Senior Academic Editor
              </p>
            </div>
          </div>
        </div>

        {/* 2. Decision Matrix Selection (3 Authoritative Cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>Select Authoritative Editorial Decision</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Click to change action</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Accept */}
            <button
              type="button"
              onClick={() => setDecision("ACCEPT")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                decision === "ACCEPT"
                  ? "border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center justify-center h-8 w-8 rounded-xl ${
                    decision === "ACCEPT" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </span>
                  {decision === "ACCEPT" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <h4 className="mt-3 text-xs font-bold text-slate-900">
                  Accept Manuscript
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                  Approve for formal publication and immediately unlock issue scheduling & DOI minting.
                </p>
              </div>
            </button>

            {/* 2. Request Revision */}
            <button
              type="button"
              onClick={() => setDecision("REVISION_REQUESTED")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                decision === "REVISION_REQUESTED"
                  ? "border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center justify-center h-8 w-8 rounded-xl ${
                    decision === "REVISION_REQUESTED" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700"
                  }`}>
                    <RotateCcw className="h-4.5 w-4.5" />
                  </span>
                  {decision === "REVISION_REQUESTED" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <h4 className="mt-3 text-xs font-bold text-slate-900">
                  Request Revision
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                  Require authors to address referee recommendations and submit a point-by-point rebuttal.
                </p>
              </div>
            </button>

            {/* 3. Reject */}
            <button
              type="button"
              onClick={() => setDecision("REJECT")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                decision === "REJECT"
                  ? "border-rose-500 bg-rose-50/70 shadow-sm ring-2 ring-rose-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center justify-center h-8 w-8 rounded-xl ${
                    decision === "REJECT" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700"
                  }`}>
                    <XCircle className="h-4.5 w-4.5" />
                  </span>
                  {decision === "REJECT" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <h4 className="mt-3 text-xs font-bold text-slate-900">
                  Decline Manuscript
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                  Formally decline paper. Archives submission and delivers constructive editorial evaluation.
                </p>
              </div>
            </button>
          </div>

          {/* If Revision is selected: Revision Scope Selector */}
          {decision === "REVISION_REQUESTED" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-700" />
                <span>Specify Revision Scope & Deadline:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRevisionKind("MINOR")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    revisionKind === "MINOR"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white border border-amber-300 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  Minor Revision (14 Days)
                </button>
                <button
                  type="button"
                  onClick={() => setRevisionKind("MAJOR")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    revisionKind === "MAJOR"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white border border-amber-300 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  Major Revision (30 Days)
                </button>
              </div>
            </div>
          )}

          {/* Next Step Workflow Callout (Authoritative Info Box - NO SPARKLES) */}
          <div
            className={`p-3.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
              decision === "ACCEPT"
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                : decision === "REVISION_REQUESTED"
                ? "bg-amber-50/80 border-amber-200 text-amber-950"
                : "bg-rose-50/80 border-rose-200 text-rose-950"
            }`}
          >
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-600" />
            <div className="min-w-0 flex-1 leading-relaxed">
              {decision === "ACCEPT" && (
                <p>
                  <strong>Acceptance Progression:</strong> Upon confirmation, this manuscript status updates to{" "}
                  <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[10px]">ACCEPTED</code>. The{" "}
                  <strong>Schedule & Publish to Issue</strong> modal will immediately open, allowing you to sequence
                  it into Volume & Issue, assign pagination, and mint its CrossRef DOI.
                </p>
              )}
              {decision === "REVISION_REQUESTED" && (
                <p>
                  <strong>Revision Progression:</strong> The corresponding author will receive an automated email notice
                  with your decision letter. The author portal will unlock a secure revision submission slot with a{" "}
                  {revisionKind === "MINOR" ? "14-day" : "30-day"} deadline.
                </p>
              )}
              {decision === "REJECT" && (
                <p>
                  <strong>Decline Progression:</strong> The manuscript will transition to{" "}
                  <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[10px]">REJECTED</code> and be archived.
                  The author will be formally notified with your evaluation note.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Author Decision Letter & Communication Studio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <span>Official Editorial Decision Letter (Author Notice)</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {charCount} characters • {wordCount} words
            </span>
          </div>

          {/* Standard Academic Letter Templates */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Bookmark className="h-3 w-3 text-blue-600" />
                <span>Standard Academic Templates:</span>
              </p>

              {completedReviews.length > 0 && (
                <button
                  type="button"
                  onClick={handleAppendReviewerComments}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10.5px] font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <FileCheck2 className="h-3 w-3 text-emerald-600" />
                  <span>Append Referee Reports ({completedReviews.length})</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {decisionTemplates[decision].map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNote(tmpl.text)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50/80 hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 hover:text-blue-700 transition-all cursor-pointer shadow-2xs"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Textarea */}
          <textarea
            rows={8}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Compose official editorial decision letter to the author..."
            className="w-full rounded-xl border border-slate-300 p-3.5 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y font-sans leading-relaxed transition-colors shadow-inner"
          />

          <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5 flex-wrap gap-2">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-400" />
              Recipient: <strong className="text-slate-700">{submission.author}</strong>
            </span>
            <span>Formal academic communication</span>
          </div>

          {/* Optional Confidential Internal Note for Editorial Board */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowInternalNote(!showInternalNote)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>{showInternalNote ? "Hide Internal Office Note" : "+ Add Confidential Note for Editorial Office (Internal only)"}</span>
            </button>

            {showInternalNote && (
              <div className="mt-2 space-y-1">
                <textarea
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Record internal rationale, reviewer consensus notes, or instructions for the Editor-in-Chief. This will NOT be sent to the author."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none focus:border-slate-400 resize-y leading-relaxed font-sans"
                />
                <p className="text-[10px] text-slate-400 italic">
                  Confidential audit record preserved in editorial history.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </CustomDrawer>
  );
}
