"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { mainNav, getIsRouteActive } from "./nav-data";

export function SiteHeaderNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  return (
    <nav
      className="hidden items-center gap-1 lg:flex"
      onMouseLeave={() => setActiveTab(null)}
    >
      {mainNav.map((item, idx) => {
        const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
        const isActive = activeTab === idx;
        const isRouteActive = getIsRouteActive(pathname, item.label);
        const animName = direction === "right" ? "slideInFromRight" : "slideInFromLeft";

        return (
          <div
            key={item.label}
            className="relative py-1"
            onMouseEnter={() => {
              if (activeTab !== idx) {
                setDirection(activeTab !== null && idx > activeTab ? "right" : "left");
                setActiveTab(idx);
              }
            }}
          >
            <Link
              href={item.href}
              className={`relative inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold transition-colors ${
                isActive
                  ? "text-[color:var(--bangla-red)]"
                  : isRouteActive
                  ? "text-[color:var(--color-gb-blue)] font-black"
                  : "text-[color:var(--color-gb-blue-dark)] hover:text-[color:var(--color-gb-blue)]"
              }`}
            >
              <span className="relative py-0.5">
                <span>{item.label}</span>
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
                  className={`h-3.5 w-3.5 opacity-60 transition-transform duration-250 ${
                    isActive
                      ? "rotate-180 opacity-100 text-[color:var(--bangla-red)]"
                      : isRouteActive
                      ? "opacity-100 text-[color:var(--color-gb-blue)]"
                      : ""
                  }`}
                />
              )}
            </Link>

            {hasDropdown && (
              <div
                className={`absolute left-0 top-full pt-2 z-50 min-w-[300px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 invisible translate-y-2 scale-[0.97] pointer-events-none"
                }`}
              >
                <div className="rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(11,18,61,0.12)] overflow-hidden">
                  <div className="px-4 pt-3 pb-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1f2f82]/50">
                      {item.label}
                    </p>
                  </div>

                  <div key={activeTab} className="grid gap-0.5 px-2 pb-2">
                    {item.dropdown!.map((sub, idxSub) => {
                      const SubIcon = sub.icon;
                      const isSubActive =
                        pathname === sub.href ||
                        (sub.href !== "/" && pathname.startsWith(sub.href));

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          style={{
                            animation: isActive
                              ? `${animName} 380ms cubic-bezier(0.16,1,0.3,1) both`
                              : "none",
                            animationDelay: isActive ? `${idxSub * 50}ms` : "0ms",
                          }}
                          className={`group/sub flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer transition-all duration-150 ${
                            isSubActive
                              ? "bg-[#1f2f82]/6 font-bold text-[#1f2f82]"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                              isSubActive
                                ? "bg-[#1f2f82] text-white shadow-xs"
                                : "bg-slate-100 text-slate-500 group-hover/sub:bg-[#1f2f82] group-hover/sub:text-white"
                            }`}
                          >
                            <SubIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p
                                className={`text-[12px] font-semibold transition-colors duration-150 ${
                                  isSubActive
                                    ? "text-[#1f2f82] font-extrabold"
                                    : "text-slate-700 group-hover/sub:text-slate-900"
                                }`}
                              >
                                {sub.label}
                              </p>
                              {isSubActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1f2f82] shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] leading-4 text-slate-400 font-medium">
                              {sub.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {item.footerHref && (
                    <div className="border-t border-slate-100 px-4 py-2">
                      <Link
                        href={item.footerHref}
                        className="text-[11px] font-semibold text-[#1f2f82]/70 hover:text-[#1f2f82] transition-colors duration-150"
                      >
                        {item.footerLabel}
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
