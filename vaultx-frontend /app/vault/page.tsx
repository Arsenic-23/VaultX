"use client";

import { Fragment, useRef, useState, useLayoutEffect } from "react";
import { Menu, Listbox, Transition } from "@headlessui/react";
import AnalyticsShell from "@/components/AnalyticsShell";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Eye,
  DotsThreeVertical,
  LockSimple,
  MagnifyingGlass,
  ArrowClockwise,
} from "@phosphor-icons/react";

import gsap from "gsap";

const timeRanges = [
  { value: "all", label: "All time" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
];

const emptyCards = Array.from({ length: 6 });

export default function VaultPage() {
  const [timeRange, setTimeRange] = useState("all");
  const [rangeObj, setRangeObj] = useState(timeRanges[0]);

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const elements =
      containerRef.current.querySelectorAll("[data-animate]");

    gsap.set(elements, {
      autoAlpha: 0,
      y: 12,
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 0.45,
        force3D: false,
      },
    });

    tl.to(elements, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.05,
      clearProps: "transform", 
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <AnalyticsShell
      title="Vault"
      subtitle="A quiet surface for every file in market."
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      timeRanges={timeRanges}
      actionLabel="Upload file"
      onAction={() => {
        if (typeof window !== "undefined") {
          window.location.href = "/upload";
        }
      }}
      headerHint={
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-white/70 sm:inline-block">
          Files
        </span>
      }
    >
      <div ref={containerRef} className="mt-10 space-y-14">
        {/* BEST PERFORMING */}
        <section className="space-y-6">
          <div
            data-animate
            className="flex items-center justify-between"
          >
            <h2 className="text-sm font-medium text-white/70">
              Best performance vaultx's 
            </h2>

            <div className="flex items-center gap-2">
              <Listbox value={rangeObj} onChange={setRangeObj}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0B1220] px-3 py-1.5 text-xs text-white/80 hover:border-blue-400/40">
                    <CalendarBlank size={14} />
                    {rangeObj.label}
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute right-0 z-10 mt-2 w-36 rounded-lg border border-white/10 bg-[#0B1220] shadow-xl">
                      {timeRanges.map((r) => (
                        <Listbox.Option
                          key={r.value}
                          value={r}
                          className="cursor-pointer px-3 py-2 text-xs text-white/70 hover:bg-blue-500/10"
                        >
                          {r.label}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              <button className="rounded-lg border border-white/10 bg-[#0B1220] p-1.5 text-white/60 hover:text-white">
                <CaretLeft size={14} />
              </button>
              <button className="rounded-lg border border-white/10 bg-[#0B1220] p-1.5 text-white/60 hover:text-white">
                <CaretRight size={14} />
              </button>

              <Menu as="div" className="relative">
                <Menu.Button className="rounded-lg border border-white/10 bg-[#0B1220] p-1.5 text-white/60 hover:text-white">
                  <DotsThreeVertical size={14} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-40 rounded-lg border border-white/10 bg-[#0B1220] shadow-xl">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full px-3 py-2 text-left text-xs ${
                            active
                              ? "bg-blue-500/10 text-white"
                              : "text-white/70"
                          }`}
                        >
                          Refresh
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {emptyCards.map((_, i) => (
              <div
                key={i}
                data-animate
                className="group relative rounded-xl border border-white/10 bg-gradient-to-b from-[#0C1426] to-[#070B16] p-4 transition hover:border-blue-400/30"
              >
                <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 blur-xl transition group-hover:opacity-100" />

                <div className="relative space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <LockSimple size={14} />
                    <span>No data</span>
                  </div>

                  <div className="text-sm font-semibold text-white">
                    No data
                  </div>

                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Eye size={12} />
                    No views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CREATED */}
        <section className="space-y-6">
          <div
            data-animate
            className="flex items-center justify-between"
          >
            <h3 className="text-sm font-medium text-white/70">
              Created vaults
            </h3>
          </div>

          <div
            data-animate
            className="overflow-hidden rounded-xl border border-white/10 bg-[#070B16]"
          >
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="px-4 py-10 text-center text-white/40">
                    No vaultx created
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AnalyticsShell>
  );
}
