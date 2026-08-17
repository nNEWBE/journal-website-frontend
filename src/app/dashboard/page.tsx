"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.replace("/login");
    } else {
      router.replace(`/dashboard/${user.role || "author"}`);
    }
  }, [router]);

  return null;
}
