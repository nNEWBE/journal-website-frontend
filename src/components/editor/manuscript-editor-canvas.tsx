"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";
import { Editor, EditorContent } from "@tiptap/react";
import { UploadCloud, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { ManuscriptTableTools } from "./manuscript-table-tools";
import {
  type PaperFormat,
  type PaperOrientation,
  type MarginPreset,
  type ViewMode,
  PAPER_DIMENSIONS,
} from "@/lib/manuscript-paper-sizes";

interface ManuscriptEditorCanvasProps {
  editor: Editor | null;
  paperFormat: PaperFormat;
  paperOrientation: PaperOrientation;
  viewMode: ViewMode;
  layoutColumns: "1" | "2";
  pageMargins: MarginPreset;
  currentFont: string;
  currentSize: string;
  currentSpacing: string;
  docTitle?: string;
  onDropImageFile: (file: File) => void;
  onDropDocxFile: (file: File) => void;
}

// ── 1. High-Performance Status Bar (CharacterCount O(1) Metrics & Smooth Zoom) ──
interface StatusBarProps {
  editor: Editor | null;
  currentDimensions: { name: string; width: number; height: number };
  zoomLevel: number;
  onSetZoom: (zoom: number) => void;
}

const ManuscriptEditorStatusBar = memo(function ManuscriptEditorStatusBar({
  editor,
  currentDimensions,
  zoomLevel,
  onSetZoom,
}: StatusBarProps) {
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    estimatedPages: 1,
    readingTimeMinutes: 1,
  });

  useEffect(() => {
    if (!editor) return;

    let rafId: number | null = null;
    const updateMetrics = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (editor.isDestroyed) return;

          // Prefer O(1) in-memory storage from CharacterCount extension
          const wCount =
            editor.storage.characterCount?.words?.() ??
            (editor.getText() || "").trim().split(/\s+/).filter(Boolean).length;
          const cCount =
            editor.storage.characterCount?.characters?.() ??
            editor.getText()?.length ??
            0;

          setMetrics({
            wordCount: wCount,
            charCount: cCount,
            estimatedPages: Math.max(1, Math.ceil(wCount / 250)),
            readingTimeMinutes: Math.max(1, Math.ceil(wCount / 200)),
          });
        });
      }
    };

    updateMetrics();
    editor.on("update", updateMetrics);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      editor.off("update", updateMetrics);
    };
  }, [editor]);

  return (
    <footer className="bg-[#f8fafc] border-t border-slate-200/90 pl-6 sm:pl-12 pr-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0 select-none z-20">
      <div className="flex items-center gap-3 text-[11px] font-medium">
        {/* Paper Format Badge */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-slate-200/80 text-slate-800 font-semibold text-[10.5px]">
          <span>{currentDimensions.name}</span>
          <span className="text-slate-500 font-mono text-[9.5px]">
            {currentDimensions.width}×{currentDimensions.height}px
          </span>
        </span>

        <span className="text-slate-300">|</span>

        <span>
          <strong className="text-slate-900 font-bold">
            {metrics.wordCount.toLocaleString()}
          </strong>{" "}
          words
        </span>
        <span className="text-slate-300">|</span>
        <span>
          <strong className="text-slate-900 font-bold">
            {metrics.charCount.toLocaleString()}
          </strong>{" "}
          chars
        </span>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="hidden sm:inline">
          Est.{" "}
          <strong className="text-slate-900 font-bold">
            ~{metrics.estimatedPages}
          </strong>{" "}
          {metrics.estimatedPages === 1 ? "page" : "pages"} (Double-Spaced)
        </span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span className="hidden md:inline text-slate-500">
          ~{metrics.readingTimeMinutes} min read
        </span>
      </div>

      {/* Hardware-Accelerated Zoom Stepper */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-2 py-0.5 rounded-xs shadow-2xs">
        <span className="text-[10.5px] font-semibold text-slate-500 mr-1">
          Zoom:
        </span>
        <button
          type="button"
          onClick={() => onSetZoom(Math.max(50, zoomLevel - 10))}
          className="p-1 hover:bg-slate-100 rounded-xs text-slate-600 transition-colors cursor-pointer"
          title="Zoom Out (Ctrl+Scroll Down)"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <select
          value={zoomLevel}
          onChange={(e) => onSetZoom(Number(e.target.value))}
          className="text-[11px] font-mono font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer text-center py-0.5"
        >
          <option value={50}>50%</option>
          <option value={75}>75%</option>
          <option value={90}>90%</option>
          <option value={100}>100%</option>
          <option value={110}>110%</option>
          <option value={125}>125%</option>
          <option value={150}>150%</option>
          <option value={200}>200%</option>
        </select>

        <button
          type="button"
          onClick={() => onSetZoom(Math.min(200, zoomLevel + 10))}
          className="p-1 hover:bg-slate-100 rounded-xs text-slate-600 transition-colors cursor-pointer"
          title="Zoom In (Ctrl+Scroll Up)"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        {zoomLevel !== 100 && (
          <button
            type="button"
            onClick={() => onSetZoom(100)}
            className="text-[10.5px] font-semibold text-blue-700 hover:underline ml-1 cursor-pointer flex items-center gap-0.5"
            title="Reset Zoom to 100%"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </footer>
  );
});

// ── 2. Main Virtual Paper Canvas ──
function ManuscriptEditorCanvasInner({
  editor,
  paperFormat,
  paperOrientation,
  viewMode,
  layoutColumns,
  pageMargins,
  currentFont,
  currentSize,
  currentSpacing,
  docTitle,
  onDropImageFile,
  onDropDocxFile,
}: ManuscriptEditorCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Dimensions based on paper format
  const currentDimensions =
    PAPER_DIMENSIONS[paperFormat]?.[paperOrientation] ||
    PAPER_DIMENSIONS.a4.portrait;

  // Fluid, hardware-accelerated Ctrl+Wheel Zoom listener on window
  useEffect(() => {
    let wheelRaf: number | null = null;
    let pendingDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept if Ctrl or Command is pressed
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();
      pendingDelta += e.deltaY;

      if (wheelRaf === null) {
        wheelRaf = requestAnimationFrame(() => {
          wheelRaf = null;
          const delta = pendingDelta;
          pendingDelta = 0;

          // Proportional zoom calculation
          let zoomDelta = 0;
          if (Math.abs(delta) < 50) {
            zoomDelta = -delta * 0.35;
          } else {
            const notchCount = Math.round(delta / 100);
            zoomDelta = -notchCount * 10;
          }

          if (Math.abs(zoomDelta) < 1 && delta !== 0) {
            zoomDelta = delta < 0 ? 1 : -1;
          }

          setZoomLevel((prev) =>
            Math.min(200, Math.max(50, Math.round(prev + zoomDelta)))
          );
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    // Keyboard shortcuts (Ctrl +, Ctrl -, Ctrl 0)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        setZoomLevel((prev) => Math.min(200, prev + 10));
      } else if (e.key === "-") {
        e.preventDefault();
        setZoomLevel((prev) => Math.max(50, prev - 10));
      } else if (e.key === "0") {
        e.preventDefault();
        setZoomLevel(100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (wheelRaf !== null) cancelAnimationFrame(wheelRaf);
    };
  }, []);

  // Drag-and-drop file imports
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined" && (window as any).__isInternalDragging) {
      if (isDraggingOver) setIsDraggingOver(false);
      return;
    }
    const hasFiles = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files");
    const hasRealFileItems = Array.from(e.dataTransfer.items || []).some(
      (item) => item.kind === "file"
    );
    if (hasFiles && hasRealFileItems) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.name.endsWith(".docx")) {
          onDropDocxFile(file);
        } else if (file.type.startsWith("image/")) {
          onDropImageFile(file);
        }
      });
    }
  };

  // Academic Margin Padding in Pixels
  const getMarginStyle = () => {
    if (viewMode === "continuous") {
      return { padding: "48px 64px" };
    }
    if (pageMargins === "narrow") {
      return { padding: "36px 36px" }; // 0.5 inch
    }
    if (pageMargins === "moderate") {
      return { padding: "54px 54px" }; // 0.75 inch
    }
    return { padding: "72px 72px" }; // 1.0 inch standard APA/IEEE
  };

  // Inches ruler
  const totalInches = Math.floor(currentDimensions.widthInches);
  const inchMarks = Array.from({ length: totalInches + 1 }, (_, i) => i);

  return (
    <div
      data-lenis-prevent="true"
      className="flex-1 flex flex-col min-h-0 bg-[#eef1f6] relative overflow-hidden font-sans"
    >
      {/* ── Top Ruler ── */}
      <div className="bg-[#f1f4f9] border-b border-slate-300/80 h-7 flex items-center justify-center shrink-0 select-none overflow-hidden shadow-2xs">
        <div
          style={{ width: `${Math.round(currentDimensions.width * (zoomLevel / 100))}px` }}
          className="px-6 flex items-center justify-between text-[9px] font-mono text-slate-500 transition-all duration-75"
        >
          <div className="flex items-center w-full justify-between border-t border-slate-300 pt-0.5">
            {inchMarks.map((inch) => (
              <span key={inch} className="relative">
                <span>{inch}&quot;</span>
                {inch < totalInches && (
                  <span className="absolute left-1/2 -top-1 w-px h-1.5 bg-slate-300" />
                )}
              </span>
            ))}
            <span className="text-[8.5px] text-slate-400 font-sans">
              {currentDimensions.widthInches}&quot;
            </span>
          </div>
        </div>
      </div>

      {/* ── Scrollable Document Viewport ── */}
      <div
        data-lenis-prevent="true"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`manuscript-scroll-canvas flex-1 min-h-0 overflow-y-auto overflow-x-auto relative ${isDraggingOver ? "bg-blue-100/60" : ""
          }`}
        style={{
          scrollBehavior: "auto",
          overscrollBehavior: "contain",
        }}
      >
        {/* Drop Overlay */}
        {isDraggingOver && (
          <div className="fixed inset-x-0 top-24 flex justify-center z-40 pointer-events-none">
            <div className="bg-[#0b1b3d] text-white px-5 py-2.5 rounded-full shadow-2xl border border-blue-400 flex items-center gap-2 text-xs font-bold animate-bounce">
              <UploadCloud className="h-4 w-4 text-amber-400" />
              <span>Drop Image or Word (.docx) File Here to Insert</span>
            </div>
          </div>
        )}

        {/* Paper Centering Wrapper with Native CSS Zoom */}
        <div className="min-h-full py-10 px-4 sm:px-8 w-full flex flex-col items-center">
          <div
            style={{
              zoom: zoomLevel / 100,
              width: viewMode === "continuous" ? "92%" : `${currentDimensions.width}px`,
              maxWidth: viewMode === "continuous" ? "1200px" : undefined,
            }}
            className="flex flex-col items-center transition-transform duration-75 origin-top"
          >
            {/* The Virtual Paper Sheet (Google Docs Style) */}
            <div
              id="manuscript-paper-sheet"
              style={{
                width: "100%",
                minHeight: viewMode === "continuous" ? "900px" : `${currentDimensions.height}px`,
                ...getMarginStyle(),
              }}
              className="manuscript-paper-sheet relative text-slate-900 selection:bg-blue-100/80"
            >
              {/* Academic Page Header (Simulated Sheet Header) */}
              <div className="border-b border-slate-200/80 pb-2 mb-8 flex items-center justify-between text-[8.5pt] text-slate-500 font-mono select-none">
                <span className="font-semibold uppercase tracking-wider text-slate-600 truncate max-w-[60%]">
                  {docTitle || "Academic Manuscript"}
                </span>
                <span className="text-slate-400 font-bold">PEER-REVIEW DRAFT</span>
              </div>

              {/* TipTap Content Area with Typography Properties */}
              <div
                style={{
                  fontFamily: currentFont,
                  fontSize: currentSize,
                  lineHeight: currentSpacing,
                  columnCount: layoutColumns === "2" ? 2 : 1,
                  columnGap: "28pt",
                  columnRule:
                    layoutColumns === "2" ? "0.5pt solid #e2e8f0" : "none",
                }}
                className="focus:outline-none"
              >
                <EditorContent
                  editor={editor}
                  className="manuscript-tiptap-content focus:outline-none min-h-162.5"
                />
              </div>

              {/* Academic Page Footer */}
              <div className="border-t border-slate-200/80 pt-3 mt-12 flex items-center justify-between text-[8pt] text-slate-400 select-none">
                <span>Peer-Reviewed Journal Document</span>
                <span className="font-mono font-bold text-slate-600">Page 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Table Controls */}
        <ManuscriptTableTools editor={editor} />
      </div>

      {/* ── High-Performance Isolated Status Bar ── */}
      <ManuscriptEditorStatusBar
        editor={editor}
        currentDimensions={currentDimensions}
        zoomLevel={zoomLevel}
        onSetZoom={setZoomLevel}
      />
    </div>
  );
}

export const ManuscriptEditorCanvas = memo(ManuscriptEditorCanvasInner);
