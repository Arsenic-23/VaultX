"use client";

import { ReactNode } from "react";

type Accent = "blue" | "red" | "green" | "purple";

const accentMap: Record<Accent, string> = {
  blue: "bg-blue-400/80",
  red: "bg-red-400/80",
  green: "bg-emerald-400/80",
  purple: "bg-purple-400/80",
};

type AnalyticsRowProps = {
  icon?: ReactNode;
  label: string;
  percent: string;
  accent?: Accent;
};

export default function AnalyticsRow({
  icon,
  label,
  percent,
  accent = "blue",
}: AnalyticsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-2 text-sm text-white/70">
        {icon}
        <span>{label}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <span className="w-8 text-right text-xs text-white/45">
          {percent}
        </span>

        {/* THIN */}
        <div className="flex items-center gap-[4px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={`
                h-3
                w-[1px]
                ${i < 2 ? accentMap[accent] : "bg-white/15"}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}