"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard/admin");
    } else if (user.role !== "admin" && user.role !== "super-admin") {
      router.replace("/dashboard/analytics");
    }
  }, [router]);

  return null;
}
