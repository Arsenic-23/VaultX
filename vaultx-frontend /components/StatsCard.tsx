"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardTl = gsap.timeline();
            cardTl.from(cardRef.current, {
              opacity: 0,
              y: 15,
              duration: getDuration(0.6),
              ease: "power3.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-xl font-bold text-white truncate">{value}</p>
          {subtitle && (
            <p className="mt-1.5 text-xs text-white/40">{subtitle}</p>
          )}
        </div>
        {icon && <div className="ml-3 flex-shrink-0 text-white/40">{icon}</div>}
      </div>
    </div>
  );
}
