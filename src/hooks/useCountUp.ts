import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "./useMotionPrefs";

/** Split "90.8%" into a leading number and whatever trails it. */
function parse(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return {
    target: Number.parseFloat(match[1]),
    suffix: match[2],
    decimals: (match[1].split(".")[1] ?? "").length,
  };
}

/**
 * Counts a numeric stat up from zero the first time it scrolls into view.
 * Non-numeric strings and reduced-motion visitors get the final value straight
 * away, so nothing ever renders as a placeholder.
 */
export function useCountUp(value: string, durationMs = 1100) {
  // Memoised so the effect below does not re-run on every render.
  const parsed = useMemo(() => parse(value), [value]);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState(() => (parsed && !reduced ? null : value));

  useEffect(() => {
    if (!parsed || reduced) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / durationMs);
          // easeOutExpo: fast start, settles precisely on the target.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = parsed.target * eased;
          setDisplay(current.toFixed(parsed.decimals) + parsed.suffix);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, durationMs, reduced, parsed]);

  return { ref, display: display ?? `0${parsed?.suffix ?? ""}` };
}
