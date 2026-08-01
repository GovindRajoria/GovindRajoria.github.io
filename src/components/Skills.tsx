import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { skills } from "../data/content";
import { EASE, gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";

/**
 * Column spans, one per group, in data order.
 *
 * A uniform 3-column grid left the seventh group alone on its own row with two
 * dead cells beside it — the empty half-screen this section used to end on.
 * Widths are assigned by how much each group actually has to say instead, so
 * every row closes exactly: 5+7, 4+4+4, 5+7 across twelve columns, and the last
 * group goes full width at the two-column breakpoint where it would otherwise
 * be the odd one out.
 *
 * Written out as whole class strings rather than composed from numbers because
 * Tailwind scans source text and never sees an interpolated class name.
 */
const SPANS = [
  "sm:col-span-1 lg:col-span-5",
  "sm:col-span-1 lg:col-span-7",
  "sm:col-span-1 lg:col-span-4",
  "sm:col-span-1 lg:col-span-4",
  "sm:col-span-1 lg:col-span-4",
  "sm:col-span-1 lg:col-span-5",
  "sm:col-span-2 lg:col-span-7",
];

const FALLBACK_SPAN = "sm:col-span-2 lg:col-span-4";

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const rootEl = root.current;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      // Cards arrive as a set, then each one fills in its own contents once it
      // is close enough to read. Two triggers rather than one nested timeline,
      // so a card deep in the grid still animates if the visitor lands on an
      // anchor part-way down the section.
      // clearProps on transform matters: GSAP leaves the composed transform
      // inline when a tween ends, and an inline transform outranks the hover
      // lift declared in CSS — without this the cards land animated and then
      // refuse to respond to the pointer.
      gsap.fromTo(
        ".skill-card",
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: EASE,
          stagger: 0.07,
          clearProps: "transform",
          scrollTrigger: { trigger: rootEl, start: "top 80%", once: true },
        },
      );

      gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card) => {
        const trigger = { trigger: card, start: "top 88%", once: true };

        gsap.fromTo(
          card.querySelector(".skill-rule"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: EASE, scrollTrigger: trigger },
        );

        gsap.fromTo(
          card.querySelectorAll(".skill-chip"),
          { y: 14, scale: 0.96, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
            ease: EASE,
            stagger: 0.025,
            clearProps: "transform",
            scrollTrigger: trigger,
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // The accent wash inside each card is centred on the pointer. Written straight
  // to CSS custom properties: a state update per pointermove would re-render the
  // whole grid at pointer frequency for a purely visual effect.
  const onCardMove = (event: ReactPointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const total = skills.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section ref={root} id="skills" className="hairline relative scroll-mt-24 overflow-hidden">
      {/* Lifts the grid off flat black without adding a second canvas: one
          accent bloom behind the first row, one faint plotting grid, both
          masked out before they reach the section edges. */}
      <div aria-hidden="true" className="skills-aura" />
      <div aria-hidden="true" className="skills-mesh" />

      <div className="shell relative py-20 sm:py-28">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-3xl">
            <p className="type-label mb-5">Toolkit</p>
            <AnimatedText as="h2" className="type-h2">
              Technical skills
            </AnimatedText>
            <AnimatedText as="p" className="type-lead mt-8">
              Grouped by the part of the problem each one solves — from the model itself down to
              the device it has to run on and the pipe that feeds it frames.
            </AnimatedText>
          </div>

          <p className="type-label whitespace-nowrap">
            <span className="text-accent">{total}</span> tools · {skills.length} groups
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {skills.map((group, index) => (
            <article
              key={group.title}
              onPointerMove={onCardMove}
              className={`skill-card hud-card group relative rounded-xl border border-border bg-surface p-6 sm:p-7 ${
                SPANS[index] ?? FALLBACK_SPAN
              }`}
            >
              <span aria-hidden="true" className="hud-glow" />
              <span aria-hidden="true" className="hud-corners" />

              <div className="relative">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-label flex items-center gap-2.5 text-text-muted">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-accent transition-transform duration-500 group-hover:scale-[2.5]"
                    />
                    {group.title}
                  </h3>
                  <span className="font-mono text-[10px] tabular-nums text-text-faint">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="skill-rule mt-4 h-px w-full origin-left bg-border" />

                {group.note && (
                  <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-text-faint">
                    {group.note}
                  </p>
                )}

                {/* The chip lift transitions `translate`, not `transform`:
                    that is the property Tailwind emits for -translate-y, and
                    it stays clear of the transform GSAP writes during the
                    reveal. */}
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="skill-chip rounded-full border border-border bg-bg-raise px-3 py-1.5 font-mono text-[11px] text-text-muted transition-[translate,border-color,color,background-color] duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-wash hover:text-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
