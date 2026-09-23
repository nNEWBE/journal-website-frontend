"use client";

import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
  Columns,
  Grid,
  Plus,
  Rows,
  Trash2,
  X,
  Split,
} from "lucide-react";
import { toast } from "sonner";

interface ManuscriptTableToolsProps {
  editor: Editor | null;
}

export function ManuscriptTableTools({ editor }: ManuscriptTableToolsProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    if (!editor || !editor.isActive("table")) {
      setPos(null);
      return;
    }

    // Find table element containing active selection
    const { from } = editor.state.selection;
    const domNode = editor.view.nodeDOM(from) as HTMLElement | null;
    const tableEl = domNode?.closest("table") || editor.view.dom.querySelector("table:hover, table.selectedCell");

    if (tableEl) {
      const rect = tableEl.getBoundingClientRect();
      setPos({
        top: Math.max(10, rect.top - 42),
        left: Math.max(20, rect.left),
      });
    } else {
      // Fallback: position above first table or hide
      const firstTable = editor.view.dom.querySelector("table");
      if (firstTable) {
        const rect = firstTable.getBoundingClientRect();
        setPos({
          top: Math.max(10, rect.top - 42),
          left: Math.max(20, rect.left),
        });
      }
    }
  };

  const isTableActive = Boolean(editor && editor.isActive("table"));

  useEffect(() => {
    if (!editor || !isTableActive) {
      setPos(null);
      return;
    }

    let rafId: number | null = null;
    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updatePosition();
          rafId = null;
        });
      }
    };

    scheduleUpdate();

    editor.on("selectionUpdate", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { capture: true, passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      editor.off("selectionUpdate", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isTableActive, editor]);

  if (!editor || !editor.isActive("table") || !pos) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        zIndex: 50,
      }}
      className="flex items-center gap-1 bg-[#060e22] text-white px-2 py-1 rounded-xs shadow-2xl border border-slate-700 text-xs shrink-0 whitespace-nowrap select-none animate-in zoom-in-95 duration-100"
    >
      <div className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-400 px-1 border-r border-slate-700">
        <Grid className="h-3.5 w-3.5" />
        <span>Table Tools</span>
      </div>

      {/* Row Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-700 pr-1">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().addRowBefore().run();
            toast.success("Row inserted above");
          }}
          title="Insert Row Above"
          className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[10.5px] cursor-pointer"
        >
          <Plus className="h-3 w-3 text-emerald-400" />
          <span>Row Above</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().addRowAfter().run();
            toast.success("Row inserted below");
          }}
          title="Insert Row Below"
          className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[10.5px] cursor-pointer"
        >
          <Plus className="h-3 w-3 text-emerald-400" />
          <span>Row Below</span>
        </button>
      </div>

      {/* Column Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-700 pr-1">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().addColumnBefore().run();
            toast.success("Column inserted left");
          }}
          title="Insert Column Left"
          className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[10.5px] cursor-pointer"
        >
          <Plus className="h-3 w-3 text-sky-400" />
          <span>Col Left</span>
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().addColumnAfter().run();
            toast.success("Column inserted right");
          }}
          title="Insert Column Right"
          className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[10.5px] cursor-pointer"
        >
          <Plus className="h-3 w-3 text-sky-400" />
          <span>Col Right</span>
        </button>
      </div>

      {/* Merge / Split */}
      <button
        type="button"
        onClick={() => {
          editor.chain().focus().mergeOrSplit().run();
        }}
        title="Merge or Split Selected Cells"
        className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[10.5px] cursor-pointer border-r border-slate-700 pr-1"
      >
        <Split className="h-3 w-3 text-purple-400" />
        <span>Merge/Split</span>
      </button>

      {/* Delete Controls */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().deleteRow().run();
            toast.info("Deleted table row");
          }}
          title="Delete Active Row"
          className="p-1 rounded-xs hover:bg-red-500/30 text-red-300 hover:text-red-200 text-[10.5px] cursor-pointer"
        >
          Del Row
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().deleteColumn().run();
            toast.info("Deleted table column");
          }}
          title="Delete Active Column"
          className="p-1 rounded-xs hover:bg-red-500/30 text-red-300 hover:text-red-200 text-[10.5px] cursor-pointer"
        >
          Del Col
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Delete entire table?")) {
              editor.chain().focus().deleteTable().run();
              toast.info("Deleted table");
            }
          }}
          title="Delete Entire Table"
          className="p-1 rounded-xs hover:bg-red-500/40 text-red-400 hover:text-red-200 cursor-pointer ml-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
