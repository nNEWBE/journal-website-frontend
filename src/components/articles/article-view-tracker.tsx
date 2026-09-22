"use client";

import { useEffect } from "react";
import { articlesApi } from "@/lib/api";

// Prevent duplicate execution from React StrictMode double-mounting
const recentlyTracked = new Map<string, number>();

export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;

    const now = Date.now();
    const lastTracked = recentlyTracked.get(slug) || 0;
    if (now - lastTracked < 3000) {
      return;
    }
    recentlyTracked.set(slug, now);

    articlesApi.trackView(slug).catch((err) => {
      console.warn("View tracking failed:", err);
    });
  }, [slug]);

  return null;
}
