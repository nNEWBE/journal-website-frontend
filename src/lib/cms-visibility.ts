"use client";

import { useState, useEffect, useCallback } from "react";
import { contentApi, type PageContentDTO } from "@/lib/api";

export const CMS_VISIBILITY_EVENT = "cms-section-visibility-change";
export const CMS_STORAGE_KEY = "gbj_cms_section_visibility_sync";
export const CMS_ORDER_EVENT = "cms-section-order-change";
export const CMS_ORDER_STORAGE_KEY = "gbj_cms_section_order_sync";

export interface VisibilitySyncPayload {
  pageKey: string;
  sectionKey: string;
  published: boolean;
  timestamp: number;
}

/**
 * Broadcasts a section visibility update to all listening components in the current window
 * and across other browser tabs/windows via localStorage.
 */
export function broadcastSectionVisibility(
  pageKey: string,
  sectionKey: string,
  published: boolean
) {
  if (typeof window === "undefined") return;
  const payload: VisibilitySyncPayload = {
    pageKey: pageKey.toLowerCase(),
    sectionKey: sectionKey.toLowerCase(),
    published,
    timestamp: Date.now(),
  };

  // Same-window broadcast
  window.dispatchEvent(new CustomEvent(CMS_VISIBILITY_EVENT, { detail: payload }));

  // Cross-tab/window broadcast
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

/**
 * Broadcasts a section reordering update across window and tabs.
 */
export function broadcastSectionOrderChange(pageKey: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CMS_ORDER_EVENT, {
      detail: { pageKey: pageKey.toLowerCase(), timestamp: Date.now() },
    })
  );
  try {
    localStorage.setItem(CMS_ORDER_STORAGE_KEY, Date.now().toString());
  } catch {}
}

/**
 * React hook consumed by the homepage to track published sections in realtime.
 * If an admin turns off a section, it immediately returns false and hides it from the UI.
 */
export const CMS_HOME_CACHE_KEY = "gbj_cms_home_sections_cache";

export const KNOWN_HOME_SECTION_KEYS = [
  "hero-main",
  "featured-research",
  "latest-research",
  "current-issue",
  "most-read",
  "explore-topics",
  "topics",
  "featured-journals",
  "call-for-papers",
  "calls-for-papers",
  "research-community",
  "home-faq",
  "faq",
  "journal-stats",
  "scope-tracks",
];

export function syncKeyAliases(key: string, val: boolean, map: Record<string, boolean>) {
  const k = key.toLowerCase();
  map[k] = val;
  if (k === "hero-main" || k === "featured-research") {
    map["hero-main"] = val;
    map["featured-research"] = val;
  }
  if (k === "explore-topics" || k === "topics" || k === "scope-tracks") {
    map["explore-topics"] = val;
    map["topics"] = val;
    map["scope-tracks"] = val;
  }
  if (k === "home-faq" || k === "faq") {
    map["home-faq"] = val;
    map["faq"] = val;
  }
  if (k === "call-for-papers" || k === "calls-for-papers") {
    map["call-for-papers"] = val;
    map["calls-for-papers"] = val;
  }
}

export function sortHomeSections(data: PageContentDTO[]): PageContentDTO[] {
  return [...data].sort(
    (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
  );
}

export function buildPublishedMap(sections: PageContentDTO[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  KNOWN_HOME_SECTION_KEYS.forEach((k) => {
    map[k] = false;
  });
  sections.forEach((s) => {
    if (s.sectionKey) {
      syncKeyAliases(s.sectionKey.toLowerCase(), s.published !== false, map);
    }
  });
  return map;
}

/**
 * React hook consumed by the homepage to track published sections in realtime.
 * Accepts initialSections from SSR for immediate 0-latency display order on refresh.
 */
export function useHomeSectionVisibility(initialSections?: PageContentDTO[]) {
  const getInitialSections = (): PageContentDTO[] => {
    if (initialSections && initialSections.length > 0) {
      return sortHomeSections(initialSections);
    }
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CMS_HOME_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sortHomeSections(parsed);
          }
        }
      } catch {}
    }
    return [];
  };

  const [sections, setSections] = useState<PageContentDTO[]>(() => getInitialSections());
  const [loaded, setLoaded] = useState<boolean>(() => {
    if (initialSections && initialSections.length > 0) return true;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CMS_HOME_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return true;
        }
      } catch {}
    }
    return false;
  });

  const [publishedMap, setPublishedMap] = useState<Record<string, boolean>>(() => {
    const start = getInitialSections();
    if (start.length > 0) {
      return buildPublishedMap(start);
    }
    const defaultMap: Record<string, boolean> = {};
    KNOWN_HOME_SECTION_KEYS.forEach((k) => {
      defaultMap[k] = true;
    });
    return defaultMap;
  });

  // Keep state in sync if initialSections prop updates
  useEffect(() => {
    if (initialSections && initialSections.length > 0) {
      const sorted = sortHomeSections(initialSections);
      setSections(sorted);
      setLoaded(true);
      setPublishedMap(buildPublishedMap(sorted));
      try {
        localStorage.setItem(CMS_HOME_CACHE_KEY, JSON.stringify(sorted));
      } catch {}
    }
  }, [initialSections]);

  const fetchPublished = useCallback(async () => {
    try {
      const data = await contentApi.getPublished("home");
      if (Array.isArray(data)) {
        const sorted = sortHomeSections(data);
        setSections(sorted);
        if (data.length > 0) {
          setPublishedMap(buildPublishedMap(sorted));
          try {
            localStorage.setItem(CMS_HOME_CACHE_KEY, JSON.stringify(sorted));
          } catch {}
        }
      }
    } catch {
      // Fallback: keep defaults
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchPublished();

    // In-window realtime listener for visibility
    const handleCustomEvent = (e: Event) => {
      const customEvt = e as CustomEvent<VisibilitySyncPayload>;
      if (customEvt.detail && customEvt.detail.pageKey === "home") {
        const { sectionKey, published } = customEvt.detail;
        setPublishedMap((prev) => {
          const next = { ...prev };
          syncKeyAliases(sectionKey.toLowerCase(), published, next);
          return next;
        });
      }
    };

    // Cross-tab realtime listener for visibility
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === CMS_STORAGE_KEY && e.newValue) {
        try {
          const payload: VisibilitySyncPayload = JSON.parse(e.newValue);
          if (payload.pageKey === "home") {
            const { sectionKey, published } = payload;
            setPublishedMap((prev) => {
              const next = { ...prev };
              syncKeyAliases(sectionKey.toLowerCase(), published, next);
              return next;
            });
          }
        } catch {}
      } else if (e.key === CMS_ORDER_STORAGE_KEY) {
        fetchPublished();
      }
    };

    // In-window realtime listener for section order
    const handleOrderEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ pageKey: string; timestamp: number }>;
      if (customEvt.detail && customEvt.detail.pageKey === "home") {
        fetchPublished();
      }
    };

    window.addEventListener(CMS_VISIBILITY_EVENT, handleCustomEvent);
    window.addEventListener(CMS_ORDER_EVENT, handleOrderEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(CMS_VISIBILITY_EVENT, handleCustomEvent);
      window.removeEventListener(CMS_ORDER_EVENT, handleOrderEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [fetchPublished]);

  const isSectionVisible = useCallback(
    (sectionKey: string): boolean => {
      const k = sectionKey.toLowerCase();
      if (!loaded) return true; // Avoid flickering before initial sync
      if (k in publishedMap) {
        return !!publishedMap[k];
      }
      return false;
    },
    [loaded, publishedMap]
  );

  return { isSectionVisible, sections, loaded, refetch: fetchPublished };
}
