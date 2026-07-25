import { useEffect, useRef } from "react";
import { systems } from "../data/content";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";

/**
 * The four production systems, presented as a horizontally-scrolled track that
 * the page pins while it advances.
 *
 * Implementation notes worth keeping:
 *  - `end` is a function so the scroll distance is recomputed on refresh;
 *    with a fixed value the track desyncs from the pin after a resize.
 *  - `invalidateOnRefresh` forces the x target to be re-read too.
 *  - Pinning is gated behind a desktop matchMedia. On narrow screens the panels
 *    simply stack, because a pinned horizontal track on a phone fights the
 *    browser's own scroll and feels broken.
 */
export function Systems() {
  const root = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const rootEl = root.current;
    if (!rootEl) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const track = rootEl.querySelector<HTMLElement>(".systems-track");
      const pinArea = rootEl.querySelector<HTMLElement>(".systems-pin");
      if (!track || !pinArea) return;

      const distance = () => track.scrollWidth - pinArea.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinArea,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each panel lifts slightly as it reaches the centre of the viewport.
      const panels = gsap.utils.toArray<HTMLElement>(".systems-panel");
      panels.forEach((panel) => {
        gsap.fromTo(
          panel.querySelector(".systems-panel-inner"),
          { y: 34, autoAlpha: 0.35 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 88%",
              end: "left 45%",
              scrub: true,
            },
          },
        );
      });

      // Progress meter tracks how far through the track we are.
      gsap.fromTo(
        ".systems-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: pinArea,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    // Fonts landing late changes measured widths; recompute once they settle.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, [reduced]);

  return (
    <div ref={root} id="systems" className="hairline scroll-mt-24 bg-bg-raise">
      <div className="shell py-20 sm:py-28">
        <p className="type-label mb-5">Domain expertise</p>
        <AnimatedText as="h2" className="type-h2 max-w-4xl">
          Computer vision for traffic management
        </AnimatedText>
        <AnimatedText as="p" className="type-lead mt-8 max-w-3xl">
          Intelligent Transportation Systems run on cameras mounted over live highways and toll
          plazas. The models behind them execute on roadside edge hardware with a fixed frame
          budget, no operator watching, and no second chance at a vehicle that has already passed.
        </AnimatedText>
      </div>

      {/* Pinned viewport: the track slides horizontally inside it. */}
      <div className="systems-pin relative lg:h-screen lg:overflow-hidden">
        <div className="systems-track flex flex-col gap-6 px-6 pb-20 lg:h-full lg:flex-row lg:items-center lg:gap-0 lg:px-0 lg:pb-0">
          {systems.map((system, index) => (
            <article
              key={system.abbr}
              className="systems-panel w-full shrink-0 lg:w-[min(46rem,78vw)] lg:px-8"
            >
              <div className="systems-panel-inner rounded-xl border border-border bg-surface p-8 sm:p-12">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-6xl font-medium leading-none text-accent sm:text-8xl">
                    {system.abbr}
                  </span>
                  <span className="type-label">
                    {String(index + 1).padStart(2, "0")} / {String(systems.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="type-h3 mt-8 text-text">{system.name}</h3>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
                  {system.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Progress meter, desktop only — it tracks the pinned scroll. */}
        <div className="absolute inset-x-0 bottom-10 hidden lg:block">
          <div className="shell">
            <div className="h-px w-full bg-border">
              <div className="systems-progress h-px w-full origin-left bg-accent" />
            </div>
            <p className="type-label mt-4">Drag or scroll to advance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
