"use client";

import React, { createContext, useContext } from "react";
import type { PageContentDTO } from "@/lib/api";

const HomeSectionsContext = createContext<PageContentDTO[]>([]);

export function HomeSectionsProvider({
  sections,
  children,
}: {
  sections: PageContentDTO[];
  children: React.ReactNode;
}) {
  return (
    <HomeSectionsContext.Provider value={sections}>
      {children}
    </HomeSectionsContext.Provider>
  );
}

export function useHomeSections(): PageContentDTO[] {
  return useContext(HomeSectionsContext);
}

export function useHomeSection(sectionKey: string): PageContentDTO | undefined {
  const sections = useContext(HomeSectionsContext);
  const k = sectionKey.toLowerCase();
  return sections.find((s) => {
    const sk = s.sectionKey?.toLowerCase();
    if (sk === k) return true;
    if (k === "hero-main" && sk === "featured-research") return true;
    if (k === "featured-research" && sk === "hero-main") return true;
    if (k === "explore-topics" && (sk === "topics" || sk === "scope-tracks")) return true;
    if (k === "home-faq" && sk === "faq") return true;
    if (k === "call-for-papers" && sk === "calls-for-papers") return true;
    return false;
  });
}
