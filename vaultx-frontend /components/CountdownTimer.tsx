"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  className?: string;
}

export default function CountdownTimer({
  duration,
  onComplete,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const numberRef = useRef<HTMLDivElement>(null);
  const countdownTlRef = useRef<gsap.core.Timeline | null>(null);

  // Countdown pulse animation
  useGSAP(() => {
    if (!numberRef.current || prefersReducedMotion()) return;

    countdownTlRef.current = gsap.timeline({ repeat: -1 });
    countdownTlRef.current.to(numberRef.current, {
      scale: 1.02,
      duration: getDuration(0.5),
      ease: "power2.out",
    });
    countdownTlRef.current.to(numberRef.current, {
      scale: 1,
      duration: getDuration(0.5),
      ease: "power2.in",
    });

    return () => {
      countdownTlRef.current?.kill();
    };
  }, { scope: numberRef });

  useEffect(() => {
    if (timeLeft <= 0) {
      if (countdownTlRef.current) {
        countdownTlRef.current.kill();
      }
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, "0");
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-3 text-xs text-white/40">Download available in</div>
      <div ref={numberRef} className="text-5xl font-bold text-white tracking-tight">
        {formatTime(timeLeft)}
      </div>
      <div className="mt-2 text-[10px] text-white/30 uppercase tracking-wider">seconds</div>
    </div>
  );
}
