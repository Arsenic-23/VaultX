"use client";

import { useRef, useState } from "react";
import {
  UserCircle,
  Wallet,
  Bell,
  ShieldCheck,
  Lifebuoy,
  CaretRight,
} from "@phosphor-icons/react";

import AnalyticsShell from "@/components/AnalyticsShell";

const timeRanges = [{ value: "all", label: "All activity" }];

const SETTINGS = [
  {
    id: "profile",
    title: "Profile",
    description: "Manage your account profile settings.",
    icon: UserCircle,
  },
  {
    id: "finance",
    title: "Finance",
    description: "Manage and request cashouts.",
    icon: Wallet,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Control alerts and system signals.",
    icon: Bell,
  },
  {
    id: "security",
    title: "Security",
    description: "Session rules and access protection.",
    icon: ShieldCheck,
  },
  {
    id: "help",
    title: "Help",
    description: "Legal information, support, and contact details.",
    icon: Lifebuoy,
  },
];

export default function SettingsPage() {
  const [timeRange, setTimeRange] = useState("all");
  const mainRef = useRef<HTMLDivElement | null>(null);

  return (
    <AnalyticsShell
      title="Settings"
      subtitle="Quiet configuration for access, payouts, and notifications."
      actionLabel="Save changes"
      onAction={() => {}}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      timeRanges={timeRanges}
      headerHint={
        <span className="hidden sm:inline-block rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/70">
          Account
        </span>
      }
    >
      {/* Stable wrapper */}
      <div className="min-h-[calc(100vh-220px)] w-full">
        {/* Header spacing */}
        <div className="h-10 sm:h-12" />

        <div
          ref={mainRef}
          className="
            mx-auto
            w-full
            max-w-[1200px]
            rounded-3xl
            border border-white/10
            bg-gradient-to-b from-[#060b18] to-[#040813]
            p-6 sm:p-8
            shadow-[0_25px_70px_-30px_rgba(0,0,0,0.95)]
          "
        >
          <div className="space-y-4">
            {SETTINGS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className="
                    group
                    flex w-full items-center justify-between gap-6
                    rounded-2xl
                    border border-white/10
                    bg-black/30
                    px-6 py-6
                    transition
                    hover:bg-white/[0.04]
                    hover:border-white/20
                  "
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-xl
                        border border-white/10
                        bg-white/[0.03]
                        text-white/80
                      "
                    >
                      <Icon size={24} weight="duotone" />
                    </div>

                    <div className="text-left">
                      <p className="text-base font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm text-white/55 max-w-[48ch]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <CaretRight
                    size={20}
                    className="text-white/25 transition group-hover:text-white/60"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom breathing space */}
        <div className="h-16" />
      </div>
    </AnalyticsShell>
  );
}