"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
  actions,
  className,
}: DashboardPageHeaderProps) {
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

      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {actions}
        </div>
      )}
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
   * Optional header banner matching the academic workspace card aesthetic.
   */
  header?: DashboardPageHeaderProps;
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

  return (
    <div className={cn("p-4 sm:p-6 space-y-6", className)}>
      {header && <DashboardPageHeader {...header} />}
      {typeof children === "function" ? children(user) : children}
    </div>
  );
}
