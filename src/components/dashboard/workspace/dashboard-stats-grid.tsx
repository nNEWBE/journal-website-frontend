"use client";

import { KpiStatCard } from "@/components/dashboard/kpi-stat-card";
import {
  CheckCircle2,
  Clock,
  Layers,
  Search,
} from "lucide-react";
import type { Submission } from "@/lib/data";

interface DashboardStatsGridProps {
  submissions: Submission[];
}

export function DashboardStatsGrid({ submissions }: DashboardStatsGridProps) {
  const total = submissions.length;
  const underReview = submissions.filter(
    (s) => s.status === "Under Review" || s.status === "In Desk Review"
  ).length;
  const accepted = submissions.filter(
    (s) => s.status === "Accepted" || s.status === "Published"
  ).length;
  const revisions = submissions.filter(
    (s) => s.status === "Revisions Requested" || s.status === "Revision Requested"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      <KpiStatCard
        label="Total Submissions"
        value={total}
        icon={Layers}
        accent="blue"
      />
      <KpiStatCard
        label="In Peer Review"
        value={underReview}
        icon={Search}
        accent="indigo"
      />
      <KpiStatCard
        label="Accepted / Published"
        value={accepted}
        icon={CheckCircle2}
        accent="emerald"
      />
      <KpiStatCard
        label="Pending Revisions"
        value={revisions}
        icon={Clock}
        accent="amber"
      />
    </div>
  );
}
