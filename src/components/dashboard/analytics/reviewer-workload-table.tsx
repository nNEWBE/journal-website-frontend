"use client";

import { Award, UserCheck } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface ReviewerPerformance {
  name: string;
  field: string;
  assigned: number;
  completed: number;
  avgDays: number;
  score: number;
}

const mockReviewers: ReviewerPerformance[] = [
  {
    name: "Dr. Salma Khatun",
    field: "Public Health",
    assigned: 14,
    completed: 13,
    avgDays: 12.4,
    score: 96,
  },
  {
    name: "Prof. Md. Kabir Hossain",
    field: "Pharmacy",
    assigned: 11,
    completed: 10,
    avgDays: 14.1,
    score: 92,
  },
  {
    name: "Dr. Ananya Roy",
    field: "Agriculture",
    assigned: 9,
    completed: 9,
    avgDays: 10.8,
    score: 98,
  },
  {
    name: "Dr. Tanvir Ahmed",
    field: "Microbiology",
    assigned: 8,
    completed: 7,
    avgDays: 15.2,
    score: 89,
  },
];

export function ReviewerWorkloadTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Reviewer Panel & Performance Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Active reviewers and average completion metrics
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800 border border-amber-200">
          <Award className="h-3 w-3 text-amber-600" />
          Verified Panel
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reviewer</TableHead>
            <TableHead>Discipline</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Avg Turnaround</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReviewers.map((r) => (
            <TableRow key={r.name}>
              <TableCell className="font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                {r.name}
              </TableCell>
              <TableCell className="font-medium text-slate-600">{r.field}</TableCell>
              <TableCell className="font-semibold text-slate-800">
                {r.completed} / {r.assigned}
              </TableCell>
              <TableCell className="font-mono text-slate-700">{r.avgDays}d</TableCell>
              <TableCell className="text-right font-extrabold text-emerald-700">
                {r.score}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
