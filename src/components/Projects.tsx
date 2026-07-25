import { useRef } from "react";
import { projects } from "../data/content";
import { Section } from "./Section";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

/**
 * Card with a cursor-following spotlight. Pointer position is written to CSS
 * custom properties rather than React state, so tracking the mouse never
 * triggers a re-render.
 */
function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const ref = useRef<HTMLElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    node.style.setProperty("--spot-opacity", "1");
  };

  const onPointerLeave = () => {
    ref.current?.style.setProperty("--spot-opacity", "0");
  };

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
      style={{ "--spot-opacity": 0 } as React.CSSProperties}
    >
      {/* Spotlight wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background:
            "radial-gradient(340px circle at var(--spot-x) var(--spot-y), var(--accent-wash), transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-base font-semibold text-text">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              {project.name}
              <ArrowIcon />
            </a>
          </h3>
          {project.highlight && (
            <span className="rounded-full bg-accent-wash px-2.5 py-0.5 font-mono text-[11px] text-accent">
              {project.highlight}
            </span>
          )}
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">{project.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="font-mono text-xs text-text-faint">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <Section id="projects" eyebrow="Work" title="Selected projects">
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
