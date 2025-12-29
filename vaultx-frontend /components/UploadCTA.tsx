"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as Form from "@radix-ui/react-form";

import ProgressBar from "@/components/ProgressBar";
import { X } from "lucide-react";
import { prefersReducedMotion, getDuration } from "@/lib/animations";

type Props = {
  file: File;
  onCancel: () => void;
  onSuccess: (downloadPage: string) => void;
  onError: () => void;
};

const API_BASE =
  process.env.VAULTX_BACKEND_URL ?? "http://localhost:3001";

export default function UploadCTA({
  file,
  onCancel,
  onSuccess,
  onError,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileCardRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatSize = (b: number) =>
    b < 1024
      ? `${b} B`
      : b < 1024 ** 2
      ? `${(b / 1024).toFixed(2)} KB`
      : `${(b / 1024 ** 2).toFixed(2)} MB`;

  const handleUpload = async () => {
    if (isUploading) return;

    if (fileCardRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        fileCardRef.current,
        { y: 0 },
        {
          y: -10,
          duration: getDuration(0.45),
          ease: "power3.out",
          yoyo: true,
          repeat: 1,
        }
      );
    }

    setIsUploading(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + 7));
    }, 180);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (!data?.slug) throw new Error();

      if (intervalRef.current) clearInterval(intervalRef.current);

      setProgress(100);
      setIsUploading(false);

      onSuccess(data.downloadPage ?? `/v/${data.slug}`);
    } catch {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsUploading(false);
      onError();
    }
  };

  return (
    <Form.Root
      onSubmit={(e) => {
        e.preventDefault();
        handleUpload();
      }}
      className="space-y-6"
    >
      <div
        ref={fileCardRef}
        className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur"
      >
        <div className="flex justify-between">
          <div>
            <p className="truncate text-sm font-semibold text-white">
              {file.name}
            </p>
            <p className="text-xs text-white/55">
              {formatSize(file.size)} • {file.type || "File"}
            </p>
          </div>

          {!isUploading && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-white/40 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isUploading && (
        <>
          <div className="flex justify-between text-sm text-white/60">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </>
      )}

      {!isUploading && (
        <Form.Submit asChild>
          <button className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-[1px] hover:shadow-lg">
            Upload file
          </button>
        </Form.Submit>
      )}

      {isUploading && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-white/10 bg-[#050509] px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5"
        >
          Cancel upload
        </button>
      )}
    </Form.Root>
  );
}