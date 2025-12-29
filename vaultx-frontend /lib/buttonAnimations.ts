import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "./animations";

/**
 * Hook for button micro-interactions
 */
export function useButtonAnimations() {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);
  const clickTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!buttonRef.current || prefersReducedMotion()) return;

    // Hover animation
    hoverTlRef.current = gsap.timeline({ paused: true });
    hoverTlRef.current.to(buttonRef.current, {
      scale: 1.04,
      duration: getDuration(0.2),
      ease: "power1.out",
    });

    // Click animation
    clickTlRef.current = gsap.timeline({ paused: true });
    clickTlRef.current.to(buttonRef.current, {
      scale: 0.97,
      duration: getDuration(0.1),
    });
    clickTlRef.current.to(buttonRef.current, {
      scale: 1.04,
      duration: getDuration(0.1),
    });
    clickTlRef.current.to(buttonRef.current, {
      scale: 1,
      duration: getDuration(0.1),
    });

    return () => {
      hoverTlRef.current?.kill();
      clickTlRef.current?.kill();
    };
  }, { scope: buttonRef });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || prefersReducedMotion()) return;

    const handleMouseEnter = () => {
      hoverTlRef.current?.play();
    };

    const handleMouseLeave = () => {
      hoverTlRef.current?.reverse();
    };

    const handleMouseDown = () => {
      clickTlRef.current?.restart();
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mousedown", handleMouseDown);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return buttonRef;
}

