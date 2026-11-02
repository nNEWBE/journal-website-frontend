import type { PageContentDTO } from "@/lib/api";
import { getBackendUrl } from "@/lib/backend-url";

/**
 * CMS-backed page content.
 *
 * Every public page keeps its default copy in `src/lib/cms/defaults/<pageKey>.json`.
 * The same files are copied into the backend (`src/main/resources/cms/defaults`) where
 * `PageContentService` seeds them, so admins see exactly these sections in the CMS panel.
 * Pages fetch the published sections server-side and merge them over the defaults, so the
 * page renders identically when the backend is unreachable or nothing has been edited.
 */

export interface SectionDefault {
  label: string;
  description?: string;
  title: string;
  subtitle?: string;
  content?: string;
  meta?: Record<string, unknown>;
}

export interface PageDefaults {
  pageKey: string;
  label: string;
  route: string;
  description?: string;
  sections: Record<string, SectionDefault>;
}

export interface ResolvedSection<M = Record<string, unknown>> {
  key: string;
  title: string;
  subtitle: string;
  content: string;
  meta: M;
  visible: boolean;
  order: number;
}

type MetaOf<S> = S extends { meta: infer M } ? M : Record<string, never>;

export type ResolvedPage<D extends PageDefaults> = {
  [K in keyof D["sections"]]: ResolvedSection<MetaOf<D["sections"][K]>>;
} & {
  /** Section keys sorted by the admin-defined display order (visible ones only). */
  _order: (keyof D["sections"] & string)[];
};

function parseMeta(raw?: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Merge CMS sections over the page defaults.
 *
 * A section is hidden only when the CMS answered with sections for this page's schema
 * and that section is missing (the public endpoint omits unpublished sections). If the
 * CMS is unreachable or returns sections from an older schema, defaults are shown.
 */
export function resolvePageContent<D extends PageDefaults>(
  defaults: D,
  cmsSections: PageContentDTO[] | null | undefined
): ResolvedPage<D> {
  const keys = Object.keys(defaults.sections);
  const byKey = new Map<string, PageContentDTO>();
  (cmsSections || []).forEach((s) => {
    if (s?.sectionKey) byKey.set(s.sectionKey.toLowerCase(), s);
  });
  const cmsKnowsSchema = keys.some((k) => byKey.has(k));

  const result: Record<string, ResolvedSection> = {};
  keys.forEach((key, idx) => {
    const def = defaults.sections[key];
    const cms = cmsKnowsSchema ? byKey.get(key) : undefined;
    const visible = !cmsKnowsSchema || (!!cms && cms.published !== false);
    result[key] = {
      key,
      title: cms?.title ?? def.title ?? "",
      subtitle: cms?.subtitle ?? def.subtitle ?? "",
      content: cms?.content ?? def.content ?? "",
      meta: { ...(def.meta || {}), ...parseMeta(cms?.metaJson) },
      visible,
      order: typeof cms?.displayOrder === "number" ? cms.displayOrder : idx + 1,
    };
  });

  const order = keys
    .filter((k) => result[k].visible)
    .sort((a, b) => result[a].order - result[b].order);

  return { ...result, _order: order } as unknown as ResolvedPage<D>;
}

/** Server-side fetch of published sections. Never throws; returns [] on failure. */
export async function fetchCmsSections(pageKey: string): Promise<PageContentDTO[]> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/content/${pageKey}`, {
      next: { revalidate: 10, tags: ["cms", `cms:${pageKey}`] },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Fetch + resolve in one call, for server components. */
export async function getPageContent<D extends PageDefaults>(defaults: D): Promise<ResolvedPage<D>> {
  const sections = await fetchCmsSections(defaults.pageKey);
  return resolvePageContent(defaults, sections);
}

/** Split CMS text into paragraphs on blank lines. */
export function cmsParagraphs(text: string | undefined | null): string[] {
  return (text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Split CMS text into non-empty lines. */
export function cmsLines(text: string | undefined | null): string[] {
  return (text || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
}
