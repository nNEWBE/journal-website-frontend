import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EditorialPageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  supporting,
  aside,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  supporting?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white">
      <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.13] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

      <div
        className={`container-x relative grid gap-7 py-7 md:py-9 ${
          aside
            ? "lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center"
            : ""
        }`}
      >
        <div className={aside ? "max-w-2xl" : "mx-auto max-w-3xl text-center"}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            <Icon className="h-3.5 w-3.5 text-amber-300" />
            {eyebrow}
          </span>

          <h1 className="mt-3.5 font-academic text-3xl font-bold leading-tight tracking-[-0.025em] text-white md:text-4xl">
            {title}
          </h1>

          <div
            className={`mt-3 text-xs leading-relaxed text-white/60 md:text-sm ${
              aside ? "max-w-xl" : "mx-auto max-w-2xl"
            }`}
          >
            {description}
          </div>

          {actions && (
            <div
              className={`mt-5 flex flex-wrap gap-2.5 ${
                aside ? "" : "justify-center"
              }`}
            >
              {actions}
            </div>
          )}

          {supporting && (
            <div
              className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[10px] font-semibold text-white/60 [&_svg]:text-amber-300 ${
                aside ? "" : "justify-center"
              }`}
            >
              {supporting}
            </div>
          )}
        </div>

        {aside && (
          <div className="w-full">
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
