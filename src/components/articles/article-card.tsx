import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import type { Article } from "@/lib/data";

export function ArticleCard({
  article,
  variant = "grid",
}: {
  article: Article;
  variant?: "grid" | "editorial";
}) {
  const imageUrl = article.image || "/covers/medical.png";

  if (variant === "editorial") {
    return (
      <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_20px_48px_rgba(11,18,61,0.08)]">
        <div className="grid h-full sm:grid-cols-[172px_minmax(0,1fr)]">
          <div className="p-2.5 pr-0">
            <Link
              href={`/articles/${article.slug}`}
              className="relative block h-full min-h-[180px] overflow-hidden rounded-xl bg-slate-900 focus-ring sm:min-h-full"
            >
              <Image
                src={imageUrl}
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 160px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 inline-block rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-center text-[8px] font-extrabold uppercase tracking-[0.1em] text-white/90 backdrop-blur-xs truncate">
                {article.topic}
              </span>
            </Link>
          </div>

          <div className="flex min-w-0 flex-col p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-gb-blue-soft)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[color:var(--color-gb-blue)]">
                <FileText className="h-3 w-3" />
                {article.type}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <CalendarDays className="h-3 w-3" />
                {article.publishedAt}
              </span>
            </div>

            <Link href={`/articles/${article.slug}`} className="mt-2.5 block">
              <h2 className="font-academic text-[17px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[color:var(--color-gb-blue)]">
                {article.title}
              </h2>
            </Link>

            <p className="mt-1.5 truncate text-[11px] font-semibold text-slate-500">
              {article.authors.join(", ")}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-2">
              {article.abstract}
            </p>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-[9.5px] font-medium text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 font-semibold text-slate-500">
                  <Eye className="h-3 w-3 text-slate-400" />
                  {article.metrics.views.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 font-semibold text-slate-500">
                  <Download className="h-3 w-3 text-slate-400" />
                  {article.metrics.downloads.toLocaleString()}
                </span>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                aria-label={`Read ${article.title}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-gb-blue-soft)] px-3 py-1.5 text-[10px] font-extrabold text-[color:var(--color-gb-blue)] transition-all group-hover:bg-[color:var(--color-gb-blue)] group-hover:text-white"
              >
                <span>Read article</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-[0_10px_32px_rgba(11,18,61,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--color-gb-blue)]/30 hover:shadow-[0_18px_44px_rgba(11,18,61,0.1)]">
      <div className="relative p-1.5 pb-0">
        <Link
          href={`/articles/${article.slug}`}
          className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-slate-950 focus-ring"
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)]/85 via-[color:var(--color-gb-blue-deep)]/20 to-transparent" />
          <span className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-wider text-white/90">
            {article.topic}
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-gb-blue-soft)] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue)]">
            <FileText className="h-3 w-3" />
            {article.type}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            {article.publishedAt}
          </span>
        </div>

        <Link href={`/articles/${article.slug}`} className="mt-3 block rounded-sm focus-ring">
          <h2 className="font-academic text-[1.05rem] font-bold leading-snug text-[color:var(--color-gb-blue-deep)] transition-colors duration-300 group-hover:text-[color:var(--color-gb-blue)] line-clamp-2">
            {article.title}
          </h2>
        </Link>

        <p className="mt-2.5 line-clamp-1 text-xs font-semibold text-slate-600">
          <span className="font-normal text-slate-400">By </span>
          {article.authors.join(", ")}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-3.5">
          <span className="truncate font-mono text-[10px] font-bold text-slate-500">
            {article.doi}
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs transition-all group-hover:bg-[color:var(--color-gb-blue)] group-hover:scale-105">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
