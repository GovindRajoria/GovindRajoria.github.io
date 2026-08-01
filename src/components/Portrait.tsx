import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { profile } from "../data/content";

const BASE = import.meta.env.BASE_URL;

/**
 * SVG duotone filter. Kept alongside the CSS grayscale treatment because
 * feColorMatrix can map luminance onto an arbitrary two-colour ramp, which
 * `filter: grayscale()` cannot — the lime/near-black ramp here is what makes
 * the photo read as part of the theme rather than a picture dropped onto it.
 *
 * Applied via the `.portrait-duotone` class; the CSS filter alone is used on the
 * hover state so the real photo can come through.
 */
export function PortraitFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter id="duotone-lime" colorInterpolationFilters="sRGB">
          {/* Collapse to luminance first. */}
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0      0      0      1 0"
          />
          {/* Then ramp shadows to near-black and highlights to lime. */}
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.031 0.784" />
            <feFuncG type="table" tableValues="0.031 0.980" />
            <feFuncB type="table" tableValues="0.039 0.294" />
          </feComponentTransfer>
        </filter>

        {/* Soft-edged vignette used as a mask on the framed portrait. */}
        <radialGradient id="portrait-vignette" cx="50%" cy="42%" r="72%">
          <stop offset="55%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * Portrait with pointer-tracked 3D tilt.
 *
 * The tilt is applied to a wrapper with perspective, and the image inside is
 * pushed forward on Z so it separates from its frame. Rotation is driven by
 * quickTo for the same reason as the cursor: one reusable tween, no per-event
 * allocation, no React re-render.
 */
export function Portrait({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapEl = wrap.current;
    const cardEl = card.current;
    if (!wrapEl || !cardEl || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rotX = gsap.quickTo(cardEl, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotY = gsap.quickTo(cardEl, "rotationY", { duration: 0.6, ease: "power3.out" });

    const MAX_TILT = 9; // degrees — past ~12 it stops reading as depth

    const onMove = (event: PointerEvent) => {
      const rect = wrapEl.getBoundingClientRect();
      // Normalise pointer position within the element to -0.5..0.5
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotY(px * MAX_TILT * 2);
      rotX(-py * MAX_TILT * 2);
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    wrapEl.addEventListener("pointermove", onMove);
    wrapEl.addEventListener("pointerleave", onLeave);
    return () => {
      wrapEl.removeEventListener("pointermove", onMove);
      wrapEl.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={wrap} className={className} style={{ perspective: "1100px" }}>
      <div
        ref={card}
        className="relative"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <div className="portrait-frame aspect-4/5 w-full rounded-lg border border-border">
          <picture>
            <source
              type="image/webp"
              srcSet={`${BASE}portrait.webp 800w, ${BASE}portrait@2x.webp 1600w`}
              sizes="(min-width: 1024px) 34vw, 78vw"
            />
            <img
              src={`${BASE}portrait.jpg`}
              srcSet={`${BASE}portrait.jpg 800w, ${BASE}portrait@2x.jpg 1600w`}
              sizes="(min-width: 1024px) 34vw, 78vw"
              alt={`${profile.name}, ${profile.role} at ${profile.company}`}
              width={800}
              height={1000}
              loading="eager"
              // React expects the camelCase spelling and warns on the lowercase
              // one, which meant the hint was dropped rather than applied.
              fetchPriority="high"
              className="portrait-img"
            />
          </picture>
          <div className="portrait-tint" />
          <div className="portrait-scan" />
        </div>

        {/* Corner brackets, pushed forward in Z. Same detection-overlay motif as
            the hero canvas and the favicon. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3"
          style={{ transform: "translateZ(45px)" }}
        >
          <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-accent/70" />
          <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-accent/70" />
          <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-accent/70" />
          <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-accent/70" />
        </div>

        {/* Tracked-object label, as an overlay would render it. */}
        <div
          className="absolute -bottom-3 left-4 flex items-center gap-2 rounded bg-accent px-2.5 py-1"
          style={{ transform: "translateZ(70px)" }}
        >
          <span className="font-mono text-[10px] font-semibold tracking-wide text-bg">
            person 0.99
          </span>
        </div>
      </div>
    </div>
  );
}
