import { CalendarDays, GraduationCap, BookOpen } from "lucide-react";
import { GbJournalLogo } from "@/components/gb-logo";

export function IssueCover({
  volume,
  issue,
  month,
  theme,
}: {
  volume: string;
  issue: string;
  month: string;
  theme: string;
}) {
  return (
    <div className="relative min-h-[380px] overflow-hidden rounded-xl bg-[color:var(--color-gb-blue-deep)] text-white shadow-2xl shadow-blue-950/30">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[color:var(--color-gb-blue)] via-[color:var(--color-gb-gold)] to-[color:var(--bangla-red)] z-10" />

      {/* Background pattern */}
      <div className="absolute inset-0 hero-pattern opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-gb-blue-deep)] via-[color:var(--color-gb-blue-dark)]/90 to-[color:var(--color-gb-blue-deep)]" />

      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border-[24px] border-white/[0.04]" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full border-[16px] border-[color:var(--color-gb-gold)]/[0.06]" />

      {/* Decorative icon */}
      <div className="absolute bottom-7 right-7 grid h-20 w-20 place-items-center rounded-full bg-[color:var(--bangla-red)]/80 shadow-lg shadow-red-900/20">
        <BookOpen className="h-9 w-9 text-white/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-between gap-8 p-7">
        <div>
          <div className="flex items-center gap-3 text-xs font-bold text-white/60 [&_p]:text-white">
            <GbJournalLogo compact />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50">GB Journal of Research</span>
            </div>
          </div>
          <h2 className="font-academic mt-7 max-w-sm text-3xl font-bold leading-tight text-white drop-shadow-md">
            {theme}
          </h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <CalendarDays className="h-4 w-4 text-[color:var(--color-gb-gold)]" />
            {month}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/50 font-mono">
            {volume} · {issue}
          </div>
        </div>
      </div>
    </div>
  );
}
