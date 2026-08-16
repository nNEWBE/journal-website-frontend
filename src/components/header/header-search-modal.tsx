"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Search,
  Tag,
  X,
} from "lucide-react";
import { articles } from "@/lib/data";

interface HeaderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = [
  "All",
  "Public Health",
  "Pharmacy",
  "Agriculture",
  "Technology",
];

const popularTerms = [
  "Community Healthcare",
  "Antimicrobial Stewardship",
  "Climate-Resilient Agriculture",
  "Public Health Savar",
  "Microbial Resistance",
];

export function HeaderSearchModal({ isOpen, onClose }: HeaderSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll while modal is open & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const isAll = selectedCategory === "All";

    return articles.filter((art) => {
      const matchesCat =
        isAll || art.topic.toLowerCase() === selectedCategory.toLowerCase();
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
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[999999] flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 bg-[#060e22]/75 backdrop-blur-md animate-in fade-in-50 duration-200"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-2xl overflow-hidden border border-slate-700/80 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.5)] animate-in zoom-in-[0.98] duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 sm:px-5 py-3.5 bg-slate-50/50">
          <Search className="h-5 w-5 shrink-0 text-[#1e40af]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manuscripts, authors, topics, or DOI..."
            className="w-full text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 bg-transparent placeholder:font-normal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 border border-slate-200 bg-white text-[10px] font-mono font-bold text-slate-500 shadow-2xs">
            ESC
          </span>
        </div>

        {/* Category tabs toolbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/90 px-4 sm:px-5 py-2.5 bg-slate-100/70 scrollbar-none">
          {categoryOptions.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-[#0b1b3d] text-white border-[#0b1b3d] shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Scrollable Results Area */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Popular searches when query is empty and category is All */}
          {!searchQuery.trim() && selectedCategory === "All" && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2.5">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all cursor-pointer shadow-2xs"
                  >
                    <Search className="h-3 w-3 text-slate-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Result Count or Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {searchQuery.trim() || selectedCategory !== "All"
                ? `Search Results (${filteredArticles.length})`
                : "Indexed Manuscripts"}
            </p>
            {filteredArticles.length > 0 && (
              <span className="text-[10.5px] font-mono text-slate-400">
                Gono Bishwabidyalay Repository
              </span>
            )}
          </div>

          {/* Results List */}
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 bg-slate-50/50 p-6">
              <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-800 font-academic">
                No matching manuscripts found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search terms or selecting the &quot;All&quot; category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-xs font-bold text-[#1e40af] hover:underline cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/articles/${art.slug}`}
                  onClick={onClose}
                  className="flex items-start gap-3.5 sm:gap-4 border border-slate-200/90 border-l-3 border-l-slate-200/90 hover:border-l-[#1e40af] bg-white p-3 sm:p-3.5 hover:bg-slate-50/80 transition-all group cursor-pointer shadow-2xs"
                >
                  {/* Article Thumbnail Image */}
                  <div className="relative aspect-[4/3] w-24 sm:w-28 shrink-0 overflow-hidden bg-slate-950 border border-slate-200 shadow-2xs">
                    <Image
                      src={art.image || "/covers/medical.png"}
                      alt={art.title}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>

                  {/* Content Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-blue-50 text-[#1e40af] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                        {art.topic}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {art.volume} · {art.publishedAt}
                      </span>
                    </div>
                    <h4 className="font-academic text-sm sm:text-[14.5px] font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 font-medium truncate">
                      By {art.authors.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-1 text-slate-400 group-hover:text-[#1e40af] transition-colors">
                    <span className="text-[10.5px] font-semibold hidden sm:inline-block">Read</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Status Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 sm:px-5 py-3 bg-slate-50 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Press{" "}
              <kbd className="border border-slate-300 bg-white px-1.5 py-0.5 font-mono font-bold text-slate-700 text-[10px]">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>
          <Link
            href="/articles"
            onClick={onClose}
            className="inline-flex items-center gap-1 font-bold text-[#1e40af] hover:underline"
          >
            <span>View All Articles</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      {/* Background backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>,
    document.body
  );
}
