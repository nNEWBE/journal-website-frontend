import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function ArticleCard({ article }: { article: Article }) {
  const imageUrl = article.image || "/covers/medical.png";

  return (
    <article className="group relative flex flex-col overflow-hidden bg-white border border-slate-100 hover:border-slate-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
      {/* Cover image container linked to research paper */}
      <Link
        href={`/articles/${article.slug}`}
        className="w-full aspect-[3/4] overflow-hidden bg-slate-900 relative block cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle book spine overlay effect */}
        <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/[0.04] group-hover:bg-transparent transition-colors" />
        
        {/* Absolute category badge on image overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded bg-slate-950/80 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm select-none">
            {article.type}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Topic */}
          <span className="text-[9px] font-black text-[color:var(--color-gb-gold-dark)] uppercase tracking-wider block">
            {article.topic}
          </span>
          
          <Link href={`/articles/${article.slug}`} className="block mt-1">
            <h3 className="text-[13px] font-semibold font-academic leading-snug text-slate-800 group-hover:text-[color:var(--color-gb-blue)] transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="mt-1 text-[10px] font-medium text-slate-400 truncate">
            {article.authors.join(", ")}
          </p>
        </div>

        {/* Minimal Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[10px]">
          <span className="text-[9px] font-mono text-slate-300 truncate max-w-[100px]">
            {article.doi}
          </span>
          
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center gap-0.5 font-bold text-[color:var(--color-gb-blue)] group-hover:text-[color:var(--color-gb-gold)] transition-colors uppercase tracking-wider"
          >
            Read <ArrowRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:-rotate-45" />
          </Link>
        </div>
      </div>
    </article>
  );
}
