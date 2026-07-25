"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function AnalyticsDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard/analytics");
    }
  }, [router]);

  return null;
}
