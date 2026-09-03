"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { IssueManagementPanel } from "@/components/dashboard/admin/issue-management-panel";

export default function IssuesPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <IssueManagementPanel />
    </DashboardPageWrapper>
  );
}
