"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  House,
  Vault,
  CurrencyCircleDollar,
  Gear,
  SignOut,
  List,
  User,
} from "@phosphor-icons/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import gsap from "gsap";

interface AnalyticsShellProps {
  title: string;
  subtitle?: string;
  actionLabel: string;
  onAction?: () => void;
  timeRange: string;
  onTimeRangeChange: (v: string) => void;
  timeRanges: { value: string; label: string }[];
  children: ReactNode;
  headerHint?: ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", icon: House },
  { href: "/vault", icon: Vault },
  { href: "/premium", icon: CurrencyCircleDollar },
  { href: "/settings", icon: Gear },
];

function NavItem({
  href,
  icon: Icon,
  active,
}: {
  href: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative flex h-10 w-10 items-center justify-center rounded-md
                 transition-all duration-200
                 hover:bg-white/[0.03]
                 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
    >
      <span
        className={`absolute -left-4 w-px bg-white/80 transition-all duration-300
          ${active ? "h-[18px] opacity-100" : "h-0 opacity-0"}`}
      />

      <Icon
        size={20}
        weight={active ? "fill" : "regular"}
        className={active ? "text-[#5B8DEF]" : "text-white/45"}
      />
    </Link>
  );
}

export default function AnalyticsShell({
  title,
  subtitle,
  actionLabel,
  onAction,
  timeRange,
  onTimeRangeChange,
  timeRanges,
  children,
  headerHint,
}: AnalyticsShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  /* Header glass effect */
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      headerRef.current.classList.toggle(
        "bg-[#050509]/75",
        window.scrollY > 6
      );
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Smooth logo navigation */
  const navigateHome = () => {
    gsap.to([sidebarRef.current, headerRef.current], {
      opacity: 0,
      duration: 0.18,
      ease: "power2.inOut",
      onComplete: () => router.push("/"),
    });
  };

  return (
    <div className="flex min-h-screen bg-[#050509] text-white">
      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 z-30 hidden h-screen w-[72px]
                   flex-col border-r border-white/[0.04]
                   bg-[#020308] md:flex"
      >
        <button
          onClick={navigateHome}
          className="mt-6 flex justify-center"
          aria-label="Go to landing page"
        >
          <div className="relative h-8 w-8">
            <Image
              src="/vaultx.png"
              alt="VaultX"
              fill
              className="object-contain"
              priority
            />
          </div>
        </button>

        <div className="flex flex-1 items-center justify-center">
          <nav className="flex flex-col items-center gap-3">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                active={pathname.startsWith(item.href)}
              />
            ))}
          </nav>
        </div>

        <div className="mb-6 flex justify-center">
          <button
            onClick={() => router.push("/signin")}
            className="flex h-9 w-9 items-center justify-center
                       rounded-md text-white/35
                       hover:bg-white/[0.03]"
            aria-label="Sign out"
          >
            <SignOut size={18} />
          </button>
        </div>
      </aside>

      {/* MOBILE NAV */}
      {mobileNavOpen && (
        <Dialog open onOpenChange={setMobileNavOpen}>
          <DialogContent
            className="left-0 top-0 h-screen w-[72px] rounded-none
                       border-r border-white/10 bg-[#020308] p-4"
          >
            <div className="flex h-full flex-col items-center">
              <button
                onClick={navigateHome}
                className="mt-6 relative h-8 w-8"
              >
                <Image
                  src="/vaultx.png"
                  alt="VaultX"
                  fill
                  className="object-contain"
                  priority
                />
              </button>

              <div className="flex flex-1 items-center justify-center">
                <nav className="flex flex-col items-center gap-3">
                  {NAV_ITEMS.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      active={pathname.startsWith(item.href)}
                    />
                  ))}
                </nav>
              </div>

              <button
                onClick={() => router.push("/signin")}
                className="mb-4 text-white/35"
              >
                <SignOut size={18} />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MAIN */}
      <div className="ml-[72px] flex flex-1 flex-col">
        <header
          ref={headerRef}
          className="sticky top-0 z-20 border-b border-white/[0.04]
                     backdrop-blur-xl transition-colors"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center
                           rounded-md border border-white/10 bg-black text-white/70"
              >
                <List size={18} />
              </button>

              <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-white/45">{subtitle}</p>
                )}
              </div>

              {headerHint}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
                className="rounded-md bg-black/40 px-2 py-1
                           text-sm text-white/70 outline-none"
              >
                {timeRanges.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <button
                onClick={onAction}
                className="rounded-md bg-white px-3 py-1.5
                           text-sm font-semibold text-black"
              >
                {actionLabel}
              </button>

              <button
                onClick={() => router.push("/settings")}
                className="hidden sm:flex h-9 w-9 items-center justify-center
                           rounded-full border border-white/10
                           bg-black text-white/70"
              >
                <User size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}