"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Check, CreditCard } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Plan = {
  id: string;
  title: string;
  price: string;
  note?: string;
};

const PLANS: Plan[] = [
  { id: "2d", title: "2 Days Access", price: "$89", note: "Limited-time access" },
  { id: "1m", title: "1 Month", price: "$109" },
  {
    id: "12m",
    title: "12 Months",
    price: "$355.67",
    note: "Best value · Save 70%",
  },
];

const HEADLINES = [
  "Premium access, without compromise",
  "Designed for speed and privacy",
  "One plan. Unlimited VaultX",
];

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState("12m");
  const headlineRefs = useRef<HTMLHeadingElement[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.out" },
    });

    headlineRefs.current.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 14, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
        i === 0 ? 0 : "+=0.4"
      ).to(
        el,
        {
          opacity: 0,
          y: -14,
          filter: "blur(5px)",
          duration: 0.7,
        },
        "+=1.2"
      );
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-white pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/premium.png')" }}
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="mb-20 text-center">
          {/* Capsule */}
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              <p className="text-[11px] uppercase tracking-widest text-white/70">
                VaultX Premium
              </p>
            </div>
          </div>

          {/* Animated headline */}
          <div className="relative h-[3.25rem] sm:h-[4.25rem] overflow-hidden">
            {HEADLINES.map((text, i) => (
              <h1
                key={text}
                ref={(el) => {
                  if (el) headlineRefs.current[i] = el;
                }}
                className="absolute inset-0 text-4xl font-semibold sm:text-5xl opacity-0
                bg-gradient-to-b from-white via-white/70 to-white/40
                bg-clip-text text-transparent"
              >
                {text}
              </h1>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-white/60">
            One plan. Unlimited VaultX access. No ads. No friction.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.05] backdrop-blur-xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{ backgroundImage: "url('/premium-card-bg.png')" }}
            />

            <div className="relative p-12">
              {/* Plans */}
              <div className="grid gap-5 sm:grid-cols-3">
                {PLANS.map((plan) => {
                  const active = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={[
                        "relative rounded-2xl border p-6 text-left transition-all",
                        active
                          ? "border-blue-400 bg-blue-500/25 shadow-lg shadow-blue-500/10"
                          : "border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.07]",
                      ].join(" ")}
                    >
                      <p className="text-sm text-white/70">{plan.title}</p>
                      <p className="mt-3 text-3xl font-semibold">
                        {plan.price}
                        <span className="text-sm text-white/60"> /month</span>
                      </p>

                      {plan.note && (
                        <p className="mt-2 text-xs text-blue-300">
                          {plan.note}
                        </p>
                      )}

                      {active && (
                        <div className="absolute right-4 top-4 rounded-full bg-blue-500 p-1.5">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Benefits */}
              <div className="mx-auto mt-12 max-w-lg">
                {[
                  "Instant access across the VaultX network",
                  "Cancel anytime — no commitments",
                  "No tracking or third-party data sharing",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 py-2.5 text-sm text-white/80"
                  >
                    <Check className="h-4 w-4 text-green-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Payment Buttons */}
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#ffc439] px-10 text-sm font-semibold text-black hover:bg-[#ffb700]">
                  <Image src="/paypal.svg" alt="PayPal" width={60} height={60} />
                  Pay with PayPal
                </button>

                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-10 text-sm font-semibold text-black hover:bg-white/90">
                  <CreditCard className="h-4 w-4" />
                  Credit / Debit Card
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-28 flex flex-col items-center gap-4 text-white/50">
          <Image src="/vaultx.png" alt="VaultX" width={104} height={104} />
          <p className="text-xs">
            © {new Date().getFullYear()} Vaultx. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}