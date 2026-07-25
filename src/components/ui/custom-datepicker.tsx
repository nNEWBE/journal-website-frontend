"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  className,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [isMounted, setIsMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse current date or default to today
  const parsedDate = value ? new Date(value) : new Date();
  const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth()); // 0-indexed

  // Only mount portal on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Position the popover based on button's screen coordinates.
  // IMPORTANT: use clientWidth (excludes scrollbar) NOT innerWidth to prevent layout shift / page shake.
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // clientWidth excludes the scrollbar — avoids the ~15px shake
      const clientWidth = document.documentElement.clientWidth;
      const calendarHeight = 330;
      const spaceBelow = viewportHeight - rect.bottom;
      const openUpward = spaceBelow < calendarHeight && rect.top >= calendarHeight;

      if (openUpward) {
        setPopoverStyle({
          position: "fixed",
          bottom: viewportHeight - rect.top + 6,
          right: clientWidth - rect.right,
          zIndex: 99999,
        });
      } else {
        setPopoverStyle({
          position: "fixed",
          top: rect.bottom + 6,
          right: clientWidth - rect.right,
          zIndex: 99999,
        });
      }
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on scroll/resize to avoid stale positioning
  useEffect(() => {
    if (!isOpen) return;
    function handleClose() { setIsOpen(false); }
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [isOpen]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handleSelectDay(day: number) {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    onChange(`${currentYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  }

  function setPresetDays(offset: number) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, "0");
    const dStr = String(d.getDate()).padStart(2, "0");
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
  }

  // Build calendar grid
  const daysGrid: { day: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysGrid.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push({ day: i, isCurrentMonth: true });
  }

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "Pick date";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const calendarPopover = isMounted && isOpen ? createPortal(
    <div
      ref={popoverRef}
      style={popoverStyle}
      className="w-[280px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/5"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-black text-[color:var(--green-dark)]">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mt-2 text-center text-[10px] font-black uppercase text-slate-400">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 mt-1 text-center text-xs">
        {daysGrid.map((item, index) => {
          const formattedMonth = String(currentMonth + 1).padStart(2, "0");
          const formattedDay = String(item.day).padStart(2, "0");
          const checkStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
          const isSelected = item.isCurrentMonth && checkStr === value;

          return (
            <button
              key={index}
              type="button"
              onClick={() => item.isCurrentMonth && handleSelectDay(item.day)}
              disabled={!item.isCurrentMonth}
              className={cn(
                "h-7 w-7 rounded-md font-semibold text-slate-700 transition-colors flex items-center justify-center cursor-pointer mx-auto",
                !item.isCurrentMonth && "text-slate-300 pointer-events-none cursor-default",
                item.isCurrentMonth && "hover:bg-slate-50",
                isSelected && "bg-[color:var(--university-green)] text-white hover:bg-[color:var(--university-green)] font-extrabold shadow-sm"
              )}
            >
              {item.day}
            </button>
          );
        })}
      </div>

      {/* Presets footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-center">
        <button
          type="button"
          onClick={() => setPresetDays(14)}
          className="rounded border border-slate-200 bg-slate-50 hover:bg-[color:var(--green-soft)] hover:text-[color:var(--green-dark)] p-1 text-[9px] font-bold text-slate-600 transition-colors cursor-pointer"
        >
          +14 days (Review due)
        </button>
        <button
          type="button"
          onClick={() => setPresetDays(30)}
          className="rounded border border-slate-200 bg-slate-50 hover:bg-[color:var(--green-soft)] hover:text-[color:var(--green-dark)] p-1 text-[9px] font-bold text-slate-600 transition-colors cursor-pointer"
        >
          +30 days (Revision due)
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-white px-2.5 h-8 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:border-slate-300 focus:border-[color:var(--university-green)] outline-none cursor-pointer whitespace-nowrap"
      >
        <Calendar className="h-3.5 w-3.5 text-[color:var(--university-green)] shrink-0" />
        <span>{formatDateDisplay(value)}</span>
      </button>

      {calendarPopover}
    </div>
  );
}
