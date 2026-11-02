import { Metadata } from "next";
import { IssuesArchiveClient } from "@/components/issues/issues-archive-client";
import { getBackendUrl } from "@/lib/backend-url";
import { type Issue } from "@/lib/data";
import { getPageContent } from "@/lib/cms/page-content";
import issuesDefaults from "@/lib/cms/defaults/issues.json";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Issues Archive | GB Journal of Research",
  description:
    "Explore past published editions, thematic volumes, and research archives of the Gono Bishwabidyalay Journal of Research.",
};

async function fetchIssues(): Promise<Issue[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/issues`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((iss: any) => ({
      id: String(iss.id || iss.issueKey),
      volume: iss.volumeLabel || (iss.volume ? `Volume ${iss.volume}` : ""),
      issue: iss.issueLabel || (iss.number ? `Issue ${iss.number}` : ""),
      year: iss.year ? String(iss.year) : "",
      month: iss.month || "",
      theme: iss.theme || iss.title || "",
      coverImage: iss.coverImageUrl || "/covers/medical.png",
      editorNote: iss.editorNote || undefined,
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
            issue: item.issue || item.issueLabel || "",
            volume: item.volume || item.volumeLabel || "",
            pages: item.pages || "",
            doi: item.doi || "",
            publishedAt: item.publishedAt || "",
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
  const [issues, content] = await Promise.all([
    fetchIssues(),
    getPageContent(issuesDefaults),
  ]);
  return <IssuesArchiveClient initialIssues={issues} content={content} />;
}
