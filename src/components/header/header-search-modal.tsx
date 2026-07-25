"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ArrowUpRight, FileText, Search, X } from "lucide-react";
import { articles } from "@/lib/data";

interface HeaderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderSearchModal({ isOpen, onClose }: HeaderSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim() && selectedCategory === "All") return [];
    return articles.filter((art) => {
      const matchesCat =
        selectedCategory === "All" ||
        art.topic.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesText =
        art.title.toLowerCase().includes(q) ||
        art.authors.some((a) => a.toLowerCase().includes(q)) ||
        art.topic.toLowerCase().includes(q) ||
        art.doi.toLowerCase().includes(q) ||
        art.type.toLowerCase().includes(q);
      return matchesCat && matchesText;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/60 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top search input header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manuscripts, authors, topics, or DOI..."
            className="w-full text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500">
            ESC
          </span>
        </div>

        {/* Filter category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 px-4 py-2.5 scrollbar-none">
          {["All", "Public Health", "Pharmacy", "Agriculture", "Technology"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[color:var(--color-gb-blue)] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Search Body Content */}
        <div className="max-h-[380px] overflow-y-auto p-4 space-y-2">
          {!searchQuery.trim() && selectedCategory === "All" ? (
            <div className="py-2 space-y-4">
              <div>
                <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Community Healthcare",
                    "Antimicrobial Stewardship",
                    "Climate-Resilient Agriculture",
                    "AI-Assisted Learning",
                    "Public Health Savar",
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Search className="h-3 w-3 text-slate-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Indexed Manuscripts
                </p>
                <div className="space-y-1.5">
                  {articles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/articles/${art.slug}`}
                      onClick={onClose}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700 border border-blue-200/50">
                            {art.topic}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {art.publishedAt}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="mt-0.5 text-[10px] text-slate-500 truncate">
                          By {art.authors.join(", ")}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">
                No matching manuscripts found
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try adjusting keywords or selecting &quot;All&quot; category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Found {filteredArticles.length} Result
                {filteredArticles.length > 1 ? "s" : ""}
              </p>
              {filteredArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/articles/${art.slug}`}
                  onClick={onClose}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/40 transition-colors group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700 border border-blue-200/50">
                        {art.topic}
                      </span>
                      <span className="font-mono text-[9.5px] font-semibold text-slate-400">
                        {art.doi}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-1">
                      {art.title}
                    </h4>
                    <p className="mt-0.5 text-[10px] text-slate-500 truncate">
                      By {art.authors.join(", ")}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 bg-slate-50/70 text-[10px] text-slate-400">
          <span>
            Press{" "}
            <kbd className="rounded border border-slate-200 bg-white px-1 font-mono font-bold text-slate-600">
              ESC
            </kbd>{" "}
            to close
          </span>
          <Link
            href="/articles"
            onClick={onClose}
            className="font-bold text-[color:var(--color-gb-blue)] hover:underline"
          >
            View All Articles &rarr;
          </Link>
        </div>
      </div>
      {/* Background backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>,
    document.body
  );
}
