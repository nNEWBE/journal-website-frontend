"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Pencil,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  UserCheck,
  PenLine,
  Crown,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AuthResponseData } from "@/lib/api";
import { CustomModal } from "@/components/ui/modal";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { CustomSelect } from "@/components/ui/custom-select";
import { AcademicDataLoader } from "@/components/ui/loader";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-wrapper";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type UserItem = AuthResponseData["user"];

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "author", label: "Authors" },
  { value: "reviewer", label: "Reviewers" },
  { value: "editor", label: "Editors" },
  { value: "admin", label: "Admins" },
  { value: "super-admin", label: "Super Admins" },
];

// Module-level cache for instant tab switching without loading delays
let userCache: { data: UserItem[]; timestamp: number } | null = null;

export function UserManagementPanel({
  currentUser,
}: {
  currentUser?: UserItem | null;
}) {
  const [users, setUsers] = useState<UserItem[]>(() => userCache?.data || []);
  const [loading, setLoading] = useState<boolean>(!userCache?.data || userCache.data.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Action dropdown menu state
  const [actionMenuUserId, setActionMenuUserId] = useState<string | number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [activeUser, setActiveUser] = useState<UserItem | null>(null);

  // Close action dropdown on outside click or scroll
  useEffect(() => {
    const handleClose = () => {
      setActionMenuUserId(null);
      setMenuPosition(null);
      setActiveUser(null);
    };
    window.addEventListener("click", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, []);

  // Edit user modal state
  const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("author");
  const [editTitle, setEditTitle] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editInst, setEditInst] = useState("");
  const [editOrcid, setEditOrcid] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, user: UserItem) => {
    e.stopPropagation();
    if (actionMenuUserId === user.id) {
      setActionMenuUserId(null);
      setMenuPosition(null);
      setActiveUser(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 192;
    const menuHeight = 145;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + 20 && rect.top > menuHeight;

    const left = Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth));
    const top = openUpward
      ? Math.max(8, rect.top - menuHeight - 6)
      : Math.min(window.innerHeight - menuHeight - 8, rect.bottom + 6);

    setMenuPosition({ top, left });
    setActionMenuUserId(user.id);
    setActiveUser(user);
  };

  // Create user modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("author");
  const [formTitle, setFormTitle] = useState("Scholar");
  const [formDept, setFormDept] = useState("Department of Pharmacy");
  const [formInst, setFormInst] = useState("Gono Bishwabidyalay");
  const [formPassword, setFormPassword] = useState("");

  // Delete user modal state
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users with caching and non-blocking background revalidation
  const loadUsers = async (force = false) => {
    const hasCache = userCache?.data && userCache.data.length > 0;
    if (hasCache && !force) {
      setUsers(userCache!.data);
      setLoading(false);
      // Revalidate in background only if cache is older than 60s
      if (Date.now() - userCache!.timestamp < 60000) {
        return;
      }
      setIsRefreshing(true);
    } else if (!hasCache) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await adminApi.listUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        userCache = { data, timestamp: Date.now() };
      }
    } catch (err: any) {
      if (!hasCache) {
        toast.error("Failed to load user directory", {
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !searchQuery.trim() ||
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.institution?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole =
        roleFilter === "all" ||
        u.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Role stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      authors: users.filter((u) => u.role === "author").length,
      reviewers: users.filter((u) => u.role === "reviewer").length,
      editors: users.filter((u) => u.role === "editor").length,
      admins: users.filter((u) => u.role === "admin" || u.role === "super-admin").length,
    };
  }, [users]);

  // Handle role change
  const handleRoleChange = async (userId: number | string, newRole: string) => {
    try {
      toast.loading("Updating role...", { id: `role-${userId}` });
      const updated = await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u));
        userCache = { data: next, timestamp: Date.now() };
        return next;
      });
      toast.success("User role updated successfully", { id: `role-${userId}` });
    } catch (err: any) {
      toast.error("Failed to update role", {
        id: `role-${userId}`,
        description: err.message,
      });
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (userId: number | string, currentEnabled: boolean) => {
    const nextEnabled = !currentEnabled;
    try {
      toast.loading(nextEnabled ? "Enabling account..." : "Disabling account...", {
        id: `status-${userId}`,
      });
      await adminApi.updateUserStatus(userId, nextEnabled);
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === userId ? ({ ...u, enabled: nextEnabled } as any) : u));
        userCache = { data: next, timestamp: Date.now() };
        return next;
      });
      toast.success(`Account ${nextEnabled ? "activated" : "deactivated"}`, {
        id: `status-${userId}`,
      });
    } catch (err: any) {
      toast.error("Failed to change account status", {
        id: `status-${userId}`,
        description: err.message,
      });
    }
  };

  // Handle create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Please fill in required name and email");
      return;
    }

    try {
      setIsSubmitting(true);
      const newUser = await adminApi.createUser({
        fullName: formName.trim(),
        email: formEmail.trim(),
        password: formPassword.trim() || undefined,
        role: formRole,
        title: formTitle,
        department: formDept,
        institution: formInst,
      });

      toast.success("User created successfully", {
        description: `Welcome invitation has been dispatched to ${newUser.email}`,
      });

      setIsAddModalOpen(false);
      // Reset form
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      loadUsers(true);
    } catch (err: any) {
      toast.error("Failed to create user", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal and populate state
  const openEditModal = (u: UserItem) => {
    setUserToEdit(u);
    setEditName(u.fullName || u.name || "");
    setEditRole(u.role || "author");
    setEditTitle(u.title || "");
    setEditDept(u.department || "");
    setEditInst(u.institution || "");
    setEditOrcid((u as any).orcid || "");
    setEditPassword("");
    setEditEnabled((u as any).enabled !== false);
    setActionMenuUserId(null);
  };

  // Handle update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    if (!editName.trim()) {
      toast.error("Please enter a valid scholar name");
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await adminApi.updateUser(userToEdit.id, {
        fullName: editName.trim(),
        role: editRole,
        title: editTitle.trim() || undefined,
        department: editDept.trim() || undefined,
        institution: editInst.trim() || undefined,
        orcid: editOrcid.trim() || undefined,
        password: editPassword.trim() || undefined,
        enabled: editEnabled,
      });

      setUsers((prev) => {
        const next = prev.map((u) => (u.id === userToEdit.id ? { ...u, ...updated } : u));
        userCache = { data: next, timestamp: Date.now() };
        return next;
      });

      toast.success("Scholar profile updated successfully", {
        description: `Changes saved for ${editName.trim()}`,
      });
      setUserToEdit(null);
    } catch (err: any) {
      toast.error("Failed to update profile", {
        description: err.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete user
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await adminApi.deleteUser(userToDelete.id);
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== userToDelete.id);
        userCache = { data: next, timestamp: Date.now() };
        return next;
      });
      toast.success("User account deleted successfully");
      setUserToDelete(null);
    } catch (err: any) {
      toast.error("Failed to delete user", {
        description: err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Cards */}
      <DashboardPageHeader
        icon={Users}
        title="User Directory & Access Control"
        subtitle="Manage academic scholar credentials, role privileges, and active user accounts."
        badge={isRefreshing ? "Syncing directory..." : "Administration"}
        actions={
          <>
            <button
              onClick={() => loadUsers(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Refresh user directory"
            >
              <RotateCcw className={cn("h-3.5 w-3.5 text-slate-500", isRefreshing && "animate-spin text-blue-600")} />
              <span>Sync</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add / Invite User</span>
            </button>
          </>
        }
      />

      {/* Role Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[
          {
            id: "ALL",
            label: "Total Scholars",
            sublabel: "Directory",
            value: stats.total,
            icon: Users,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50/90 border-blue-200/80",
            badgeBg: "bg-blue-50 text-blue-700 border-blue-200/80",
            badge: "All Accounts",
            activeClass: "ring-2 ring-[color:var(--color-gb-blue)] border-transparent bg-gradient-to-b from-blue-50/30 to-white shadow-md",
          },
          {
            id: "author",
            label: "Authors",
            sublabel: "Submitters",
            value: stats.authors,
            icon: PenLine,
            iconColor: "text-sky-600",
            iconBg: "bg-sky-50/90 border-sky-200/80",
            badgeBg: "bg-sky-50 text-sky-700 border-sky-200/80",
            badge: `${stats.total ? Math.round((stats.authors / stats.total) * 100) : 0}% Share`,
            activeClass: "ring-2 ring-sky-500 border-transparent bg-gradient-to-b from-sky-50/30 to-white shadow-md",
          },
          {
            id: "reviewer",
            label: "Reviewers",
            sublabel: "Peer Panel",
            value: stats.reviewers,
            icon: UserCheck,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50/90 border-amber-200/80",
            badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80",
            badge: "Peer Panel",
            activeClass: "ring-2 ring-amber-500 border-transparent bg-gradient-to-b from-amber-50/30 to-white shadow-md",
          },
          {
            id: "editor",
            label: "Editors",
            sublabel: "Decision Desk",
            value: stats.editors,
            icon: Shield,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50/90 border-purple-200/80",
            badgeBg: "bg-purple-50 text-purple-700 border-purple-200/80",
            badge: "Editorial Desk",
            activeClass: "ring-2 ring-purple-500 border-transparent bg-gradient-to-b from-purple-50/30 to-white shadow-md",
          },
          {
            id: "admin",
            label: "Admins",
            sublabel: "Governance",
            value: stats.admins,
            icon: Crown,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-50/90 border-emerald-200/80",
            badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
            badge: "Governance",
            activeClass: "ring-2 ring-emerald-500 border-transparent bg-gradient-to-b from-emerald-50/30 to-white shadow-md",
          },
        ].map((card) => {
          const Icon = card.icon;
          const isSelected = roleFilter === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setRoleFilter(card.id)}
              className={cn(
                "group relative text-left rounded-2xl border bg-white p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden",
                isSelected
                  ? card.activeClass
                  : "border-[color:var(--color-gb-border)] hover:border-slate-300"
              )}
            >
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs", card.iconBg, card.iconColor)}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide", card.badgeBg)}>
                  {card.badge}
                </span>
              </div>

              {/* Middle Row: Large Bold Metric */}
              <div className="my-1.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {card.value}
                </span>
              </div>

              {/* Bottom Row: Role Label & Sublabel */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
                  {card.label}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {card.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[color:var(--color-gb-border)] shadow-xs">
        <div className="flex items-center gap-2 flex-1 rounded-lg border border-[color:var(--color-gb-border)] bg-[#f9fafc] px-3 py-1.5 focus-within:border-[color:var(--color-gb-blue)] focus-within:bg-white transition-all">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department, institution..."
            className="w-full bg-transparent text-xs font-medium text-[color:var(--color-gb-ink)] outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="w-full sm:w-52 shrink-0">
          <CustomSelect
            options={ROLE_OPTIONS}
            value={roleFilter}
            onChange={setRoleFilter}
            size="sm"
            className="w-full text-xs"
            placeholder="Filter by Role"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white shadow-sm">
        {loading ? (
          <AcademicDataLoader
            title="Loading Scholar Directory"
            subtitle="Fetching registered researchers, reviewers, and administrative roles..."
          />
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No users match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or switching role filters.
            </p>
          </div>
        ) : (
          <Table minWidth={700}>
            <TableHeader>
              <TableRow>
                <TableHead>Scholar</TableHead>
                <TableHead>Affiliation</TableHead>
                <TableHead>Role Privilege</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id || currentUser?.email === u.email;
                const isUserActive = (u as any).enabled !== false;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-xs">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.fullName} className="h-full w-full object-cover" />
                          ) : (
                            u.fullName?.charAt(0) || "U"
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[color:var(--color-gb-ink)] truncate flex items-center gap-1.5">
                            {u.fullName}
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">You</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium text-slate-700 truncate max-w-[200px]">{u.department || "Academic Faculty"}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{u.institution || "Gono Bishwabidyalay"}</p>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border",
                          u.role === "super-admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : u.role === "admin"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : u.role === "editor"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : u.role === "reviewer"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                        )}
                      >
                        {u.role ? u.role.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Author"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleStatusToggle(u.id, isUserActive)}
                        disabled={isCurrent}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                          isUserActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        )}
                      >
                        {isUserActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {isUserActive ? "Active" : "Disabled"}
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <button
                        onClick={(e) => handleOpenMenu(e, u)}
                        className={cn(
                          "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
                          actionMenuUserId === u.id && "bg-slate-100 text-slate-700 ring-2 ring-slate-200"
                        )}
                        title="User Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add User Drawer */}
      <CustomDrawer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add / Invite New Academic User"
        description="Register a new scholar or staff member to the journal portal."
        icon={UserPlus}
        size="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Dr. Ayesha Siddique"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academic Email *</label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. ayesha@gonobishwabidyalay.edu.bd"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Privilege</label>
              <CustomSelect
                size="form"
                options={[
                  { value: "author", label: "Author" },
                  { value: "reviewer", label: "Reviewer" },
                  { value: "editor", label: "Editor" },
                  { value: "admin", label: "Admin" },
                  { value: "super-admin", label: "Super Admin" },
                ]}
                value={formRole}
                onChange={setFormRole}
                placeholder="Select Role"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Title</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                placeholder="Department of Pharmacy"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution</label>
              <input
                value={formInst}
                onChange={(e) => setFormInst(e.target.value)}
                placeholder="Gono Bishwabidyalay"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Initial Password (Optional)</label>
            <input
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder="Leave blank to auto-generate temporary password"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[color:var(--color-gb-blue)] text-white font-bold hover:bg-[color:var(--color-gb-blue-dark)] shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </CustomDrawer>

      {/* Edit User Drawer */}
      <CustomDrawer
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        title="Edit Scholar / User Profile"
        description={`Update academic credentials, affiliation, and privilege role for ${userToEdit?.fullName}.`}
        icon={Pencil}
        size="lg"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g. Dr. Ayesha Siddique"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academic Email</label>
            <input
              disabled
              value={userToEdit?.email || ""}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 font-medium cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Email address is permanently bound to this user record.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Privilege</label>
              <CustomSelect
                size="form"
                options={[
                  { value: "author", label: "Author" },
                  { value: "reviewer", label: "Reviewer" },
                  { value: "editor", label: "Editor" },
                  { value: "admin", label: "Admin" },
                  { value: "super-admin", label: "Super Admin" },
                ]}
                value={editRole}
                onChange={setEditRole}
                placeholder="Select Role"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                placeholder="Department of Pharmacy"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution</label>
              <input
                value={editInst}
                onChange={(e) => setEditInst(e.target.value)}
                placeholder="Gono Bishwabidyalay"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ORCID iD</label>
              <input
                value={editOrcid}
                onChange={(e) => setEditOrcid(e.target.value)}
                placeholder="0000-0002-1825-0097"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reset Password (Optional)</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-1">
            <CustomCheckbox
              id="editEnabled"
              checked={editEnabled}
              onChange={setEditEnabled}
              label="Account Active & Enabled"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setUserToEdit(null)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-lg bg-[color:var(--color-gb-blue)] text-white font-bold hover:bg-[color:var(--color-gb-blue-dark)] shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </CustomDrawer>

      {/* Delete Confirmation Modal */}
      <CustomModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Confirm Account Deletion"
        description={`Are you sure you want to permanently delete the account of ${userToDelete?.fullName}?`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
            <p>
              This action cannot be undone. All active roles and association data for <strong>{userToDelete?.email}</strong> will be removed.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setUserToDelete(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-sm disabled:opacity-50 cursor-pointer text-xs"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </CustomModal>
      {/* Floating Action Menu (Rendered Outside Table) */}
      {actionMenuUserId && activeUser && menuPosition && (
        <div
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          onClick={(e) => e.stopPropagation()}
          className="fixed w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
        >
          {/* Edit User */}
          <button
            onClick={() => {
              openEditModal(activeUser);
              setActionMenuUserId(null);
              setMenuPosition(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span>Edit Profile</span>
          </button>

          {/* Toggle Status */}
          <button
            onClick={() => {
              const isUserActive = (activeUser as any).enabled !== false;
              setActionMenuUserId(null);
              setMenuPosition(null);
              handleStatusToggle(activeUser.id, isUserActive);
            }}
            disabled={currentUser?.id === activeUser.id || currentUser?.email === activeUser.email}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(activeUser as any).enabled !== false ? (
              <>
                <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Deactivate Account</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Activate Account</span>
              </>
            )}
          </button>

          {/* Delete User */}
          {currentUser?.id !== activeUser.id && currentUser?.email !== activeUser.email && (
            <>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setActionMenuUserId(null);
                  setMenuPosition(null);
                  setUserToDelete(activeUser);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <Trash2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Delete User</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
