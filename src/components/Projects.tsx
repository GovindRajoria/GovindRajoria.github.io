import { useRef, useState, type ReactNode } from "react";
import { projects } from "../data/content";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useHoverCapable, useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";

type Project = (typeof projects)[number];

/** Title, highlight and index — identical either side of the pointer split. */
function RowHeader({
  project,
  index,
  children,
  trailing,
}: {
  project: Project;
  index: number;
  children?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="relative flex items-start gap-5 sm:gap-8">
      <span className="row-index mt-2 font-mono text-xs text-accent opacity-45 sm:mt-3">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="row-title type-h3 text-left text-text transition-colors group-hover:text-accent">
            {project.name}
          </h3>
          {project.highlight && (
            <span className="font-mono text-[11px] tracking-wide text-text-faint">
              {project.highlight}
            </span>
          )}
        </div>
        {children}
      </div>

      {trailing}
    </div>
  );
}

function RowDetail({ project, withRepoLink }: { project: Project; withRepoLink?: boolean }) {
  return (
    <>
      <p className="max-w-3xl pt-5 text-sm leading-relaxed text-text-muted">{project.blurb}</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 pt-4">
        {project.stack.map((tech) => (
          <li key={tech} className="font-mono text-[11px] text-text-faint">
            {tech}
          </li>
        ))}
      </ul>
      {/* Touch branch only: with no hover, the row itself is a disclosure, so
          reaching the repository needs its own explicit target. */}
      {withRepoLink && (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-bright px-5 py-2.5 text-sm font-medium text-text"
        >
          View repository
          <span aria-hidden="true">→</span>
        </a>
      )}
    </>
  );
}

/**
 * Project list as large editorial rows, in two forms depending on what the
 * device can do.
 *
 * With a pointer: the whole row is one link, and hovering lifts the title,
 * floods the accent wash across it and slides the detail open — the row-list
 * pattern in place of a card grid. The panel animates `height: auto` through
 * GSAP so it needs no measured height up front.
 *
 * Without one: there is no hover to enter, so a detail panel bound to
 * pointerenter is content a phone can never reach — the blurb and the stack
 * would simply not exist on mobile. There the row becomes a disclosure button
 * with the repository as an explicit link inside the opened panel. The button
 * and the panel are siblings, never nested, because an anchor inside a button
 * is not a valid content model.
 */
function ProjectRowHover({ project, index }: { project: Project; index: number }) {
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
      <span
        aria-hidden="true"
        className="row-wash pointer-events-none absolute inset-x-0 inset-y-0 opacity-0"
        style={{
          background:
            "linear-gradient(90deg, var(--accent-wash) 0%, rgba(200,250,75,0.02) 55%, transparent 100%)",
        }}
      />

      <RowHeader
        project={project}
        index={index}
        trailing={
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
        }
      >
        <div className="row-detail h-0 overflow-hidden opacity-0">
          <RowDetail project={project} />
        </div>
      </RowHeader>
    </a>
  );
}

function ProjectRowTouch({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `project-panel-${index}`;

  const toggle = () => {
    setOpen((value) => !value);
    // The page just got taller or shorter, and the nav meter measures against
    // document height. invalidateOnRefresh is already set, so one refresh after
    // the panel has been committed is all it needs.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group w-full py-8 text-left sm:py-10"
      >
        <RowHeader project={project} index={index} />
        <span className="mt-4 flex items-center gap-2 pl-10 font-mono text-[11px] text-text-faint sm:pl-13">
          {open ? "Hide details" : "Read more"}
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            ↓
          </span>
        </span>
      </button>

      {open && (
        <div id={panelId} className="pb-8 pl-10 sm:pb-10 sm:pl-13">
          <RowDetail project={project} withRepoLink />
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const hoverCapable = useHoverCapable();

  return (
    <section id="projects" className="hairline scroll-mt-24">
      <div className="shell py-20 sm:py-28">
        <p className="type-label mb-5">Selected work</p>
        <AnimatedText as="h2" className="type-h2 mb-14 max-w-3xl">
          Things I have built
        </AnimatedText>

        <div className="border-t border-border">
          {projects.map((project, index) =>
            hoverCapable ? (
              <ProjectRowHover key={project.name} project={project} index={index} />
            ) : (
              <ProjectRowTouch key={project.name} project={project} index={index} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
