"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

/* -------------------- OVERLAY (THIS IS THE FIX) -------------------- */
export function DialogOverlay({ className = "" }: { className?: string }) {
  return (
    <DialogPrimitive.Overlay
      className={`
        fixed inset-0 z-40
        bg-black/70 backdrop-blur-sm
        transition-opacity
        data-[state=closed]:opacity-0
        data-[state=closed]:pointer-events-none
        data-[state=open]:opacity-100
        ${className}
      `}
    />
  );
}

/* -------------------- CONTENT -------------------- */
export function DialogContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        className={`
          fixed left-1/2 top-1/2 z-50
          w-[90vw] max-w-lg
          -translate-x-1/2 -translate-y-1/2
          rounded-2xl border border-white/10
          bg-[#050509]
          p-6 shadow-2xl
          outline-none
          pointer-events-auto
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:fade-in
          data-[state=open]:zoom-in-90
          data-[state=closed]:fade-out
          data-[state=closed]:zoom-out-90
          ${className}
        `}
      >
        {children}

        <DialogPrimitive.Close asChild>
          <button
            aria-label="Close dialog"
            className="absolute right-3 top-3 inline-flex h-9 w-9
              items-center justify-center rounded-full
              border border-white/10 bg-white/5
              text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/* -------------------- OPTIONAL HELPERS -------------------- */
export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4 space-y-1.5">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <DialogPrimitive.Title className="text-lg font-semibold text-white">
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <DialogPrimitive.Description className="text-sm text-white/60">
      {children}
    </DialogPrimitive.Description>
  );
}