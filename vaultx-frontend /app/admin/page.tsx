"use client";

import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import FileTable from "@/components/FileTable";
import StatsCard from "@/components/StatsCard";
import { Search, Shield, HardDrive, AlertTriangle } from "lucide-react";
import { createPageEnterTl, getDuration, prefersReducedMotion } from "@/lib/animations";
import gsap from "gsap";

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  downloads: number;
  earnings: number;
  uploadedAt: string;
  expiresAt?: string;
  status: "active" | "expired" | "removed";
}

export default function AdminPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cpmConfig, setCpmConfig] = useState({ rate: 2.5, enabled: true });
  const [totalBandwidth, setTotalBandwidth] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Global page enter animation
  useGSAP(() => {
    if (!pageRef.current) return;

    const pageEnterTl = createPageEnterTl(pageRef.current);
    return () => {
      pageEnterTl?.kill();
    };
  }, { scope: pageRef });

  // Admin data load animation
  useGSAP(() => {
    if (!contentRef.current || files.length === 0 || prefersReducedMotion()) return;

    const dataLoadTl = gsap.timeline();
    const elements = contentRef.current.children;

    dataLoadTl.from(elements, {
      y: 12,
      opacity: 0,
      duration: getDuration(0.5),
      stagger: 0.08,
      ease: "power3.out",
    });

    return () => {
      dataLoadTl.kill();
    };
  }, { scope: contentRef, dependencies: [files] });

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockFiles: File[] = [
      {
        id: "1",
        name: "presentation.pdf",
        size: 5242880,
        type: "application/pdf",
        downloads: 42,
        earnings: 0.084,
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
      {
        id: "2",
        name: "document.docx",
        size: 1048576,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        downloads: 18,
        earnings: 0.036,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "expired",
      },
      {
        id: "3",
        name: "image.jpg",
        size: 2097152,
        type: "image/jpeg",
        downloads: 156,
        earnings: 0.312,
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
      {
        id: "4",
        name: "video.mp4",
        size: 52428800,
        type: "video/mp4",
        downloads: 89,
        earnings: 0.178,
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
    ];

    setFiles(mockFiles);

    const total = mockFiles.reduce((sum, file) => sum + file.size * file.downloads, 0);
    setTotalBandwidth(total);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    setFiles(files.filter((file) => file.id !== id));
    // In production, call API to delete
  };

  const handleDisable = async (id: string) => {
    if (!confirm("Are you sure you want to disable this file?")) {
      return;
    }

    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, status: "removed" as const } : file
      )
    );
    // In production, call API to disable
  };

  const filteredFiles = files.filter(
    (file) =>
      file.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatBandwidth = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes < 1024 * 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
  };

  return (
    <div ref={pageRef} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div ref={contentRef} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-white/50">Internal moderation and system configuration</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-navy-primary/50 px-3 py-1.5">
            <Shield className="h-4 w-4 text-white/50" />
            <span className="text-xs text-white/50">Admin Access</span>
          </div>
        </div>

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Files"
            value={files.length}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatsCard
            title="Total Bandwidth"
            value={formatBandwidth(totalBandwidth)}
            icon={<HardDrive className="h-5 w-5" />}
          />
          <StatsCard
            title="Active Files"
            value={files.filter((f) => f.status === "active").length}
            icon={<Shield className="h-5 w-5" />}
          />
        </div>

        {/* CPM Configuration - Compact */}
        <div className="rounded-lg border border-white/[0.08] bg-navy-primary/50 p-6">
          <h2 className="mb-4 text-base font-semibold text-white">CPM Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">CPM Rate ($)</label>
              <input
                type="number"
                step="0.01"
                value={cpmConfig.rate}
                onChange={(e) => setCpmConfig({ ...cpmConfig, rate: parseFloat(e.target.value) })}
                className="w-full rounded-lg border border-white/[0.08] bg-navy-primary px-3 py-2 text-sm text-white focus:border-white/[0.12] focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all sm:max-w-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cpm-enabled"
                checked={cpmConfig.enabled}
                onChange={(e) => setCpmConfig({ ...cpmConfig, enabled: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-white/[0.08] bg-navy-primary text-white focus:ring-1 focus:ring-white/[0.12]"
              />
              <label htmlFor="cpm-enabled" className="text-xs text-white/70">
                Enable CPM monetization
              </label>
            </div>
            <p className="text-xs text-white/30">
              Note: This is a UI-only form. Actual CPM configuration would be managed via backend API.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by file ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-navy-primary/50 pl-10 pr-3 py-2 text-sm text-white placeholder-white/40 focus:border-white/[0.12] focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
          />
        </div>

        {/* Files Table */}
        <FileTable
          files={filteredFiles}
          onDelete={handleDelete}
          onDisable={handleDisable}
          showActions={true}
        />
      </div>
    </div>
  );
}
