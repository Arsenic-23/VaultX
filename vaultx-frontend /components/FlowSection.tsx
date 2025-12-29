"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

type NodeRef = HTMLDivElement | null;

export default function FlowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<NodeRef[]>([]);
  const glowRefs = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const wordsWrapRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dollarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.06, yPercent: -2 },
          {
            scale: 1,
            yPercent: 2,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );

        gsap.to(headingRef.current, {
          y: -16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center top",
            scrub: 1,
          },
        });

        if (wordsWrapRef.current) {
          const words = gsap.utils.toArray<HTMLSpanElement>(
            wordsWrapRef.current.querySelectorAll("[data-roll-word]")
          );

          gsap.set(words, { yPercent: 100 });
          gsap.set(words[0], { yPercent: 0 });

          const tl = gsap.timeline({ repeat: -1 });

          words.forEach((word, i) => {
            const next = words[(i + 1) % words.length];
            tl.to(word, { yPercent: -100, duration: 0.4, ease: "power2.inOut" })
              .to(
                next,
                { yPercent: 0, duration: 0.4, ease: "power2.inOut" },
                "<"
              )
              .to({}, { duration: 1.1 });
          });
        }

        const nodes = nodesRef.current.filter(Boolean) as HTMLDivElement[];
        gsap.set(nodes, { opacity: 0 });

        nodes.forEach((node) => {
          gsap.to(node, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
            },
          });
        });

        if (packetRef.current && railRef.current && nodes.length) {
          const railRect = railRef.current.getBoundingClientRect();

          const nodeCenters = nodes.map((node) => {
            const r = node.getBoundingClientRect();
            return r.left + r.width / 2 - railRect.left;
          });

          const packetWidth = packetRef.current.offsetWidth;
          const maxX = nodeCenters[nodeCenters.length - 1] - packetWidth / 2;

          gsap.set(packetRef.current, { x: 0 });
          gsap.set(glowRefs.current, { opacity: 0, scale: 0.85 });
          gsap.set(dollarRef.current, { opacity: 0, y: 6, scale: 0.6 });

          const popDollar = () => {
            gsap.fromTo(
              dollarRef.current,
              { opacity: 0, y: 10, scale: 0.6 },
              {
                opacity: 1,
                y: -18,
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () =>
                  gsap.to(dollarRef.current, {
                    opacity: 0,
                    y: -30,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.in",
                  }),
              }
            );
          };

          const flowTL = gsap.timeline({ repeat: -1 });

          flowTL.to(packetRef.current, {
            x: nodeCenters[1],
            duration: 0.7,
            ease: "none",
            onUpdate: () => updateGlow(nodeCenters),
            onComplete: popDollar,
          });

          flowTL.to({}, { duration: 0.4 });

          flowTL.to(packetRef.current, {
            x: maxX,
            duration: 0.7,
            ease: "none",
            onUpdate: () => updateGlow(nodeCenters),
            onComplete: popDollar,
          });

          flowTL.set(packetRef.current, { x: 0 });
        }

        function updateGlow(centers: number[]) {
          const packetX = gsap.getProperty(packetRef.current!, "x") as number;
          centers.forEach((center, i) => {
            const d = Math.abs(packetX - center);
            gsap.to(glowRefs.current[i], {
              opacity: d < 18 ? 1 : 0,
              scale: d < 18 ? 1 : 0.85,
              duration: 0.22,
              overwrite: true,
            });
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="flow"
      className="relative overflow-hidden border-b border-white/[0.06] bg-black py-48"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: "url('/flow.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Flow
          </p>

          <h3 className="relative h-[1.2em] overflow-hidden text-3xl font-semibold sm:text-4xl">
            <span
              ref={wordsWrapRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              {["Audience", "Vaultx", "Settlement"].map((word) => (
                <span
                  key={word}
                  data-roll-word
                  className="absolute bg-gradient-to-b from-neutral-100 via-neutral-300 to-neutral-400 bg-clip-text text-transparent"
                >
                  {word}
                </span>
              ))}
            </span>
          </h3>

          <p className="mt-6 text-white/60">
            Value transitions through control — not direction.
          </p>
        </div>

        <div className="relative mt-32 hidden sm:block">
          <div className="relative h-20">
            <div
              ref={railRef}
              className="absolute left-24 right-24 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/20"
            />

            <div
              ref={packetRef}
              className="absolute left-24 top-1/2 h-2 w-6 -translate-y-1/2 rounded-full bg-white"
            />

            <div
              ref={dollarRef}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 text-sm font-semibold text-white"
            >
              $
            </div>

            <div className="relative flex h-full items-center justify-between px-24">
              {[
                { title: "Audience", img: "/audience.png" },
                { title: "Vaultx", img: "/vaultx.png" },
                { title: "Output", img: "/output.png" },
              ].map((item, i) => (
                <div
                  key={item.title}
                  ref={(n) => (nodesRef.current[i] = n)}
                  className="relative z-10"
                >
                  <div
                    ref={(n) => {
                      if (n) glowRefs.current[i] = n;
                    }}
                    className="pointer-events-none absolute inset-[-8px] rounded-xl bg-white/20 blur-md"
                  />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-black">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full scale-[0.75] object-contain opacity-90"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between px-24">
            {["Audience", "VaultX", "Output"].map((title) => (
              <div key={title} className="w-20 text-center">
                <div className="bg-gradient-to-b from-neutral-100 via-neutral-300 to-neutral-400 bg-clip-text font-semibold text-transparent">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}