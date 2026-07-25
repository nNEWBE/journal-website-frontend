"use client";

import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Globe2,
  Hash,
  Tag,
} from "lucide-react";
import Image from "next/image";
import type { Article } from "@/lib/data";
import { ArticleActions } from "@/components/articles/article-actions";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <section
      className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white"
      aria-labelledby="article-title"
    >
      <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.03]" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-36 -right-36 h-[560px] w-[560px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.12] blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-[300px] w-[380px] rounded-full bg-amber-500 opacity-[0.06] blur-[80px]" aria-hidden="true" />

      <div className="container-x relative grid items-end gap-10 py-12 lg:grid-cols-[1fr_280px] lg:py-16 xl:gap-16">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
              <FileText className="h-2.5 w-2.5" aria-hidden="true" />
              {article.type}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
              <Globe2 className="h-2.5 w-2.5" aria-hidden="true" />
              Open Access
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
              <Tag className="h-2.5 w-2.5" aria-hidden="true" />
              {article.topic}
            </span>
          </div>

          <h1
            id="article-title"
            className="mt-5 max-w-3xl font-academic text-2xl font-extrabold leading-[1.28] tracking-[-0.025em] text-white sm:text-3xl md:text-[2rem]"
          >
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              Authors
            </span>
            <span className="h-3.5 w-px bg-white/20" aria-hidden="true" />
            <span className="text-xs font-semibold text-white/85">
              {article.authors.join(" · ")}
            </span>
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-y border-white/10 py-5">
            {[
              {
                Icon: BookOpen,
                label: "Publication",
                val: `${article.volume}, ${article.issue}, pp. ${article.pages}`,
              },
              { Icon: CalendarDays, label: "Published", val: article.publishedAt },
            ].map(({ Icon, label, val }) => (
              <div key={label}>
                <dt className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                  <Icon className="h-3 w-3 text-amber-300" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1 text-xs font-bold text-white/90">{val}</dd>
              </div>
            ))}
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                <Hash className="h-3 w-3 text-amber-300" aria-hidden="true" />
                DOI
              </dt>
              <dd className="mt-1">
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:underline"
                >
                  {article.doi}
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ArticleActions article={article} variant="hero" />
          </div>
        </header>

        {/* Right cover image */}
        <div className="hidden justify-end lg:flex">
          <div className="relative aspect-[3/4] w-56 overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-2xl">
            <Image
              src={article.image || "/covers/medical.png"}
              alt=""
              fill
              sizes="224px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)]/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block rounded-md bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
                {article.volume}
              </span>
              <p className="mt-1 font-academic text-xs font-bold text-white line-clamp-2">
                {article.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
