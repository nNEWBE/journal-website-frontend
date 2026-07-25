import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  PenLine,
  RefreshCw,
  Search,
} from "lucide-react";
import type { Role } from "@/lib/data";

export const roleNotes: Record<Role, string> = {
  author:
    "Submit manuscripts, track peer review milestones, upload revisions, and communicate with your assigned editor.",
  reviewer:
    "Accept invitations, inspect blind manuscripts, submit structured feedback, and download reviewer certificates.",
  editor:
    "Triage submissions, run similarity checks, assign reviewers, and prepare editorial decision letters.",
  admin:
    "Manage article policies, build active issues, feature articles on the homepage, and monitor journal metrics.",
  "super-admin":
    "Audit system logs, configure role permissions, manage credentials, and restore demo database states.",
};

export const roleAccentMap: Record<
  Role,
  { color: string; bg: string; border: string; badge: string; label: string }
> = {
  author: {
    color: "text-[color:var(--color-gb-blue)]",
    bg: "bg-[color:var(--color-gb-blue-soft)]/20",
    border: "border-l-[color:var(--color-gb-blue)]",
    badge:
      "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] border-[color:var(--color-gb-blue)]/10",
    label: "Author",
  },
  reviewer: {
    color: "text-amber-700",
    bg: "bg-amber-50/20",
    border: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    label: "Reviewer",
  },
  editor: {
    color: "text-violet-700",
    bg: "bg-violet-50/20",
    border: "border-l-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200/60",
    label: "Editor",
  },
  admin: {
    color: "text-emerald-700",
    bg: "bg-emerald-50/20",
    border: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    label: "Admin",
  },
  "super-admin": {
    color: "text-rose-700",
    bg: "bg-rose-50/20",
    border: "border-l-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200/60",
    label: "Super Admin",
  },
};

export const statusConfig: Record<
  string,
  { label: string; classes: string; icon: typeof Search }
> = {
  "Under Review": {
    label: "Under Review",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Search,
  },
  Accepted: {
    label: "Accepted",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  "Revisions Requested": {
    label: "Revisions Requested",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    icon: RefreshCw,
  },
  Submitted: {
    label: "Submitted",
    classes: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  "In Desk Review": {
    label: "In Desk Review",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
    icon: FileText,
  },
  Published: {
    label: "Published",
    classes: "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold",
    icon: FileCheck2,
  },
  Rejected: {
    label: "Rejected",
    classes: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
  Archived: {
    label: "Archived",
    classes: "bg-slate-100 text-slate-500 border-slate-200",
    icon: Archive,
  },
  Draft: {
    label: "Draft",
    classes: "bg-slate-50 text-slate-600 border-slate-200 border-dashed",
    icon: PenLine,
  },
};
