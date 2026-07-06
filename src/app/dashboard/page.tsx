"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";

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
    return (
      <div className="journal-shell min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--university-green)] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-bold text-[color:var(--ink-muted)]">Verifying session credentials...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect
  }

  return <DashboardWorkspace />;
}
