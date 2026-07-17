import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — GB Journal Workspace",
  description: "Manage submissions, peer reviews, and editorial workflows in the GB Journal workspace portal.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
