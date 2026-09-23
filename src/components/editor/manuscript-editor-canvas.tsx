"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
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

// ── 1. Isolated Status Bar Component (Updates word/page counts without touching canvas) ──
interface StatusBarProps {
  editor: Editor | null;
  currentDimensions: { name: string; width: number; height: number };
  zoomLabelRef: React.RefObject<HTMLSpanElement | null>;
  onZoomStep: (direction: 1 | -1) => void;
  onZoomReset: () => void;
}

const ManuscriptEditorStatusBar = memo(function ManuscriptEditorStatusBar({
  editor,
  currentDimensions,
  zoomLabelRef,
  onZoomStep,
  onZoomReset,
}: StatusBarProps) {
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    estimatedPages: 1,
    readingTimeMinutes: 1,
  });

  useEffect(() => {
    if (!editor) return;

    let debounceTimer: NodeJS.Timeout | null = null;
    const computeMetrics = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (editor.isDestroyed) return;
        const text = editor.getText() || "";
        const words = text.trim().split(/\s+/).filter(Boolean);
        const wCount = words.length;
        const cCount = text.length;
        setMetrics({
          wordCount: wCount,
          charCount: cCount,
          estimatedPages: Math.max(1, Math.ceil(wCount / 250)),
          readingTimeMinutes: Math.max(1, Math.ceil(wCount / 200)),
        });
      }, 300);
    };

    computeMetrics();
    editor.on("update", computeMetrics);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      editor.off("update", computeMetrics);
    };
  }, [editor]);

  return (
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
            {metrics.wordCount.toLocaleString()}
          </strong>{" "}
          words
        </span>
        <span className="text-slate-300">|</span>
        <span>
          <strong className="text-slate-900 font-bold">
            {metrics.charCount.toLocaleString()}
          </strong>{" "}
          characters
        </span>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="hidden sm:inline">
          Estimated{" "}
          <strong className="text-slate-900 font-bold">
            ~{metrics.estimatedPages}
          </strong>{" "}
          {metrics.estimatedPages === 1 ? "page" : "pages"} (Double-Spaced)
        </span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span className="hidden md:inline text-slate-500">
          ~{metrics.readingTimeMinutes} min reading time
        </span>
      </div>

      {/* Pure DOM Zoom Controls — zero React state on hot path */}
      <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-xs shadow-2xs">
        <span className="text-[10.5px] font-semibold text-slate-500 mr-1">
          Paper Zoom:
        </span>
        <button
          type="button"
          onClick={() => onZoomStep(-1)}
          className="p-1 hover:bg-slate-200 rounded-xs text-slate-600 transition-colors cursor-pointer"
          title="Zoom Out Paper (or Ctrl+Scroll Down)"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span
          ref={zoomLabelRef}
          className="text-[11px] font-mono text-slate-700 w-11 text-center font-bold"
        >
          100%
        </span>
        <button
          type="button"
          onClick={() => onZoomStep(1)}
          className="p-1 hover:bg-slate-200 rounded-xs text-slate-600 transition-colors cursor-pointer"
          title="Zoom In Paper (or Ctrl+Scroll Up)"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onZoomReset}
          className="text-[10.5px] font-semibold text-blue-700 hover:underline ml-1 cursor-pointer"
          title="Reset Paper Zoom to 100%"
        >
          Reset
        </button>
      </div>
    </div>
  );
});

// ── 2. Main Canvas Component ──
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
  onDropImageFile,
  onDropDocxFile,
}: ManuscriptEditorCanvasProps) {
  // Plain ref for zoom percentage — zero React re-renders on zoom hot path
  const zoomRef = useRef<number>(100);
  const zoomLabelRef = useRef<HTMLSpanElement | null>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const canvasScrollRef = useRef<HTMLDivElement | null>(null);
  const paperSheetRef = useRef<HTMLDivElement | null>(null);
  const boundingBoxRef = useRef<HTMLDivElement | null>(null);
  const rulerInnerRef = useRef<HTMLDivElement | null>(null);
  const accDeltaRef = useRef<number>(0);
  const zoomRafRef = useRef<number | null>(null);
  const willChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Paper dimensions
  const currentDimensions =
    PAPER_DIMENSIONS[paperFormat]?.[paperOrientation] ||
    PAPER_DIMENSIONS.a4.portrait;

  // Track natural unscaled sheet height via ResizeObserver with rAF throttling
  const naturalSheetHeightRef = useRef<number>(currentDimensions.height);
  useEffect(() => {
    const el = paperSheetRef.current;
    if (!el) return;

    let roRaf: number | null = null;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h =
          entry.borderBoxSize?.[0]?.blockSize ||
          entry.contentRect?.height ||
          0;
        if (h > 0 && Math.abs(h - naturalSheetHeightRef.current) > 4) {
          naturalSheetHeightRef.current = h;
          if (roRaf === null) {
            roRaf = requestAnimationFrame(() => {
              roRaf = null;
              const bb = boundingBoxRef.current;
              if (bb) {
                const scale = zoomRef.current / 100;
                bb.style.minHeight = `${Math.round(naturalSheetHeightRef.current * scale)}px`;
              }
            });
          }
        }
      }
    });

    ro.observe(el);
    return () => {
      if (roRaf !== null) cancelAnimationFrame(roRaf);
      ro.disconnect();
    };
  }, [currentDimensions.height]);

  // ── Core atomic imperative zoom applier ──
  // Updates sheet transform, bounding box, and ruler synchronously in the same rAF frame.
  // Never uses React state, so React never reconciles or wipes out the inline transform.
  const applyZoom = useCallback(
    (targetZoom: number) => {
      const next = Math.min(200, Math.max(50, targetZoom));
      zoomRef.current = next;

      // Update text label directly in DOM without React state
      if (zoomLabelRef.current) {
        zoomLabelRef.current.textContent = `${next}%`;
      }

      if (zoomRafRef.current !== null) {
        cancelAnimationFrame(zoomRafRef.current);
      }

      zoomRafRef.current = requestAnimationFrame(() => {
        zoomRafRef.current = null;
        const sheet = paperSheetRef.current;
        const bb = boundingBoxRef.current;
        const ruler = rulerInnerRef.current;
        if (!sheet || !bb) return;

        const scale = next / 100;
        const sheetW = currentDimensions.width;
        const sheetH = naturalSheetHeightRef.current;

        // Temporarily promote to compositor transform layer during active zoom
        sheet.style.willChange = "transform";
        if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
        willChangeTimeoutRef.current = setTimeout(() => {
          if (sheet) sheet.style.willChange = "auto";
        }, 300);

        // Atomic layout update in exact same frame
        sheet.style.transform = next !== 100 ? `scale(${scale})` : "";
        bb.style.width = `${Math.round(sheetW * scale)}px`;
        bb.style.minHeight = `${Math.round(sheetH * scale)}px`;
        if (ruler) {
          ruler.style.width = `${Math.round(sheetW * scale)}px`;
        }
      });
    },
    [currentDimensions.width]
  );

  // Whenever paper format / orientation changes, re-assert current zoom
  useEffect(() => {
    applyZoom(zoomRef.current);
  }, [currentDimensions.width, currentDimensions.height, applyZoom]);

  const handleZoomStep = useCallback(
    (direction: 1 | -1) => {
      applyZoom(zoomRef.current + direction * 10);
    },
    [applyZoom]
  );

  const handleZoomReset = useCallback(() => {
    applyZoom(100);
  }, [applyZoom]);

  // ── High-Performance Wheel & Scroll Architecture ──
  // CRITICAL: We only attach a non-passive wheel listener when Control/Meta is actively held down.
  // During normal scrolling (99.9% of user interactions), ZERO wheel listeners exist on the container.
  // This allows the browser compositor thread to execute 100% native hardware 120/144 FPS scrolling
  // without any roundtrips to the JavaScript main thread.
  useEffect(() => {
    let isCtrlActive = false;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      accDeltaRef.current += e.deltaY;
      const STEP_THRESHOLD = 25;

      if (Math.abs(accDeltaRef.current) >= STEP_THRESHOLD) {
        const direction = accDeltaRef.current < 0 ? 1 : -1;
        accDeltaRef.current = 0;
        applyZoom(zoomRef.current + direction * 10);
      }
    };

    const attachZoomWheel = () => {
      const scrollEl = canvasScrollRef.current;
      if (scrollEl && !isCtrlActive) {
        isCtrlActive = true;
        scrollEl.addEventListener("wheel", handleWheel, { passive: false });
      }
    };

    const detachZoomWheel = () => {
      const scrollEl = canvasScrollRef.current;
      if (scrollEl && isCtrlActive) {
        isCtrlActive = false;
        scrollEl.removeEventListener("wheel", handleWheel);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        attachZoomWheel();
      }

      if (!(e.ctrlKey || e.metaKey)) return;

      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        applyZoom(zoomRef.current + 10);
      } else if (e.key === "-") {
        e.preventDefault();
        applyZoom(zoomRef.current - 10);
      } else if (e.key === "0") {
        e.preventDefault();
        applyZoom(100);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        detachZoomWheel();
      }
    };

    const handleBlur = () => {
      detachZoomWheel();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      detachZoomWheel();
      if (zoomRafRef.current !== null) {
        cancelAnimationFrame(zoomRafRef.current);
      }
      if (willChangeTimeoutRef.current) {
        clearTimeout(willChangeTimeoutRef.current);
      }
    };
  }, [applyZoom]);

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
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}
        className={`manuscript-scroll-canvas flex-1 min-h-0 relative ${isDraggingOver ? "bg-blue-100/60" : ""}`}
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

        {/* Centering wrapper */}
        <div className="min-h-full py-8 px-6 sm:px-12 flex justify-center items-start" style={{ minWidth: "100%" }}>
          {/* Bounding box to give the scroll container accurate dimensions */}
          <div
            ref={boundingBoxRef}
            style={{
              width: `${currentDimensions.width}px`,
              minHeight: `${currentDimensions.height}px`,
              position: "relative",
            }}
          >
            {/* The actual paper sheet — transform preserved in JSX style so React never wipes it */}
            <div
              ref={paperSheetRef}
              id="manuscript-paper-sheet"
              style={{
                width: `${currentDimensions.width}px`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
                transform: zoomRef.current !== 100 ? `scale(${zoomRef.current / 100})` : undefined,
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

      {/* ── Status Bar (Isolated from Canvas) ── */}
      <ManuscriptEditorStatusBar
        editor={editor}
        currentDimensions={currentDimensions}
        zoomLabelRef={zoomLabelRef}
        onZoomStep={handleZoomStep}
        onZoomReset={handleZoomReset}
      />
    </div>
  );
}

export const ManuscriptEditorCanvas = memo(ManuscriptEditorCanvasInner);
