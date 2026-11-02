import Link from "next/link";
import { Archive, ArrowUpRight, Globe2, Send, ShieldCheck } from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import type { ResolvedSection } from "@/lib/cms/page-content";

/* CMS-driven static blocks of the /articles listing page. */

const SPEC_VALUE_CLASSES = [
  "font-mono font-semibold text-slate-900",
  "font-mono font-semibold text-slate-900",
  "font-semibold text-slate-900",
  "font-semibold text-emerald-700",
  "font-mono text-slate-900",
];

export function ArticlesSpecificationsCard({
  section,
}: {
  section: ResolvedSection<{ specs?: { label: string; value: string }[] }>;
}) {
  const specs = Array.isArray(section.meta.specs) ? section.meta.specs : [];
  return (
    <div className="bg-white border border-slate-200/90 p-5 shadow-2xs mt-6">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3">
        {section.title}
      </p>
      <dl className="divide-y divide-slate-100 text-xs">
        {specs.map((spec, idx) => (
          <div key={`${spec.label}-${idx}`} className="flex items-center justify-between py-2">
            <dt className="text-slate-500">{spec.label}</dt>
            <dd className={SPEC_VALUE_CLASSES[idx] ?? "font-semibold text-slate-900"}>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ArticlesSubmitCard({
  section,
}: {
  section: ResolvedSection<{ cta?: { label: string; href: string } }>;
}) {
  const cta = section.meta.cta;
  return (
    <div className="bg-[#0b1b3d] text-white p-5 shadow-2xs mt-6 border border-slate-800">
      {section.subtitle && (
        <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-amber-300">
          <Send className="h-3 w-3" />
          <span>{section.subtitle}</span>
        </div>
      )}
      <h3 className="mt-3 font-academic text-base font-medium text-white leading-snug">
        {section.title}
      </h3>
      {section.content && (
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          {section.content}
        </p>
      )}
      {cta?.label && (
        <Link
          href={cta.href || "/dashboard/submissions/new"}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0b1b3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
        >
          <span>{cta.label}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

const STANDARD_FALLBACK_ICONS = [ShieldCheck, Globe2, Archive];

export function ArticlesStandardsBand({
  section,
}: {
  section: ResolvedSection<{ items?: { icon?: string; title: string; text: string }[] }>;
}) {
  const items = Array.isArray(section.meta.items) ? section.meta.items : [];
  return (
    <section
      aria-label={section.title}
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const Icon = cmsIcon(item.icon, STANDARD_FALLBACK_ICONS[idx % STANDARD_FALLBACK_ICONS.length]);
            return (
              <div
                key={`${item.title}-${idx}`}
                className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-academic text-base font-medium text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
