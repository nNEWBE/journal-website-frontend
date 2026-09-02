"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useNavigation, getNavIcon, getIsRouteActive } from "./nav-data";

export function SiteHeaderNav() {
  const pathname = usePathname();
  const { navItems } = useNavigation();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const visibleItems = navItems.filter((item) => item.enabled !== false);

  return (
    <nav
      className="hidden items-center gap-1.5 lg:flex"
      onMouseLeave={() => setActiveTab(null)}
    >
      {visibleItems.map((item, idx) => {
        const visibleDropdown = (item.dropdown || []).filter(
          (sub) => sub.enabled !== false
        );
        const hasDropdown = visibleDropdown.length > 0;
        const isActive = activeTab === idx;
        const isRouteActive = getIsRouteActive(pathname, item);
        const animName = direction === "right" ? "slideInFromRight" : "slideInFromLeft";

        return (
          <div
            key={item.id || item.clientId || item.label}
            className="relative py-1.5"
            onMouseEnter={() => {
              if (activeTab !== idx) {
                setDirection(activeTab !== null && idx > activeTab ? "right" : "left");
                setActiveTab(idx);
              }
            }}
          >
            <Link
              href={item.href}
              target={item.openInNewTab ? "_blank" : undefined}
              rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-bold tracking-tight transition-colors cursor-pointer ${
                isActive
                  ? "text-[color:var(--bangla-red)]"
                  : isRouteActive
                  ? "text-[color:var(--color-gb-blue)] font-extrabold"
                  : "text-slate-800 hover:text-[color:var(--color-gb-blue)]"
              }`}
            >
              <span className="relative py-0.5">
                <span>{item.label}</span>
                {/* Wavy active underline animation preserved */}
                <span
                  className={`absolute inset-x-0 -bottom-1 h-[6px] transition-all duration-300 pointer-events-none animate-wave-flow ${
                    isActive || isRouteActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-[2px]"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 6' fill='none' stroke='${
                      isActive ? "%23e11d48" : "%231f2f82"
                    }' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M0 3Q5 0 10 3T20 3'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "20px 6px",
                  }}
                />
              </span>

              {hasDropdown && (
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-250 ${
                    isActive
                      ? "rotate-180 text-[color:var(--bangla-red)] opacity-100"
                      : isRouteActive
                      ? "text-[color:var(--color-gb-blue)] opacity-90"
                      : "text-slate-400 opacity-75"
                  }`}
                />
              )}
            </Link>

            {hasDropdown && (
              <div
                className={`absolute left-0 top-full pt-2 z-50 min-w-[340px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 invisible translate-y-2 scale-[0.98] pointer-events-none"
                }`}
              >
                {/* Dropdown Container: Zero-radius, crisp academic border & top accent line */}
                <div className="bg-white border border-slate-300/90 shadow-[0_16px_40px_rgba(11,18,61,0.14)] overflow-hidden">
                  {/* Top Navy Accent Bar */}
                  <div className="h-[2.5px] w-full bg-[#0b1b3d]" />

                  {/* Header / Category Kicker */}
                  <div className="px-4 pt-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                      {item.dropdownHeader || item.label}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      GB Journal
                    </span>
                  </div>

                  {/* Sub-items List with staggered slide animation */}
                  <div key={activeTab} className="p-1.5 flex flex-col gap-1">
                    {visibleDropdown.map((sub, idxSub) => {
                      const SubIcon = getNavIcon(sub.iconName);
                      const isSubActive =
                        pathname === sub.href ||
                        (sub.href !== "/" && pathname.startsWith(sub.href));

                      return (
                        <Link
                          key={sub.id || sub.clientId || sub.href + sub.label}
                          href={sub.href}
                          style={{
                            animation: isActive
                              ? `${animName} 340ms cubic-bezier(0.16,1,0.3,1) both`
                              : "none",
                            animationDelay: isActive ? `${idxSub * 40}ms` : "0ms",
                          }}
                          className={`group/sub flex items-start gap-3 p-3 transition-all duration-150 cursor-pointer border-l-3 ${
                            isSubActive
                              ? "bg-blue-50/70 border-[#1e40af]"
                              : "border-transparent hover:bg-slate-50/90 hover:border-slate-400"
                          }`}
                        >
                          {/* Square Icon Container */}
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-150 mt-0.5 ${
                              isSubActive
                                ? "bg-[#0b1b3d] text-white border-[#0b1b3d] shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 group-hover/sub:bg-[#0b1b3d] group-hover/sub:text-white group-hover/sub:border-[#0b1b3d]"
                            }`}
                          >
                            <SubIcon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-[13px] font-bold tracking-tight transition-colors duration-150 ${
                                isSubActive
                                  ? "text-[#0b1b3d]"
                                  : "text-slate-900 group-hover/sub:text-[#1e40af]"
                              }`}
                            >
                              {sub.label}
                            </p>
                            {sub.description && (
                              <p className="mt-0.5 text-[11px] leading-snug text-slate-500 font-normal">
                                {sub.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer Action Link */}
                  {item.footerHref && (
                    <div className="border-t border-slate-200/80 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between">
                      <Link
                        href={item.footerHref}
                        className="text-[11.5px] font-bold text-[#1e40af] hover:underline inline-flex items-center gap-1.5 group/foot"
                      >
                        <span>{item.footerLabel || "View More"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/foot:translate-x-0.5 group-hover/foot:-translate-y-0.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
