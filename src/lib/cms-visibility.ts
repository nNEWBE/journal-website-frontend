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
export function useHomeSectionVisibility() {
  const [publishedMap, setPublishedMap] = useState<Record<string, boolean>>({
    "hero-main": true,
    "featured-research": true,
    "latest-research": true,
    "current-issue": true,
    "most-read": true,
    "explore-topics": true,
    "topics": true,
    "featured-journals": true,
    "call-for-papers": true,
    "research-community": true,
    "home-faq": true,
    "faq": true,
    "journal-stats": true,
    "scope-tracks": true,
  });

  const [sections, setSections] = useState<PageContentDTO[]>([]);
  const [loaded, setLoaded] = useState(false);

  const syncKeyAliases = (key: string, val: boolean, map: Record<string, boolean>) => {
    map[key] = val;
    if (key === "hero-main") map["featured-research"] = val;
    if (key === "featured-research") map["hero-main"] = val;
    if (key === "explore-topics") map["topics"] = val;
    if (key === "topics") map["explore-topics"] = val;
    if (key === "home-faq") map["faq"] = val;
    if (key === "faq") map["home-faq"] = val;
    if (key === "call-for-papers") map["calls-for-papers"] = val;
  };

  const fetchPublished = useCallback(async () => {
    try {
      const data = await contentApi.getPublished("home");
      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
        );
        setSections(sorted);
        if (data.length > 0) {
          const newMap: Record<string, boolean> = {};
          // Mark all known keys as false unless they appear in the published list
          [
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
          ].forEach((k) => {
            newMap[k] = false;
          });

          data.forEach((s) => {
            if (s.sectionKey) {
              const k = s.sectionKey.toLowerCase();
              syncKeyAliases(k, s.published !== false, newMap);
            }
          });

          setPublishedMap(newMap);
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
