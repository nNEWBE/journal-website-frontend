"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { BoardManagementPanel } from "@/components/dashboard/admin/board-management-panel";

export default function BoardPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <BoardManagementPanel />
    </DashboardPageWrapper>
  );
}
