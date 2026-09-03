"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { PublicationsManagementPanel } from "@/components/dashboard/admin/publications-management-panel";

export default function PublicationsPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <PublicationsManagementPanel />
    </DashboardPageWrapper>
  );
}
