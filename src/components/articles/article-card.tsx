import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Download,
  Eye,
  FileText,
  ShieldCheck,
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
      <article className="bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-all group">
        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-5 items-start">
          {/* Article Image Container */}
          <Link
            href={`/articles/${article.slug}`}
            className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden bg-slate-950 border border-slate-200/80 shrink-0 block"
          >
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 639px) 100vw, 160px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 inline-block bg-slate-900/90 text-white px-2 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider truncate">
              {article.topic}
            </span>
          </Link>

          {/* Details */}
          <div className="flex flex-col justify-between h-full min-w-0">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1e40af] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider border border-blue-100">
                  <FileText className="h-3 w-3" />
                  {article.type}
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-slate-500">
                  <CalendarDays className="h-3 w-3 text-slate-400" />
                  {article.publishedAt}
                </span>
              </div>

              <Link href={`/articles/${article.slug}`} className="mt-1.5 block">
                <h2 className="font-academic text-base sm:text-[17px] font-medium leading-snug text-slate-950 group-hover:text-[#1e40af] transition-colors line-clamp-2">
                  {article.title}
                </h2>
              </Link>

              <p className="mt-1 text-xs font-semibold text-slate-600 truncate">
                {article.authors.join(", ")}
              </p>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                {article.abstract}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3 text-slate-400" />
                  {article.metrics.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-slate-400" />
                  {article.metrics.downloads.toLocaleString()} pdfs
                </span>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                aria-label={`Read ${article.title}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline"
              >
                <span>Read Full Article</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white border border-slate-200/90 p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group">
      <div>
        <Link
          href={`/articles/${article.slug}`}
          className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border border-slate-200/80 block mb-3"
        >
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider text-white bg-slate-900/90 px-2 py-0.5">
            {article.topic}
          </span>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 bg-blue-50 text-[#1e40af] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-blue-100">
            {article.type}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {article.publishedAt}
          </span>
        </div>

        <Link href={`/articles/${article.slug}`} className="mt-1.5 block">
          <h2 className="font-academic text-[15px] font-medium leading-snug text-slate-950 group-hover:text-[#1e40af] transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>

        <p className="mt-1 text-xs font-medium text-slate-600 line-clamp-1">
          {article.authors.join(", ")}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-mono text-[9.5px] text-slate-500 truncate max-w-[140px]">
          {article.doi}
        </span>
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e40af] hover:underline"
        >
          <span>View</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
