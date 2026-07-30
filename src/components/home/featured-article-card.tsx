"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookmarkCheck,
  BookOpen,
  Download,
  Eye,
  FileText,
  Globe2,
  Quote,
} from "lucide-react";
import type { Article } from "@/lib/data";

interface FeaturedArticleCardProps {
  featuredArticle: Article;
}

export function FeaturedArticleCard({ featuredArticle }: FeaturedArticleCardProps) {
  return (
    <article className="editorial-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 lg:p-8 shadow-sm">
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs">
            <BookmarkCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
              Editor&apos;s selection
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Featured research
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
          <Globe2 className="h-3.5 w-3.5" />
          Open access
        </span>
      </div>

      <div className="relative grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <Link
          href={`/articles/${featuredArticle.slug}`}
          className="group/cover relative block h-full min-h-[300px] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-md focus-ring md:min-h-full"
        >
          <Image
            src={featuredArticle.image || "/covers/medical.png"}
            alt={featuredArticle.title}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 240px"
            className="object-cover transition-transform duration-700 ease-out group-hover/cover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/80 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md shadow-md">
            <FileText className="h-3 w-3 text-amber-300" />
            {featuredArticle.type}
          </span>
        </Link>

        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">
              {featuredArticle.topic}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {featuredArticle.publishedAt}
            </span>
          </div>

          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="focus-ring rounded-sm"
          >
            <h2 className="font-academic text-[1.65rem] font-bold leading-[1.17] tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)] transition-colors duration-200 hover:text-[color:var(--color-gb-blue)] sm:text-3xl">
              {featuredArticle.title}
            </h2>
          </Link>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600">
            <span className="font-extrabold text-slate-400 uppercase text-[9.5px] tracking-widest shrink-0">
              Authors:
            </span>
            <span className="text-slate-700 font-semibold">
              {featuredArticle.authors.join(", ")}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 sm:p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider text-[color:var(--color-gb-blue)]">
              <Quote className="h-3.5 w-3.5 rotate-180" />
              Abstract Summary
            </div>
            <p className="line-clamp-3 text-[12.5px] leading-relaxed text-slate-600 font-normal italic">
              &ldquo;{featuredArticle.abstract}&rdquo;
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              {
                icon: Eye,
                value: featuredArticle.metrics.views.toLocaleString(),
                label: "Views",
              },
              {
                icon: Download,
                value: featuredArticle.metrics.downloads.toLocaleString(),
                label: "Downloads",
              },
              {
                icon: BookOpen,
                value: featuredArticle.metrics.citations.toLocaleString(),
                label: "Citations",
              },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                    <span className="text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                      {metric.value}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="truncate font-mono text-[9px] font-medium text-slate-400">
              DOI: {featuredArticle.doi}
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredArticle.pdf && (
                <a
                  href={featuredArticle.pdf}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[11px] font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-xs hover:border-slate-300 transition-colors focus-ring"
                  download
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </a>
              )}
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[color:var(--color-gb-blue-deep)] px-5 text-[11px] font-extrabold text-white shadow-xs hover:bg-[color:var(--color-gb-blue)] transition-colors focus-ring"
              >
                Read article
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
