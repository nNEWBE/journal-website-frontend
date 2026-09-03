"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserManagementPanel } from "@/components/dashboard/admin/user-management-panel";

export default function UsersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard/users");
    } else if (user.role !== "admin" && user.role !== "super-admin") {
      router.replace("/dashboard/analytics");
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <UserManagementPanel currentUser={currentUser} />
    </div>
  );
}
