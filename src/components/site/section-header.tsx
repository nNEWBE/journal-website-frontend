import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Eyebrow + section title (+ optional intro and "view all" style link) used at the
 * top of every band on the public site.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
  aside,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: { label: string; href: string };
  /** Free content on the right instead of a link (e.g. a count or a toggle). */
  aside?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  const right =
    aside ??
    (action?.label ? (
      <Link
        href={action.href || "#"}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gb-accent hover:underline group shrink-0"
      >
        <span>{action.label}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    ) : null);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 sm:pb-10",
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gb-accent">{eyebrow}</p>
        )}
        <Heading
          className={cn(
            "font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium leading-[1.15] tracking-[-0.02em] text-slate-950",
            eyebrow && "mt-2"
          )}
        >
          {title}
        </Heading>
        {intro && <div className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">{intro}</div>}
      </div>
      {right}
    </div>
  );
}
