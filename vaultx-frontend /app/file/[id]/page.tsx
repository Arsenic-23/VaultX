"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Copy, Trash2, Download, Clock, DollarSign } from "lucide-react";
import Toast from "@/components/Toast";
import { createPageEnterTl, getDuration, prefersReducedMotion } from "@/lib/animations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  downloads: number;
  earnings: number;
  uploadedAt: string;
  expiresAt: string;
  status: "active" | "expired" | "removed";
}

export default function FileDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.id as string;
  const [file, setFile] = useState<FileData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Global page enter animation
  useGSAP(() => {
    if (!pageRef.current) return;

    const pageEnterTl = createPageEnterTl(pageRef.current);
    return () => {
      pageEnterTl?.kill();
    };
  }, { scope: pageRef });

  // Stats reveal timeline
  useGSAP(() => {
    if (!statsRef.current || !file || prefersReducedMotion()) return;

    const statsRevealTl = gsap.timeline();
    const cards = statsRef.current.children;

    statsRevealTl.from(cards, {
      y: 15,
      opacity: 0,
      duration: getDuration(0.6),
      stagger: 0.1,
      ease: "power3.out",
    });

    return () => {
      statsRevealTl.kill();
    };
  }, { scope: statsRef, dependencies: [file] });

  useEffect(() => {
    // Mock file data - in production, fetch from API
    const mockFile: FileData = {
      id: fileId,
      name: "example-file.pdf",
      size: 5242880, // 5MB
      type: "application/pdf",
      downloads: 42,
      earnings: 0.084,
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    };
    setFile(mockFile);

    // Calculate time remaining
    const updateTimeRemaining = () => {
      if (mockFile.expiresAt) {
        const now = new Date().getTime();
        const expiry = new Date(mockFile.expiresAt).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeRemaining("Expired");
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [fileId]);

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/d/${fileId}`;
    navigator.clipboard.writeText(shareLink);
    setToast({ message: "Link copied to clipboard!", type: "success" });
  };

  const handleDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setToast({ message: "File deleted successfully", type: "success" });
      setConfirmDeleteOpen(false);
      router.push("/dashboard");
    } catch (error) {
      setToast({ message: "Failed to delete file", type: "error" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (!file) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-white/40">Loading file details...</div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">File Details</h1>
            <p className="mt-1 text-sm text-white/50">Manage your uploaded file</p>
          </div>
          {file.status === "active" && (
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-navy-primary/50 px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-white/[0.12] hover:bg-navy-primary/70 hover:text-white/90">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete file?</DialogTitle>
                  <DialogDescription>
                    This removes the link, disables downloads, and clears earnings for this file.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(false)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/16 hover:bg-white/5"
                  >
                    Keep file
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-background transition hover:bg-white/95"
                  >
                    Delete
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* File Info - Compact */}
        <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">File Name</label>
              <p className="mt-1.5 text-base font-semibold text-white truncate">{file.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Size</label>
                <p className="mt-1.5 text-sm text-white/90">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Type</label>
                <p className="mt-1.5 text-sm text-white/90">{file.type.split('/')[1]?.toUpperCase() || file.type}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Status</label>
                <p className="mt-1.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      file.status === "active"
                        ? "bg-white/[0.08] text-white/90"
                        : file.status === "expired"
                        ? "bg-white/[0.05] text-white/60"
                        : "bg-white/[0.05] text-white/50"
                    }`}
                  >
                    {file.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Uploaded</label>
                <p className="mt-1.5 text-sm text-white/90">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Compact */}
        <div ref={statsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-navy-primary/50">
                <Download className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Downloads</p>
                <p className="mt-0.5 text-xl font-bold text-white">{file.downloads}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-navy-primary/50">
                <DollarSign className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Earnings</p>
                <p className="mt-0.5 text-xl font-bold text-white">${file.earnings.toFixed(4)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-navy-primary/50">
                <Clock className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Expires In</p>
                <p className="mt-0.5 text-xl font-bold text-white">{timeRemaining}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Section - Compact */}
        {file.status === "active" && (
          <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-6">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Share Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/d/${fileId}`}
                className="flex-1 rounded-lg border border-white/[0.08] bg-navy-primary px-3 py-2 text-xs text-white/90 focus:border-white/[0.12] focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-background transition-all hover:bg-white/95"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  Copy a clean recipient link
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Warning States */}
        {file.status === "expired" && (
          <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-5">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-white/50 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white/90">File Expired</h3>
                <p className="mt-1 text-xs text-white/50">
                  This file has expired and is no longer available for download.
                </p>
              </div>
            </div>
          </div>
        )}

        {file.status === "removed" && (
          <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-5">
            <div className="flex items-start gap-3">
              <Trash2 className="h-4 w-4 text-white/50 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white/90">File Removed</h3>
                <p className="mt-1 text-xs text-white/50">
                  This file has been removed and is no longer available.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
