"use client";

import { createContext, useContext, type ReactNode } from "react";
import siteDefaults from "@/lib/cms/defaults/site.json";
import { resolvePageContent, type ResolvedPage } from "@/lib/cms/page-content";

export type SiteContent = ResolvedPage<typeof siteDefaults>;

/** Header/footer copy used when no CMS content was provided (e.g. outside the root layout). */
const DEFAULT_SITE_CONTENT: SiteContent = resolvePageContent(siteDefaults, null);

const SiteContentContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);

export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

/** Site-wide (header & footer) CMS copy; falls back to the JSON defaults. */
export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
