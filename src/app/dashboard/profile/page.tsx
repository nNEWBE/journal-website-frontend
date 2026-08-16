"use client";

import { useAppSelector } from "@/redux/hooks";
import { ProfilePanel } from "@/components/dashboard/profile-panel";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  return <ProfilePanel user={user} />;
}
