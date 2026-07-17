"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { PremiumLoader } from "@/components/ui/loader";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard");
    } else {
      setAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <PremiumLoader text="Verifying session…" />;
  }

  if (!authenticated) return null;

  return <DashboardWorkspace />;
}
