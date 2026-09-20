"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  CreditCard,
  Edit2,
  Landmark,
  Mail,
  Plus,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";

export interface AuthorItem {
  id: string;
  name: string;
  email: string;
  institution: string;
  orcid?: string;
  isCorresponding: boolean;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  branchName?: string;
  routingNumber?: string;
}

interface StepAuthorsListProps {
  authors: AuthorItem[];
  setAuthors: React.Dispatch<React.SetStateAction<AuthorItem[]>>;
}

const emptyAuthorState = {
  name: "",
  email: "",
  institution: "",
  orcid: "",
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
  branchName: "",
  routingNumber: "",
};

export function StepAuthorsList({ authors, setAuthors }: StepAuthorsListProps) {
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyAuthorState);

  const openAddForm = () => {
    setEditingAuthorId(null);
    setFormData(emptyAuthorState);
    setShowAuthorForm(true);
  };

  const openEditForm = (author: AuthorItem) => {
    setEditingAuthorId(author.id);
    setFormData({
      name: author.name || "",
      email: author.email || "",
      institution: author.institution || "",
      orcid: author.orcid || "",
      bankName: author.bankName || "",
      accountNumber: author.accountNumber || "",
      accountHolderName: author.accountHolderName || "",
      branchName: author.branchName || "",
      routingNumber: author.routingNumber || "",
    });
    setShowAuthorForm(true);
  };

  const cancelForm = () => {
    setShowAuthorForm(false);
    setEditingAuthorId(null);
    setFormData(emptyAuthorState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingAuthorId) {
      // Update existing author
      setAuthors(
        authors.map((a) =>
          a.id === editingAuthorId
            ? {
              ...a,
              name: formData.name.trim(),
              email: formData.email.trim(),
              institution: formData.institution.trim() || "Gono Bishwabidyalay",
              orcid: formData.orcid.trim() || undefined,
              bankName: formData.bankName.trim() || undefined,
              accountNumber: formData.accountNumber.trim() || undefined,
              accountHolderName: formData.accountHolderName.trim() || undefined,
              branchName: formData.branchName.trim() || undefined,
              routingNumber: formData.routingNumber.trim() || undefined,
            }
            : a
        )
      );
    } else {
      // Add new author
      const newAuthorObj: AuthorItem = {
        id: `auth-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        institution: formData.institution.trim() || "Gono Bishwabidyalay",
        orcid: formData.orcid.trim() || undefined,
        isCorresponding: authors.length === 0,
        bankName: formData.bankName.trim() || undefined,
        accountNumber: formData.accountNumber.trim() || undefined,
        accountHolderName: formData.accountHolderName.trim() || undefined,
        branchName: formData.branchName.trim() || undefined,
        routingNumber: formData.routingNumber.trim() || undefined,
      };
      setAuthors([...authors, newAuthorObj]);
    }

    cancelForm();
  };

  const removeAuthor = (id: string) => {
    setAuthors(authors.filter((a) => a.id !== id));
    if (editingAuthorId === id) cancelForm();
  };

  const toggleCorresponding = (id: string) => {
    setAuthors(
      authors.map((a) => ({
        ...a,
        isCorresponding: a.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Authors, Affiliations & Honorarium Accounts
          </h3>
          <p className="text-xs text-slate-500">
            List all contributing authors in citation order. Provide academic email and optional bank details for publication honorarium disbursement.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-colors cursor-pointer shrink-0"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Co-Author
        </button>
      </div>

      {/* Authors list */}
      <div className="space-y-3">
        {authors.map((auth, idx) => {
          const hasBank = Boolean(auth.bankName || auth.accountNumber);

          return (
            <div
              key={auth.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-600 mt-0.5">
                  0{idx + 1}
                </span>
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{auth.name}</h4>
                    {auth.isCorresponding && (
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 border border-blue-200">
                        Corresponding
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {auth.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {auth.institution}
                    </span>
                    {auth.orcid && (
                      <span className="font-mono text-[10.5px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        ORCID: {auth.orcid}
                      </span>
                    )}
                  </div>

                  {/* Bank info display badge */}
                  <div className="pt-1">
                    {hasBank ? (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] text-slate-700 font-medium">
                        <Landmark className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>
                          <strong className="text-slate-900">{auth.bankName || "Bank"}:</strong>{" "}
                          Acc #{auth.accountNumber ? `${auth.accountNumber.slice(-4).padStart(auth.accountNumber.length, "•")}` : "Provided"}
                        </span>
                        {auth.branchName && (
                          <span className="text-slate-400 border-l border-slate-200 pl-2">
                            {auth.branchName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openEditForm(auth)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        <CreditCard className="h-3 w-3" />
                        + Add Bank / Honorarium Info
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <button
                  type="button"
                  onClick={() => openEditForm(auth)}
                  title="Edit author and bank details"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>

                {!auth.isCorresponding && (
                  <button
                    type="button"
                    onClick={() => toggleCorresponding(auth.id)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Make Corresponding
                  </button>
                )}

                {authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(auth.id)}
                    title="Remove author"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Author Form Dialog */}
      {showAuthorForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-5 sm:p-6 space-y-5 shadow-sm animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-700" />
              {editingAuthorId ? "Edit Author & Bank Information" : "Add New Co-Author"}
            </h4>
            <button
              type="button"
              onClick={cancelForm}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Section 1: Academic Profile */}
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 mb-2.5">
              1. Author Academic Profile
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Md. Farhana Rahman"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Academic Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. farhana@gonobishwabidyalay.edu.bd"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Institution & Department
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Faculty of Health Sciences, Gono Bishwabidyalay"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ORCID iD (Optional)
                </label>
                <input
                  type="text"
                  value={formData.orcid}
                  onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                  placeholder="0000-0002-1823-4591"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono text-slate-900 outline-none focus:border-blue-600 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bank & Honorarium Account Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-blue-700" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">
                  Bank Account / Honorarium Disbursement Details
                </h5>
                <p className="text-[11px] text-slate-500">
                  Used by university finance to disburse research grants, publication honorariums, and awards.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. Dutch-Bangla Bank, Sonali Bank, BRAC Bank"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  placeholder="e.g. Dr. Md. Farhana Rahman"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Account Number / IBAN
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="e.g. 115.120.98421 or IBAN / MFS No."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono font-semibold text-slate-900 outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Branch Name & Routing Number / Mobile Banking
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  placeholder="e.g. Savar Branch (Routing: 090261) or bKash Personal"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-4 py-2 text-xs font-extrabold text-white hover:bg-gb-blue-dark transition-colors cursor-pointer shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              {editingAuthorId ? "Update Author Details" : "Save Author"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

