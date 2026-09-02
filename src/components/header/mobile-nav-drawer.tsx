"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { useNavigation, getNavIcon, getIsRouteActive } from "./nav-data";
import type { User } from "@/lib/auth";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  user,
  onLogout,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { navItems } = useNavigation();
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);

  if (!isOpen) return null;

  const visibleItems = navItems.filter((item) => item.enabled !== false);

  return (
    <div className="container-x border-t border-[color:var(--border)] py-4 lg:hidden animate-fade">
      <nav className="grid gap-1">
        {visibleItems.map((item) => {
          const visibleDropdown = (item.dropdown || []).filter(
            (sub) => sub.enabled !== false
          );
          const hasSub = visibleDropdown.length > 0;
          const itemKey = item.id?.toString() || item.clientId || item.label;
          const isSubOpen = openMobileSub === itemKey;
          const isMobileRouteActive = getIsRouteActive(pathname, item);

          return (
            <div key={itemKey} className="grid gap-1">
              <div
                className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                  isMobileRouteActive
                    ? "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] font-black"
                    : "text-[color:var(--color-gb-blue-dark)] hover:bg-slate-50"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="flex-1"
                >
                  {item.label}
                </Link>
                {hasSub && (
                  <button
                    onClick={() =>
                      setOpenMobileSub(
                        isSubOpen ? null : itemKey
                      )
                    }
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isSubOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {hasSub && isSubOpen && (
                <div className="ml-4 grid gap-1 border-l-2 border-[color:var(--color-gb-blue-soft)] pl-3 my-1">
                  {visibleDropdown.map((sub) => {
                    const SubIcon = getNavIcon(sub.iconName);
                    const isSubActive =
                      pathname === sub.href ||
                      (sub.href !== "/" && pathname.startsWith(sub.href));

                    return (
                      <Link
                        key={sub.id || sub.clientId || sub.href + sub.label}
                        href={sub.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                          isSubActive
                            ? "bg-[color:var(--color-gb-blue)] text-white font-extrabold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <SubIcon
                          className={`h-3.5 w-3.5 ${
                            isSubActive
                              ? "text-white"
                              : "text-[color:var(--color-gb-blue)]"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span>{sub.label}</span>
                          {sub.description && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              {sub.description}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {user ? (
          <div className="border-t border-[color:var(--border)] mt-2 pt-2 grid gap-1">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-[color:var(--color-gb-blue-dark)] hover:bg-[color:var(--color-gb-blue-soft)]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-2 justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] mt-2 transition-colors"
          >
            <UserIcon className="h-4 w-4" />
            Login to Workspace
          </Link>
        )}
      </nav>
    </div>
  );
}
