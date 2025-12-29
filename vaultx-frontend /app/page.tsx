"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animations";

import HeroSection from "@/components/HeroSection";
import FlowSection from "@/components/FlowSection";
import ProductStackSection from "@/components/ProductStackSection";
import MonetizationSection from "@/components/MonetizationSection";

gsap.registerPlugin(ScrollTrigger);

type SectionRef = HTMLDivElement | null;

const modernColumns = [
  {
    title: "Smart access control",
    copy: "Each file link enforces unlock rules automatically—access is granted only when conditions are met, without manual intervention.",
    icon: <ShieldCheck className="h-4 w-4 text-white/55" aria-hidden />,
  },
  {
    title: "Friction that feels fair",
    copy: "Viewers unlock content through a simple, respectful flow that keeps trust intact while enabling monetization.",
    icon: <Sparkles className="h-4 w-4 text-white/55" aria-hidden />,
  },
  {
    title: "Earnings per unlock",
    copy: "Every successful file access generates revenue for the uploader, credited instantly and transparently.",
    icon: <Wallet className="h-4 w-4 text-white/55" aria-hidden />,
  },
];

const ROTATING_HEADLINES = [
  "Monetization that respects the audience.",
  "Turn shared files into earning links.",
  "Every unlock creates value—automatically.",
];

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<SectionRef[]>([]);

  const modernSectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rotatingRefs = useRef<HTMLHeadingElement[]>([]);

  /* Hero entrance */
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({
      defaults: { ease: "expo.out", duration: 0.45 },
    });

    tl.from(pageRef.current, { y: 18, opacity: 0, duration: 0.4 });

    tl.from(
      [
        eyebrowRef.current,
        headlineRef.current,
        subheadingRef.current,
        ctaRowRef.current,
      ],
      { y: 22, opacity: 0, stagger: 0.06 },
      "-=0.15"
    );
  }, []);

  /* Section scroll reveals */
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    sectionRefs.current.forEach((section) => {
      if (!section) return;

      gsap.from(section, {
        y: 28,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });
    });
  }, []);

  /* Modern way */
  useGSAP(() => {
    if (prefersReducedMotion() || !modernSectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: modernSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.from(".modern-col", {
        y: 28,
        opacity: 0,
        stagger: 0.14,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: modernSectionRef.current,
          start: "top 70%",
        },
      });

      const items = rotatingRefs.current;

      gsap.set(items, { opacity: 0, y: 16 });
      gsap.set(items[0], { opacity: 1, y: 0 });

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });

      items.forEach((el, i) => {
        const next = items[(i + 1) % items.length];
        loop
          .to(el, {
            opacity: 0,
            y: -16,
            duration: 0.4,
            ease: "power2.inOut",
          })
          .to(
            next,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.12"
          );
      });
    }, modernSectionRef);

    return () => ctx.revert();
  }, []);

  const backgroundImage = useMemo(() => "/bg-head.png", []);

  return (
    <div ref={pageRef} className="bg-background text-white">
      <HeroSection
        heroRef={heroRef}
        eyebrowRef={eyebrowRef}
        headlineRef={headlineRef}
        subheadingRef={subheadingRef}
        ctaRowRef={ctaRowRef}
      />

      <MonetizationSection ref={(n) => (sectionRefs.current[0] = n)} />

      <FlowSection />

      {/* MODERN WAY */}
      <section
        ref={(n) => {
          modernSectionRef.current = n;
          sectionRefs.current[1] = n;
        }}
        className="relative overflow-hidden border-b border-white/[0.07]"
      >
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto max-w-6xl px-4 py-32">
          <div className="space-y-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              The modern way
            </p>

            <div className="relative mx-auto h-[3.5rem] max-w-3xl overflow-hidden">
              {ROTATING_HEADLINES.map((text, i) => (
                <h3
                  key={text}
                  ref={(el) => {
                    if (el) rotatingRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex items-center justify-center text-3xl font-semibold sm:text-4xl"
                >
                  {text}
                </h3>
              ))}
            </div>

            <p className="mx-auto max-w-2xl text-white/70">
              Upload a file, share a link, and earn whenever someone unlocks your
              content—simple, transparent, and built for scale.
            </p>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-3">
            {modernColumns.map((item) => (
              <div key={item.title} className="modern-col space-y-3">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <h4 className="font-semibold">{item.title}</h4>
                </div>
                <p className="text-sm text-white/70">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductStackSection />
    </div>
  );
}