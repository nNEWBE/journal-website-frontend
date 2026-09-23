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
  const dynamicPaginationStyleRef = useRef<HTMLStyleElement>(null);
  const [sheetPageCount, setSheetPageCount] = useState<number>(1);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const isReconcilingRef = useRef(false);
  const needsReconcileRef = useRef(false);

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

  // Authentic MS Word Real-DOM pagination engine with CSS-Isolated Spacers & Strict Margin Exclusion
  const reconcilePages = useCallback(() => {
    if (typeof window === "undefined" || !paperSheetRef.current) return;
    if (isReconcilingRef.current) {
      needsReconcileRef.current = true;
      return;
    }

    const editorEl = paperSheetRef.current.querySelector(
      ".manuscript-tiptap-content .ProseMirror"
    ) as HTMLElement | null;

    if (!editorEl) return;

    if (viewMode !== "pages") {
      if (dynamicPaginationStyleRef.current) {
        dynamicPaginationStyleRef.current.textContent = "";
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
        if (dynamicPaginationStyleRef.current) {
          dynamicPaginationStyleRef.current.textContent = "";
        }
        setSheetPageCount(1);
        return;
      }

      // Step 1: Clear previous dynamic rules to re-evaluate from clean baseline
      if (dynamicPaginationStyleRef.current) {
        dynamicPaginationStyleRef.current.textContent = "";
      }

      const paperRect = paperSheetRef.current.getBoundingClientRect();
      let currentPage = 0;
      const cssRules: string[] = [];

      // Step 2: Sequential Real-DOM pagination using non-destructive CSS nth-child rules
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child || child.nodeType !== 1) continue;

        const isManualPageBreak =
          child.dataset.type === "page-break" ||
          child.classList.contains("manuscript-page-break-divider");

        if (isManualPageBreak) {
          currentPage++;
          const targetContentTop = currentPage * stride + marginTop;
          const nextChild = children[i + 1];
          if (nextChild) {
            const childBottom =
              (child.getBoundingClientRect().bottom - paperRect.top) / zoomFactor;
            const spacer = Math.max(0, Math.round(targetContentTop - childBottom));
            if (spacer > 0) {
              const nthChild = i + 2;
              cssRules.push(
                `.manuscript-tiptap-content .ProseMirror > *:nth-child(${nthChild}) { margin-top: ${spacer}px !important; }`
              );
              if (dynamicPaginationStyleRef.current) {
                dynamicPaginationStyleRef.current.textContent = cssRules.join("\n");
              }
            }
          }
          continue;
        }

        const childRect = child.getBoundingClientRect();
        const elemTop = (childRect.top - paperRect.top) / zoomFactor;
        const elemHeight = childRect.height / zoomFactor;
        const elemBottom = elemTop + elemHeight;

        currentPage = Math.max(currentPage, Math.floor(elemTop / stride));
        const pageStart = currentPage * stride;
        const pageContentStart = pageStart + marginTop;
        const pageContentEnd = pageStart + pageHeight - marginBottom;

        const isHeading = /^H[1-6]$/i.test(child.tagName);
        let shouldBreak = false;

        if (isHeading) {
          const nextChild = children[i + 1];
          const nextHeight = nextChild
            ? nextChild.getBoundingClientRect().height / zoomFactor
            : 0;
          const headroom = elemHeight + Math.min(nextHeight, 140) + 24;
          if (elemTop + headroom > pageContentEnd && elemTop > pageContentStart + 10) {
            shouldBreak = true;
          }
        } else {
          const overflowsBottom = elemBottom > pageContentEnd - 6;
          const nearBottomEdge = elemTop > pageContentEnd - 24;
          if ((overflowsBottom || nearBottomEdge) && elemTop > pageContentStart + 10) {
            shouldBreak = true;
          }
        }

        if (shouldBreak) {
          currentPage++;
          const targetContentTop = currentPage * stride + marginTop;

          let prevBottom = pageContentStart;
          for (let k = i - 1; k >= 0; k--) {
            const prev = children[k];
            if (prev && prev.nodeType === 1 && prev.clientHeight > 0) {
              prevBottom =
                (prev.getBoundingClientRect().bottom - paperRect.top) / zoomFactor;
              break;
            }
          }

          const spacer = Math.max(0, Math.round(targetContentTop - prevBottom));
          if (spacer > 0) {
            const nthChild = i + 1;
            cssRules.push(
              `.manuscript-tiptap-content .ProseMirror > *:nth-child(${nthChild}) { margin-top: ${spacer}px !important; }`
            );
            if (dynamicPaginationStyleRef.current) {
              dynamicPaginationStyleRef.current.textContent = cssRules.join("\n");
            }
          }
        }
      }

      // Step 3: Total page count calculation
      if (children.length > 0) {
        const lastChild = children[children.length - 1];
        const lastRect = lastChild.getBoundingClientRect();
        const lastBottom = (lastRect.bottom - paperRect.top) / zoomFactor;
        const calculatedLastPage = Math.max(
          0,
          Math.floor(lastBottom / stride)
        );
        currentPage = Math.max(currentPage, calculatedLastPage);
      }

      const totalPages = Math.max(1, currentPage + 1);
      setSheetPageCount(totalPages);
    } finally {
      requestAnimationFrame(() => {
        isReconcilingRef.current = false;
        if (needsReconcileRef.current) {
          needsReconcileRef.current = false;
          reconcilePages();
        }
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

  // Continuous ResizeObserver on editor DOM (catches both width and height changes reliably)
  useEffect(() => {
    if (!paperSheetRef.current) return;
    const editorEl = paperSheetRef.current.querySelector(
      ".manuscript-tiptap-content .ProseMirror"
    ) as HTMLElement | null;
    if (!editorEl) return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastKnownWidth = editorEl.clientWidth;
    let lastKnownHeight = editorEl.clientHeight;

    const observer = new ResizeObserver((entries) => {
      // Ignore height adjustments triggered by our own spacer modifications
      if (isReconcilingRef.current) return;

      for (const entry of entries) {
        const widthChanged = Math.abs(entry.contentRect.width - lastKnownWidth) > 1;
        const heightChanged = Math.abs(entry.contentRect.height - lastKnownHeight) > 1;
        if (widthChanged || heightChanged) {
          lastKnownWidth = entry.contentRect.width;
          lastKnownHeight = entry.contentRect.height;
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            reconcilePages();
          }, 40);
        }
      }
    });

    observer.observe(editorEl);

    // Continuous MutationObserver on editor DOM (catches direct block additions, deletions, typing)
    const mutationObserver = new MutationObserver(() => {
      // Ignore DOM modifications made by reconcilePages itself
      if (isReconcilingRef.current) return;

      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        reconcilePages();
      }, 50);
    });

    mutationObserver.observe(editorEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Run initial reconcile once editor DOM is bound
    const initTimer = setTimeout(() => {
      reconcilePages();
    }, 60);

    return () => {
      clearTimeout(initTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [editor, reconcilePages]);

  // Reconcile on editor content updates & transactions (debounced for fluid typing speed)
  useEffect(() => {
    if (!editor) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleUpdate = () => {
      if (isReconcilingRef.current) {
        needsReconcileRef.current = true;
        return;
      }
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        reconcilePages();
      }, 50);
    };

    editor.on("update", handleUpdate);
    editor.on("transaction", handleUpdate);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      editor.off("update", handleUpdate);
      editor.off("transaction", handleUpdate);
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
              {/* Dynamic Non-Destructive CSS Page Break Spacer Engine (Zero ProseMirror DOM mutation) */}
              <style ref={dynamicPaginationStyleRef} id="manuscript-dynamic-pagination-styles" />

              {/* ── MS Word Physical Paper Sheet Cards Layer (Print Layout Base: z-0) ── */}
              {viewMode === "pages" && (
                <div className="manuscript-page-cards-layer absolute inset-0 pointer-events-none select-none z-0 no-print">
                  {Array.from({ length: sheetPageCount }).map((_, pageIdx) => {
                    const cardTop = pageIdx * pageStride;
                    return (
                      <div
                        key={`page-sheet-card-${pageIdx}`}
                        className="manuscript-page-sheet-card absolute left-0 pointer-events-none"
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
                      />
                    );
                  })}
                </div>
              )}

              {/* ── MS Word Header & Footer Margin Exclusion Masks (z-20, in front of text at z-10) ── */}
              {viewMode === "pages" && (
                <div className="manuscript-page-masks-layer absolute inset-0 pointer-events-none select-none z-20 no-print">
                  {Array.from({ length: sheetPageCount }).map((_, pageIdx) => {
                    const cardTop = pageIdx * pageStride;
                    const pageNum = pageIdx + 1;
                    const pageFmt = headerFooter?.pageNumberFormat || "page-n";
                    const formattedPageStr =
                      pageFmt === "number"
                        ? `${pageNum}`
                        : pageFmt === "page-n-of-total"
                        ? `Page ${pageNum} of ${sheetPageCount}`
                        : `Page ${pageNum}`;

                    const trimmedHeaderText = headerFooter?.headerText?.trim() || "";
                    const isHeaderRedundant =
                      trimmedHeaderText === "1" ||
                      trimmedHeaderText.toLowerCase() === "page 1" ||
                      trimmedHeaderText.toLowerCase() === `page ${pageNum}` ||
                      trimmedHeaderText === `${pageNum}`;
                    const hasHeaderText =
                      Boolean(trimmedHeaderText) &&
                      !(headerFooter?.headerShowPageNumber && isHeaderRedundant);

                    const trimmedFooterText = headerFooter?.footerText?.trim() || "";
                    const isFooterRedundant =
                      trimmedFooterText === "1" ||
                      trimmedFooterText.toLowerCase() === "page 1" ||
                      trimmedFooterText.toLowerCase() === `page ${pageNum}` ||
                      trimmedFooterText === `${pageNum}`;
                    const hasFooterText =
                      Boolean(trimmedFooterText) &&
                      !(headerFooter?.footerShowPageNumber && isFooterRedundant);

                    return (
                      <React.Fragment key={`page-masks-group-${pageIdx}`}>
                        {/* ── Header Margin Exclusion Mask (Top 0 to margins.top) ── */}
                        <div
                          style={{
                            position: "absolute",
                            top: `${cardTop}px`,
                            left: 0,
                            width: `${currentDimensions.width}px`,
                            height: `${margins.top}px`,
                            backgroundColor: "#ffffff",
                            borderTopLeftRadius: "2px",
                            borderTopRightRadius: "2px",
                          }}
                          className="pointer-events-none select-none"
                        >
                          {/* Corner Crop Marks for Top Margin */}
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

                          {/* Running Header */}
                          {headerFooter?.headerEnabled && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                left: `${margins.left}px`,
                                right: `${margins.right}px`,
                              }}
                              onDoubleClick={() => {
                                setActivePageNumber(pageIdx + 1);
                                setIsEditingHeader(true);
                                setTimeout(() => headerInputRef.current?.focus(), 50);
                              }}
                              className={`group flex flex-col justify-end pb-2 select-none pointer-events-auto cursor-pointer border-b border-dashed border-transparent hover:border-blue-300 transition-colors ${
                                headerFooter.headerAlign === "left"
                                  ? "items-start text-left"
                                  : headerFooter.headerAlign === "right"
                                  ? "items-end text-right"
                                  : "items-center text-center"
                              } ${
                                isEditingHeader && activePageNumber === pageIdx + 1
                                  ? "invisible"
                                  : "visible"
                              }`}
                              title="Double-click to edit Header"
                            >
                              <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-sans tracking-wide">
                                {hasHeaderText && <span>{trimmedHeaderText}</span>}
                                {hasHeaderText && headerFooter.headerShowPageNumber && (
                                  <span className="text-slate-300 mx-0.5">|</span>
                                )}
                                {headerFooter.headerShowPageNumber && (
                                  <span className="font-sans text-slate-700 font-medium">
                                    {formattedPageStr}
                                  </span>
                                )}
                              </div>
                              <div className="w-full border-b border-slate-200/80 mt-1" />
                            </div>
                          )}

                          {/* Prompt to add Header on double click if not yet enabled */}
                          {!headerFooter?.headerEnabled && !isEditingHeader && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                left: `${margins.left}px`,
                                right: `${margins.right}px`,
                              }}
                              onDoubleClick={() => {
                                setActivePageNumber(pageIdx + 1);
                                onUpdateHeaderFooter?.({
                                  ...(headerFooter || DEFAULT_HEADER_FOOTER),
                                  headerEnabled: true,
                                });
                                setIsEditingHeader(true);
                                setTimeout(() => headerInputRef.current?.focus(), 50);
                              }}
                              className="group flex items-center justify-center pointer-events-auto cursor-pointer border-b border-dashed border-transparent hover:border-slate-300 transition-colors select-none"
                              title="Double-click to add Header"
                            >
                              <span className="text-[10px] text-slate-400 italic opacity-0 group-hover:opacity-100 transition-opacity">
                                Double-click to add Header
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ── Footer Margin Exclusion Mask (Bottom pageHeight - margins.bottom to pageHeight) ── */}
                        <div
                          style={{
                            position: "absolute",
                            top: `${cardTop + currentDimensions.height - margins.bottom}px`,
                            left: 0,
                            width: `${currentDimensions.width}px`,
                            height: `${margins.bottom}px`,
                            backgroundColor: "#ffffff",
                            borderBottomLeftRadius: "2px",
                            borderBottomRightRadius: "2px",
                          }}
                          className="pointer-events-none select-none"
                        >
                          {/* Corner Crop Marks for Bottom Margin */}
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

                          {/* Running Footer */}
                          {headerFooter?.footerEnabled && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                left: `${margins.left}px`,
                                right: `${margins.right}px`,
                              }}
                              onDoubleClick={() => {
                                setActivePageNumber(pageIdx + 1);
                                setIsEditingFooter(true);
                                setTimeout(() => footerInputRef.current?.focus(), 50);
                              }}
                              className={`group flex flex-col justify-start pt-2 select-none pointer-events-auto cursor-pointer border-t border-dashed border-transparent hover:border-purple-300 transition-colors ${
                                headerFooter.footerAlign === "left"
                                  ? "items-start text-left"
                                  : headerFooter.footerAlign === "right"
                                  ? "items-end text-right"
                                  : "items-center text-center"
                              } ${
                                isEditingFooter && activePageNumber === pageIdx + 1
                                  ? "invisible"
                                  : "visible"
                              }`}
                              title="Double-click to edit Footer"
                            >
                              <div className="w-full border-t border-slate-200/80 mb-1" />
                              <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-sans tracking-wide">
                                {hasFooterText && <span>{trimmedFooterText}</span>}
                                {hasFooterText && headerFooter.footerShowPageNumber && (
                                  <span className="text-slate-300 mx-0.5">|</span>
                                )}
                                {headerFooter.footerShowPageNumber && (
                                  <span className="font-sans text-slate-700 font-medium">
                                    {formattedPageStr}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Prompt to add Footer on double click if not yet enabled */}
                          {!headerFooter?.footerEnabled && !isEditingFooter && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                left: `${margins.left}px`,
                                right: `${margins.right}px`,
                              }}
                              onDoubleClick={() => {
                                setActivePageNumber(pageIdx + 1);
                                onUpdateHeaderFooter?.({
                                  ...(headerFooter || DEFAULT_HEADER_FOOTER),
                                  footerEnabled: true,
                                });
                                setIsEditingFooter(true);
                                setTimeout(() => footerInputRef.current?.focus(), 50);
                              }}
                              className="group flex items-center justify-center pointer-events-auto cursor-pointer border-t border-dashed border-transparent hover:border-slate-300 transition-colors select-none"
                              title="Double-click to add Footer"
                            >
                              <span className="text-[10px] text-slate-400 italic opacity-0 group-hover:opacity-100 transition-opacity">
                                Double-click to add Footer
                              </span>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
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
              {((viewMode === "pages" && isEditingHeader) ||
                (viewMode === "continuous" && (headerFooter?.headerEnabled || isEditingHeader))) && (
                <div
                  style={{
                    position: "absolute",
                    top:
                      viewMode === "pages"
                        ? `${(activePageNumber - 1) * pageStride}px`
                        : 0,
                    left: `${margins.left}px`,
                    right: `${margins.right}px`,
                    height: `${margins.top}px`,
                  }}
                  className="no-print pointer-events-auto z-40 select-text"
                >
                  {isEditingHeader ? (
                    <div className="relative h-full flex flex-col justify-end pb-1.5 z-40">
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
                          onClick={() => {
                            const nextVal = !headerFooter?.headerShowPageNumber;
                            let nextText = headerFooter?.headerText || "";
                            if (nextText.trim() === "1" || nextText.trim().toLowerCase() === "page 1") {
                              nextText = "";
                            }
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              headerShowPageNumber: nextVal,
                              headerText: nextText,
                            });
                          }}
                          className={`px-1.5 py-0.5 text-[9.5px] font-semibold rounded-xs border transition-colors shrink-0 ${
                            headerFooter?.headerShowPageNumber
                              ? "bg-blue-100 border-blue-300 text-blue-800"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                          title="Toggle Page Number"
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
                  ) : (
                    /* Continuous mode static header display */
                    <div
                      onDoubleClick={() => {
                        setIsEditingHeader(true);
                        setTimeout(() => headerInputRef.current?.focus(), 50);
                      }}
                      className={`group relative h-full flex flex-col justify-end pb-2 cursor-pointer select-none border-b border-dashed border-transparent hover:border-blue-400 ${
                        headerFooter?.headerAlign === "left"
                          ? "items-start text-left"
                          : headerFooter?.headerAlign === "right"
                          ? "items-end text-right"
                          : "items-center text-center"
                      }`}
                      title="Double-click to edit Header"
                    >
                      <div className="flex items-center gap-2 text-[10.5px] text-slate-600 font-sans tracking-wide">
                        {headerFooter?.headerText?.trim() && <span>{headerFooter.headerText.trim()}</span>}
                        {headerFooter?.headerText?.trim() && headerFooter.headerShowPageNumber && (
                          <span className="text-slate-300 mx-0.5">|</span>
                        )}
                        {headerFooter?.headerShowPageNumber && (
                          <span className="font-sans text-slate-700 font-medium">Page 1</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Document Footer (MS Word Style in Bottom Margin) ── */}
              {((viewMode === "pages" && isEditingFooter) ||
                (viewMode === "continuous" && (headerFooter?.footerEnabled || isEditingFooter))) && (
                <div
                  style={{
                    position: "absolute",
                    top:
                      viewMode === "pages"
                        ? `${(activePageNumber - 1) * pageStride + currentDimensions.height - margins.bottom}px`
                        : undefined,
                    bottom: viewMode === "continuous" ? 0 : undefined,
                    left: `${margins.left}px`,
                    right: `${margins.right}px`,
                    height: `${margins.bottom}px`,
                  }}
                  className="no-print pointer-events-auto z-40 select-text"
                >
                  {isEditingFooter ? (
                    <div className="relative h-full flex flex-col justify-start pt-1.5 z-40">
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
                          onClick={() => {
                            const nextVal = !headerFooter?.footerShowPageNumber;
                            let nextText = headerFooter?.footerText || "";
                            if (nextText.trim() === "1" || nextText.trim().toLowerCase() === "page 1") {
                              nextText = "";
                            }
                            onUpdateHeaderFooter?.({
                              ...(headerFooter || DEFAULT_HEADER_FOOTER),
                              footerShowPageNumber: nextVal,
                              footerText: nextText,
                            });
                          }}
                          className={`px-1.5 py-0.5 text-[9.5px] font-semibold rounded-xs border transition-colors shrink-0 ${
                            headerFooter?.footerShowPageNumber
                              ? "bg-purple-100 border-purple-300 text-purple-800"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                          title="Toggle Page Number"
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
                  ) : (
                    /* Continuous mode static footer display */
                    <div
                      onDoubleClick={() => {
                        setIsEditingFooter(true);
                        setTimeout(() => footerInputRef.current?.focus(), 50);
                      }}
                      className={`group relative h-full flex flex-col justify-start pt-2 cursor-pointer select-none border-t border-dashed border-transparent hover:border-purple-400 ${
                        headerFooter?.footerAlign === "left"
                          ? "items-start text-left"
                          : headerFooter?.footerAlign === "right"
                          ? "items-end text-right"
                          : "items-center text-center"
                      }`}
                      title="Double-click to edit Footer"
                    >
                      <div className="flex items-center gap-2 text-[10.5px] text-slate-600 font-sans tracking-wide">
                        {headerFooter?.footerText?.trim() && <span>{headerFooter.footerText.trim()}</span>}
                        {headerFooter?.footerText?.trim() && headerFooter.footerShowPageNumber && (
                          <span className="text-slate-300 mx-0.5">|</span>
                        )}
                        {headerFooter?.footerShowPageNumber && (
                          <span className="font-sans text-slate-700 font-medium">Page 1</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  {headerFooter.headerText?.trim() && <span>{headerFooter.headerText.trim()}</span>}
                  {headerFooter.headerText?.trim() && headerFooter.headerShowPageNumber && (
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
                  {headerFooter.footerText?.trim() && <span>{headerFooter.footerText.trim()}</span>}
                  {headerFooter.footerText?.trim() && headerFooter.footerShowPageNumber && (
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
