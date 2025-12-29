"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CountdownTimer from "@/components/CountdownTimer";
import AdSlot from "@/components/AdSlot";
import { Download, AlertCircle } from "lucide-react";
import {
  createPageEnterTl,
  getDuration,
  prefersReducedMotion,
} from "@/lib/animations";

interface FileData {
  name: string;
  size: number;
  status: "active" | "expired" | "removed";
}

const API_BASE =
  process.env.VAULTX_BACKEND_URL ?? "http://localhost:3001";

export default function DownloadPage() {
  const params = useParams();
  const slug = params.id as string;

  const [file, setFile] = useState<FileData | null>(null);
  const [countdownComplete, setCountdownComplete] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pageRef.current) return;

    const tl = createPageEnterTl(pageRef.current);
    if (!tl) return;

    return () => {
      tl.kill();
    };
  }, []);

  useGSAP(() => {
    if (!contentCardRef.current || !file || prefersReducedMotion()) return;

    gsap.fromTo(
      contentCardRef.current,
      { opacity: 0, y: 24, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: getDuration(0.6),
        ease: "power3.out",
      }
    );
  }, [file]);

  useEffect(() => {
    let mounted = true;

    const fetchMeta = async () => {
      try {
        const res = await fetch(`${API_BASE}/file/${slug}`);

        if (!res.ok) {
          if (mounted) {
            setFile({ name: "", size: 0, status: "removed" });
          }
          return;
        }

        const data = await res.json();

        if (mounted) {
          setFile({
            name: data.filename,
            size: data.size,
            status: "active",
          });
        }
      } catch {
        if (mounted) {
          setFile({ name: "", size: 0, status: "removed" });
        }
      }
    };

    fetchMeta();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleDownload = () => {
    if (!countdownComplete || !file || file.status !== "active") return;
    window.location.href = `${API_BASE}/download/${slug}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  };

  if (!file) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/40">
        Loading…
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-background"
      style={{
        backgroundImage: "url(/download.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative hidden min-h-screen grid-cols-12 gap-6 px-6 py-10 lg:grid">
        <div className="col-span-3 space-y-4">
          <AdSlot label="Ad" className="min-h-[220px]" />
          <AdSlot label="Ad" className="min-h-[180px]" />
        </div>

        <div className="col-span-6 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {file.status === "active" ? (
              <div
                ref={contentCardRef}
                className="space-y-6 rounded-3xl border border-white/[0.08] bg-navy-primary/70 p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              >
                <div>
                  <h1 className="truncate text-lg font-semibold text-white">
                    {file.name}
                  </h1>
                  <p className="text-xs text-white/55">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {!countdownComplete && (
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6">
                    <CountdownTimer
                      duration={7}
                      onComplete={() => setCountdownComplete(true)}
                    />
                  </div>
                )}

                {countdownComplete && (
                  <button
                    onClick={handleDownload}
                    className="group w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download File
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/[0.08] bg-navy-primary/70 p-8 backdrop-blur-xl">
                <div className="flex gap-3">
                  <AlertCircle className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      File unavailable
                    </p>
                    <p className="text-xs text-white/50">
                      This file no longer exists.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 space-y-4">
          <AdSlot label="Ad" className="min-h-[220px]" />
          <AdSlot label="Ad" className="min-h-[180px]" />
        </div>
      </div>
    </div>
  );
}
