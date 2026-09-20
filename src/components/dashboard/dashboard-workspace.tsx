"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Archive,
  BarChart2,
  Bell,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardCheck,
  Clock,
  Crown,
  Download,
  ExternalLink,
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
  Save,
  Search,
  SearchX,
  Send,
  Settings,
  ShieldCheck,
  Shield,
  Home as HomeIcon,
  Phone,
  TrendingUp,
  User as UserIcon,
  Users,
  UserCheck,
  X,
  Zap,
  Inbox,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { CustomModal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { DashboardBannerHeader } from "@/components/dashboard/dashboard-banner-header";
import { PremiumLoader } from "@/components/ui/loader";
import { CustomTooltip } from "@/components/ui/tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn, formatDateTime, formatDate } from "@/lib/utils";
import {
  submissions as seedSubmissions,
  type Role,
  type Submission,
} from "@/lib/data";
import { getSession, clearSession, deleteCookie, type User } from "@/lib/auth";
import { submissionsApi, reviewerApi, editorApi } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser, setUser, fetchCurrentUser } from "@/redux/features/auth/authSlice";

import { roleNotes, roleAccentMap, statusConfig } from "./workspace/workspace-data";
import { DashboardStatsGrid } from "./workspace/dashboard-stats-grid";
import { PipelineContentSkeleton } from "./workspace/pipeline-content-skeleton";
import { CustomDrawer } from "@/components/ui/drawer";
import { AssignReviewerModal } from "./workspace/assign-reviewer-modal";
import { SubmitReviewModal } from "./workspace/submit-review-modal";
import { UserManagementPanel } from "./admin/user-management-panel";
import { MailingCenterPanel } from "./admin/mailing-center-panel";
import { IssueManagementPanel } from "./admin/issue-management-panel";
import { BoardManagementPanel } from "./admin/board-management-panel";
import { PublicationsManagementPanel } from "./admin/publications-management-panel";

function getStatusConfig(status: string) {
  return statusConfig[status] ?? {
    label: status,
    classes: "bg-slate-50 text-slate-600 border-slate-200",
    icon: FileText,
  };
}

function mapDtoToSubmission(dto: any): Submission {
  if (dto.author && Array.isArray(dto.reviewers) && dto.rawId !== undefined) return dto;
  const statusMap: Record<string, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    INITIAL_CHECK: "In Desk Review",
    WITH_EDITOR: "In Desk Review",
    REVIEWER_INVITATION: "Under Review",
    UNDER_REVIEW: "Under Review",
    REVIEWS_COMPLETE: "Under Review",
    REVISION_REQUESTED: "Revisions Requested",
    REVISION_SUBMITTED: "Under Review",
    ACCEPTED: "Accepted",
    COPYEDITING: "Accepted",
    PROOFING: "Accepted",
    SCHEDULED: "Published",
    PUBLISHED: "Published",
    REJECTED: "Rejected",
    WITHDRAWN: "Archived",
  };
  const reviewersList = Array.isArray(dto.reviews)
    ? dto.reviews.map((r: any) => r.reviewerName || r.reviewerEmail || r.name).filter(Boolean)
    : Array.isArray(dto.reviewers)
      ? dto.reviewers
      : [];

  return {
    id: dto.submissionId || (dto.id ? `GBJ-2026-${dto.id}` : "GBJ-000"),
    rawId: dto.id,
    submissionId: dto.submissionId,
    title: dto.title || "Untitled Manuscript",
    runningTitle: dto.runningTitle,
    type: dto.type || "Research Article",
    topic: dto.topic,
    abstractText: dto.abstractText,
    coverLetter: dto.coverLetter,
    author: dto.submittingAuthor?.fullName || dto.author || dto.submittingAuthor?.email || "Author",
    status: statusMap[dto.status] || dto.status || "Submitted",
    editor: dto.assignedEditor?.fullName || dto.editor || "Unassigned",
    reviewers: reviewersList,
    updated: dto.updatedAt ? formatDateTime(dto.updatedAt) : "Recently",
    due: dto.reviews?.[0]?.dueDate ? formatDate(dto.reviews[0].dueDate) : "14 days",
    score: dto.reviewScore || 0,
    files: dto.files || [],
    reviews: dto.reviews || [],
    submittingAuthor: dto.submittingAuthor,
  };
}

const navItems = [
  { id: "author" as Role, label: "Author Suite", icon: PenLine, href: "/dashboard/author" },
  { id: "reviewer" as Role, label: "Reviewer Suite", icon: UserCheck, href: "/dashboard/reviewer" },
  { id: "editor" as Role, label: "Editor Suite", icon: ClipboardCheck, href: "/dashboard/editor" },
  { id: "admin" as Role, label: "Admin Suite", icon: ShieldCheck, href: "/dashboard/pipeline" },
  { id: "super-admin" as Role, label: "Super Admin", icon: Crown, href: "/dashboard/pipeline" },
];

const managementTools = [
  { id: "pipeline", label: "Manuscript Pipeline", icon: ClipboardCheck, href: "/dashboard/pipeline" },
  { id: "publications", label: "All Publications", icon: BookMarked, href: "/dashboard/publications" },
  { id: "users", label: "User Directory", icon: Users, href: "/dashboard/users" },
  { id: "mailing", label: "Mailing & Broadcast", icon: Mail, href: "/dashboard/mailing" },
  { id: "issues", label: "Issues & Volumes", icon: BookOpen, href: "/dashboard/issues" },
  { id: "board", label: "Editorial Board", icon: Crown, href: "/dashboard/board" },
  { id: "navigation", label: "Menu & Nav Manager", icon: Compass, href: "/dashboard/navigation" },
];

const cmsPages = [
  { id: "home", label: "Home Page", icon: HomeIcon, href: "/dashboard/cms/home", pageKey: "home" },
  { id: "about", label: "About Journal", icon: BookOpen, href: "/dashboard/cms/about", pageKey: "about" },
  { id: "editorial-board", label: "Editorial Board", icon: Users, href: "/dashboard/cms/editorial-board", pageKey: "editorial-board" },
  { id: "authors", label: "Author Guidelines", icon: PenLine, href: "/dashboard/cms/authors", pageKey: "authors" },
  { id: "reviewers", label: "Reviewer Guidelines", icon: CheckCircle2, href: "/dashboard/cms/reviewers", pageKey: "reviewers" },
  { id: "policies", label: "Policies & Ethics", icon: Shield, href: "/dashboard/cms/policies", pageKey: "policies" },
  { id: "issues", label: "Issues Archive", icon: Layers, href: "/dashboard/cms/issues", pageKey: "issues" },
  { id: "articles", label: "Articles & Papers", icon: FileText, href: "/dashboard/cms/articles", pageKey: "articles" },
  { id: "contact", label: "Contact Office", icon: Phone, href: "/dashboard/cms/contact", pageKey: "contact" },
];

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
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--color-gb-border) bg-white text-(--color-gb-ink) shadow-2xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
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
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  Advance Stage
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerAssignReviewer(sub);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <UserCheck className="h-3.5 w-3.5 shrink-0 text-slate-500" />
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
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                Upload Revision
              </button>
            )}

            {(activeRole === "reviewer" ||
              sub.status === "Under Review" ||
              activeRole === "editor" ||
              activeRole === "super-admin") && (
                <button
                  type="button"
                  onClick={() => {
                    triggerSubmitReview(sub.id);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
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
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
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

interface SubmissionsCacheEntry {
  role: string;
  data: Submission[];
  timestamp: number;
}
export let globalSubmissionsCache: SubmissionsCacheEntry | null = null;

export function invalidateSubmissionsCache() {
  globalSubmissionsCache = null;
}

export function DashboardWorkspace({
  initialRole = "author",
  initialView = "analytics",
  initialUser = null,
  children,
}: {
  initialRole?: Role;
  initialView?: "workspace" | "analytics";
  initialUser?: User | null;
  children?: React.ReactNode;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [currentUser, setCurrentUser] = useState<User | null>(() => reduxUser || initialUser || getSession());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduxUser) {
      setCurrentUser(reduxUser);
    } else {
      const session = initialUser || getSession();
      if (session) {
        setCurrentUser(session);
        dispatch(setUser(session));
      } else {
        dispatch(fetchCurrentUser()).then((res: any) => {
          if (res?.payload && typeof res.payload === "object") {
            setCurrentUser(res.payload as User);
          }
        });
      }
    }
  }, [reduxUser, dispatch, initialUser]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCoreExpanded, setIsCoreExpanded] = useState(true);
  const [isManagementExpanded, setIsManagementExpanded] = useState(true);
  const [isCmsExpanded, setIsCmsExpanded] = useState(true);
  const [isRoleSuitesExpanded, setIsRoleSuitesExpanded] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Lock scrolling when logout overlay is active
  useEffect(() => {
    if (isLoggingOut) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
      return () => {
        document.body.style.overflow = prevBodyOverflow || "unset";
        document.documentElement.style.overflow = prevHtmlOverflow || "unset";
        if (typeof window !== "undefined" && (window as any).__lenis) {
          (window as any).__lenis.start();
        }
      };
    }
  }, [isLoggingOut]);

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true);
    toast.success("Logged out successfully", {
      description: "You have been safely signed out of your account.",
      duration: 3500,
    });
    try {
      await dispatch(logoutUser());
    } catch { }
    clearSession();
    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  };

  const isAnalyticsPage = pathname.includes("/analytics");
  const activeRole: Role = useMemo(() => {
    if (pathname.includes("/super-admin")) return "super-admin";
    if (pathname.includes("/admin")) return "admin";
    if (pathname.includes("/editor")) return "editor";
    if (pathname.includes("/reviewer")) return "reviewer";
    if (pathname.includes("/author")) return "author";
    if (
      pathname.includes("/cms") ||
      pathname.includes("/navigation") ||
      pathname.includes("/publications") ||
      pathname.includes("/pipeline") ||
      pathname.includes("/users") ||
      pathname.includes("/mailing") ||
      pathname.includes("/issues") ||
      pathname.includes("/board")
    ) {
      return (currentUser?.role as Role) || (reduxUser?.role as Role) || "super-admin";
    }
    return (currentUser?.role as Role) || (reduxUser?.role as Role) || initialRole;
  }, [pathname, currentUser?.role, reduxUser?.role, initialRole]);

  const isAdminOrSuperAdmin = Boolean(
    currentUser?.role === "super-admin" ||
    currentUser?.role === "admin" ||
    activeRole === "admin" ||
    activeRole === "super-admin"
  );

  const activeView = isAnalyticsPage ? "analytics" : "workspace";

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    if (globalSubmissionsCache && globalSubmissionsCache.role === activeRole) {
      return globalSubmissionsCache.data;
    }
    return [];
  });
  const [isDataLoading, setIsDataLoading] = useState<boolean>(() => {
    return !(globalSubmissionsCache && globalSubmissionsCache.role === activeRole && globalSubmissionsCache.data.length > 0);
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubId, setReviewSubId] = useState("");
  const [reviewScore, setReviewScore] = useState("85");
  const [reviewRec, setReviewRec] = useState("Accept");

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  useEffect(() => {
    // Delete legacy UI and duplicate token cookies to keep the cookies table clean
    deleteCookie("sidebar_state");
    deleteCookie("gb_sidebar_collapsed");
    deleteCookie("pha_lang");
    deleteCookie("gb_access_token");
    deleteCookie("gb_refresh_token");

    if (!reduxUser) {
      const session = getSession();
      if (session) {
        setCurrentUser(session);
      }
    }

    // Fetch real submissions from backend API (with SWR caching)
    async function loadRealData(force = false) {
      const hasCache = globalSubmissionsCache && globalSubmissionsCache.role === activeRole && globalSubmissionsCache.data.length > 0;
      if (hasCache && !force) {
        setSubmissions(globalSubmissionsCache!.data);
        setIsDataLoading(false);
        // If fresh (< 45s), do not block UI with redundant network query
        if (Date.now() - globalSubmissionsCache!.timestamp < 45000) {
          return;
        }
      } else if (!hasCache) {
        setIsDataLoading(true);
      }

      try {
        let liveSubs: Submission[] = [];
        if (activeRole === "reviewer") {
          const assignments = await reviewerApi.getMyAssignments();
          if (assignments && Array.isArray(assignments)) {
            liveSubs = assignments.map(mapDtoToSubmission);
          }
        } else if (activeRole === "editor" || activeRole === "admin" || activeRole === "super-admin") {
          const res = await editorApi.listSubmissions();
          if (res && (res as any).content && Array.isArray((res as any).content)) {
            liveSubs = (res as any).content.map(mapDtoToSubmission);
          }
        } else {
          const authorSubs = await submissionsApi.getMySubmissions();
          if (authorSubs && Array.isArray(authorSubs)) {
            liveSubs = authorSubs.map(mapDtoToSubmission);
          }
        }
        setSubmissions(liveSubs);
        globalSubmissionsCache = {
          role: activeRole,
          data: liveSubs,
          timestamp: Date.now(),
        };
      } catch (err) {
        console.error("Failed to load submissions from API:", err);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadRealData();

    // Read sidebar collapse from localStorage (supporting 'sidebar_state' and 'gb_sidebar_collapsed')
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar_state") ?? localStorage.getItem("gb_sidebar_collapsed");
      if (stored === "true" || stored === "collapsed") {
        setIsSidebarCollapsed(true);
      }
    }
  }, [activeRole, reduxUser]);

  const toggleSidebar = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_state", String(nextState));
      localStorage.setItem("gb_sidebar_collapsed", String(nextState));
    }
  };

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    return submissions.filter((s) =>
      [s.id, s.title, s.status, s.author, s.type]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [submissions, currentUser, activeRole, searchQuery]);

  function updateSubmissionsState(newSubs: Submission[]) {
    setSubmissions(newSubs);
  }

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
    updateSubmissionsState(newSubs);
    toast.success(`Status advanced to "${nextStatus}".`);
  }

  async function handleAssignReviewerSubmit(subId: string, reviewerName: string, reviewerId?: number) {
    const sub = submissions.find((s) => s.id === subId);
    const targetNumericId = sub?.rawId;

    if (targetNumericId && reviewerId) {
      try {
        await editorApi.assignReviewer(targetNumericId, reviewerId);
        toast.success(`Assigned ${reviewerName} to ${subId}.`);
        try {
          const res = await editorApi.listSubmissions();
          if (res && (res as any).content && Array.isArray((res as any).content)) {
            setSubmissions((res as any).content.map(mapDtoToSubmission));
          }
        } catch { }
        return;
      } catch (err: any) {
        console.error("Failed to assign reviewer:", err);
        toast.error(err?.message || "Failed to assign reviewer on server.");
        return;
      }
    }

    const newSubs = submissions.map((s) => {
      if (s.id !== subId) return s;
      const reviewers = Array.from(new Set([...s.reviewers, reviewerName]));
      const status = s.status === "Awaiting Editor" ? "Under Review" : s.status;
      return { ...s, reviewers, status, updated: "Just now" };
    });
    updateSubmissionsState(newSubs);
    toast.success(`Assigned ${reviewerName} to ${subId}.`);
  }

  function updateDueDate(id: string, newDate: string) {
    const newSubs = submissions.map((s) =>
      s.id === id ? { ...s, due: newDate, updated: "Just now" } : s
    );
    updateSubmissionsState(newSubs);
    toast.success(`Due date updated to ${newDate}.`);
  }

  function handleSendMessageSubmit() {
    if (!msgText.trim()) return;
    setIsMsgModalOpen(false);
    setMsgText("");
    toast.success("Message dispatched to editor.");
  }

  function handleUploadRevision() {
    const target = submissions.find((s) => s.status === "Revision Requested");
    if (!target) {
      toast.error("No manuscripts currently await revision.");
      return;
    }
    const newSubs = submissions.map((s) =>
      s.id === target.id
        ? { ...s, status: "Revised Manuscript Submitted", updated: "Just now" }
        : s
    );
    updateSubmissionsState(newSubs);
    toast.success(`Revision uploaded for ${target.id}.`);
  }

  function handleAcceptInvitation() {
    const target = submissions.find((s) => s.status === "Under Review");
    if (!target) {
      toast.info("No pending review invitations.");
      return;
    }
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
    const target =
      sub ||
      submissions.find((s) => s.status === "Revision Requested") ||
      submissions[0];
    if (target) {
      setSelectedSubmission(target);
      setIsRevisionModalOpen(true);
    }
  }

  function handleRevisionModalSubmit() {
    if (!selectedSubmission) return;
    const newSubs = submissions.map((s) =>
      s.id === selectedSubmission.id
        ? { ...s, status: "Revised Manuscript Submitted", updated: "Just now" }
        : s
    );
    updateSubmissionsState(newSubs);
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

  async function handleReviewSubmit(payload: {
    recommendation: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";
    score: number;
    reviewComments: string;
    confidentialComments?: string;
  }) {
    const sub = submissions.find((s) => s.id === reviewSubId) || selectedSubmission;
    const targetId = sub?.rawId || reviewSubId;

    try {
      await reviewerApi.submitReview(targetId, payload);
      toast.success(`Review submitted successfully!`);
      setIsReviewModalOpen(false);
      try {
        const assignments = await reviewerApi.getMyAssignments();
        if (assignments && Array.isArray(assignments)) {
          setSubmissions(assignments.map(mapDtoToSubmission));
        }
      } catch { }
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      toast.error(err?.message || "Failed to submit review.");
    }
  }

  function handleBuildIssue() {
    const acceptedCount = submissions.filter(
      (s) => s.status === "Accepted"
    ).length;
    if (!acceptedCount) {
      toast.warning("No 'Accepted' manuscripts to compile.");
      return;
    }
    const newSubs = submissions.map((s) =>
      s.status === "Accepted"
        ? { ...s, status: "Published", updated: "Just now" }
        : s
    );
    updateSubmissionsState(newSubs);
    toast.success(`Published ${acceptedCount} papers to current issue.`);
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
  const canAdvance = ["editor", "admin", "super-admin"].includes(activeRole);
  const roleAccent = roleAccentMap[activeRole];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5f7fb]">
      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
              data-lenis-prevent="true"
            />

            {/* Slide-over Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 flex w-70 max-w-[85vw] flex-col bg-[#070e24] border-r border-white/8 shadow-2xl lg:hidden text-white overflow-hidden"
              data-lenis-prevent="true"
            >
              {/* Header */}
              <div className="h-16 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#050b1d] px-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-white/20 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/gb-logo-official.png"
                      alt="Gono Bishwabidyalay emblem"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-academic font-bold text-sm tracking-wide text-white leading-tight">
                      GB JOURNAL
                    </p>
                    <p className="text-[8.5px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                      Research Workspace
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Body */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 min-h-0 sidebar-scroll no-scrollbar p-3 space-y-4"
              >
                {/* Core Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsCoreExpanded(!isCoreExpanded)}
                    className="w-full px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 flex items-center justify-between hover:text-slate-200 transition-colors cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>Core Workspace</span>
                      <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isCoreExpanded && "-rotate-90")} />
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-300 font-bold">Core</span>
                  </button>
                  {isCoreExpanded && (
                    <div className="space-y-1">
                      {/* Non-admin suites */}
                      {activeRole !== "admin" && activeRole !== "super-admin" && (
                        navItems
                          .filter((item) => activeRole === item.id)
                          .map((item) => {
                            const Icon = item.icon;
                            const isActive = activeView === "workspace" && !pathname.includes("/profile");
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setIsMobileSidebarOpen(false);
                                  router.push(item.href);
                                }}
                                className={cn(
                                  "flex w-full items-center text-left text-xs transition-all duration-150 cursor-pointer h-10 px-3 gap-3 rounded-xl border-l-[3px]",
                                  isActive
                                    ? "bg-blue-600/20 text-white font-bold border-l-blue-400 shadow-xs"
                                    : "text-slate-300 hover:bg-white/6 hover:text-white border-l-transparent"
                                )}
                              >
                                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#60a5fa]" : "text-slate-400")} />
                                <span className="truncate flex-1 font-medium">{item.label}</span>
                                {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                              </button>
                            );
                          })
                      )}

                      <button
                        onClick={() => {
                          setIsMobileSidebarOpen(false);
                          router.push("/dashboard/analytics");
                        }}
                        className={cn(
                          "flex w-full items-center text-left text-xs transition-all duration-150 cursor-pointer h-10 px-3 gap-3 rounded-xl border-l-[3px]",
                          activeView === "analytics" && !pathname.includes("/profile")
                            ? "bg-blue-600/20 text-white font-bold border-l-blue-400 shadow-xs"
                            : "text-slate-300 hover:bg-white/6 hover:text-white border-l-transparent"
                        )}
                      >
                        <BarChart2 className={cn("h-4 w-4 shrink-0", activeView === "analytics" && !pathname.includes("/profile") ? "text-[#60a5fa]" : "text-slate-400")} />
                        <span className="flex-1 font-medium">Journal Analytics</span>
                        {activeView === "analytics" && !pathname.includes("/profile") && (
                          <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Administration Management Tools */}
                {isAdminOrSuperAdmin && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsManagementExpanded(!isManagementExpanded)}
                      className="w-full px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 flex items-center justify-between hover:text-slate-200 transition-colors cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Management Tools</span>
                        <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isManagementExpanded && "-rotate-90")} />
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">Admin</span>
                    </button>
                    {isManagementExpanded && (
                      <div className="space-y-1">
                        {managementTools.map((tab) => {
                          const Icon = tab.icon;
                          const isTabActive = pathname.startsWith(tab.href);

                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                setIsMobileSidebarOpen(false);
                                router.push(tab.href);
                              }}
                              className={cn(
                                "flex w-full items-center rounded-xl text-left text-xs transition-colors h-9 px-3 gap-3 cursor-pointer",
                                isTabActive
                                  ? "bg-blue-600/20 text-white font-bold"
                                  : "text-slate-300 hover:bg-white/6 hover:text-white"
                              )}
                            >
                              <Icon className={cn("h-4 w-4 shrink-0", isTabActive ? "text-blue-400" : "text-slate-400")} />
                              <span className="truncate flex-1">{tab.label}</span>
                              {isTabActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Pages CMS Category */}
                {isAdminOrSuperAdmin && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsCmsExpanded(!isCmsExpanded)}
                      className="w-full px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 flex items-center justify-between hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Pages CMS</span>
                        <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isCmsExpanded && "-rotate-90")} />
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">Content</span>
                    </button>
                    {isCmsExpanded && (
                      <div className="space-y-1">
                        {cmsPages.map((tab) => {
                          const Icon = tab.icon;
                          const isTabActive = pathname === tab.href || (tab.id === "home" && pathname === "/dashboard/cms");

                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                setIsMobileSidebarOpen(false);
                                router.push(tab.href);
                              }}
                              className={cn(
                                "flex w-full items-center rounded-xl text-left text-xs transition-colors h-9 px-3 gap-3 cursor-pointer",
                                isTabActive
                                  ? "bg-blue-600/20 text-white font-bold"
                                  : "text-slate-300 hover:bg-white/6 hover:text-white"
                              )}
                            >
                              <Icon className={cn("h-4 w-4 shrink-0", isTabActive ? "text-blue-400" : "text-slate-400")} />
                              <span className="truncate flex-1">{tab.label}</span>
                              {isTabActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Role Suites */}
                {isAdminOrSuperAdmin && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsRoleSuitesExpanded(!isRoleSuitesExpanded)}
                      className="w-full px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 flex items-center justify-between hover:text-slate-200 transition-colors cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Role Suites</span>
                        <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isRoleSuitesExpanded && "-rotate-90")} />
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">Roles</span>
                    </button>
                    {isRoleSuitesExpanded && (
                      <div className="space-y-1">
                        {navItems
                          .filter((item) => item.id !== "admin" && item.id !== "super-admin" && item.id !== activeRole)
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
                                  "flex w-full items-center text-left text-xs transition-all duration-150 cursor-pointer h-9 px-3 gap-3 rounded-xl border-l-[3px]",
                                  isActive
                                    ? "bg-white/10 text-white font-semibold border-l-amber-400 shadow-xs"
                                    : "text-slate-400 hover:bg-white/4 hover:text-slate-200 border-l-transparent"
                                )}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="truncate flex-1">{item.label}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Footer with Profile & Sign Out */}
              {mounted && currentUser && (
                <div className="mt-auto border-t border-white/8 p-3 bg-[#050b1d] space-y-2">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 transition-colors"
                  >
                    <div className="relative shrink-0">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/15"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 font-bold text-xs">
                          {currentUser.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 capitalize">
                        {currentUser.role.replace("-", " ")}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-white/4 hover:bg-white/8 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-white/6"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>Public Homepage</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors cursor-pointer border border-rose-500/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        data-lenis-prevent="true"
        suppressHydrationWarning
        className={cn(
          "hidden lg:flex flex-col transition-[width] duration-300 ease-in-out shrink-0 bg-[#070e24] border-r border-white/[0.07] shadow-[4px_0_40px_rgba(0,0,0,0.35)] h-full overflow-hidden z-30",
          mounted && isSidebarCollapsed ? "w-17" : "w-67.5"
        )}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Header Brand */}
          <div className="h-16 flex items-center px-3 border-b border-white/10 shrink-0 bg-[#050b1d]">
            <Link
              href="/"
              className="flex items-center w-full group overflow-hidden"
              title="Return to Public Journal"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <div className="h-9 w-9 rounded-lg bg-white border border-white/20 p-1 flex items-center justify-center shrink-0 group-hover:border-amber-400/80 transition-colors shadow-xs">
                  <img
                    src="/gb-logo-official.png"
                    alt="Gono Bishwabidyalay emblem"
                    className="h-7 w-7 object-contain"
                  />
                </div>
              </div>
              <div
                className={cn(
                  "min-w-0 flex-1 pl-2.5 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                  isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                <p className="font-academic font-bold text-sm tracking-wide text-white leading-tight truncate">
                  GB JOURNAL
                </p>
                <p className="text-[8.5px] text-slate-400 uppercase tracking-wider font-mono mt-0.5 truncate">
                  Research Workspace
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="mt-3 flex-1 min-h-0 sidebar-scroll no-scrollbar space-y-4 px-3"
          >
            {/* Core Section */}
            <div>
              <div
                onClick={() => !isSidebarCollapsed && setIsCoreExpanded(!isCoreExpanded)}
                className={cn(
                  "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200 flex items-center justify-between select-none",
                  !isSidebarCollapsed && "cursor-pointer hover:text-slate-200",
                  isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span>Core Workspace</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isCoreExpanded && "-rotate-90")} />
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-300 font-bold">Core</span>
              </div>
              {(isCoreExpanded || isSidebarCollapsed) && (
                <div className="space-y-1">
                  {/* Active Workspace for Non-Admin roles */}
                  {activeRole !== "admin" && activeRole !== "super-admin" && (
                    navItems
                      .filter((item) => activeRole === item.id)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === "workspace" && !pathname.includes("/profile");
                        return (
                          <CustomTooltip
                            key={item.id}
                            content={item.label}
                            disabled={!isSidebarCollapsed}
                            side="right"
                          >
                            <button
                              onClick={() => {
                                setIsMobileSidebarOpen(false);
                                router.push(item.href);
                              }}
                              className={cn(
                                "flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group",
                                isActive
                                  ? "bg-blue-600/20 text-white font-bold shadow-xs"
                                  : "text-slate-300 hover:bg-white/6 hover:text-white"
                              )}
                            >
                              {isActive && (
                                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-400" />
                              )}
                              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-[#60a5fa]" : "text-slate-400 group-hover:text-white")} />
                              </div>
                              <div
                                className={cn(
                                  "min-w-0 flex-1 flex items-center justify-between pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                                  isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                                )}
                              >
                                <span className="truncate font-medium text-slate-200 group-hover:text-white">
                                  {item.label}
                                </span>
                                {isActive && (
                                  <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-1" />
                                )}
                              </div>
                            </button>
                          </CustomTooltip>
                        );
                      })
                  )}

                  {/* Analytics */}
                  <CustomTooltip
                    content="Journal Analytics"
                    disabled={!isSidebarCollapsed}
                    side="right"
                  >
                    <button
                      onClick={() => {
                        setIsMobileSidebarOpen(false);
                        router.push("/dashboard/analytics");
                      }}
                      className={cn(
                        "flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group",
                        activeView === "analytics" && !pathname.includes("/profile")
                          ? "bg-blue-600/20 text-white font-bold shadow-xs"
                          : "text-slate-300 hover:bg-white/6 hover:text-white"
                      )}
                    >
                      {activeView === "analytics" && !pathname.includes("/profile") && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-400" />
                      )}
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <BarChart2 className={cn("h-4 w-4 transition-colors", activeView === "analytics" && !pathname.includes("/profile") ? "text-[#60a5fa]" : "text-slate-400 group-hover:text-white")} />
                      </div>
                      <div
                        className={cn(
                          "min-w-0 flex-1 flex items-center justify-between pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                          isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                      >
                        <span className="truncate font-medium text-slate-200 group-hover:text-white">
                          Journal Analytics
                        </span>
                        {activeView === "analytics" && !pathname.includes("/profile") && (
                          <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-1" />
                        )}
                      </div>
                    </button>
                  </CustomTooltip>
                </div>
              )}
            </div>

            {/* Administration Management Tools (Desktop) */}
            {isAdminOrSuperAdmin && (
              <div>
                <div
                  onClick={() => !isSidebarCollapsed && setIsManagementExpanded(!isManagementExpanded)}
                  className={cn(
                    "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200 flex items-center justify-between select-none",
                    !isSidebarCollapsed && "cursor-pointer hover:text-slate-200",
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span>Management Tools</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isManagementExpanded && "-rotate-90")} />
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">Admin</span>
                </div>
                {(isManagementExpanded || isSidebarCollapsed) && (
                  <div className="space-y-1">
                    {managementTools.map((tab) => {
                      const Icon = tab.icon;
                      const isTabActive = pathname.startsWith(tab.href);

                      return (
                        <CustomTooltip
                          key={tab.id}
                          content={tab.label}
                          disabled={!isSidebarCollapsed}
                          side="right"
                        >
                          <button
                            onClick={() => {
                              setIsMobileSidebarOpen(false);
                              router.push(tab.href);
                            }}
                            className={cn(
                              "flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group",
                              isTabActive
                                ? "bg-blue-600/20 text-white font-bold shadow-xs"
                                : "text-slate-300 hover:bg-white/6 hover:text-white"
                            )}
                          >
                            {isTabActive && (
                              <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-400" />
                            )}
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                              <Icon className={cn("h-4 w-4 transition-colors", isTabActive ? "text-[#60a5fa]" : "text-slate-400 group-hover:text-white")} />
                            </div>
                            <div
                              className={cn(
                                "min-w-0 flex-1 flex items-center justify-between pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                                isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                              )}
                            >
                              <span className="truncate font-medium text-slate-200 group-hover:text-white">
                                {tab.label}
                              </span>
                              {isTabActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-1" />
                              )}
                            </div>
                          </button>
                        </CustomTooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pages CMS Category */}
            {isAdminOrSuperAdmin && (
              <div>
                <div
                  onClick={() => !isSidebarCollapsed && setIsCmsExpanded(!isCmsExpanded)}
                  className={cn(
                    "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200 flex items-center justify-between",
                    !isSidebarCollapsed && "cursor-pointer hover:text-slate-200",
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span>Pages CMS</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isCmsExpanded && "-rotate-90")} />
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">Content</span>
                </div>
                {(isCmsExpanded || isSidebarCollapsed) && (
                  <div className="space-y-1">
                    {cmsPages.map((tab) => {
                      const Icon = tab.icon;
                      const isTabActive = pathname === tab.href || (tab.id === "home" && pathname === "/dashboard/cms");

                      return (
                        <CustomTooltip
                          key={tab.id}
                          content={tab.label}
                          disabled={!isSidebarCollapsed}
                          side="right"
                        >
                          <button
                            onClick={() => {
                              setIsMobileSidebarOpen(false);
                              router.push(tab.href);
                            }}
                            className={cn(
                              "flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group",
                              isTabActive
                                ? "bg-blue-600/20 text-white font-bold shadow-xs"
                                : "text-slate-300 hover:bg-white/6 hover:text-white"
                            )}
                          >
                            {isTabActive && (
                              <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-400" />
                            )}
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                              <Icon className={cn("h-4 w-4 transition-colors", isTabActive ? "text-[#60a5fa]" : "text-slate-400 group-hover:text-white")} />
                            </div>
                            <div
                              className={cn(
                                "min-w-0 flex-1 flex items-center justify-between pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                                isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                              )}
                            >
                              <span className="truncate font-medium text-slate-200 group-hover:text-white">
                                {tab.label}
                              </span>
                              {isTabActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-1" />
                              )}
                            </div>
                          </button>
                        </CustomTooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Role Views Switcher (if admin or super-admin) */}
            {isAdminOrSuperAdmin && (
              <div>
                <div
                  onClick={() => !isSidebarCollapsed && setIsRoleSuitesExpanded(!isRoleSuitesExpanded)}
                  className={cn(
                    "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200 flex items-center justify-between select-none",
                    !isSidebarCollapsed && "cursor-pointer hover:text-slate-200",
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span>Role Suites</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-400", !isRoleSuitesExpanded && "-rotate-90")} />
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">Roles</span>
                </div>
                {(isRoleSuitesExpanded || isSidebarCollapsed) && (
                  <div className="space-y-1">
                    {navItems
                      .filter((item) => item.id !== "admin" && item.id !== "super-admin" && item.id !== activeRole)
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <CustomTooltip
                            key={item.id}
                            content={item.label}
                            disabled={!isSidebarCollapsed}
                            side="right"
                          >
                            <button
                              onClick={() => {
                                setIsMobileSidebarOpen(false);
                                router.push(item.href);
                              }}
                              className="flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group text-slate-400 hover:bg-white/4 hover:text-slate-200"
                            >
                              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200" />
                              </div>
                              <div
                                className={cn(
                                  "min-w-0 flex-1 pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                                  isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                                )}
                              >
                                <span className="truncate text-slate-300 group-hover:text-white">
                                  {item.label}
                                </span>
                              </div>
                            </button>
                          </CustomTooltip>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls: User Card Trigger with Profile & Sign Out Popover */}
          <div
            ref={userMenuRef}
            suppressHydrationWarning
            className="mt-auto border-t border-white/8 relative shrink-0 bg-[#050b1d] p-3 transition-colors"
          >
            {/* Popover Menu */}
            <AnimatePresence>
              {isUserMenuOpen && currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(
                    "absolute z-50 rounded-2xl bg-[#09122c] border border-white/12 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-white backdrop-blur-2xl ring-1 ring-white/10",
                    isSidebarCollapsed
                      ? "left-full bottom-2 ml-3 w-64"
                      : "bottom-full left-2.5 right-2.5 mb-2.5"
                  )}
                >
                  {/* User info header card */}
                  <div className="px-3 py-2.5 rounded-xl bg-white/3 border border-white/6 mb-1 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/20"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 font-bold text-xs ring-1 ring-white/15">
                            {currentUser.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="text-xs font-bold text-white truncate">
                            {currentUser.name}
                          </p>
                          <span className={cn(
                            "inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shrink-0",
                            currentUser.role === "super-admin"
                              ? "bg-amber-400/15 text-amber-300 border-amber-400/25"
                              : currentUser.role === "admin"
                                ? "bg-blue-400/15 text-blue-300 border-blue-400/25"
                                : currentUser.role === "editor"
                                  ? "bg-emerald-400/15 text-emerald-300 border-emerald-400/25"
                                  : currentUser.role === "reviewer"
                                    ? "bg-purple-400/15 text-purple-300 border-purple-400/25"
                                    : "bg-sky-400/15 text-sky-300 border-sky-400/25"
                          )}>
                            {currentUser.role.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    {currentUser.department && (
                      <div className="pt-1.5 border-t border-white/6 flex items-center gap-1.5 text-[9.5px] text-slate-400 truncate">
                        <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{currentUser.department}</span>
                      </div>
                    )}
                  </div>

                  {/* Action items */}
                  <div className="space-y-0.5">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span>Academic Profile</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <div className="my-1 border-t border-white/8" />

                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        <span>Public Homepage</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <div className="my-1 border-t border-white/8" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-300 transition-colors" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger Button showing user image, name, and role */}
            {currentUser ? (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-150 cursor-pointer border group h-11 w-full overflow-hidden",
                  isUserMenuOpen
                    ? "bg-white/10 border-white/20 shadow-md ring-1 ring-white/10"
                    : "bg-white/3 border-white/8 hover:bg-white/7 hover:border-white/15"
                )}
                title={`${currentUser.name} (${currentUser.role}) — Click for options`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/15"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 font-bold text-xs ring-1 ring-white/15 shadow-inner">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Name & Role (expanded only) */}
                <div
                  className={cn(
                    "min-w-0 flex-1 flex items-center justify-between pr-2.5 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200 text-left",
                    isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-100 truncate leading-tight group-hover:text-white transition-colors">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal capitalize">
                      {currentUser.role.replace("-", " ")}
                    </p>
                  </div>

                  <ChevronsUpDown className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-all text-slate-400 group-hover:text-slate-200 ml-1",
                    isUserMenuOpen && "text-slate-200 rotate-180"
                  )} />
                </div>
              </button>
            ) : (
              <div suppressHydrationWarning className="flex items-center rounded-xl border border-white/8 bg-white/3 h-11 w-full px-2 gap-2 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-white/10 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="h-2 w-12 rounded bg-white/10" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <header className="shrink-0 z-20 flex h-12 items-center justify-between border-b border-(--color-gb-border) bg-white/95 backdrop-blur-md px-4 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-(--color-gb-border) bg-white text-(--color-gb-muted) hover:bg-slate-50 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-(--color-gb-border) bg-white text-(--color-gb-muted) hover:bg-slate-50 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>

            <nav className="flex items-center gap-1.5 text-[11px] text-(--color-gb-muted) ml-1.5">
              <Link href="/dashboard" className="font-medium hover:text-gb-blue transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="h-3 w-3" />
              {pathname.includes("/profile") ? (
                <span className="font-bold text-gb-blue">
                  Academic Profile
                </span>
              ) : pathname.includes("/submissions/new") ? (
                <span className="font-bold text-gb-blue">
                  New Submission
                </span>
              ) : pathname.includes("/cms") ? (
                <span className="font-bold text-gb-blue">
                  Site &amp; Pages CMS
                </span>
              ) : pathname.includes("/navigation") ? (
                <span className="font-bold text-gb-blue">
                  Menu &amp; Nav Manager
                </span>
              ) : pathname.includes("/publications") ? (
                <span className="font-bold text-gb-blue">
                  All Publications
                </span>
              ) : activeView === "analytics" ? (
                <span className="font-bold text-gb-blue">
                  Analytics
                </span>
              ) : (
                <span className={`font-bold ${roleAccent.color}`}>
                  {roleAccent.label}
                </span>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("No pending notifications.")}
              className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-(--color-gb-border) bg-white text-(--color-gb-muted) hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
            {activeRole === "author" && !pathname.includes("/profile") && (
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-gb-blue px-3 text-[11px] font-bold text-white shadow-sm hover:bg-gb-blue-dark transition-colors"
              >
                <Plus className="h-3 w-3" />
                New Submission
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto">
          {pathname.includes("/submissions/new") ||
            pathname.includes("/profile") ||
            pathname.includes("/cms") ||
            pathname.includes("/navigation") ||
            pathname.includes("/publications") ||
            pathname.includes("/pipeline") ||
            pathname.includes("/users") ||
            pathname.includes("/mailing") ||
            pathname.includes("/issues") ||
            pathname.includes("/board") ||
            pathname.includes("/super-admin") ||
            pathname.includes("/admin") ? (
            children
          ) : (
            <>
              {activeView === "analytics" && (
                <AnalyticsPanel submissions={submissions} user={currentUser} />
              )}

              {activeView === "workspace" && (
                <>
                  <AnimatePresence mode="wait">
                    <DashboardBannerHeader
                      key={activeRole}
                      title={`${roleAccent.label} Suite`}
                      subtitle={roleNotes[activeRole]}
                      badge="Active Workspace"
                      icon={
                        activeRole === "author"
                          ? PenLine
                          : activeRole === "reviewer"
                          ? UserCheck
                          : activeRole === "editor"
                          ? ClipboardCheck
                          : activeRole === "admin"
                          ? ShieldCheck
                          : Crown
                      }
                      borderAccentClassName={roleAccent.border}
                      badgeClassName={roleAccent.badge}
                      animate
                    />
                  </AnimatePresence>

                  <div>
                    <div className="p-4">
                      <DashboardStatsGrid
                        submissions={activeRole === "reviewer" || activeRole === "author" ? filtered : submissions}
                        isLoading={isDataLoading && submissions.length === 0}
                      />
                    </div>

                    <div className="px-4 pb-6 space-y-4">
                      {!mounted || (isDataLoading && submissions.length === 0) ? (
                        <PipelineContentSkeleton rows={6} />
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`table-${activeRole}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="h-fit rounded-xl border border-(--color-gb-border) bg-white shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-3 border-b border-(--color-gb-border) px-4 py-3 rounded-t-xl">
                              <div className="flex items-center gap-2.5">
                                <div className="h-6 w-6 rounded-md bg-gb-blue-soft flex items-center justify-center">
                                  <ClipboardCheck className="h-3.5 w-3.5 text-gb-blue" />
                                </div>
                                <div>
                                  <h2 className="text-[13px] font-black text-gb-ink">
                                    Manuscript Pipeline
                                  </h2>
                                  <p className="text-[10px] text-(--color-gb-muted)" suppressHydrationWarning>
                                    {`${filtered.length} record${filtered.length !== 1 ? "s" : ""}`} · double-blind peer review
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 rounded-lg border border-(--color-gb-border) bg-[#f9fafc] px-3 py-1.5 focus-within:border-gb-blue focus-within:bg-white transition-all">
                                  <Search className="h-3.5 w-3.5 text-(--color-gb-muted)" />
                                  <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search…"
                                    className="w-32 bg-transparent text-[12px] font-medium text-gb-ink outline-none placeholder:text-(--color-gb-muted)"
                                  />
                                  {searchQuery && (
                                    <button
                                      onClick={() => setSearchQuery("")}
                                      className="text-(--color-gb-muted) hover:text-gb-ink cursor-pointer"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {filtered.length === 0 ? (
                            <div className="py-14 px-6 flex flex-col items-center justify-center text-center">
                              {searchQuery.trim() ? (
                                <div className="flex flex-col items-center max-w-sm">
                                  <div className="relative mb-4 flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200/80 border border-slate-200 flex items-center justify-center shadow-inner">
                                      <SearchX className="h-7 w-7 text-gb-blue" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs text-[10px] font-bold">
                                      0
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-extrabold text-gb-ink font-academic tracking-tight">
                                    No Manuscripts Found
                                  </h3>
                                  <p className="mt-1.5 text-xs text-(--color-gb-muted) leading-relaxed">
                                    No records match <span className="font-semibold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">&quot;{searchQuery}&quot;</span>. Try checking for typos or searching by author name or manuscript ID.
                                  </p>
                                  <button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gb-blue-soft border border-gb-blue/20 px-3.5 py-1.5 text-xs font-bold text-gb-blue hover:bg-gb-blue hover:text-white transition-all shadow-xs cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    Clear Search Filter
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center max-w-md">
                                  <div className="relative mb-4 flex items-center justify-center">
                                    <div className="absolute -inset-2 rounded-3xl bg-gb-blue/5 blur-lg" />
                                    <div className="relative h-16 w-16 rounded-2xl bg-linear-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 flex items-center justify-center shadow-[0_8px_24px_rgba(17,27,82,0.06)]">
                                      {activeRole === "author" && <PenLine className="h-7 w-7 text-gb-blue" />}
                                      {activeRole === "reviewer" && <UserCheck className="h-7 w-7 text-purple-600" />}
                                      {activeRole === "editor" && <ClipboardCheck className="h-7 w-7 text-emerald-600" />}
                                      {(activeRole === "admin" || activeRole === "super-admin") && <Inbox className="h-7 w-7 text-amber-600" />}
                                    </div>
                                  </div>
                                  <h3 className="text-sm font-extrabold text-gb-ink font-academic tracking-tight">
                                    {activeRole === "author" && "No Manuscripts Submitted Yet"}
                                    {activeRole === "reviewer" && "No Manuscripts Assigned for Review"}
                                    {activeRole === "editor" && "Editorial Pipeline is Clear"}
                                    {(activeRole === "admin" || activeRole === "super-admin") && "No Active Manuscripts in Pipeline"}
                                  </h3>
                                  <p className="mt-1.5 text-xs text-(--color-gb-muted) leading-relaxed">
                                    {activeRole === "author" &&
                                      "You haven't submitted any research papers to Gono Bishwabidyalay Journal yet. Start a new manuscript submission to begin peer review."}
                                    {activeRole === "reviewer" &&
                                      "You currently have no pending manuscripts awaiting evaluation. New double-blind peer review invitations will appear here."}
                                    {activeRole === "editor" &&
                                      "There are currently no active manuscripts in this editorial queue. New submissions will automatically populate here for desk evaluation and reviewer assignment."}
                                    {(activeRole === "admin" || activeRole === "super-admin") &&
                                      "The journal database currently has no active manuscripts under this filter. You can submit a new manuscript to test workflows."}
                                  </p>
                                  {(activeRole === "author" || activeRole === "admin" || activeRole === "super-admin") && (
                                    <div className="mt-4">
                                      <Link
                                        href="/dashboard/submissions/new"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-gb-blue-dark transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                        New Manuscript Submission
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {/* Desktop Table View */}
                              <div className="hidden md:block">
                                <Table minWidth={780}>
                                  <TableHeader>
                                    <TableRow>
                                      {[
                                        "Manuscript",
                                        "Status",
                                        "Reviewers",
                                        "Score",
                                        "Due Date",
                                        "Actions",
                                      ].map((h) => (
                                        <TableHead
                                          key={h}
                                          className={h === "Actions" ? "text-right" : ""}
                                        >
                                          {h}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody suppressHydrationWarning>
                                    {filtered.map((sub) => (
                                      <TableRow key={sub.id}>
                                        <TableCell className="max-w-70">
                                          <span className="font-mono text-[10px] font-black text-gb-red">
                                            {sub.id}
                                          </span>
                                          <p className="mt-0.5 text-[12px] font-bold text-gb-ink leading-snug line-clamp-2">
                                            {sub.title}
                                          </p>
                                          <p className="mt-0.5 text-[10px] text-(--color-gb-muted)">
                                            {sub.type} · {sub.author}
                                          </p>
                                        </TableCell>
                                        <TableCell>
                                          <StatusPill status={sub.status} />
                                          <p
                                            className="mt-1 text-[10px] text-(--color-gb-muted) flex items-center gap-1 font-medium whitespace-nowrap"
                                            suppressHydrationWarning
                                          >
                                            <Clock className="h-2.5 w-2.5 shrink-0" />
                                            {formatDateTime(sub.updated)}
                                          </p>
                                        </TableCell>
                                        <TableCell>
                                          {sub.reviewers.length ? (
                                            <div className="space-y-0.5">
                                              {sub.reviewers.map((r, i) => (
                                                <p
                                                  key={i}
                                                  className="text-[10px] font-semibold text-gb-ink whitespace-nowrap"
                                                >
                                                  · {r}
                                                </p>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-[10px] italic text-(--color-gb-muted)">
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
                                            <span className="text-[11px] font-black text-gb-ink">
                                              {sub.score}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {canEditDates ? (
                                            <CustomDatePicker
                                              value={sub.due}
                                              onChange={(d) => updateDueDate(sub.id, d)}
                                            />
                                          ) : (
                                            <span className="font-mono text-[11px] font-bold text-(--color-gb-muted)">
                                              {sub.due}
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <RowActionsDropdown
                                            sub={sub}
                                            canAdvance={canAdvance}
                                            activeRole={activeRole}
                                            advanceSubmission={advanceSubmission}
                                            triggerAssignReviewer={triggerAssignReviewer}
                                            triggerUploadRevision={
                                              triggerUploadRevisionModal
                                            }
                                            triggerSubmitReview={triggerSubmitReview}
                                            triggerViewInfo={triggerViewInfo}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Mobile Card List View */}
                              <div className="md:hidden divide-y divide-(--color-gb-border)">
                                {filtered.map((sub) => (
                                  <div key={sub.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <span className="font-mono text-[10px] font-black text-gb-red">
                                          {sub.id}
                                        </span>
                                        <h4 className="mt-0.5 text-xs font-bold text-gb-ink leading-snug">
                                          {sub.title}
                                        </h4>
                                        <p className="mt-0.5 text-[10px] text-(--color-gb-muted)">
                                          {sub.type} · {sub.author}
                                        </p>
                                      </div>
                                      <StatusPill status={sub.status} />
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-(--color-gb-muted) border-t border-slate-100">
                                      <span className="flex items-center gap-1 font-medium" suppressHydrationWarning>
                                        <Clock className="h-3 w-3 shrink-0" />
                                        {formatDateTime(sub.updated)}
                                      </span>
                                      <div className="flex items-center gap-2 font-mono">
                                        <span>Score: <strong className="text-slate-800 font-sans">{sub.score}</strong></span>
                                        <span suppressHydrationWarning>Due: {formatDate(sub.due)}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-1">
                                      <RowActionsDropdown
                                        sub={sub}
                                        canAdvance={canAdvance}
                                        activeRole={activeRole}
                                        advanceSubmission={advanceSubmission}
                                        triggerAssignReviewer={triggerAssignReviewer}
                                        triggerUploadRevision={
                                          triggerUploadRevisionModal
                                        }
                                        triggerSubmitReview={triggerSubmitReview}
                                        triggerViewInfo={triggerViewInfo}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Manuscript Detail Drawer using CustomDrawer */}
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
                    {formatDateTime((selectedSubmission as any).submittedDate || selectedSubmission.updated)}
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract */}
            {(selectedSubmission.abstractText || (selectedSubmission as any).abstract) && (
              <div className="space-y-2 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Abstract
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 wrap-break-word break-all">
                  {selectedSubmission.abstractText || (selectedSubmission as any).abstract}
                </p>
              </div>
            )}

            {/* Attached Documents (Supabase Storage) */}
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
                          <ExternalLink className="h-3.5 w-3.5" />
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

            {/* Peer Review Feedback & Comments */}
            {selectedSubmission.reviews && selectedSubmission.reviews.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Peer Review Evaluations ({selectedSubmission.reviews.length})
                </h3>
                <div className="space-y-3">
                  {selectedSubmission.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900">
                            {rev.reviewerName || "Reviewer"}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {rev.status}
                          </span>
                        </div>
                        {rev.score !== undefined && rev.score !== null && (
                          <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            Score: {rev.score}/100
                          </span>
                        )}
                      </div>

                      {rev.recommendation && (
                        <p className="text-xs font-semibold text-slate-700">
                          Recommendation: <span className="font-bold text-emerald-700">{rev.recommendation}</span>
                        </p>
                      )}

                      {rev.reviewComments && (
                        <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Reviewer Remarks
                          </p>
                          <p className="whitespace-pre-line leading-relaxed">{rev.reviewComments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CustomDrawer>

      {/* Assign Reviewer Modal */}
      <AssignReviewerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        submission={selectedSubmission}
        onAssign={handleAssignReviewerSubmit}
      />

      {/* Submit Review Modal */}
      <SubmitReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        submission={selectedSubmission}
        onSubmit={handleReviewSubmit}
      />

      {/* Logout Confirmation Modal */}
      <CustomModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Sign Out"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
            <div className="p-2 bg-rose-100 rounded-lg shrink-0 text-rose-600">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-rose-950">End your current session?</p>
              <p className="text-rose-700 leading-relaxed">
                You will be securely signed out from this browser session. You will need your academic email and password to sign back in.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Yes, Sign Out</span>
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Real-time Logout Loading Overlay */}
      {isLoggingOut && (
        <div
          className="fixed inset-0 z-999999 flex items-center justify-center bg-white animate-in fade-in duration-200"
          data-lenis-prevent="true"
        >
          <PremiumLoader text="Signing out & securing session..." fullScreen={false} />
        </div>
      )}
    </div>
  );
}
