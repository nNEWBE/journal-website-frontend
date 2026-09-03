"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { ManuscriptPipelinePanel } from "@/components/dashboard/admin/manuscript-pipeline-panel";

export default function PipelinePage() {
  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin", "editor"]}>
      <ManuscriptPipelinePanel />
    </DashboardPageWrapper>
  );
}
