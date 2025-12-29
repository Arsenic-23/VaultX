"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Calendar } from "lucide-react";

type InsightRow = {
  label: string;
  views?: number | string;
  percent?: number | string;
};

type InsightsSlideOverProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  metricLabel: string;
  timeLabel?: string;
  rows: InsightRow[];
};

export default function InsightsSlideOver({
  open,
  onClose,
  title,
  metricLabel,
  timeLabel,
  rows,
}: InsightsSlideOverProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;

    /** Initial mount **/
    if (!hasMounted.current) {
      hasMounted.current = true;

      gsap.set(panelRef.current, {
        x: 48,
        autoAlpha: 0,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.set(backdropRef.current, {
        autoAlpha: 0,
      });

      return; 
    }

    /** `open` changes */
    if (open) {
      gsap.timeline({ overwrite: true })
        .to(backdropRef.current, {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power2.out",
        })
        .to(
          panelRef.current,
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: "expo.out",
          },
          "<"
        );
    } else {
      gsap.timeline({ overwrite: true })
        .to(panelRef.current, {
          x: 48,
          autoAlpha: 0,
          duration: 0.35,
          ease: "power3.in",
        })
        .to(
          backdropRef.current,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          "<"
        );
    }
  }, [open]);

  return (
    <>
      {/* BACKDROP */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/50
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
      />

      {/* PANEL */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`
          fixed z-50
          right-6 top-6 bottom-6
          w-[420px]
          max-w-full
          rounded-2xl
          border border-white/[0.06]
          bg-[#05060b]
          shadow-2xl
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        <div className="flex h-full flex-col px-6 py-5">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{title}</h2>

            {timeLabel && (
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                <Calendar size={14} />
                {timeLabel}
              </div>
            )}
          </div>

          {/* TABLE HEADER */}
          <div className="mt-6 grid grid-cols-[1fr_90px_60px] text-xs text-white/40">
            <span>{title.slice(0, -1) || "Item"}</span>
            <span className="text-right">{metricLabel}</span>
            <span className="text-right">%</span>
          </div>

          {/* ROWS */}
          <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
            {rows.map((row) => (
              <div
                key={row.label}
                className="
                  grid grid-cols-[1fr_90px_60px]
                  items-center
                  rounded-lg
                  px-2 py-2
                  text-sm
                  text-white/80
                  hover:bg-white/[0.03]
                "
              >
                <span className="truncate">{row.label}</span>
                <span className="text-right text-white/60">
                  {row.views ?? "—"}
                </span>
                <span className="text-right text-white/40">
                  {row.percent ?? "—"}
                </span>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="mt-12 text-center text-sm text-white/40">
                No data available
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}