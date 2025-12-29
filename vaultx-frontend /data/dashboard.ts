export type SeriesKey = "views" | "unlocks" | "earnings";

export type PerformancePoint = {
  label: string;
  views: number;
  unlocks: number;
  earnings: number;
};

export type InsightRow = {
  label: string;
  views?: number | string;
  percent?: string;
};

export type InsightContext = {
  title: string;
  metricLabel: string;
  rows: InsightRow[];
};

export const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "ytd", label: "Year to date" },
];

export const basePerformance: PerformancePoint[] = [
  { label: "Mon", views: 0, unlocks: 0, earnings: 0 },
  { label: "Tue", views: 0, unlocks: 0, earnings: 0 },
  { label: "Wed", views: 0, unlocks: 0, earnings: 0 },
  { label: "Thu", views: 0, unlocks: 0, earnings: 0 },
  { label: "Fri", views: 0, unlocks: 0, earnings: 0 },
  { label: "Sat", views: 0, unlocks: 0, earnings: 0 },
  { label: "Sun", views: 0, unlocks: 0, earnings: 0 },
];

export const performanceByRange: Record<string, PerformancePoint[]> = {
  "7d": basePerformance,
  "30d": basePerformance,
  "90d": basePerformance,
  ytd: basePerformance,
};

export const pagesInsights: InsightRow[] = [
  { label: "Unknown", views: 0, percent: "0%" },
];

export const destinationsInsights: InsightRow[] = [
  { label: "Unknown", views: 0, percent: "0%" },
];

export const trafficInsights: InsightRow[] = [
  { label: "Unknown", views: 0, percent: "0%" },
  { label: "Direct", views: 0, percent: "0%" },
  { label: "Search", views: 0, percent: "0%" },
  { label: "Social Media", views: 0, percent: "0%" },
];

export const platformInsights: InsightRow[] = [
  { label: "Desktop", views: 0, percent: "0%" },
  { label: "Mobile", views: 0, percent: "0%" },
  { label: "Tablet", views: 0, percent: "0%" },
  { label: "Chrome", views: 0, percent: "0%" },
  { label: "Safari", views: 0, percent: "0%" },
  { label: "Edge", views: 0, percent: "0%" },
];

export const geographyInsights: InsightRow[] = [
  { label: "United States", views: 4200, percent: "42%" },
  { label: "India", views: 2100, percent: "21%" },
  { label: "Germany", views: 1300, percent: "13%" },
  { label: "Canada", views: 900, percent: "9%" },
  { label: "Brazil", views: 600, percent: "6%" },
];