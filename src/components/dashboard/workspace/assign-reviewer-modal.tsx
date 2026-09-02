"use client";

import React, { useState } from "react";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomSelect } from "@/components/ui/custom-select";
import { UserCheck, FileText, User, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { Submission } from "@/lib/data";

interface AssignReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onAssign: (subId: string, reviewerName: string) => void;
}

const availableReviewers = [
  "Dr. Salma Khatun",
  "Prof. Md. Kabir Hossain",
  "Dr. Ananya Roy",
  "Dr. Tanvir Ahmed",
  "Prof. Nasrin Sultana",
];

export function AssignReviewerModal({
  isOpen,
  onClose,
  submission,
  onAssign,
}: AssignReviewerModalProps) {
  const [selectedReviewer, setSelectedReviewer] = useState(availableReviewers[0]);
  const [invitationNote, setInvitationNote] = useState("");

  if (!submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(submission.id, selectedReviewer);
    onClose();
  };

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Peer Reviewer`}
      description={`Select a qualified double-blind referee for manuscript ${submission.id}.`}
      icon={UserCheck}
      size="md"
      badge={
        <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-800">
          {submission.id}
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Manuscript Overview Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>Manuscript Details</span>
          </div>
          <h4 className="font-academic text-sm font-bold text-slate-900 leading-snug">
            {submission.title}
          </h4>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-slate-400" />
              <strong>Author:</strong> {submission.author}
            </span>
            <span>•</span>
            <span>{(submission as any).track || submission.type}</span>
          </div>
        </div>

        {/* Existing Assigned Reviewers */}
        {submission.reviewers && submission.reviewers.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
              Currently Assigned ({submission.reviewers.length}):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {submission.reviewers.map((rev, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md bg-white border border-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-800"
                >
                  {rev}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviewer Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Select Peer Reviewer <span className="text-rose-500">*</span>
          </label>
          <CustomSelect
            size="form"
            options={availableReviewers}
            value={selectedReviewer}
            onChange={setSelectedReviewer}
            placeholder="Choose an active reviewer"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Reviewers will receive a double-blind appraisal invitation link via email.
          </p>
        </div>

        {/* Optional Editorial Instructions */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Editorial Instructions (Optional)
          </label>
          <textarea
            rows={3}
            value={invitationNote}
            onChange={(e) => setInvitationNote(e.target.value)}
            placeholder="Add special evaluation guidelines or deadlines for this review..."
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 overflow-y-auto overscroll-contain resize-y"
          />
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue)] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Confirm & Assign</span>
          </button>
        </div>
      </form>
    </CustomDrawer>
  );
}
