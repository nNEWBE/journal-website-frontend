import type { ReactNode } from "react";
import siteDefaults from "@/lib/cms/defaults/site.json";
import { getPageContent } from "@/lib/cms/page-content";
import { SiteContentProvider } from "@/components/layout/site-content";

/**
 * Server component (used in the root layout): fetches the site-wide header/footer CMS copy
 * once and exposes it to the client header/footer through context, so it works for both
 * server and "use client" pages that render <PageShell>.
 */
export async function SiteContentLoader({ children }: { children: ReactNode }) {
  const content = await getPageContent(siteDefaults);
  return <SiteContentProvider content={content}>{children}</SiteContentProvider>;
}
