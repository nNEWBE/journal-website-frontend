import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SESSION_KEY, type User } from "@/lib/auth";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | GB Journal Workspace",
    template: "%s | GB Journal Workspace",
  },
  description: "Manage submissions, peer reviews, and editorial workflows in the GB Journal workspace portal.",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_KEY)?.value;
  let initialUser: User | null = null;
  if (sessionCookie) {
    try {
      const decoded = sessionCookie.startsWith("%")
        ? decodeURIComponent(sessionCookie)
        : sessionCookie;
      initialUser = JSON.parse(decoded);
    } catch {
      try {
        initialUser = JSON.parse(decodeURIComponent(sessionCookie));
      } catch {}
    }
  }

  return <DashboardWorkspace initialUser={initialUser}>{children}</DashboardWorkspace>;
}

