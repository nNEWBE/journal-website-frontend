"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ManuscriptPipelinePanel } from "@/components/dashboard/admin/manuscript-pipeline-panel";

export default function PipelinePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getSession();
    if (!user) {
      router.push("/login?redirect=/dashboard/pipeline");
    } else if (
      user.role !== "admin" &&
      user.role !== "super-admin" &&
      user.role !== "editor"
    ) {
      router.replace("/dashboard/analytics");
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
      <ManuscriptPipelinePanel />
    </div>
  );
}
