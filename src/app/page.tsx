import { type PageContentDTO } from "@/lib/api";
import { HomePageClient } from "@/components/home/home-page-client";
import { getBackendUrl } from "@/lib/backend-url";
import { type Article, type Issue } from "@/lib/data";

export const dynamic = "force-dynamic";

async function fetchHomeData(): Promise<{
  sections: PageContentDTO[];
  articles: Article[];
  currentIssue: Issue | null;
}> {
  const backendUrl = getBackendUrl();
  let sections: PageContentDTO[] = [];
  let articles: Article[] = [];
  let currentIssue: Issue | null = null;

  try {
    const [sectionsRes, articlesRes, currentIssueRes] = await Promise.all([
      fetch(`${backendUrl}/api/v1/content/home`, { next: { revalidate: 10 } })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch(`${backendUrl}/api/v1/articles?size=20`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${backendUrl}/api/v1/issues/current`, { next: { revalidate: 30 } })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]);

    if (Array.isArray(sectionsRes)) {
      sections = sectionsRes;
    }

    if (articlesRes?.content && Array.isArray(articlesRes.content)) {
      articles = articlesRes.content.map((item: any) => ({
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
        issue: item.issue || item.issueLabel || "Issue 2",
        volume: item.volume || item.volumeLabel || "Volume 4",
        pages: item.pages || "1-10",
        doi: item.doi || "10.5555/gbj.2026.001",
        publishedAt: item.publishedAt || "July 2026",
        metrics: {
          views: item.metrics?.views ?? 0,
          downloads: item.metrics?.downloads ?? 0,
          citations: item.metrics?.citations ?? 0,
        },
        keywords: Array.isArray(item.keywords) ? item.keywords : [],
        sections: [],
        image: item.image || item.imageUrl || "/covers/medical.png",
        pdf: item.pdf || item.pdfUrl || "",
      }));
    }

    if (currentIssueRes) {
      currentIssue = {
        id: String(currentIssueRes.id || currentIssueRes.issueKey),
        volume: currentIssueRes.volumeLabel || "Volume 4",
        issue: currentIssueRes.issueLabel || "Issue 2",
        year: String(currentIssueRes.year || "2026"),
        month: currentIssueRes.month || "July 2026",
        theme: currentIssueRes.theme || "Community Health, Stewardship, and Resilient Systems",
        coverImage: currentIssueRes.coverImageUrl || "/covers/medical.png",
        editorNote: currentIssueRes.editorNote || undefined,
        articleCount:
          currentIssueRes.articleCount ||
          (currentIssueRes.articles ? currentIssueRes.articles.length : 0),
        articles: Array.isArray(currentIssueRes.articles)
          ? currentIssueRes.articles.map((item: any) => ({
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
              issue: item.issue || item.issueLabel || "Issue 2",
              volume: item.volume || item.volumeLabel || "Volume 4",
              pages: item.pages || "1-10",
              doi: item.doi || "10.5555/gbj.2026.001",
              publishedAt: item.publishedAt || "July 2026",
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
      };
    }
  } catch (err) {
    console.error("Failed to fetch home data on SSR:", err);
  }

  return { sections, articles, currentIssue };
}

export default async function Home() {
  const { sections, articles, currentIssue } = await fetchHomeData();
  return (
    <HomePageClient
      initialSections={sections}
      articles={articles}
      currentIssue={currentIssue}
    />
  );
}
