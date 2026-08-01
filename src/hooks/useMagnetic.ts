import { useEffect, type RefObject } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "./useMotionPrefs";

/**
 * Magnetic pull: elements matching `selector` inside `rootRef` lean toward the
 * pointer while it is over them and spring back when it leaves.
 *
 * Bound by delegation from a single effect rather than per-button state, and
 * driven by gsap.quickTo so a pointermove reuses one tween instance instead of
 * allocating one per event — the same reason Cursor.tsx uses it.
 *
 * Only x and y are touched, so an intro timeline animating yPercent on the same
 * element composes with the pull instead of fighting it.
 *
 * Skipped entirely for coarse pointers (there is no hover to lean into) and
 * when reduced motion is requested.
 */
export function useMagnetic(
  rootRef: RefObject<HTMLElement | null>,
  selector: string,
  strength = 0.3,
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const rootEl = rootRef.current;
    if (!rootEl) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cleanups: Array<() => void> = [];

    rootEl.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const toX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const toY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        toX((event.clientX - (rect.left + rect.width / 2)) * strength);
        toY((event.clientY - (rect.top + rect.height / 2)) * strength);
      };

      // Release on leave and on blur, so a keyboard user tabbing away never
      // leaves a button parked off its own centre.
      const release = () => {
        toX(0);
        toY(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", release);
      el.addEventListener("blur", release);

      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", release);
        el.removeEventListener("blur", release);
        gsap.set(el, { x: 0, y: 0 });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [reduced, rootRef, selector, strength]);
}
