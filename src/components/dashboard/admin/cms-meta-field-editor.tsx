"use client";

import React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { CMS_ICON_NAMES } from "@/lib/cms/icons";
import { cn } from "@/lib/utils";

/**
 * Structured editor for one CMS meta value. Handles the shapes page defaults use:
 * strings, numbers, booleans, string lists, flat objects and lists of flat objects
 * (whose fields may themselves be string lists). Values keep their type on edit.
 */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const smallInputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500";
const iconButtonClass =
  "p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-25 transition-colors cursor-pointer";

export function humanizeMetaKey(key: string): string {
  const spaced = key
    .replace(/[-_]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isImageKey(key: string) {
  return /(^image$|image$|src$|^logo|photo|avatar|cover)/i.test(key);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Blank value with the same shape, used when adding a list item. */
function blankLike(sample: unknown): unknown {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (isPlainObject(sample)) {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]));
  }
  return "";
}

function move<T>(list: T[], idx: number, dir: -1 | 1): T[] {
  const target = idx + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

function ScalarInput({
  fieldKey,
  value,
  onChange,
  compact,
}: {
  fieldKey: string;
  value: unknown;
  onChange: (v: unknown) => void;
  compact?: boolean;
}) {
  const cls = compact ? smallInputClass : inputClass;
  // Decided once so the field doesn't swap input/textarea (and lose focus) while typing.
  const [multiline] = React.useState(
    () => typeof value === "string" && (value.length > 90 || value.includes("\n"))
  );

  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-3.5 w-3.5 accent-blue-600"
        />
        <span>{value ? "Enabled" : "Disabled"}</span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        onWheel={(e) => e.currentTarget.blur()}
        className={cls}
      />
    );
  }

  const text = value === null || value === undefined ? "" : String(value);

  if (fieldKey === "icon") {
    return (
      <select value={text} onChange={(e) => onChange(e.target.value)} className={cls}>
        {!CMS_ICON_NAMES.includes(text) && <option value={text}>{text || "Default icon"}</option>}
        {CMS_ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    );
  }

  if (isImageKey(fieldKey)) {
    return (
      <div className="flex items-center gap-2">
        {text && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={text} alt="" className="h-9 w-12 shrink-0 rounded-md border border-slate-200 object-cover bg-slate-100" />
        )}
        <input
          type="text"
          value={text}
          placeholder="/images/... or https://..."
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      </div>
    );
  }

  if (multiline) {
    return (
      <textarea
        rows={Math.min(6, Math.max(2, Math.ceil(text.length / 90)))}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className={cn(cls, "resize-y leading-relaxed")}
      />
    );
  }

  return <input type="text" value={text} onChange={(e) => onChange(e.target.value)} className={cls} />;
}

function StringList({
  values,
  onChange,
  fieldKey,
}: {
  values: unknown[];
  onChange: (v: unknown[]) => void;
  fieldKey: string;
}) {
  return (
    <div className="space-y-1.5">
      {values.map((item, idx) => (
        <div key={idx} className="flex items-start gap-1.5">
          <span className="mt-2 w-5 shrink-0 text-right text-[10px] font-bold font-mono text-slate-400">{idx + 1}</span>
          <div className="flex-1 min-w-0">
            <ScalarInput
              fieldKey={fieldKey}
              value={item}
              compact
              onChange={(v) => onChange(values.map((x, i) => (i === idx ? v : x)))}
            />
          </div>
          <div className="flex items-center shrink-0 pt-0.5">
            <button type="button" className={iconButtonClass} disabled={idx === 0} onClick={() => onChange(move(values, idx, -1))} aria-label="Move up">
              <ArrowUp className="h-3 w-3" />
            </button>
            <button type="button" className={iconButtonClass} disabled={idx === values.length - 1} onClick={() => onChange(move(values, idx, 1))} aria-label="Move down">
              <ArrowDown className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              onClick={() => onChange(values.filter((_, i) => i !== idx))}
              aria-label="Remove item"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, blankLike(values[0] ?? "")])}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        <span>Add item</span>
      </button>
    </div>
  );
}

function ObjectFields({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {Object.entries(value).map(([k, v]) => {
        const wide = Array.isArray(v) || (typeof v === "string" && (v.length > 60 || v.includes("\n")));
        return (
          <div key={k} className={cn(wide && "sm:col-span-2")}>
            <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">{humanizeMetaKey(k)}</label>
            {Array.isArray(v) ? (
              <StringList fieldKey={k} values={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />
            ) : isPlainObject(v) ? (
              <input
                type="text"
                value={JSON.stringify(v)}
                onChange={(e) => {
                  try {
                    onChange({ ...value, [k]: JSON.parse(e.target.value) });
                  } catch {
                    /* keep last valid value */
                  }
                }}
                className={smallInputClass}
              />
            ) : (
              <ScalarInput fieldKey={k} value={v} compact onChange={(nv) => onChange({ ...value, [k]: nv })} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CmsMetaFieldEditor({
  fieldKey,
  value,
  onChange,
  onRemove,
}: {
  fieldKey: string;
  value: unknown;
  onChange: (v: unknown) => void;
  onRemove?: () => void;
}) {
  const isObjectList = Array.isArray(value) && value.some(isPlainObject);
  const header = (
    <div className="flex items-center justify-between gap-2 mb-1">
      <label className="block text-[11px] font-bold text-slate-700">
        {humanizeMetaKey(fieldKey)}
        {Array.isArray(value) && <span className="ml-1 font-medium text-slate-400">({value.length})</span>}
      </label>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Delete parameter"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  if (isObjectList) {
    const items = value as unknown[];
    return (
      <div>
        {header}
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold font-mono text-slate-400">#{idx + 1}</span>
                <div className="flex items-center">
                  <button type="button" className={iconButtonClass} disabled={idx === 0} onClick={() => onChange(move(items, idx, -1))} aria-label="Move up">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className={iconButtonClass} disabled={idx === items.length - 1} onClick={() => onChange(move(items, idx, 1))} aria-label="Move down">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    onClick={() => onChange(items.filter((_, i) => i !== idx))}
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {isPlainObject(item) ? (
                <ObjectFields value={item} onChange={(nv) => onChange(items.map((x, i) => (i === idx ? nv : x)))} />
              ) : (
                <ScalarInput fieldKey={fieldKey} value={item} compact onChange={(nv) => onChange(items.map((x, i) => (i === idx ? nv : x)))} />
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, blankLike(items.find(isPlainObject))])}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          <span>Add item</span>
        </button>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div>
        {header}
        <StringList fieldKey={fieldKey} values={value} onChange={onChange} />
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div>
        {header}
        <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <ObjectFields value={value} onChange={onChange} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}
      <ScalarInput fieldKey={fieldKey} value={value} onChange={onChange} />
    </div>
  );
}
