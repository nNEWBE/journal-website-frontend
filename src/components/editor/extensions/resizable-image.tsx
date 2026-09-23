"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const { src, alt, caption, width, wrap } = node.attrs;

  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [liveWidth, setLiveWidth] = useState<number>(width || 420);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const startPos = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    aspectRatio: number;
  }>({
    startX: 0,
    startY: 0,
    startWidth: 420,
    startHeight: 280,
    aspectRatio: 1.5,
  });

  useEffect(() => {
    if (width) setLiveWidth(width);
  }, [width]);

  // Handle 8-direction resizing
  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(handle);

    const img = imgRef.current;
    const currentW = img?.offsetWidth || liveWidth || 420;
    const currentH = img?.offsetHeight || 280;
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
      newWidth = Math.max(80, Math.min(850, Math.round(newWidth)));
      setLiveWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      setActiveHandle(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      updateAttributes({ width: liveWidth });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Wrap / Float modes
  const handleSetWrap = (mode: string) => {
    updateAttributes({ wrap: mode });
  };

  // Preset widths (25%, 50%, 75%, 100%)
  const handlePresetWidth = (pct: number) => {
    const pageContentWidth = 720;
    const w = Math.round((pageContentWidth * pct) / 100);
    setLiveWidth(w);
    updateAttributes({ width: w });
    toast.success(`Image scaled to ${pct}% width`);
  };

  // Edit Caption
  const handleEditCaption = () => {
    const current = caption || alt || "Figure: Academic illustration";
    const next = window.prompt("Enter academic figure caption:", current);
    if (next !== null) {
      updateAttributes({ caption: next.trim(), alt: next.trim() });
    }
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

  // Move image up one block in document
  const handleMoveUp = () => {
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
  };

  // Move image down one block in document
  const handleMoveDown = () => {
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
      as="figure"
      style={wrapperStyle}
      className={`relative inline-block select-none my-3 group ${
        selected ? "outline-none" : ""
      }`}
    >
      <div
        data-drag-handle
        draggable={true}
        style={{ width: `${liveWidth}px`, maxWidth: "100%" }}
        className={`relative inline-block leading-none ${
          selected ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
        title={selected ? "Drag image to move anywhere in manuscript" : "Click to select image"}
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
            style={{ width: "100%", height: "auto", display: "block" }}
            className={`block rounded-xs border transition-colors duration-100 ${
              selected
                ? "border-blue-600 ring-2 ring-blue-500/30"
                : "border-slate-300 hover:border-slate-400"
            }`}
          />
        )}

        {/* Caption */}
        {caption && (
          <figcaption className="text-center text-[10.5pt] italic text-slate-600 mt-2 font-serif leading-normal select-text">
            {caption}
          </figcaption>
        )}

        {/* Selected State: 8 Resize Handles + Floating Toolbar */}
        {selected && (
          <>
            {/* 8 Resize Handles with 24px expanded hit-area */}
            {handles.map((h) => (
              <div
                key={h.id}
                onMouseDown={(e) => handleResizeMouseDown(e, h.id)}
                className={`absolute h-3 w-3 rounded-full bg-white border-2 border-blue-600 shadow-sm hover:scale-125 transition-transform z-30 ${h.pos} before:absolute before:-inset-2 before:content-['']`}
                title={`Drag ${h.id.toUpperCase()} handle to resize`}
              />
            ))}

            {/* ── MS Word-style Floating Contextual Toolbar ── */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#060e22] text-white px-2 py-1 rounded-xs shadow-2xl border border-slate-700 text-xs shrink-0 whitespace-nowrap z-40 select-none animate-in zoom-in-95 duration-100">
              {/* Dimensions Badge */}
              <span className="text-[10px] text-amber-300 font-mono font-bold px-1 border-r border-slate-700">
                {liveWidth}px
              </span>

              {/* Text Wrap Modes */}
              <button
                type="button"
                onClick={() => handleSetWrap("center")}
                title="Center (Break Text)"
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
                title="Wrap Text Left (Float Left)"
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
                title="Wrap Text Right (Float Right)"
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
                title="Inline with Text"
                className={`p-1 rounded-xs transition-colors cursor-pointer ${
                  wrap === "inline"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/15 text-slate-300"
                }`}
              >
                <WrapText className="h-3.5 w-3.5" />
              </button>

              <div className="h-3 w-px bg-slate-700 mx-0.5" />

              {/* Move Paragraph Actions */}
              <button
                type="button"
                onClick={handleMoveUp}
                title="Move Image Up (Before Previous Paragraph)"
                className="p-1 rounded-xs hover:bg-white/15 text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={handleMoveDown}
                title="Move Image Down (After Next Paragraph)"
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
                title="Edit Caption"
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
  draggable: true,
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
        default: "center", // 'center' | 'wrap-left' | 'wrap-right' | 'inline'
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
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption, width, wrap } = HTMLAttributes;
    return [
      "figure",
      mergeAttributes({
        "data-resizable-image": "true",
        "data-wrap": wrap || "center",
        style: `width: ${width || 480}px; max-width: 100%; margin: 18pt auto; text-align: center;`,
      }),
      ["img", { src, alt, style: "width: 100%; height: auto; border: 0.5pt solid #cbd5e1;" }],
      caption ? ["figcaption", { style: "font-size: 10pt; font-style: italic; color: #475569; margin-top: 4pt;" }, caption] : "",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponentInner);
  },
});
