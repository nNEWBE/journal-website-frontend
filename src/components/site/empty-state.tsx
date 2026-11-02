import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "./button-link";

/** Shown when a list, search or archive has nothing to display. */
export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  children,
  titleAs: Title = "h3",
}: {
  icon?: LucideIcon;
  title: string;
  text?: string;
  action?: { label: string; href: string };
  /** Custom action (e.g. a button that clears filters). */
  children?: ReactNode;
  /** Heading level of the title; use "h1" when the empty state is the whole page. */
  titleAs?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      {Icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-slate-50 border border-slate-200 text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <Title className="font-academic text-xl font-medium text-slate-900">{title}</Title>
      {text && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{text}</p>}
      {(action?.label || children) && (
        <div className="mt-6 flex justify-center">
          {children ?? (action && <ButtonLink href={action.href}>{action.label}</ButtonLink>)}
        </div>
      )}
    </div>
  );
}
