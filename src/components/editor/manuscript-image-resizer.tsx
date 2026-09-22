"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Move,
  RotateCcw,
  Trash2,
  Type,
  WrapText,
  X,
} from "lucide-react";
import { toast } from "sonner";

export type ImageWrapMode = "inline" | "center" | "wrap-left" | "wrap-right";

interface ManuscriptImageResizerProps {
  selectedImage: HTMLImageElement | null;
  onDeselect: () => void;
  onContentChange: () => void;
  zoom?: number;
  editorRef?: React.RefObject<HTMLDivElement | null>;
}

// Cross-browser helper to get caret Range from viewport (X, Y)
export function getRangeFromPoint(x: number, y: number): Range | null {
  if (typeof document === "undefined") return null;
  const doc = document as unknown as {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (doc.caretRangeFromPoint) {
    return doc.caretRangeFromPoint(x, y);
  }
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    if (pos) {
      const range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
      return range;
    }
  }
  return null;
}

// Find top-level figure container or root block
export function getImageContainer(img: HTMLImageElement): HTMLElement {
  const parent = img.parentElement;
  if (!parent) return img;
  if (
    parent.tagName === "FIGURE" ||
    parent.getAttribute("data-figure-wrapper") === "true" ||
    (parent.tagName === "DIV" && parent.childElementCount <= 2 && parent.contains(img))
  ) {
    return parent;
  }
  return img;
}

export function ManuscriptImageResizer({
  selectedImage,
  onDeselect,
  onContentChange,
  zoom = 100,
  editorRef,
}: ManuscriptImageResizerProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [currentWidthPx, setCurrentWidthPx] = useState<number>(0);

  const startPos = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    aspectRatio: number;
  }>({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    aspectRatio: 1,
  });

  // Re-measure selected image position on screen
  const updateRect = () => {
    if (!selectedImage) {
      setRect(null);
      return;
    }
    const r = selectedImage.getBoundingClientRect();
    setRect(r);
    setCurrentWidthPx(Math.round(r.width / ((zoom || 100) / 100)));
  };

  useEffect(() => {
    if (!selectedImage) {
      setRect(null);
      return;
    }

    updateRect();

    let rafId: number | null = null;
    const handleScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateRect();
          rafId = null;
        });
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [selectedImage, zoom]);

  // Handle keyboard Shortcuts: Delete, Move Up/Down (Alt+Arrow), Deselect (Esc)
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteImage();
      } else if (e.key === "Escape") {
        onDeselect();
      } else if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        moveUp();
      } else if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        moveDown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  if (!selectedImage || !rect) return null;

  // ── 1. Image Actions & Movement Handlers ──
  const deleteImage = () => {
    if (!selectedImage) return;
    const container = getImageContainer(selectedImage);
    container.remove();
    onDeselect();
    onContentChange();
    toast.info("Image removed from manuscript.");
  };

  // Move image block before previous paragraph
  const moveUp = () => {
    if (!selectedImage) return;
    const block = getImageContainer(selectedImage);
    const prev = block.previousElementSibling;
    if (prev && prev !== block) {
      block.parentElement?.insertBefore(block, prev);
      updateRect();
      onContentChange();
      toast.success("Moved image up");
    } else {
      toast.info("Image is already at the top of this section");
    }
  };

  // Move image block after next paragraph
  const moveDown = () => {
    if (!selectedImage) return;
    const block = getImageContainer(selectedImage);
    const next = block.nextElementSibling;
    if (next && next !== block) {
      block.parentElement?.insertBefore(block, next.nextElementSibling);
      updateRect();
      onContentChange();
      toast.success("Moved image down");
    } else {
      toast.info("Image is already at the bottom of this section");
    }
  };

  // ── 2. Drag to Move Implementation ──
  const handleMoveMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMoving(true);

    let activeRange: Range | null = null;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const range = getRangeFromPoint(moveEvent.clientX, moveEvent.clientY);
      if (
        range &&
        editorRef?.current &&
        editorRef.current.contains(range.startContainer)
      ) {
        activeRange = range;
        const rects = range.getClientRects();
        if (rects.length > 0) {
          const r = rects[0];
          setDropIndicator({ top: r.top, left: r.left, width: 140 });
        } else if (range.startContainer instanceof Element) {
          const r = range.startContainer.getBoundingClientRect();
          setDropIndicator({ top: r.top, left: r.left, width: r.width });
        }
      }
    };

    const onMouseUp = () => {
      setIsMoving(false);
      setDropIndicator(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      if (activeRange && editorRef?.current) {
        const block = getImageContainer(selectedImage);
        try {
          activeRange.insertNode(block);
          block.scrollIntoView({ block: "nearest", behavior: "smooth" });
          updateRect();
          onContentChange();
          toast.success("Image moved to new position");
        } catch (err) {
          console.error("Failed to move image to caret:", err);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // ── 3. Text Wrapping / Float Modes ──
  const applyWrapMode = (mode: ImageWrapMode) => {
    if (!selectedImage) return;
    const container = getImageContainer(selectedImage);

    if (mode === "center") {
      selectedImage.style.display = "block";
      selectedImage.style.margin = "16pt auto 6pt auto";
      selectedImage.style.float = "none";
      selectedImage.style.clear = "both";

      if (container !== selectedImage) {
        container.style.display = "block";
        container.style.margin = "16pt auto";
        container.style.float = "none";
        container.style.clear = "both";
        container.style.textAlign = "center";
      }
    } else if (mode === "wrap-left") {
      selectedImage.style.display = "block";
      selectedImage.style.float = "left";
      selectedImage.style.margin = "6pt 16pt 10pt 0";
      selectedImage.style.clear = "none";

      if (container !== selectedImage) {
        container.style.display = "inline-block";
        container.style.float = "left";
        container.style.margin = "6pt 16pt 10pt 0";
        container.style.clear = "none";
      }
    } else if (mode === "wrap-right") {
      selectedImage.style.display = "block";
      selectedImage.style.float = "right";
      selectedImage.style.margin = "6pt 0 10pt 16pt";
      selectedImage.style.clear = "none";

      if (container !== selectedImage) {
        container.style.display = "inline-block";
        container.style.float = "right";
        container.style.margin = "6pt 0 10pt 16pt";
        container.style.clear = "none";
      }
    } else if (mode === "inline") {
      selectedImage.style.display = "inline-block";
      selectedImage.style.margin = "4pt 8pt";
      selectedImage.style.float = "none";
      selectedImage.style.clear = "none";
      selectedImage.style.verticalAlign = "middle";

      if (container !== selectedImage) {
        container.style.display = "inline-block";
        container.style.margin = "4pt 8pt";
        container.style.float = "none";
        container.style.clear = "none";
      }
    }

    updateRect();
    onContentChange();
  };

  // Preset Width scaling (25%, 50%, 75%, 100%)
  const applyPresetWidth = (percentage: number) => {
    if (!selectedImage) return;
    const paperWidth = 720; // standard simulated A4 content width
    const targetPx = Math.round((paperWidth * percentage) / 100);

    selectedImage.style.width = `${targetPx}px`;
    selectedImage.style.height = "auto";
    selectedImage.style.maxWidth = "100%";

    const container = getImageContainer(selectedImage);
    if (container !== selectedImage) {
      container.style.maxWidth = "100%";
    }

    updateRect();
    onContentChange();
    toast.success(`Image resized to ${percentage}% width`);
  };

  const resetOriginalSize = () => {
    if (!selectedImage) return;
    selectedImage.style.width = "";
    selectedImage.style.height = "auto";
    selectedImage.style.maxWidth = "100%";
    updateRect();
    onContentChange();
    toast.info("Reset to original image dimensions.");
  };

  const editCaption = () => {
    if (!selectedImage) return;
    const currentCaption =
      selectedImage.getAttribute("alt") ||
      selectedImage.nextElementSibling?.textContent ||
      "Figure: Scholarly illustration";
    const nextCaption = window.prompt("Enter figure caption:", currentCaption);
    if (nextCaption !== null) {
      selectedImage.setAttribute("alt", nextCaption.trim());
      const nextElem = selectedImage.nextElementSibling;
      if (
        nextElem &&
        nextElem.tagName === "P" &&
        nextElem.getAttribute("data-caption") === "true"
      ) {
        nextElem.textContent = nextCaption.trim();
      } else {
        const captionElem = document.createElement("p");
        captionElem.setAttribute("data-caption", "true");
        captionElem.style.fontSize = "10pt";
        captionElem.style.fontStyle = "italic";
        captionElem.style.color = "#475569";
        captionElem.style.marginTop = "4pt";
        captionElem.style.textAlign = "center";
        captionElem.textContent = nextCaption.trim();
        selectedImage.insertAdjacentElement("afterend", captionElem);
      }
      onContentChange();
      updateRect();
    }
  };

  // ── 4. Interactive 8-Handle Resizing ──
  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(handle);

    const zoomFactor = (zoom || 100) / 100;
    const imgWidth =
      selectedImage.offsetWidth ||
      selectedImage.clientWidth ||
      rect.width / zoomFactor;
    const imgHeight =
      selectedImage.offsetHeight ||
      selectedImage.clientHeight ||
      rect.height / zoomFactor;
    const aspectRatio =
      selectedImage.naturalWidth && selectedImage.naturalHeight
        ? selectedImage.naturalWidth / selectedImage.naturalHeight
        : imgWidth / (imgHeight || 1);

    startPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: imgWidth,
      startHeight: imgHeight,
      aspectRatio,
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = (moveEvent.clientX - startPos.current.startX) / zoomFactor;
      const deltaY = (moveEvent.clientY - startPos.current.startY) / zoomFactor;
      const { startWidth, startHeight, aspectRatio } = startPos.current;

      let newWidth = startWidth;

      // Handle all 8 directions with natural multi-axis scaling
      if (handle === "e") {
        newWidth = startWidth + deltaX;
      } else if (handle === "w") {
        newWidth = startWidth - deltaX;
      } else if (handle === "s") {
        newWidth = (startHeight + deltaY) * aspectRatio;
      } else if (handle === "n") {
        newWidth = (startHeight - deltaY) * aspectRatio;
      } else if (handle === "se") {
        const effDelta =
          Math.abs(deltaX) >= Math.abs(deltaY * aspectRatio)
            ? deltaX
            : deltaY * aspectRatio;
        newWidth = startWidth + effDelta;
      } else if (handle === "sw") {
        const effDelta =
          Math.abs(-deltaX) >= Math.abs(deltaY * aspectRatio)
            ? -deltaX
            : deltaY * aspectRatio;
        newWidth = startWidth + effDelta;
      } else if (handle === "ne") {
        const effDelta =
          Math.abs(deltaX) >= Math.abs(-deltaY * aspectRatio)
            ? deltaX
            : -deltaY * aspectRatio;
        newWidth = startWidth + effDelta;
      } else if (handle === "nw") {
        const effDelta =
          Math.abs(-deltaX) >= Math.abs(-deltaY * aspectRatio)
            ? -deltaX
            : -deltaY * aspectRatio;
        newWidth = startWidth + effDelta;
      }

      // Constrain width: min 70px, max 850px (simulated A4 paper page width)
      newWidth = Math.max(70, Math.min(850, Math.round(newWidth)));

      selectedImage.style.width = `${newWidth}px`;
      selectedImage.style.height = "auto";
      selectedImage.style.maxWidth = "100%";

      setCurrentWidthPx(newWidth);
      updateRect();
    };

    const onMouseUp = () => {
      setIsResizing(false);
      setActiveHandle(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      updateRect();
      onContentChange();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // 8 Resize Handles with generous 24px invisible hit-targets for easy grabbing
  const handles = [
    { id: "nw", pos: "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" },
    { id: "n", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize" },
    { id: "ne", pos: "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" },
    { id: "e", pos: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize" },
    { id: "se", pos: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" },
    { id: "s", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize" },
    { id: "sw", pos: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" },
    { id: "w", pos: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize" },
  ];

  return (
    <>
      {/* ── Active Drop Location Caret Indicator Line ── */}
      {isMoving && dropIndicator && (
        <div
          style={{
            position: "fixed",
            top: `${dropIndicator.top}px`,
            left: `${dropIndicator.left}px`,
            width: `${Math.max(60, dropIndicator.width)}px`,
            height: "3px",
            zIndex: 60,
          }}
          className="bg-blue-600 rounded-full shadow-lg shadow-blue-500/50 animate-pulse pointer-events-none"
        />
      )}

      {/* ── Resizer Bounding Box Overlay ── */}
      <div
        data-manuscript-resizer="true"
        style={{
          position: "fixed",
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          pointerEvents: "none",
          zIndex: 50,
        }}
        className="border-2 border-blue-600 select-none"
      >
        {/* Central Drag-to-Move Top Handle */}
        <div
          onMouseDown={handleMoveMouseDown}
          style={{ pointerEvents: "auto" }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-t-xs text-[10.5px] font-bold flex items-center gap-1.5 cursor-grab active:cursor-grabbing shadow-md select-none transition-colors"
          title="Click and drag to move image to another position in manuscript"
        >
          <Move className="h-3 w-3" />
          <span>Drag to Move</span>
        </div>

        {/* 8 Resize Handles with 24px expanded hit-area */}
        {handles.map((h) => (
          <div
            key={h.id}
            onMouseDown={(e) => handleResizeMouseDown(e, h.id)}
            style={{ pointerEvents: "auto" }}
            className={`absolute h-3 w-3 rounded-full bg-white border-2 border-blue-600 shadow-sm hover:scale-125 transition-transform ${h.pos} before:absolute before:-inset-2 before:content-['']`}
            title={`Drag ${h.id.toUpperCase()} handle to resize`}
          />
        ))}

        {/* ── MS Word-style Floating Contextual Toolbar ── */}
        <div
          style={{
            position: "absolute",
            top: "-42px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "auto",
          }}
          className="flex items-center gap-1 bg-[#060e22] text-white px-2 py-1 rounded-xs shadow-2xl border border-slate-700 text-xs shrink-0 whitespace-nowrap z-50 select-none animate-in zoom-in-95 duration-100"
        >
          {/* Current Dimension Badge */}
          <span className="text-[10px] text-amber-300 font-mono font-bold px-1 border-r border-slate-700">
            {currentWidthPx > 0 ? `${currentWidthPx}px` : `${Math.round(rect.width)}px`}
          </span>

          {/* Move Up / Down Buttons */}
          <div className="flex items-center border-r border-slate-700 pr-1">
            <button
              type="button"
              onClick={moveUp}
              title="Move Image Up past previous paragraph (Alt+Up)"
              className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={moveDown}
              title="Move Image Down past next paragraph (Alt+Down)"
              className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Text Wrap Modes */}
          <button
            type="button"
            onClick={() => applyWrapMode("center")}
            title="Center Figure (Break Text)"
            className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyWrapMode("wrap-left")}
            title="Wrap Text Left (Float Left)"
            className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyWrapMode("wrap-right")}
            title="Wrap Text Right (Float Right)"
            className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyWrapMode("inline")}
            title="Inline with Text"
            className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>

          <div className="h-3 w-px bg-slate-700 mx-0.5" />

          {/* Quick Preset Widths */}
          <div className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-300">
            <button
              type="button"
              onClick={() => applyPresetWidth(25)}
              className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              title="Scale to 25% width"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => applyPresetWidth(50)}
              className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              title="Scale to 50% width"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => applyPresetWidth(75)}
              className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              title="Scale to 75% width"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => applyPresetWidth(100)}
              className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              title="Scale to 100% full width"
            >
              100%
            </button>
          </div>

          <div className="h-3 w-px bg-slate-700 mx-0.5" />

          {/* Edit Caption */}
          <button
            type="button"
            onClick={editCaption}
            title="Edit Figure Caption"
            className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
          >
            <Type className="h-3 w-3 text-amber-400" />
            <span>Caption</span>
          </button>

          {/* Reset Size */}
          <button
            type="button"
            onClick={resetOriginalSize}
            title="Reset to Original Dimensions"
            className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={deleteImage}
            title="Delete Image (Del)"
            className="p-1 rounded-xs hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* Deselect */}
          <button
            type="button"
            onClick={onDeselect}
            title="Deselect (Esc)"
            className="p-1 rounded-xs hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </>
  );
}
