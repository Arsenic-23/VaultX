"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDuration, prefersReducedMotion } from "@/lib/animations";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const modalTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!overlayRef.current || !contentRef.current || prefersReducedMotion()) return;

    modalTlRef.current = gsap.timeline({ paused: true });

    // Open animation
    modalTlRef.current.to(overlayRef.current, {
      opacity: 1,
      duration: getDuration(0.3),
      ease: "power3.out",
    });
    modalTlRef.current.from(
      contentRef.current,
      {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: getDuration(0.3),
        ease: "power3.out",
      },
      "<0.1"
    );

    return () => {
      modalTlRef.current?.kill();
    };
  }, { scope: overlayRef });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (modalTlRef.current) {
        modalTlRef.current.play();
      }
    } else {
      if (modalTlRef.current) {
        modalTlRef.current.reverse().then(() => {
          document.body.style.overflow = "";
        });
      } else {
        document.body.style.overflow = "";
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div
        ref={contentRef}
        className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg border border-white/10 bg-navy-primary p-6 shadow-xl"
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
