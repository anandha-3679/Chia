// Chart palette (hex) — SVG fills don't reliably resolve CSS variables,
// so these mirror the --chart-* tokens in globals.css.
export const BRAND = "#5b8c51"; // sprout green
export const COCOA = "#7a4a28"; // cocoa brown
export const BORDER = "#e5d8c5"; // tan
export const MUTED_TEXT = "#8c7b68";

export const CHART_COLORS = [
  "#5b8c51", // green
  "#7a4a28", // cocoa
  "#c89b5a", // tan/gold
  "#8fb97f", // light green
  "#a9714a", // light cocoa
  "#cbb892", // sand
];

export const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: `1px solid ${BORDER}`,
  fontSize: 13,
} as const;
