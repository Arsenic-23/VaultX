"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { createPageEnterTl, getDuration, prefersReducedMotion } from "@/lib/animations";
import gsap from "gsap";
import * as Form from "@radix-ui/react-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Global page enter animation
  useGSAP(() => {
    if (!pageRef.current) return;

    const pageEnterTl = createPageEnterTl(pageRef.current);
    return () => {
      pageEnterTl?.kill();
    };
  }, { scope: pageRef });

  // Card reveal animation
  useGSAP(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

    const cardTl = gsap.timeline({ delay: 0.2 });
    cardTl.from(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: getDuration(0.8),
      ease: "power3.out",
    });

    return () => {
      cardTl.kill();
    };
  }, { scope: cardRef });

  const handleContinueAnonymously = () => {
    router.push("/upload");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push("/upload");
  };

  return (
    <div
      ref={pageRef}
      className="flex min-h-screen items-center justify-center bg-[#050509] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div ref={cardRef} className="w-full max-w-md">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A1020]/90 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">Sign in</h1>
            <p className="mt-2 text-sm text-white/55">
              Purpose-built access to uploads, payouts, and link controls.
            </p>
          </div>

          {/* Email Form */}
          <Form.Root onSubmit={handleEmailSubmit} className="mb-6 space-y-4">
            <Form.Field name="email">
              <div className="mb-2 flex items-center justify-between">
                <Form.Label className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">
                  Work email
                </Form.Label>
                <Form.Message
                  match="valueMissing"
                  className="text-[11px] font-medium text-red-300/80"
                >
                  Email is required
                </Form.Message>
                <Form.Message
                  match="typeMismatch"
                  className="text-[11px] font-medium text-red-300/80"
                >
                  Enter a valid email
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@team.com"
                  className="w-full rounded-xl border border-white/[0.10] bg-[#050509] px-3 py-2.5 text-sm text-white placeholder-white/35 transition focus:border-[#5B8DEF]/40 focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]/45"
                />
              </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </Form.Submit>
          </Form.Root>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0A1020]/90 px-3 text-white/30">or</span>
            </div>
          </div>

          {/* Continue Anonymously */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleContinueAnonymously}
                className="w-full rounded-xl border border-white/[0.10] bg-[#050509] px-4 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/[0.16] hover:bg-white/[0.03] hover:text-white"
              >
                Continue anonymously
              </button>
            </TooltipTrigger>
            <TooltipContent align="center">
              Upload without an account and claim it later.
            </TooltipContent>
          </Tooltip>

          {/* Footer Note */}
          <p className="mt-6 text-center text-xs text-white/35">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-white/50 hover:text-white/70 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-white/50 hover:text-white/70 underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/50 transition-colors hover:text-white/70"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

