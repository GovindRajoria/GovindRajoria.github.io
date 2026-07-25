import { experience } from "../data/content";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-8">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}`} className="relative">
            {/* Timeline marker */}
            <span
              aria-hidden="true"
              className={`absolute -left-[calc(1.5rem+4.5px)] top-2 h-2 w-2 rounded-full sm:-left-[calc(2rem+4.5px)] ${
                job.current ? "bg-accent ring-4 ring-accent-wash" : "bg-border"
              }`}
            />

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-lg font-semibold text-text">
                {job.role}
                {job.current && (
                  <span className="ml-2 rounded-full bg-accent-wash px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-accent">
                    Current
                  </span>
                )}
              </h3>
              <p className="shrink-0 font-mono text-xs text-text-faint">{job.period}</p>
            </div>

            <p className="mt-1 text-sm text-text-muted">
              {job.company} · {job.location}
            </p>

            <ul className="mt-4 space-y-2.5">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
