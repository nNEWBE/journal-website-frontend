"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";
import { Editor, EditorContent } from "@tiptap/react";
import {
  UploadCloud,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  MoveHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  Trash2,
} from "lucide-react";
import { ManuscriptTableTools } from "./manuscript-table-tools";
import {
  type PaperFormat,
  type PaperOrientation,
  type MarginPreset,
  type ViewMode,
  type PaperDimension,
  type ManuscriptHeaderFooterConfig,
  PAPER_DIMENSIONS,
  MARGIN_PRESETS,
  DEFAULT_HEADER_FOOTER,
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
  headerFooter?: ManuscriptHeaderFooterConfig;
  onUpdateHeaderFooter?: (config: ManuscriptHeaderFooterConfig) => void;
  activeHeaderFooterFocus?: "header" | "footer" | null;
  onClearHeaderFooterFocus?: () => void;
  onDropImageFile: (file: File) => void;
  onDropDocxFile: (file: File) => void;
}

// ── 1. High-Performance Status Bar with Exact Physical Specs & Smart Zoom ──
interface StatusBarProps {
  editor: Editor | null;
  currentDimensions: PaperDimension;
  pageMargins: MarginPreset;
  sheetPageCount?: number;
  activePageNumber?: number;
  viewMode?: ViewMode;
  zoomLevel: number;
  onSetZoom: (zoom: number) => void;
  onFitPage: () => void;
  onFitWidth: () => void;
}

const ManuscriptEditorStatusBar = memo(function ManuscriptEditorStatusBar({
  editor,
  currentDimensions,
  pageMargins,
  sheetPageCount = 1,
  activePageNumber = 1,
  viewMode = "pages",
  zoomLevel,
  onSetZoom,
  onFitPage,
  onFitWidth,
}: StatusBarProps) {
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    estimatedPages: 1,
    readingTimeMinutes: 1,
  });

  const margins = MARGIN_PRESETS[pageMargins] || MARGIN_PRESETS.normal;

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
            estimatedPages: Math.max(1, Math.ceil(wCount / 350)),
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
    <footer className="bg-[#f8fafc] border-t border-slate-200/90 pl-4 sm:pl-8 pr-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0 select-none z-20">
      <div className="flex items-center gap-2.5 text-[11px] font-medium flex-wrap">
        {/* Paper Format & Physical Dimensions Badge */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-slate-200/90 text-slate-800 font-semibold text-[10.5px]">
          <span>{currentDimensions.name}</span>
          <span className="text-slate-500 font-mono text-[9.5px]">
            {currentDimensions.descriptionShort} ({currentDimensions.width}×{currentDimensions.height}px)
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-700 font-normal text-[9.5px]">
            {margins.label}
          </span>
        </span>

        <span className="text-slate-300">|</span>

        {viewMode === "pages" ? (
          <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded-xs shadow-2xs">
            <span>Page {activePageNumber} of {sheetPageCount}</span>
          </span>
        ) : (
          <span className="hidden sm:inline">
            Est.{" "}
            <strong className="text-slate-900 font-bold">
              ~{metrics.estimatedPages}
            </strong>{" "}
            {metrics.estimatedPages === 1 ? "page" : "pages"}
          </span>
        )}

        <span className="text-slate-300 hidden sm:inline">|</span>

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
        <span className="text-slate-300 hidden md:inline">|</span>
        <span className="hidden md:inline text-slate-500">
          ~{metrics.readingTimeMinutes} min read
        </span>
      </div>

      {/* Hardware-Accelerated Zoom Controls (Fit Page, Fit Width, Stepper) */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-2 py-0.5 rounded-xs shadow-2xs">
        {/* Fit Whole Page on Screen */}
        <button
          type="button"
          onClick={onFitPage}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10.5px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border-r border-slate-200 pr-2 mr-0.5"
          title="Fit whole A4 page height on screen"
        >
          <Maximize2 className="h-3 w-3 text-slate-500" />
          <span className="hidden md:inline">Fit Page</span>
        </button>

        {/* Fit Page Width */}
        <button
          type="button"
          onClick={onFitWidth}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10.5px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border-r border-slate-200 pr-2 mr-0.5"
          title="Fit page width to window"
        >
          <MoveHorizontal className="h-3 w-3 text-slate-500" />
          <span className="hidden md:inline">Page Width</span>
        </button>

        <button
          type="button"
          onClick={() => onSetZoom(Math.max(40, zoomLevel - 10))}
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
          <option value={60}>60%</option>
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
            <span>100%</span>
          </button>
        )}
      </div>
    </footer>
  );
});

// ── 2. Authentic MS Word Top Ruler (Calibrated Inches & Centimeters) ──
interface TopRulerProps {
  paperWidth: number;
  marginLeft: number;
  marginRight: number;
  zoomLevel: number;
  viewMode: ViewMode;
  isMetricDefault: boolean;
}

const ManuscriptTopRuler = memo(function ManuscriptTopRuler({
  paperWidth,
  marginLeft,
  marginRight,
  isMetricDefault,
}: TopRulerProps) {
  const [unit, setUnit] = useState<"in" | "cm">(isMetricDefault ? "cm" : "in");

  // Keep default aligned when paper format changes, unless user toggled
  useEffect(() => {
    setUnit(isMetricDefault ? "cm" : "in");
  }, [isMetricDefault]);

  const contentWidth = Math.max(100, paperWidth - marginLeft - marginRight);

  // Calibration:
  // 1 inch = 96 CSS pixels
  // 1 cm = 96 / 2.54 = 37.79527559 CSS pixels
  const pxPerUnit = unit === "in" ? 96 : 96 / 2.54;
  const numUnits = Math.floor(contentWidth / pxPerUnit);

  const majorTicks = Array.from({ length: numUnits + 1 }, (_, i) => i);

  return (
    <div
      style={{ width: `${paperWidth}px` }}
      className="flex items-center h-6 text-slate-600 font-mono text-[9px] select-none bg-[#f1f4f9] border border-slate-300 rounded-t-xs"
    >
      {/* ── Left Margin Zone (Shaded) ── */}
      <div
        style={{ width: `${marginLeft}px` }}
        className="h-full bg-[#dbe2ec] border-r border-slate-400 relative flex items-center justify-between px-2 shrink-0"
        title={`Left Margin: ${unit === "in" ? `${(marginLeft / 96).toFixed(2)}"` : `${(marginLeft / (96 / 2.54)).toFixed(1)} cm`}`}
      >
        <button
          type="button"
          onClick={() => setUnit((prev) => (prev === "in" ? "cm" : "in"))}
          className="text-[8.5px] font-bold text-slate-700 bg-white/80 hover:bg-white px-1.5 py-0.5 rounded-xs border border-slate-300 cursor-pointer transition-colors shadow-2xs"
          title={`Click to switch ruler units (currently ${unit.toUpperCase()})`}
        >
          {unit.toUpperCase()}
        </button>

        {/* Left Indent Marker at margin boundary */}
        <div
          className="absolute right-0 top-0 bottom-0 flex flex-col justify-between items-center translate-x-1/2 pointer-events-none z-10"
          style={{ width: "8px" }}
        >
          {/* First Line Indent (Top Downward Triangle) */}
          <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4.5px] border-t-blue-600" />
          {/* Left Indent (Bottom Upward Triangle) */}
          <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[4.5px] border-b-blue-600" />
        </div>
      </div>

      {/* ── Active Writable Body Zone (Crisp White) ── */}
      <div
        style={{ width: `${contentWidth}px` }}
        className="h-full bg-white relative overflow-hidden shrink-0 border-x border-slate-300"
      >
        {majorTicks.map((val) => {
          const x = val * pxPerUnit;
          if (x > contentWidth) return null;

          const halfX = x + pxPerUnit / 2;
          const q1X = x + pxPerUnit / 4;
          const q3X = x + (3 * pxPerUnit) / 4;

          return (
            <React.Fragment key={val}>
              {/* Major Tick (Number + tick mark) */}
              <div
                className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                style={{ left: `${x}px`, transform: val === 0 ? "none" : "translateX(-50%)" }}
              >
                <div className="h-2 w-px bg-slate-500" />
                <span className="text-[8.5px] font-semibold text-slate-700 leading-none pt-0.5">
                  {val}
                </span>
              </div>

              {/* Quarter Tick 1 */}
              {unit === "in" && q1X < contentWidth && (
                <div
                  className="absolute top-0 h-1.5 w-px bg-slate-300 pointer-events-none"
                  style={{ left: `${q1X}px` }}
                />
              )}

              {/* Half-unit Tick */}
              {halfX < contentWidth && (
                <div
                  className="absolute top-0 h-1.5 w-px bg-slate-400 pointer-events-none"
                  style={{ left: `${halfX}px` }}
                />
              )}

              {/* Quarter Tick 3 */}
              {unit === "in" && q3X < contentWidth && (
                <div
                  className="absolute top-0 h-1.5 w-px bg-slate-300 pointer-events-none"
                  style={{ left: `${q3X}px` }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Right Indent Marker at right margin boundary */}
        <div
          className="absolute right-0 top-0 bottom-0 flex flex-col justify-end items-center translate-x-1/2 pointer-events-none z-10"
          style={{ width: "8px" }}
        >
          <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[4.5px] border-b-blue-600" />
        </div>
      </div>

      {/* ── Right Margin Zone (Shaded) ── */}
      <div
        style={{ width: `${marginRight}px` }}
        className="h-full bg-[#dbe2ec] border-l border-slate-400 relative flex items-center justify-end px-2 shrink-0"
        title={`Right Margin: ${unit === "in" ? `${(marginRight / 96).toFixed(2)}"` : `${(marginRight / (96 / 2.54)).toFixed(1)} cm`}`}
      >
        <span className="text-[8.5px] text-slate-600 font-mono font-medium">
          {unit === "in" ? `${(paperWidth / 96).toFixed(1)}"` : `${(paperWidth / (96 / 2.54)).toFixed(0)}cm`}
        </span>
      </div>
    </div>
  );
});

// ── 3. Main Virtual Paper Canvas ──
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
  headerFooter,
  onUpdateHeaderFooter,
  activeHeaderFooterFocus,
  onClearHeaderFooterFocus,
  onDropImageFile,
  onDropDocxFile,
}: ManuscriptEditorCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isEditingFooter, setIsEditingFooter] = useState(false);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);
  const scrollCanvasRef = useRef<HTMLDivElement>(null);

  // Synchronize focus from toolbar actions
  useEffect(() => {
    if (activeHeaderFooterFocus === "header") {
      setIsEditingHeader(true);
      setTimeout(() => headerInputRef.current?.focus(), 50);
    } else if (activeHeaderFooterFocus === "footer") {
      setIsEditingFooter(true);
      setTimeout(() => footerInputRef.current?.focus(), 50);
    }
  }, [activeHeaderFooterFocus]);

  // Dimensions based on paper format
  const currentDimensions =
    PAPER_DIMENSIONS[paperFormat]?.[paperOrientation] ||
    PAPER_DIMENSIONS.a4.portrait;

  // Margin Preset
  const margins = MARGIN_PRESETS[pageMargins] || MARGIN_PRESETS.normal;

  // Fit Page (fits whole page height inside viewport)
  const handleFitPage = useCallback(() => {
    if (!scrollCanvasRef.current) return;
    const vh = scrollCanvasRef.current.clientHeight - 80;
    const fitZoom = Math.min(
      150,
      Math.max(40, Math.round((vh / currentDimensions.height) * 100))
    );
    setZoomLevel(fitZoom);
  }, [currentDimensions.height]);

  // Fit Width (fits page width inside viewport)
  const handleFitWidth = useCallback(() => {
    if (!scrollCanvasRef.current) return;
    const vw = scrollCanvasRef.current.clientWidth - 80;
    const fitZoom = Math.min(
      200,
      Math.max(40, Math.round((vw / currentDimensions.width) * 100))
    );
    setZoomLevel(fitZoom);
  }, [currentDimensions.width]);

  const paperSheetRef = useRef<HTMLDivElement>(null);
  const [sheetPageCount, setSheetPageCount] = useState<number>(1);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const isReconcilingRef = useRef(false);

  const DESK_GAP_PX = 32;
  const pageStride = currentDimensions.height + DESK_GAP_PX;

  // Active page tracking based on viewport scroll position (MS Word-exact status bar indicator)
  useEffect(() => {
    const scrollEl = scrollCanvasRef.current;
    if (!scrollEl) return;

    let scrollRaf: number | null = null;
    const handleScroll = () => {
      if (viewMode !== "pages") return;
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const scrollTop = scrollEl.scrollTop;
        const viewportHeight = scrollEl.clientHeight;
        const zoom = (zoomLevel || 100) / 100;
        const centerY = (scrollTop + viewportHeight / 2) / zoom;
        const page = Math.min(
          sheetPageCount,
          Math.max(1, Math.floor(centerY / pageStride) + 1)
        );
        setActivePageNumber(page);
      });
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
    };
  }, [viewMode, sheetPageCount, pageStride, zoomLevel]);

  // Authentic MS Word Two-Pass DOM block pagination reconciler
  const reconcilePages = useCallback(() => {
    if (typeof window === "undefined" || !paperSheetRef.current) return;
    if (isReconcilingRef.current) return;

    const editorEl = paperSheetRef.current.querySelector(
      ".manuscript-tiptap-content .ProseMirror"
    ) as HTMLElement | null;

    if (!editorEl) return;

    if (viewMode !== "pages") {
      // In continuous mode, clear any page break spacers
      const children = Array.from(editorEl.children) as HTMLElement[];
      for (const child of children) {
        if (child.dataset.wordPageBreak === "true") {
          child.style.marginTop = "";
          delete child.dataset.wordPageBreak;
        }
      }
      setSheetPageCount(1);
      return;
    }

    isReconcilingRef.current = true;

    try {
      const pageHeight = currentDimensions.height;
      const stride = pageHeight + DESK_GAP_PX;
      const marginTop = margins.top;
      const marginBottom = margins.bottom;
      const zoomFactor = (zoomLevel || 100) / 100;

      const children = Array.from(editorEl.children) as HTMLElement[];
      if (children.length === 0) {
        setSheetPageCount(1);
        return;
      }

      // ── Step 1: Clean reset of any prior page breaks so we measure unconstrained baseline ──
      for (const child of children) {
        if (child.dataset.wordPageBreak === "true") {
          child.style.marginTop = "";
          delete child.dataset.wordPageBreak;
        }
      }

      // Force synchronous reflow to read natural baseline layout
      const paperRect = paperSheetRef.current.getBoundingClientRect();

      interface BlockSnapshot {
        el: HTMLElement;
        isManualPageBreak: boolean;
        isHeading: boolean;
        naturalTop: number;
        naturalHeight: number;
      }

      const snapshots: BlockSnapshot[] = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child || child.nodeType !== 1) continue;
        const rect = child.getBoundingClientRect();
        snapshots.push({
          el: child,
          isManualPageBreak:
            child.dataset.type === "page-break" ||
            child.classList.contains("manuscript-page-break-divider"),
          isHeading: /^H[1-6]$/i.test(child.tagName),
          naturalTop: (rect.top - paperRect.top) / zoomFactor,
          naturalHeight: Math.max(1, rect.height / zoomFactor),
        });
      }

      // ── Step 2: Deterministic Top-to-Bottom Word-Exact Pagination ──
      let currentPage = 0;
      let accumulatedPush = 0;

      for (let i = 0; i < snapshots.length; i++) {
        const item = snapshots[i];
        const effectiveTop = item.naturalTop + accumulatedPush;
        const effectiveBottom = effectiveTop + item.naturalHeight;

        const pageStart = currentPage * stride;
        const pageContentStart = pageStart + marginTop;
        const pageContentEnd = pageStart + pageHeight - marginBottom;

        let shouldBreak = false;

        if (item.isManualPageBreak) {
          // Manual page break node itself stays on current page
          shouldBreak = false;
        } else if (i > 0 && snapshots[i - 1].isManualPageBreak) {
          // Block immediately following a manual page break always starts on the new page
          shouldBreak = true;
        } else if (item.isHeading) {
          // MS Word "Keep with next":
          // A heading must never be separated from at least 2 lines of its subsequent block
          const nextItem = snapshots[i + 1];
          const nextHeight = nextItem ? nextItem.naturalHeight : 0;
          // Required headroom: heading height + at least 2 lines (~56px) of subsequent content + 24px safety buffer
          const headroom = item.naturalHeight + Math.min(nextHeight, 64) + 24;
          if (effectiveTop + headroom > pageContentEnd) {
            shouldBreak = true;
          }
        } else {
          // Standard block element (p, table, ol, ul, blockquote, pre, figure, etc.)
          if (effectiveBottom > pageContentEnd && effectiveTop > pageContentStart + 10) {
            shouldBreak = true;
          }
        }

        if (shouldBreak) {
          currentPage++;
          const targetContentTop = currentPage * stride + marginTop;
          const prevEffectiveBottom =
            i > 0
              ? snapshots[i - 1].naturalTop +
                accumulatedPush +
                snapshots[i - 1].naturalHeight
              : marginTop;
          const spacer = Math.max(
            0,
            Math.round(targetContentTop - prevEffectiveBottom)
          );

          if (spacer > 0) {
            item.el.style.marginTop = `${spacer}px`;
            item.el.dataset.wordPageBreak = "true";
            const shift = targetContentTop - effectiveTop;
            accumulatedPush += Math.max(0, shift);
          }
        }
      }

      // ── Step 3: Total page count calculation ──
      if (snapshots.length > 0) {
        const lastSnapshot = snapshots[snapshots.length - 1];
        const lastEffectiveBottom =
          lastSnapshot.naturalTop + accumulatedPush + lastSnapshot.naturalHeight;
        const calculatedLastPage = Math.max(
          0,
          Math.floor(lastEffectiveBottom / stride)
        );
        currentPage = Math.max(currentPage, calculatedLastPage);
      }

      const totalPages = Math.max(1, currentPage + 1);
      setSheetPageCount(totalPages);
    } finally {
      requestAnimationFrame(() => {
        isReconcilingRef.current = false;
      });
    }
  }, [
    viewMode,
    currentDimensions.height,
    margins.top,
    margins.bottom,
    zoomLevel,
  ]);

  // Reconcile when editor becomes ready or mounts
  useEffect(() => {
    if (!editor) return;
    const t1 = setTimeout(() => reconcilePages(), 50);
    const t2 = setTimeout(() => reconcilePages(), 180);
    const t3 = setTimeout(() => reconcilePages(), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [editor, reconcilePages]);

  // Reconcile on dimension, orientation, margin, view mode, or typography change
  useEffect(() => {
    const timer = setTimeout(() => {
      reconcilePages();
    }, 40);
    return () => clearTimeout(timer);
  }, [
    reconcilePages,
    paperFormat,
    paperOrientation,
    pageMargins,
    viewMode,
    currentFont,
    currentSize,
    currentSpacing,
    layoutColumns,
  ]);

  // Continuous ResizeObserver on editor DOM (catches width changes and structural layout changes)
  useEffect(() => {
    if (!paperSheetRef.current) return;
    const editorEl = paperSheetRef.current.querySelector(
      ".manuscript-tiptap-content .ProseMirror"
    ) as HTMLElement | null;
    if (!editorEl) return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastKnownWidth = editorEl.clientWidth;

    const observer = new ResizeObserver((entries) => {
      if (isReconcilingRef.current) return;
      for (const entry of entries) {
        if (Math.abs(entry.contentRect.width - lastKnownWidth) > 1) {
          lastKnownWidth = entry.contentRect.width;
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            reconcilePages();
          }, 50);
        }
      }
    });

    observer.observe(editorEl);
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, [editor, reconcilePages]);

  // Reconcile on editor content updates (debounced for 120 FPS typing speed)
  useEffect(() => {
    if (!editor) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        reconcilePages();
      }, 80);
    };

    editor.on("update", handleUpdate);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      editor.off("update", handleUpdate);
    };
  }, [editor, reconcilePages]);

  // Reconcile when custom fonts finish loading
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        reconcilePages();
      });
    }
  }, [reconcilePages]);

  // Reconcile on window resize
  useEffect(() => {
    const handleResize = () => reconcilePages();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [reconcilePages]);

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
            Math.min(200, Math.max(40, Math.round(prev + zoomDelta)))
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
        setZoomLevel((prev) => Math.max(40, prev - 10));
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

  // Academic Margin Padding in Pixels (96 DPI Standard: 1 in = 96 px)
  const getMarginStyle = (): React.CSSProperties => {
    if (viewMode === "continuous") {
      return {
        paddingTop: "48px",
        paddingBottom: "48px",
        paddingLeft: "64px",
        paddingRight: "64px",
        ["--paper-margin-top" as any]: "48px",
        ["--paper-margin-bottom" as any]: "48px",
        ["--paper-margin-left" as any]: "64px",
        ["--paper-margin-right" as any]: "64px",
        ["--paper-page-width" as any]: `${currentDimensions.width}px`,
        ["--paper-page-height" as any]: `${currentDimensions.height}px`,
      };
    }
    return {
      paddingTop: `${margins.top}px`,
      paddingBottom: `${margins.bottom}px`,
      paddingLeft: `${margins.left}px`,
      paddingRight: `${margins.right}px`,
      ["--paper-margin-top" as any]: `${margins.top}px`,
      ["--paper-margin-bottom" as any]: `${margins.bottom}px`,
      ["--paper-margin-left" as any]: `${margins.left}px`,
      ["--paper-margin-right" as any]: `${margins.right}px`,
      ["--paper-page-width" as any]: `${currentDimensions.width}px`,
      ["--paper-page-height" as any]: `${currentDimensions.height}px`,
    };
  };

  const activeMarginLeft = viewMode === "continuous" ? 64 : margins.left;
  const activeMarginRight = viewMode === "continuous" ? 64 : margins.right;
  const isMetricDefault = ["a4", "a5", "a3"].includes(paperFormat);

  return (
    <div
      data-lenis-prevent="true"
      className="flex-1 flex flex-col min-h-0 bg-[#eef1f6] relative overflow-hidden font-sans"
    >
      {/* ── Dynamic Print / PDF @page Injection ── */}
      <style>{`
        @media print {
          @page {
            size: ${currentDimensions.widthInches}in ${currentDimensions.heightInches}in;
            margin: 0;
          }
        }
      `}</style>

      {/* ── Scrollable Document Viewport ── */}
      <div
        ref={scrollCanvasRef}
        data-lenis-prevent="true"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`manuscript-scroll-canvas flex-1 min-h-0 overflow-y-auto overflow-x-auto relative ${
          isDraggingOver ? "bg-blue-100/60" : ""
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
        <div className="min-h-full py-8 px-4 sm:px-8 w-full flex flex-col items-center">
          <div
            style={{
              zoom: zoomLevel / 100,
              width: viewMode === "continuous" ? "92%" : `${currentDimensions.width}px`,
              maxWidth: viewMode === "continuous" ? "1200px" : undefined,
            }}
            className="flex flex-col items-center transition-transform duration-75 origin-top"
          >
            {/* ── Top Ruler (Locked 1:1 to Paper Width) ── */}
            <div
              style={{ width: `${currentDimensions.width}px` }}
              className="mb-2 shadow-2xs shrink-0 no-print"
            >
              <ManuscriptTopRuler
                paperWidth={currentDimensions.width}
                marginLeft={activeMarginLeft}
                marginRight={activeMarginRight}
                zoomLevel={zoomLevel}
                viewMode={viewMode}
                isMetricDefault={isMetricDefault}
              />
            </div>

            {/* ── The Virtual Paper Sheet (Google Docs / MS Word Style) ── */}
            <div
              ref={paperSheetRef}
              id="manuscript-paper-sheet"
              data-view-mode={viewMode}
              style={{
                width: `${currentDimensions.width}px`,
                minHeight:
                  viewMode === "continuous"
                    ? "900px"
                    : `${(sheetPageCount - 1) * pageStride + currentDimensions.height}px`,
                ...getMarginStyle(),
              }}
              className="manuscript-paper-sheet relative text-slate-900 selection:bg-blue-100/80"
            >
              {/* ── MS Word Physical Paper Sheet Cards Layer (Print Layout) ── */}
              {viewMode === "pages" && (
                <div className="manuscript-page-cards-layer absolute inset-0 pointer-events-none select-none z-0 no-print">
                  {Array.from({ length: sheetPageCount }).map((_, pageIdx) => {
                    const cardTop = pageIdx * pageStride;
                    return (
                      <div
                        key={`page-sheet-card-${pageIdx}`}
                        className="manuscript-page-sheet-card absolute left-0"
                        style={{
                          top: `${cardTop}px`,
                          width: `${currentDimensions.width}px`,
                          height: `${currentDimensions.height}px`,
                          backgroundColor: "#ffffff",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 12px 28px -4px rgba(0, 0, 0, 0.12)",
                          border: "1px solid #d1d5db",
                          borderRadius: "2px",
                        }}
                      >
                        {/* Page Watermark Pill */}
                        <div className="absolute top-2.5 right-3 text-[9px] font-mono font-medium text-slate-400 select-none">
                          {currentDimensions.name} · Page {pageIdx + 1} of {sheetPageCount}
                        </div>

                        {/* MS Word Margin Corner Crop Marks */}
                        <div
                          style={{
                            top: `${margins.top - 10}px`,
                            left: `${margins.left - 10}px`,
                          }}
                          className="absolute w-2.5 h-2.5 border-t border-l border-slate-300 pointer-events-none"
                        />
                        <div
                          style={{
                            top: `${margins.top - 10}px`,
                            right: `${margins.right - 10}px`,
                          }}
                          className="absolute w-2.5 h-2.5 border-t border-r border-slate-300 pointer-events-none"
                        />
                        <div
                          style={{
                            bottom: `${margins.bottom - 10}px`,
                            left: `${margins.left - 10}px`,
                          }}
                          className="absolute w-2.5 h-2.5 border-b border-l border-slate-300 pointer-events-none"
                        />
                        <div
                          style={{
                            bottom: `${margins.bottom - 10}px`,
                            right: `${margins.right - 10}px`,
                          }}
                          className="absolute w-2.5 h-2.5 border-b border-r border-slate-300 pointer-events-none"
                        />

                        {/* Running Header on this page (if enabled) */}
                        {headerFooter?.headerEnabled && !isEditingHeader && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: `${margins.left}px`,
                              right: `${margins.right}px`,
                              height: `${margins.top}px`,
                            }}
                            className={`flex flex-col justify-end pb-2 select-none ${
                              headerFooter.headerAlign === "left"
                                ? "items-start text-left"
                                : headerFooter.headerAlign === "right"
                                ? "items-end text-right"
                                : "items-center text-center"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans tracking-wide">
                              {headerFooter.headerText && <span>{headerFooter.headerText}</span>}
                              {headerFooter.headerText && headerFooter.headerShowPageNumber && (
                                <span className="text-slate-300">|</span>
                              )}
                              {headerFooter.headerShowPageNumber && (
                                <span className="font-mono text-slate-700 font-semibold">
                                  Page {pageIdx + 1}
                                </span>
                              )}
                            </div>
                            <div className="w-full border-b border-slate-200/80 mt-1" />
                          </div>
                        )}

                        {/* Running Footer on this page (if enabled) */}
                        {headerFooter?.footerEnabled && !isEditingFooter && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: `${margins.left}px`,
                              right: `${margins.right}px`,
                              height: `${margins.bottom}px`,
                            }}
                            className={`flex flex-col justify-start pt-2 select-none ${
                              headerFooter.footerAlign === "left"
                                ? "items-start text-left"
                                : headerFooter.footerAlign === "right"
                                ? "items-end text-right"
                                : "items-center text-center"
                            }`}
                          >
                            <div className="w-full border-t border-slate-200/80 mb-1" />
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans tracking-wide">
                              {headerFooter.footerText && <span>{headerFooter.footerText}</span>}
                              {headerFooter.footerText && headerFooter.footerShowPageNumber && (
                                <span className="text-slate-300">|</span>
                              )}
                              {headerFooter.footerShowPageNumber && (
                                <span className="font-mono text-slate-700 font-semibold">
                                  Page {pageIdx + 1}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Desk Gap Physical Dividers (Covering the 32px desk seam between sheets) ── */}
              {viewMode === "pages" &&
                sheetPageCount > 1 &&
                Array.from({ length: sheetPageCount - 1 }).map((_, i) => {
                  const gapTop = (i + 1) * pageStride - DESK_GAP_PX;
                  return (
                    <div
                      key={`desk-gap-strip-${i}`}
                      style={{
                        position: "absolute",
                        top: `${gapTop}px`,
                        left: "-28px",
                        right: "-28px",
                        height: `${DESK_GAP_PX}px`,
                        backgroundColor: "#eef1f6",
                      }}
                      className="flex items-center justify-between pointer-events-none select-none no-print z-30"
                    >
                      <div className="flex items-center gap-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Page {i + 1} ╌╌ {i + 2}</span>
                      </div>

                      <div className="flex-1 mx-3 border-t border-dashed border-slate-300/80" />

                      <div className="bg-white text-slate-500 border border-slate-300 shadow-xs px-2.5 py-0.5 rounded-full font-mono text-[8.5px]">
                        <span>{currentDimensions.name} ({currentDimensions.widthMm} × {currentDimensions.heightMm} mm)</span>
                      </div>
                    </div>
                  );
                })}

              {/* ── Document Header (MS Word Style in Top Margin) ── */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${margins.left}px`,
                  right: `${margins.right}px`,
                  height: `${margins.top}px`,
                }}
                className="no-print pointer-events-auto z-20"
              >
                {!headerFooter?.headerEnabled && !isEditingHeader && (
                  <div
                    onDoubleClick={() => {
                      onUpdateHeaderFooter?.({
                        ...(headerFooter || DEFAULT_HEADER_FOOTER),
                        headerEnabled: true,
                      });
                      setIsEditingHeader(true);
                      setTimeout(() => headerInputRef.current?.focus(), 50);
                    }}
                    className="h-full flex items-center justify-center text-[10.5px] text-slate-400 italic opacity-0 hover:opacity-100 transition-opacity cursor-pointer border-b border-dashed border-slate-300 select-none"
                    title="Double-click to add Header"
                  >
                    <span>Double-click to add Header</span>
                  </div>
                )}

                {headerFooter?.headerEnabled && !isEditingHeader && (
                  <div
                    onDoubleClick={() => {
                      setIsEditingHeader(true);
                      setTimeout(() => headerInputRef.current?.focus(), 50);
                    }}
                    className={`group relative h-full flex flex-col justify-end pb-2 cursor-pointer select-none border-b border-dashed border-transparent hover:border-blue-400 ${
                      headerFooter.headerAlign === "left"
                        ? "items-start text-left"
                        : headerFooter.headerAlign === "right"
                        ? "items-end text-right"
                        : "items-center text-center"
                    }`}
                    title="Double-click to edit Header"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-sans tracking-wide">
                      {headerFooter.headerText && <span>{headerFooter.headerText}</span>}
                      {headerFooter.headerText && headerFooter.headerShowPageNumber && (
                        <span className="text-slate-300">|</span>
                      )}
                      {headerFooter.headerShowPageNumber && (
                        <span className="font-mono text-slate-700 font-semibold">Page 1</span>
                      )}
                    </div>
                    <span className="absolute top-1 right-0 opacity-0 group-hover:opacity-100 text-[8.5px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded-xs border border-slate-200 transition-opacity">
                      Double-click to edit
                    </span>
                  </div>
                )}

                {isEditingHeader && (
                  <div className="relative h-full flex flex-col justify-end pb-1.5 z-30 select-text">
                    <div className="flex items-center justify-between gap-1.5 mb-1 bg-white border border-blue-400 rounded-xs px-2 py-1 shadow-md">
                      <span className="text-[9.5px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded-xs shrink-0">
                        HEADER
                      </span>
                      <input
                        ref={headerInputRef}
                        type="text"
                        value={headerFooter?.headerText || ""}
                        placeholder="Enter running title or journal name..."
                        onChange={(e) =>
                          onUpdateHeaderFooter?.({
                            ...(headerFooter || DEFAULT_HEADER_FOOTER),
                            headerEnabled: true,
                            headerText: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") {
                            setIsEditingHeader(false);
                            onClearHeaderFooterFocus?.();
                          }
                        }}
                        className="flex-1 text-[11px] text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-xs outline-none focus:border-blue-500 font-sans min-w-0"
                      />
                      <div className="flex items-center border border-slate-200 rounded-xs overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              headerAlign: "left",
                            })
                          }
                          className={`p-1 hover:bg-slate-100 ${
                            headerFooter?.headerAlign === "left"
                              ? "bg-slate-200 text-blue-600"
                              : "text-slate-500"
                          }`}
                          title="Align Left"
                        >
                          <AlignLeft className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              headerAlign: "center",
                            })
                          }
                          className={`p-1 hover:bg-slate-100 ${
                            headerFooter?.headerAlign === "center"
                              ? "bg-slate-200 text-blue-600"
                              : "text-slate-500"
                          }`}
                          title="Align Center"
                        >
                          <AlignCenter className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              headerAlign: "right",
                            })
                          }
                          className={`p-1 hover:bg-slate-100 ${
                            headerFooter?.headerAlign === "right"
                              ? "bg-slate-200 text-blue-600"
                              : "text-slate-500"
                          }`}
                          title="Align Right"
                        >
                          <AlignRight className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateHeaderFooter?.({
                            ...(headerFooter || DEFAULT_HEADER_FOOTER),
                            headerShowPageNumber: !headerFooter?.headerShowPageNumber,
                          })
                        }
                        className={`px-1.5 py-0.5 text-[9.5px] font-semibold rounded-xs border transition-colors shrink-0 ${
                          headerFooter?.headerShowPageNumber
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        # Page
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingHeader(false);
                          onClearHeaderFooterFocus?.();
                        }}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xs cursor-pointer shadow-2xs shrink-0"
                      >
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateHeaderFooter?.({
                            ...(headerFooter || DEFAULT_HEADER_FOOTER),
                            headerEnabled: false,
                            headerText: "",
                            headerShowPageNumber: false,
                          });
                          setIsEditingHeader(false);
                          onClearHeaderFooterFocus?.();
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-xs hover:bg-red-50 transition-colors shrink-0"
                        title="Remove Header"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="w-full border-b border-dashed border-blue-400" />
                  </div>
                )}
              </div>

              {/* ── Document Footer (MS Word Style in Bottom Margin) ── */}
              <div
                style={{
                  position: "absolute",
                  top: viewMode === "continuous" ? undefined : `${currentDimensions.height - margins.bottom}px`,
                  bottom: viewMode === "continuous" ? 0 : undefined,
                  left: `${margins.left}px`,
                  right: `${margins.right}px`,
                  height: `${margins.bottom}px`,
                }}
                className="no-print pointer-events-auto z-20"
              >
                {!headerFooter?.footerEnabled && !isEditingFooter && (
                  <div
                    onDoubleClick={() => {
                      onUpdateHeaderFooter?.({
                        ...(headerFooter || DEFAULT_HEADER_FOOTER),
                        footerEnabled: true,
                      });
                      setIsEditingFooter(true);
                      setTimeout(() => footerInputRef.current?.focus(), 50);
                    }}
                    className="h-full flex items-center justify-center text-[10.5px] text-slate-400 italic opacity-0 hover:opacity-100 transition-opacity cursor-pointer border-t border-dashed border-slate-300 select-none"
                    title="Double-click to add Footer"
                  >
                    <span>Double-click to add Footer</span>
                  </div>
                )}

                {headerFooter?.footerEnabled && !isEditingFooter && (
                  <div
                    onDoubleClick={() => {
                      setIsEditingFooter(true);
                      setTimeout(() => footerInputRef.current?.focus(), 50);
                    }}
                    className={`group relative h-full flex flex-col justify-start pt-2 cursor-pointer select-none border-t border-dashed border-transparent hover:border-purple-400 ${
                      headerFooter.footerAlign === "left"
                        ? "items-start text-left"
                        : headerFooter.footerAlign === "right"
                        ? "items-end text-right"
                        : "items-center text-center"
                    }`}
                    title="Double-click to edit Footer"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-sans tracking-wide">
                      {headerFooter.footerText && <span>{headerFooter.footerText}</span>}
                      {headerFooter.footerText && headerFooter.footerShowPageNumber && (
                        <span className="text-slate-300">|</span>
                      )}
                      {headerFooter.footerShowPageNumber && (
                        <span className="font-mono text-slate-700 font-semibold">Page 1</span>
                      )}
                    </div>
                    <span className="absolute bottom-1 right-0 opacity-0 group-hover:opacity-100 text-[8.5px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded-xs border border-slate-200 transition-opacity">
                      Double-click to edit
                    </span>
                  </div>
                )}

                {isEditingFooter && (
                  <div className="relative h-full flex flex-col justify-start pt-1.5 z-30 select-text">
                    <div className="w-full border-t border-dashed border-purple-400 mb-1" />
                    <div className="flex items-center justify-between gap-1.5 bg-white border border-purple-400 rounded-xs px-2 py-1 shadow-md">
                      <span className="text-[9.5px] font-bold text-purple-700 bg-purple-50 px-1 py-0.5 rounded-xs shrink-0">
                        FOOTER
                      </span>
                      <input
                        ref={footerInputRef}
                        type="text"
                        value={headerFooter?.footerText || ""}
                        placeholder="Enter footer text (e.g. Confidential, Journal Notes)..."
                        onChange={(e) =>
                          onUpdateHeaderFooter?.({
                            ...(headerFooter || DEFAULT_HEADER_FOOTER),
                            footerEnabled: true,
                            footerText: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") {
                            setIsEditingFooter(false);
                            onClearHeaderFooterFocus?.();
                          }
                        }}
                        className="flex-1 text-[11px] text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-xs outline-none focus:border-purple-500 font-sans min-w-0"
                      />
                      <div className="flex items-center border border-slate-200 rounded-xs overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              footerAlign: "left",
                            })
                          }
                          className={`p-1 hover:bg-slate-100 ${
                            headerFooter?.footerAlign === "left"
                              ? "bg-slate-200 text-purple-600"
                              : "text-slate-500"
                          }`}
                          title="Align Left"
                        >
                          <AlignLeft className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              footerAlign: "center",
                            })
                          }
                          className={`p-1 hover:bg-slate-100 ${
                            headerFooter?.footerAlign === "center"
                              ? "bg-slate-200 text-purple-600"
                              : "text-slate-500"
                          }`}
                          title="Align Center"
                        >
                          <AlignCenter className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              footerAlign: "right",
                            })
                          }
                          className={`p-1 hover:bg-slate-100 ${
                            headerFooter?.footerAlign === "right"
                              ? "bg-slate-200 text-purple-600"
                              : "text-slate-500"
                          }`}
                          title="Align Right"
                        >
                          <AlignRight className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateHeaderFooter?.({
                            ...(headerFooter || DEFAULT_HEADER_FOOTER),
                            footerShowPageNumber: !headerFooter?.footerShowPageNumber,
                          })
                        }
                        className={`px-1.5 py-0.5 text-[9.5px] font-semibold rounded-xs border transition-colors shrink-0 ${
                          headerFooter?.footerShowPageNumber
                            ? "bg-purple-100 border-purple-300 text-purple-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        # Page
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingFooter(false);
                          onClearHeaderFooterFocus?.();
                        }}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-xs cursor-pointer shadow-2xs shrink-0"
                      >
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateHeaderFooter?.({
                            ...(headerFooter || DEFAULT_HEADER_FOOTER),
                            footerEnabled: false,
                            footerText: "",
                            footerShowPageNumber: false,
                          });
                          setIsEditingFooter(false);
                          onClearHeaderFooterFocus?.();
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-xs hover:bg-red-50 transition-colors shrink-0"
                        title="Remove Footer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Print Header & Footer Elements ── */}
              {headerFooter?.headerEnabled && (
                <div
                  className={`manuscript-print-header hidden ${
                    headerFooter.headerAlign === "left"
                      ? "text-left"
                      : headerFooter.headerAlign === "right"
                      ? "text-right"
                      : "text-center"
                  }`}
                >
                  {headerFooter.headerText && <span>{headerFooter.headerText}</span>}
                  {headerFooter.headerText && headerFooter.headerShowPageNumber && (
                    <span> | </span>
                  )}
                  {headerFooter.headerShowPageNumber && <span>Page 1</span>}
                </div>
              )}
              {headerFooter?.footerEnabled && (
                <div
                  className={`manuscript-print-footer hidden ${
                    headerFooter.footerAlign === "left"
                      ? "text-left"
                      : headerFooter.footerAlign === "right"
                      ? "text-right"
                      : "text-center"
                  }`}
                >
                  {headerFooter.footerText && <span>{headerFooter.footerText}</span>}
                  {headerFooter.footerText && headerFooter.footerShowPageNumber && (
                    <span> | </span>
                  )}
                  {headerFooter.footerShowPageNumber && <span>Page 1</span>}
                </div>
              )}

              {/* TipTap Content Area with Typography Properties */}
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  fontFamily: currentFont,
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
                  className="manuscript-tiptap-content focus:outline-none"
                />
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
        pageMargins={pageMargins}
        sheetPageCount={sheetPageCount}
        activePageNumber={activePageNumber}
        viewMode={viewMode}
        zoomLevel={zoomLevel}
        onSetZoom={setZoomLevel}
        onFitPage={handleFitPage}
        onFitWidth={handleFitWidth}
      />
    </div>
  );
}

export const ManuscriptEditorCanvas = memo(ManuscriptEditorCanvasInner);
