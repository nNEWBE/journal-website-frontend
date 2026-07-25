"use client";

import { useState } from "react";
import { Building2, Mail, Plus, Trash2, UserPlus } from "lucide-react";

export interface AuthorItem {
  id: string;
  name: string;
  email: string;
  institution: string;
  orcid?: string;
  isCorresponding: boolean;
}

interface StepAuthorsListProps {
  authors: AuthorItem[];
  setAuthors: React.Dispatch<React.SetStateAction<AuthorItem[]>>;
}

export function StepAuthorsList({ authors, setAuthors }: StepAuthorsListProps) {
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    institution: "",
    orcid: "",
  });

  const addAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.name || !newAuthor.email) return;
    const authorObj: AuthorItem = {
      id: `auth-${Date.now()}`,
      name: newAuthor.name,
      email: newAuthor.email,
      institution: newAuthor.institution || "Gono Bishwabidyalay",
      orcid: newAuthor.orcid,
      isCorresponding: authors.length === 0,
    };
    setAuthors([...authors, authorObj]);
    setNewAuthor({ name: "", email: "", institution: "", orcid: "" });
    setShowAuthorForm(false);
  };

  const removeAuthor = (id: string) => {
    setAuthors(authors.filter((a) => a.id !== id));
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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Authors & Affiliations
          </h3>
          <p className="text-xs text-slate-500">
            List all contributors in order of authorship. Designate one corresponding author.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAuthorForm(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Co-Author
        </button>
      </div>

      {/* Authors list */}
      <div className="space-y-3">
        {authors.map((auth, idx) => (
          <div
            key={auth.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-600">
                0{idx + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900">
                    {auth.name}
                  </h4>
                  {auth.isCorresponding && (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 border border-blue-200">
                      Corresponding
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {auth.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    {auth.institution}
                  </span>
                  {auth.orcid && (
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ORCID: {auth.orcid}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
              {!auth.isCorresponding && (
                <button
                  type="button"
                  onClick={() => toggleCorresponding(auth.id)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Make Corresponding
                </button>
              )}
              {authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAuthor(auth.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Author Form Dialog */}
      {showAuthorForm && (
        <form
          onSubmit={addAuthor}
          className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4"
        >
          <h4 className="text-xs font-black uppercase tracking-wider text-blue-900">
            Add New Co-Author
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newAuthor.name}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, name: e.target.value })
                }
                placeholder="Dr. Monirul Hossain"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Academic Email *
              </label>
              <input
                type="email"
                required
                value={newAuthor.email}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, email: e.target.value })
                }
                placeholder="monirul@gonobishwabidyalay.edu.bd"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Institution & Department
              </label>
              <input
                type="text"
                value={newAuthor.institution}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, institution: e.target.value })
                }
                placeholder="Faculty of Health Sciences, Gono Bishwabidyalay"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                ORCID iD (Optional)
              </label>
              <input
                type="text"
                value={newAuthor.orcid}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, orcid: e.target.value })
                }
                placeholder="0000-0002-1823-4591"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono text-slate-900 outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAuthorForm(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-extrabold text-white hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Save Author
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
