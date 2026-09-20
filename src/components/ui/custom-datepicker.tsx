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

function parseDateSafe(val: string | undefined): Date {
  if (!val) return new Date();

  // Handle relative strings like "14 days", "+14 days", "14 Days from Access", etc.
  const relativeMatch = val.match(/(\d+)\s*days?/i);
  if (relativeMatch) {
    const days = parseInt(relativeMatch[1], 10);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  const parsed = new Date(val);
  if (isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
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

  const prevIsOpenRef = useRef(false);
  const initialDate = parseDateSafe(value);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Only mount portal on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Synchronize calendar view only when opened transition happens (false -> true)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      const d = parseDateSafe(value);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, value]);

  // Position the popover based on button's screen coordinates.
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
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
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        popoverRef.current?.contains(target) ||
        buttonRef.current?.contains(target) ||
        target.tagName === "OPTION" ||
        target.closest?.("[data-datepicker-popover]")
      ) {
        return;
      }
      setIsOpen(false);
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

  const currentActualYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 15 }, (_, i) => currentActualYear - 3 + i);
  if (!yearsList.includes(currentYear) && !isNaN(currentYear)) {
    yearsList.push(currentYear);
    yearsList.sort((a, b) => a - b);
  }

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  function handlePrevMonth(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }

  function handleNextMonth(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
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
  // Fill remaining slots to make a complete rectangular grid (35 or 42 cells)
  const totalSlots = daysGrid.length <= 35 ? 35 : 42;
  let nextDay = 1;
  while (daysGrid.length < totalSlots) {
    daysGrid.push({ day: nextDay, isCurrentMonth: false });
    nextDay++;
  }

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "Pick date";
    if (/^\+?\d+\s*days?/i.test(dateStr.trim())) {
      return dateStr;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isDaySelected(day: number) {
    if (!value) return false;
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const checkStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    if (checkStr === value) return true;

    // Check if value is a valid date that matches this day
    const valDate = new Date(value);
    if (!isNaN(valDate.getTime())) {
      return (
        valDate.getFullYear() === currentYear &&
        valDate.getMonth() === currentMonth &&
        valDate.getDate() === day
      );
    }
    return false;
  }

  const calendarPopover = isMounted && isOpen ? createPortal(
    <div
      ref={popoverRef}
      data-datepicker-popover="true"
      style={popoverStyle}
      className="w-72 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/5"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between gap-1 pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
          title="Previous Month"
          aria-label="Previous Month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer"
          >
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
          title="Next Month"
          aria-label="Next Month"
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
          const isSelected = item.isCurrentMonth && isDaySelected(item.day);

          return (
            <button
              key={index}
              type="button"
              onClick={() => item.isCurrentMonth && handleSelectDay(item.day)}
              disabled={!item.isCurrentMonth}
              className={cn(
                "h-7 w-7 rounded-md font-semibold text-slate-700 transition-colors flex items-center justify-center cursor-pointer mx-auto",
                !item.isCurrentMonth && "text-slate-300 pointer-events-none cursor-default",
                item.isCurrentMonth && "hover:bg-blue-50 hover:text-blue-600",
                isSelected && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white font-extrabold shadow-sm"
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
          className="rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 p-1.5 text-[9px] font-bold text-slate-600 transition-colors cursor-pointer"
        >
          +14 days (Review due)
        </button>
        <button
          type="button"
          onClick={() => setPresetDays(30)}
          className="rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 p-1.5 text-[9px] font-bold text-slate-600 transition-colors cursor-pointer"
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
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 h-8 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 outline-none cursor-pointer whitespace-nowrap"
      >
        <Calendar className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        <span>{formatDateDisplay(value)}</span>
      </button>

      {calendarPopover}
    </div>
  );
}
