"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  Bell,
  CalendarClock,
  CheckCircle2,
  Crown,
  FileCheck2,
  Filter,
  Layers,
  Mail,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UserCheck,
  LogOut,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { GbJournalLogo } from "@/components/gb-logo";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { CustomModal } from "@/components/ui/modal";
import {
  dashboardStats,
  roles,
  submissions as seedSubmissions,
  type Role,
  type Submission,
} from "@/lib/data";
import { getSession, clearSession, type User } from "@/lib/auth";

const roleNotes: Record<Role, string> = {
  author: "Submit new manuscripts, track peer review milestones, upload revisions, and message editors.",
  reviewer: "Accept invitations to review, inspect blind manuscripts, submit feedback, and view certificates.",
  editor: "Triage incoming submissions, run plagiarism checks, assign peer reviewers, and prepare decision letters.",
  admin: "Manage article type policies, build active issues, feature articles, and view journal metrics.",
  "super-admin": "Oversee system logs, audit academic integrity, configure office credentials, and reset database states.",
};

export function DashboardWorkspace() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role>("author");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [decisionLog, setDecisionLog] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgText, setMsgText] = useState("");

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubId, setReviewSubId] = useState("");
  const [reviewScore, setReviewScore] = useState("85");
  const [reviewRec, setReviewRec] = useState("Accept");

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Load auth session and stateful submissions
  useEffect(() => {
    // Auth Check
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      setActiveRole(session.role);
    }

    // Submissions state initialization
    const localSubs = localStorage.getItem("gb_journal_submissions");
    if (localSubs) {
      setSubmissions(JSON.parse(localSubs));
    } else {
      localStorage.setItem("gb_journal_submissions", JSON.stringify(seedSubmissions));
      setSubmissions(seedSubmissions);
    }

    // Activity Log initialization
    const localLogs = localStorage.getItem("gb_journal_decision_log");
    if (localLogs) {
      setDecisionLog(JSON.parse(localLogs));
    } else {
      const initialLogs = [
        "GBJ-2026-101 scheduled for Volume 4, Issue 2",
        "Reviewer certificate batch generated for Dr. Salma Khatun",
      ];
      localStorage.setItem("gb_journal_decision_log", JSON.stringify(initialLogs));
      setDecisionLog(initialLogs);
    }
  }, []);

  // Filter submissions by query and active role constraints
  const filtered = useMemo(() => {
    let result = submissions;
    
    // Role locking filter
    if (currentUser) {
      if (activeRole === "author") {
        result = submissions.filter(
          (sub) => sub.author.toLowerCase() === currentUser.name.toLowerCase() || sub.author === "Ayesha Siddique"
        );
      } else if (activeRole === "reviewer") {
        result = submissions.filter(
          (sub) => sub.reviewers.includes(currentUser.name) || sub.reviewers.includes("Dr. Salma Khatun")
        );
      }
    }

    // Search query filter
    return result.filter((submission) =>
      [submission.id, submission.title, submission.status, submission.author]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [submissions, currentUser, activeRole, searchQuery]);

  // Save submissions & add to activity logs
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
    toast.success("Successfully logged out of session.");
    window.location.href = "/";
  }

  function advanceSubmission(id: string) {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;

    let nextStatus = sub.status;
    switch (sub.status) {
      case "Awaiting Editor":
        nextStatus = "Under Review";
        break;
      case "Under Review":
        nextStatus = "Reviews Complete";
        break;
      case "Reviews Complete":
        nextStatus = "Accepted";
        break;
      case "Accepted":
        nextStatus = "Published";
        break;
      case "Revision Requested":
        nextStatus = "Revised Manuscript Submitted";
        break;
      case "Revised Manuscript Submitted":
        nextStatus = "Under Review";
        break;
      default:
        nextStatus = "Under Review";
    }

    const newSubs = submissions.map((s) =>
      s.id === id ? { ...s, status: nextStatus, updated: "Just now" } : s
    );

    updateSubmissionsState(
      newSubs,
      `[${id}] Status advanced to "${nextStatus}" by Editor ${currentUser?.name || "System"}`
    );
    toast.success(`Manuscript status advanced to "${nextStatus}".`);
  }

  function assignReviewer(id: string) {
    const newSubs = submissions.map((sub) => {
      if (sub.id === id) {
        const reviewers = Array.from(new Set([...sub.reviewers, "Dr. Salma Khatun"]));
        return {
          ...sub,
          reviewers,
          status: "Under Review",
          updated: "Just now",
        };
      }
      return sub;
    });

    updateSubmissionsState(
      newSubs,
      `[${id}] Reviewer "Dr. Salma Khatun" assigned by Editor`
    );
    toast.success("Reviewer successfully assigned.");
  }

  function updateDueDate(id: string, newDate: string) {
    const newSubs = submissions.map((s) =>
      s.id === id ? { ...s, due: newDate, updated: "Just now" } : s
    );
    updateSubmissionsState(
      newSubs,
      `[${id}] Due date updated to ${newDate} by Editor`
    );
    toast.success(`Due date successfully updated to ${newDate}.`);
  }

  // Author Actions
  function handleSendMessageSubmit() {
    if (!msgText.trim()) return;
    const logMessage = `[Author Message] Ayesha Siddique: "${msgText}"`;
    const updatedLogs = [logMessage, ...decisionLog];
    setDecisionLog(updatedLogs);
    localStorage.setItem("gb_journal_decision_log", JSON.stringify(updatedLogs));
    
    setIsMsgModalOpen(false);
    setMsgText("");
    toast.success("Confidential message successfully dispatched to editor.");
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
    updateSubmissionsState(
      newSubs,
      `[${target.id}] Revision uploaded by Author Ayesha Siddique`
    );
    toast.success(`Revision files successfully uploaded for ${target.id}.`);
  }

  // Reviewer Actions
  function handleAcceptInvitation() {
    const target = submissions.find((s) => s.status === "Under Review" && !s.reviewers.includes("Accepted"));
    if (!target) {
      toast.info("No review invitations currently pending.");
      return;
    }
    const logMessage = `[Reviewer Action] Dr. Salma Khatun accepted invitation for ${target.id}`;
    const updatedLogs = [logMessage, ...decisionLog];
    setDecisionLog(updatedLogs);
    localStorage.setItem("gb_journal_decision_log", JSON.stringify(updatedLogs));
    toast.success(`Review invitation accepted for ${target.id}. Files unlocked.`);
  }

  function triggerSubmitReview(subId: string) {
    setReviewSubId(subId);
    setIsReviewModalOpen(true);
  }

  function handleReviewSubmit() {
    const scoreVal = parseInt(reviewScore) || 80;
    const newSubs = submissions.map((s) =>
      s.id === reviewSubId
        ? { ...s, status: "Reviews Complete", score: scoreVal, updated: "Just now" }
        : s
    );

    updateSubmissionsState(
      newSubs,
      `[${reviewSubId}] Review feedback submitted: ${reviewRec} (Score: ${scoreVal})`
    );
    setIsReviewModalOpen(false);
    toast.success(`Review successfully logged for ${reviewSubId}. Recommendation: ${reviewRec}.`);
  }

  // Admin Actions
  function handleBuildIssue() {
    const acceptedCount = submissions.filter((s) => s.status === "Accepted").length;
    if (acceptedCount === 0) {
      toast.warning("No 'Accepted' manuscripts available to compile.");
      return;
    }

    const newSubs = submissions.map((s) =>
      s.status === "Accepted" ? { ...s, status: "Published", updated: "Just now" } : s
    );

    updateSubmissionsState(
      newSubs,
      `[Issue Builder] Compiled ${acceptedCount} accepted manuscripts into Volume 4, Issue 3`
    );
    toast.success(`Successfully published ${acceptedCount} papers to current issue.`);
  }

  // Super Admin Actions
  function handleResetDatabaseSubmit() {
    localStorage.removeItem("gb_journal_submissions");
    localStorage.removeItem("gb_journal_decision_log");
    setSubmissions(seedSubmissions);
    const initialLogs = [
      "GBJ-2026-101 scheduled for Volume 4, Issue 2",
      "Reviewer certificate batch generated for Dr. Salma Khatun",
    ];
    setDecisionLog(initialLogs);
    localStorage.setItem("gb_journal_submissions", JSON.stringify(seedSubmissions));
    localStorage.setItem("gb_journal_decision_log", JSON.stringify(initialLogs));
    
    setIsResetModalOpen(false);
    toast.success("Database restored to initial seed state.");
  }

  const overrideRoleOptions = roles.map((r) => `${r.label} Workspace`);
  const activeRoleLabel = `${roles.find((r) => r.id === activeRole)?.label} Workspace`;

  function handleOverrideRoleChange(label: string) {
    const matched = roles.find((r) => `${r.label} Workspace` === label);
    if (matched) {
      setActiveRole(matched.id);
      toast.info(`Override view switched to ${matched.label} mode.`);
    }
  }

  return (
    <div className="journal-shell min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        
        {/* Sidebar Workspace Controls */}
        <aside className="border-r border-white/10 bg-[color:var(--green-dark)] p-5 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 [&_p]:text-white">
              <GbJournalLogo compact />
              <div>
                <p className="font-display font-extrabold text-base tracking-tight leading-tight">GB Journal</p>
                <p className="text-[10px] text-white/50 tracking-wider uppercase font-bold mt-0.5">Workspace Portal</p>
              </div>
            </div>

            {/* Logged in User Profile Info */}
            {currentUser && (
              <div className="mt-6 rounded-lg bg-white/8 p-3.5 border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Active Session</p>
                <p className="mt-1 font-bold text-sm text-[color:var(--color-gb-gold)] truncate">{currentUser.name}</p>
                <p className="text-[10px] text-white/70 truncate mt-0.5 font-mono">{currentUser.email}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase bg-[color:var(--bangla-red)] px-1.5 py-0.5 rounded border border-red-400/30">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-white/50 italic font-medium truncate max-w-[120px]">
                    {currentUser.department?.split(" ").slice(-1)[0]}
                  </span>
                </div>
              </div>
            )}

            {/* Sidebar Navigation Locked to User Role */}
            <div className="mt-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-3 px-1">Navigation Menu</p>
              <div className="grid gap-1">
                {roles.map((item) => {
                  const Icon = item.icon;
                  const isRoleActive = activeRole === item.id;
                  const belongsToUser = currentUser?.role === item.id || currentUser?.role === "super-admin";
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveRole(item.id)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-black transition-all ${
                        isRoleActive
                          ? "bg-white text-[color:var(--green-dark)] shadow"
                          : belongsToUser
                            ? "text-white/85 hover:bg-white/8 hover:text-white"
                            : "text-white/30 cursor-not-allowed pointer-events-none"
                      }`}
                      disabled={!belongsToUser}
                      title={belongsToUser ? `View ${item.label} workspace` : `Access restricted to ${item.label}s`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label} Suite</span>
                      </span>
                      {!belongsToUser && (
                        <span className="text-[9px] uppercase font-black text-white/20 bg-black/10 px-1 py-0.5 rounded">
                          Lock
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer Operations */}
          <div className="mt-8 pt-5 border-t border-white/10 space-y-4">
            
            {/* Custom Select Developer Override switcher */}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs leading-normal">
              <p className="flex items-center gap-1.5 font-black text-[color:var(--color-gb-gold)] mb-2">
                <Settings className="h-3.5 w-3.5" />
                Demo Mode Switcher
              </p>
              <p className="text-[10px] text-white/60 mb-2 leading-relaxed">
                Developer override active. View dashboard as:
              </p>
              <CustomSelect
                options={overrideRoleOptions}
                value={activeRoleLabel}
                onChange={handleOverrideRoleChange}
                className="w-full select-dark [&_button]:bg-white/10 [&_button]:text-white [&_button]:border-white/10 [&_button_span]:text-[11px] [&_button_span]:font-bold [&_div]:text-slate-800"
              />
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-black text-red-200 hover:bg-red-950/30 hover:text-red-100 transition-all border border-red-500/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out of Session
            </button>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="p-4 md:p-7 space-y-6">
          
          {/* Active Workspace Banner */}
          <div className="glass-panel rounded-xl p-5 md:p-6 bg-white/90 border border-[color:var(--border)] shadow-md animate-fade">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <span className="badge badge-red uppercase font-black tracking-wide text-[9px]">
                  Authorized Portal
                </span>
                <h1 className="mt-2 text-3xl font-extrabold text-[color:var(--green-dark)] font-academic tracking-tight">
                  {roles.find((item) => item.id === activeRole)?.label} Workspace
                </h1>
                <p className="mt-2.5 max-w-3xl text-xs leading-relaxed text-[color:var(--ink-muted)]">
                  {roleNotes[activeRole]} 
                  {currentUser?.role !== activeRole && (
                    <span className="text-[color:var(--color-gb-gold-dark)] font-bold ml-1">
                      (Developer Override active: Logged in as {currentUser?.role}).
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toast.info("System notices are currently empty.")}
                  className="btn-secondary text-xs h-10 px-4"
                >
                  <Bell className="h-4 w-4" />
                  Notices
                </button>
                {activeRole === "author" && (
                  <Link
                    href="/dashboard/submissions/new"
                    className="btn-primary text-xs h-10 px-4 shadow"
                  >
                    <Plus className="h-4 w-4" />
                    New Submission
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Analytics Summary Widget */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="surface rounded-lg p-4 bg-white border border-[color:var(--border)] shadow-sm">
                  <Icon className="h-4 w-4 text-[color:var(--university-green)]" />
                  <p className="mt-3 text-2xl font-black text-[color:var(--green-dark)]">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-[color:var(--ink-muted)] uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Main Workspace Split layout */}
          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr] items-start">
            
            {/* Left: Submissions Table Control Center */}
            <div className="surface rounded-lg p-5 bg-white border border-[color:var(--border)] shadow-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center border-b border-[color:var(--border)] pb-4">
                <div>
                  <h2 className="text-lg font-black text-[color:var(--green-dark)] font-academic">
                    Manuscript Control Center
                  </h2>
                  <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                    Double-blind peer review triage, status indicators, and editorial task triggers.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-slate-50 px-3 py-1.5">
                  <Search className="h-4 w-4 text-[color:var(--ink-muted)] animate-pulse" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search manuscripts..."
                    className="bg-transparent text-xs outline-none text-[color:var(--foreground)] w-40 font-medium"
                  />
                </div>
              </div>
              
              <div className="mt-4 overflow-x-auto">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[color:var(--ink-muted)] font-bold">
                    No manuscripts found matching active workspace filters.
                  </div>
                ) : (
                  <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[color:var(--border)] text-[10px] uppercase tracking-wider text-[color:var(--ink-muted)] font-extrabold">
                        <th className="py-3 pr-3">Manuscript</th>
                        <th className="py-3 pr-3">Status</th>
                        <th className="py-3 pr-3">Editor</th>
                        <th className="py-3 pr-3">Reviewers</th>
                        <th className="py-3 pr-3">Due Date</th>
                        <th className="py-3 pr-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-b border-[color:var(--border)] align-top last:border-0 table-row-hover"
                        >
                          <td className="py-3.5 pr-3 max-w-[280px]">
                            <p className="font-mono text-[10px] font-black text-[color:var(--bangla-red)]">
                              {submission.id}
                            </p>
                            <p className="mt-1 font-bold text-slate-800 leading-snug">
                              {submission.title}
                            </p>
                            <p className="mt-1 text-[10px] text-[color:var(--ink-muted)]">
                              {submission.type} &bull; Author: {submission.author}
                            </p>
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className={`badge text-[9px] font-bold ${
                              submission.status === "Accepted" || submission.status === "Published"
                                ? "badge-green"
                                : submission.status === "Revision Requested"
                                  ? "badge-gold"
                                  : "badge-blue"
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="py-3.5 pr-3 text-slate-700 font-semibold">{submission.editor}</td>
                          <td className="py-3.5 pr-3 text-slate-600 font-medium">
                            {submission.reviewers.length ? (
                              <div className="flex flex-col gap-0.5">
                                {submission.reviewers.map((r, i) => (
                                  <span key={i} className="whitespace-nowrap">&bull; {r}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="italic text-slate-400">Not assigned</span>
                            )}
                          </td>
                          <td className="py-3.5 pr-3">
                            {activeRole === "editor" || activeRole === "admin" || activeRole === "super-admin" ? (
                              <CustomDatePicker
                                value={submission.due}
                                onChange={(newDate) => updateDueDate(submission.id, newDate)}
                              />
                            ) : (
                              <span className="font-mono text-[10px] text-slate-500 font-bold px-1 py-1">
                                {submission.due}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pr-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              {/* Editor/Admin exclusive workflow tools */}
                              {(activeRole === "editor" || activeRole === "admin" || activeRole === "super-admin") && (
                                <>
                                  <button
                                    onClick={() => advanceSubmission(submission.id)}
                                    className="btn-secondary h-8 px-2 py-0 text-[10px] gap-1 font-bold border-green-200 hover:bg-green-50 text-[color:var(--university-green)]"
                                    title="Advance Status"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Advance</span>
                                  </button>
                                  <button
                                    onClick={() => assignReviewer(submission.id)}
                                    className="btn-secondary h-8 px-2 py-0 text-[10px] gap-1 font-bold"
                                    title="Assign Peer Reviewer"
                                  >
                                    <UserCheck className="h-3 w-3 text-[color:var(--color-gb-gold-dark)]" />
                                    <span>Assign</span>
                                  </button>
                                </>
                              )}
                              
                              {/* Author specific actions */}
                              {activeRole === "author" && submission.status === "Revision Requested" && (
                                <button
                                  onClick={handleUploadRevision}
                                  className="btn-primary h-8 px-3 text-[10px] gap-1 shadow-none"
                                >
                                  <Plus className="h-3 w-3" />
                                  Upload Revision
                                </button>
                              )}

                              {/* Reviewer specific actions */}
                              {activeRole === "reviewer" && submission.status === "Under Review" && (
                                <button
                                  onClick={() => triggerSubmitReview(submission.id)}
                                  className="btn-primary h-8 px-3 text-[10px] gap-1 shadow-none"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Submit Review
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right Side: Role Operations & Realtime Audit Log */}
            <div className="space-y-6">
              
              {/* Role specific quick action toolbox */}
              <div className="surface rounded-lg p-5 bg-white border border-[color:var(--border)] shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-black text-[color:var(--green-dark)] font-academic border-b border-[color:var(--border)] pb-3">
                  <Activity className="h-4.5 w-4.5 text-[color:var(--bangla-red)]" />
                  Workspace Toolbox
                </h2>
                
                {/* Author Tools */}
                {activeRole === "author" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => toast.info("Autosave draft is synced. Editor open.")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Continue saved draft</span>
                      <Save className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={handleUploadRevision}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Upload revision file</span>
                      <FileCheck2 className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={() => setIsMsgModalOpen(true)}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Send message to editor</span>
                      <MessageSquare className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                  </div>
                )}

                {/* Reviewer Tools */}
                {activeRole === "reviewer" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={handleAcceptInvitation}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Accept review invitation</span>
                      <UserCheck className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={() => {
                        const target = submissions.find((s) => s.status === "Under Review");
                        if (target) {
                          triggerSubmitReview(target.id);
                        } else {
                          toast.error("No manuscripts under review to submit feedback for.");
                        }
                      }}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Submit manuscript review</span>
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={() => toast.success("Reviewer certificate PDF downloaded successfully.")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Download reviewer certificate</span>
                      <FileCheck2 className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                  </div>
                )}

                {/* Editor Tools */}
                {activeRole === "editor" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => toast.success("Plagiarism checks complete. Integrity score: 98% (GBJ-2026-104)")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Crossref Similarity Check</span>
                      <ShieldCheck className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={() => toast.info("Smart reviewer matching system is active.")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Reviewer Finder Service</span>
                      <UserCheck className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={handleBuildIssue}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Issue Builder Console</span>
                      <CalendarClock className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                  </div>
                )}

                {/* Admin Tools */}
                {activeRole === "admin" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => toast.info("Opening homepage builder workspace...")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Homepage Feature CMS</span>
                      <Layers className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={() => toast.info("Opening policies policy manager...")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Editorial Policies config</span>
                      <ShieldCheck className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={handleBuildIssue}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Compile and Publish Issue</span>
                      <CalendarClock className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                  </div>
                )}

                {/* Super Admin Tools */}
                {activeRole === "super-admin" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => toast.info("Displaying credential control system...")}
                      className="w-full flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-slate-50 p-3 hover:bg-[color:var(--green-soft)] transition-colors text-left"
                    >
                      <span className="font-bold text-xs">Edit system role permissions</span>
                      <Settings className="h-4 w-4 text-[color:var(--university-green)]" />
                    </button>
                    <button
                      onClick={() => setIsResetModalOpen(true)}
                      className="w-full flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-amber-950 hover:bg-amber-100/30 transition-colors text-left"
                    >
                      <span className="font-black text-xs">Reset local demo database</span>
                      <RefreshCw className="h-4 w-4 text-amber-700 animate-spin-slow" />
                    </button>
                  </div>
                )}
                
                <div className="mt-4 rounded-lg bg-[color:var(--green-soft)] p-3.5 border border-blue-200/50">
                  <p className="flex items-center gap-1.5 text-xs font-black text-[color:var(--green-dark)]">
                    <Mail className="h-4.5 w-4.5 shrink-0" />
                    Office Notifications
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[color:var(--ink-muted)]">
                    Activity, author responses, and editorial dispatch emails are monitored in this session and stored in browser state.
                  </p>
                </div>
              </div>

              {/* Dynamic audit trails log */}
              <div className="surface rounded-lg p-5 bg-white border border-[color:var(--border)] shadow-sm">
                <h2 className="text-base font-black text-[color:var(--green-dark)] font-academic flex items-center gap-2 border-b border-[color:var(--border)] pb-3">
                  <TrendingUp className="h-4.5 w-4.5 text-[color:var(--color-gb-gold-dark)]" />
                  Realtime Activity Logs
                </h2>
                <div className="mt-4 max-h-[220px] overflow-y-auto pr-1 space-y-2">
                  {decisionLog.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-lg border border-[color:var(--border)] bg-slate-50/70 p-2.5 text-[10px] font-bold text-slate-600 leading-normal"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>

      {/* CUSTOM MODAL: Author Send Message to Editor */}
      <CustomModal
        isOpen={isMsgModalOpen}
        onClose={() => setIsMsgModalOpen(false)}
        title="Send Confidential Message to Section Editor"
      >
        <div className="space-y-4">
          <label className="grid gap-2">
            <span className="text-xs font-bold text-slate-600">Enter your message below:</span>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Dear Editor, I have uploaded the supplemental materials..."
              rows={4}
              className="w-full rounded-lg border border-[color:var(--border)] p-3 text-xs outline-none focus:border-[color:var(--university-green)]"
            />
          </label>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-[color:var(--border)]">
            <button
              onClick={() => setIsMsgModalOpen(false)}
              className="btn-secondary h-9 py-1 px-4 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessageSubmit}
              disabled={!msgText.trim()}
              className="btn-primary h-9 py-1 px-4 text-xs font-bold disabled:opacity-40 disabled:pointer-events-none"
            >
              Send Message
            </button>
          </div>
        </div>
      </CustomModal>

      {/* CUSTOM MODAL: Reviewer Feedback Form */}
      <CustomModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Submit Review Feedback: ${reviewSubId}`}
      >
        <div className="space-y-4">
          <label className="grid gap-2">
            <span className="text-xs font-bold text-slate-600">Manuscript Quality Score (0 to 100)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={reviewScore}
              onChange={(e) => setReviewScore(e.target.value)}
              className="w-full rounded-lg border border-[color:var(--border)] p-2.5 text-xs outline-none focus:border-[color:var(--university-green)] font-mono font-bold"
            />
          </label>
          
          <label className="grid gap-2">
            <span className="text-xs font-bold text-slate-600">Confidential Recommendation</span>
            <CustomSelect
              options={["Accept", "Major Revision", "Reject"]}
              value={reviewRec}
              onChange={(val) => setReviewRec(val)}
              className="w-full"
            />
          </label>
          
          <div className="flex justify-end gap-2.5 pt-3 border-t border-[color:var(--border)]">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="btn-secondary h-9 py-1 px-4 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleReviewSubmit}
              className="btn-primary h-9 py-1 px-4 text-xs font-bold"
            >
              Submit Review Feedback
            </button>
          </div>
        </div>
      </CustomModal>

      {/* CUSTOM MODAL: Super Admin Reset DB Confirmation */}
      <CustomModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Local Database"
      >
        <div className="space-y-4">
          <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed font-semibold">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <span>Are you sure you want to restore the local journal database back to the default seed entries? This clears all newly submitted manuscripts, peer reviews, and editor status history.</span>
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-[color:var(--border)]">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="btn-secondary h-9 py-1 px-4 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleResetDatabaseSubmit}
              className="btn-primary h-9 py-1 px-4 text-xs font-bold bg-amber-600 border-none hover:bg-amber-700 text-white"
            >
              Reset Database
            </button>
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
