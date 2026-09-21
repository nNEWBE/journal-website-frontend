"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  FileText,
  Inbox,
  ShieldCheck,
  UserCheck,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AppNotification,
  getStoredNotifications,
  markAllAsRead,
  markAsRead,
  requestBrowserNotificationPermission,
} from "@/lib/notifications";
import { notificationsApi } from "@/lib/api";

function formatTimeAgo(isoDate: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000));
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

export function NotificationDropdown({
  activeRole,
}: {
  activeRole?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [browserPermission, setBrowserPermission] = useState<string>("default");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync notifications from local store + backend API
  const syncNotifications = async () => {
    const localList = getStoredNotifications(activeRole).map((n) => {
      if (n.link === "/dashboard/admin/pipeline") {
        return { ...n, link: "/dashboard/pipeline" };
      }
      return n;
    });

    try {
      const backendItems = await notificationsApi.getNotifications(activeRole);
      if (Array.isArray(backendItems)) {
        const mappedBackend: AppNotification[] = backendItems.map((b: any) => ({
          id: `backend-${b.id}`,
          title: b.title,
          message: b.message,
          timestamp: b.createdAt || new Date().toISOString(),
          type: (b.type?.toLowerCase() as any) || "system",
          read: Boolean(b.read ?? b.isRead ?? false),
          link: b.link ? b.link.replace("/dashboard/admin/pipeline", "/dashboard/pipeline") : undefined,
          targetRoles: b.targetRoles
            ? (b.targetRoles.toLowerCase().split(",").map((r: string) => r.trim()) as any)
            : undefined,
        }));

        // Merge backend and local notifications, avoiding duplicate titles+messages
        const combined = [...mappedBackend];
        for (const loc of localList) {
          if (!combined.some((c) => c.id === loc.id || (c.title === loc.title && c.message === loc.message))) {
            combined.push(loc);
          }
        }
        combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(combined);
        return;
      }
    } catch {
      // Fallback to local store if backend unreachable or unauthenticated
    }

    setNotifications(localList);
  };

  useEffect(() => {
    syncNotifications();

    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserPermission(Notification.permission);
    } else {
      setBrowserPermission("unsupported");
    }

    const handleUpdate = () => {
      syncNotifications();
    };
    window.addEventListener("notifications-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("notifications-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [activeRole]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen) {
      syncNotifications();
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = activeTab === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleRequestPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    if (perm) {
      setBrowserPermission(perm);
      if (perm === "granted") {
        toast.success("Desktop Notifications Enabled", {
          description: "You'll receive browser notifications for new submissions and updates.",
        });
      } else if (perm === "denied") {
        toast.error("Notifications Blocked", {
          description: "You have disabled browser notifications in your browser settings.",
        });
      }
    }
  };

  const handleMarkAllRead = async () => {
    // Optimistically mark all in state as read
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllAsRead();
    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read in backend:", err);
    }
    await syncNotifications();
    toast.success("All notifications marked as read");
  };

  const handleItemClick = async (notif: AppNotification) => {
    if (!notif.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      markAsRead(notif.id);
      if (notif.id.startsWith("backend-")) {
        const backendId = notif.id.replace("backend-", "");
        try {
          await notificationsApi.markAsRead(backendId);
        } catch (err) {
          console.error("Failed to mark notification as read in backend:", err);
        }
      }
      await syncNotifications();
    }
    if (notif.link) {
      setIsOpen(false);
      const targetLink = notif.link.replace("/dashboard/admin/pipeline", "/dashboard/pipeline");
      router.push(targetLink);
    }
  };

  const handleItemMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    markAsRead(id);
    if (id.startsWith("backend-")) {
      const backendId = id.replace("backend-", "");
      try {
        await notificationsApi.markAsRead(backendId);
      } catch (err) {
        console.error("Failed to mark notification as read in backend:", err);
      }
    }
    await syncNotifications();
  };

  const getIconForType = (type: AppNotification["type"]) => {
    switch (type) {
      case "submission":
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="h-4 w-4" />
          </div>
        );
      case "editorial":
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="h-4 w-4" />
          </div>
        );
      case "review":
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <UserCheck className="h-4 w-4" />
          </div>
        );
      case "system":
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Bell className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={`relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer ${isOpen
          ? "border-gb-blue bg-blue-50 text-gb-blue shadow-xs"
          : "border-(--color-gb-border) bg-white text-(--color-gb-muted) hover:bg-slate-50 hover:text-slate-900"
          }`}
      >
        <Bell className="h-3.5 w-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white shadow-xs animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden flex flex-col max-h-130"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-gb-blue hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 text-xs bg-white">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-lg px-2.5 py-1 font-bold text-[11px] transition-colors cursor-pointer ${activeTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:bg-slate-100"
                  }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`rounded-lg px-2.5 py-1 font-bold text-[11px] transition-colors cursor-pointer ${activeTab === "unread"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:bg-slate-100"
                  }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Browser Permission Banner */}
            {browserPermission !== "granted" && browserPermission !== "unsupported" && (
              <div className="mx-3 mt-2.5 mb-1 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-bold text-[11px] text-blue-950">Desktop Notifications</p>
                    <p className="text-[10px] text-blue-700">Receive alerts when papers are submitted</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="shrink-0 rounded-lg bg-gb-blue px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs hover:bg-gb-blue-dark transition-colors cursor-pointer"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-2">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">No notifications found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {activeTab === "unread"
                      ? "You have marked all notifications as read."
                      : "You're all caught up with your editorial activities."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${n.read ? "bg-white hover:bg-slate-50/80" : "bg-blue-50/30 hover:bg-blue-50/60"
                      }`}
                  >
                    {getIconForType(n.type)}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs truncate ${n.read ? "font-semibold text-slate-800" : "font-black text-slate-950"
                            }`}
                        >
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(n.timestamp)}
                        </span>
                        {n.link && (
                          <span className="flex items-center gap-0.5 text-gb-blue font-bold group-hover:underline">
                            View <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {!n.read && (
                      <button
                        type="button"
                        onClick={(e) => handleItemMarkRead(e, n.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 text-slate-400 hover:text-gb-blue hover:bg-blue-100/50 cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-center">
              <span className="text-[10px] text-slate-400">
                GB Research Journal &bull; Editorial Notification Center
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
