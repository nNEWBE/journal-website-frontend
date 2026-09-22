"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Edit3 } from "lucide-react";
import { getSession } from "@/lib/auth";

interface AdminPageEditBadgeProps {
  pageKey?: string;
}

function resolvePageKey(pathname: string): string {
  if (!pathname || pathname === "/") return "home";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/editorial-board")) return "editorial-board";
  if (pathname.startsWith("/authors")) return "authors";
  if (pathname.startsWith("/reviewers")) return "reviewers";
  if (pathname.startsWith("/policies")) return "policies";
  if (pathname.startsWith("/issues")) return "issues";
  if (pathname.startsWith("/articles")) return "articles";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
}

export function AdminPageEditBadge({ pageKey: explicitPageKey }: AdminPageEditBadgeProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function checkRole() {
      const session = getSession();
      if (session && (session.role === "admin" || session.role === "super-admin")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

    checkRole();
    window.addEventListener("storage", checkRole);
    window.addEventListener("focus", checkRole);
    return () => {
      window.removeEventListener("storage", checkRole);
      window.removeEventListener("focus", checkRole);
    };
  }, []);

  // Do not render if not admin, or if already in dashboard
  if (!isAdmin || pathname?.startsWith("/dashboard")) return null;

  const effectivePageKey = explicitPageKey || resolvePageKey(pathname || "/");
  const targetHref = `/dashboard/cms/${effectivePageKey}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
      <Link
        href={targetHref}
        className="group flex items-center gap-2 rounded-xs bg-[#070e24]/95 hover:bg-[#0b1b3d] px-3.5 py-2 text-xs font-semibold text-white shadow-2xl border border-white/25 backdrop-blur-md transition-all hover:scale-105 hover:shadow-black/50 cursor-pointer"
        title={`Open CMS to edit ${effectivePageKey} content`}
      >
        <Edit3 className="h-3.5 w-3.5 text-white group-hover:rotate-12 transition-transform shrink-0" />
        <span className="text-white font-sans">Edit Page (CMS)</span>
      </Link>
    </div>
  );
}
