"use client";

import { Download, ExternalLink, Eye, FileText, Quote } from "lucide-react";
import type { Article } from "@/lib/data";

interface ArticleSidebarProps {
  article: Article;
}

export function ArticleSidebar({ article }: ArticleSidebarProps) {
  const recordItems = [
    ["DOI", article.doi],
    ["Pages", article.pages],
    ["Published", article.publishedAt],
    ["Volume", article.volume],
    ["Issue", article.issue],
  ];

  return (
    <aside className="space-y-6">
      <section className="overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_12px_34px_rgba(11,18,61,0.06)]">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[color:var(--color-gb-blue-deep)]">
            Publication record
          </h2>
        </div>

        <div className="p-5">
          <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 pb-5">
            {[
              {
                label: "Views",
                value: article.metrics.views,
                icon: Eye,
              },
              {
                label: "Downloads",
                value: article.metrics.downloads,
                icon: Download,
              },
              {
                label: "Citations",
                value: article.metrics.citations,
                icon: Quote,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="px-2 text-center">
                <dt className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                  <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>{label}</span>
                </dt>
                <dd className="mt-2 font-academic text-lg font-bold text-[color:var(--color-gb-blue-deep)]">
                  {value.toLocaleString()}
                </dd>
              </div>
            ))}
          </dl>

          <dl className="mt-4 divide-y divide-slate-100">
            {recordItems.map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-2.5 text-xs"
              >
                <dt className="font-bold uppercase tracking-[0.08em] text-slate-400">
                  {label}
                </dt>
                <dd className="max-w-[180px] text-right font-semibold text-slate-700">
                  {label === "DOI" ? (
                    <a
                      href={`https://doi.org/${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 break-all text-[color:var(--color-gb-blue)] hover:underline"
                    >
                      {value}
                      <ExternalLink
                        className="mt-0.5 h-3 w-3 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[color:var(--color-gb-blue)]/15 bg-[color:var(--color-gb-blue-soft)] px-3.5 py-2.5 text-xs font-bold text-[color:var(--color-gb-blue)]">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            Published journal record
          </div>
        </div>
      </section>
    </aside>
  );
}
