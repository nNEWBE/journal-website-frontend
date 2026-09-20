import { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { CurrentIssueInteractive } from "@/components/issues/current-issue-interactive";
import { getBackendUrl } from "@/lib/backend-url";
import type { Article } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Current Issue — GB Journal of Research",
  description:
    "Explore the latest peer-reviewed research volume, editorial insights, and multidisciplinary scholarship published in the current edition of the Gono Bishwabidyalay Journal of Research.",
};

async function getCurrentIssueFromDb(): Promise<{
  currentIssue: any | null;
  allArticles: Article[];
  otherIssues: any[];
}> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/issues`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { currentIssue: null, allArticles: [], otherIssues: [] };
    }

    const issueList = await res.json();
    if (!Array.isArray(issueList) || issueList.length === 0) {
      return { currentIssue: null, allArticles: [], otherIssues: [] };
    }

    const rawCurrent =
      issueList.find((i: any) => i.current || i.isCurrent) || issueList[0];

    const currentIssue = rawCurrent
      ? {
          ...rawCurrent,
          volume:
            rawCurrent.volumeLabel ||
            (rawCurrent.volume ? `Volume ${rawCurrent.volume}` : "Volume 4"),
          issue:
            rawCurrent.issueLabel ||
            (rawCurrent.number ? `Issue ${rawCurrent.number}` : "Issue 1"),
          month: rawCurrent.month || "July",
          year: String(rawCurrent.year || "2026"),
          theme: rawCurrent.theme || "Current Scholarly Edition",
        }
      : null;

    const allArticles: Article[] = currentIssue?.articles
      ? currentIssue.articles.map((item: any) => ({
          id: item.articleId || String(item.id || item.slug),
          slug: item.slug,
          title: item.title,
          type: item.type || "Research Article",
          topic: item.topic || "General",
          department: item.department || "Academic Research",
          authors: Array.isArray(item.authors)
            ? item.authors.map((a: any) =>
                typeof a === "string" ? a : a.name || "",
              )
            : [],
          abstract: item.abstract || item.abstractText || "",
          issue: item.issue || item.issueLabel || "Current Issue",
          volume: item.volume || item.volumeLabel || "Volume 4",
          pages: item.pages || "1-10",
          doi: item.doi || "10.5555/gbj.2026.001",
          publishedAt: item.publishedAt || "2026",
          metrics: {
            views: item.metrics?.views ?? 0,
            downloads: item.metrics?.downloads ?? 0,
            citations: item.metrics?.citations ?? 0,
          },
          keywords: Array.isArray(item.keywords) ? item.keywords : [],
          sections: [],
          image: item.image || item.imageUrl || "/covers/medical.png",
          pdf: item.pdf || item.pdfUrl || "",
        }))
      : [];

    const otherIssues = issueList.map((iss: any) => ({
      ...iss,
      volume:
        iss.volumeLabel || (iss.volume ? `Volume ${iss.volume}` : "Volume 4"),
      issue:
        iss.issueLabel || (iss.number ? `Issue ${iss.number}` : "Issue 1"),
    }));

    return { currentIssue, allArticles, otherIssues };
  } catch (err) {
    console.error("Failed to fetch current issue from DB:", err);
    return { currentIssue: null, allArticles: [], otherIssues: [] };
  }
}

export default async function CurrentIssuePage() {
  const { currentIssue, allArticles, otherIssues } =
    await getCurrentIssueFromDb();

  if (!currentIssue) {
    return (
      <PageShell>
        <div className="bg-[#fbfcff] py-20 border-b border-slate-200/80 min-h-[60vh] flex items-center justify-center">
          <div className="container-x max-w-lg text-center">
            <div className="bg-white border border-slate-200/90 p-8 sm:p-12 shadow-2xs">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h1 className="font-academic text-2xl font-medium text-slate-900">
                No Current Issue Published
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                The editorial board is currently preparing the next journal
                issue. Please check back soon or explore our past archives and
                author guidelines.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/issues"
                  className="bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Browse Archives
                </Link>
                <Link
                  href="/authors"
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Author Guidelines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <CurrentIssueInteractive
      currentIssue={currentIssue}
      allArticles={allArticles}
      otherIssues={otherIssues}
    />
  );
}
