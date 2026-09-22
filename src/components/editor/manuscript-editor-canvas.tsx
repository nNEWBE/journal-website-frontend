"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Editor, EditorContent } from "@tiptap/react";
import { UploadCloud, ZoomIn, ZoomOut } from "lucide-react";
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
  onDropImageFile: (file: File) => void;
  onDropDocxFile: (file: File) => void;
}

export function ManuscriptEditorCanvas({
  editor,
  paperFormat,
  paperOrientation,
  viewMode,
  layoutColumns,
  pageMargins,
  currentFont,
  currentSize,
  currentSpacing,
  onDropImageFile,
  onDropDocxFile,
}: ManuscriptEditorCanvasProps) {
  // ── Zoom is stored in a plain ref — no React state — so zooming never re-renders React ──
  const zoomRef = useRef<number>(100);
  // Only used to update the status bar text after zooming settles
  const [displayZoom, setDisplayZoom] = useState<number>(100);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const canvasScrollRef = useRef<HTMLDivElement | null>(null);
  const paperSheetRef = useRef<HTMLDivElement | null>(null);
  const boundingBoxRef = useRef<HTMLDivElement | null>(null);
  const rulerInnerRef = useRef<HTMLDivElement | null>(null);
  const accDeltaRef = useRef<number>(0);
  const displayZoomRafRef = useRef<number | null>(null);

  // Paper dimensions (stable unless paperFormat/orientation changes)
  const currentDimensions =
    PAPER_DIMENSIONS[paperFormat]?.[paperOrientation] ||
    PAPER_DIMENSIONS.a4.portrait;

  // Track natural unscaled sheet height via ResizeObserver
  const naturalSheetHeightRef = useRef<number>(currentDimensions.height);
  useEffect(() => {
    const el = paperSheetRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h =
          entry.borderBoxSize?.[0]?.blockSize ||
          entry.contentRect?.height ||
          0;
        if (h > 0) {
          naturalSheetHeightRef.current = h;
          // Imperatively update bounding box minHeight without React state
          const bb = boundingBoxRef.current;
          if (bb) {
            const scale = zoomRef.current / 100;
            bb.style.minHeight = `${Math.round(h * scale)}px`;
          }
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [currentDimensions.height]);

  // Pending rAF for layout writes (bounding box + ruler)
  const layoutRafRef = useRef<number | null>(null);

  // ── Core imperative zoom applier ──
  // Split into two phases:
  //   1. Transform-only (synchronous, compositor thread, zero layout cost)
  //   2. Layout writes (deferred to rAF so they never block the wheel callback)
  const applyZoomToDOM = useCallback(
    (newZoom: number) => {
      const sheet = paperSheetRef.current;
      if (!sheet) return;

      const scale = newZoom / 100;
      const sheetW = currentDimensions.width;

      // ── Phase 1: Transform (GPU-composited, never causes layout) ──
      sheet.style.transform = newZoom !== 100 ? `scale(${scale})` : "";

      // ── Phase 2: Layout-affecting writes — always deferred to next frame ──
      if (layoutRafRef.current !== null) {
        cancelAnimationFrame(layoutRafRef.current);
      }
      layoutRafRef.current = requestAnimationFrame(() => {
        layoutRafRef.current = null;
        const bb = boundingBoxRef.current;
        const ruler = rulerInnerRef.current;
        const sheetH = naturalSheetHeightRef.current;

        if (bb) {
          bb.style.width = `${Math.round(sheetW * scale)}px`;
          bb.style.minHeight = `${Math.round(sheetH * scale)}px`;
        }
        if (ruler) {
          ruler.style.width = `${Math.round(sheetW * scale)}px`;
        }
      });
    },
    [currentDimensions.width]
  );

  // Whenever paper format / orientation changes, re-apply current zoom to resized sheet
  useEffect(() => {
    applyZoomToDOM(zoomRef.current);
  }, [currentDimensions.width, currentDimensions.height, applyZoomToDOM]);

  // Word / char metrics (completely isolated from zoom)
  const [docMetrics, setDocMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    estimatedPages: 1,
    readingTimeMinutes: 1,
  });

  useEffect(() => {
    if (!editor) return;

    const computeMetrics = () => {
      const text = editor.getText() || "";
      const words = text.trim().split(/\s+/).filter(Boolean);
      const wCount = words.length;
      const cCount = text.length;
      setDocMetrics({
        wordCount: wCount,
        charCount: cCount,
        estimatedPages: Math.max(1, Math.ceil(wCount / 250)),
        readingTimeMinutes: Math.max(1, Math.ceil(wCount / 200)),
      });
    };

    computeMetrics();
    editor.on("update", computeMetrics);
    return () => {
      editor.off("update", computeMetrics);
    };
  }, [editor]);

  // ── Debounced status-bar update — decouple zoom display from the hot wheel path ──
  const scheduleDisplayZoomUpdate = useCallback((newZoom: number) => {
    if (displayZoomRafRef.current !== null) {
      cancelAnimationFrame(displayZoomRafRef.current);
    }
    // Use two nested rAFs: first flushes imperative DOM writes,
    // second schedules the (very cheap) React state update for the label.
    displayZoomRafRef.current = requestAnimationFrame(() => {
      displayZoomRafRef.current = requestAnimationFrame(() => {
        setDisplayZoom(newZoom);
        displayZoomRafRef.current = null;
      });
    });
  }, []);

  // ── Ctrl+Wheel zoom handler — fully imperative, zero React setState on hot path ──
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      accDeltaRef.current += e.deltaY;
      const STEP_THRESHOLD = 30;

      if (Math.abs(accDeltaRef.current) >= STEP_THRESHOLD) {
        const direction = accDeltaRef.current < 0 ? 1 : -1;
        accDeltaRef.current = 0;

        const current = zoomRef.current;
        const next = Math.min(200, Math.max(50, current + direction * 10));

        if (next !== current) {
          zoomRef.current = next;
          // DOM update in same microtask — no React involved
          applyZoomToDOM(next);
          // Schedule cheap label update after paint
          scheduleDisplayZoomUpdate(next);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      let next: number | null = null;
      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        next = Math.min(200, zoomRef.current + 10);
      } else if (e.key === "-") {
        e.preventDefault();
        next = Math.max(50, zoomRef.current - 10);
      } else if (e.key === "0") {
        e.preventDefault();
        next = 100;
      }

      if (next !== null && next !== zoomRef.current) {
        zoomRef.current = next;
        applyZoomToDOM(next);
        scheduleDisplayZoomUpdate(next);
      }
    };

    const scrollEl = canvasScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("wheel", handleWheel, { passive: false });
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (scrollEl) scrollEl.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (displayZoomRafRef.current !== null) {
        cancelAnimationFrame(displayZoomRafRef.current);
      }
      if (layoutRafRef.current !== null) {
        cancelAnimationFrame(layoutRafRef.current);
      }
    };
  }, [applyZoomToDOM, scheduleDisplayZoomUpdate]);

  // Button zoom handler — still no React setState on the hot path, uses same imperative path
  const handleZoomStep = useCallback(
    (direction: 1 | -1) => {
      const next = Math.min(200, Math.max(50, zoomRef.current + direction * 10));
      if (next !== zoomRef.current) {
        zoomRef.current = next;
        applyZoomToDOM(next);
        scheduleDisplayZoomUpdate(next);
      }
    },
    [applyZoomToDOM, scheduleDisplayZoomUpdate]
  );

  const handleZoomReset = useCallback(() => {
    if (zoomRef.current !== 100) {
      zoomRef.current = 100;
      applyZoomToDOM(100);
      scheduleDisplayZoomUpdate(100);
    }
  }, [applyZoomToDOM, scheduleDisplayZoomUpdate]);

  // Drag-and-drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.dataTransfer.types &&
      Array.from(e.dataTransfer.types).includes("Files")
    ) {
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

  const getMarginClass = () => {
    if (pageMargins === "narrow") return "px-8 sm:px-12 py-10 sm:py-14";
    if (pageMargins === "moderate") return "px-12 sm:px-16 py-12 sm:py-18";
    return "px-14 sm:px-20 py-16 sm:py-24";
  };

  const totalInches = Math.floor(currentDimensions.widthInches);
  const inchMarks = Array.from({ length: totalInches + 1 }, (_, i) => i);

  return (
    <div
      data-lenis-prevent="true"
      className="flex-1 flex flex-col min-h-0 bg-[#eef1f6] relative overflow-hidden font-sans"
    >
      {/* ── Top Ruler (width synced imperatively) ── */}
      <div className="bg-[#f1f4f9] border-b border-slate-300/80 h-7 flex items-center justify-center shrink-0 select-none overflow-hidden shadow-2xs">
        {/* rulerInnerRef width is updated imperatively by applyZoomToDOM */}
        <div
          ref={rulerInnerRef}
          style={{ width: `${currentDimensions.width}px` }}
          className="px-6 flex items-center justify-between text-[9px] font-mono text-slate-500"
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

      {/* ── Main Scroll Viewport ── */}
      <div
        ref={canvasScrollRef}
        data-lenis-prevent="true"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          overflowY: "scroll",
          overflowX: "auto",
          scrollBehavior: "auto",
          // Allow browser/compositor to handle pan-y natively (fast path for trackpad/touchscreen)
          touchAction: "pan-y",
        }}
        className={`flex-1 min-h-0 relative ${isDraggingOver ? "bg-blue-100/60" : ""}`}
      >
        {/* Drop Banner */}
        {isDraggingOver && (
          <div className="fixed inset-x-0 top-24 flex justify-center z-40 pointer-events-none">
            <div className="bg-[#0b1b3d] text-white px-5 py-2.5 rounded-full shadow-2xl border border-blue-400 flex items-center gap-2 text-xs font-bold animate-bounce">
              <UploadCloud className="h-4 w-4 text-amber-400" />
              <span>Drop Image or Word (.docx) File Here to Insert</span>
            </div>
          </div>
        )}

        {/* Centering wrapper — explicit min-width avoids expensive w-max intrinsic-size computation on every layout */}
        <div className="min-h-full py-8 px-6 sm:px-12 flex justify-center items-start" style={{ minWidth: '100%' }}>

          {/* Invisible bounding box — updated imperatively to keep scrollbars accurate at any zoom */}
          <div
            ref={boundingBoxRef}
            style={{
              width: `${currentDimensions.width}px`,
              minHeight: `${currentDimensions.height}px`,
              position: "relative",
            }}
          >
            {/* The actual paper sheet — transform: scale applied imperatively via applyZoomToDOM */}
            <div
              ref={paperSheetRef}
              id="manuscript-paper-sheet"
              style={{
                width: `${currentDimensions.width}px`,
                // transform applied imperatively by applyZoomToDOM — not via React state
                transformOrigin: "top left",
                willChange: "transform",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              className={`${
                viewMode === "continuous"
                  ? "bg-white border border-slate-300 shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-xs"
                  : ""
              } ${isDraggingOver ? "ring-4 ring-blue-500/40" : ""}`}
            >
              <div
                style={{
                  fontFamily: currentFont,
                  fontSize: currentSize,
                  lineHeight: currentSpacing,
                  columnCount: layoutColumns === "2" ? 2 : 1,
                  columnGap: "24pt",
                  columnRule:
                    layoutColumns === "2" ? "0.5pt solid #e2e8f0" : "none",
                }}
                className={`focus:outline-none text-slate-900 selection:bg-blue-100 ${
                  viewMode === "continuous"
                    ? `min-h-264 ${getMarginClass()}`
                    : ""
                }`}
              >
                <EditorContent
                  editor={editor}
                  className="manuscript-tiptap-content focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Table Tools */}
        <ManuscriptTableTools editor={editor} />
      </div>

      {/* ── Bottom Status Bar ── */}
      <div className="bg-[#f8fafc] border-t border-slate-200/90 pl-16 pr-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0 select-none">
        <div className="flex items-center gap-3 text-[11px] font-medium">
          {/* Paper Format Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-slate-200 text-slate-800 font-semibold text-[10.5px]">
            <span>{currentDimensions.name}</span>
            <span className="text-slate-400 font-mono text-[9.5px]">
              {currentDimensions.width}×{currentDimensions.height}px
            </span>
          </span>

          <span className="text-slate-300">|</span>

          <span>
            <strong className="text-slate-900 font-bold">
              {docMetrics.wordCount.toLocaleString()}
            </strong>{" "}
            words
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <strong className="text-slate-900 font-bold">
              {docMetrics.charCount.toLocaleString()}
            </strong>{" "}
            characters
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            Estimated{" "}
            <strong className="text-slate-900 font-bold">
              ~{docMetrics.estimatedPages}
            </strong>{" "}
            {docMetrics.estimatedPages === 1 ? "page" : "pages"} (Double-Spaced)
          </span>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-500">
            ~{docMetrics.readingTimeMinutes} min reading time
          </span>
        </div>

        {/* Zoom Controls — displayZoom is only updated after zoom settles */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-xs shadow-2xs">
          <span className="text-[10.5px] font-semibold text-slate-500 mr-1">
            Paper Zoom:
          </span>
          <button
            type="button"
            onClick={() => handleZoomStep(-1)}
            className="p-1 hover:bg-slate-200 rounded-xs text-slate-600 transition-colors cursor-pointer"
            title="Zoom Out Paper (or Ctrl+Scroll Down)"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-700 w-11 text-center font-bold">
            {displayZoom}%
          </span>
          <button
            type="button"
            onClick={() => handleZoomStep(1)}
            className="p-1 hover:bg-slate-200 rounded-xs text-slate-600 transition-colors cursor-pointer"
            title="Zoom In Paper (or Ctrl+Scroll Up)"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomReset}
            className="text-[10.5px] font-semibold text-blue-700 hover:underline ml-1 cursor-pointer"
            title="Reset Paper Zoom to 100%"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
