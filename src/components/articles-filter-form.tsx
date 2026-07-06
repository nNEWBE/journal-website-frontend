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
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (topic) params.set("topic", topic);
    router.push(`/articles?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface mt-7 grid gap-4 rounded-xl p-4 md:grid-cols-[1fr_220px_220px_auto] items-end bg-white border border-[color:var(--border)] shadow-sm"
    >
      <label className="grid gap-2 w-full">
        <span className="text-xs font-black text-[color:var(--green-dark)]">Search Query</span>
        <div className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-white px-3.5 py-2.5 transition-all focus-within:border-[color:var(--university-green)]">
          <Search className="h-4.5 w-4.5 text-[color:var(--ink-muted)] shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, author, DOI, keyword..."
            className="w-full bg-transparent text-xs outline-none text-[color:var(--foreground)]"
          />
        </div>
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-black text-[color:var(--green-dark)]">Article Type</span>
        <CustomSelect
          options={["All Types", ...articleTypes]}
          value={type || "All Types"}
          onChange={(val) => setType(val === "All Types" ? "" : val)}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-black text-[color:var(--green-dark)]">Subject Topic</span>
        <CustomSelect
          options={["All Topics", ...topics]}
          value={topic || "All Topics"}
          onChange={(val) => setTopic(val === "All Topics" ? "" : val)}
        />
      </label>

      <button type="submit" className="btn-primary h-[42px] px-6 py-2 rounded-lg font-bold text-xs tracking-wider">
        Apply Filters
      </button>
    </form>
  );
}
