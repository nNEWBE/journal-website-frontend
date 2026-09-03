"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { PageContentCMSPanel } from "@/components/dashboard/admin/page-content-cms-panel";

export default function CMSPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <PageContentCMSPanel />
    </DashboardPageWrapper>
  );
}
