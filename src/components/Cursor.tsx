import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";

/**
 * Custom cursor: a small ring that trails the pointer and expands over
 * interactive elements, with a label slot for contextual hints.
 *
 * Position is driven by gsap.quickTo, which reuses a single tween instance
 * instead of allocating one per mousemove — the difference is visible on a
 * 120 Hz pointer. Nothing here touches React state, so moving the mouse never
 * triggers a render.
 *
 * Pointer-device only: touch users get the native behaviour, and the CSS that
 * hides the system cursor is gated behind a body attribute this component sets,
 * so a failure to mount can never leave the page cursor-less.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    document.body.dataset.cursor = "on";
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.14, ease: "power3.out" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.14, ease: "power3.out" });
    // The ring lags further behind, which is what produces the trailing feel.
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3.out" });

    let shown = false;
    const onMove = (event: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dotEl, ringEl], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const INTERACTIVE = 'a, button, [role="tab"], [data-cursor-grow]';

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest?.(INTERACTIVE);
      if (!target) return;
      gsap.to(ringEl, { scale: 2.6, borderColor: "var(--accent)", duration: 0.4, ease: "power3.out" });
      gsap.to(dotEl, { scale: 0.3, duration: 0.4, ease: "power3.out" });
    };

    const onOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest?.(INTERACTIVE);
      if (!target) return;
      gsap.to(ringEl, { scale: 1, borderColor: "var(--border-bright)", duration: 0.4, ease: "power3.out" });
      gsap.to(dotEl, { scale: 1, duration: 0.4, ease: "power3.out" });
    };

    const onLeaveWindow = () => gsap.to([dotEl, ringEl], { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{ visibility: "hidden" }}
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border"
        style={{ borderColor: "var(--border-bright)", visibility: "hidden" }}
      />
    </div>
  );
}
