import { Metadata } from "next";
import { IssuesArchiveClient } from "@/components/issues/issues-archive-client";
import { getBackendUrl } from "@/lib/backend-url";
import { type Issue } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issues Archive — GB Journal of Research",
  description:
    "Explore past published editions, thematic volumes, and research archives of the Gono Bishwabidyalay Journal of Research.",
};

async function fetchIssues(): Promise<Issue[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/issues`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((iss: any) => ({
      id: String(iss.id || iss.issueKey),
      volume: iss.volumeLabel || (iss.volume ? `Volume ${iss.volume}` : "Volume 4"),
      issue: iss.issueLabel || (iss.number ? `Issue ${iss.number}` : "Issue 1"),
      year: String(iss.year || "2026"),
      month: iss.month || "July",
      theme: iss.theme || iss.title || "Scholarly Research",
      coverImage: iss.coverImageUrl || "/covers/medical.png",
      articleCount: iss.articleCount || (iss.articles ? iss.articles.length : 0),
      articles: Array.isArray(iss.articles)
        ? iss.articles.map((item: any) => ({
            id: item.articleId || String(item.id || item.slug),
            slug: item.slug,
            title: item.title,
            type: item.type || "Research Article",
            topic: item.topic || "General",
            department: item.department || "Academic Research",
            authors: Array.isArray(item.authors)
              ? item.authors.map((a: any) => (typeof a === "string" ? a : a.name || ""))
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
        : [],
    }));
  } catch (err) {
    console.error("Failed to fetch issues server-side:", err);
    return [];
  }
}

export default async function IssuesPage() {
  const issues = await fetchIssues();
  return <IssuesArchiveClient initialIssues={issues} />;
}
