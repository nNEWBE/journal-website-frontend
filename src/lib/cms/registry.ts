import type { PageDefaults, SectionDefault } from "./page-content";
import about from "./defaults/about.json";
import articleDetail from "./defaults/article-detail.json";
import articles from "./defaults/articles.json";
import authors from "./defaults/authors.json";
import contact from "./defaults/contact.json";
import editorialBoard from "./defaults/editorial-board.json";
import issuesCurrent from "./defaults/issues-current.json";
import issues from "./defaults/issues.json";
import notFound from "./defaults/not-found.json";
import policies from "./defaults/policies.json";
import reviewers from "./defaults/reviewers.json";
import site from "./defaults/site.json";

/** All JSON-defined CMS pages, in the order the admin panel lists them. */
export const CMS_PAGE_DEFAULTS: PageDefaults[] = [
  about,
  editorialBoard,
  authors,
  reviewers,
  policies,
  issues,
  issuesCurrent,
  articles,
  articleDetail,
  contact,
  notFound,
  site,
] as PageDefaults[];

export function getPageDefaults(pageKey: string): PageDefaults | undefined {
  return CMS_PAGE_DEFAULTS.find((p) => p.pageKey === pageKey);
}

export function getSectionDefault(pageKey: string, sectionKey: string): SectionDefault | undefined {
  return getPageDefaults(pageKey)?.sections[sectionKey];
}
