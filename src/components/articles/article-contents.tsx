"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/data";

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ArticleContents({ sections }: { sections: Article["sections"] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const allIds = [
      ...sections.map((s) => sectionId(s.heading)),
      "references",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0,
      }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      allIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const items = [
    ...sections.map((s, index) => ({
      heading: s.heading,
      id: sectionId(s.heading),
      num: String(index + 1).padStart(2, "0"),
    })),
    {
      heading: "References",
      id: "references",
      num: String(sections.length + 1).padStart(2, "0"),
    },
  ];

  return (
    <nav aria-label="Article sections" className="p-3.5 md:p-4">
      <ol className="space-y-1.5">
        {items.map(({ heading, id, num }) => {
          const isActive = activeId === id;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={`group relative flex min-h-9 items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-200 ${
                  isActive
                    ? "bg-[color:var(--color-gb-blue-soft)] font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-2xs pl-4"
                    : "font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-1.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-[color:var(--color-gb-blue)]"
                    aria-hidden="true"
                  />
                )}
                <span className="truncate">{heading}</span>
                <span
                  className={`ml-2 shrink-0 font-mono text-[10px] font-extrabold transition-colors ${
                    isActive
                      ? "text-[color:var(--color-gb-gold-dark)]"
                      : "text-slate-300 group-hover:text-slate-500"
                  }`}
                >
                  {num}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
