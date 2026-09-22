export type PaperFormat = "a4" | "letter" | "legal" | "executive" | "a5" | "a3";
export type PaperOrientation = "portrait" | "landscape";
export type MarginPreset = "normal" | "narrow" | "moderate";
export type ViewMode = "pages" | "continuous";

export interface PaperDimension {
  id: PaperFormat;
  name: string;
  width: number; // in pixels at 96 DPI
  height: number;
  widthInches: number;
  heightInches: number;
  description: string;
}

export const PAPER_DIMENSIONS: Record<PaperFormat, { portrait: PaperDimension; landscape: PaperDimension }> = {
  a4: {
    portrait: {
      id: "a4",
      name: "A4",
      width: 794,
      height: 1123,
      widthInches: 8.27,
      heightInches: 11.69,
      description: "210 × 297 mm (Academic Standard)",
    },
    landscape: {
      id: "a4",
      name: "A4 Landscape",
      width: 1123,
      height: 794,
      widthInches: 11.69,
      heightInches: 8.27,
      description: "297 × 210 mm",
    },
  },
  letter: {
    portrait: {
      id: "letter",
      name: "US Letter",
      width: 816,
      height: 1056,
      widthInches: 8.5,
      heightInches: 11.0,
      description: "8.5 × 11 in (US Standard)",
    },
    landscape: {
      id: "letter",
      name: "US Letter Landscape",
      width: 1056,
      height: 816,
      widthInches: 11.0,
      heightInches: 8.5,
      description: "11 × 8.5 in",
    },
  },
  legal: {
    portrait: {
      id: "legal",
      name: "Legal",
      width: 816,
      height: 1344,
      widthInches: 8.5,
      heightInches: 14.0,
      description: "8.5 × 14 in (Extended)",
    },
    landscape: {
      id: "legal",
      name: "Legal Landscape",
      width: 1344,
      height: 816,
      widthInches: 14.0,
      heightInches: 8.5,
      description: "14 × 8.5 in",
    },
  },
  executive: {
    portrait: {
      id: "executive",
      name: "Executive",
      width: 696,
      height: 1008,
      widthInches: 7.25,
      heightInches: 10.5,
      description: "7.25 × 10.5 in",
    },
    landscape: {
      id: "executive",
      name: "Executive Landscape",
      width: 1008,
      height: 696,
      widthInches: 10.5,
      heightInches: 7.25,
      description: "10.5 × 7.25 in",
    },
  },
  a5: {
    portrait: {
      id: "a5",
      name: "A5",
      width: 559,
      height: 794,
      widthInches: 5.83,
      heightInches: 8.27,
      description: "148 × 210 mm (Booklet)",
    },
    landscape: {
      id: "a5",
      name: "A5 Landscape",
      width: 794,
      height: 559,
      widthInches: 8.27,
      heightInches: 5.83,
      description: "210 × 148 mm",
    },
  },
  a3: {
    portrait: {
      id: "a3",
      name: "A3",
      width: 1123,
      height: 1591,
      widthInches: 11.69,
      heightInches: 16.54,
      description: "297 × 420 mm (Poster / Large)",
    },
    landscape: {
      id: "a3",
      name: "A3 Landscape",
      width: 1591,
      height: 1123,
      widthInches: 16.54,
      heightInches: 11.69,
      description: "420 × 297 mm",
    },
  },
};

export const MARGIN_PRESETS: Record<
  MarginPreset,
  { top: number; bottom: number; left: number; right: number; label: string }
> = {
  normal: {
    top: 72,
    bottom: 72,
    left: 72,
    right: 72,
    label: "Normal (1 inch / 2.54 cm)",
  },
  narrow: {
    top: 40,
    bottom: 40,
    left: 48,
    right: 48,
    label: "Narrow (0.5 inch / 1.27 cm)",
  },
  moderate: {
    top: 56,
    bottom: 56,
    left: 60,
    right: 60,
    label: "Moderate (0.75 inch / 1.9 cm)",
  },
};

export const FORMAT_OPTIONS = [
  { value: "a4", label: "A4 (210 × 297 mm) — Standard Academic" },
  { value: "letter", label: "US Letter (8.5 × 11 in) — Standard US" },
  { value: "legal", label: "Legal (8.5 × 14 in) — Journal Form" },
  { value: "executive", label: "Executive (7.25 × 10.5 in)" },
  { value: "a5", label: "A5 (148 × 210 mm) — Booklet / Monograph" },
  { value: "a3", label: "A3 (297 × 420 mm) — Large Poster" },
];

export const ORIENTATION_OPTIONS = [
  { value: "portrait", label: "Portrait (Vertical Standard)" },
  { value: "landscape", label: "Landscape (Horizontal Wide)" },
];

export const VIEW_MODE_OPTIONS = [
  { value: "pages", label: "Print Layout (Multi-Page Sheets)" },
  { value: "continuous", label: "Web Layout (Continuous Flow)" },
];
