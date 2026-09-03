"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { MailingCenterPanel } from "@/components/dashboard/admin/mailing-center-panel";

export default function MailingPage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <MailingCenterPanel />
    </DashboardPageWrapper>
  );
}
