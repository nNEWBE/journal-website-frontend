"use client";

import { useMemo, useState } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, FileText, BookOpen, Users,
  Clock, CheckCircle2, Award, Activity, Globe, BarChart2,
  PieChart as PieIcon, Target, ShieldCheck, ArrowUpRight,
  Filter, Sparkles, Layers,
} from "lucide-react";
import { type Submission } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const C = {
  blue:   "#1f2f82",
  green:  "#059669",
  amber:  "#d97706",
  violet: "#7c3aed",
  rose:   "#e11d48",
  cyan:   "#0891b2",
  slate:  "#64748b",
};
const PIE_COLORS = [C.blue, C.green, C.amber, C.violet, C.rose, C.cyan, C.slate];

// ─── Shadcn Stat Card ─────────────────────────────────────────────────────────
function StatCard({
  title, value, description, icon: Icon, color, trend, trendUp,
}: {
  title: string; value: string | number; description?: string;
  icon: React.ElementType; color: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold shadow-2xs"
          style={{ background: color + "14", color }}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-black ${trendUp ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-rose-50 text-rose-600 border border-rose-200/60"}`}>
            {trendUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-black tracking-tight text-slate-900 leading-none">{value}</p>
        <p className="mt-1 text-[11px] font-bold text-slate-600">{title}</p>
        {description && <p className="mt-0.5 text-[10px] text-slate-400 font-medium">{description}</p>}
      </div>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function AnalyticsPanel({ submissions }: { submissions: Submission[] }) {
  const [tab, setTab] = useState("overview");

  const s = useMemo(() => {
    const total       = submissions.length;
    const published   = submissions.filter(x => x.status === "Published").length;
    const accepted    = submissions.filter(x => x.status === "Accepted").length;
    const underReview = submissions.filter(x => x.status === "Under Review").length;
    const revisions   = submissions.filter(x => x.status === "Revision Requested").length;
    const avgScore    = total ? Math.round(submissions.reduce((a, b) => a + b.score, 0) / total) : 0;
    const uniqueAuthors   = new Set(submissions.map(x => x.author)).size;
    const uniqueReviewers = new Set(submissions.flatMap(x => x.reviewers)).size;

    const statusCounts: Record<string, number> = {};
    submissions.forEach(x => { statusCounts[x.status] = (statusCounts[x.status] ?? 0) + 1; });
    const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const typeCounts: Record<string, number> = {};
    submissions.forEach(x => { typeCounts[x.type] = (typeCounts[x.type] ?? 0) + 1; });
    const typeData = Object.entries(typeCounts).map(([label, value]) => ({ label, value }));

    const buckets = [
      { range: "60–69", count: 0 },
      { range: "70–74", count: 0 },
      { range: "75–79", count: 0 },
      { range: "80–84", count: 0 },
      { range: "85–89", count: 0 },
      { range: "90+",   count: 0 },
    ];
    submissions.forEach(x => {
      if      (x.score < 70) buckets[0].count++;
      else if (x.score < 75) buckets[1].count++;
      else if (x.score < 80) buckets[2].count++;
      else if (x.score < 85) buckets[3].count++;
      else if (x.score < 90) buckets[4].count++;
      else                   buckets[5].count++;
    });

    const editorMap: Record<string, number> = {};
    submissions.forEach(x => { editorMap[x.editor] = (editorMap[x.editor] ?? 0) + 1; });
    const editorData = Object.entries(editorMap)
      .map(([name, count]) => ({ name: name.replace("Prof. Dr. ", "").replace("Prof. ", "").replace("Dr. ", ""), count }))
      .sort((a, b) => b.count - a.count);

    const reviewerMap: Record<string, number> = {};
    submissions.forEach(x => x.reviewers.forEach(r => { reviewerMap[r] = (reviewerMap[r] ?? 0) + 1; }));
    const reviewerData = Object.entries(reviewerMap)
      .map(([name, count]) => ({ name: name.replace("Prof. Dr. ", "").replace("Prof. ", "").replace("Dr. ", ""), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const monthlyTrend = [
      { month: "Feb", Submitted: 2, Published: 0, Revisions: 0 },
      { month: "Mar", Submitted: 3, Published: 1, Revisions: 0 },
      { month: "Apr", Submitted: 4, Published: 1, Revisions: 1 },
      { month: "May", Submitted: 3, Published: 2, Revisions: 0 },
      { month: "Jun", Submitted: 5, Published: 2, Revisions: 1 },
      { month: "Jul", Submitted: total, Published: published, Revisions: revisions },
    ];

    const scoreTrend = [
      { month: "Feb", score: 72 },
      { month: "Mar", score: 74 },
      { month: "Apr", score: 71 },
      { month: "May", score: 76 },
      { month: "Jun", score: 78 },
      { month: "Jul", score: avgScore },
    ];

    const radarData = [
      { metric: "Avg Score",   value: avgScore },
      { metric: "Published %", value: total ? Math.round((published / total) * 100) : 0 },
      { metric: "Accepted %",  value: total ? Math.round(((accepted + published) / total) * 100) : 0 },
      { metric: "Revision %",  value: total ? Math.round((revisions / total) * 100) : 0 },
      { metric: "Throughput",  value: Math.min(100, total * 14) },
      { metric: "Coverage",    value: Math.min(100, uniqueReviewers * 22) },
    ];

    return { total, published, accepted, underReview, revisions, avgScore,
      uniqueAuthors, uniqueReviewers, pieData, typeData, buckets,
      editorData, reviewerData, monthlyTrend, scoreTrend, radarData };
  }, [submissions]);

  return (
    <div className="p-4 pb-10 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Journal Analytics</h1>
            <Badge variant="info" icon={<Activity />}>Shadcn Recharts</Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time peer-review metrics across {s.total} manuscripts · {s.uniqueAuthors} active authors · {s.uniqueReviewers} reviewers
          </p>
        </div>

        <Badge variant="success">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
          Live Telemetry Active
        </Badge>
      </div>

      {/* Tabs list */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-slate-100/80 p-1 border border-slate-200">
          <TabsTrigger value="overview" icon={BarChart2}>Overview</TabsTrigger>
          <TabsTrigger value="submissions" icon={FileText}>Submissions</TabsTrigger>
          <TabsTrigger value="reviewers" icon={Users}>Reviewer Pool</TabsTrigger>
          <TabsTrigger value="editorial" icon={ShieldCheck}>Editorial Workload</TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW TAB ──────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard title="Total Manuscripts" value={s.total}           icon={FileText}     color={C.blue}   trend="+12%" trendUp />
            <StatCard title="Under Review"      value={s.underReview}    icon={Clock}        color={C.violet} trend="+2"   trendUp />
            <StatCard title="Accepted"          value={s.accepted}       icon={CheckCircle2} color={C.green}  trend="+3"   trendUp />
            <StatCard title="Published"         value={s.published}      icon={BookOpen}     color={C.amber}  trend="+1"   trendUp />
            <StatCard title="Avg. Evaluation"   value={s.avgScore}       icon={Award}        color={C.cyan}   description="out of 100" />
            <StatCard title="Active Reviewers"  value={s.uniqueReviewers}icon={Users}        color={C.rose}   trend="+1"   trendUp />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            {/* Smooth Recharts Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <TrendingUp className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Submission & Publication Pipeline
                </CardTitle>
                <CardDescription>Monthly volume trajectory with smooth bezier curve interpolation</CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] pt-2">
                <ChartContainer className="h-full w-full">
                  <AreaChart data={s.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={C.green} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="Submitted" stroke={C.blue} strokeWidth={3} fill="url(#colorSubmitted)" activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="Published" stroke={C.green} strokeWidth={3} fill="url(#colorPublished)" activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recharts Donut Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <PieIcon className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Status Breakdown
                </CardTitle>
                <CardDescription>Current manuscript review distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative h-[170px] w-full">
                  <ChartContainer className="h-full w-full">
                    <PieChart>
                      <Pie
                        data={s.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={78}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                      >
                        {s.pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-slate-900">{s.total}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                  </div>
                </div>
                <div className="w-full mt-2 space-y-1.5 border-t border-slate-100 pt-3">
                  {s.pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-slate-600 font-semibold truncate max-w-[150px]">{d.name}</span>
                      </div>
                      <span className="font-black text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recharts Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Activity className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Journal Performance Radar
                </CardTitle>
                <CardDescription>Holistic health index evaluation across 6 key metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] flex justify-center py-2">
                <ChartContainer className="h-full w-full">
                  <RadarChart data={s.radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }} />
                    <Radar name="Index" dataKey="value" stroke={C.blue} fill={C.blue} fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recharts Score Trajectory Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <TrendingUp className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Score Trajectory Over Time
                </CardTitle>
                <CardDescription>Mean peer-review score progression (6-month history)</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] pt-2">
                <ChartContainer className="h-full w-full">
                  <AreaChart data={s.scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.cyan} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={C.cyan} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="score" stroke={C.cyan} strokeWidth={3} fill="url(#colorScore)" activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── SUBMISSIONS TAB ───────────────────────────────────────────── */}
        <TabsContent value="submissions" className="space-y-6 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recharts Category Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Globe className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Submissions by Category
                </CardTitle>
                <CardDescription>Distribution of submitted research article types</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] pt-2">
                <ChartContainer className="h-full w-full">
                  <BarChart data={s.typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Articles" fill={C.amber} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recharts Score Histogram Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Target className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Peer Review Score Distribution
                </CardTitle>
                <CardDescription>Histogram of manuscript score evaluations</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] pt-2">
                <ChartContainer className="h-full w-full">
                  <BarChart data={s.buckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Manuscripts" fill={C.blue} radius={[8, 8, 0, 0]}>
                      {s.buckets.map((_, i) => (
                        <Cell key={i} fill={i < 2 ? C.rose : i < 4 ? C.amber : C.green} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-black text-slate-900">Live Pipeline Manuscripts</CardTitle>
              <CardDescription>Detailed overview of active records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Author</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[color:var(--color-gb-red)]">{sub.id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 max-w-[260px] truncate">{sub.title}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">{sub.author}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-medium">{sub.type}</td>
                        <td className="py-2.5 px-3 font-black text-[color:var(--color-gb-blue)]">{sub.score}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── REVIEWERS TAB ─────────────────────────────────────────────── */}
        <TabsContent value="reviewers" className="space-y-6 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recharts Vertical Layout Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Users className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Reviewer Assignment Workload
                </CardTitle>
                <CardDescription>Number of active peer-review assignments per reviewer</CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] pt-2">
                <ChartContainer className="h-full w-full">
                  <BarChart data={s.reviewerData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Assignments" fill={C.violet} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Award className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Review Performance & Quality
                </CardTitle>
                <CardDescription>Overview of active reviewers in the board pool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Total Reviewer Board Pool</p>
                    <p className="text-[11px] text-slate-500 font-medium">Qualified academic reviewers assigned</p>
                  </div>
                  <span className="text-xl font-black text-[color:var(--color-gb-blue)]">{s.uniqueReviewers}</span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Average Turnaround Time</p>
                    <p className="text-[11px] text-slate-500 font-medium">From assignment to submitted review</p>
                  </div>
                  <span className="text-xl font-black text-emerald-600">14.2 Days</span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Double-Blind Compliance</p>
                    <p className="text-[11px] text-slate-500 font-medium">Anonymity protocol adherence</p>
                  </div>
                  <span className="text-xl font-black text-indigo-600">100%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── EDITORIAL TAB ─────────────────────────────────────────────── */}
        <TabsContent value="editorial" className="space-y-6 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recharts Editor Workload Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <BarChart2 className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Editor Workload Distribution
                </CardTitle>
                <CardDescription>Assigned manuscripts per section editor</CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] pt-2">
                <ChartContainer className="h-full w-full">
                  <BarChart data={s.editorData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Manuscripts" fill={C.blue} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  Editorial Decision Throughput
                </CardTitle>
                <CardDescription>Key editorial efficiency indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Acceptance Rate</p>
                    <p className="text-[11px] text-slate-500 font-medium">Ratio of accepted + published to total</p>
                  </div>
                  <span className="text-xl font-black text-emerald-600">
                    {s.total ? Math.round(((s.accepted + s.published) / s.total) * 100) : 0}%
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Revision Request Rate</p>
                    <p className="text-[11px] text-slate-500 font-medium">Manuscripts requiring author revision</p>
                  </div>
                  <span className="text-xl font-black text-amber-600">
                    {s.total ? Math.round((s.revisions / s.total) * 100) : 0}%
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Plagiarism Screening Pass Rate</p>
                    <p className="text-[11px] text-slate-500 font-medium">Crossref similarity index compliance</p>
                  </div>
                  <span className="text-xl font-black text-blue-600">98.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
