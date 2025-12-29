import gsap from "gsap";

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

/**
 * Get animation duration with mobile reduction
 */
export const getDuration = (baseDuration: number): number => {
  if (prefersReducedMotion()) return 0;
  if (isMobile()) return baseDuration * 0.7;
  return baseDuration;
};

/**
 * Global page enter animation - slower, more elegant
 */
export const createPageEnterTl = (container: HTMLElement | null): gsap.core.Timeline | null => {
  if (!container || prefersReducedMotion()) return null;

  const tl = gsap.timeline();
  tl.from(container, {
    opacity: 0,
    y: 8,
    duration: getDuration(0.8),
    ease: "power3.out",
  });

  return tl;
};

/**
 * Button hover animation - subtle, elegant
 */
export const createButtonHoverTl = (button: HTMLElement): gsap.core.Timeline => {
  const tl = gsap.timeline({ paused: true });
  tl.to(button, {
    scale: 1.01,
    duration: getDuration(0.3),
    ease: "power2.out",
  });
  return tl;
};

/**
 * Button click animation - subtle
 */
export const createButtonClickTl = (button: HTMLElement): gsap.core.Timeline => {
  const tl = gsap.timeline();
  tl.to(button, {
    scale: 0.98,
    duration: getDuration(0.15),
  });
  tl.to(button, {
    scale: 1,
    duration: getDuration(0.15),
    ease: "power2.out",
  });
  return tl;
};

