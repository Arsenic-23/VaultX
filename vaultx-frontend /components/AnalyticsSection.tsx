"use client";

import { ReactNode } from "react";
import { Maximize2 } from "lucide-react";
import AnalyticsRow from "./AnalyticsRow";

type RowConfig = {
  icon?: ReactNode;
  label: string;
  percent: string;
  accent?: "blue" | "red" | "green" | "purple";
};

type AnalyticsSectionProps = {
  title: string;
  rows: RowConfig[];
  splitAfter?: number;
  onView?: () => void;
};

export default function AnalyticsSection({
  title,
  rows,
  splitAfter,
  onView,
}: AnalyticsSectionProps) {
  return (
    <div
      className="
        relative
        h-[260px]                 /* ⬅️ unchanged */
        rounded-2xl
        bg-gradient-to-b from-[#0c0f16] to-[#090b11]
        px-6 py-5                 /* slightly more breathing room */
        flex flex-col
      "
    >
      {/* HEADER */}
      <div className="relative z-20 mb-5 flex items-center justify-between pointer-events-auto">
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <button
          onClick={() => onView?.()}
          className="
            group
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border border-white/10
            bg-white/[0.03]
            px-3 py-1
            text-[11px]
            text-white/70
            transition
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <span>Views</span>
          <Maximize2
            size={12}
            className="opacity-70 transition group-hover:opacity-100"
          />
        </button>
      </div>

      {/* CONTENT */}
      <div
        className="
          relative z-10
          flex-1
          space-y-4              /* ⬅️ increased from 3 → 4 */
          overflow-hidden
          pointer-events-none
        "
      >
        {rows.map((row, idx) => (
          <div key={row.label}>
            <AnalyticsRow {...row} />

            {splitAfter !== undefined && idx === splitAfter - 1 && (
              <div className="my-4 border-t border-white/5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}