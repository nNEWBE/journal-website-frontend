import { cn } from "@/lib/utils";

export function GbJournalLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const size = compact ? 42 : 58;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-[6px] bg-white shadow-sm ring-1 ring-[color:var(--color-gb-border)]",
          compact ? "h-[42px] w-[42px]" : "h-[58px] w-[58px]",
        )}
      >
        <img
          src="/gb-logo-official.png"
          alt="Gono Bishwabidyalay emblem"
          className="h-full w-full object-contain p-0.5"
        />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-ui text-[1.05rem] font-black text-[color:var(--color-gb-blue-dark)]">
            GB Journal
          </p>
          <p className="font-bangla mt-1 text-sm font-extrabold text-[color:var(--color-gb-red)]">
            গণ বিশ্ববিদ্যালয়
          </p>
        </div>
      )}
    </div>
  );
}
