import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One horizontal band of a public page: standard vertical rhythm, divider and container.
 * Alternate `tone` between "white" and "tint" down the page.
 */
export function PageSection({
  children,
  tone = "white",
  id,
  ariaLabel,
  bordered = true,
  className,
  containerClassName,
}: {
  children: ReactNode;
  tone?: "white" | "tint";
  id?: string;
  ariaLabel?: string;
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "py-14 sm:py-20",
        tone === "tint" ? "bg-gb-tint" : "bg-white",
        bordered && "border-b border-slate-200/80",
        id && "scroll-mt-24",
        className
      )}
    >
      <div className={cn("container-x", containerClassName)}>{children}</div>
    </section>
  );
}
