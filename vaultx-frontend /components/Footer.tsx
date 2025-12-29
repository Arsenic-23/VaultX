"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as Separator from "@radix-ui/react-separator";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const pathname = usePathname();

  const appPrefixes = [
    "/dashboard",
    "/vault",
    "/premium",
    "/upload",
    "/file",
    "/d",
    "/settings",
    "/admin",
    "/signin",
  ];

  const hideFooter = appPrefixes.some((prefix) => pathname?.startsWith(prefix));

  useGSAP(
    () => {
      if (!footerRef.current || prefersReducedMotion() || hideFooter) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            gsap.fromTo(
              footerRef.current,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: getDuration(0.6), ease: "power3.out" }
            );

            if (textRef.current) {
              const text = textRef.current.dataset.text ?? "";
              const state = { count: 0 };
              textRef.current.textContent = "";

              gsap.to(state, {
                count: text.length,
                duration: getDuration(1.2),
                ease: "none",
                onUpdate() {
                  textRef.current!.textContent = text.slice(0, Math.floor(state.count));
                },
              });
            }

            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(footerRef.current);

      return () => observer.disconnect();
    },
    { scope: footerRef, dependencies: [hideFooter] }
  );

  if (hideFooter) return null;

  return (
    <footer ref={footerRef} className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center">
              <Image
                src="/vaultx.png"
                alt="VaultX"
                width={28}
                height={28}
                className="rounded-md"
                priority
              />
            </div>
            <p
              ref={textRef}
              data-text="Upload once. Lock access. Share a link. Earn from controlled view."
              className="min-h-[1.25rem] max-w-md text-sm text-white/50"
            />
          </div>
          <nav className="text-xs text-white/45">
            <Link href="/dashboard" className="transition-colors hover:text-white/70">
              Dashboard
            </Link>
          </nav>
        </div>

        <Separator.Root className="my-4 h-px w-full bg-white/5" />

        <div className="flex items-center justify-between text-[11px] text-white/30">
          <span>© {new Date().getFullYear()} VaultX</span>
          <span>Controlled links. Measured access. Monetized delivery.</span>
        </div>
      </div>
    </footer>
  );
}
