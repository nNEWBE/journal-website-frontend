"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  minWidth?: string | number;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, minWidth, style, ...props }, ref) => (
    <div className={cn("relative w-full overflow-x-auto scrollbar-none", containerClassName)}>
      <table
        ref={ref}
        style={{ minWidth, ...style }}
        className={cn("w-full border-collapse text-left text-xs", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border-b border-[color:var(--color-gb-border)] bg-[#f9fafc] text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-muted)]",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-[color:var(--color-gb-border)] text-xs", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[color:var(--color-gb-border)] bg-[#f9fafc] font-medium text-xs",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "group transition-colors hover:bg-[#f9fafc] data-[state=selected]:bg-blue-50/50",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-2.5 text-left align-middle font-black uppercase tracking-wider text-[10px] text-[color:var(--color-gb-muted)] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-xs text-[color:var(--color-gb-ink)] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-xs text-[color:var(--color-gb-muted)]", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export interface TableEmptyProps {
  colSpan: number;
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function TableEmpty({
  colSpan,
  icon: Icon,
  title,
  description,
  action,
  className,
}: TableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className={cn("py-14 px-6 text-center", className)}>
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          {Icon && (
            <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 shadow-xs">
              <Icon className="h-6 w-6 text-slate-400" />
            </div>
          )}
          <h4 className="text-sm font-bold text-[color:var(--color-gb-ink)] font-academic">
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-xs text-[color:var(--color-gb-muted)] leading-relaxed">
              {description}
            </p>
          )}
          {action && <div className="mt-3.5">{action}</div>}
        </div>
      </TableCell>
    </TableRow>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
