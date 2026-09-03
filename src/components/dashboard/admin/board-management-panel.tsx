"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit,
  GraduationCap,
  Building,
  RotateCcw,
  Award,
  Crown,
  ShieldCheck,
  BookOpen,
  UserCheck,
  Search,
  X,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { boardApi, adminApi, filesApi } from "@/lib/api";
import { type BoardMember } from "@/lib/data";
import { CustomModal } from "@/components/ui/modal";
import { CustomDrawer } from "@/components/ui/drawer";
import { CustomSelect } from "@/components/ui/custom-select";
import { AcademicDataLoader } from "@/components/ui/loader";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { KpiStatCard } from "@/components/dashboard/kpi-stat-card";
import { DashboardSearchFilterBar } from "@/components/dashboard/dashboard-search-bar";
import { cn } from "@/lib/utils";

const BOARD_ROLES = [
  "Editor-in-Chief",
  "Associate Editor",
  "Section Editor",
  "Advisory Board Member",
  "Managing Editor",
];

let boardCache: { data: BoardMember[]; timestamp: number } | null = null;

export function BoardManagementPanel() {
  const [members, setMembers] = useState<BoardMember[]>(() => boardCache?.data || []);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [linkedUserId, setLinkedUserId] = useState<string | number | "">("");
  const [loading, setLoading] = useState<boolean>(!boardCache?.data || boardCache.data.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<BoardMember | null>(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("Professor");
  const [affiliation, setAffiliation] = useState("Department of Pharmacy, Gono Bishwabidyalay");
  const [role, setRole] = useState("Associate Editor");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);
      const res = await filesApi.uploadImage(file, "gbjournal/board");
      if (res.url) {
        setAvatarUrl(res.url);
        toast.success("Scholar photo uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const loadMembers = async (force = false) => {
    const hasCache = boardCache?.data && boardCache.data.length > 0;
    if (hasCache && !force) {
      setMembers(boardCache!.data);
      setLoading(false);
      if (Date.now() - boardCache!.timestamp < 60000) {
        return;
      }
      setIsRefreshing(true);
    } else if (!hasCache) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [data, usersData] = await Promise.all([
        boardApi.getAll(),
        adminApi.listUsers().catch(() => []),
      ]);
      if (Array.isArray(data)) {
        setMembers(data);
        boardCache = { data, timestamp: Date.now() };
      }
      if (Array.isArray(usersData)) {
        setSystemUsers(usersData);
      }
    } catch (err: any) {
      if (!hasCache) {
        toast.error("Failed to load editorial board", { description: err.message });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = members.length;
    const chief = members.filter((m) => /chief|managing/i.test(m.role || "")).length;
    const section = members.filter((m) => /section/i.test(m.role || "")).length;
    const advisory = members.filter((m) => /advisory|reviewer|associate/i.test(m.role || "")).length;
    return { total, chief, section, advisory };
  }, [members]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        searchQuery === "" ||
        (m.name && m.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.affiliation && m.affiliation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.designation && m.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.role && m.role.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchRole = true;
      if (roleFilter !== "ALL") {
        if (roleFilter === "CHIEF") {
          matchRole = /chief|managing/i.test(m.role || "");
        } else if (roleFilter === "SECTION") {
          matchRole = /section/i.test(m.role || "");
        } else if (roleFilter === "ADVISORY") {
          matchRole = /advisory|associate/i.test(m.role || "");
        } else {
          matchRole = m.role?.toLowerCase() === roleFilter.toLowerCase();
        }
      }

      return matchSearch && matchRole;
    });
  }, [members, searchQuery, roleFilter]);

  // Options for linking a board member to a registered system user account
  const userOptions = useMemo(() => {
    const opts = [{ value: "", label: "None — External Scholar / Masthead Only" }];
    systemUsers.forEach((u) => {
      opts.push({
        value: String(u.id),
        label: `${u.fullName} (${(u.role || "user").toUpperCase()} • ${u.email})`,
      });
    });
    return opts;
  }, [systemUsers]);

  const handleSelectUser = (selectedId: string) => {
    if (!selectedId) {
      setLinkedUserId("");
      return;
    }
    const u = systemUsers.find((user) => String(user.id) === String(selectedId));
    if (u) {
      setLinkedUserId(u.id);
      setName(u.fullName || "");
      if (u.title) setDesignation(u.title);
      const aff = [u.department, u.institution].filter(Boolean).join(", ");
      if (aff) setAffiliation(aff);
      toast.info(`Auto-populated details from ${u.fullName}'s user profile.`);
    }
  };

  const handleUnlinkUser = () => {
    setLinkedUserId("");
    toast.info("Unlinked from user directory. Record is now an external scholar.");
  };

  const openAddModal = () => {
    setEditingMember(null);
    setLinkedUserId("");
    setName("");
    setDesignation("Professor");
    setAffiliation("Department of Pharmacy, Gono Bishwabidyalay");
    setRole("Associate Editor");
    setBio("");
    setAvatarUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (m: BoardMember) => {
    setEditingMember(m);
    const matchingUser = systemUsers.find(
      (u) => (m.userId && String(u.id) === String(m.userId)) || u.fullName?.toLowerCase() === m.name?.toLowerCase()
    );
    setLinkedUserId(matchingUser ? matchingUser.id : (m.userId || ""));
    setName(m.name || "");
    setDesignation(m.designation || "");
    setAffiliation(m.affiliation || "");
    setRole(m.role || "Associate Editor");
    setBio(m.bio || "");
    setAvatarUrl(m.avatarUrl || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: Partial<BoardMember> = {
        name: name.trim(),
        designation: designation.trim(),
        affiliation: affiliation.trim(),
        role: role.trim(),
        bio: bio.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        userId: linkedUserId || undefined,
      };

      if (editingMember && editingMember.id) {
        await adminApi.updateBoardMember(editingMember.id, payload);
        toast.success("Board member updated successfully");
      } else {
        await adminApi.createBoardMember(payload);
        toast.success("New board member added successfully");
      }

      setIsModalOpen(false);
      loadMembers();
    } catch (err: any) {
      toast.error("Failed to save board member", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteDeleteMember = async () => {
    if (!memberToDelete?.id) return;
    try {
      setIsDeletingMember(true);
      await adminApi.deleteBoardMember(memberToDelete.id);
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      toast.success(`"${memberToDelete.name}" removed from editorial board.`);
      setMemberToDelete(null);
    } catch (err: any) {
      toast.error("Failed to remove member", { description: err.message });
    } finally {
      setIsDeletingMember(false);
    }
  };

  const getRoleBadge = (roleStr?: string) => {
    const r = (roleStr || "").toUpperCase();
    if (r.includes("CHIEF")) {
      return {
        label: roleStr || "Editor-in-Chief",
        icon: Crown,
        bg: "bg-amber-50 text-amber-900 border-amber-200/90",
        badge: "Chief Executive",
      };
    }
    if (r.includes("MANAGING")) {
      return {
        label: roleStr || "Managing Editor",
        icon: ShieldCheck,
        bg: "bg-emerald-50 text-emerald-900 border-emerald-200/90",
        badge: "Managing Board",
      };
    }
    if (r.includes("SECTION")) {
      return {
        label: roleStr || "Section Editor",
        icon: BookOpen,
        bg: "bg-indigo-50 text-indigo-900 border-indigo-200/90",
        badge: "Specialized Section",
      };
    }
    return {
      label: roleStr || "Associate Editor",
      icon: Award,
      bg: "bg-blue-50 text-blue-900 border-blue-200/90",
      badge: "Advisory Council",
    };
  };

  // Extract initials helper
  const getInitials = (fullName: string) => {
    const clean = fullName.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/gi, "").trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0]?.[0] || "E").toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <DashboardHeaderActions>
        <button
          onClick={() => loadMembers(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
          title="Refresh editorial board"
        >
          <RotateCcw className={cn("h-3.5 w-3.5 text-slate-500", isRefreshing && "animate-spin text-blue-600")} />
          <span>Sync</span>
        </button>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Board Member</span>
        </button>
      </DashboardHeaderActions>

      {/* Editorial Board Governance Clarification Banner */}
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-white p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Crown className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900">
              Public Journal Masthead &amp; Academic Governance
            </h4>
            <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed">
              This panel manages the official editorial board showcased on the public journal website and published issues. Board members can be <strong>linked to registered accounts</strong> in the User Directory or listed as <strong>external honorary scholars</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiStatCard
          label="Total Board"
          value={stats.total}
          icon={Users}
          accent="blue"
        />
        <KpiStatCard
          label="Chief & Managing"
          value={stats.chief}
          icon={Crown}
          accent="amber"
        />
        <KpiStatCard
          label="Section Editors"
          value={stats.section}
          icon={BookOpen}
          accent="indigo"
        />
        <KpiStatCard
          label="Advisory & Associate"
          value={stats.advisory}
          icon={Award}
          accent="emerald"
        />
      </div>

      {/* Search & Filter Bar */}
      <DashboardSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by scholar name, department, institution, or role..."
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Roles" },
            { id: "CHIEF", label: "Chief & Managing" },
            { id: "SECTION", label: "Section Editors" },
            { id: "ADVISORY", label: "Advisory Council" },
          ].map((r) => (
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
      </DashboardSearchFilterBar>

      {/* Board Members Grid */}
      {loading ? (
        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white shadow-xs">
          <AcademicDataLoader
            title="Loading Editorial Board"
            subtitle="Fetching listed scholars, professors, and section editors..."
          />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-12 text-center shadow-sm">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Editorial Board Members Match</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or role filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const roleBadge = getRoleBadge(member.role);
            const RoleIcon = roleBadge.icon;
            const initials = getInitials(member.name || "Scholar");
            const linkedUser = systemUsers.find(
              (u) => (member.userId && String(u.id) === String(member.userId)) || u.fullName?.toLowerCase() === member.name?.toLowerCase()
            );
            const isLinked = Boolean(linkedUser);

            return (
              <div
                key={member.id}
                className="group relative rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Top Role Header */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border", roleBadge.bg)}>
                      <RoleIcon className="h-3 w-3 shrink-0" />
                      {roleBadge.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isLinked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80" title={`Linked to registered user account (${linkedUser?.email})`}>
                          <CheckCircle2 className="h-2.5 w-2.5 text-blue-600" />
                          Platform User
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/80" title="External honorary scholar without system login account">
                          <Globe className="h-2.5 w-2.5 text-slate-400" />
                          External
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Public
                      </span>
                    </div>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#0f172a] text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-xs border-2 border-white">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="tracking-wider">{initials}</span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-900 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-[color:var(--color-gb-blue)] mt-0.5">
                        {member.designation || "Distinguished Academic Member"}
                      </p>
                    </div>
                  </div>

                  {/* Affiliation Box */}
                  <div className="mt-3.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/90 text-xs text-slate-600 flex items-start gap-2">
                    <Building className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed text-[11.5px]">
                      {member.affiliation || "Gono Bishwabidyalay Academic & Research Council"}
                    </span>
                  </div>

                  {/* Bio / Specialization snippet */}
                  {member.bio && (
                    <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-2 leading-relaxed italic border-l-2 border-slate-200 pl-2.5">
                      &quot;{member.bio}&quot;
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID #{member.id}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(member)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      title="Edit Scholar Profile"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => setMemberToDelete(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Drawer */}
      <CustomDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Editorial Board Member" : "Add Editorial Board Member"}
        description="Configure academic appointments displayed on the journal editorial board."
        icon={Crown}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="board-member-form"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[color:var(--color-gb-blue)] text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingMember ? "Update Member" : "Add Member"}</span>
            </button>
          </div>
        }
      >
        <form id="board-member-form" onSubmit={handleSave} className="space-y-4 text-xs">
          {/* User Account Linkage Section */}
          <div className="rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-sky-50/30 to-white p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                <span>Link to User Directory (Optional)</span>
              </label>
              {linkedUserId && (
                <button
                  type="button"
                  onClick={handleUnlinkUser}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Unlink Account
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Select an existing platform user to auto-populate their academic credentials, or choose &quot;None&quot; for external honorary scholars.
            </p>
            <CustomSelect
              size="form"
              options={userOptions}
              value={linkedUserId ? String(linkedUserId) : ""}
              onChange={handleSelectUser}
              placeholder="Select from registered user directory..."
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Scholar Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prof. Dr. Laila Rahman"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Designation</label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Professor & Dean"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Board Role *</label>
              <CustomSelect
                size="form"
                options={BOARD_ROLES}
                value={role}
                onChange={setRole}
                placeholder="Select Role"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academic Affiliation / Department</label>
            <input
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="e.g. Department of Pharmacy, Gono Bishwabidyalay"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          {/* Scholar Avatar Upload */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Scholar Photograph</label>
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="relative shrink-0">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white flex items-center justify-center font-bold text-base overflow-hidden shadow-xs border-2 border-white">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span>{name ? name.slice(0, 2).toUpperCase() : "GB"}</span>
                  )}
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-slate-950/60 rounded-xl flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-300 shadow-2xs transition-all cursor-pointer">
                    <UploadCloud className="h-3.5 w-3.5 text-blue-600" />
                    <span>{avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleAvatarFileUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG, or WebP up to 5MB. Hosted securely on Cloudinary.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academic Bio / Research Specialization</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief biography or research background..."
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100 transition-all overflow-y-auto overscroll-contain resize-y font-sans"
            />
          </div>
        </form>
      </CustomDrawer>

      {/* Delete Member Confirmation Modal */}
      <CustomModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        title="Remove Editorial Board Member?"
        className="max-w-md"
      >
        {memberToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
              <Trash2 className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-950 mb-0.5">
                  Are you sure you want to remove &quot;{memberToDelete.name}&quot;?
                </p>
                <p className="text-xs text-rose-800 leading-relaxed">
                  This member will be unlinked from the public editorial board directory.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteMember}
                disabled={isDeletingMember}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeletingMember ? "Removing..." : "Delete Member"}
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
