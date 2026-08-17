import { type Role } from "./data";
import { authApi, setTokens, clearTokens } from "./api";

export interface User {
  id?: string | number;
  email: string;
  name: string;
  role: Role;
  title: string;
  academicTitle?: string;
  department?: string;
  institution?: string;
  avatar?: string;
  phone?: string;
  secondaryEmail?: string;
  country?: string;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  scopusId?: string;
  bio?: string;
  researchInterests?: string[];
  reviewerAvailable?: boolean;
  maxReviewLoad?: number;
  emailNotifications?: {
    decisions: boolean;
    invitations: boolean;
    publications: boolean;
  };
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

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
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

  try {
    const token = parseCookie("access_token") || parseCookie("gb_access_token");
    if (token) {
      const jwt = parseJwt(token);
      if (jwt && jwt.sub) {
        const user: User = {
          email: jwt.sub,
          name:
            jwt.name ||
            jwt.sub
              .split("@")[0]
              .replace(/[._]/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase()),
          role: jwt.role || "author",
          title: "Academic Member",
          department: "Department of Pharmacy",
          institution: "Gono Bishwabidyalay",
        };
        inMemoryUser = user;
        return inMemoryUser;
      }
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
      document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `gb_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `gb_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      authApi.logout().catch(() => {});
    } catch (e) {
      console.error("Failed to clear auth session", e);
    }
  }
}

let isHandlingSessionExpiry = false;

/**
 * Automatically logs the user out in real time and redirects to login with an expired notice.
 */
export function handleSessionExpired(): void {
  if (typeof window === "undefined" || isHandlingSessionExpiry) return;
  isHandlingSessionExpiry = true;

  clearSession();

  if (window.location.pathname === "/login") {
    isHandlingSessionExpiry = false;
    return;
  }

  // Real-time automatic logout redirection
  window.location.href = "/login?expired=1";
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
    avatar:
      res.user.avatarUrl ||
      res.user.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        res.user.email
      )}&mouth=default,smile&eyes=default&eyebrows=defaultNatural,default&clothing=blazerAndShirt,blazerAndSweater,collarAndSweater`,
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
    avatar:
      res.user.avatarUrl ||
      res.user.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        res.user.email
      )}&mouth=default,smile&eyes=default&eyebrows=defaultNatural,default&clothing=blazerAndShirt,blazerAndSweater,collarAndSweater`,
  };
  setSession(user);
  return user;
}


