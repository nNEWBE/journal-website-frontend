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
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
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
  Save,
  Search,
  SearchX,
  Send,
  Settings,
  ShieldCheck,
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
import { cn } from "@/lib/utils";
import {
  submissions as seedSubmissions,
  type Role,
  type Submission,
} from "@/lib/data";
import { getSession, clearSession, deleteCookie, type User } from "@/lib/auth";
import { submissionsApi } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser, setUser, fetchCurrentUser } from "@/redux/features/auth/authSlice";

import { roleNotes, roleAccentMap, statusConfig } from "./workspace/workspace-data";
import { DashboardStatsGrid } from "./workspace/dashboard-stats-grid";
import { ArticleDetailDrawer } from "./workspace/article-detail-drawer";
import { AssignReviewerModal } from "./workspace/assign-reviewer-modal";
import { UserManagementPanel } from "./admin/user-management-panel";
import { MailingCenterPanel } from "./admin/mailing-center-panel";
import { IssueManagementPanel } from "./admin/issue-management-panel";
import { BoardManagementPanel } from "./admin/board-management-panel";

function getStatusConfig(status: string) {
  return statusConfig[status] ?? {
    label: status,
    classes: "bg-slate-50 text-slate-600 border-slate-200",
    icon: FileText,
  };
}

const navItems = [
  { id: "author" as Role, label: "Author Suite", icon: PenLine, href: "/dashboard/author" },
  { id: "reviewer" as Role, label: "Reviewer Suite", icon: UserCheck, href: "/dashboard/reviewer" },
  { id: "editor" as Role, label: "Editor Suite", icon: ClipboardCheck, href: "/dashboard/editor" },
  { id: "admin" as Role, label: "Admin Suite", icon: ShieldCheck, href: "/dashboard/admin" },
  { id: "super-admin" as Role, label: "Super Admin", icon: Crown, href: "/dashboard/super-admin" },
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

  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduxUser) {
      setCurrentUser(reduxUser);
    } else {
      const session = getSession();
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
  }, [reduxUser, dispatch]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    } catch {}
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
    if (pathname.includes("/cms") || pathname.includes("/navigation")) {
      return (currentUser?.role as Role) || "admin";
    }
    if (!mounted) return initialRole;
    return (currentUser?.role as Role) || initialRole;
  }, [pathname, currentUser?.role, initialRole, mounted]);

  const activeView = isAnalyticsPage ? "analytics" : "workspace";

  const [submissions, setSubmissions] = useState<Submission[]>(seedSubmissions);
  const [adminSubView, setAdminSubView] = useState<"pipeline" | "users" | "mailing" | "issues" | "board" | "content" | "navigation">("pipeline");
  const [visitedAdminTabs, setVisitedAdminTabs] = useState<Set<string>>(() => new Set(["pipeline"]));

  useEffect(() => {
    if (adminSubView) {
      setVisitedAdminTabs((prev) => {
        if (prev.has(adminSubView)) return prev;
        const next = new Set(prev);
        next.add(adminSubView);
        return next;
      });
    }
  }, [adminSubView]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Admin tab scroll state & ref
  const adminTabsRef = useRef<HTMLDivElement>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const updateAdminTabsScroll = () => {
    if (!adminTabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = adminTabsRef.current;
    setCanScrollTabsLeft(scrollLeft > 4);
    setCanScrollTabsRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  const scrollAdminTabs = (direction: "left" | "right") => {
    if (!adminTabsRef.current) return;
    const offset = 220;
    adminTabsRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const timer = setTimeout(updateAdminTabsScroll, 100);
    window.addEventListener("resize", updateAdminTabsScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateAdminTabsScroll);
    };
  }, [activeRole, adminSubView]);

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

    // Fetch real submissions from backend API
    async function loadRealData() {
      try {
        const liveSubs = await submissionsApi.getMySubmissions();
        if (liveSubs && Array.isArray(liveSubs) && liveSubs.length > 0) {
          setSubmissions(liveSubs);
        }
      } catch (err) {
        // Fallback to baseline in-memory data if backend is still initializing
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
  }, []);

  const toggleSidebar = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_state", String(nextState));
      localStorage.setItem("gb_sidebar_collapsed", String(nextState));
    }
  };

  const filtered = useMemo(() => {
    let result = submissions;
    if (currentUser) {
      if (activeRole === "author") {
        result = submissions.filter(
          (s) =>
            s.author.toLowerCase() === currentUser.name.toLowerCase() ||
            s.author === "Ayesha Siddique"
        );
      } else if (activeRole === "reviewer") {
        result = submissions.filter(
          (s) =>
            s.reviewers.includes(currentUser.name) ||
            s.reviewers.includes("Dr. Salma Khatun")
        );
      }
    }
    return result.filter((s) =>
      [s.id, s.title, s.status, s.author]
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

  function handleAssignReviewerSubmit(subId: string, reviewerName: string) {
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

  function handleReviewSubmit() {
    const scoreVal = parseInt(reviewScore) || 80;
    const newSubs = submissions.map((s) =>
      s.id === reviewSubId
        ? {
          ...s,
          status: "Reviews Complete",
          score: scoreVal,
          updated: "Just now",
        }
        : s
    );
    updateSubmissionsState(newSubs);
    setIsReviewModalOpen(false);
    toast.success(
      `Review logged for ${reviewSubId}. Recommendation: ${reviewRec}.`
    );
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
    <div className="flex min-h-screen w-full bg-[#f5f7fb]">
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
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-[#070e24] border-r border-white/[0.08] shadow-2xl lg:hidden text-white overflow-hidden"
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
                className="flex-1 min-h-0 sidebar-scroll p-3 space-y-4"
              >
                {/* Core Section */}
                <div>
                  <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5">
                    Core Workspace
                  </p>
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
                                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white border-l-transparent"
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
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white border-l-transparent"
                      )}
                    >
                      <BarChart2 className={cn("h-4 w-4 shrink-0", activeView === "analytics" && !pathname.includes("/profile") ? "text-[#60a5fa]" : "text-slate-400")} />
                      <span className="flex-1 font-medium">Journal Analytics</span>
                      {activeView === "analytics" && !pathname.includes("/profile") && (
                        <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Administration Management Tools */}
                {mounted && (currentUser?.role === "super-admin" || currentUser?.role === "admin" || activeRole === "admin" || activeRole === "super-admin") && (
                  <div>
                    <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 flex items-center justify-between">
                      <span>Management Tools</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">Admin</span>
                    </p>
                    <div className="space-y-1">
                      {[
                        { id: "pipeline", label: "Manuscript Pipeline", icon: ClipboardCheck },
                        { id: "users", label: "User Directory", icon: Users },
                        { id: "mailing", label: "Mailing & Broadcast", icon: Mail },
                        { id: "issues", label: "Issues & Volumes", icon: BookOpen },
                        { id: "board", label: "Editorial Board", icon: Crown },
                        { id: "content", label: "Site & Pages CMS", icon: FileText },
                        { id: "navigation", label: "Menu & Nav Manager", icon: Compass },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isTabActive =
                          (tab.id === "content" && pathname.includes("/cms")) ||
                          (tab.id === "navigation" && pathname.includes("/navigation")) ||
                          (!pathname.includes("/cms") &&
                            !pathname.includes("/navigation") &&
                            !pathname.includes("/profile") &&
                            (activeRole === "admin" || activeRole === "super-admin") &&
                            activeView === "workspace" &&
                            adminSubView === tab.id);

                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setIsMobileSidebarOpen(false);
                              if (tab.id === "content") {
                                router.push("/dashboard/cms");
                              } else if (tab.id === "navigation") {
                                router.push("/dashboard/navigation");
                              } else {
                                setAdminSubView(tab.id as any);
                                if (activeRole !== "admin" && activeRole !== "super-admin") {
                                  router.push(currentUser?.role === "super-admin" ? "/dashboard/super-admin" : "/dashboard/admin");
                                } else if (
                                  activeView !== "workspace" ||
                                  pathname.includes("/profile") ||
                                  pathname.includes("/cms") ||
                                  pathname.includes("/navigation")
                                ) {
                                  router.push(activeRole === "super-admin" ? "/dashboard/super-admin" : "/dashboard/admin");
                                }
                              }
                            }}
                            className={cn(
                              "flex w-full items-center text-left text-xs transition-all duration-150 cursor-pointer h-9 px-3 gap-3 rounded-xl border-l-[3px]",
                              isTabActive
                                ? "bg-blue-600/20 text-white font-bold border-l-blue-400 shadow-xs"
                                : "text-slate-300 hover:bg-white/[0.06] hover:text-white border-l-transparent"
                            )}
                          >
                            <Icon className={cn("h-4 w-4 shrink-0", isTabActive ? "text-[#60a5fa]" : "text-slate-400")} />
                            <span className="truncate flex-1 font-medium">{tab.label}</span>
                            {isTabActive && <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Role Suites */}
                {mounted && (currentUser?.role === "super-admin" || currentUser?.role === "admin") && (
                  <div>
                    <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5">
                      Role Suites
                    </p>
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
                                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border-l-transparent"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="truncate flex-1">{item.label}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Journal Portal Links */}
                <div>
                  <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5">
                    Journal Portal
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="flex w-full items-center rounded-xl text-left text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all h-9 px-3 gap-3"
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate flex-1">Public Homepage</span>
                    </Link>
                    <Link
                      href="/issues"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="flex w-full items-center rounded-xl text-left text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all h-9 px-3 gap-3"
                    >
                      <Archive className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate flex-1">Issues Archive</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Footer with Profile & Sign Out */}
              {mounted && currentUser && (
                <div className="mt-auto border-t border-white/[0.08] p-3 bg-[#050b1d] space-y-2">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                  >
                    <div className="relative shrink-0">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/15"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 font-bold text-xs">
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
        className={cn(
          "hidden lg:flex flex-col transition-[width] duration-300 ease-in-out shrink-0 bg-[#070e24] border-r border-white/[0.07] shadow-[4px_0_40px_rgba(0,0,0,0.35)] sticky top-0 h-screen overflow-hidden z-30",
          mounted && isSidebarCollapsed ? "w-[68px]" : "w-[270px]"
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
            className="mt-3 flex-1 min-h-0 sidebar-scroll space-y-4 px-3"
          >
            {/* Core Section */}
            <div>
              <p
                className={cn(
                  "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200",
                  isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                )}
              >
                Core Workspace
              </p>
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
                                : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
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
                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
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
            </div>

            {/* Administration Management Tools (Desktop) */}
            {mounted && (currentUser?.role === "super-admin" || currentUser?.role === "admin" || activeRole === "admin" || activeRole === "super-admin") && (
              <div>
                <p
                  className={cn(
                    "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200 flex items-center justify-between",
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                  )}
                >
                  <span>Management Tools</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">Admin</span>
                </p>
                <div className="space-y-1">
                  {[
                    { id: "pipeline", label: "Manuscript Pipeline", icon: ClipboardCheck },
                    { id: "users", label: "User Directory", icon: Users },
                    { id: "mailing", label: "Mailing & Broadcast", icon: Mail },
                    { id: "issues", label: "Issues & Volumes", icon: BookOpen },
                    { id: "board", label: "Editorial Board", icon: Crown },
                    { id: "content", label: "Site & Pages CMS", icon: FileText },
                    { id: "navigation", label: "Menu & Nav Manager", icon: Compass },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isTabActive =
                      (tab.id === "content" && pathname.includes("/cms")) ||
                      (tab.id === "navigation" && pathname.includes("/navigation")) ||
                      (!pathname.includes("/cms") &&
                        !pathname.includes("/navigation") &&
                        !pathname.includes("/profile") &&
                        (activeRole === "admin" || activeRole === "super-admin") &&
                        activeView === "workspace" &&
                        adminSubView === tab.id);

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
                            if (tab.id === "content") {
                              router.push("/dashboard/cms");
                            } else if (tab.id === "navigation") {
                              router.push("/dashboard/navigation");
                            } else {
                              setAdminSubView(tab.id as any);
                              if (activeRole !== "admin" && activeRole !== "super-admin") {
                                router.push(currentUser?.role === "super-admin" ? "/dashboard/super-admin" : "/dashboard/admin");
                              } else if (
                                activeView !== "workspace" ||
                                pathname.includes("/profile") ||
                                pathname.includes("/cms") ||
                                pathname.includes("/navigation")
                              ) {
                                router.push(activeRole === "super-admin" ? "/dashboard/super-admin" : "/dashboard/admin");
                              }
                            }
                          }}
                          className={cn(
                            "flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group",
                            isTabActive
                              ? "bg-blue-600/20 text-white font-bold shadow-xs"
                              : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
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
              </div>
            )}

            {/* Role Views Switcher (if admin or super-admin) */}
            {mounted && (currentUser?.role === "super-admin" || currentUser?.role === "admin") && (
              <div>
                <p
                  className={cn(
                    "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200",
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                  )}
                >
                  Role Suites
                </p>
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
                            className="flex items-center text-left text-xs transition-colors duration-150 cursor-pointer h-10 w-full rounded-xl overflow-hidden relative group text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
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
              </div>
            )}

            {/* Public Links */}
            <div>
              <p
                className={cn(
                  "px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 mb-1.5 whitespace-nowrap overflow-hidden transition-all duration-200",
                  isSidebarCollapsed ? "opacity-0 h-0 mb-0 pointer-events-none" : "opacity-100 h-4"
                )}
              >
                Journal Portal
              </p>
              <div className="space-y-1">
                <CustomTooltip
                  content="Public Homepage"
                  disabled={!isSidebarCollapsed}
                  side="right"
                >
                  <Link
                    href="/"
                    className="flex items-center text-left text-xs text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors h-10 w-full rounded-xl overflow-hidden group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                    </div>
                    <div
                      className={cn(
                        "min-w-0 flex-1 pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                        isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                      )}
                    >
                      <span className="truncate text-slate-300 group-hover:text-white">
                        Public Homepage
                      </span>
                    </div>
                  </Link>
                </CustomTooltip>

                <CustomTooltip
                  content="Issues Archive"
                  disabled={!isSidebarCollapsed}
                  side="right"
                >
                  <Link
                    href="/issues"
                    className="flex items-center text-left text-xs text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors h-10 w-full rounded-xl overflow-hidden group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      <Archive className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                    </div>
                    <div
                      className={cn(
                        "min-w-0 flex-1 pr-3 pl-1 whitespace-nowrap overflow-hidden transition-opacity duration-200",
                        isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                      )}
                    >
                      <span className="truncate text-slate-300 group-hover:text-white">
                        Issues Archive
                      </span>
                    </div>
                  </Link>
                </CustomTooltip>
              </div>
            </div>
          </div>

          {/* Footer Controls: User Card Trigger with Profile & Sign Out Popover */}
          <div
            ref={userMenuRef}
            className="mt-auto border-t border-white/[0.08] relative shrink-0 bg-[#050b1d] p-3 transition-colors"
          >
            {/* Popover Menu */}
            <AnimatePresence>
              {isUserMenuOpen && mounted && currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(
                    "absolute z-50 rounded-2xl bg-[#09122c] border border-white/[0.12] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-white backdrop-blur-2xl ring-1 ring-white/10",
                    isSidebarCollapsed
                      ? "left-full bottom-2 ml-3 w-64"
                      : "bottom-full left-2.5 right-2.5 mb-2.5"
                  )}
                >
                  {/* User info header card */}
                  <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-1 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/20"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 font-bold text-xs ring-1 ring-white/15">
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
                      <div className="pt-1.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[9.5px] text-slate-400 truncate">
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
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span>Academic Profile</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                    </Link>

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
            {mounted && currentUser && (
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-150 cursor-pointer border group h-11 w-full overflow-hidden",
                  isUserMenuOpen
                    ? "bg-white/10 border-white/20 shadow-md ring-1 ring-white/10"
                    : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/15"
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
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 font-bold text-xs ring-1 ring-white/15 shadow-inner">
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
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-[color:var(--color-gb-border)] bg-white/95 backdrop-blur-md px-4 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>

            <nav className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-gb-muted)] ml-1.5">
              <Link href="/dashboard" className="font-medium hover:text-[color:var(--color-gb-blue)] transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="h-3 w-3" />
              {pathname.includes("/profile") ? (
                <span className="font-bold text-[color:var(--color-gb-blue)]">
                  Academic Profile
                </span>
              ) : pathname.includes("/submissions/new") ? (
                <span className="font-bold text-[color:var(--color-gb-blue)]">
                  New Submission
                </span>
              ) : pathname.includes("/cms") ? (
                <span className="font-bold text-[color:var(--color-gb-blue)]">
                  Site &amp; Pages CMS
                </span>
              ) : pathname.includes("/navigation") ? (
                <span className="font-bold text-[color:var(--color-gb-blue)]">
                  Menu &amp; Nav Manager
                </span>
              ) : activeView === "analytics" ? (
                <span className="font-bold text-[color:var(--color-gb-blue)]">
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
              className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-gb-border)] bg-white text-[color:var(--color-gb-muted)] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
            {activeRole === "author" && !pathname.includes("/profile") && (
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

        <main className="flex-1">
          {pathname.includes("/submissions/new") ||
          pathname.includes("/profile") ||
          pathname.includes("/cms") ||
          pathname.includes("/navigation") ? (
            children
          ) : (
            <>
              {activeView === "analytics" && (
                <AnalyticsPanel submissions={submissions} user={currentUser} />
              )}

              {activeView === "workspace" && (
                <>
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
                        <div
                          className={cn(
                            "p-2.5 rounded-xl border flex items-center justify-center shadow-sm shrink-0 mt-0.5",
                            roleAccent.badge
                          )}
                        >
                          {activeRole === "author" && <PenLine className="h-5 w-5" />}
                          {activeRole === "reviewer" && (
                            <UserCheck className="h-5 w-5" />
                          )}
                          {activeRole === "editor" && (
                            <ClipboardCheck className="h-5 w-5" />
                          )}
                          {activeRole === "admin" && (
                            <ShieldCheck className="h-5 w-5" />
                          )}
                          {activeRole === "super-admin" && (
                            <Crown className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border leading-none font-sans",
                                roleAccent.badge
                              )}
                            >
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

                  {(activeRole === "admin" || activeRole === "super-admin") && (
                    <div className="relative border-b border-[color:var(--color-gb-border)] bg-slate-50/50">
                      {/* Left scroll arrow */}
                      {canScrollTabsLeft && (
                        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1.5 pr-4 bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent">
                          <button
                            onClick={() => scrollAdminTabs("left")}
                            className="h-6 w-6 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer hover:shadow"
                            title="Scroll left"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Scrollable Tabs without browser scrollbar */}
                      <div
                        ref={adminTabsRef}
                        onScroll={updateAdminTabsScroll}
                        className="flex items-center gap-1.5 px-4 pt-3 overflow-x-auto scrollbar-none scroll-smooth"
                      >
                        <button
                          onClick={() => setAdminSubView("pipeline")}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                            adminSubView === "pipeline"
                              ? "border-[color:var(--color-gb-blue)] text-[color:var(--color-gb-blue)] bg-white rounded-t-lg shadow-xs"
                              : "border-transparent text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          Manuscript Pipeline
                        </button>
                        <button
                          onClick={() => setAdminSubView("users")}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                            adminSubView === "users"
                              ? "border-[color:var(--color-gb-blue)] text-[color:var(--color-gb-blue)] bg-white rounded-t-lg shadow-xs"
                              : "border-transparent text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <UserIcon className="h-3.5 w-3.5" />
                          User Directory
                        </button>
                        <button
                          onClick={() => setAdminSubView("mailing")}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                            adminSubView === "mailing"
                              ? "border-[color:var(--color-gb-blue)] text-[color:var(--color-gb-blue)] bg-white rounded-t-lg shadow-xs"
                              : "border-transparent text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Mailing & Broadcast
                        </button>
                        <button
                          onClick={() => setAdminSubView("issues")}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                            adminSubView === "issues"
                              ? "border-[color:var(--color-gb-blue)] text-[color:var(--color-gb-blue)] bg-white rounded-t-lg shadow-xs"
                              : "border-transparent text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Issues & Volumes
                        </button>
                        <button
                          onClick={() => setAdminSubView("board")}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                            adminSubView === "board"
                              ? "border-[color:var(--color-gb-blue)] text-[color:var(--color-gb-blue)] bg-white rounded-t-lg shadow-xs"
                              : "border-transparent text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <Crown className="h-3.5 w-3.5" />
                          Editorial Board
                        </button>
                      </div>

                      {/* Right scroll arrow */}
                      {canScrollTabsRight && (
                        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1.5 pl-4 bg-gradient-to-l from-slate-100 via-slate-100/90 to-transparent">
                          <button
                            onClick={() => scrollAdminTabs("right")}
                            className="h-6 w-6 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer hover:shadow"
                            title="Scroll right"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {(activeRole === "admin" || activeRole === "super-admin") && (
                    <>
                      {visitedAdminTabs.has("users") && (
                        <div className={cn("p-4", adminSubView === "users" ? "block" : "hidden")}>
                          <UserManagementPanel currentUser={currentUser as any} />
                        </div>
                      )}
                      {visitedAdminTabs.has("mailing") && (
                        <div className={cn("p-4", adminSubView === "mailing" ? "block" : "hidden")}>
                          <MailingCenterPanel />
                        </div>
                      )}
                      {visitedAdminTabs.has("issues") && (
                        <div className={cn("p-4", adminSubView === "issues" ? "block" : "hidden")}>
                          <IssueManagementPanel />
                        </div>
                      )}
                      {visitedAdminTabs.has("board") && (
                        <div className={cn("p-4", adminSubView === "board" ? "block" : "hidden")}>
                          <BoardManagementPanel />
                        </div>
                      )}
                    </>
                  )}

                  <div
                    className={
                      (activeRole === "admin" || activeRole === "super-admin") &&
                      adminSubView !== "pipeline"
                        ? "hidden"
                        : "block"
                    }
                  >
                    <div className="p-4">
                      <DashboardStatsGrid submissions={submissions} />
                    </div>

                    <div className="px-4 pb-6 space-y-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`table-${activeRole}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="h-fit rounded-xl border border-[color:var(--color-gb-border)] bg-white shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-gb-border)] px-4 py-3 rounded-t-xl">
                            <div className="flex items-center gap-2.5">
                              <div className="h-6 w-6 rounded-md bg-[color:var(--color-gb-blue-soft)] flex items-center justify-center">
                                <ClipboardCheck className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                              </div>
                              <div>
                                <h2 className="text-[13px] font-black text-[color:var(--color-gb-ink)]">
                                  Manuscript Pipeline
                                </h2>
                                <p className="text-[10px] text-[color:var(--color-gb-muted)]" suppressHydrationWarning>
                                  {mounted ? `${filtered.length} record${filtered.length !== 1 ? "s" : ""}` : "Manuscripts"} · double-blind peer review
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] px-3 py-1.5 focus-within:border-[color:var(--color-gb-blue)] focus-within:bg-white transition-all">
                                <Search className="h-3.5 w-3.5 text-[color:var(--color-gb-muted)]" />
                                <input
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  placeholder="Search…"
                                  className="w-32 bg-transparent text-[12px] font-medium text-[color:var(--color-gb-ink)] outline-none placeholder:text-[color:var(--color-gb-muted)]"
                                />
                                {searchQuery && (
                                  <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-[color:var(--color-gb-muted)] hover:text-[color:var(--color-gb-ink)] cursor-pointer"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {!mounted ? (
                            <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center" suppressHydrationWarning>
                              <div className="h-5 w-5 rounded-full border-2 border-[color:var(--color-gb-blue)] border-t-transparent animate-spin mb-2" />
                              <span>Synchronizing manuscript pipeline...</span>
                            </div>
                          ) : filtered.length === 0 ? (
                            <div className="py-14 px-6 flex flex-col items-center justify-center text-center">
                              {searchQuery.trim() ? (
                                <div className="flex flex-col items-center max-w-sm">
                                  <div className="relative mb-4 flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/80 border border-slate-200 flex items-center justify-center shadow-inner">
                                      <SearchX className="h-7 w-7 text-[color:var(--color-gb-blue)]" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs text-[10px] font-bold">
                                      0
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-extrabold text-[color:var(--color-gb-ink)] font-academic tracking-tight">
                                    No Manuscripts Found
                                  </h3>
                                  <p className="mt-1.5 text-xs text-[color:var(--color-gb-muted)] leading-relaxed">
                                    No records match <span className="font-semibold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">&quot;{searchQuery}&quot;</span>. Try checking for typos or searching by author name or manuscript ID.
                                  </p>
                                  <button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue-soft)] border border-[color:var(--color-gb-blue)]/20 px-3.5 py-1.5 text-xs font-bold text-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue)] hover:text-white transition-all shadow-xs cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    Clear Search Filter
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center max-w-md">
                                  <div className="relative mb-4 flex items-center justify-center">
                                    <div className="absolute -inset-2 rounded-3xl bg-[color:var(--color-gb-blue)]/5 blur-lg" />
                                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 flex items-center justify-center shadow-[0_8px_24px_rgba(17,27,82,0.06)]">
                                      {activeRole === "author" && <PenLine className="h-7 w-7 text-[color:var(--color-gb-blue)]" />}
                                      {activeRole === "reviewer" && <UserCheck className="h-7 w-7 text-purple-600" />}
                                      {activeRole === "editor" && <ClipboardCheck className="h-7 w-7 text-emerald-600" />}
                                      {(activeRole === "admin" || activeRole === "super-admin") && <Inbox className="h-7 w-7 text-amber-600" />}
                                    </div>
                                  </div>
                                  <h3 className="text-sm font-extrabold text-[color:var(--color-gb-ink)] font-academic tracking-tight">
                                    {activeRole === "author" && "No Manuscripts Submitted Yet"}
                                    {activeRole === "reviewer" && "No Manuscripts Assigned for Review"}
                                    {activeRole === "editor" && "Editorial Pipeline is Clear"}
                                    {(activeRole === "admin" || activeRole === "super-admin") && "No Active Manuscripts in Pipeline"}
                                  </h3>
                                  <p className="mt-1.5 text-xs text-[color:var(--color-gb-muted)] leading-relaxed">
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
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer"
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
                                        <TableCell className="max-w-[280px]">
                                          <span className="font-mono text-[10px] font-black text-[color:var(--color-gb-red)]">
                                            {sub.id}
                                          </span>
                                          <p className="mt-0.5 text-[12px] font-bold text-[color:var(--color-gb-ink)] leading-snug line-clamp-2">
                                            {sub.title}
                                          </p>
                                          <p className="mt-0.5 text-[10px] text-[color:var(--color-gb-muted)]">
                                            {sub.type} · {sub.author}
                                          </p>
                                        </TableCell>
                                        <TableCell>
                                          <StatusPill status={sub.status} />
                                          <p className="mt-1 text-[10px] text-[color:var(--color-gb-muted)] flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" />
                                            {sub.updated}
                                          </p>
                                        </TableCell>
                                        <TableCell>
                                          {sub.reviewers.length ? (
                                            <div className="space-y-0.5">
                                              {sub.reviewers.map((r, i) => (
                                                <p
                                                  key={i}
                                                  className="text-[10px] font-semibold text-[color:var(--color-gb-ink)] whitespace-nowrap"
                                                >
                                                  · {r}
                                                </p>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-[10px] italic text-[color:var(--color-gb-muted)]">
                                              Unassigned
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                                              <div
                                                className={`h-full rounded-full transition-all ${
                                                  sub.score >= 80
                                                    ? "bg-emerald-500"
                                                    : sub.score >= 60
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                                }`}
                                                style={{ width: `${sub.score}%` }}
                                              />
                                            </div>
                                            <span className="text-[11px] font-black text-[color:var(--color-gb-ink)]">
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
                                            <span className="font-mono text-[11px] font-bold text-[color:var(--color-gb-muted)]">
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
                              <div className="md:hidden divide-y divide-[color:var(--color-gb-border)]">
                                {filtered.map((sub) => (
                                  <div key={sub.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <span className="font-mono text-[10px] font-black text-[color:var(--color-gb-red)]">
                                          {sub.id}
                                        </span>
                                        <h4 className="mt-0.5 text-xs font-bold text-[color:var(--color-gb-ink)] leading-snug">
                                          {sub.title}
                                        </h4>
                                        <p className="mt-0.5 text-[10px] text-[color:var(--color-gb-muted)]">
                                          {sub.type} · {sub.author}
                                        </p>
                                      </div>
                                      <StatusPill status={sub.status} />
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-[color:var(--color-gb-muted)] border-t border-slate-100">
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

                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Drawer */}
      <ArticleDetailDrawer
        submission={selectedSubmission}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Assign Modal */}
      <AssignReviewerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        submission={selectedSubmission}
        onAssign={handleAssignReviewerSubmit}
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
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-white animate-in fade-in duration-200"
          data-lenis-prevent="true"
        >
          <PremiumLoader text="Signing out & securing session..." fullScreen={false} />
        </div>
      )}
    </div>
  );
}
