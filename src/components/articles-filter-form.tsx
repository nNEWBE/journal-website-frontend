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
      className="relative z-30 rounded-2xl border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-md shadow-[0_28px_70px_rgba(0,0,0,0.24)]"
    >
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_175px_175px_auto] md:items-center">
        <label className="flex min-h-[42px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-3.5 transition-all focus-within:bg-white/15 focus-within:border-white/25">
          <Search className="h-3.5 w-3.5 shrink-0 text-white/60" />
          <span className="sr-only">Search the research archive</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title, author, DOI, or keyword"
            className="w-full border-none bg-transparent text-xs font-semibold text-white outline-none focus:outline-none focus:ring-0 focus:border-none hover:border-none placeholder:font-medium placeholder:text-white/50"
          />
        </label>

        <label>
          <span className="sr-only">Article type</span>
          <CustomSelect
            variant="dark"
            options={["All Types", ...articleTypes]}
            value={type || "All Types"}
            onChange={(value) => setType(value === "All Types" ? "" : value)}
          />
        </label>

        <label>
          <span className="sr-only">Subject area</span>
          <CustomSelect
            variant="dark"
            options={["All Topics", ...topics]}
            value={topic || "All Topics"}
            onChange={(value) => setTopic(value === "All Topics" ? "" : value)}
          />
        </label>

        <button
          type="submit"
          className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-xs font-bold text-slate-950 shadow-md transition-all hover:bg-sky-400 focus:outline-none"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Apply filters</span>
        </button>
      </div>
    </form>
  );
}
