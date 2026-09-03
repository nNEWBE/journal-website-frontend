"use client";

import { DashboardPageWrapper } from "@/components/dashboard/dashboard-page-wrapper";
import { ProfilePanel } from "@/components/dashboard/profile-panel";

export default function ProfilePage() {
  return (
    <DashboardPageWrapper className="p-0">
      {(user) => <ProfilePanel user={user} />}
    </DashboardPageWrapper>
  );
}
