"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

interface AdSlotProps {
  className?: string;
  label?: string;
}

export default function AdSlot({ className = "", label = "Advertisement" }: AdSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!slotRef.current || prefersReducedMotion()) return;

    const adSlotTl = gsap.timeline({ delay: 0.2 });
    adSlotTl.from(slotRef.current, {
      opacity: 0,
      duration: getDuration(0.6),
      ease: "power3.out",
    });

    return () => {
      adSlotTl.kill();
    };
  }, { scope: slotRef });

  return (
    <div
      ref={slotRef}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="w-full p-4 text-center">
        {label && (
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/20">
            {label}
          </div>
        )}
        <div className="h-full w-full rounded border border-white/[0.04] bg-white/[0.02]" />
      </div>
    </div>
  );
}
