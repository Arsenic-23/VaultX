"use client";

import { useRef } from "react";
import Link from "next/link";
import * as Separator from "@radix-ui/react-separator";
import { ArrowUpRight } from "lucide-react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const featureGrid = [
  "Drop-in access layer that wraps any file link without changing your workflow.",
  "Smart unlock routing that adapts to device, region, and delivery context.",
  "Clean intent capture—users unlock content without spam, pop-ups, or noise.",
  "Earn on every unlock while building a reusable audience at the same time.",
  "Full transparency with per-link analytics and auditable access history.",
  "Instant, quality-based payouts triggered the moment content is unlocked.",
];

const STATEMENTS = [
  "Vaultx sits between your files and your audience—turning every shared link into a controlled access point.",
  "Upload a file once and get a single link you can share anywhere, instantly.",
  "Every unlock generates earnings—automatically shared with the creator.",
  "Your audience downloads seamlessly while ads power revenue in the background.",
];

export default function ProductStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<HTMLDivElement[]>([]);

  const statementSectionRef = useRef<HTMLElement>(null);
  const statementBgRef = useRef<HTMLDivElement>(null);
  const statementRefs = useRef<HTMLParagraphElement[]>([]);

  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.from(cardsRef.current, {
        y: 28,
        autoAlpha: 0,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      gsap.from(linesRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        statementBgRef.current,
        { yPercent: -10, scale: 1.15 },
        {
          yPercent: 10,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: statementSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.set(statementRefs.current, { autoAlpha: 0 });
      gsap.set(statementRefs.current[0], { autoAlpha: 1 });

      const statementTL = gsap.timeline({
        repeat: -1,
        scrollTrigger: {
          trigger: statementSectionRef.current,
          start: "top 70%",
          invalidateOnRefresh: true,
        },
      });

      statementRefs.current.forEach((el, i) => {
        if (i !== 0) {
          statementTL.fromTo(
            el,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 1.4, ease: "power2.out" }
          );
        }

        statementTL.to(el, {
          autoAlpha: 0,
          y: -26,
          duration: 1.1,
          delay: 2.2,
          ease: "power2.inOut",
        });
      });

      gsap.fromTo(
        videoRef.current,
        { scale: 1.12, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.from(ctaWrapRef.current, {
        y: 48,
        autoAlpha: 0,
        ease: "power3.out",
        duration: 1.2,
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
        immediateRender: false,
      });

      gsap.from(ctaBtnRef.current, {
        y: 20,
        autoAlpha: 0,
        ease: "power3.out",
        duration: 1,
        delay: 0.15,
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
        immediateRender: false,
        clearProps: "transform,opacity",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative isolate overflow-hidden border-b border-white/[0.07] bg-navy-primary"
      >
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 will-change-transform"
          style={{
            backgroundImage: "url(/bg-head2.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-[1] bg-navy-primary/75" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Product surface
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featureGrid.map((feature, idx) => (
              <div
                key={feature}
                ref={(el) => el && (cardsRef.current[idx] = el)}
                className="px-6 py-8 text-sm text-white/75"
              >
                <div className="flex gap-3">
                  <span className="mt-1 h-1.5 w-6 rounded-full bg-white/35" />
                  <p>{feature}</p>
                </div>

                {idx !== featureGrid.length - 1 && (
                  <Separator.Root
                    ref={(el) =>
                      el && (linesRef.current[idx] = el as HTMLDivElement)
                    }
                    className="mt-6 h-px w-full bg-white/10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={statementSectionRef}
        className="relative isolate overflow-hidden border-b border-white/[0.07] bg-navy-primary"
      >
        <div
          ref={statementBgRef}
          className="absolute inset-0 z-0 will-change-transform"
          style={{
            backgroundImage: "url(/bg-head3.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-[1] bg-navy-primary/80" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-56">
          <div className="relative h-[14rem]">
            {STATEMENTS.map((text, idx) => (
              <p
                key={text}
                ref={(el) => el && (statementRefs.current[idx] = el)}
                className="absolute inset-0 text-balance text-5xl font-semibold bg-gradient-to-br from-white via-white/60 to-white/30 bg-clip-text text-transparent"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={ctaSectionRef}
        className="relative isolate overflow-hidden bg-navy-primary"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src="/footer.mp4"
        />
        <div className="absolute inset-0 z-[1] bg-navy-primary/85" />

        <div
          ref={ctaWrapRef}
          className="relative z-10 mx-auto max-w-3xl px-4 py-36 text-center"
        >
          <h3
            ref={ctaHeadingRef}
            className="text-balance text-5xl font-semibold leading-tight bg-gradient-to-br from-white via-white/70 to-white/40 bg-clip-text text-transparent"
          >
            Upload once. Share anywhere.
            <span className="block">Earn on every unlock.</span>
          </h3>

          <div className="mt-14 flex justify-center">
            <Link
              ref={ctaBtnRef}
              href="/upload"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-sm font-semibold text-background shadow-[0_10px_40px_rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_20px_60px_rgba(255,255,255,0.35)]"
            >
              Upload your file
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}