"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
>

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config?: ChartConfig
  children: React.ReactElement
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line]:stroke-slate-100 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-300/60 [&_.recharts-dot[stroke='#fff']]:stroke-white [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-slate-200/60 [&_.recharts-radial-bar-background-sector]:fill-slate-100 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-slate-100/50 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-slate-200 [&_.recharts-sector[stroke='#fff']]:stroke-white [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

export function ChartTooltipContent({ active, payload, label, formatter, indicator = "dot" }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl ring-1 ring-slate-900/5 text-xs animate-in fade-in-50 zoom-in-95 min-w-[140px]">
      {label && <p className="font-black text-slate-900 mb-1.5 border-b border-slate-100 pb-1">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((item: any, index: number) => {
          const color = item.color || item.fill || "#1f2f82"
          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {indicator === "dot" && (
                  <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: color }} />
                )}
                <span className="text-slate-600 font-semibold text-[11px]">{item.name || item.dataKey}</span>
              </div>
              <span className="font-extrabold text-slate-900 font-mono text-[11px]">
                {formatter ? formatter(item.value, item.name, item) : item.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
