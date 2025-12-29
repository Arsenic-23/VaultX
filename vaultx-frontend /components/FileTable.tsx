"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MoreHorizontal } from "lucide-react";

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

interface FileTableProps {
  files: File[];
  onDelete?: (id: string) => void;
  onDisable?: (id: string) => void;
  showActions?: boolean;
  variant?: "default" | "minimal";
}

export default function FileTable({
  files,
  onDelete,
  onDisable,
  showActions = true,
  variant = "default",
}: FileTableProps) {
  const isMinimal = variant === "minimal";
  const [sorting, setSorting] = useState<SortingState>([{ id: "uploadedAt", desc: true }]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = useMemo<ColumnDef<File, any>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div
            className={`max-w-[220px] truncate text-sm ${
              isMinimal ? "text-white/90" : "text-white"
            }`}
          >
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
          <span className="text-xs text-white/60">{formatSize(row.original.size)}</span>
        ),
      },
      {
        accessorKey: "downloads",
        header: "Downloads",
        cell: ({ getValue }) => (
          <span className="text-xs text-white/60">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "earnings",
        header: "Earnings",
        cell: ({ getValue }) => (
          <span className="text-xs font-semibold text-white">${getValue<number>().toFixed(4)}</span>
        ),
      },
      {
        accessorKey: "uploadedAt",
        header: "Uploaded",
        cell: ({ row }) => (
          <span className="text-xs text-white/60">{formatDate(row.original.uploadedAt)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<File["status"]>();
          const copy =
            status === "active"
              ? "Active — earning from downloads"
              : status === "expired"
              ? "Expired — downloads blocked"
              : "Removed — disabled by admin";
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                    isMinimal
                      ? status === "active"
                        ? "bg-[#5B8DEF1A] text-[#C7D6FF]"
                        : "bg-white/[0.04] text-white/55"
                      : status === "active"
                      ? "bg-emerald-400/10 text-emerald-200"
                      : status === "expired"
                      ? "bg-amber-400/10 text-amber-100"
                      : "bg-white/[0.05] text-white/60"
                  }`}
                >
                  {status}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {copy}
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      ...(showActions
        ? [
            {
              id: "actions",
              header: "",
              cell: ({ row }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="File actions"
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/16 hover:text-white ${
                        isMinimal ? "opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100" : ""
                      }`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>{row.original.type}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {onDelete && (
                      <DropdownMenuItem onSelect={() => onDelete(row.original.id)}>
                        Delete
                      </DropdownMenuItem>
                    )}
                    {onDisable && row.original.status === "active" && (
                      <DropdownMenuItem onSelect={() => onDisable(row.original.id)}>
                        Disable link
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            } as ColumnDef<File>,
          ]
        : []),
    ];
  }, [onDelete, onDisable, showActions]);

  const table = useReactTable({
    data: files,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={
        isMinimal
          ? "overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#050509]/70 shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
          : "overflow-x-auto rounded-lg border border-white/[0.08] bg-navy-primary/50"
      }
    >
      <table className="w-full text-left">
        <thead className={isMinimal ? "border-b border-white/[0.04]" : ""}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] ${
                      isMinimal ? "text-white/35" : "text-white/50"
                    }`}
                  >
                    <button
                      className={`inline-flex items-center gap-1 transition ${
                        canSort ? "cursor-pointer hover:text-white/80" : "cursor-default"
                      }`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sortDir === "asc" && <span className="text-[10px] text-white/40">▲</span>}
                      {sortDir === "desc" && <span className="text-[10px] text-white/40">▼</span>}
                    </button>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={isMinimal ? "" : "divide-y divide-white/[0.06]"}>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={
                isMinimal
                  ? "group transition-colors hover:bg-white/[0.03]"
                  : "transition-colors hover:bg-white/[0.03]"
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-4 py-3 align-middle ${
                    isMinimal ? "border-none" : ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {files.length === 0 && (
        <div className="p-12 text-center text-sm text-white/40">No files found</div>
      )}
    </div>
  );
}
