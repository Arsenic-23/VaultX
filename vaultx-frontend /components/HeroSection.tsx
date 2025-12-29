"use client";

import { RefObject, useEffect, useState } from "react";
import Link from "next/link";

type HeroSectionProps = {
  heroRef: RefObject<HTMLDivElement>;
  eyebrowRef: RefObject<HTMLParagraphElement>;
  headlineRef: RefObject<HTMLHeadingElement>;
  subheadingRef: RefObject<HTMLParagraphElement>;
  ctaRowRef: RefObject<HTMLDivElement>;
};

const EYEBROW_TEXT = "Monetized file sharing";

export default function HeroSection({
  heroRef,
  eyebrowRef,
  headlineRef,
  subheadingRef,
  ctaRowRef,
}: HeroSectionProps) {
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 40 : 70;
    const pauseAfterType = 1200;
    const pauseAfterDelete = 500;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === EYEBROW_TEXT) {
        setTimeout(() => setIsDeleting(true), pauseAfterType);
        return;
      }

      if (isDeleting && typedText === "") {
        setTimeout(() => setIsDeleting(false), pauseAfterDelete);
        return;
      }

      setTypedText((prev) =>
        isDeleting
          ? EYEBROW_TEXT.slice(0, prev.length - 1)
          : EYEBROW_TEXT.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden border-b border-white/[0.06]">
      {/* Background video */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/heroback.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <div className="mx-auto grid min-h-screen max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div ref={heroRef} className="max-w-2xl space-y-8">
            {/* Eyebrow – PERFECTLY FIXED CAPSULE */}
            <p
              ref={eyebrowRef}
              className="relative inline-flex items-center rounded-full
                         border border-white/15 bg-white/5
                         px-4 py-1.5
                         text-[11px] font-medium uppercase
                         tracking-[0.34em] text-white/70
                         backdrop-blur-md"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif",
              }}
            >
              {/* Invisible full-width text */}
              <span className="invisible whitespace-nowrap">
                {EYEBROW_TEXT}
              </span>

              {/* Animated text layer */}
              <span className="absolute left-4 flex items-center gap-1 whitespace-nowrap">
                <span>{typedText}</span>
                <span className="inline-block h-3 w-[1px] bg-white/60 animate-pulse" />
              </span>
            </p>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-balance
                         text-[3.2rem] sm:text-[3.7rem] lg:text-[4.1rem]
                         font-[560] leading-[1.05]
                         tracking-[-0.02em]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
              }}
            >
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Every file link.
              </span>
              <br />
              <span className="bg-gradient-to-r from-white/80 via-white/55 to-white/30 bg-clip-text text-transparent">
                A new revenue stream.
              </span>
            </h1>

            {/* Subheading */}
            <p
              ref={subheadingRef}
              className="max-w-xl text-[17px] leading-7 text-white/75"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif",
              }}
            >
              Upload once, share anywhere. Earn passive income every time your
              file is opened—powered by clean, modern ads that never interrupt
              the user experience.
            </p>

            {/* CTA */}
            <div ref={ctaRowRef} className="pt-3 flex items-center gap-4">
              <Link
                href="/dashboard"
                className="group relative inline-flex h-12 items-center
                           rounded-full bg-white px-8
                           text-sm font-semibold text-black
                           transition-all duration-300
                           hover:bg-white/90
                           focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <span className="relative z-10">Open dashboard</span>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full
                             bg-white/40 blur-xl
                             opacity-0 transition-opacity duration-300
                             group-hover:opacity-100"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}