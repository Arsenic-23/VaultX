"use client";

import { Wallet } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  highlight?: boolean;
};

const METRICS: Metric[] = [
  { label: "Current balance", value: "$0", highlight: true },
  { label: "Views", value: "0" },
  { label: "Unlocks", value: "0" },
  { label: "Earnings", value: "$0" },
  { label: "Task completions", value: "0" },
  { label: "Unlock rate", value: "0%" },
  { label: "CPM", value: "$0" },
  { label: "Engagement rate", value: "0%" },
  { label: "Average EPV", value: "$0.000" },
];

export default function OverviewTabs() {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#11141b] px-5 py-4">
      {/* Header */}
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
        Overview
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-[420px_1fr]">
        {/* LEFT — METRICS */}
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0d12]">
          {METRICS.map((metric, index) => {
            const isBalance = metric.highlight;

            return (
              <div
                key={metric.label}
                className={`
                  flex items-center justify-between px-4 py-2.5 text-sm
                  ${!isBalance && index !== METRICS.length - 1 ? "border-b border-white/[0.06]" : ""}
                  ${isBalance ? "relative z-10" : ""}
                `}
              >
                {/* LEFT */}
                <div className="flex items-center gap-2">
                  {isBalance && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
                      <Wallet size={14} />
                    </span>
                  )}

                  <span
                    className={`font-medium ${
                      isBalance ? "text-white" : "text-white/85"
                    }`}
                  >
                    {metric.label}
                  </span>
                </div>

                {/* VALUE */}
                <span
                  className={`font-medium ${
                    isBalance ? "text-white" : "text-white/70"
                  }`}
                >
                  {metric.value}
                </span>

                {/* BALANCE BACKPLATE */}
                {isBalance && (
                  <div className="pointer-events-none absolute inset-1 rounded-lg border border-white/[0.08] bg-white/[0.02]" />
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT — GRAPH PANEL */}
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0d12]">
          {/* Legend */}
          <div className="absolute right-4 top-3 flex items-center gap-5 text-xs text-white/50">
            <span className="flex items-center gap-2">
              <span className="h-3 w-[2px] rounded bg-blue-400" />
              Views
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-[2px] rounded bg-purple-400" />
              Unlocks
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-[2px] rounded bg-emerald-400" />
              Earnings
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-[2px] rounded bg-pink-400" />
              Task completions
            </span>
          </div>

          {/* Baseline */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-[82%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}