"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Library,
  PenLine,
  Scale,
  Send,
  ShieldCheck,
  Users,
  Award,
  Globe,
  Mail,
  Phone,
  GraduationCap,
  Bookmark,
  Newspaper,
  HelpCircle,
  Info,
  ExternalLink,
  Layers,
  Search,
  Compass,
  Building,
  CheckCircle2,
  Calendar,
  FolderOpen,
  Tag,
  Share2,
  Lock,
  Flame,
  FileCheck,
  Briefcase,
  Sliders,
  Feather,
} from "lucide-react";
import { navigationApi, NavItemDTO, NavSubItemDTO } from "@/lib/api";

export const NAV_ICONS_MAP: Record<string, any> = {
  BookOpen,
  FileText,
  Library,
  PenLine,
  Scale,
  Send,
  ShieldCheck,
  Users,
  Award,
  Globe,
  Mail,
  Phone,
  GraduationCap,
  Bookmark,
  Newspaper,
  HelpCircle,
  Info,
  ExternalLink,
  Layers,
  Search,
  Compass,
  Building,
  CheckCircle2,
  Calendar,
  FolderOpen,
  Tag,
  Share2,
  Lock,
  Flame,
  FileCheck,
  Briefcase,
  Sliders,
  Feather,
};

export function getNavIcon(nameOrIcon?: string | any): any {
  if (!nameOrIcon) return BookOpen;
  if (typeof nameOrIcon === "string") {
    return NAV_ICONS_MAP[nameOrIcon] || BookOpen;
  }
  return nameOrIcon || BookOpen;
}

export type NavSubItem = NavSubItemDTO;
export type NavItem = NavItemDTO;

export const defaultMainNav: NavItem[] = [
  {
    clientId: "nav-home",
    label: "Home",
    href: "/",
    enabled: true,
  },
  {
    clientId: "nav-about",
    label: "About & Governance",
    href: "/about",
    enabled: true,
    dropdownHeader: "About & Governance",
    footerHref: "/about",
    footerLabel: "View full journal overview",
    dropdown: [
      {
        clientId: "sub-about-1",
        label: "About the Journal",
        href: "/about",
        description: "Scope, open access mandate & editorial vision",
        iconName: "BookOpen",
        enabled: true,
      },
      {
        clientId: "sub-about-2",
        label: "Editorial Board",
        href: "/editorial-board",
        description: "Academic leadership & discipline chairs",
        iconName: "Users",
        enabled: true,
      },
      {
        clientId: "sub-about-3",
        label: "Reviewer Guidelines",
        href: "/reviewers",
        description: "Peer-review standards & reviewer panel",
        iconName: "ShieldCheck",
        enabled: true,
      },
      {
        clientId: "sub-about-4",
        label: "Ethics & Policies",
        href: "/policies",
        description: "COPE compliance, copyright & retractions",
        iconName: "Scale",
        enabled: true,
      },
    ],
  },
  {
    clientId: "nav-issues",
    label: "Issues & Articles",
    href: "/issues",
    enabled: true,
    dropdownHeader: "Issues & Archive",
    footerHref: "/articles",
    footerLabel: "Search all articles",
    dropdown: [
      {
        clientId: "sub-issues-1",
        label: "All Issues & Archive",
        href: "/issues",
        description: "Browse complete publication record by year",
        iconName: "Library",
        enabled: true,
      },
      {
        clientId: "sub-issues-2",
        label: "Search Articles",
        href: "/articles",
        description: "Filter indexed papers by topic, DOI & keywords",
        iconName: "FileText",
        enabled: true,
      },
    ],
  },
  {
    clientId: "nav-authors",
    label: "For Authors",
    href: "/authors",
    enabled: true,
    dropdownHeader: "Author Resources",
    footerHref: "/dashboard/submissions/new",
    footerLabel: "Submit your manuscript",
    dropdown: [
      {
        clientId: "sub-authors-1",
        label: "Author Guidelines",
        href: "/authors",
        description: "Manuscript structure, formatting & checklist",
        iconName: "PenLine",
        enabled: true,
      },
      {
        clientId: "sub-authors-2",
        label: "Submit Manuscript",
        href: "/dashboard/submissions/new",
        description: "Online manuscript submission portal",
        iconName: "Send",
        enabled: true,
      },
    ],
  },
  {
    clientId: "nav-contact",
    label: "Contact",
    href: "/contact",
    enabled: true,
  },
];

export const mainNav = defaultMainNav;

// In-memory runtime cache for seamless instant rendering across route transitions
let dbNavCache: { data: NavItem[]; timestamp: number } | null = null;
export const NAV_CHANGE_EVENT = "gb_db_navigation_updated";

export function getCachedNav(): NavItem[] {
  return dbNavCache?.data || defaultMainNav;
}

export function broadcastNavUpdate(items: NavItem[]): void {
  dbNavCache = { data: items, timestamp: Date.now() };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NAV_CHANGE_EVENT, { detail: items }));
  }
}

/**
 * React hook for live DB-backed navigation items with auto-fetch and instant update broadcast.
 */
export function useNavigation(): {
  navItems: NavItem[];
  setNavItems: (items: NavItem[]) => void;
  resetNavItems: () => Promise<void>;
  isLoading: boolean;
  refreshFromDb: (force?: boolean) => Promise<void>;
} {
  const [navItems, setNavState] = useState<NavItem[]>(() => dbNavCache?.data || defaultMainNav);
  const [isLoading, setIsLoading] = useState<boolean>(!dbNavCache);

  const fetchFromDb = async (force = false) => {
    if (dbNavCache?.data && !force && Date.now() - dbNavCache.timestamp < 60000) {
      setNavState(dbNavCache.data);
      setIsLoading(false);
      return;
    }

    try {
      const data = await navigationApi.getPublished();
      if (Array.isArray(data) && data.length > 0) {
        dbNavCache = { data, timestamp: Date.now() };
        setNavState(data);
      }
    } catch {
      // If backend is unreachable, fallback to cached or default
      if (!dbNavCache) {
        setNavState(defaultMainNav);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFromDb();

    const handleNavChange = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setNavState(e.detail);
      }
    };

    window.addEventListener(NAV_CHANGE_EVENT, handleNavChange);
    return () => {
      window.removeEventListener(NAV_CHANGE_EVENT, handleNavChange);
    };
  }, []);

  const updateItems = (newItems: NavItem[]) => {
    setNavState(newItems);
    broadcastNavUpdate(newItems);
  };

  const resetItems = async () => {
    try {
      const restored = await navigationApi.resetDefaults();
      if (Array.isArray(restored) && restored.length > 0) {
        setNavState(restored);
        broadcastNavUpdate(restored);
      } else {
        setNavState(defaultMainNav);
        broadcastNavUpdate(defaultMainNav);
      }
    } catch {
      setNavState(defaultMainNav);
      broadcastNavUpdate(defaultMainNav);
    }
  };

  return {
    navItems,
    setNavItems: updateItems,
    resetNavItems: resetItems,
    isLoading,
    refreshFromDb: fetchFromDb,
  };
}

export function getIsRouteActive(
  pathname: string,
  target: NavItem | string
): boolean {
  if (typeof target === "string") {
    if (target === "Home") return pathname === "/";
    if (
      pathname.startsWith("/about") ||
      pathname.startsWith("/policies") ||
      pathname.startsWith("/editorial-board") ||
      pathname.startsWith("/reviewers")
    ) {
      return target === "About & Governance";
    }
    if (pathname.startsWith("/issues") || pathname.startsWith("/articles")) {
      return target === "Issues & Articles";
    }
    if (
      pathname.startsWith("/authors") ||
      pathname.startsWith("/submit") ||
      pathname.startsWith("/dashboard")
    ) {
      return target === "For Authors";
    }
    if (pathname.startsWith("/contact")) {
      return target === "Contact";
    }
    return false;
  }

  if (target.href === "/" && pathname === "/") return true;
  if (target.href !== "/" && pathname.startsWith(target.href)) return true;
  if (target.dropdown && target.dropdown.length > 0) {
    return target.dropdown.some(
      (sub) =>
        sub.href &&
        (pathname === sub.href ||
          (sub.href !== "/" && pathname.startsWith(sub.href)))
    );
  }
  return false;
}
