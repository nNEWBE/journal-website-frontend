"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

export function Tabs({
  defaultValue,
  value: valueProp,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  const [valueState, setValueState] = React.useState(defaultValue || "")
  const value = valueProp !== undefined ? valueProp : valueState

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setValueState(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange]
  )

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 text-slate-500 border border-slate-200/60 shadow-xs",
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
  icon: Icon,
}: {
  value: string
  children: React.ReactNode
  className?: string
  icon?: React.ElementType
}) {
  const { value: selectedValue, onValueChange } = useTabs()
  const isSelected = selectedValue === value

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer select-none",
        isSelected
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900 hover:bg-white/50",
        className
      )}
    >
      {Icon && <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-[color:var(--color-gb-blue)]" : "text-slate-400")} />}
      <span>{children}</span>
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: selectedValue } = useTabs()
  if (selectedValue !== value) return null

  return <div className={cn("focus-visible:outline-none animate-in fade-in-50 duration-200", className)}>{children}</div>
}
