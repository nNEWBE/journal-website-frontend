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
  Mail,
  Building,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AuthResponseData } from "@/lib/api";
import { CustomModal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type UserItem = AuthResponseData["user"];

const ROLES = [
  { id: "all", label: "All Roles" },
  { id: "author", label: "Authors" },
  { id: "reviewer", label: "Reviewers" },
  { id: "editor", label: "Editors" },
  { id: "admin", label: "Admins" },
  { id: "super-admin", label: "Super Admins" },
];

export function UserManagementPanel({
  currentUser,
}: {
  currentUser?: UserItem | null;
}) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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

  // Fetch users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err: any) {
      toast.error("Failed to load user directory", {
        description: err.message,
      });
    } finally {
      setLoading(false);
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
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
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
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: nextEnabled } as any : u))
      );
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
      loadUsers();
    } catch (err: any) {
      toast.error("Failed to create user", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await adminApi.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[color:var(--color-gb-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 font-sans">
              Administration
            </span>
          </div>
          <h2 className="text-lg font-black text-[color:var(--color-gb-ink)] font-academic tracking-tight mt-1">
            User Directory & Access Control
          </h2>
          <p className="text-xs text-[color:var(--color-gb-muted)]">
            Manage academic scholar credentials, role privileges, and active user accounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          Add / Invite User
        </button>
      </div>

      {/* Role Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Scholars</p>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-sky-200/80 bg-sky-50/50 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Authors</p>
          <p className="text-xl font-black text-sky-950 mt-1">{stats.authors}</p>
        </div>
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Reviewers</p>
          <p className="text-xl font-black text-amber-950 mt-1">{stats.reviewers}</p>
        </div>
        <div className="rounded-xl border border-purple-200/80 bg-purple-50/50 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Editors</p>
          <p className="text-xl font-black text-purple-950 mt-1">{stats.editors}</p>
        </div>
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Admins</p>
          <p className="text-xl font-black text-emerald-950 mt-1">{stats.admins}</p>
        </div>
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                roleFilter === r.id
                  ? "bg-[color:var(--color-gb-blue)] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
            <RotateCcw className="h-6 w-6 animate-spin text-[color:var(--color-gb-blue)] mb-2" />
            Loading academic user directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No users match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or switching role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-gb-border)] bg-[#f9fafc]">
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-500">Scholar</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-500">Affiliation</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-500">Role Privilege</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-gb-border)] text-xs">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id || currentUser?.email === u.email;
                  const isUserActive = (u as any).enabled !== false;
                  return (
                    <tr key={u.id} className="hover:bg-[#f9fafc] transition-colors">
                      <td className="px-4 py-3">
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
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700 truncate max-w-[200px]">{u.department || "Academic Faculty"}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{u.institution || "Gono Bishwabidyalay"}</p>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={u.role || "author"}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={isCurrent && currentUser?.role === "super-admin"}
                          className="text-xs font-bold rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-xs outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="author">Author</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      </td>

                      <td className="px-4 py-3">
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
                      </td>

                      <td className="px-4 py-3 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add / Invite New Academic User"
        description="Register a new scholar or staff member to the journal portal."
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Dr. Ayesha Siddique"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Privilege</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="author">Author</option>
                <option value="reviewer">Reviewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Title</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                placeholder="Department of Pharmacy"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution</label>
              <input
                value={formInst}
                onChange={(e) => setFormInst(e.target.value)}
                placeholder="Gono Bishwabidyalay"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-gb-blue)] text-white font-bold hover:bg-[color:var(--color-gb-blue-dark)] shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </CustomModal>

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
    </div>
  );
}
