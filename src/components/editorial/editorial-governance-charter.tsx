import Link from "next/link";
import { ArrowUpRight, BookOpen, Scale, ShieldCheck, Users } from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import type { ResolvedSection } from "@/lib/cms/page-content";
import type defaults from "@/lib/cms/defaults/editorial-board.json";

type GovernanceMeta = (typeof defaults)["sections"]["governance"]["meta"];

const PILLAR_FALLBACK_ICONS = [ShieldCheck, Scale, Users, BookOpen];

/** "Editorial Governance Charter" band of /editorial-board (CMS section "governance"). */
export function EditorialGovernanceCharter({
  section,
}: {
  section: ResolvedSection<GovernanceMeta>;
}) {
  const pillars = Array.isArray(section.meta.pillars) ? section.meta.pillars : [];
  const link = section.meta.link;

  return (
    <section
      aria-label="Editorial Governance Charter"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              {section.subtitle}
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {section.title}
            </h2>
          </div>
          {link?.label && (
            <Link
              href={link.href || "/policies"}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
            >
              <span>{link.label}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {pillars.map((pillar, idx) => {
            const Icon = cmsIcon(pillar.icon, PILLAR_FALLBACK_ICONS[idx % PILLAR_FALLBACK_ICONS.length]);
            return (
              <div
                key={`${pillar.title}-${idx}`}
                className="bg-slate-50/60 border border-slate-200/90 p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                    {pillar.subtitle}
                  </p>
                  <h3 className="font-academic text-lg font-medium text-slate-950 mt-1">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
