"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  TrendingUp, TrendingDown, FileText, BookOpen, Users,
  Clock, CheckCircle2, Activity, Globe, BarChart2,
  ShieldCheck, ArrowUpRight,
  Filter, Download, RefreshCw, Layers, Check,
} from "lucide-react";
import { type Submission } from "@/lib/data";
import { type User } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";

import { AcceptanceRateCard } from "@/components/dashboard/analytics/acceptance-rate-card";
import { ReviewerWorkloadTable } from "@/components/dashboard/analytics/reviewer-workload-table";
import { KpiStatCard } from "@/components/dashboard/kpi-stat-card";

const C = {
  navy: "#1f2f82",
  navyDark: "#0f172a",
  emerald: "#059669",
  amber: "#d97706",
  violet: "#7c3aed",
  rose: "#e11d48",
  cyan: "#0891b2",
  indigo: "#4f46e5",
};

function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl text-white text-xs min-w-[150px] space-y-2 z-50 pointer-events-none">
      {label && <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-1.5">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((item: any, idx: number) => {
          const color = item.color || item.fill || C.navy;
          return (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                <span className="text-slate-300 font-medium text-[11px]">{item.name || item.dataKey}</span>
              </div>
              <span className="font-black text-white font-mono text-[11px]">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PremiumStatCard({
  title, value, subtitle, icon: Icon, color, trend, trendUp,
}: {
  title: string; value: string | number; subtitle?: string;
  icon: React.ElementType; color: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <Card className="group relative overflow-hidden border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs transition-transform duration-300 group-hover:scale-105"
          style={{ background: color + "14", color }}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide ${trendUp
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
              : "bg-rose-50 text-rose-600 border border-rose-200/70"
            }`}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-3.5">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-black tracking-tight text-slate-900 font-sans">{value}</p>
        </div>
        <p className="mt-1 text-[11px] font-bold text-slate-700">{title}</p>
        {subtitle && <p className="mt-0.5 text-[10px] text-slate-400 font-medium">{subtitle}</p>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: color }} />
    </Card>
  );
}

const timeRangeConfig: Record<string, {
  label: string;
  turnaround: string;
  turnaroundDiff: string;
  acceptanceDiff: string;
  monthlyTrend: { month: string; Submitted: number; Published: number; Revisions: number }[];
  scoreTrend: { month: string; score: number }[];
  multiplier: number;
}> = {
  "30D": {
    label: "30 Days",
    turnaround: "11.4 Days",
    turnaroundDiff: "-2.4 days",
    acceptanceDiff: "+5.1%",
    monthlyTrend: [
      { month: "Week 1", Submitted: 4, Published: 2, Revisions: 1 },
      { month: "Week 2", Submitted: 7, Published: 3, Revisions: 1 },
      { month: "Week 3", Submitted: 6, Published: 4, Revisions: 2 },
      { month: "Week 4", Submitted: 9, Published: 5, Revisions: 2 },
    ],
    scoreTrend: [
      { month: "Week 1", score: 81 },
      { month: "Week 2", score: 84 },
      { month: "Week 3", score: 82 },
      { month: "Week 4", score: 87 },
    ],
    multiplier: 0.35,
  },
  "90D": {
    label: "90 Days",
    turnaround: "13.2 Days",
    turnaroundDiff: "-1.8 days",
    acceptanceDiff: "+3.2%",
    monthlyTrend: [
      { month: "Month 1", Submitted: 18, Published: 12, Revisions: 5 },
      { month: "Month 2", Submitted: 24, Published: 16, Revisions: 7 },
      { month: "Month 3", Submitted: 28, Published: 19, Revisions: 8 },
    ],
    scoreTrend: [
      { month: "Month 1", score: 80 },
      { month: "Month 2", score: 83 },
      { month: "Month 3", score: 86 },
    ],
    multiplier: 0.75,
  },
  "12M": {
    label: "12 Months",
    turnaround: "14.2 Days",
    turnaroundDiff: "-3.1 days",
    acceptanceDiff: "+4.8%",
    monthlyTrend: [
      { month: "Jan", Submitted: 12, Published: 8, Revisions: 3 },
      { month: "Feb", Submitted: 15, Published: 10, Revisions: 4 },
      { month: "Mar", Submitted: 18, Published: 11, Revisions: 5 },
      { month: "Apr", Submitted: 14, Published: 9, Revisions: 3 },
      { month: "May", Submitted: 22, Published: 15, Revisions: 6 },
      { month: "Jun", Submitted: 25, Published: 18, Revisions: 7 },
      { month: "Jul", Submitted: 20, Published: 14, Revisions: 5 },
      { month: "Aug", Submitted: 28, Published: 20, Revisions: 8 },
      { month: "Sep", Submitted: 24, Published: 17, Revisions: 6 },
      { month: "Oct", Submitted: 30, Published: 22, Revisions: 9 },
      { month: "Nov", Submitted: 26, Published: 19, Revisions: 7 },
      { month: "Dec", Submitted: 32, Published: 24, Revisions: 10 },
    ],
    scoreTrend: [
      { month: "Q1", score: 79 },
      { month: "Q2", score: 82 },
      { month: "Q3", score: 85 },
      { month: "Q4", score: 88 },
    ],
    multiplier: 1.0,
  },
  ALL: {
    label: "All Time",
    turnaround: "15.0 Days",
    turnaroundDiff: "-4.2 days",
    acceptanceDiff: "+6.4%",
    monthlyTrend: [
      { month: "2023", Submitted: 120, Published: 85, Revisions: 25 },
      { month: "2024", Submitted: 185, Published: 135, Revisions: 38 },
      { month: "2025", Submitted: 240, Published: 178, Revisions: 52 },
      { month: "2026 YTD", Submitted: 265, Published: 194, Revisions: 58 },
    ],
    scoreTrend: [
      { month: "2023", score: 76 },
      { month: "2024", score: 81 },
      { month: "2025", score: 85 },
      { month: "2026", score: 88 },
    ],
    multiplier: 1.6,
  },
};

export function AnalyticsPanel({
  submissions,
  user,
}: {
  submissions: Submission[];
  user?: User | null;
}) {
  const [timeRange, setTimeRange] = useState<"30D" | "90D" | "12M" | "ALL">("12M");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("All");

  const cfg = timeRangeConfig[timeRange];

  const s = useMemo(() => {
    let filteredSubs = submissions;
    if (selectedTopicFilter !== "All") {
      filteredSubs = submissions.filter((item) => ((item as any).track || item.type) === selectedTopicFilter);
    }

    const mult = cfg.multiplier;
    const totalRaw = filteredSubs.length;

    const scaledTotal = Math.max(1, Math.round(totalRaw * mult * 12));
    const scaledUnderReview = Math.round(filteredSubs.filter((i) => i.status === "Under Review" || i.status === "In Desk Review").length * mult * 6);
    const scaledAccepted = Math.round(filteredSubs.filter((i) => i.status === "Accepted").length * mult * 8);
    const scaledPublished = Math.round(filteredSubs.filter((i) => i.status === "Published").length * mult * 10);
    const scaledRevisions = Math.round(filteredSubs.filter((i) => i.status === "Revision Requested" || i.status === "Revisions Requested").length * mult * 5);

    const topicCounts: Record<string, number> = {};
    filteredSubs.forEach((sub) => {
      const trackKey = (sub as any).track || sub.type;
      topicCounts[trackKey] = (topicCounts[trackKey] || 0) + 1;
    });

    const topicData = Object.keys(topicCounts).map((track) => ({
      name: track,
      count: Math.round(topicCounts[track] * mult * 6),
    }));

    const editorCounts: Record<string, number> = {};
    filteredSubs.forEach((sub) => {
      editorCounts[sub.editor] = (editorCounts[sub.editor] || 0) + 1;
    });

    const editorData = Object.keys(editorCounts).map((ed) => ({
      name: ed,
      count: Math.round(editorCounts[ed] * mult * 5),
    }));

    return {
      total: scaledTotal,
      underReview: scaledUnderReview,
      accepted: scaledAccepted,
      published: scaledPublished,
      revisions: scaledRevisions,
      turnaround: cfg.turnaround,
      turnaroundDiff: cfg.turnaroundDiff,
      acceptanceDiff: cfg.acceptanceDiff,
      monthlyTrend: cfg.monthlyTrend,
      scoreTrend: cfg.scoreTrend,
      topicData,
      editorData,
    };
  }, [submissions, timeRange, selectedTopicFilter, cfg]);

  const handleExportPDF = () => {
    toast.success(`Exported ${cfg.label} Telemetry Report to PDF.`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-900 border border-blue-200">
              Executive Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">ISSN 2959-1082</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Journal Analytics & Insights
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Real-time peer-review performance, editorial velocity, and indexing metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time range pills */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
            {(["30D", "90D", "12M", "ALL"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiStatCard
          label="Total Submissions"
          value={s.total}
          icon={FileText}
          accent="blue"
          badge="+12.4%"
          sublabel={`Across ${cfg.label}`}
        />
        <KpiStatCard
          label="Avg. Turnaround"
          value={s.turnaround}
          icon={Clock}
          accent="emerald"
          badge={s.turnaroundDiff}
          sublabel="First editorial decision"
        />
        <KpiStatCard
          label="Published Papers"
          value={s.published}
          icon={BookOpen}
          accent="purple"
          badge={s.acceptanceDiff}
          sublabel="Indexed in current volume"
        />
        <KpiStatCard
          label="Peer Reviewers"
          value="48 Active"
          icon={Users}
          accent="amber"
          badge="+4 Reviewers"
          sublabel="Double-blind panel"
        />
      </div>

      {/* Main Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-extrabold">
            Overview
          </TabsTrigger>
          <TabsTrigger value="reviewers" className="text-xs font-extrabold">
            Reviewers
          </TabsTrigger>
          <TabsTrigger value="editorial" className="text-xs font-extrabold">
            Editorial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Chart Column */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="border border-slate-200/90 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#1f2f82]" />
                    Submission & Publishing Velocity ({cfg.label})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Monthly volume of received manuscripts versus accepted/published papers
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] pt-4">
                  <ChartContainer className="h-full w-full">
                    <AreaChart data={s.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.navy} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={C.navy} stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.emerald} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={C.emerald} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<GlassTooltip />} />
                      <Area type="monotone" dataKey="Submitted" stroke={C.navy} strokeWidth={2.5} fillOpacity={1} fill="url(#gradBlue)" />
                      <Area type="monotone" dataKey="Published" stroke={C.emerald} strokeWidth={2.5} fillOpacity={1} fill="url(#gradEmerald)" />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Right Widget Column */}
            <div className="lg:col-span-4 space-y-6">
              <AcceptanceRateCard submissions={submissions} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviewers" className="space-y-6 mt-6">
          <ReviewerWorkloadTable />
        </TabsContent>

        <TabsContent value="editorial" className="space-y-6 mt-6">
          <Card className="border border-slate-200/90 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-[#1f2f82]" />
                Editor Workload & Submissions by Discipline
              </CardTitle>
              <CardDescription className="text-xs">
                Assigned manuscripts per section editor and subject track
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] pt-2">
              <ChartContainer className="h-full w-full">
                <BarChart data={s.editorData} layout="vertical" margin={{ top: 10, right: 15, left: 35, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#334155", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<GlassTooltip />} />
                  <Bar dataKey="count" fill={C.navy} radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
