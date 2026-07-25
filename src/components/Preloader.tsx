import { useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";

/**
 * Entry curtain: a counter runs to 100 while the page settles, then the panel
 * clips upward to hand over to the hero.
 *
 * The counter is tied to a real signal — document.fonts.ready — rather than
 * being pure theatre, so it does genuinely cover the moment where unstyled text
 * would otherwise flash. It is capped so a warm cache still shows a brief,
 * deliberate beat instead of a flicker.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setHidden(true);
      onDone();
      return;
    }

    // Start from the top: a restored scroll position behind the curtain would
    // hand over to a hero that is already half out of frame.
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const value = { n: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setHidden(true);
          onDone();
        },
      });

      tl.to(value, {
        n: 100,
        duration: 1.15,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current) {
            counter.current.textContent = String(Math.round(value.n)).padStart(3, "0");
          }
        },
      })
        .to(".preloader-meter", { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0)
        .to(".preloader-copy", { autoAlpha: 0, duration: 0.3 }, ">-0.1")
        // Clip the curtain away rather than fading it: a hard edge reads sharper.
        .to(root.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.9,
          ease: EASE_IN_OUT,
        });
    }, root);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onDone, reduced]);

  if (hidden) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-bg"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="shell preloader-copy pb-12">
        <div className="flex items-end justify-between gap-6">
          <p className="type-label">Govind Kumar — Portfolio</p>
          <span
            ref={counter}
            className="font-mono text-4xl tabular-nums text-accent sm:text-6xl"
          >
            000
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-border">
          <div className="preloader-meter h-px w-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </div>
  );
}
