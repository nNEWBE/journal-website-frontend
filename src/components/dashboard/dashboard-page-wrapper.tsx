"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  ClipboardCheck,
  Compass,
  Crown,
  Layers,
  Mail,
  Users,
  Home as HomeIcon,
  PenLine,
  CheckCircle2,
  Shield,
  FileText,
  Phone,
} from "lucide-react";
import { getSession, type User } from "@/lib/auth";
import { type Role } from "@/lib/data";
import { cn } from "@/lib/utils";

import {
  DashboardBannerHeader,
  type DashboardBannerHeaderProps,
} from "./dashboard-banner-header";
import { DashboardPageSkeleton } from "./dashboard-page-skeleton";

export type DashboardPageHeaderProps = DashboardBannerHeaderProps;

/**
 * Default header definitions for all Management Tools links
 */
export const MANAGEMENT_PAGE_HEADERS: Record<string, DashboardPageHeaderProps> = {
  "/dashboard/pipeline": {
    title: "Manuscript Pipeline",
    subtitle: "Monitor submissions, assign double-blind reviewers, and advance editorial workflows.",
    icon: ClipboardCheck,
    badge: "Editorial Workflow",
    borderAccentClassName: "border-l-violet-600",
    badgeClassName: "bg-violet-50 text-violet-700 border-violet-200/60",
  },
  "/dashboard/publications": {
    title: "All Publications Repository",
    subtitle: "Comprehensive directory of peer-reviewed articles, scholarly DOIs, and readership analytics.",
    icon: BookMarked,
    badge: "Publications",
    borderAccentClassName: "border-l-blue-600",
    badgeClassName: "bg-blue-50 text-blue-700 border-blue-200/60",
  },
  "/dashboard/users": {
    title: "User Directory & Access Control",
    subtitle: "Manage academic scholar credentials, role privileges, and active user accounts.",
    icon: Users,
    badge: "Administration",
    borderAccentClassName: "border-l-emerald-600",
    badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  },
  "/dashboard/mailing": {
    title: "Mailing & Scholar Broadcast",
    subtitle: "Dispatch announcements, call for papers, and updates directly to registered scholars.",
    icon: Mail,
    badge: "Communications Center",
    borderAccentClassName: "border-l-sky-600",
    badgeClassName: "bg-sky-50 text-sky-700 border-sky-200/60",
  },
  "/dashboard/issues": {
    title: "Volumes & Issue Releases",
    subtitle: "Organize accepted manuscripts into publication volumes, issues, and featured releases.",
    icon: BookOpen,
    badge: "Publishing & Archive",
    borderAccentClassName: "border-l-indigo-600",
    badgeClassName: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  },
  "/dashboard/board": {
    title: "Editorial Board Governance",
    subtitle: "Manage academic appointments, advisory scholars, and section editors displayed on the public portal.",
    icon: Crown,
    badge: "Academic Governance",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms": {
    title: "Pages CMS — Home Page",
    subtitle: "Configure hero showcase, carousel publications, research highlights, and metrics on the public homepage.",
    icon: HomeIcon,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/home": {
    title: "Pages CMS — Home Page",
    subtitle: "Configure hero showcase, carousel publications, research highlights, and metrics on the public homepage.",
    icon: HomeIcon,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/about": {
    title: "Pages CMS — About Journal",
    subtitle: "Manage journal overview, mission, indexing criteria, and aims & scope.",
    icon: BookOpen,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/editorial-board": {
    title: "Pages CMS — Editorial Board",
    subtitle: "Manage public academic leadership, section editors, governance charter, and advisory council.",
    icon: Users,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/authors": {
    title: "Pages CMS — Author Guidelines",
    subtitle: "Edit manuscript preparation instructions, submission checklists, templates, and APC waivers.",
    icon: PenLine,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/reviewers": {
    title: "Pages CMS — Reviewer Guidelines",
    subtitle: "Configure peer review protocol, evaluation rubrics, reviewer ethics, and academic recognition.",
    icon: CheckCircle2,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/policies": {
    title: "Pages CMS — Policies & Ethics",
    subtitle: "Manage anti-plagiarism screening, COPE compliance, double-blind review framework, and open access policies.",
    icon: Shield,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/issues": {
    title: "Pages CMS — Issues Archive",
    subtitle: "Configure public issue releases, volume archive text, and catalog headers.",
    icon: Layers,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/articles": {
    title: "Pages CMS — Articles Directory",
    subtitle: "Configure public paper listings, indexing metrics, PDF links, and DOI configurations.",
    icon: FileText,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/cms/contact": {
    title: "Pages CMS — Contact Office",
    subtitle: "Edit editorial secretariat details, campus location, help desk, and inquiry contacts.",
    icon: Phone,
    badge: "Pages CMS",
    borderAccentClassName: "border-l-amber-600",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  "/dashboard/navigation": {
    title: "Navigation & Menu Architecture",
    subtitle: "Add, edit, delete, reorder, and configure public top-level menu items, dropdown categories, and links in the database.",
    icon: Compass,
    badge: "PostgreSQL Database Sync",
    borderAccentClassName: "border-l-teal-600",
    badgeClassName: "bg-teal-50 text-teal-700 border-teal-200/60",
  },
};

interface DashboardHeaderContextType {
  portalTarget: HTMLDivElement | null;
}

const DashboardHeaderContext = createContext<DashboardHeaderContextType>({
  portalTarget: null,
});

export function useDashboardHeader() {
  return useContext(DashboardHeaderContext);
}

/**
 * Component that allows child panels to dynamically portal action buttons and controls into DashboardPageWrapper's header
 */
export function DashboardHeaderActions({ children }: { children: React.ReactNode }) {
  const { portalTarget } = useDashboardHeader();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !portalTarget) {
    return null;
  }

  return createPortal(children, portalTarget);
}

export function DashboardPageHeader(props: DashboardPageHeaderProps) {
  return <DashboardBannerHeader {...props} />;
}

export interface DashboardPageWrapperProps {
  /**
   * Roles permitted to access this page.
   * If omitted, any authenticated user can view the page.
   */
  allowedRoles?: Role[];
  /**
   * Optional header override. Set to false to suppress the automatic header.
   */
  header?: DashboardPageHeaderProps | false;
  /**
   * Fallback redirect route when user role is not allowed. Defaults to "/dashboard/analytics".
   */
  fallbackRoute?: string;
  /**
   * Additional container className.
   */
  className?: string;
  /**
   * Additional content wrapper className.
   */
  contentClassName?: string;
  /**
   * Content to render once authenticated. Can be standard ReactNode or render prop receiving the authenticated User.
   */
  children: React.ReactNode | ((user: User) => React.ReactNode);
}

export function DashboardPageWrapper({
  allowedRoles,
  header,
  fallbackRoute = "/dashboard/analytics",
  className,
  contentClassName,
  children,
}: DashboardPageWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const hasPermission =
        allowedRoles.includes(session.role) || session.role === "super-admin";
      if (!hasPermission) {
        router.replace(fallbackRoute);
        return;
      }
    }

    setUser(session);
    setIsAuthorized(true);
  }, [router, pathname, allowedRoles, fallbackRoute]);

  if (!isAuthorized || !user) {
    return (
      <DashboardPageSkeleton
        header={header}
        pathname={pathname}
        className={className}
      />
    );
  }

  // Determine header configuration:
  // 1. If header === false, suppress header
  // 2. If header object is provided, merge with default
  // 3. Otherwise, check MANAGEMENT_PAGE_HEADERS for matching pathname
  const defaultHeader = pathname ? MANAGEMENT_PAGE_HEADERS[pathname] : undefined;
  const showHeader = header !== false && (Boolean(header) || Boolean(defaultHeader));
  const resolvedHeader: DashboardPageHeaderProps | null = showHeader
    ? ({
        ...(defaultHeader || {}),
        ...(typeof header === "object" ? header : {}),
      } as DashboardPageHeaderProps)
    : null;

  return (
    <DashboardHeaderContext.Provider value={{ portalTarget }}>
      <div className={cn("min-h-full flex flex-col", className)}>
        {resolvedHeader && (
          <DashboardBannerHeader {...resolvedHeader} portalRef={setPortalTarget} />
        )}
        <div
          className={cn(
            resolvedHeader ? "p-4 sm:p-6 space-y-6 flex-1" : "flex-1",
            contentClassName
          )}
        >
          {typeof children === "function" ? children(user) : children}
        </div>
      </div>
    </DashboardHeaderContext.Provider>
  );
}
