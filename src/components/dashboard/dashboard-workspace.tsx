"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertCircle,
  Archive,
  BarChart2,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Crown,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MoreVertical,
  PenLine,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { GbJournalLogo } from "@/components/gb-logo";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { CustomModal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { cn } from "@/lib/utils";
import {
  roles,
  submissions as seedSubmissions,
  type Role,
  type Submission,
} from "@/lib/data";
import { getSession, clearSession, DEMO_USERS, type User } from "@/lib/auth";

// --- Constants ────────────────────────────────────────────────────────────────

const roleNotes: Record<Role, string> = {
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

const roleAccentMap: Record<
  Role,
  { color: string; bg: string; border: string; badge: string; label: string }
> = {
  author: { 
    color: "text-[color:var(--color-gb-blue)]", 
    bg: "bg-[color:var(--color-gb-blue-soft)]/20", 
    border: "border-l-[color:var(--color-gb-blue)]",
    badge: "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] border-[color:var(--color-gb-blue)]/10",
    label: "Author" 
  },
  reviewer: { 
    color: "text-amber-700", 
    bg: "bg-amber-50/20", 
    border: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    label: "Reviewer" 
  },
  editor: { 
    color: "text-violet-700", 
    bg: "bg-violet-50/20", 
    border: "border-l-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200/60",
    label: "Editor" 
  },
  admin: { 
    color: "text-emerald-700", 
    bg: "bg-emerald-50/20", 
    border: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    label: "Admin" 
  },
  "super-admin": { 
    color: "text-rose-700", 
    bg: "bg-rose-50/20", 
    border: "border-l-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200/60",
    label: "Super Admin" 
  },
};

const statusConfig: Record<string, { label: string; classes: string; icon: React.ElementType }> = {
  "Under Review":      { label: "Under Review",      classes: "bg-blue-50 text-blue-700 border-blue-200",      icon: Search },
  "Revision Requested":{ label: "Revision Req.",      classes: "bg-amber-50 text-amber-700 border-amber-200",    icon: RefreshCw },
  "Awaiting Editor":   { label: "Awaiting Editor",    classes: "bg-slate-50 text-slate-600 border-slate-200",    icon: Clock },
  "Accepted":          { label: "Accepted",            classes: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  "Published":         { label: "Published",           classes: "bg-green-50 text-green-700 border-green-200",   icon: BookOpen },
  "Reviews Complete":  { label: "Reviews Done",        classes: "bg-violet-50 text-violet-700 border-violet-200",icon: ClipboardCheck },
  "Revised Manuscript Submitted": { label: "Revised", classes: "bg-cyan-50 text-cyan-700 border-cyan-200",      icon: FileCheck2 },
};

function getStatusConfig(status: string) {
  return statusConfig[status] ?? { label: status, classes: "bg-slate-50 text-slate-600 border-slate-200", icon: Activity };
}

const navItems = [
  { id: "author" as Role,       label: "Author Suite",      icon: PenLine,       href: "/dashboard/author" },
  { id: "reviewer" as Role,     label: "Reviewer Suite",    icon: UserCheck,     href: "/dashboard/reviewer" },
  { id: "editor" as Role,       label: "Editor Suite",      icon: ClipboardCheck, href: "/dashboard/editor" },
  { id: "admin" as Role,        label: "Admin Suite",       icon: ShieldCheck,   href: "/dashboard/admin" },
  { id: "super-admin" as Role,  label: "Super Admin",       icon: Crown,         href: "/dashboard/super-admin" },
];

// --- Sub-components ───────────────────────────────────────────────────────────

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

function IconBtn({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  variant?: "default" | "success" | "warning" | "danger";
  disabled?: boolean;
}) {
  const variantMap = {
    default: "border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-ink)] hover:bg-slate-50",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    warning: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger:  "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold shadow-sm transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer ${variantMap[variant]}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </button>
  );
}

function ToolboxAction({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all duration-150 active:scale-[0.99] cursor-pointer ${
        variant === "danger"
          ? "border-red-100 bg-red-50/60 hover:bg-red-50"
          : "border-[color:var(--color-gb-border)] bg-[#fafbff] hover:bg-[color:var(--color-gb-blue-soft)] hover:border-[color:var(--color-gb-blue)]/30"
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
          variant === "danger"
            ? "bg-red-100 text-red-600"
            : "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-blue)] group-hover:text-white"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-[color:var(--color-gb-ink)] leading-tight">{label}</p>
        {description && (
          <p className="mt-0.5 text-[10px] text-[color:var(--color-gb-muted)] leading-snug truncate">{description}</p>
        )}
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-gb-muted)] opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
    </button>
  );
}

function RowActionsDropdown({
  sub,
  canAdvance,
  activeRole,
  advanceSubmission,
  triggerAssignReviewer,
  triggerUploadRevision,
  triggerSubmitReview,
  triggerViewInfo,
}: {
  sub: Submission;
  canAdvance: boolean;
  activeRole: Role;
  advanceSubmission: (id: string) => void;
  triggerAssignReviewer: (sub: Submission) => void;
  triggerUploadRevision: (sub: Submission) => void;
  triggerSubmitReview: (subId: string) => void;
  triggerViewInfo: (sub: Submission) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; openUp: boolean }>({ top: 0, left: 0, openUp: false });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < 220;
      const top = openUp ? rect.top : rect.bottom + 6;
      const left = rect.right - 208; // 208px = w-52
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

      {isOpen && typeof window !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: menuCoords.openUp ? "auto" : `${menuCoords.top}px`,
            bottom: menuCoords.openUp ? `${window.innerHeight - menuCoords.top + 6}px` : "auto",
            left: `${menuCoords.left}px`,
            zIndex: 999999,
          }}
          className="w-52 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95"
        >
          <p className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Manuscript Actions
          </p>

          {canAdvance && (
            <>
              <button
                type="button"
                onClick={() => {
                  advanceSubmission(sub.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                Advance Stage
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerAssignReviewer(sub);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                Assign Reviewer
              </button>
            </>
          )}

          {(activeRole === "author" || sub.status === "Revision Requested") && (
            <button
              type="button"
              onClick={() => {
                triggerUploadRevision(sub);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              Upload Revision
            </button>
          )}

          {(activeRole === "reviewer" || sub.status === "Under Review" || activeRole === "editor" || activeRole === "super-admin") && (
            <button
              type="button"
              onClick={() => {
                triggerSubmitReview(sub.id);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              Submit Review
            </button>
          )}

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={() => {
              triggerViewInfo(sub);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            View Manuscript Info
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

// --- Main Component ────────────────────────────────────────────────────────────

export function DashboardWorkspace({
  initialRole = "author",
  initialView = "analytics",
  children,
}: {
  initialRole?: Role;
  initialView?: "workspace" | "analytics";
  children?: React.ReactNode;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const defaultUser = DEMO_USERS.find((u) => u.role === "author") || DEMO_USERS[4];

  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);

  // Derive active view and role directly from URL route
  const isAnalyticsPage = pathname.includes("/analytics");
  const activeRole: Role = pathname.includes("/super-admin")
    ? "super-admin"
    : pathname.includes("/admin")
    ? "admin"
    : pathname.includes("/editor")
    ? "editor"
    : pathname.includes("/reviewer")
    ? "reviewer"
    : pathname.includes("/author")
    ? "author"
    : initialRole;

  const activeView = isAnalyticsPage ? "analytics" : "workspace";

  const [submissions, setSubmissions] = useState<Submission[]>(seedSubmissions);
  const [decisionLog, setDecisionLog] = useState<string[]>([
    "GBJ-2026-101 scheduled for Volume 4, Issue 2",
    "Reviewer certificate batch generated for Dr. Salma Khatun",
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modal state
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubId, setReviewSubId] = useState("");
  const [reviewScore, setReviewScore] = useState("85");
  const [reviewRec, setReviewRec] = useState("Accept");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Additional Interactive Modals state
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [assignedReviewerName, setAssignedReviewerName] = useState("Dr. Salma Khatun");
  const [revisionNotes, setRevisionNotes] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session) {
      setCurrentUser(session);
    }
    const localSubs = localStorage.getItem("gb_journal_submissions");
    if (localSubs) {
      try {
        setSubmissions(JSON.parse(localSubs));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("gb_journal_submissions", JSON.stringify(seedSubmissions));
    }
    const localLogs = localStorage.getItem("gb_journal_decision_log");
    if (localLogs) {
      try {
        setDecisionLog(JSON.parse(localLogs));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialLogs = [
        "GBJ-2026-101 scheduled for Volume 4, Issue 2",
        "Reviewer certificate batch generated for Dr. Salma Khatun",
      ];
      localStorage.setItem("gb_journal_decision_log", JSON.stringify(initialLogs));
    }
    const collapsed = localStorage.getItem("gb_sidebar_collapsed") === "true";
    if (collapsed) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    localStorage.setItem("gb_sidebar_collapsed", String(nextState));
  };

  const filtered = useMemo(() => {
    let result = submissions;
    if (currentUser) {
      if (activeRole === "author") {
        result = submissions.filter(
          (s) => s.author.toLowerCase() === currentUser.name.toLowerCase() || s.author === "Ayesha Siddique"
        );
      } else if (activeRole === "reviewer") {
        result = submissions.filter(
          (s) => s.reviewers.includes(currentUser.name) || s.reviewers.includes("Dr. Salma Khatun")
        );
      }
    }
    return result.filter((s) =>
      [s.id, s.title, s.status, s.author].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [submissions, currentUser, activeRole, searchQuery]);

  const statsData = useMemo(() => [
    { label: "Live Submissions", value: submissions.length.toString(), icon: LayoutDashboard, accent: "blue" as const, index: 0 },
    { label: "Under Review",     value: submissions.filter(s => s.status === "Under Review").toString() !== "0" ? submissions.filter(s => s.status === "Under Review").length.toString() : "0", icon: ClipboardCheck, accent: "violet" as const, index: 1 },
    { label: "Accepted",         value: submissions.filter(s => s.status === "Accepted").length.toString(), icon: FileCheck2, accent: "green" as const, index: 2 },
    { label: "Published",        value: submissions.filter(s => s.status === "Published").length.toString(), icon: BookOpen, accent: "amber" as const, index: 3 },
    { label: "Revisions Pending",value: submissions.filter(s => s.status === "Revision Requested").length.toString(), icon: Archive, accent: "red" as const, index: 4 },
    { label: "Avg. Score",       value: submissions.length ? Math.round(submissions.reduce((a,b) => a + b.score, 0) / submissions.length).toString() : "—", icon: TrendingUp, accent: "blue" as const, index: 5 },
  ], [submissions]);

  function updateSubmissionsState(newSubs: Submission[], logMessage?: string) {
    setSubmissions(newSubs);
    localStorage.setItem("gb_journal_submissions", JSON.stringify(newSubs));
    if (logMessage) {
      const updatedLogs = [logMessage, ...decisionLog];
      setDecisionLog(updatedLogs);
      localStorage.setItem("gb_journal_decision_log", JSON.stringify(updatedLogs));
    }
  }

  function handleLogout() {
    clearSession();
    toast.success("Signed out successfully.");
    window.location.href = "/";
  }

  function advanceSubmission(id: string) {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    const transitions: Record<string, string> = {
      "Awaiting Editor": "Under Review",
      "Under Review": "Reviews Complete",
      "Reviews Complete": "Accepted",
      "Accepted": "Published",
      "Revision Requested": "Revised Manuscript Submitted",
      "Revised Manuscript Submitted": "Under Review",
    };
    const nextStatus = transitions[sub.status] ?? "Under Review";
    const newSubs = submissions.map((s) => s.id === id ? { ...s, status: nextStatus, updated: "Just now" } : s);
    updateSubmissionsState(newSubs, `[${id}] Status → "${nextStatus}" by ${currentUser?.name ?? "System"}`);
    toast.success(`Status advanced to "${nextStatus}".`);
  }

  function assignReviewer(id: string) {
    const newSubs = submissions.map((sub) => {
      if (sub.id !== id) return sub;
      const reviewers = Array.from(new Set([...sub.reviewers, "Dr. Salma Khatun"]));
      return { ...sub, reviewers, status: "Under Review", updated: "Just now" };
    });
    updateSubmissionsState(newSubs, `[${id}] Reviewer "Dr. Salma Khatun" assigned`);
    toast.success("Reviewer successfully assigned.");
  }

  function updateDueDate(id: string, newDate: string) {
    const newSubs = submissions.map((s) => s.id === id ? { ...s, due: newDate, updated: "Just now" } : s);
    updateSubmissionsState(newSubs, `[${id}] Due date updated to ${newDate}`);
    toast.success(`Due date updated to ${newDate}.`);
  }

  function handleSendMessageSubmit() {
    if (!msgText.trim()) return;
    const updatedLogs = [`[Author Message] ${currentUser?.name ?? "Author"}: "${msgText}"`, ...decisionLog];
    setDecisionLog(updatedLogs);
    localStorage.setItem("gb_journal_decision_log", JSON.stringify(updatedLogs));
    setIsMsgModalOpen(false);
    setMsgText("");
    toast.success("Message dispatched to editor.");
  }

  function handleUploadRevision() {
    const target = submissions.find((s) => s.status === "Revision Requested");
    if (!target) { toast.error("No manuscripts currently await revision."); return; }
    const newSubs = submissions.map((s) =>
      s.id === target.id ? { ...s, status: "Revised Manuscript Submitted", updated: "Just now" } : s
    );
    updateSubmissionsState(newSubs, `[${target.id}] Revision uploaded by ${currentUser?.name ?? "Author"}`);
    toast.success(`Revision uploaded for ${target.id}.`);
  }

  function handleAcceptInvitation() {
    const target = submissions.find((s) => s.status === "Under Review");
    if (!target) { toast.info("No pending review invitations."); return; }
    const updatedLogs = [`[Reviewer] ${currentUser?.name ?? "Reviewer"} accepted invitation for ${target.id}`, ...decisionLog];
    setDecisionLog(updatedLogs);
    localStorage.setItem("gb_journal_decision_log", JSON.stringify(updatedLogs));
    toast.success(`Invitation accepted for ${target.id}.`);
  }

  function triggerViewInfo(sub: Submission) {
    setSelectedSubmission(sub);
    setIsInfoModalOpen(true);
  }

  function triggerAssignReviewer(sub: Submission) {
    setSelectedSubmission(sub);
    setIsAssignModalOpen(true);
  }

  function triggerUploadRevisionModal(sub?: Submission) {
    const target = sub || submissions.find((s) => s.status === "Revision Requested") || submissions[0];
    if (target) {
      setSelectedSubmission(target);
      setIsRevisionModalOpen(true);
    }
  }

  function handleAssignReviewerSubmit() {
    if (!selectedSubmission) return;
    const newSubs = submissions.map((s) => {
      if (s.id !== selectedSubmission.id) return s;
      const reviewers = Array.from(new Set([...s.reviewers, assignedReviewerName]));
      const status = s.status === "Awaiting Editor" ? "Under Review" : s.status;
      return { ...s, reviewers, status, updated: "Just now" };
    });
    updateSubmissionsState(newSubs, `[${selectedSubmission.id}] Assigned reviewer "${assignedReviewerName}"`);
    setIsAssignModalOpen(false);
    toast.success(`Assigned ${assignedReviewerName} to ${selectedSubmission.id}.`);
  }

  function handleRevisionModalSubmit() {
    if (!selectedSubmission) return;
    const newSubs = submissions.map((s) =>
      s.id === selectedSubmission.id
        ? { ...s, status: "Revised Manuscript Submitted", updated: "Just now" }
        : s
    );
    updateSubmissionsState(
      newSubs,
      `[${selectedSubmission.id}] Revised manuscript uploaded by ${currentUser?.name ?? "Author"}`
    );
    setIsRevisionModalOpen(false);
    setRevisionNotes("");
    toast.success(`Revision uploaded for ${selectedSubmission.id}.`);
  }

  function triggerSubmitReview(subId: string) {
    const sub = submissions.find((s) => s.id === subId);
    if (sub) setSelectedSubmission(sub);
    setReviewSubId(subId);
    setIsReviewModalOpen(true);
  }

  function handleReviewSubmit() {
    const scoreVal = parseInt(reviewScore) || 80;
    const newSubs = submissions.map((s) =>
      s.id === reviewSubId ? { ...s, status: "Reviews Complete", score: scoreVal, updated: "Just now" } : s
    );
    updateSubmissionsState(newSubs, `[${reviewSubId}] Review submitted: ${reviewRec} (Score: ${scoreVal})`);
    setIsReviewModalOpen(false);
    toast.success(`Review logged for ${reviewSubId}. Recommendation: ${reviewRec}.`);
  }

  function handleBuildIssue() {
    const acceptedCount = submissions.filter((s) => s.status === "Accepted").length;
    if (!acceptedCount) { toast.warning("No 'Accepted' manuscripts to compile."); return; }
    const newSubs = submissions.map((s) => s.status === "Accepted" ? { ...s, status: "Published", updated: "Just now" } : s);
    updateSubmissionsState(newSubs, `[Issue Builder] Compiled ${acceptedCount} manuscripts into Volume 4, Issue 3`);
    toast.success(`Published ${acceptedCount} papers to current issue.`);
  }

  function handleResetDatabaseSubmit() {
    localStorage.removeItem("gb_journal_submissions");
    localStorage.removeItem("gb_journal_decision_log");
    setSubmissions(seedSubmissions);
    const initialLogs = ["GBJ-2026-101 scheduled for Volume 4, Issue 2", "Reviewer certificate batch generated for Dr. Salma Khatun"];
    setDecisionLog(initialLogs);
    localStorage.setItem("gb_journal_submissions", JSON.stringify(seedSubmissions));
    localStorage.setItem("gb_journal_decision_log", JSON.stringify(initialLogs));
    setIsResetModalOpen(false);
    toast.success("Database restored to seed state.");
  }

  const overrideRoleOptions = navItems.map((r) => `${r.label}`);
  const activeRoleLabel = navItems.find((r) => r.id === activeRole)?.label ?? "";

  function handleOverrideRoleChange(label: string) {
    const matched = navItems.find((r) => r.label === label);
    if (matched) {
      router.push(matched.href);
      toast.info(`Viewing as ${matched.label}.`);
    }
  }

  const canEditDates = ["editor", "admin", "super-admin"].includes(activeRole);
  const canAdvance   = ["editor", "admin", "super-admin"].includes(activeRole);
  const roleAccent   = roleAccentMap[activeRole];

function SidebarContent({
  isCollapsed = false,
  currentUser,
  activeView,
  activeRole,
  overrideRoleOptions,
  activeRoleLabel,
  handleOverrideRoleChange,
  setIsMobileSidebarOpen,
  handleLogout,
  router,
}: {
  isCollapsed?: boolean;
  currentUser: User | null;
  activeView: string;
  activeRole: Role;
  overrideRoleOptions: string[];
  activeRoleLabel: string;
  handleOverrideRoleChange: (label: string) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center border-b border-white/8 overflow-hidden shrink-0">
        <div className="w-16 flex items-center justify-center shrink-0">
          <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-white/10">
            <img
              src="/gb-logo-official.png"
              alt="Gono Bishwabidyalay emblem"
              className="h-7 w-7 object-contain"
            />
          </div>
        </div>
        <div className={cn(
          "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden flex-1",
          isCollapsed ? "opacity-0 w-0 translate-x-4 pointer-events-none" : "opacity-100 w-auto translate-x-0"
        )}>
          <p className="font-black text-[13px] tracking-tight text-white leading-tight">GB Journal</p>
          <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mt-0.5">Workspace Portal</p>
        </div>
      </div>

      {/* User card */}
      {currentUser && (
        <div
          className={cn(
            "mt-3 transition-all duration-300 overflow-hidden shrink-0",
            isCollapsed ? "mx-0 bg-transparent border-transparent" : "mx-2.5 rounded-2xl bg-white/8 border border-white/10 p-2.5 shadow-xs"
          )}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex items-center justify-center shrink-0 transition-all duration-300",
                isCollapsed ? "w-16" : "w-10"
              )}
            >
              <div className="relative group cursor-pointer">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-xl object-cover border border-amber-400/40 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 border border-amber-300/30">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[color:var(--color-gb-blue-dark)]" />

                {isCollapsed && (
                  /* Tooltip on hover */
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-900 border border-slate-700/50 p-2.5 rounded-xl shadow-xl text-left min-w-[170px] animate-fade">
                    <p className="text-[11px] font-bold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[9px] text-white/50 truncate font-mono mt-0.5">{currentUser.email}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-amber-300">
                      {currentUser.role}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden flex-1 min-w-0",
                isCollapsed ? "opacity-0 w-0 translate-x-4 pointer-events-none" : "opacity-100 w-auto translate-x-0"
              )}
            >
              <p className="text-[12px] font-bold text-white truncate leading-tight">{currentUser.name}</p>
              <p className="text-[9.5px] text-white/50 truncate font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          {!isCollapsed && (
            <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-white/10 pt-2 animate-fade">
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-amber-300 whitespace-nowrap">
                <ShieldCheck className="h-2.5 w-2.5 text-amber-400 shrink-0" />
                {currentUser.role}
              </span>
              {currentUser.department && (
                <span className="text-[9.5px] font-medium text-white/50 truncate text-right min-w-0 flex-1" title={currentUser.department}>
                  {currentUser.department}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex-1 overflow-y-auto scrollbar-none">
        {/* Analytics nav item at top */}
        <div className="mb-3">
          {!isCollapsed && <p className="mb-1.5 px-4 text-[9px] font-black uppercase tracking-widest text-white/30 animate-fade">Insights</p>}
          <button
            onClick={() => {
              setIsMobileSidebarOpen(false);
              router.push("/dashboard/analytics");
            }}
            className={cn(
              "flex items-center rounded-lg text-left text-[12px] font-semibold transition-all duration-150 cursor-pointer relative group mx-2 w-[calc(100%-16px)] h-10 px-0",
              activeView === "analytics"
                ? "bg-white text-[color:var(--color-gb-blue-dark)] shadow-sm font-bold"
                : "text-white/70 hover:bg-white/8 hover:text-white"
            )}
            title={isCollapsed ? "Analytics" : undefined}
          >
            <div className="w-12 h-10 flex items-center justify-center shrink-0">
              <BarChart2 className={cn("h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105", activeView === "analytics" ? "text-[color:var(--color-gb-blue)]" : "")} />
            </div>
            <div className={cn(
              "flex-1 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden pr-3",
              isCollapsed ? "opacity-0 w-0 translate-x-4 pointer-events-none" : "opacity-100 w-auto translate-x-0"
            )}>
              Analytics
            </div>
            {isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-900 border border-slate-700/50 px-2.5 py-1.5 rounded-md shadow-md text-white whitespace-nowrap text-[10px] font-bold tracking-wide animate-fade">
                Analytics
              </div>
            )}
          </button>
        </div>

        {!isCollapsed && <p className="mb-1.5 px-4 text-[9px] font-black uppercase tracking-widest text-white/30 animate-fade">Workspaces</p>}
        <div className="space-y-1">
          {navItems
            .filter((item) => currentUser?.role === item.id || currentUser?.role === "super-admin")
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeRole === item.id && activeView === "workspace";
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    router.push(item.href);
                  }}
                  className={cn(
                    "flex items-center rounded-lg text-left text-[12px] font-semibold transition-all duration-150 cursor-pointer relative group mx-2 w-[calc(100%-16px)] h-10 px-0",
                    isActive
                      ? "bg-white text-[color:var(--color-gb-blue-dark)] shadow-sm font-bold"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="w-12 h-10 flex items-center justify-center shrink-0">
                    <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105", isActive ? "text-[color:var(--color-gb-blue)]" : "")} />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between flex-1 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden pr-3",
                    isCollapsed ? "opacity-0 w-0 translate-x-4 pointer-events-none" : "opacity-100 w-auto translate-x-0"
                  )}>
                    <span className="flex-1">{item.label}</span>
                  </div>
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-900 border border-slate-700/50 px-2.5 py-1.5 rounded-md shadow-md text-white whitespace-nowrap text-[10px] font-bold tracking-wide animate-fade">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "mt-auto pb-4 space-y-2 border-t border-white/10 pt-3 shrink-0",
        isCollapsed ? "overflow-hidden" : ""
      )}>
        {/* Demo switcher (Super Admin only) */}
        {currentUser?.role === "super-admin" ? (
          <div className={cn(
            "transition-all duration-300 shrink-0",
            isCollapsed ? "mx-0 bg-transparent border-transparent overflow-hidden" : "mx-2.5 rounded-xl border border-amber-500/20 bg-amber-500/8 p-2.5"
          )}>
            {isCollapsed ? (
              <div className="relative group flex justify-center w-full">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/25 transition-colors cursor-pointer">
                  <Zap className="h-4 w-4" />
                </button>
                {/* Hover override selection dropdown */}
                <div className="absolute left-full ml-3 bottom-0 hidden group-hover:block z-50 bg-slate-900 border border-slate-700/50 p-2 rounded-lg shadow-xl min-w-[160px] animate-fade">
                  <p className="text-[9px] font-black uppercase text-amber-400 mb-1.5 px-2">Override view</p>
                  <div className="space-y-0.5">
                    {overrideRoleOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleOverrideRoleChange(opt)}
                        className={cn(
                          "w-full text-left text-[10px] font-bold px-2 py-1.5 rounded transition-colors cursor-pointer",
                          activeRoleLabel === opt ? "bg-amber-50 text-slate-900" : "text-white/70 hover:bg-white/8 hover:text-white"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
                  <Zap className="h-3 w-3" />
                  Demo Override
                </p>
                <CustomSelect
                  options={overrideRoleOptions}
                  value={activeRoleLabel}
                  onChange={handleOverrideRoleChange}
                  className="w-full [&_.select-trigger]:bg-white/8 [&_.select-trigger]:text-white [&_.select-trigger]:border-white/10 [&_.select-trigger_span]:text-[11px] [&_.select-trigger_span]:font-semibold"
                />
              </>
            )}
          </div>
        ) : (
          /* Institutional Portal Badge for non-super-admins */
          isCollapsed ? (
            <div className="relative group flex justify-center w-full py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="absolute left-full ml-3 bottom-0 hidden group-hover:block z-50 bg-slate-900 border border-slate-700/50 px-2.5 py-1.5 rounded-md shadow-xl text-white whitespace-nowrap text-[10px] font-bold animate-fade">
                Portal Status: Online • ISSN 2709-1422
              </div>
            </div>
          ) : (
            <div className="mx-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-2xs animate-fade">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-white/80 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  Portal Status
                </span>
                <span className="text-[9px] font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Online</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/8 flex items-center justify-between text-[9.5px] font-medium text-white/50">
                <span>ISSN: 2709-1422</span>
                <span className="font-mono text-[9px]">v4.2.0</span>
              </div>
            </div>
          )
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center rounded-xl text-left text-[12px] font-semibold text-white/60 hover:text-rose-200 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 transition-all duration-200 cursor-pointer relative group h-10 px-0 mx-2.5 w-[calc(100%-20px)]",
            isCollapsed ? "mx-0 w-full justify-center" : ""
          )}
        >
          {/* Centered icon container */}
          <div className="w-12 h-10 flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4 shrink-0 text-white/60 group-hover:text-rose-300 group-hover:scale-110 transition-all" />
          </div>

          {/* Text, hidden when collapsed */}
          <div className={cn(
            "flex-1 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden",
            isCollapsed ? "opacity-0 w-0 translate-x-4 pointer-events-none" : "opacity-100 w-auto translate-x-0"
          )}>
            <span className="font-bold tracking-wide">Sign Out</span>
          </div>

          {/* Collapsed Tooltip */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-red-950 border border-red-800/40 px-2.5 py-1.5 rounded-md shadow-md text-red-200 whitespace-nowrap text-[10px] font-black animate-fade">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

  // --- Toolbox actions by role ─────────────────────────────────────────────

  const toolboxActions: Record<Role, React.ReactNode> = {
    author: (
      <>
        <ToolboxAction icon={Save}         label="Continue Draft"       description="Resume your saved manuscript draft"     onClick={() => toast.info("Editor opened — draft synced.")} />
        <ToolboxAction icon={FileCheck2}   label="Upload Revision"      description="Submit revised manuscript files"        onClick={handleUploadRevision} />
        <ToolboxAction icon={MessageSquare}label="Message Editor"       description="Send confidential note to your editor"  onClick={() => setIsMsgModalOpen(true)} />
        <ToolboxAction icon={Bell}         label="Track Submission"     description="View real-time review pipeline status"  onClick={() => toast.info("Pipeline tracker is active.")} />
      </>
    ),
    reviewer: (
      <>
        <ToolboxAction icon={UserCheck}    label="Accept Invitation"    description="Confirm review assignment for manuscript" onClick={handleAcceptInvitation} />
        <ToolboxAction icon={CheckCircle2} label="Submit Review"        description="Log structured peer review feedback"     onClick={() => { const t = submissions.find(s => s.status === "Under Review"); t ? triggerSubmitReview(t.id) : toast.error("No manuscripts under review."); }} />
        <ToolboxAction icon={FileCheck2}   label="Download Certificate" description="Get your reviewer recognition certificate" onClick={() => toast.success("Reviewer certificate PDF downloaded.")} />
      </>
    ),
    editor: (
      <>
        <ToolboxAction icon={ShieldCheck}  label="Similarity Check"     description="Run Crossref plagiarism screening"       onClick={() => toast.success("Integrity score: 98% (GBJ-2026-104)")} />
        <ToolboxAction icon={UserCheck}    label="Reviewer Finder"      description="Smart reviewer matching by expertise"    onClick={() => toast.info("Reviewer matching system active.")} />
        <ToolboxAction icon={CalendarClock}label="Build Issue"          description="Compile accepted papers into new issue"  onClick={handleBuildIssue} />
        <ToolboxAction icon={Mail}         label="Send Decision Letter" description="Dispatch editorial decision to author"   onClick={() => toast.info("Decision letter composer opened.")} />
      </>
    ),
    admin: (
      <>
        <ToolboxAction icon={Layers}       label="Homepage CMS"         description="Feature articles on the journal homepage" onClick={() => toast.info("Homepage builder opened.")} />
        <ToolboxAction icon={ShieldCheck}  label="Editorial Policies"   description="Configure publication policy settings"   onClick={() => toast.info("Policy manager opened.")} />
        <ToolboxAction icon={CalendarClock}label="Compile & Publish"    description="Build and publish the next journal issue" onClick={handleBuildIssue} />
        <ToolboxAction icon={Activity}     label="Journal Analytics"    description="View metrics and performance dashboard"  onClick={() => toast.info("Analytics dashboard opened.")} />
      </>
    ),
    "super-admin": (
      <>
        <ToolboxAction icon={Settings}     label="Role Permissions"     description="Edit system-wide role access controls"   onClick={() => toast.info("Credential control system opened.")} />
        <ToolboxAction icon={ShieldCheck}  label="Audit Integrity"      description="Review academic integrity reports"       onClick={() => toast.info("Integrity audit dashboard opened.")} />
        <ToolboxAction icon={RefreshCw}    label="Reset Database"       description="Restore demo data to seed state"         onClick={() => setIsResetModalOpen(true)} variant="danger" />
      </>
    ),
  };

  // --- Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb]">

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col bg-[color:var(--color-gb-blue-dark)] overflow-y-auto scrollbar-none transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        <SidebarContent
          isCollapsed={isSidebarCollapsed}
          currentUser={currentUser}
          activeView={activeView}
          activeRole={activeRole}
          overrideRoleOptions={overrideRoleOptions}
          activeRoleLabel={activeRoleLabel}
          handleOverrideRoleChange={handleOverrideRoleChange}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          handleLogout={handleLogout}
          router={router}
        />
      </aside>

      {/* ── Mobile Sidebar Overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-[240px] bg-[color:var(--color-gb-blue-dark)] lg:hidden overflow-y-auto"
            >
              <SidebarContent
                isCollapsed={false}
                currentUser={currentUser}
                activeView={activeView}
                activeRole={activeRole}
                overrideRoleOptions={overrideRoleOptions}
                activeRoleLabel={activeRoleLabel}
                handleOverrideRoleChange={handleOverrideRoleChange}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                handleLogout={handleLogout}
                router={router}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* ── Top Header Bar ─────────────────────────────────────────────── */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-[color:var(--color-gb-border)] bg-white px-4 shadow-sm">
          {/* Mobile menu + collapse toggle + breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>

            <nav className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-gb-muted)] ml-1.5">
              <span className="font-medium">Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              {activeView === "analytics" ? (
                <span className="font-bold text-[color:var(--color-gb-blue)]">Analytics</span>
              ) : (
                <span className={`font-bold ${roleAccent.color}`}>{roleAccent.label}</span>
              )}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {currentUser?.role === "super-admin" && currentUser?.role !== activeRole && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                <Zap className="h-2.5 w-2.5" />
                Override: {roleAccent.label}
              </span>
            )}
            <button
              onClick={() => toast.info("No pending notifications.")}
              className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
            {activeRole === "author" && (
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue)] px-3 text-[11px] font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-colors"
              >
                <Plus className="h-3 w-3" />
                New Submission
              </Link>
            )}
          </div>
        </header>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {pathname.includes("/submissions/new") ? (
            children
          ) : (
            <>
              {/* ── Analytics View ──────────────────────────────────────────────── */}
              {activeView === "analytics" && (
                <AnalyticsPanel submissions={submissions} user={currentUser} />
              )}

              {/* ── Workspace View ──────────────────────────────────────────────── */}
              {activeView === "workspace" && (<>

          {/* Workspace banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center justify-between border-b border-l-4 border-[color:var(--color-gb-border)] px-5 py-4 bg-white/70 backdrop-blur-sm shadow-[inset_0_-1px_0_rgba(17,27,82,0.02)] transition-all duration-300",
                roleAccent.border
              )}
            >
              <div className="flex items-start gap-3.5">
                <div className={cn(
                  "p-2.5 rounded-xl border flex items-center justify-center shadow-sm shrink-0 mt-0.5",
                  roleAccent.badge
                )}>
                  {activeRole === "author" && <PenLine className="h-5 w-5" />}
                  {activeRole === "reviewer" && <UserCheck className="h-5 w-5" />}
                  {activeRole === "editor" && <ClipboardCheck className="h-5 w-5" />}
                  {activeRole === "admin" && <ShieldCheck className="h-5 w-5" />}
                  {activeRole === "super-admin" && <Crown className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border leading-none font-sans",
                      roleAccent.badge
                    )}>
                      Active Workspace
                    </span>
                  </div>
                  <h1 className="mt-1.5 text-sm font-extrabold text-[color:var(--color-gb-ink)] tracking-tight font-academic">
                    {roleAccent.label} Suite
                  </h1>
                  <p className="mt-1 max-w-2xl text-[11px] text-[color:var(--color-gb-muted)] leading-relaxed">
                    {roleNotes[activeRole]}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 p-4">
            {statsData.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                accent={stat.accent}
                index={stat.index}
              />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-4 px-4 pb-6 xl:grid-cols-[1fr_280px] items-start">

            {/* ── LEFT: Manuscript Table ──────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`table-${activeRole}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-fit rounded-xl border border-[color:var(--color-gb-border)] bg-white shadow-sm overflow-hidden"
              >
                {/* Table header */}
                <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-gb-border)] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-md bg-[color:var(--color-gb-blue-soft)] flex items-center justify-center">
                      <ClipboardCheck className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-black text-[color:var(--color-gb-ink)]">Manuscript Pipeline</h2>
                      <p className="text-[10px] text-[color:var(--color-gb-muted)]">
                        {filtered.length} record{filtered.length !== 1 ? "s" : ""} · double-blind peer review
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] px-3 py-1.5 focus-within:border-[color:var(--color-gb-blue)] focus-within:bg-white transition-all">
                      <Search className="h-3.5 w-3.5 text-[color:var(--color-gb-muted)]" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search…"
                        className="w-32 bg-transparent text-[12px] font-medium text-[color:var(--color-gb-ink)] outline-none placeholder:text-[color:var(--color-gb-muted)]"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-[color:var(--color-gb-muted)] hover:text-[color:var(--color-gb-ink)] cursor-pointer">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors cursor-pointer">
                      <Filter className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-[color:var(--color-gb-border)]">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                      <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-400 shadow-inner">
                        <FileText className="h-6 w-6 text-slate-400" />
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 border border-amber-200 text-amber-700">
                          <Search className="h-3 w-3" />
                        </span>
                      </div>
                      <h3 className="mt-3 text-xs font-bold text-slate-800">
                        No Matching Manuscripts Found
                      </h3>
                      <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-slate-500">
                        {searchQuery
                          ? `No records match "${searchQuery}". Check for typos or clear search filter.`
                          : "There are currently no manuscripts in this queue."}
                      </p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <X className="h-3 w-3 text-slate-400" />
                          Clear Search
                        </button>
                      )}
                    </div>
                  ) : filtered.map((sub) => (
                    <motion.div
                      key={sub.id}
                      layout
                      className="p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] font-black text-[color:var(--color-gb-red)]">{sub.id}</span>
                          <p className="mt-0.5 text-[13px] font-bold text-[color:var(--color-gb-ink)] leading-snug">{sub.title}</p>
                          <p className="mt-0.5 text-[10px] text-[color:var(--color-gb-muted)]">{sub.type} · {sub.author}</p>
                        </div>
                        <StatusPill status={sub.status} />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex gap-3 text-[11px] text-[color:var(--color-gb-muted)]">
                          <span>Editor: <strong className="text-[color:var(--color-gb-ink)]">{sub.editor}</strong></span>
                          <span>Score: <strong className="text-[color:var(--color-gb-blue)]">{sub.score}</strong></span>
                        </div>
                        <RowActionsDropdown
                          sub={sub}
                          canAdvance={canAdvance}
                          activeRole={activeRole}
                          advanceSubmission={advanceSubmission}
                          triggerAssignReviewer={triggerAssignReviewer}
                          triggerUploadRevision={triggerUploadRevisionModal}
                          triggerSubmitReview={triggerSubmitReview}
                          triggerViewInfo={triggerViewInfo}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                      <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-400 shadow-inner">
                        <FileText className="h-6 w-6 text-slate-400" />
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 border border-amber-200 text-amber-700">
                          <Search className="h-3 w-3" />
                        </span>
                      </div>
                      <h3 className="mt-3 text-xs font-bold text-slate-800">
                        No Matching Manuscripts Found
                      </h3>
                      <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-slate-500">
                        {searchQuery
                          ? `No records match "${searchQuery}". Check for typos or clear search filter.`
                          : "There are currently no manuscripts in this queue."}
                      </p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <X className="h-3 w-3 text-slate-400" />
                          Clear Search
                        </button>
                      )}
                    </div>
                  ) : (
                    <table className="w-full min-w-[780px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[color:var(--color-gb-border)] bg-[#f9fafc]">
                          {["Manuscript", "Status", "Reviewers", "Score", "Due Date", "Actions"].map((h) => (
                            <th key={h} className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-muted)] ${h === "Actions" ? "text-right" : ""}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[color:var(--color-gb-border)]">
                        {filtered.map((sub) => (
                          <tr key={sub.id} className="group hover:bg-[#f9fafc] transition-colors">
                            {/* Manuscript */}
                            <td className="px-4 py-3 max-w-[280px]">
                              <span className="font-mono text-[10px] font-black text-[color:var(--color-gb-red)]">{sub.id}</span>
                              <p className="mt-0.5 text-[12px] font-bold text-[color:var(--color-gb-ink)] leading-snug line-clamp-2">{sub.title}</p>
                              <p className="mt-0.5 text-[10px] text-[color:var(--color-gb-muted)]">{sub.type} · {sub.author}</p>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <StatusPill status={sub.status} />
                              <p className="mt-1 text-[10px] text-[color:var(--color-gb-muted)] flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {sub.updated}
                              </p>
                            </td>

                            {/* Reviewers */}
                            <td className="px-4 py-3">
                              {sub.reviewers.length ? (
                                <div className="space-y-0.5">
                                  {sub.reviewers.map((r, i) => (
                                    <p key={i} className="text-[10px] font-semibold text-[color:var(--color-gb-ink)] whitespace-nowrap">
                                      · {r}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] italic text-[color:var(--color-gb-muted)]">Unassigned</span>
                              )}
                            </td>

                            {/* Score */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${sub.score >= 80 ? "bg-emerald-500" : sub.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                    style={{ width: `${sub.score}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-black text-[color:var(--color-gb-ink)]">{sub.score}</span>
                              </div>
                            </td>

                            {/* Due date */}
                            <td className="px-4 py-3">
                              {canEditDates ? (
                                <CustomDatePicker
                                  value={sub.due}
                                  onChange={(d) => updateDueDate(sub.id, d)}
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold text-[color:var(--color-gb-muted)]">{sub.due}</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right">
                              <RowActionsDropdown
                                sub={sub}
                                canAdvance={canAdvance}
                                activeRole={activeRole}
                                advanceSubmission={advanceSubmission}
                                triggerAssignReviewer={triggerAssignReviewer}
                                triggerUploadRevision={triggerUploadRevisionModal}
                                triggerSubmitReview={triggerSubmitReview}
                                triggerViewInfo={triggerViewInfo}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── RIGHT: Toolbox + Activity Log ───────────────────────────── */}
            <div className="space-y-4">

              {/* Workspace Toolbox */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tools-${activeRole}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-xl border border-[color:var(--color-gb-border)] bg-white shadow-sm overflow-hidden"
                >
                  <SectionHeader
                    title="Workspace Tools"
                    description={`${roleAccent.label} quick actions`}
                    icon={Zap}
                    className="px-4 pt-3 pb-3"
                  />
                  <div className="px-3 pb-3 pt-2 space-y-1.5">
                    {toolboxActions[activeRole]}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Activity Log */}
              <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white shadow-sm overflow-hidden">
                <SectionHeader
                  title="Activity Log"
                  description="Real-time audit trail"
                  icon={Activity}
                  className="px-4 pt-3 pb-3"
                  actions={
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700">
                      <Activity className="h-3 w-3" />
                      Live
                    </span>
                  }
                />
                <div className="px-3 pb-3 pt-2 space-y-1.5 max-h-[320px] overflow-y-auto">
                  {decisionLog.length === 0 ? (
                    <p className="py-6 text-center text-[11px] italic text-[color:var(--color-gb-muted)]">No activity recorded yet.</p>
                  ) : decisionLog.map((item, i) => (
                    <motion.div
                      key={`${i}-${item.slice(0, 12)}`}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: i < 3 ? i * 0.05 : 0 }}
                      className="flex gap-2.5 rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] p-2.5"
                    >
                      <Activity className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--color-gb-blue)]" />
                      <p className="text-[10px] font-medium text-[color:var(--color-gb-muted)] leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          {/* ── End Workspace View ──────────────────────────────────────────── */}
          </>)}
          </>)}
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Author: Message Editor */}
      <CustomModal isOpen={isMsgModalOpen} onClose={() => setIsMsgModalOpen(false)} title="Send Message to Section Editor">
        <div className="space-y-4">
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-[color:var(--color-gb-muted)] uppercase tracking-wider">Message</span>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Dear Editor, I have uploaded the supplemental materials…"
              rows={4}
              className="w-full rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] p-3 text-[12px] outline-none focus:border-[color:var(--color-gb-blue)] focus:bg-white resize-none transition-colors"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-[color:var(--color-gb-border)] pt-3">
            <button onClick={() => setIsMsgModalOpen(false)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[color:var(--color-gb-border)] bg-white px-3 text-[12px] font-semibold text-[color:var(--color-gb-ink)] hover:bg-slate-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSendMessageSubmit} disabled={!msgText.trim()} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue)] px-4 text-[12px] font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <Send className="h-3.5 w-3.5" />
              Send Message
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Reviewer: Submit Review */}
      <CustomModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title={`Submit Review — ${reviewSubId}`}>
        <div className="space-y-4">
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-[color:var(--color-gb-muted)] uppercase tracking-wider">Quality Score (0–100)</span>
            <div className="flex items-center gap-3">
              <input
                type="range" min={0} max={100} value={reviewScore}
                onChange={(e) => setReviewScore(e.target.value)}
                className="flex-1 accent-[color:var(--color-gb-blue)]"
              />
              <span className="w-12 rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] px-2 py-1 text-center font-mono text-[12px] font-black text-[color:var(--color-gb-ink)]">
                {reviewScore}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${parseInt(reviewScore) >= 80 ? "bg-emerald-500" : parseInt(reviewScore) >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${reviewScore}%` }}
              />
            </div>
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-[color:var(--color-gb-muted)] uppercase tracking-wider">Recommendation</span>
            <CustomSelect options={["Accept", "Major Revision", "Reject"]} value={reviewRec} onChange={setReviewRec} className="w-full" />
          </label>
          <div className="flex justify-end gap-2 border-t border-[color:var(--color-gb-border)] pt-3">
            <button onClick={() => setIsReviewModalOpen(false)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[color:var(--color-gb-border)] bg-white px-3 text-[12px] font-semibold text-[color:var(--color-gb-ink)] hover:bg-slate-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={handleReviewSubmit} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue)] px-4 text-[12px] font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Submit Review
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Super Admin: Reset DB */}
      <CustomModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Reset Demo Database">
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[12px] font-semibold text-amber-900 leading-relaxed">
              This will restore all submissions and audit logs back to seed state, clearing any new manuscripts, reviews, and status history.
            </p>
          </div>
          <div className="flex justify-end gap-2 border-t border-[color:var(--color-gb-border)] pt-3">
            <button onClick={() => setIsResetModalOpen(false)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[color:var(--color-gb-border)] bg-white px-3 text-[12px] font-semibold text-[color:var(--color-gb-ink)] hover:bg-slate-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={handleResetDatabaseSubmit} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-600 px-4 text-[12px] font-bold text-white shadow-sm hover:bg-amber-700 transition-colors cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Database
            </button>
          </div>
        </div>
      </CustomModal>

      {/* View Manuscript Info Modal */}
      <CustomModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={`Manuscript Info — ${selectedSubmission?.id || ""}`}
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {selectedSubmission.id}
                </span>
                <StatusPill status={selectedSubmission.status} />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                {selectedSubmission.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <p><strong className="text-slate-700">Author:</strong> {selectedSubmission.author}</p>
                <p><strong className="text-slate-700">Type:</strong> {selectedSubmission.type}</p>
                <p><strong className="text-slate-700">Updated:</strong> {selectedSubmission.updated}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Assigned Reviewers</p>
                <div className="mt-1 space-y-0.5">
                  {selectedSubmission.reviewers.length > 0 ? (
                    selectedSubmission.reviewers.map((r) => (
                      <p key={r} className="font-semibold text-slate-800">• {r}</p>
                    ))
                  ) : (
                    <p className="italic text-slate-400">Unassigned</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Quality & Due</p>
                <p className="mt-1 font-semibold text-slate-800">
                  Score: <strong className="text-blue-600">{selectedSubmission.score}/100</strong>
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Due: {selectedSubmission.due}</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Abstract Summary</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                This manuscript documents empirical field data, methodology, and peer-reviewed analysis conducted under Gono Bishwabidyalay institutional research framework.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              {canAdvance && (
                <button
                  onClick={() => {
                    advanceSubmission(selectedSubmission.id);
                    setIsInfoModalOpen(false);
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[12px] font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Advance Stage
                </button>
              )}
            </div>
          </div>
        )}
      </CustomModal>

      {/* Assign Reviewer Modal */}
      <CustomModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Reviewer — ${selectedSubmission?.id || ""}`}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Manuscript</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{selectedSubmission?.title}</p>
          </div>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Select Peer Reviewer</span>
            <CustomSelect
              options={[
                "Dr. Salma Khatun",
                "Prof. Saiful Islam",
                "Dr. Monirul Hossain",
                "Dr. Nusrat Jahan",
              ]}
              value={assignedReviewerName}
              onChange={setAssignedReviewerName}
              className="w-full"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignReviewerSubmit}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-600 px-4 text-[12px] font-bold text-white shadow-sm hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Assign Reviewer
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Upload Revision Modal */}
      <CustomModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title={`Upload Manuscript Revision — ${selectedSubmission?.id || ""}`}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Manuscript</p>
            <p className="text-xs font-bold text-blue-950 mt-0.5 truncate">{selectedSubmission?.title}</p>
          </div>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Revision Response Notes</span>
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Add response to reviewer comments and summary of manuscript changes…"
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[12px] outline-none focus:border-blue-500 focus:bg-white resize-none transition-colors"
            />
          </label>
          <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center bg-slate-50/50">
            <FileText className="mx-auto h-6 w-6 text-slate-400 mb-1" />
            <p className="text-[11px] font-bold text-slate-700">Revised Manuscript (PDF/DOCX)</p>
            <p className="text-[9.5px] text-slate-400">Drag & drop or click to replace file</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              onClick={() => setIsRevisionModalOpen(false)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRevisionModalSubmit}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[12px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit Revision
            </button>
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
