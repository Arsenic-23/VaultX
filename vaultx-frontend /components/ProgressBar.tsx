"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/animations";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export default function ProgressBar({ progress, className = "" }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const progressTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!barRef.current || prefersReducedMotion()) return;

    progressTlRef.current = gsap.timeline({ paused: true });

    return () => {
      progressTlRef.current?.kill();
    };
  }, { scope: barRef });

  useEffect(() => {
    if (!barRef.current || !progressTlRef.current || prefersReducedMotion()) return;

    progressTlRef.current.to(barRef.current, {
      width: `${progress}%`,
      duration: 0.4,
      ease: "power2.out",
    });
    progressTlRef.current.play();
  }, [progress]);

  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05] ${className}`}>
      <div
        ref={barRef}
        className="h-full bg-white/90 transition-all"
        style={{ width: "0%" }}
      />
    </div>
  );
}
