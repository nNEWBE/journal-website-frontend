"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, RotateCcw, X } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

/** The default order of the archive (no `sort` param in the URL). */
export const DEFAULT_ARTICLE_SORT = "newest";

interface ArticlesFilterFormProps {
  initialQ: string;
  initialType: string;
  initialTopic: string;
  /** Current `sort` URL value ("" = default order). */
  initialSort?: string;
  articleTypes: string[];
  topics: string[];
  /** CMS-editable copy; the "All Types"/"All Topics" sentinels stay in code (used by filter logic). */
  labels?: {
    searchPlaceholder?: string;
    searchButton?: string;
    resetButton?: string;
    sortOptions?: { value: string; label: string }[];
  };
}

export function ArticlesFilterForm({
  initialQ,
  initialType,
  initialTopic,
  initialSort = "",
  articleTypes,
  topics,
  labels,
}: ArticlesFilterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(initialQ || "");
  const [type, setType] = useState(initialType || "");
  const [topic, setTopic] = useState(initialTopic || "");
  const [sort, setSort] = useState(initialSort || "");

  // Keep local state synchronized with URL query params when filters are cleared or changed externally
  useEffect(() => {
    setQ(initialQ || "");
  }, [initialQ]);

  useEffect(() => {
    setType(initialType || "");
  }, [initialType]);

  useEffect(() => {
    setTopic(initialTopic || "");
  }, [initialTopic]);

  useEffect(() => {
    setSort(initialSort || "");
  }, [initialSort]);

  function navigate(queryQ: string, queryType: string, queryTopic: string, querySort: string = sort) {
    const params = new URLSearchParams();
    if (queryQ.trim()) params.set("q", queryQ.trim());
    if (queryType && queryType !== "All Types" && queryType !== "All Categories") {
      params.set("type", queryType);
    }
    if (queryTopic && queryTopic !== "All Topics") {
      params.set("topic", queryTopic);
    }
    if (querySort && querySort !== DEFAULT_ARTICLE_SORT) {
      params.set("sort", querySort);
    }
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/articles?${query}` : "/articles");
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(q, type, topic);
  }

  function handleTypeSelect(val: string) {
    const nextType = val === "All Types" || val === "All Categories" ? "" : val;
    setType(nextType);
    navigate(q, nextType, topic);
  }

  function handleTopicSelect(val: string) {
    const nextTopic = val === "All Topics" ? "" : val;
    setTopic(nextTopic);
    navigate(q, type, nextTopic);
  }

  function handleSortSelect(val: string) {
    const nextSort = val === DEFAULT_ARTICLE_SORT ? "" : val;
    setSort(nextSort);
    navigate(q, type, topic, nextSort);
  }

  function handleReset() {
    setQ("");
    setType("");
    setTopic("");
    setSort("");
    startTransition(() => {
      router.push("/articles");
    });
  }

  const hasActiveFilters = Boolean(q.trim() || type || topic || sort);
  const sortOptions = Array.isArray(labels?.sortOptions) ? labels.sortOptions : [];

  // If a topic or type is passed in the URL that isn't in the lists, include it so the select still reflects it
  const selectTopics = topic && !topics.includes(topic) ? [topic, ...topics] : topics;
  const selectTypes = type && !articleTypes.includes(type) ? [type, ...articleTypes] : articleTypes;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 p-3 sm:p-4 shadow-2xs">
      <div
        className={
          sortOptions.length > 0
            ? "grid gap-3 md:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_170px_170px_170px_auto] md:items-center"
            : "grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_190px_auto] md:items-center"
        }
      >
        <label
          className={`flex min-h-11.5 items-center gap-3 bg-slate-50 border border-slate-200 px-4 focus-within:border-gb-accent focus-within:bg-white transition-all ${
            sortOptions.length > 0 ? "md:col-span-3 xl:col-span-1" : ""
          }`}
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="sr-only">Search the research archive</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels?.searchPlaceholder ?? "Search by title, author surname, DOI, or keyword..."}
            className="w-full border-none bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                navigate("", type, topic);
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Clear search keyword"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <label>
          <span className="sr-only">Article type</span>
          <CustomSelect options={["All Types", ...selectTypes]} value={type || "All Types"} onChange={handleTypeSelect} />
        </label>

        <label>
          <span className="sr-only">Subject area</span>
          <CustomSelect options={["All Topics", ...selectTopics]} value={topic || "All Topics"} onChange={handleTopicSelect} />
        </label>

        {sortOptions.length > 0 && (
          <label>
            <span className="sr-only">Sort order</span>
            <CustomSelect options={sortOptions} value={sort || DEFAULT_ARTICLE_SORT} onChange={handleSortSelect} />
          </label>
        )}

        <div className={`flex items-center gap-2 ${sortOptions.length > 0 ? "md:col-span-3 xl:col-span-1" : ""}`}>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11.5 flex-1 md:flex-none shrink-0 items-center justify-center gap-2 bg-gb-navy hover:bg-gb-navy-hover px-6 text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition-colors cursor-pointer focus:outline-none disabled:opacity-75"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{labels?.searchButton ?? "Search"}</span>
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset all filters"
              className="inline-flex min-h-11.5 items-center justify-center px-3 border border-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>{labels?.resetButton ?? "Reset"}</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
