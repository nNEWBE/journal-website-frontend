"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit,
  GraduationCap,
  Building,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { boardApi, adminApi } from "@/lib/api";
import { type BoardMember } from "@/lib/data";
import { CustomModal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const BOARD_ROLES = [
  "Editor-in-Chief",
  "Associate Editor",
  "Section Editor",
  "Advisory Board Member",
  "Managing Editor",
];

export function BoardManagementPanel() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("Professor");
  const [affiliation, setAffiliation] = useState("Department of Pharmacy, Gono Bishwabidyalay");
  const [role, setRole] = useState("Associate Editor");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await boardApi.getAll();
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch (err: any) {
      toast.error("Failed to load editorial board", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
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

  const handleDelete = async (id: number | string) => {
    try {
      toast.loading("Removing member...", { id: `del-${id}` });
      await adminApi.deleteBoardMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Board member removed", { id: `del-${id}` });
    } catch (err: any) {
      toast.error("Failed to remove member", { id: `del-${id}`, description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[color:var(--color-gb-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-800 font-sans">
              Academic Governance
            </span>
          </div>
          <h2 className="text-lg font-black text-[color:var(--color-gb-ink)] font-academic tracking-tight mt-1">
            Editorial Board Governance
          </h2>
          <p className="text-xs text-[color:var(--color-gb-muted)]">
            Manage academic appointments, advisory scholars, and section editors displayed on the public portal.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          Add Board Member
        </button>
      </div>

      {/* Board Members Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
          <RotateCcw className="h-6 w-6 animate-spin text-[color:var(--color-gb-blue)] mb-2" />
          Loading editorial board roster...
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-12 text-center shadow-sm">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Editorial Board Members Listed</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click &quot;Add Board Member&quot; to list professors and section editors on the journal portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      member.name?.charAt(0) || "E"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200/80 mb-1">
                      {member.role || "Editorial Board"}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 truncate">{member.name}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{member.designation}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Building className="h-3 w-3 shrink-0 text-slate-400" />
                    <span className="truncate">{member.affiliation}</span>
                  </div>
                  {member.bio && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed italic">
                      &quot;{member.bio}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => member.id && handleDelete(member.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Editorial Board Member" : "Add Editorial Board Member"}
        description="Configure academic appointments displayed on the journal editorial board."
      >
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Scholar Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prof. Dr. Md. Zahid Hossain"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Professor & Dean"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Board Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
              >
                {BOARD_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Affiliation & Institution</label>
            <input
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="e.g. Department of Biochemistry, Gono Bishwabidyalay"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Avatar / Photo URL (Optional)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academic Bio / Research Specialization</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief biography or research background..."
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-gb-blue)] text-white font-bold hover:bg-[color:var(--color-gb-blue-dark)] shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : editingMember ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}
