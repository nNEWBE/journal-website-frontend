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
}

export interface DashboardPageWrapperProps {
  /**
   * Roles permitted to access this page.
   * If omitted, any authenticated user can view the page.
   */
  allowedRoles?: Role[];
  /**
   * Optional header banner matching the academic workspace aesthetic.
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

  const HeaderIcon = header?.icon;

  return (
    <div className="space-y-0">
      {header && (
        <div className="flex items-center justify-between border-b border-l-4 border-l-blue-600 border-[color:var(--color-gb-border)] px-5 py-4 bg-white/70 backdrop-blur-sm shadow-[inset_0_-1px_0_rgba(17,27,82,0.02)] transition-all">
          <div className="flex items-start gap-3.5">
            {HeaderIcon && (
              <div className="p-2.5 rounded-xl border flex items-center justify-center shadow-sm shrink-0 mt-0.5 bg-blue-50 text-blue-600 border-blue-200">
                <HeaderIcon className="h-5 w-5" />
              </div>
            )}
            <div>
              {header.badge && (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border leading-none font-sans bg-blue-50 text-blue-700 border-blue-200">
                    {header.badge}
                  </span>
                </div>
              )}
              <h1 className="mt-1.5 text-sm font-extrabold text-[color:var(--color-gb-ink)] tracking-tight font-academic">
                {header.title}
              </h1>
              {header.subtitle && (
                <p className="mt-1 max-w-2xl text-[11px] text-[color:var(--color-gb-muted)] leading-relaxed">
                  {header.subtitle}
                </p>
              )}
            </div>
          </div>
          {header.actions && <div>{header.actions}</div>}
        </div>
      )}

      <div className={cn("p-4 sm:p-6 space-y-6", className)}>
        {typeof children === "function" ? children(user) : children}
      </div>
    </div>
  );
}
