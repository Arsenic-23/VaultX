"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({
  children,
  align = "end",
  className = "",
}: {
  children: ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={8}
        className={`z-50 min-w-[180px] rounded-xl border border-white/10 bg-navy-primary/95 p-1.5 shadow-xl backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 ${className}`}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  children,
  inset = false,
  className = "",
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Item
      {...props}
      className={`group relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 outline-none transition hover:bg-white/5 focus:bg-white/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 ${inset ? "pl-8" : ""} ${className}`}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={`px-3 py-2 text-xs uppercase tracking-[0.08em] text-white/40 ${className}`}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
}

export function DropdownMenuSeparator() {
  return <DropdownMenuPrimitive.Separator className="my-1 h-px bg-white/10" />;
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  ...props
}: DropdownMenuPrimitive.DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      {...props}
      checked={checked}
      className="relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 outline-none transition hover:bg-white/5 focus:bg-white/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
    >
      <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-white/20 bg-white/5">
        <Check className="h-3 w-3 text-white" />
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuSub({
  children,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSubProps) {
  return <DropdownMenuPrimitive.Sub {...props}>{children}</DropdownMenuPrimitive.Sub>;
}

export function DropdownMenuSubTrigger({
  children,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      {...props}
      className="group flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-white/80 outline-none transition hover:bg-white/5 focus:bg-white/5 data-[state=open]:bg-white/5"
    >
      {children}
      <ChevronRight className="h-4 w-4 text-white/40 group-data-[state=open]:rotate-90 transition" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent className="z-50 min-w-[180px] rounded-xl border border-white/10 bg-navy-primary/95 p-1.5 shadow-xl backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
        {children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  );
}


