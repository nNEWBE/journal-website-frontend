"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
  Move,
  RotateCcw,
  Trash2,
  Type,
  WrapText,
} from "lucide-react";
import { toast } from "sonner";
import { optimizeImageFile } from "@/lib/manuscript-image-optimizer";

// Component rendered inside TipTap for every ResizableImage node
function ResizableImageComponentInner(props: NodeViewProps) {
  const { node, updateAttributes, selected, deleteNode, editor } = props;
  const { src, alt, caption, width, wrap, offsetX, offsetY } = node.attrs;

  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [liveWidth, setLiveWidth] = useState<number>(width || 480);
  const [imgError, setImgError] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption || "");

  const imgRef = useRef<HTMLImageElement | null>(null);
  const figureRef = useRef<HTMLElement | null>(null);
  const captionInputRef = useRef<HTMLInputElement | null>(null);

  const startPos = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    aspectRatio: number;
  }>({
    startX: 0,
    startY: 0,
    startWidth: 480,
    startHeight: 320,
    aspectRatio: 1.5,
  });

  useEffect(() => {
    if (width) setLiveWidth(width);
  }, [width]);

  useEffect(() => {
    setCaptionValue(caption || "");
  }, [caption]);

  // Handle 8-direction resizing
  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(handle);

    const img = imgRef.current;
    const currentW = img?.offsetWidth || liveWidth || 480;
    const currentH = img?.offsetHeight || 320;
    const naturalRatio =
      img?.naturalWidth && img?.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : currentW / (currentH || 1);

    startPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: currentW,
      startHeight: currentH,
      aspectRatio: naturalRatio,
    };

    let latestWidth = currentW;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startPos.current.startX;
      const deltaY = moveEvent.clientY - startPos.current.startY;
      const { startWidth, startHeight, aspectRatio } = startPos.current;

      let newWidth = startWidth;

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

      // Constrain width
      newWidth = Math.max(100, Math.min(850, Math.round(newWidth)));
      latestWidth = newWidth;
      setLiveWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      setActiveHandle(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      updateAttributes({ width: latestWidth });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Move image up one block in document
  const handleMoveUp = useCallback(() => {
    if (typeof props.getPos !== "function" || !editor) return;
    try {
      const pos = props.getPos();
      if (typeof pos !== "number") return;
      const state = editor.state;
      const $pos = state.doc.resolve(pos);
      const index = $pos.index();
      if (index === 0) {
        toast.info("Image is already at the top of this section.");
        return;
      }
      const parent = $pos.parent;
      const prevNode = parent.child(index - 1);
      const prevNodePos = pos - prevNode.nodeSize;

      const tr = state.tr;
      tr.delete(pos, pos + node.nodeSize);
      tr.insert(prevNodePos, node);
      editor.view.dispatch(tr);
      toast.success("Moved image up");
    } catch (err) {
      console.error("Move up failed:", err);
    }
  }, [editor, node, props]);

  // Move image down one block in document
  const handleMoveDown = useCallback(() => {
    if (typeof props.getPos !== "function" || !editor) return;
    try {
      const pos = props.getPos();
      if (typeof pos !== "number") return;
      const state = editor.state;
      const $pos = state.doc.resolve(pos);
      const index = $pos.index();
      const parent = $pos.parent;
      if (index >= parent.childCount - 1) {
        toast.info("Image is already at the bottom of this section.");
        return;
      }
      const nextNode = parent.child(index + 1);
      const nextNodeEnd = pos + node.nodeSize + nextNode.nodeSize;

      const tr = state.tr;
      tr.delete(pos, pos + node.nodeSize);
      tr.insert(nextNodeEnd - node.nodeSize, node);
      editor.view.dispatch(tr);
      toast.success("Moved image down");
    } catch (err) {
      console.error("Move down failed:", err);
    }
  }, [editor, node, props]);

  // Keyboard navigation & movement when image is selected
  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is currently typing in the caption input, do not intercept
      if (document.activeElement === captionInputRef.current) return;

      // Alt + ArrowUp: Move block up
      if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        handleMoveUp();
      }
      // Alt + ArrowDown: Move block down
      else if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        handleMoveDown();
      }
      // Free Floating Mode: Arrow keys nudge position
      else if (wrap === "floating") {
        const step = e.shiftKey ? 20 : 5;
        if (e.key === "ArrowUp") {
          e.preventDefault();
          updateAttributes({ offsetY: (offsetY || 0) - step });
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          updateAttributes({ offsetY: (offsetY || 0) + step });
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          updateAttributes({ offsetX: (offsetX || 0) - step });
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          updateAttributes({ offsetX: (offsetX || 0) + step });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, wrap, offsetX, offsetY, handleMoveUp, handleMoveDown, updateAttributes]);

  // MS Word-style Drag & Drop movement
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary mouse button
    if (!editor) return;

    // Do not initiate drag if user clicked on caption or handles
    const target = e.target as HTMLElement;
    if (target.closest("figcaption") || target.closest(".resize-handle") || target.closest("input")) {
      return;
    }

    e.preventDefault(); // Suppress browser native ghost & dragover
    const startX = e.clientX;
    const startY = e.clientY;
    let hasMoved = false;

    const isFloatingMode = wrap === "floating";
    const startOffsetX = offsetX || 0;
    const startOffsetY = offsetY || 0;
    let liveOffsetX = startOffsetX;
    let liveOffsetY = startOffsetY;

    let targetBlock: HTMLElement | null = null;
    let targetIsTop = false;

    // Authentic MS Word vertical insertion caret (I-beam insertion point)
    let wordCaret: HTMLElement | null = null;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);

      if (!hasMoved) {
        if (dist > 4) {
          hasMoved = true;
          if (typeof window !== "undefined") {
            (window as any).__isInternalDragging = true;
          }
          document.body.style.userSelect = "none";
          document.body.style.cursor = "move";

          // MS Word visual feedback: image becomes translucent in-place while in transit
          if (figureRef.current) {
            figureRef.current.style.opacity = "0.45";
            figureRef.current.style.filter = "grayscale(20%)";
          }

          if (!isFloatingMode) {
            // Create MS Word-style vertical insertion caret
            wordCaret = document.createElement("div");
            wordCaret.id = "manuscript-word-caret";
            wordCaret.style.cssText = `
              position: fixed;
              width: 2px;
              height: 24px;
              background: #0f172a;
              z-index: 999998;
              pointer-events: none;
              box-shadow: 0 0 2px rgba(15, 23, 42, 0.4);
              display: none;
            `;
            const serifTop = document.createElement("div");
            serifTop.style.cssText = `position: absolute; left: -2.5px; top: 0; width: 7px; height: 2px; background: #0f172a; border-radius: 1px;`;
            const serifBottom = document.createElement("div");
            serifBottom.style.cssText = `position: absolute; left: -2.5px; bottom: 0; width: 7px; height: 2px; background: #0f172a; border-radius: 1px;`;
            wordCaret.appendChild(serifTop);
            wordCaret.appendChild(serifBottom);
            document.body.appendChild(wordCaret);
          }
        } else {
          return;
        }
      }

      if (isFloatingMode) {
        // Free 2D movement
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        liveOffsetX = Math.round(startOffsetX + dx);
        liveOffsetY = Math.round(startOffsetY + dy);
        if (figureRef.current) {
          figureRef.current.style.transform = `translate(${liveOffsetX}px, ${liveOffsetY}px)`;
        }
      } else {
        // Find block element under mouse
        const el = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
        const currentWrapper = figureRef.current;
        const block = el?.closest(
          ".tiptap > p, .tiptap > h1, .tiptap > h2, .tiptap > h3, .tiptap > h4, .tiptap > blockquote, .tiptap > figure, .tiptap > table, .tiptap > hr, .tiptap > div[data-type='page-break']"
        ) as HTMLElement | null;

        if (block && block !== currentWrapper && !currentWrapper?.contains(block)) {
          const rect = block.getBoundingClientRect();
          const isTop = moveEvent.clientY < rect.top + rect.height / 2;
          targetBlock = block;
          targetIsTop = isTop;

          if (wordCaret) {
            const caretH = Math.min(26, Math.max(18, rect.height));
            wordCaret.style.display = "block";
            wordCaret.style.height = `${caretH}px`;
            wordCaret.style.left = `${rect.left}px`;
            wordCaret.style.top = isTop ? `${rect.top}px` : `${rect.bottom - caretH}px`;
          }
        } else {
          targetBlock = null;
          if (wordCaret) wordCaret.style.display = "none";
        }
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      if (typeof window !== "undefined") {
        (window as any).__isInternalDragging = false;
      }

      if (figureRef.current) {
        figureRef.current.style.opacity = "";
        figureRef.current.style.filter = "";
      }

      if (wordCaret) {
        wordCaret.remove();
        wordCaret = null;
      }

      if (!hasMoved) {
        // Standard click: select node in ProseMirror so handles/toolbar show
        if (typeof props.getPos === "function") {
          const pos = props.getPos();
          if (typeof pos === "number") {
            editor.commands.setNodeSelection(pos);
          }
        }
        return;
      }

      if (isFloatingMode) {
        updateAttributes({ offsetX: liveOffsetX, offsetY: liveOffsetY });
      } else if (targetBlock) {
        try {
          const currentPos = props.getPos();
          if (typeof currentPos !== "number") return;

          let targetPos = editor.view.posAtDOM(targetBlock, 0);
          if (!targetIsTop) {
            const $p = editor.state.doc.resolve(targetPos);
            targetPos = $p.after($p.depth);
          }

          if (targetPos !== currentPos && targetPos !== currentPos + node.nodeSize) {
            const tr = editor.state.tr;
            if (targetPos < currentPos) {
              tr.delete(currentPos, currentPos + node.nodeSize);
              tr.insert(targetPos, node);
            } else if (targetPos > currentPos) {
              const shiftedTargetPos = Math.max(0, targetPos - node.nodeSize);
              tr.delete(currentPos, currentPos + node.nodeSize);
              tr.insert(shiftedTargetPos, node);
            }
            editor.view.dispatch(tr);
          }
        } catch (err) {
          console.error("Failed to move image:", err);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Wrap / Float modes
  const handleSetWrap = (mode: string) => {
    updateAttributes({ wrap: mode });
    if (mode === "floating") {
      toast.info("Free Floating mode active. Drag image anywhere on paper.");
    } else {
      updateAttributes({ offsetX: 0, offsetY: 0 });
    }
  };

  // Preset widths (25%, 50%, 75%, 100%)
  const handlePresetWidth = (pct: number) => {
    const pageContentWidth = 720;
    const w = Math.round((pageContentWidth * pct) / 100);
    setLiveWidth(w);
    updateAttributes({ width: w });
    toast.success(`Image scaled to ${pct}% width`);
  };

  // Focus caption input directly in document
  const handleEditCaption = () => {
    setIsEditingCaption(true);
    setTimeout(() => {
      captionInputRef.current?.focus();
      captionInputRef.current?.select();
    }, 20);
  };

  // Commit caption change
  const handleCommitCaption = (newVal: string) => {
    const trimmed = newVal.trim();
    updateAttributes({ caption: trimmed, alt: trimmed });
    setIsEditingCaption(false);
    toast.success("Figure caption updated");
  };

  // Reset to natural dimensions
  const handleResetSize = () => {
    if (imgRef.current?.naturalWidth) {
      const w = Math.min(720, imgRef.current.naturalWidth);
      setLiveWidth(w);
      updateAttributes({ width: w });
      toast.info("Reset to natural image size");
    }
  };

  // Determine container styling based on wrap mode
  let wrapperStyle: React.CSSProperties = {
    display: "block",
    margin: "18pt auto",
    clear: "both",
    textAlign: "center",
  };

  if (wrap === "wrap-left") {
    wrapperStyle = {
      float: "left",
      display: "inline-block",
      margin: "6pt 18pt 10pt 0",
      clear: "none",
      maxWidth: "55%",
    };
  } else if (wrap === "wrap-right") {
    wrapperStyle = {
      float: "right",
      display: "inline-block",
      margin: "6pt 0 10pt 18pt",
      clear: "none",
      maxWidth: "55%",
    };
  } else if (wrap === "inline") {
    wrapperStyle = {
      display: "inline-block",
      margin: "4pt 8pt",
      float: "none",
      clear: "none",
      verticalAlign: "middle",
    };
  } else if (wrap === "floating") {
    wrapperStyle = {
      position: "relative",
      display: "inline-block",
      transform: `translate(${offsetX || 0}px, ${offsetY || 0}px)`,
      zIndex: 35,
      margin: "4pt 0",
      clear: "none",
    };
  }

  // 8 handles
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
    <NodeViewWrapper
      ref={figureRef}
      as="figure"
      style={wrapperStyle}
      className={`relative inline-block select-none my-3 group ${
        selected ? "outline-none" : ""
      }`}
    >
      <div
        style={{ width: `${liveWidth}px`, maxWidth: "100%" }}
        className="relative inline-block leading-none"
      >
        {/* Main Image or Fallback */}
        {imgError || !src ? (
          <div className="w-full py-8 px-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded text-center text-slate-500">
            <ImageIcon className="h-8 w-8 mx-auto text-slate-400 mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">Image unavailable or link expired</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click below to upload a replacement</p>
            <label className="inline-block mt-2.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded cursor-pointer transition-colors shadow-xs">
              Replace Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.info("Replacing image...");
                    const newSrc = await optimizeImageFile(file);
                    if (newSrc) {
                      updateAttributes({ src: newSrc });
                      setImgError(false);
                      toast.success("Image updated");
                    }
                  }
                }}
              />
            </label>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={alt || caption || "Figure"}
            draggable={false}
            loading="eager"
            decoding="async"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
            onMouseDown={handleDragStart}
            style={{ width: "100%", height: "auto", display: "block" }}
            className={`block rounded-xs border transition-colors duration-100 ${
              selected
                ? "border-blue-600 ring-2 ring-blue-500/30 cursor-grab active:cursor-grabbing"
                : "border-slate-300 hover:border-slate-400 cursor-pointer"
            }`}
            title={selected ? "Click and drag to move image (like MS Word)" : "Click to select figure"}
          />
        )}

        {/* ── Academic Figure Caption (Directly Editable In-Place) ── */}
        <figcaption
          className="mt-2.5 text-center select-text w-full"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingCaption(true);
            setTimeout(() => captionInputRef.current?.focus(), 20);
          }}
        >
          {isEditingCaption || selected ? (
            <div className="relative inline-flex items-center justify-center w-full max-w-md px-1">
              <input
                ref={captionInputRef}
                type="text"
                value={captionValue}
                placeholder="Figure 1: Describe your figure or illustration..."
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCommitCaption(captionValue);
                  } else if (e.key === "Escape") {
                    setCaptionValue(caption || "");
                    setIsEditingCaption(false);
                  }
                }}
                onChange={(e) => {
                  setCaptionValue(e.target.value);
                  updateAttributes({ caption: e.target.value, alt: e.target.value });
                }}
                onBlur={() => {
                  handleCommitCaption(captionValue);
                }}
                className="w-full text-center text-[11pt] italic text-slate-800 font-serif border-b-2 border-blue-500 focus:border-blue-600 focus:outline-hidden bg-white/70 hover:bg-white rounded-xs px-2 py-1 shadow-xs placeholder:text-slate-400 placeholder:italic transition-all"
                title="Type to edit figure name / caption"
              />
            </div>
          ) : (
            <div
              className="inline-block text-[10.5pt] italic text-slate-600 font-serif hover:text-blue-600 hover:bg-blue-50/60 px-2 py-0.5 rounded-xs border border-transparent hover:border-blue-200 cursor-text transition-colors"
              title="Click directly to edit figure name / caption"
            >
              {caption ? (
                caption
              ) : (
                <span className="text-slate-400 not-italic text-xs font-sans">
                  Click to add figure caption...
                </span>
              )}
            </div>
          )}
        </figcaption>

        {/* Selected State: 8 Resize Handles + Floating MS Word Toolbar */}
        {selected && (
          <>

            {/* 8 Resize Handles with 24px expanded hit-area */}
            {handles.map((h) => (
              <div
                key={h.id}
                onMouseDown={(e) => handleResizeMouseDown(e, h.id)}
                className={`resize-handle absolute h-3 w-3 rounded-full bg-white border-2 border-blue-600 shadow-sm hover:scale-125 transition-transform z-30 ${h.pos} before:absolute before:-inset-2 before:content-['']`}
                title={`Drag ${h.id.toUpperCase()} handle to resize`}
              />
            ))}

            {/* ── MS Word-style Floating Contextual Toolbar ── */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="image-toolbar absolute -top-13 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#060e22] text-white px-2 py-1 rounded-xs shadow-2xl border border-slate-700 text-xs shrink-0 whitespace-nowrap z-50 select-none animate-in zoom-in-95 duration-100"
            >
              {/* Drag Handle Button */}
              <button
                type="button"
                onMouseDown={handleDragStart}
                className="flex items-center gap-1 px-1.5 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xs text-[10px] font-semibold cursor-grab active:cursor-grabbing transition-colors"
                title="Click and drag to move image (like MS Word)"
              >
                <Move className="h-3 w-3" />
                <span>Move</span>
              </button>

              {/* Dimensions Badge */}
              <span className="text-[10px] text-amber-300 font-mono font-bold px-1 border-r border-slate-700">
                {liveWidth}px
              </span>

              {/* Text Wrap Modes (MS Word layout options) */}
              <button
                type="button"
                onClick={() => handleSetWrap("center")}
                title="Top & Bottom / Break Text (Inline Block)"
                className={`p-1 rounded-xs transition-colors cursor-pointer ${
                  wrap === "center" || !wrap
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/15 text-slate-300"
                }`}
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSetWrap("wrap-left")}
                title="Square Left (Float Left, text wraps on right)"
                className={`p-1 rounded-xs transition-colors cursor-pointer ${
                  wrap === "wrap-left"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/15 text-slate-300"
                }`}
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSetWrap("wrap-right")}
                title="Square Right (Float Right, text wraps on left)"
                className={`p-1 rounded-xs transition-colors cursor-pointer ${
                  wrap === "wrap-right"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/15 text-slate-300"
                }`}
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSetWrap("inline")}
                title="In Line with Text"
                className={`p-1 rounded-xs transition-colors cursor-pointer ${
                  wrap === "inline"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/15 text-slate-300"
                }`}
              >
                <WrapText className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSetWrap("floating")}
                title="In Front of Text (Free Float / Drag anywhere on page)"
                className={`p-1 rounded-xs transition-colors cursor-pointer ${
                  wrap === "floating"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "hover:bg-white/15 text-slate-300"
                }`}
              >
                <Move className="h-3.5 w-3.5 text-purple-300" />
              </button>

              <div className="h-3 w-px bg-slate-700 mx-0.5" />

              {/* Move Up / Down Actions */}
              <button
                type="button"
                onClick={handleMoveUp}
                title="Move Up before previous paragraph (Alt+↑)"
                className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={handleMoveDown}
                title="Move Down after next paragraph (Alt+↓)"
                className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>

              <div className="h-3 w-px bg-slate-700 mx-0.5" />

              {/* Quick Width Presets */}
              <div className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-300">
                <button
                  type="button"
                  onClick={() => handlePresetWidth(25)}
                  className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  title="Scale to 25% width"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetWidth(50)}
                  className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  title="Scale to 50% width"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetWidth(75)}
                  className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  title="Scale to 75% width"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetWidth(100)}
                  className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  title="Scale to 100% width"
                >
                  100%
                </button>
              </div>

              <div className="h-3 w-px bg-slate-700 mx-0.5" />

              {/* Edit Caption */}
              <button
                type="button"
                onClick={handleEditCaption}
                title="Edit Academic Caption / Figure Name"
                className="px-1.5 py-0.5 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
              >
                <Type className="h-3 w-3 text-amber-400" />
                <span>Caption</span>
              </button>

              {/* Reset Size */}
              <button
                type="button"
                onClick={handleResetSize}
                title="Reset Size"
                className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => deleteNode()}
                title="Delete Image"
                className="p-1 rounded-xs hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer ml-0.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImageComponent = ResizableImageComponentInner;

// TipTap Custom Extension Definition
export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  draggable: false, // Custom MS Word drag handles movement to avoid duplicate drops
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      caption: {
        default: "",
      },
      width: {
        default: 480,
      },
      wrap: {
        default: "center", // 'center' | 'wrap-left' | 'wrap-right' | 'inline' | 'floating'
      },
      offsetX: {
        default: 0,
      },
      offsetY: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-resizable-image]",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const img = el.querySelector("img");
          const caption = el.querySelector("figcaption")?.textContent || "";
          return {
            src: img?.getAttribute("src"),
            alt: img?.getAttribute("alt"),
            caption,
            width: parseInt(el.style.width, 10) || 480,
            wrap: el.getAttribute("data-wrap") || "center",
            offsetX: parseInt(el.getAttribute("data-offset-x") || "0", 10) || 0,
            offsetY: parseInt(el.getAttribute("data-offset-y") || "0", 10) || 0,
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          const img = element as HTMLImageElement;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            width: parseInt(img.style.width, 10) || img.width || 480,
            wrap: "center",
            offsetX: 0,
            offsetY: 0,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption, width, wrap, offsetX, offsetY } = HTMLAttributes;
    let extraStyle = `margin: 18pt auto; text-align: center;`;
    if (wrap === "wrap-left") {
      extraStyle = `float: left; margin: 6pt 18pt 10pt 0; max-width: 55%;`;
    } else if (wrap === "wrap-right") {
      extraStyle = `float: right; margin: 6pt 0 10pt 18pt; max-width: 55%;`;
    } else if (wrap === "inline") {
      extraStyle = `display: inline-block; margin: 4pt 8pt; vertical-align: middle;`;
    } else if (wrap === "floating") {
      extraStyle = `position: relative; transform: translate(${offsetX || 0}px, ${offsetY || 0}px); z-index: 20;`;
    }

    return [
      "figure",
      mergeAttributes({
        "data-resizable-image": "true",
        "data-wrap": wrap || "center",
        "data-offset-x": String(offsetX || 0),
        "data-offset-y": String(offsetY || 0),
        style: `width: ${width || 480}px; max-width: 100%; ${extraStyle}`,
      }),
      ["img", { src, alt, style: "width: 100%; height: auto; border: 0.5pt solid #cbd5e1;" }],
      caption ? ["figcaption", { style: "font-size: 10pt; font-style: italic; color: #475569; margin-top: 4pt;" }, caption] : "",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponentInner);
  },
});
