import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";

const ITEMS = [
  "OpenVINO",
  "YOLO",
  "TensorRT",
  "PyTorch",
  "Quantization",
  "RTSP",
  "Edge Inference",
  "ANPR",
  "ATCC",
  "OpenCV",
  "C++",
  "Python",
];

/**
 * Infinite marquee whose speed and direction respond to scroll.
 *
 * Implemented with a modifiers-plugin wrap rather than duplicated keyframes:
 * x is wrapped into a single copy's width, so two copies are enough for a
 * seamless loop at any width. Scroll velocity is folded into the time scale, so
 * the band accelerates as the visitor scrolls and reverses when they scroll up —
 * the detail that makes it feel reactive rather than decorative.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const track = el.querySelector<HTMLElement>(".marquee-track");
    if (!track) return;

    const ctx = gsap.context(() => {
      // Half the track is one full copy of the item list.
      const half = track.scrollWidth / 2;

      const tween = gsap.to(track, {
        x: -half,
        duration: 22,
        ease: "none",
        repeat: -1,
      });

      let lastY = window.scrollY;
      let idleTimer = 0;

      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;

        // Direction follows scroll direction; magnitude adds a speed boost.
        const boost = gsap.utils.clamp(-6, 6, delta * 0.35);
        tween.timeScale(boost === 0 ? 1 : boost);

        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true });
        }, 120);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.clearTimeout(idleTimer);
      };
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="hairline border-b border-border py-6 overflow-hidden select-none"
    >
      <div className="marquee-track">
        {/* Two copies: the tween wraps at exactly one copy's width. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {ITEMS.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="type-h3 whitespace-nowrap px-6 text-text-faint">{item}</span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
