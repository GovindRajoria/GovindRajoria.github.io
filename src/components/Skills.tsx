import { useEffect, useRef } from "react";
import { skills } from "../data/content";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const rootEl = root.current;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".skill-group").forEach((group) => {
        gsap.from(group.querySelectorAll(".skill-chip"), {
          autoAlpha: 0,
          y: 16,
          scale: 0.96,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="skills" className="hairline scroll-mt-24 bg-bg-raise">
      <div className="shell py-20 sm:py-28">
        <p className="type-label mb-5">Toolkit</p>
        <AnimatedText as="h2" className="type-h2 mb-14 max-w-3xl">
          Technical skills
        </AnimatedText>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.title} className="skill-group">
              <h3 className="type-label mb-5 flex items-center gap-3 border-b border-border pb-3">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="skill-chip rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[11px] text-text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
