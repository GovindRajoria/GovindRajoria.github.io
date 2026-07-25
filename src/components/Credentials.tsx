import { certifications, education, publication } from "../data/content";
import { Section } from "./Section";

export function Credentials() {
  return (
    <Section id="background" eyebrow="Background" title="Publication & education">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-faint">
            Publication
          </h3>
          <article className="rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-base font-semibold text-text">
                {publication.url ? (
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-accent"
                  >
                    {publication.title}
                  </a>
                ) : (
                  publication.title
                )}
              </h4>
              <span className="font-mono text-xs text-text-faint">{publication.year}</span>
            </div>
            <p className="mt-2 text-sm italic text-text-muted">{publication.venue}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{publication.abstract}</p>
            <p className="mt-4 font-mono text-xs text-text-faint">
              DOI{" "}
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-80"
              >
                {publication.doi}
              </a>
            </p>
          </article>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-faint">
              Education
            </h3>
            <p className="text-sm font-semibold text-text">{education.degree}</p>
            <p className="mt-1 text-sm text-text-muted">{education.institution}</p>
            <p className="text-sm text-text-muted">{education.university}</p>
            <p className="mt-2 font-mono text-xs text-text-faint">
              {education.period} · GPA {education.gpa}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-faint">
              Certifications
            </h3>
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li key={cert.name} className="text-sm">
                  <span className="text-text">{cert.name}</span>
                  <span className="text-text-faint"> — {cert.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
