import React from "react";
import { LucideIcon, BookOpen, ShieldCheck, FileCheck2, Scale, Globe2, CheckCircle2 } from "lucide-react";

export type BentoSubItem = {
  label: string;
  val: string;
  icon: LucideIcon;
};

export type PolicyFrameworkCardProps = {
  eyebrow?: string;
  title?: string;
  icon?: LucideIcon;
  featured?: {
    tag: string;
    title: string;
    badge?: string;
    icon?: LucideIcon;
  };
  items?: BentoSubItem[];
  className?: string;
};

const defaultFeatured = {
  tag: "Peer Review",
  title: "Double Blind Evaluation",
  badge: "Featured",
  icon: ShieldCheck,
};

const defaultItems: BentoSubItem[] = [
  {
    label: "Similarity",
    val: "Pre-Assignment",
    icon: FileCheck2,
  },
  {
    label: "Copyright",
    val: "Author Retained",
    icon: Scale,
  },
  {
    label: "Access Model",
    val: "Open Access",
    icon: Globe2,
  },
  {
    label: "Ethics Basis",
    val: "COPE Aligned",
    icon: CheckCircle2,
  },
];

export function PolicyFrameworkCard({
  eyebrow = "Policy Framework",
  title = "Responsible Publication",
  icon: Icon = BookOpen,
  featured = defaultFeatured,
  items = defaultItems,
  className = "",
}: PolicyFrameworkCardProps) {
  const FeaturedIcon = featured.icon || ShieldCheck;

  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/[0.06] p-4 text-white shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-3 mb-3">
        <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[8.5px] font-black uppercase tracking-[0.16em] text-amber-300">
            {eyebrow}
          </p>
          <h2 className="font-academic text-xs font-bold text-white">
            {title}
          </h2>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="space-y-2">
        {/* Featured Top Card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-amber-300">
              <FeaturedIcon className="h-3 w-3" />
              {featured.tag}
            </span>
            {featured.badge && (
              <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[8.5px] font-bold text-amber-300 border border-amber-400/20">
                {featured.badge}
              </span>
            )}
          </div>
          <div className="mt-1 font-academic text-sm font-bold text-white">
            {featured.title}
          </div>
        </div>

        {/* 2x2 Sub-Grid */}
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-1 text-[9px] font-semibold text-white/45">
                  <ItemIcon className="h-2.5 w-2.5 text-amber-300" />
                  <span>{item.label}</span>
                </div>
                <div className="mt-0.5 text-[10.5px] font-bold text-white leading-snug">
                  {item.val}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
