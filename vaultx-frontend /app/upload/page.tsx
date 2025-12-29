"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { createPageEnterTl } from "@/lib/animations";
import UploadSurface from "@/components/UploadSurface";

export default function UploadPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pageRef.current) return;
    const tl = createPageEnterTl(pageRef.current);
    return () => tl?.kill();
  }, { scope: pageRef });

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[#050509]"
    >
      {/* Background */}
      <Image
        src="/upload.png"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.18]"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl space-y-10">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/vaultx.png"
              alt="Vaultx"
              width={120}
              height={36}
              priority
              className="opacity-95"
            />
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white">Upload</h1>
            <p className="mt-1 text-sm text-white/55">
              Move a file into market. Calm and deliberate.
            </p>
          </div>

          <UploadSurface />
        </div>
      </div>
    </div>
  );
}