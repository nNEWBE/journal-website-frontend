import type { Metadata } from "next";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";

export const metadata: Metadata = {
  title: "Dashboard — GB Journal Workspace",
  description: "Manage submissions, peer reviews, and editorial workflows in the GB Journal workspace portal.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardWorkspace>{children}</DashboardWorkspace>;
}
