import { useEffect, useRef } from "react";
import { stats } from "../data/content";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";

/** Split "90.8%" into its numeric part and whatever trails it. */
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
 * Metric band. Values count up once, when the band first scrolls into view,
 * driven by a GSAP tween on a plain object rather than React state — a
 * 60 fps counter through setState would re-render the section every frame.
 */
export function Stats() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const rootEl = root.current;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((node) => {
        const parsed = parse(node.dataset.value ?? "");
        if (!parsed) return;

        const counter = { n: 0 };
        gsap.to(counter, {
          n: parsed.target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
          onUpdate: () => {
            node.textContent = counter.n.toFixed(parsed.decimals) + parsed.suffix;
          },
        });
      });

      gsap.from(".stat-cell", {
        autoAlpha: 0,
        y: 26,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: rootEl, start: "top 85%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} className="hairline">
      <div className="shell py-16 sm:py-20">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-cell">
              <dt
                className="stat-value font-mono text-4xl font-medium tabular-nums text-accent sm:text-5xl"
                data-value={stat.value}
              >
                {reduced ? stat.value : `0${parse(stat.value)?.suffix ?? ""}`}
              </dt>
              <dd className="mt-4 text-sm font-medium text-text">{stat.label}</dd>
              <dd className="mt-1.5 text-xs leading-relaxed text-text-faint">{stat.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
