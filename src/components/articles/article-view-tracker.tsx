"use client";

import { useEffect } from "react";
import { articlesApi } from "@/lib/api";

export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    try {
      const storageKey = `gbj_viewed_art_${slug}`;
      if (!sessionStorage.getItem(storageKey)) {
        articlesApi.trackView(slug).then(() => {
          sessionStorage.setItem(storageKey, Date.now().toString());
        }).catch((err) => {
          console.warn("View tracking failed:", err);
        });
      }
    } catch {
      // In case sessionStorage is blocked in private browsing
      articlesApi.trackView(slug).catch(() => {});
    }
  }, [slug]);

  return null;
}
