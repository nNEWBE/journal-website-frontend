import React from "react";
import { LucideIcon } from "lucide-react";

export type CommitmentGridItem = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type CommitmentGridSectionProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  items: CommitmentGridItem[];
  columns?: 2 | 3 | 4;
  footer?: React.ReactNode;
  bgClass?: string;
  className?: string;
};

export function CommitmentGridSection({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  footer,
  bgClass = "bg-white",
  className = "",
}: CommitmentGridSectionProps) {
  const colGridClasses = {
    2: "sm:grid-cols-2 lg:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={`${bgClass} py-12 md:py-16 ${className}`}>
      <div className="container-x">
        {/* Header */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gb-gold-dark)] border border-amber-400/20">
              {eyebrow}
            </span>
            <h2 className="mt-3 max-w-3xl font-academic text-3xl font-bold leading-tight tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl">
              {title}
            </h2>
          </div>
          {description && (
            <p className="max-w-xl text-xs leading-relaxed text-slate-600 md:text-sm lg:justify-self-end">
              {description}
            </p>
          )}
        </div>

        {/* Bordered Grid */}
        <div
          className={`mt-9 grid border-l border-t border-slate-200/80 ${colGridClasses[columns]}`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group min-h-[200px] border-b border-r border-slate-200/80 bg-white p-6 transition-colors hover:bg-slate-50/70 md:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-[color:var(--color-gb-blue)] transition-colors group-hover:bg-[color:var(--color-gb-blue-soft)]">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] font-extrabold text-amber-600">
                    {item.number}
                  </span>
                </div>
                <h3 className="mt-5 font-academic text-base font-bold leading-snug text-[color:var(--color-gb-blue-deep)]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
