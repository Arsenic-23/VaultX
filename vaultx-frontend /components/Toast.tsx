"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const toastTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!toastRef.current || prefersReducedMotion()) return;

    toastTlRef.current = gsap.timeline();

    // Enter animation
    toastTlRef.current.from(toastRef.current, {
      opacity: 0,
      x: 100,
      duration: getDuration(0.3),
      ease: "power2.out",
    });

    // Auto-close animation
    toastTlRef.current.to(
      toastRef.current,
      {
        opacity: 0,
        x: 100,
        duration: getDuration(0.3),
        ease: "power2.in",
        onComplete: onClose,
      },
      `+=${duration / 1000}`
    );

    return () => {
      toastTlRef.current?.kill();
    };
  }, { scope: toastRef, dependencies: [duration, onClose] });

  const bgColors = {
    success: "bg-green-500/20 border-green-500/30 text-green-400",
    error: "bg-red-500/20 border-red-500/30 text-red-400",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  };

  return (
    <div
      ref={toastRef}
      className={`fixed bottom-4 right-4 z-50 rounded-lg border px-4 py-3 shadow-lg ${bgColors[type]}`}
    >
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-current opacity-70 hover:opacity-100"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
