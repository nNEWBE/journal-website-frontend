"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function AuthorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard/author");
    } else if (user.role !== "author" && user.role !== "super-admin") {
      router.replace("/dashboard/analytics");
    }
  }, [router]);

  return null;
}
