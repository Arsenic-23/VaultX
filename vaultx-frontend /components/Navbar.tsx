"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LogIn } from "lucide-react";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const appPrefixes = [
    "/dashboard",
    "/vault",
    "/upload",
    "/file",
    "/d",
    "/settings",
    "/admin",
    "/signin",
  ];

  const hideNav = appPrefixes.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  /* Entrance animation */
  useGSAP(
    () => {
      if (!navRef.current || prefersReducedMotion() || hideNav) return;

      gsap.fromTo(
        navRef.current,
        { y: -14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: getDuration(0.8),
          ease: "power3.out",
        }
      );
    },
    { scope: navRef, dependencies: [hideNav] }
  );

  /* Hide on scroll */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      const goingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      if (!navRef.current) return;

      gsap.to(navRef.current, {
        y: goingDown && currentY > 80 ? -72 : 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hideNav) return null;

  return (
    <nav
      ref={navRef}
      className={[
        "sticky top-0 z-40 overflow-hidden transition-colors duration-300",
        scrolled
          ? "shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          : "",
      ].join(" ")}
      style={{
        backgroundImage: "url(/navbar.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark glass overlay (keeps text readable) */}
      <div
        className={[
          "absolute inset-0",
          scrolled
            ? "bg-black/55 backdrop-blur-2xl"
            : "bg-black/35 backdrop-blur-xl",
        ].join(" ")}
      />

      {/* Glass edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06]">
          {/* LOGO */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center"
            aria-label="Go home"
          >
            <div className="relative h-8 w-8">
              <Image
                src="/vaultx.png"
                alt="VaultX"
                fill
                priority
                className="object-contain"
              />
            </div>
          </button>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">
            {/* SIGN IN */}
            <button
              onClick={() => router.push("/signin")}
              className="
                inline-flex items-center gap-1.5
                text-sm font-medium text-white/80
                transition-colors
                hover:text-white
              "
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </button>

            {/* PREMIUM */}
            <button
              onClick={() => router.push("/premiumvault")}
              className="
                inline-flex h-8 items-center gap-2
                rounded-full px-3
                border border-white/[0.18]
                bg-white/[0.06]
                text-xs font-medium text-white/90
                backdrop-blur-xl
                transition-colors
                hover:border-white/[0.28]
                hover:text-white
              "
            >
              <div className="relative h-4 w-4 shrink-0">
                <Image
                  src="/vaultx.png"
                  alt="VaultX"
                  fill
                  className="object-contain"
                />
              </div>
              <span>Premium</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}