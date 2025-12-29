"use client";

import { Fragment, useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  TrendUp,
  Wallet,
  Users,
  CalendarBlank,
  Globe,
  Clock,
  CaretDown,
} from "@phosphor-icons/react";

import AnalyticsShell from "@/components/AnalyticsShell";

/* DATA */

const timeRanges = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "ytd", label: "Year to date" },
];

const summary = [
  { label: "New subscribers", value: "0", icon: Users },
  { label: "Trials started", value: "0", icon: Clock },
  { label: "Renewals", value: "0", icon: TrendUp },
  { label: "Earnings", value: "$0.00", icon: Wallet },
];

/* PAGE */

export default function PremiumPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <AnalyticsShell
      title="Overview"
      subtitle="Subscription performance and revenue activity"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      timeRanges={timeRanges}
    >
      <div ref={rootRef} className="space-y-24 pt-14">
        {/* TOP OVERVIEW */}
        <section className="grid gap-12 lg:grid-cols-2">
          {/* MRR CARD */}
          <div className="h-[320px] rounded-3xl border border-white/10 bg-gradient-to-b from-[#060b18] to-[#040813] p-10 backdrop-blur-xl">
            <div className="flex h-full flex-col">
              <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                Monthly recurring revenue
              </div>

              <p className="mt-4 text-4xl font-semibold text-white">$0.00</p>

              <div className="mt-auto space-y-3 border-t border-white/10 pt-6 text-sm text-white/65">
                <MetricRow label="New subscribers" color="bg-blue-500" />
                <MetricRow label="Renewals" color="bg-emerald-500" />
                <MetricRow label="Earnings" color="bg-violet-500" />
              </div>
            </div>
          </div>

          {/* SALES CARD */}
          <div className="h-[320px] rounded-3xl border border-white/10 bg-gradient-to-b from-[#060b18] to-[#040813] p-10 backdrop-blur-xl">
            <div className="flex h-full flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                <TrendUp size={12} />
                Sales activity
              </div>

              <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
                <Wallet size={26} className="text-white/30" />
                <p className="mt-4 text-sm text-white/55">
                  No sales recorded yet
                </p>
                <p className="mt-1 text-xs text-white/35">
                  Activity will appear here once customers convert
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TOTALS */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Totals</h3>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65">
                <CalendarBlank size={14} />
                28 days
                <CaretDown size={12} />
              </Menu.Button>

              <Transition as={Fragment}>
                <Menu.Items className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-white/10 bg-[#0b1020]/95 p-1 backdrop-blur-xl">
                  {timeRanges.map((r) => (
                    <Menu.Item key={r.value}>
                      {({ active }) => (
                        <button
                          onClick={() => setTimeRange(r.value)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                            active
                              ? "bg-white/10 text-white"
                              : "text-white/70"
                          }`}
                        >
                          {r.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {summary.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.035] p-6 transition-all hover:-translate-y-0.5 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/45">{label}</p>
                  <Icon size={16} className="text-white/35" />
                </div>
                <p className="mt-2 text-lg font-semibold text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SOURCES */}
        <section>
          <h3 className="mb-6 text-base font-semibold text-white">
            Sources
          </h3>

          <div className="grid gap-8 lg:grid-cols-3">
            <SourceCard title="By cycle" icon={Clock} color="blue" percent={44} />
            <SourceCard
              title="By country"
              icon={Globe}
              color="green"
              percent={62}
            />
            <SourceCard title="By age" icon={Users} color="violet" percent={31} />
          </div>
        </section>
      </div>
    </AnalyticsShell>
  );
}

/* SMALL METRIC ROW */

function MetricRow({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <span>{label}</span>
      </div>
      <span>0</span>
    </div>
  );
}

/* SOURCE CARD */

function SourceCard({
  title,
  icon: Icon,
  color,
  percent,
}: {
  title: string;
  icon: any;
  color: "blue" | "green" | "violet";
  percent: number;
}) {
  const glowMap = {
    blue: "bg-blue-500/10",
    green: "bg-emerald-500/10",
    violet: "bg-violet-500/10",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0c1426] to-[#070b16] p-7 backdrop-blur-xl">
      <div
        className={`absolute inset-0 opacity-0 blur-xl transition group-hover:opacity-100 ${glowMap[color]}`}
      />

      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Icon size={16} />
            {title}
          </div>
          <span className="text-xs text-white/40">Active</span>
        </div>

        <div className="relative mt-8 flex justify-center">
          <RadialSlices
            total={32}
            active={Math.round((percent / 100) * 32)}
            color={color}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {percent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* RADIAL SLICES */

function RadialSlices({
  total,
  active,
  color,
}: {
  total: number;
  active: number;
  color: "blue" | "green" | "violet";
}) {
  const outer = 46;
  const inner = 30;
  const center = 50;

  const colorMap = {
    blue: "rgba(59,130,246,0.95)",
    green: "rgba(34,197,94,0.95)",
    violet: "rgba(139,92,246,0.95)",
  };

  return (
    <svg width="100" height="100">
      {Array.from({ length: total }).map((_, i) => {
        const angle = (360 / total) * i;
        const isActive = i < active;

        return (
          <line
            key={i}
            x1={center}
            y1={center - outer}
            x2={center}
            y2={center - inner}
            stroke={
              isActive
                ? colorMap[color]
                : "rgba(255,255,255,0.18)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} ${center} ${center})`}
          />
        );
      })}
    </svg>
  );
}