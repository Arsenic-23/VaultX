"use client";

import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

type MonetizationSectionProps = {};

const TEXT = "Built for modern sharing";

const MonetizationSection = forwardRef<
  HTMLDivElement,
  MonetizationSectionProps
>(function MonetizationSection(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      /* ----------------------------
       * Initial states
       * ---------------------------- */
      gsap.set(videoRef.current, {
        scale: 1.12,
        yPercent: -6,
        transformOrigin: "center center",
      });

      gsap.set(containerRef.current, {
        y: 24,
        opacity: 1,
      });

      gsap.set([headlineRef.current, copyRef.current], {
        y: 22,
        opacity: 0,
      });

      /* ----------------------------
       * Background video gyro / parallax
       * ---------------------------- */
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: 6,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }

      /* ----------------------------
       * Container subtle counter-parallax
       * ---------------------------- */
      gsap.to(containerRef.current, {
        y: -32,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* ----------------------------
       * Typewriter loop (unchanged logic)
       * ---------------------------- */
      const typeTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
      });

      const chars = TEXT.split("");
      let currentText = "";

      chars.forEach((char) => {
        typeTl.to(
          {},
          {
            duration: 0.055,
            onStart: () => {
              currentText += char;
              if (eyebrowRef.current) {
                eyebrowRef.current.textContent = currentText;
              }
            },
          }
        );
      });

      typeTl.to({}, { duration: 1.2 });

      chars.forEach(() => {
        typeTl.to(
          {},
          {
            duration: 0.035,
            onStart: () => {
              currentText = currentText.slice(0, -1);
              if (eyebrowRef.current) {
                eyebrowRef.current.textContent = currentText;
              }
            },
          }
        );
      });

      /* ----------------------------
       * Cursor blink
       * ---------------------------- */
      gsap.to(cursorRef.current, {
        opacity: 0.25,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: "power1.inOut",
      });

      /* ----------------------------
       * Text reveal (single-run)
       * ---------------------------- */
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          once: true,
        },
      })
        .to(headlineRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.05,
          ease: "power3.out",
        })
        .to(
          copyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: "power3.out",
          },
          "-=0.75"
        );

      /* ----------------------------
       * Micro gyro on headline & copy
       * ---------------------------- */
      [headlineRef.current, copyRef.current].forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -18 - i * 6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={(n) => {
        sectionRef.current = n!;
        if (typeof ref === "function") ref(n);
        else if (ref) (ref as any).current = n;
      }}
      className="relative min-h-[85vh] overflow-hidden border-b border-white/[0.07] flex items-center"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-[112%] w-full object-cover will-change-transform"
        src="/monetize.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/75" />

      {/* Content */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-4xl px-4 py-32 text-center will-change-transform"
      >
        {/* Eyebrow */}
        <p
          className="relative mb-4 inline-flex items-center text-xs font-medium uppercase tracking-[0.24em] text-white/50"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif",
          }}
        >
          {/* Invisible layout stabilizer */}
          <span className="invisible whitespace-nowrap">{TEXT}</span>

          {/* Animated layer */}
          <span className="absolute left-0 flex items-center whitespace-nowrap">
            <span ref={eyebrowRef} />
            <span
              ref={cursorRef}
              className="ml-1 inline-block h-3 w-px bg-white/40"
            />
          </span>
        </p>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-3xl sm:text-4xl font-[560] leading-tight
                     bg-gradient-to-b from-white via-white/80 to-white/45
                     bg-clip-text text-transparent will-change-transform"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
          }}
        >
          Turn file sharing
          <br />
          into passive income.
        </h2>

        {/* Copy */}
        <p
          ref={copyRef}
          className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/65 will-change-transform"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif",
          }}
        >
          Vaultx gives you a clean, creator-first way to monetize files. Upload
          once, share a link anywhere, and earn from every view automatically —
          no intrusive ads, no broken flows, just revenue that feels invisible
          to your audience.
        </p>
      </div>
    </section>
  );
});

export default MonetizationSection;