/**
 * FILE: src/components/ui/icons.js
 *
 * Centralised SVG path registry.
 * Every icon used across the dashboard lives here.
 * Pages import only the keys they need.
 *
 * USAGE:
 *   import { ICONS } from "../components/ui/icons";
 *   <Icon d={ICONS.wallet} size={20} />
 *
 * All paths are Lucide-compatible (24×24 viewBox, stroke-based).
 */

export const ICONS = {
  // Navigation
  dashboard:  ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"],
  storefront: ["M3 3h18v4H3z", "M3 7l1 13h14l1-13", "M9 11a3 3 0 006 0"],
  products:   ["M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z", "M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"],
  inventory:  ["M5 8h14", "M5 8a2 2 0 110-4h14a2 2 0 110 4", "M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8", "M9 12h6"],
  orders:     "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  wallet:     ["M21 12V7H5a2 2 0 010-4h14v4", "M3 5v14a2 2 0 002 2h16v-5", "M18 12a2 2 0 000 4h3v-4z"],
  escrow:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  analytics:  "M18 20V10 M12 20V4 M6 20v-6",
  logout:     "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",

  // Actions
  plus:       "M12 5v14 M5 12h14",
  minus:      "M5 12h14",
  edit:       "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:      ["M3 6h18", "M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6", "M10 11v6", "M14 11v6", "M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"],
  close:      "M18 6L6 18 M6 6l12 12",
  check:      "M20 6L9 17l-5-5",
  save:       ["M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
  send:       "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  upload:     ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
  refresh:    ["M23 4v6h-6", "M1 20v-6h6", "M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15"],
  filter:     "M22 3H2l8 9.46V19l4 2v-8.54L22 3",

  // Status / indicators
  shield:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shieldCheck:["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"],
  star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  warning:    ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  info:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8h.01", "M12 12v4"],
  bell:       ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],

  // UI elements
  search:     ["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.35-4.35"],
  menu:       "M3 12h18 M3 6h18 M3 18h18",
  chevronD:   "M6 9l6 6 6-6",
  chevronU:   "M18 15l-6-6-6 6",
  chevronR:   "M9 18l6-6-6-6",
  eye:        ["M1 12s4-8 11-8 11 8 11 8", "M1 12s4 8 11 8 11-8 11-8", "M12 9a3 3 0 100 6 3 3 0 000-6z"],

  // Context-specific
  truck:      ["M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3", "M9 17h6", "M13 17h8l-3-5h-5v5z", "M5.5 20.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", "M18.5 20.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"],
  package:    ["M12 2l9 4.9V17L12 22l-9-4.9V7z", "M12 22V12", "M21 7l-9 5", "M3 7l9 5"],
  bank:       ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"],
  camera:     ["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z", "M12 17a4 4 0 100-8 4 4 0 000 8z"],
  map:        ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z", "M12 10a1 1 0 100-2 1 1 0 000 2"],
  user:       "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  link:       "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  tag:        ["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z", "M7 7h.01"],
  clock:      ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  repeat:     ["M17 1l4 4-4 4", "M3 11V9a4 4 0 014-4h14", "M7 23l-4-4 4-4", "M21 13v2a4 4 0 01-4 4H3"],
  bar:        "M18 20V10 M12 20V4 M6 20v-6",
  pie:        ["M21.21 15.89A10 10 0 118 2.83", "M22 12A10 10 0 0012 2v10z"],
  trendUp:    ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  trendDown:  ["M23 18l-9.5-9.5-5 5L1 6", "M17 18h6v-6"],
  arrowDown:  ["M12 5v14", "M5 12l7 7 7-7"],
  arrowUp:    ["M12 19V5", "M5 12l7-7 7 7"],
  calendar:   ["M3 4h18v18H3z", "M16 2v4", "M8 2v4", "M3 10h18"],
  store:      ["M2 7l10-5 10 5v1H2V7z", "M4 8v11h16V8", "M9 8v11", "M15 8v11"],
};
