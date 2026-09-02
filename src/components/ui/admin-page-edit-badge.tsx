"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import { getSession } from "@/lib/auth";

interface AdminPageEditBadgeProps {
  pageKey: "home" | "about" | "authors" | "policies" | "announcements" | "contact";
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
        href={`/dashboard/admin`}
        className="group flex items-center gap-2 rounded-full bg-[#070e24]/95 hover:bg-[#070e24] px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-white/25 backdrop-blur-md transition-all hover:scale-105 hover:shadow-black/40 cursor-pointer"
        title="Open CMS to edit this page content"
      >
        <Edit3 className="h-3.5 w-3.5 text-white group-hover:rotate-12 transition-transform" />
        <span className="text-white">Edit Page (CMS)</span>
      </Link>
    </div>
  );
}
