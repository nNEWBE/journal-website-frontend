"use client";

import { Download, Quote, Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Article } from "@/lib/data";

export function ArticleActions({ article }: { article: Article }) {
  const [copiedCite, setCopiedCite] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCite = () => {
    const citation = `${article.authors.join(", ")} (${article.publishedAt.split(" ")[1] || "2026"}). ${article.title}. GB Journal, ${article.volume}, ${article.issue}, ${article.pages}. doi:${article.doi}`;
    navigator.clipboard.writeText(citation);
    toast.success("Citation copied in APA format!");
    setCopiedCite(true);
    setTimeout(() => setCopiedCite(false), 2000);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="mt-4 grid gap-2.5">
      <a
        href={article.pdf || "#"}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 w-full cursor-pointer text-center active:scale-[0.98]"
      >
        <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
        Download PDF
      </a>
      
      <button
        onClick={handleCite}
        className="group inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-[color:var(--color-gb-blue-dark)] transition-all duration-200 w-full cursor-pointer active:scale-[0.98]"
      >
        {copiedCite ? (
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
        ) : (
          <Quote className="h-4 w-4 text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
        )}
        {copiedCite ? "Citation Copied" : "Cite Article"}
      </button>

      <button
        onClick={handleShare}
        className="group inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-[color:var(--color-gb-blue-dark)] transition-all duration-200 w-full cursor-pointer active:scale-[0.98]"
      >
        {copiedShare ? (
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
        ) : (
          <Share2 className="h-4 w-4 text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
        )}
        {copiedShare ? "Link Copied" : "Share Article"}
      </button>
    </div>
  );
}
