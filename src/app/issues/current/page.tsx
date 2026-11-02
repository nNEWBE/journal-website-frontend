import { Metadata } from "next";
import { BookOpen, Clock, FileText, Globe2, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink, EmptyState, JournalCtaPanel, PageSection } from "@/components/site";
import { CurrentIssueInteractive } from "@/components/issues/current-issue-interactive";
import { getBackendUrl } from "@/lib/backend-url";
import type { Article } from "@/lib/data";
import { getPageContent } from "@/lib/cms/page-content";
import issuesCurrentDefaults from "@/lib/cms/defaults/issues-current.json";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Current Issue | GB Journal of Research",
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
      next: { revalidate: 60 },
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
            (rawCurrent.volume ? `Volume ${rawCurrent.volume}` : ""),
          issue:
            rawCurrent.issueLabel ||
            (rawCurrent.number ? `Issue ${rawCurrent.number}` : ""),
          month: rawCurrent.month || "",
          year: rawCurrent.year ? String(rawCurrent.year) : "",
          theme: rawCurrent.theme || rawCurrent.title || "",
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
      : [];

    const otherIssues = issueList.map((iss: any) => ({
      ...iss,
      volume:
        iss.volumeLabel || (iss.volume ? `Volume ${iss.volume}` : ""),
      issue:
        iss.issueLabel || (iss.number ? `Issue ${iss.number}` : ""),
    }));

    return { currentIssue, allArticles, otherIssues };
  } catch (err) {
    console.error("Failed to fetch current issue from DB:", err);
    return { currentIssue: null, allArticles: [], otherIssues: [] };
  }
}

export default async function CurrentIssuePage() {
  const [{ currentIssue, allArticles, otherIssues }, content] =
    await Promise.all([
      getCurrentIssueFromDb(),
      getPageContent(issuesCurrentDefaults),
    ]);

  if (!currentIssue) {
    const noIssue = content["no-issue"];
    const noIssueCtas = Array.isArray(noIssue.meta.ctas) ? noIssue.meta.ctas : [];
    return (
      <PageShell>
        {noIssue.visible && (
          <PageSection tone="tint" ariaLabel="No current issue">
            <EmptyState icon={BookOpen} title={noIssue.title} text={noIssue.content} titleAs="h1">
              {noIssueCtas.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {noIssueCtas.map((cta, idx) => (
                    <ButtonLink key={`${cta.label}-${idx}`} href={cta.href} variant={idx === 0 ? "primary" : "secondary"}>
                      {cta.label}
                    </ButtonLink>
                  ))}
                </div>
              )}
            </EmptyState>
          </PageSection>
        )}
        {content.cta.visible && (
          <JournalCtaPanel
            section={content.cta}
            ariaLabel="Call for Papers CTA"
            badgeFallbackIcon={FileText}
            pillFallbackIcons={[Clock, Globe2, ShieldCheck]}
          />
        )}
      </PageShell>
    );
  }

  return (
    <CurrentIssueInteractive
      currentIssue={currentIssue}
      allArticles={allArticles}
      otherIssues={otherIssues}
      content={content}
    />
  );
}
