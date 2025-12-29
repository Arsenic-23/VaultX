"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Maximize2,
  Globe,
  Link2,
  Search,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Compass,
  Globe2,
} from "lucide-react";

import AnalyticsShell from "@/components/AnalyticsShell";
import GeoMap from "@/components/GeoMap";
import OverviewTabs from "@/components/OverviewTabs";
import InsightsSlideOver from "@/components/InsightsSlideOver";
import AnalyticsSection from "@/components/AnalyticsSection";

import { getDuration, prefersReducedMotion } from "@/lib/animations";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

/* -------------------------------------------------------------------------- */
/* DATA IMPORTS */
/* -------------------------------------------------------------------------- */

import {
  timeRanges,
  performanceByRange,
  basePerformance,
  pagesInsights,
  destinationsInsights,
  trafficInsights,
  platformInsights,
  geographyInsights,
  SeriesKey,
  InsightContext,
} from "@/data/dashboard";

/* -------------------------------------------------------------------------- */
/* PAGE */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeSeries] = useState<SeriesKey>("views");

  const [geoOpen, setGeoOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [insightContext, setInsightContext] =
    useState<InsightContext | null>(null);

  const mainRef = useRef<HTMLDivElement | null>(null);

  /* PAGE ENTER ANIMATION */
  useGSAP(
    () => {
      if (!mainRef.current || prefersReducedMotion()) return;
      const ctx = gsap.context(() => {
        gsap.from("[data-dashboard-section]", {
          opacity: 0,
          y: 14,
          duration: getDuration(0.8),
          ease: "power3.out",
          stagger: 0.08,
        });
      }, mainRef);
      return () => ctx.revert();
    },
    { scope: mainRef }
  );

  const performanceData = useMemo(
    () => performanceByRange[timeRange] ?? basePerformance,
    [timeRange]
  );

  return (
    <AnalyticsShell
      title="Dashboard"
      subtitle="Calm overview of how your lockers are performing."
      actionLabel="Create link locker"
      onAction={() => (window.location.href = "/upload")}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      timeRanges={timeRanges}
    >
      <div ref={mainRef} className="space-y-8 lg:space-y-10">
        {/* TOP ROW */}
        <section
          data-dashboard-section
          className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)]"
        >
          <div className="rounded-2xl border border-white/[0.03] bg-[#11141b] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Updates
            </p>
            <h2 className="mt-1.5 text-sm font-semibold text-white">
              Nothing urgent right now
            </h2>
            <p className="mt-1 text-xs text-white/55">
              As lockers start to receive traffic, we’ll surface changes worth
              acting on here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.03] bg-[#11141b] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Performance
            </p>

            <div className="mt-3 h-56 rounded-xl border border-white/[0.03] bg-[#0b0d12] px-3 py-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <RechartsTooltip formatter={(v) => [v, activeSeries]} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#5da0ff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section data-dashboard-section>
          <OverviewTabs />
        </section>

        {/* ANALYTICS CARDS */}
        <section
          data-dashboard-section
          className="grid gap-5 lg:grid-cols-2"
        >
          <AnalyticsSection
            title="Pages"
            rows={[
              {
                icon: <Globe size={14} className="text-white/40" />,
                label: "Unknown",
                percent: "0%",
                accent: "blue",
              },
            ]}
            onView={() => {
              setInsightContext({
                title: "Pages",
                metricLabel: "Views",
                rows: pagesInsights,
              });
              setInsightsOpen(true);
            }}
          />

          <AnalyticsSection
            title="Destinations"
            rows={[
              {
                icon: <Globe size={14} className="text-white/40" />,
                label: "Unknown",
                percent: "0%",
                accent: "red",
              },
            ]}
            onView={() => {
              setInsightContext({
                title: "Destinations",
                metricLabel: "Views",
                rows: destinationsInsights,
              });
              setInsightsOpen(true);
            }}
          />

          <AnalyticsSection
            title="Incoming Traffic"
            rows={[
              { icon: <Globe size={14} />, label: "Unknown", percent: "0%", accent: "red" },
              { icon: <Link2 size={14} />, label: "Direct", percent: "0%", accent: "green" },
              { icon: <Search size={14} />, label: "Search", percent: "0%", accent: "green" },
              { icon: <Users size={14} />, label: "Social Media", percent: "0%", accent: "green" },
            ]}
            onView={() => {
              setInsightContext({
                title: "Incoming Traffic",
                metricLabel: "Views",
                rows: trafficInsights,
              });
              setInsightsOpen(true);
            }}
          />

          <AnalyticsSection
            title="Platform"
            splitAfter={3}
            rows={[
              { icon: <Monitor size={14} />, label: "Desktop", percent: "0%", accent: "purple" },
              { icon: <Smartphone size={14} />, label: "Mobile", percent: "0%", accent: "purple" },
              { icon: <Tablet size={14} />, label: "Tablet", percent: "0%", accent: "purple" },
              { icon: <Chrome size={14} />, label: "Chrome", percent: "0%", accent: "green" },
              { icon: <Compass size={14} />, label: "Safari", percent: "0%", accent: "green" },
              { icon: <Globe2 size={14} />, label: "Edge", percent: "0%", accent: "green" },
            ]}
            onView={() => {
              setInsightContext({
                title: "Platform",
                metricLabel: "Views",
                rows: platformInsights,
              });
              setInsightsOpen(true);
            }}
          />
        </section>

        {/* GEOGRAPHY */}
        <section
          data-dashboard-section
          className="rounded-2xl border border-white/[0.03] bg-[#11141b] px-4 py-3"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Geography
          </p>

          <div className="relative mt-3 h-[320px] overflow-visible rounded-xl border border-white/[0.03] bg-[#05060b]">
            <GeoMap />

            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <button
                onClick={() => setGeoOpen(true)}
                className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/[0.18] bg-black/70 px-4 py-2 text-xs text-white/85 backdrop-blur"
              >
                <Maximize2 size={12} />
                Views
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* CARD INSIGHTS SLIDE OVER */}
      {insightContext && (
        <InsightsSlideOver
          open={insightsOpen}
          onClose={() => setInsightsOpen(false)}
          title={insightContext.title}
          metricLabel={insightContext.metricLabel}
          rows={insightContext.rows}
        />
      )}

      {/* GEOGRAPHY SLIDE OVER */}
      {geoOpen && (
        <InsightsSlideOver
          open
          onClose={() => setGeoOpen(false)}
          title="Geographies"
          metricLabel="Views"
          rows={geographyInsights}
        />
      )}
    </AnalyticsShell>
  );
}