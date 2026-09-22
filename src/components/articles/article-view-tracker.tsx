"use client";

import { useEffect } from "react";
import { articlesApi } from "@/lib/api";

export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    articlesApi.trackView(slug).catch((err) => {
      console.warn("View tracking failed:", err);
    });
  }, [slug]);

  return null;
}
