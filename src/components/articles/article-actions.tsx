"use client";

import { Download, Quote, Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Article } from "@/lib/data";
import { HeroActionButton } from "@/components/ui/hero-action-button";

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
    const citation = `${joinApaAuthors(article.authors)} (${year}). ${article.title}. Gono Bishwabidyalay Journal, ${volume}(${issue}), ${article.pages}. https://doi.org/${article.doi}`;

    try {
      await navigator.clipboard.writeText(citation);
      toast.success("APA citation copied");
      setCopiedCite(true);
      window.setTimeout(() => setCopiedCite(false), 2000);
    } catch {
      toast.error("Could not copy the citation");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied");
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
        <HeroActionButton
          href={pdfUrl}
          download={!!article.pdf}
          variant="primary"
          icon={Download}
        >
          Download PDF
        </HeroActionButton>

        <HeroActionButton
          variant="secondary"
          icon={copiedCite ? Check : Quote}
          onClick={handleCite}
        >
          {copiedCite ? "Citation copied" : "Cite article"}
        </HeroActionButton>

        <HeroActionButton
          variant="secondary"
          icon={copiedShare ? Check : Share2}
          onClick={handleShare}
        >
          {copiedShare ? "Link copied" : "Share article"}
        </HeroActionButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <HeroActionButton
        href={pdfUrl}
        download={!!article.pdf}
        variant="dark"
        icon={Download}
        className="w-full justify-center text-xs py-2.5 shadow-sm"
      >
        Download PDF
      </HeroActionButton>

      <div className="grid grid-cols-2 gap-2">
        <HeroActionButton
          variant="outline"
          icon={copiedCite ? Check : Quote}
          onClick={handleCite}
          className="w-full justify-center px-2 py-2 text-xs"
        >
          {copiedCite ? "Copied" : "Cite"}
        </HeroActionButton>

        <HeroActionButton
          variant="outline"
          icon={copiedShare ? Check : Share2}
          onClick={handleShare}
          className="w-full justify-center px-2 py-2 text-xs"
        >
          {copiedShare ? "Copied" : "Share"}
        </HeroActionButton>
      </div>
    </div>
  );
}
