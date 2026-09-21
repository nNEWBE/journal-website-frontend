"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Inbox,
  Loader2,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AppNotification,
  getLocalReadIds,
  getStoredNotifications,
  markAllAsRead,
  markAsRead,
  markAsUnread,
  recordAllLocalRead,
  recordLocalRead,
  recordLocalUnread,
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
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync notifications from local store + backend API
  const syncNotifications = async () => {
    const localReadIds = getLocalReadIds();
    const localList = getStoredNotifications(activeRole).map((n) => {
      const isRead = n.read || localReadIds.has(n.id);
      const link = n.link === "/dashboard/admin/pipeline" ? "/dashboard/pipeline" : n.link;
      return { ...n, read: isRead, link };
    });

    try {
      const backendItems = await notificationsApi.getNotifications(activeRole);
      if (Array.isArray(backendItems)) {
        const mappedBackend: AppNotification[] = backendItems.map((b: any) => {
          const stringId = `backend-${b.id}`;
          const isRead = Boolean(
            b.read ??
            b.isRead ??
            localReadIds.has(stringId) ??
            localReadIds.has(String(b.id))
          );
          return {
            id: stringId,
            title: b.title,
            message: b.message,
            timestamp: b.createdAt || new Date().toISOString(),
            type: (b.type?.toLowerCase() as any) || "system",
            read: isRead,
            link: b.link ? b.link.replace("/dashboard/admin/pipeline", "/dashboard/pipeline") : undefined,
            targetRoles: b.targetRoles
              ? (b.targetRoles.toLowerCase().split(",").map((r: string) => r.trim()) as any)
              : undefined,
          };
        });

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
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);

    const prevUnreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

    // 1. Instant optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    recordAllLocalRead(notifications.map((n) => n.id));
    markAllAsRead();

    toast.success("All notifications marked as read", {
      description: `${prevUnreadIds.length} item${prevUnreadIds.length > 1 ? "s" : ""} updated`,
      action: {
        label: "Undo",
        onClick: async () => {
          for (const id of prevUnreadIds) {
            recordLocalUnread(id);
            markAsUnread(id);
            if (id.startsWith("backend-")) {
              const backendId = id.replace("backend-", "");
              notificationsApi.markAsUnread(backendId).catch(() => {});
            }
          }
          await syncNotifications();
          toast.info("Notifications restored to unread");
        },
      },
    });

    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read in backend:", err);
    } finally {
      setIsMarkingAll(false);
      await syncNotifications();
    }
  };

  const handleItemClick = async (notif: AppNotification) => {
    if (!notif.read) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      recordLocalRead(notif.id);
      markAsRead(notif.id);

      if (notif.id.startsWith("backend-")) {
        const backendId = notif.id.replace("backend-", "");
        try {
          await notificationsApi.markAsRead(backendId);
        } catch (err) {
          console.error("Failed to mark notification as read in backend:", err);
        }
      }
      syncNotifications();
    }
    if (notif.link) {
      setIsOpen(false);
      const targetLink = notif.link.replace("/dashboard/admin/pipeline", "/dashboard/pipeline");
      router.push(targetLink);
    }
  };

  const handleItemMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (pendingIds.has(id)) return;

    setPendingIds((prev) => new Set(prev).add(id));
    // 1. Instant optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    recordLocalRead(id);
    markAsRead(id);

    toast.success("Notification marked as read", {
      action: {
        label: "Undo",
        onClick: () => {
          handleItemMarkUnread(e, id);
        },
      },
    });

    if (id.startsWith("backend-")) {
      const backendId = id.replace("backend-", "");
      try {
        await notificationsApi.markAsRead(backendId);
      } catch (err) {
        console.error("Failed to mark notification as read in backend:", err);
      }
    }
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await syncNotifications();
  };

  const handleItemMarkUnread = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (pendingIds.has(id)) return;

    setPendingIds((prev) => new Set(prev).add(id));
    // 1. Instant optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
    recordLocalUnread(id);
    markAsUnread(id);

    toast.info("Marked as unread");

    if (id.startsWith("backend-")) {
      const backendId = id.replace("backend-", "");
      try {
        await notificationsApi.markAsUnread(backendId);
      } catch (err) {
        console.error("Failed to mark notification as unread in backend:", err);
      }
    }
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await syncNotifications();
  };

  const getIconForType = (type: AppNotification["type"]) => {
    switch (type) {
      case "submission":
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            <FileText className="h-4 w-4" />
          </div>
        );
      case "editorial":
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
        );
      case "review":
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <UserCheck className="h-4 w-4" />
          </div>
        );
      case "system":
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
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
        className={`relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer ${
          isOpen
            ? "border-gb-blue bg-blue-50 text-gb-blue shadow-xs"
            : "border-(--color-gb-border) bg-white text-(--color-gb-muted) hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Bell className="h-3.5 w-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white shadow-xs animate-in zoom-in-50 duration-200 ring-2 ring-white">
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
            className="absolute right-0 top-full mt-2 w-84 sm:w-98 rounded-2xl border border-slate-200/90 bg-white/98 backdrop-blur-md shadow-2xl z-50 overflow-hidden flex flex-col max-h-136"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">Notifications</span>
                {unreadCount > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                    <Check className="h-2.5 w-2.5" />
                    All read
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={isMarkingAll}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-gb-blue hover:bg-blue-50 border border-slate-200/80 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                    title="Mark all notifications as read"
                  >
                    {isMarkingAll ? (
                      <Loader2 className="h-3 w-3 animate-spin text-gb-blue" />
                    ) : (
                      <CheckCheck className="h-3.5 w-3.5 text-gb-blue" />
                    )}
                    <span>Mark all read</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium px-2 py-1">
                    All caught up
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close notifications"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs Row */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded-lg px-2.5 py-1 font-bold text-[11px] transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("unread")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-[11px] transition-all cursor-pointer ${
                    activeTab === "unread"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span>Unread</span>
                  {unreadCount > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                        activeTab === "unread" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <span className="text-[10px] text-slate-400 font-medium">
                {unreadCount === 0 ? "0 unread" : `${unreadCount} unread`}
              </span>
            </div>

            {/* Browser Permission Banner */}
            {browserPermission !== "granted" && browserPermission !== "unsupported" && (
              <div className="mx-3 mt-2 mb-1 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 flex items-center justify-between gap-3 text-xs">
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
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3 shadow-2xs">
                    {activeTab === "unread" ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Inbox className="h-6 w-6" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {activeTab === "unread" ? "All caught up!" : "No notifications found"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    {activeTab === "unread"
                      ? "You have reviewed all pending editorial and peer review updates."
                      : "You're all caught up with your editorial activities."}
                  </p>
                  {activeTab === "unread" && notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("all")}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <span>View all notifications ({notifications.length})</span>
                    </button>
                  )}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {filteredNotifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onClick={() => handleItemClick(n)}
                      className={`group relative flex items-start gap-3 p-3.5 transition-all cursor-pointer border-l-[3px] ${
                        n.read
                          ? "bg-white hover:bg-slate-50/90 border-l-transparent"
                          : "bg-blue-50/40 hover:bg-blue-50/70 border-l-gb-blue"
                      }`}
                    >
                      {getIconForType(n.type)}

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs truncate leading-snug ${
                              n.read ? "font-semibold text-slate-700" : "font-extrabold text-slate-950"
                            }`}
                          >
                            {n.title}
                          </h4>
                          {!n.read && (
                            <span className="relative flex h-2 w-2 shrink-0" title="Unread">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-2.5 mt-1.5 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {formatTimeAgo(n.timestamp)}
                          </span>
                          {n.link && (
                            <span className="flex items-center gap-0.5 text-gb-blue font-bold group-hover:underline">
                              View <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Quick Action */}
                      <div className="shrink-0 flex items-center self-center pl-1.5">
                        {!n.read ? (
                          <button
                            type="button"
                            onClick={(e) => handleItemMarkRead(e, n.id)}
                            disabled={pendingIds.has(n.id)}
                            aria-label="Mark notification as read"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-blue-700 bg-white border border-blue-200/90 hover:bg-gb-blue hover:text-white hover:border-gb-blue shadow-2xs transition-all cursor-pointer group/btn active:scale-95 disabled:opacity-50"
                            title="Mark as read"
                          >
                            {pendingIds.has(n.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin text-blue-600 group-hover/btn:text-white" />
                            ) : (
                              <Check className="h-3 w-3 text-blue-600 group-hover/btn:text-white transition-colors" />
                            )}
                            <span>Mark read</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleItemMarkUnread(e, n.id)}
                            disabled={pendingIds.has(n.id)}
                            aria-label="Mark notification as unread"
                            className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            title="Mark as unread"
                          >
                            {pendingIds.has(n.id) ? (
                              <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            ) : (
                              <RotateCcw className="h-2.5 w-2.5" />
                            )}
                            <span>Mark unread</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>GB Research Journal &bull; Editorial Center</span>
              <span className="font-semibold text-slate-500">Realtime Sync Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

