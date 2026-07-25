import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { EXPO, gsap, SplitText } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";

type AnimatedTextProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Per-line stagger. */
  stagger?: number;
  /** Split by word instead of line — for short display headings. */
  by?: "lines" | "words";
  /** Skip the ScrollTrigger and play immediately (hero, above the fold). */
  immediate?: boolean;
  /** Gate playback on an external signal, e.g. the preloader finishing. */
  play?: boolean;
};

/**
 * Masked reveal: text is split into lines (or words), each wrapped in an
 * overflow-hidden mask, then slid up from below its own clip. This is the
 * reveal the reference sites use — the line appears to emerge from behind a
 * hard edge rather than simply fading.
 *
 * Splitting happens only after fonts settle, since splitting against a fallback
 * face measures the wrong line breaks. `autoSplit` re-splits on resize and
 * `onSplit` re-creates the tween against the new lines.
 */
export function AnimatedText({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger = 0.09,
  by = "lines",
  immediate = false,
  play = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !play) return;

    let split: SplitText | undefined;
    let cancelled = false;

    // Fonts must be resolved before measuring line breaks.
    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return;

      split = SplitText.create(el, {
        type: by,
        mask: by,
        linesClass: "split-line",
        wordsClass: "split-line",
        autoSplit: true,
        onSplit: (self) => {
          const targets = by === "lines" ? self.lines : self.words;
          return gsap.from(targets, {
            yPercent: 115,
            duration: 1.05,
            ease: EXPO,
            stagger,
            delay,
            ...(immediate
              ? {}
              : {
                  scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    once: true,
                  },
                }),
          });
        },
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [reduced, play, by, delay, stagger, immediate]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
