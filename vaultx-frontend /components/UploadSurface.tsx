"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import UploadDropzone from "@/components/UploadDropzone";
import Toast from "@/components/Toast";
import UploadCTA from "@/components/UploadCTA";

import { Check } from "lucide-react";
import { prefersReducedMotion, getDuration } from "@/lib/animations";

export default function UploadSurface() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  /* Card entrance */
  useGSAP(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.98, y: 12 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: getDuration(0.6),
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Background */}
        <Image
          src="/upload1.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.25]"
        />

        {/* Glass */}
        <div className="relative z-10 rounded-3xl bg-[#0A1020]/75 p-8 backdrop-blur-2xl">
          {!selectedFile && !isSuccess && (
            <UploadDropzone
              onFileSelect={setSelectedFile}
              maxSize={5 * 1024 * 1024 * 1024}
              acceptedTypes={[]}
            />
          )}

          {selectedFile && !isSuccess && (
            <UploadCTA
              file={selectedFile}
              onCancel={() => setSelectedFile(null)}
              onSuccess={(downloadPage) => {
                setIsSuccess(true);
                setToast({
                  message: "File uploaded successfully",
                  type: "success",
                });
                setTimeout(() => router.push(downloadPage), 1200);
              }}
              onError={() =>
                setToast({
                  message: "Upload failed. Please try again.",
                  type: "error",
                })
              }
            />
          )}

          {isSuccess && (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                <Check className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Upload complete</p>
              <p className="text-sm text-white/55">Redirecting…</p>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}
