"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { NavigationManagementPanel } from "@/components/dashboard/admin/navigation-management-panel";

export default function NavigationManagementPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <NavigationManagementPanel />
    </DashboardPageWrapper>
  );
}
