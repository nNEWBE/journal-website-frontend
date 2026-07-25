"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle2, FileText, RefreshCw, XCircle } from "lucide-react";
import type { Submission } from "@/lib/data";

interface AcceptanceRateCardProps {
  submissions: Submission[];
}

const COLORS = ["#059669", "#1f2f82", "#d97706", "#e11d48"];

export function AcceptanceRateCard({ submissions }: AcceptanceRateCardProps) {
  const accepted = submissions.filter(
    (s) => s.status === "Accepted" || s.status === "Published"
  ).length;
  const underReview = submissions.filter(
    (s) => s.status === "Under Review" || s.status === "In Desk Review"
  ).length;
  const revisions = submissions.filter(
    (s) => s.status === "Revisions Requested" || s.status === "Revision Requested"
  ).length;
  const rejected = submissions.filter((s) => s.status === "Rejected").length;

  const data = [
    { name: "Accepted", value: accepted || 4 },
    { name: "Under Review", value: underReview || 3 },
    { name: "Revisions", value: revisions || 2 },
    { name: "Rejected", value: rejected || 1 },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const acceptanceRate = Math.round((data[0].value / (total || 1)) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Acceptance Rate & Pipeline Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Overall acceptance ratio: <strong className="text-emerald-700">{acceptanceRate}%</strong>
          </p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2 text-emerald-800 font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Accepted: {data[0].value}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2 text-blue-800 font-semibold">
          <FileText className="h-3.5 w-3.5" />
          <span>Under Review: {data[1].value}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-amber-800 font-semibold">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Revisions: {data[2].value}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-rose-800 font-semibold">
          <XCircle className="h-3.5 w-3.5" />
          <span>Rejected: {data[3].value}</span>
        </div>
      </div>
    </div>
  );
}
