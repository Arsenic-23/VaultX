"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FileText, Server, Monitor } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animations";

export default function FileTransferAnimation() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const checkpointA = useRef<HTMLDivElement | null>(null);
  const checkpointB = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (
        prefersReducedMotion() ||
        !fileRef.current ||
        !progressRef.current ||
        !checkpointA.current ||
        !checkpointB.current
      )
        return;

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.8,
        defaults: { ease: "power2.out" },
      });

      // Initial state
      gsap.set([fileRef.current, progressRef.current], {
        x: 0,
      });

      gsap.set([checkpointA.current, checkpointB.current], {
        opacity: 0.3,
        scale: 1,
      });

      tl.to(fileRef.current, {
        x: 80,
        duration: 0.6,
      })
        .to(
          progressRef.current,
          {
            width: "30%",
            duration: 0.6,
            ease: "none",
          },
          "<"
        )
        .to(
          checkpointA.current,
          {
            opacity: 1,
            scale: 1.25,
            duration: 0.2,
          },
          "-=0.15"
        )
        .to(checkpointA.current, {
          scale: 1,
          duration: 0.15,
        })
        .to(fileRef.current, {
          x: 170,
          duration: 0.7,
        })
        .to(
          progressRef.current,
          {
            width: "65%",
            duration: 0.7,
            ease: "none",
          },
          "<"
        )
        .to(
          checkpointB.current,
          {
            opacity: 1,
            scale: 1.25,
            duration: 0.2,
          },
          "-=0.2"
        )
        .to(checkpointB.current, {
          scale: 1,
          duration: 0.15,
        })
        .to(fileRef.current, {
          x: 260,
          opacity: 0,
          duration: 0.35,
        })
        .to(
          progressRef.current,
          {
            width: "100%",
            duration: 0.35,
            ease: "none",
          },
          "<"
        )
        .set([fileRef.current, progressRef.current], {
          x: 0,
          width: "0%",
          opacity: 1,
        })
        .set([checkpointA.current, checkpointB.current], {
          opacity: 0.3,
        });

      return () => tl.kill();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-white/8 bg-[#050509]/90 px-6 py-6"
    >
      <div className="flex items-center justify-between gap-6">
        {/* SERVER */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0A1020]">
            <Server className="h-4 w-4 text-white/60" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Origin
            </p>
            <p className="text-sm font-medium text-white">Vault server</p>
          </div>
        </div>

        {/* PIPELINE */}
        <div className="relative hidden flex-1 sm:block">
          <div className="relative mx-auto h-10 max-w-xs">
            {/* Base line */}
            <div className="absolute inset-y-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/10" />

            {/* Progress line */}
            <div
              ref={progressRef}
              className="absolute inset-y-1/2 left-0 h-px -translate-y-1/2 bg-[#5B8DEF]"
              style={{ width: "0%" }}
            />

            {/* Checkpoints */}
            <div
              ref={checkpointA}
              className="absolute left-[30%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#5B8DEF]"
            />
            <div
              ref={checkpointB}
              className="absolute left-[65%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#5B8DEF]"
            />

            {/* File */}
            <div
              ref={fileRef}
              className="absolute left-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-[#0A1020] text-[#5B8DEF] border border-white/10"
            >
              <FileText className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* CLIENT */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Destination
            </p>
            <p className="text-sm font-medium text-white">
              Client session
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0A1020]">
            <Monitor className="h-4 w-4 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}