"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

interface ArticlesFilterFormProps {
  initialQ: string;
  initialType: string;
  initialTopic: string;
  articleTypes: string[];
  topics: string[];
}

export function ArticlesFilterForm({
  initialQ,
  initialType,
  initialTopic,
  articleTypes,
  topics,
}: ArticlesFilterFormProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState(initialType);
  const [topic, setTopic] = useState(initialTopic);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (topic) params.set("topic", topic);
    const query = params.toString();
    router.push(query ? `/articles?${query}` : "/articles");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-[0_12px_36px_rgba(11,18,61,0.06)]"
    >
      <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_185px_185px_auto] md:items-center">
        {/* Search input field */}
        <label className="flex min-h-[44px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 transition-all focus-within:border-slate-300 focus-within:bg-white">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="sr-only">Search the research archive</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title, author, DOI, or keyword"
            className="w-full border-none bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </label>

        {/* Article type dropdown */}
        <label>
          <span className="sr-only">Article type</span>
          <CustomSelect
            options={["All Types", ...articleTypes]}
            value={type || "All Types"}
            onChange={(value) => setType(value === "All Types" ? "" : value)}
          />
        </label>

        {/* Topic dropdown */}
        <label>
          <span className="sr-only">Subject area</span>
          <CustomSelect
            options={["All Topics", ...topics]}
            value={topic || "All Topics"}
            onChange={(value) => setTopic(value === "All Topics" ? "" : value)}
          />
        </label>

        {/* Filter Action Button */}
        <button
          type="submit"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] hover:bg-[color:var(--color-gb-blue)] px-6 text-xs font-extrabold text-white shadow-xs transition-colors cursor-pointer focus:outline-none"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Apply filters</span>
        </button>
      </div>
    </form>
  );
}
