import { FileText, type LucideIcon } from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import { cn } from "@/lib/utils";

/** One numbered stage of a process. `icon` is a lucide icon name from the CMS. */
export interface StepItem {
  icon?: string;
  /** Stage number shown on the card; defaults to the position ("01", "02"…). */
  stage?: string;
  title: string;
  /** Short timing tag, e.g. "Day 0". */
  timeline?: string;
  text?: string;
}

const COLUMN_CLASSES: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/**
 * A numbered, ordered row of process stages (review lifecycle, submission pathway…).
 * Step titles are h3 — place the list under a band's SectionHeader (h2).
 */
export function StepList({
  steps,
  fallbackIcons = [FileText],
  className,
}: {
  steps: StepItem[];
  /** Icons used, by position, when a step's icon name is empty or unknown. */
  fallbackIcons?: LucideIcon[];
  className?: string;
}) {
  if (!Array.isArray(steps) || steps.length === 0) return null;
  const columns = COLUMN_CLASSES[Math.min(steps.length, 5)] ?? "lg:grid-cols-5";

  return (
    <ol className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", columns, className)}>
      {steps.map((step, idx) => {
        const Icon = cmsIcon(step.icon, fallbackIcons[idx % fallbackIcons.length] ?? FileText);
        const stage = step.stage || String(idx + 1).padStart(2, "0");
        return (
          <li key={`${stage}-${step.title}`} className="bg-white border border-slate-200/90 p-5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="font-mono text-base font-bold text-gb-accent">{stage}</span>
              {step.timeline && (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5">{step.timeline}</span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-slate-900">
              <Icon className="h-4 w-4 shrink-0 text-gb-accent" />
              <h3 className="font-ui text-sm font-bold leading-tight">{step.title}</h3>
            </div>
            {step.text && <p className="mt-3 text-xs leading-relaxed text-slate-600">{step.text}</p>}
          </li>
        );
      })}
    </ol>
  );
}
