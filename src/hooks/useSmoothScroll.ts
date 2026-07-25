import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "./useMotionPrefs";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker rather than its own RAF loop.
 *
 * Two things matter here and both are easy to get wrong:
 *  - ScrollTrigger must recompute on every Lenis frame, otherwise pinned
 *    sections drift out of sync with the virtual scroll position.
 *  - lagSmoothing(0) stops GSAP from "catching up" after a long frame, which
 *    would otherwise make a scrubbed timeline jump.
 *
 * Returns a ref to the Lenis instance so callers can read scroll velocity or
 * trigger programmatic scrolls.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Native scrolling is the honest behaviour when motion is unwelcome.
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: quick response, long settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch feels better than emulating it.
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links must go through Lenis or they fight the virtual scroll.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return lenisRef;
}
