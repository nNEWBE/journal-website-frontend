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
    <nav aria-label="Article sections" className="space-y-1">
      <ol className="space-y-1">
        {items.map(({ heading, id, num }) => {
          const isActive = activeId === id;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={`group flex items-center justify-between text-xs py-2 pr-2.5 transition-all duration-150 border-l-2 ${
                  isActive
                    ? "bg-blue-50/90 text-[#1f2f82] font-bold border-[#1f2f82] pl-3 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border-transparent pl-3"
                }`}
              >
                <span className="truncate pr-2">{heading}</span>
                <span
                  className={`font-mono text-[10px] font-bold shrink-0 transition-colors ${
                    isActive
                      ? "text-[#1f2f82] bg-blue-100/70 px-1.5 py-0.5"
                      : "text-slate-400 group-hover:text-slate-600 bg-slate-100/60 px-1.5 py-0.5"
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
