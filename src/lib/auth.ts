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

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    console.error("Failed to retrieve auth session", e);
    return null;
  }
}

export function setSession(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to store auth session", e);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
    clearTokens();
  } catch (e) {
    console.error("Failed to clear auth session", e);
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


