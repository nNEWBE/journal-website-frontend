"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { UserManagementPanel } from "@/components/dashboard/admin/user-management-panel";

export default function UsersPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      {(user) => <UserManagementPanel currentUser={user as any} />}
    </DashboardPageWrapper>
  );
}
