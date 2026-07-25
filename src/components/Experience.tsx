import { useEffect, useRef } from "react";
import { experience } from "../data/content";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";

/**
 * Experience as a two-column editorial layout: the role and period stick to the
 * top of the viewport while its bullet list scrolls past, so the reader always
 * knows which job the detail belongs to.
 *
 * Sticky positioning does the pinning here rather than ScrollTrigger — it is
 * cheaper, survives resize for free, and degrades to normal flow on narrow
 * screens without any extra branching.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const rootEl = root.current;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".exp-item").forEach((item) => {
        gsap.from(item.querySelectorAll(".exp-point"), {
          autoAlpha: 0,
          y: 22,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: item, start: "top 78%", once: true },
        });
        gsap.from(item.querySelector(".exp-rule"), {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="experience" className="hairline scroll-mt-24">
      <div className="shell py-20 sm:py-28">
        <p className="type-label mb-5">Career</p>
        <AnimatedText as="h2" className="type-h2 mb-16 max-w-3xl">
          Where I have worked
        </AnimatedText>

        <div className="space-y-20 sm:space-y-28">
          {experience.map((job) => (
            <article key={`${job.company}-${job.period}`} className="exp-item">
              <div className="exp-rule mb-10 h-px w-full origin-left bg-border" />

              <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                <header className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
                  <p className="type-label mb-4">{job.period}</p>
                  <h3 className="type-h3 text-text">
                    {job.role}
                    {job.current && (
                      <span className="ml-3 inline-block translate-y-[-4px] rounded-full bg-accent px-2.5 py-1 align-middle font-mono text-[10px] uppercase tracking-widest text-bg">
                        Now
                      </span>
                    )}
                  </h3>
                  <p className="mt-3 text-sm text-text-muted">
                    {job.company} · {job.location}
                  </p>
                </header>

                <ul className="space-y-5 lg:col-span-7">
                  {job.points.map((point) => (
                    <li key={point} className="exp-point flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-5 shrink-0 bg-accent"
                      />
                      <span className="text-sm leading-relaxed text-text-muted sm:text-base">
                        {point}
                      </span>
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
