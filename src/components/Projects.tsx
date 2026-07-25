import { useRef } from "react";
import { projects } from "../data/content";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";

/**
 * Project list as large editorial rows. Hovering a row lifts its title, floods
 * the accent wash across it, and slides a detail panel open — the row-list
 * pattern the reference sites use in place of a card grid.
 *
 * The detail panel animates `height: auto` via GSAP so it works without knowing
 * the content height up front, and the whole row is a single link target so
 * keyboard users get the same affordance.
 */
function ProjectRow({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const row = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const onEnter = () => {
    if (reduced) return;
    const el = row.current;
    if (!el) return;
    gsap.to(el.querySelector(".row-wash"), { autoAlpha: 1, duration: 0.5, ease: "power3.out" });
    gsap.to(el.querySelector(".row-title"), { x: 22, duration: 0.6, ease: "power3.out" });
    gsap.to(el.querySelector(".row-index"), { autoAlpha: 1, x: 6, duration: 0.5, ease: "power3.out" });
    gsap.to(el.querySelector(".row-arrow"), { x: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
    gsap.to(el.querySelector(".row-detail"), {
      height: "auto",
      autoAlpha: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    if (reduced) return;
    const el = row.current;
    if (!el) return;
    gsap.to(el.querySelector(".row-wash"), { autoAlpha: 0, duration: 0.4 });
    gsap.to(el.querySelector(".row-title"), { x: 0, duration: 0.5, ease: "power3.out" });
    gsap.to(el.querySelector(".row-index"), { autoAlpha: 0.45, x: 0, duration: 0.4 });
    gsap.to(el.querySelector(".row-arrow"), { x: -12, autoAlpha: 0, duration: 0.4 });
    gsap.to(el.querySelector(".row-detail"), { height: 0, autoAlpha: 0, duration: 0.45 });
  };

  return (
    <a
      ref={row}
      href={project.repo}
      target="_blank"
      rel="noreferrer noopener"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="group relative block border-b border-border py-8 sm:py-10"
    >
      {/* Accent wash, revealed on hover */}
      <span
        aria-hidden="true"
        className="row-wash pointer-events-none absolute inset-x-0 inset-y-0 opacity-0"
        style={{
          background:
            "linear-gradient(90deg, var(--accent-wash) 0%, rgba(200,250,75,0.02) 55%, transparent 100%)",
        }}
      />

      <div className="relative flex items-start gap-5 sm:gap-8">
        <span className="row-index mt-2 font-mono text-xs text-accent opacity-45 sm:mt-3">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="row-title type-h3 text-text transition-colors group-hover:text-accent">
              {project.name}
            </h3>
            {project.highlight && (
              <span className="font-mono text-[11px] tracking-wide text-text-faint">
                {project.highlight}
              </span>
            )}
          </div>

          {/* Collapsed until hover/focus */}
          <div className="row-detail h-0 overflow-hidden opacity-0">
            <p className="max-w-3xl pt-5 text-sm leading-relaxed text-text-muted">
              {project.blurb}
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1.5 pt-4">
              {project.stack.map((tech) => (
                <li key={tech} className="font-mono text-[11px] text-text-faint">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="row-arrow mt-2 shrink-0 opacity-0 sm:mt-3"
          style={{ transform: "translateX(-12px)" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export function Projects() {
  return (
    <section id="projects" className="hairline scroll-mt-24">
      <div className="shell py-20 sm:py-28">
        <p className="type-label mb-5">Selected work</p>
        <AnimatedText as="h2" className="type-h2 mb-14 max-w-3xl">
          Things I have built
        </AnimatedText>

        <div className="border-t border-border">
          {projects.map((project, index) => (
            <ProjectRow key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
