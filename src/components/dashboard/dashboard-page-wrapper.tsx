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
} from "lucide-react";
import { getSession, type User } from "@/lib/auth";
import { type Role } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Default header definitions for all Management Tools links
 */
export const MANAGEMENT_PAGE_HEADERS: Record<string, DashboardPageHeaderProps> = {
  "/dashboard/pipeline": {
    title: "Manuscript Pipeline",
    subtitle: "Monitor submissions, assign double-blind reviewers, and advance editorial workflows.",
    icon: ClipboardCheck,
    badge: "Editorial Workflow",
  },
  "/dashboard/publications": {
    title: "All Publications Repository",
    subtitle: "Comprehensive directory of peer-reviewed articles, scholarly DOIs, and readership analytics.",
    icon: BookMarked,
  },
  "/dashboard/users": {
    title: "User Directory & Access Control",
    subtitle: "Manage academic scholar credentials, role privileges, and active user accounts.",
    icon: Users,
    badge: "Administration",
  },
  "/dashboard/mailing": {
    title: "Mailing & Scholar Broadcast",
    subtitle: "Dispatch announcements, call for papers, and updates directly to registered scholars.",
    icon: Mail,
    badge: "Communications Center",
  },
  "/dashboard/issues": {
    title: "Volumes & Issue Releases",
    subtitle: "Organize accepted manuscripts into publication volumes, issues, and featured releases.",
    icon: BookOpen,
    badge: "Publishing & Archive",
  },
  "/dashboard/board": {
    title: "Editorial Board Governance",
    subtitle: "Manage academic appointments, advisory scholars, and section editors displayed on the public portal.",
    icon: Crown,
    badge: "Academic Governance",
  },
  "/dashboard/cms": {
    title: "Dynamic Page & Section Publisher",
    subtitle: "Edit text, upload guidelines, modify publication policies, and update announcements across the public journal portal.",
    icon: Layers,
    badge: "Site & Content Management (CMS)",
  },
  "/dashboard/navigation": {
    title: "Navigation & Menu Architecture",
    subtitle: "Add, edit, delete, reorder, and configure public top-level menu items, dropdown categories, and links in the database.",
    icon: Compass,
    badge: "PostgreSQL Database Sync",
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

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
  actions,
  className,
  portalRef,
}: DashboardPageHeaderProps & { portalRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-50 text-[color:var(--color-gb-blue)] border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          {badge && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-800 font-sans">
                {badge}
              </span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-academic">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        {actions}
        <div ref={portalRef} className="flex items-center gap-2 flex-wrap" />
      </div>
    </div>
  );
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
   * Content to render once authenticated. Can be standard ReactNode or render prop receiving the authenticated User.
   */
  children: React.ReactNode | ((user: User) => React.ReactNode);
}

export function DashboardPageWrapper({
  allowedRoles,
  header,
  fallbackRoute = "/dashboard/analytics",
  className,
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
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
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
      <div className={cn("p-4 sm:p-6 space-y-6", className)}>
        {resolvedHeader && (
          <DashboardPageHeader {...resolvedHeader} portalRef={setPortalTarget} />
        )}
        {typeof children === "function" ? children(user) : children}
      </div>
    </DashboardHeaderContext.Provider>
  );
}
