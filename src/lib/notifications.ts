"use client";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  type: "submission" | "review" | "system" | "editorial";
  read: boolean;
  link?: string;
  targetRoles?: ("author" | "admin" | "super_admin" | "editor" | "reviewer")[];
}

const STORAGE_KEY = "gbj_notifications_store_v1";

/**
 * Default sample notifications to display if the store is empty
 */
const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-welcome",
    title: "Welcome to GB Research Workspace",
    message: "Your academic portal is fully active. Track submissions, peer review assignments, and published issues.",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    type: "system",
    read: true,
    targetRoles: ["author", "admin", "super_admin", "editor"],
  },
];

/**
 * Retrieve all notifications filtered by the user's role
 */
export function getStoredNotifications(currentRole?: string): AppNotification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: AppNotification[] = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;

    if (!Array.isArray(list)) list = DEFAULT_NOTIFICATIONS;

    if (!currentRole) return list;

    const normalizedRole = currentRole.toLowerCase().replace("-", "_") as any;
    return list.filter((n) => {
      if (!n.targetRoles || n.targetRoles.length === 0) return true;
      return n.targetRoles.some((r) => r === normalizedRole);
    });
  } catch (err) {
    console.warn("Failed to read stored notifications:", err);
    return DEFAULT_NOTIFICATIONS;
  }
}

/**
 * Add a new notification, save to localStorage, and broadcast an update event
 */
export function addNotification(
  item: Omit<AppNotification, "id" | "timestamp" | "read">
): AppNotification {
  const newNotif: AppNotification = {
    ...item,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: AppNotification[] = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
      const updated = [newNotif, ...list].slice(0, 50); // Keep latest 50 notifications
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("notifications-updated", { detail: newNotif }));
    } catch (err) {
      console.warn("Failed to persist notification:", err);
    }
  }

  return newNotif;
}

/**
 * Mark a single notification as read
 */
export function markAsRead(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: AppNotification[] = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("notifications-updated"));
  } catch (err) {
    console.warn("Failed to mark notification as read:", err);
  }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: AppNotification[] = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    const updated = list.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("notifications-updated"));
  } catch (err) {
    console.warn("Failed to mark all notifications as read:", err);
  }
}

/**
 * Count unread notifications for a specific user role
 */
export function getUnreadCount(currentRole?: string): number {
  return getStoredNotifications(currentRole).filter((n) => !n.read).length;
}

/**
 * Request permission for Desktop Browser Notifications (Web Notifications API)
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  try {
    return await Notification.requestPermission();
  } catch (err) {
    console.warn("Error requesting browser notification permission:", err);
    return null;
  }
}

/**
 * Dispatch a native Desktop Browser Notification
 */
export async function sendBrowserNotification(title: string, options?: NotificationOptions): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  try {
    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        });
      }
    }
  } catch (err) {
    console.warn("Could not dispatch browser notification:", err);
  }
}
