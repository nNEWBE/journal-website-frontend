"use client";

import { Download, Quote, Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Article } from "@/lib/data";

function formatApaAuthor(author: string) {
  const parts = author
    .replace(/^(Dr|Prof)\.\s+/i, "")
    .trim()
    .split(/\s+/);
  const surname = parts.pop() ?? author;
  const initials = parts
    .map((part) => `${part.replace(/\./g, "").charAt(0).toUpperCase()}.`)
    .join(" ");

  return `${surname}, ${initials}`;
}

function joinApaAuthors(authors: string[]) {
  const formatted = authors.map(formatApaAuthor);

  if (formatted.length <= 1) {
    return formatted[0] ?? "";
  }

  return `${formatted.slice(0, -1).join(", ")}, & ${formatted.at(-1)}`;
}

export function ArticleActions({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "hero" | "default";
}) {
  const [copiedCite, setCopiedCite] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCite = async () => {
    const year = article.publishedAt.match(/\d{4}/)?.[0] ?? "2026";
    const volume = article.volume.replace(/\D/g, "");
    const issue = article.issue.replace(/\D/g, "");
    const citation = `${joinApaAuthors(article.authors)} (${year}). ${article.title}. Gono Bishwabidyalay Journal of Research, ${volume}(${issue}), ${article.pages}. https://doi.org/${article.doi}`;

    try {
      await navigator.clipboard.writeText(citation);
      toast.success("APA citation copied to clipboard");
      setCopiedCite(true);
      window.setTimeout(() => setCopiedCite(false), 2000);
    } catch {
      toast.error("Could not copy the citation");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard");
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      toast.error("Could not copy the article link");
    }
  };

  const isHero = variant === "hero";
  const pdfUrl = article.pdf || `https://doi.org/${article.doi}`;

  if (isHero) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={pdfUrl}
          download={!!article.pdf}
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </a>

        <button
          type="button"
          onClick={handleCite}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {copiedCite ? <Check className="h-4 w-4 text-emerald-400" /> : <Quote className="h-4 w-4 text-amber-300" />}
          <span>{copiedCite ? "Citation Copied" : "Cite Article"}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {copiedShare ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-blue-300" />}
          <span>{copiedShare ? "Link Copied" : "Share"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <a
        href={pdfUrl}
        download={!!article.pdf}
        className="inline-flex w-full items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
      >
        <Download className="h-4 w-4" />
        <span>Download Full PDF</span>
      </a>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCite}
          className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {copiedCite ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Quote className="h-3.5 w-3.5 text-slate-500" />}
          <span>{copiedCite ? "Copied" : "Cite"}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-slate-500" />}
          <span>{copiedShare ? "Copied" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}
