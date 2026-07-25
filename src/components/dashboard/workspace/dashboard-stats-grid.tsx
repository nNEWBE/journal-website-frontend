"use client";

import { StatCard } from "@/components/ui/stat-card";
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Submissions"
        value={total}
        icon={Layers}
        accent="blue"
      />
      <StatCard
        label="In Peer Review"
        value={underReview}
        icon={Search}
        accent="violet"
      />
      <StatCard
        label="Accepted / Published"
        value={accepted}
        icon={CheckCircle2}
        accent="green"
      />
      <StatCard
        label="Pending Revisions"
        value={revisions}
        icon={Clock}
        accent="amber"
      />
    </div>
  );
}
