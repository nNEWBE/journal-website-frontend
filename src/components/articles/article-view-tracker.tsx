"use client";

import { useEffect } from "react";
import { articlesApi } from "@/lib/api";

// A reader counts as one view per article per 30 minutes, so refreshes and
// React StrictMode double-mounts don't inflate the count.
const VIEW_WINDOW_MS = 30 * 60 * 1000;
const STORAGE_PREFIX = "gbj_article_viewed:";
const recentlyTracked = new Map<string, number>();

function wasRecentlyViewed(slug: string, now: number): boolean {
  const inMemory = recentlyTracked.get(slug) || 0;
  if (now - inMemory < VIEW_WINDOW_MS) return true;
  try {
    const stored = Number(localStorage.getItem(STORAGE_PREFIX + slug) || 0);
    return now - stored < VIEW_WINDOW_MS;
  } catch {
    return false;
  }
}

function markViewed(slug: string, now: number) {
  recentlyTracked.set(slug, now);
  try {
    localStorage.setItem(STORAGE_PREFIX + slug, String(now));
  } catch {}
}

export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;

    const now = Date.now();
    if (wasRecentlyViewed(slug, now)) return;
    markViewed(slug, now);

    articlesApi.trackView(slug).catch((err) => {
      // Allow a retry on the next visit if the request failed.
      recentlyTracked.delete(slug);
      try {
        localStorage.removeItem(STORAGE_PREFIX + slug);
      } catch {}
      console.warn("View tracking failed:", err);
    });
  }, [slug]);

  return null;
}
