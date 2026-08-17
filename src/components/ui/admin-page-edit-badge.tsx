"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";

interface AdminPageEditBadgeProps {
  pageKey: "about" | "authors" | "policies" | "announcements" | "contact";
}

export function AdminPageEditBadge({ pageKey }: AdminPageEditBadgeProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session && (session.role === "admin" || session.role === "super-admin")) {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link
        href="/dashboard/admin"
        className="group flex items-center gap-2 rounded-full bg-[#070e24]/90 hover:bg-[#070e24] px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400/40 backdrop-blur-md transition-all hover:scale-105 hover:shadow-amber-500/20"
        title="Open CMS to edit this page content"
      >
        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <Edit3 className="h-3.5 w-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span>Edit Page (CMS)</span>
      </Link>
    </div>
  );
}
