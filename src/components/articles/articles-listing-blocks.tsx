import Link from "next/link";
import { Archive, Globe2, ShieldCheck, Tag } from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import type { ResolvedSection } from "@/lib/cms/page-content";
import { FeatureCard, FeatureGrid, PageSection, SectionHeader } from "@/components/site";
import { cn } from "@/lib/utils";

/* CMS-driven blocks of the /articles listing page. */

/** Sidebar card listing every subject (topics come from the database). */
export function ArticlesSubjectsCard({
  title,
  topics,
  activeTopic,
}: {
  title: string;
  topics: string[];
  activeTopic: string;
}) {
  if (topics.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
      <p className="flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4 text-[10.5px] font-bold uppercase tracking-wider text-gb-accent">
        <Tag className="h-3.5 w-3.5" />
        <span>{title}</span>
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {topics.map((t) => {
          const isActive = activeTopic.toLowerCase() === t.toLowerCase();
          return (
            <li key={t}>
              <Link
                href={isActive ? "/articles" : `/articles?topic=${encodeURIComponent(t)}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-block px-2.5 py-1 text-[11px] font-semibold transition-colors border",
                  isActive
                    ? "bg-gb-navy text-white border-gb-navy"
                    : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {t}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const STANDARD_FALLBACK_ICONS = [ShieldCheck, Globe2, Archive];

/** "Publication standards" band below the listing (CMS section "standards"). */
export function ArticlesStandardsBand({
  section,
  tone = "white",
}: {
  section: ResolvedSection<{ items?: { icon?: string; title: string; text: string }[] }>;
  tone?: "white" | "tint";
}) {
  const items = Array.isArray(section.meta.items) ? section.meta.items : [];
  if (items.length === 0) return null;
  return (
    <PageSection tone={tone} ariaLabel={section.title}>
      <SectionHeader eyebrow={section.subtitle} title={section.title} intro={section.content || undefined} />
      <FeatureGrid columns={3}>
        {items.map((item, idx) => (
          <FeatureCard
            key={`${item.title}-${idx}`}
            icon={cmsIcon(item.icon, STANDARD_FALLBACK_ICONS[idx % STANDARD_FALLBACK_ICONS.length])}
            iconStyle="solid"
            muted={tone === "white"}
            title={item.title}
            description={item.text}
          />
        ))}
      </FeatureGrid>
    </PageSection>
  );
}
