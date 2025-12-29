"use client";

import { useCallback, useState, useRef, DragEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export default function UploadDropzone({
  onFileSelect,
  maxSize = 100 * 1024 * 1024, // 100MB default
  acceptedTypes = ["*"],
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const dragTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!dropzoneRef.current || prefersReducedMotion()) return;

    // Create timeline for drag enter - subtle
    dragTlRef.current = gsap.timeline({ paused: true });
    dragTlRef.current.to(dropzoneRef.current, {
      scale: 1.01,
      duration: getDuration(0.3),
      ease: "power2.out",
    });

    return () => {
      dragTlRef.current?.kill();
    };
  }, { scope: dropzoneRef });

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`;
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [maxSize, onFileSelect]
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging && dragTlRef.current) {
      setIsDragging(true);
      dragTlRef.current.play();
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging && dragTlRef.current) {
      setIsDragging(false);
      dragTlRef.current.reverse();
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragTlRef.current) {
      dragTlRef.current.reverse();
    }
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      ref={dropzoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-lg border-2 border-dashed p-16 text-center transition-all
        ${
          isDragging
            ? "border-white/[0.12] bg-navy-primary/70"
            : "border-white/[0.08] bg-navy-primary/50 hover:border-white/[0.10] hover:bg-navy-primary/60"
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept={acceptedTypes.join(",")}
      />

      <div className="space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-white/[0.05] p-5">
          <svg
            className="h-full w-full text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div>
          <p className="text-xl font-medium text-white">
            {isDragging ? "Drop your file here" : "Drag & drop your file"}
          </p>
          <p className="mt-3 text-sm text-white/50">
            or click to browse from your device
          </p>
          <p className="mt-4 text-xs text-white/40">
            Max size: {(maxSize / (1024 * 1024 * 1024)).toFixed(0)}GB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400/90">
          {error}
        </div>
      )}
    </div>
  );
}
