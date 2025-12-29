"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  children,
  side = "top",
  align = "center",
  className = "",
}: {
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        align={align}
        sideOffset={6}
        className={`z-50 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-background shadow-lg backdrop-blur ${className}`}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-white/90" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}


