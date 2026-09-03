"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { SubmissionWizard } from "@/components/dashboard/submission-wizard";

export default function NewSubmissionPage() {
  return (
    <DashboardPageWrapper className="p-0">
      <SubmissionWizard />
    </DashboardPageWrapper>
  );
}
