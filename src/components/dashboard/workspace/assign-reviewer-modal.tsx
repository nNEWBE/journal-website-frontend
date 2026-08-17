"use client";

import { useState } from "react";
import { CustomModal } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";
import { UserCheck } from "lucide-react";
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

  if (!submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(submission.id, selectedReviewer);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Peer Reviewer — ${submission.id}`}
      className="overflow-visible"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">
            Manuscript Title
          </label>
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-semibold line-clamp-2">
            {submission.title}
          </p>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">
            Select Reviewer
          </label>
          <CustomSelect
            size="form"
            options={availableReviewers}
            value={selectedReviewer}
            onChange={setSelectedReviewer}
            placeholder="Choose an active reviewer"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-extrabold text-white hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Assign Reviewer
          </button>
        </div>
      </form>
    </CustomModal>
  );
}
