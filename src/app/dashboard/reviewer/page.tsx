"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function ReviewerDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard/reviewer");
    } else if (user.role !== "reviewer" && user.role !== "super-admin") {
      router.replace("/dashboard/analytics");
    }
  }, [router]);

  return null;
}
