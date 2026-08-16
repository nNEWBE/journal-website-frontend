import { type Role } from "./data";
import { authApi, setTokens, clearTokens } from "./api";

export interface User {
  email: string;
  name: string;
  role: Role;
  title: string;
  department?: string;
  institution?: string;
  avatar?: string;
}

export const SESSION_KEY = "gb_journal_user_session";

// Automatically wipe all legacy credentials and sessions from localStorage
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("gb_journal_access_token");
    localStorage.removeItem("gb_journal_refresh_token");
    localStorage.removeItem("gb_journal_user_session");
  } catch (e) {
    // Ignore
  }
}

// In-memory cache for instant client access without touching localStorage
let inMemoryUser: User | null = null;

function parseCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  if (inMemoryUser) return inMemoryUser;

  try {
    const sessionCookie = parseCookie(SESSION_KEY);
    if (sessionCookie) {
      inMemoryUser = JSON.parse(sessionCookie);
      return inMemoryUser;
    }
  } catch (e) {
    // Fallback
  }
  return null;
}

export function setSession(user: User): void {
  inMemoryUser = user;
  if (typeof document === "undefined") return;
  try {
    // Store non-sensitive user metadata in a standard cookie (never in localStorage)
    const isProduction = window.location.protocol === "https:";
    document.cookie = `${SESSION_KEY}=${encodeURIComponent(
      JSON.stringify(user)
    )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${
      isProduction ? "; Secure" : ""
    }`;
  } catch (e) {
    console.error("Failed to store auth session cookie", e);
  }
}

export function clearSession(): void {
  inMemoryUser = null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("gb_journal_access_token");
      localStorage.removeItem("gb_journal_refresh_token");
      localStorage.removeItem("gb_journal_user_session");
      document.cookie = `${SESSION_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      authApi.logout().catch(() => {});
    } catch (e) {
      console.error("Failed to clear auth session", e);
    }
  }
}

export async function loginWithApi(email: string, password: string): Promise<User> {
  const res = await authApi.login({ email, password });
  const user: User = {
    email: res.user.email,
    name: res.user.fullName || res.user.name,
    role: res.user.role,
    title: res.user.title || "Academic User",
    department: res.user.department,
    institution: res.user.institution,
    avatar: res.user.avatarUrl || res.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(res.user.email)}`,
  };
  setSession(user);
  return user;
}

export async function registerWithApi(payload: {
  fullName: string;
  email: string;
  password: string;
  institution?: string;
  department?: string;
  country?: string;
  orcid?: string;
}): Promise<User> {
  const res = await authApi.register({
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    institution: payload.institution,
    department: payload.department,
    title: payload.fullName,
  });

  const user: User = {
    email: res.user.email,
    name: res.user.fullName || res.user.name,
    role: res.user.role,
    title: res.user.title || payload.fullName,
    department: res.user.department,
    institution: res.user.institution,
    avatar: res.user.avatarUrl || res.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(res.user.email)}`,
  };
  setSession(user);
  return user;
}


