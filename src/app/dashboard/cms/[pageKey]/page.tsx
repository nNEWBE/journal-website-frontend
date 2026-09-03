"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { PageContentCMSPanel } from "@/components/dashboard/admin/page-content-cms-panel";

export default function CMSDynamicPage() {
  const params = useParams();
  const pageKey = (params?.pageKey as string) || "home";

  return (
    <DashboardPageWrapper allowedRoles={["admin", "super-admin"]}>
      <PageContentCMSPanel initialPageKey={pageKey} />
    </DashboardPageWrapper>
  );
}
