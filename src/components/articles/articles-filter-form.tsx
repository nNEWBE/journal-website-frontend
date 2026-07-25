"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
      className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_14px_38px_rgba(11,18,61,0.07)]"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_190px_auto] md:items-center">
        <label className="flex min-h-[46px] items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 transition-all focus-within:border-[color:var(--color-gb-blue)]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[color:var(--color-gb-blue)]/15">
          <Search className="h-4.5 w-4.5 shrink-0 text-[color:var(--color-gb-blue)]" />
          <span className="sr-only">Search the research archive</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author surname, DOI, or keyword..."
            className="w-full border-none bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </label>

        <label>
          <span className="sr-only">Article type</span>
          <CustomSelect
            options={["All Types", ...articleTypes]}
            value={type || "All Types"}
            onChange={(value) => setType(value === "All Types" ? "" : value)}
          />
        </label>

        <label>
          <span className="sr-only">Subject area</span>
          <CustomSelect
            options={["All Topics", ...topics]}
            value={topic || "All Topics"}
            onChange={(value) => setTopic(value === "All Topics" ? "" : value)}
          />
        </label>

        <button
          type="submit"
          className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] hover:bg-[color:var(--color-gb-blue)] px-6 text-xs font-extrabold text-white shadow-xs transition-colors cursor-pointer focus:outline-none"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search articles</span>
        </button>
      </div>
    </form>
  );
}
