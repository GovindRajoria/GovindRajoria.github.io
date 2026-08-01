import { certifications, education, publication } from "../data/content";
import { AnimatedText } from "./AnimatedText";

export function Credentials() {
  return (
    <section id="background" className="hairline scroll-mt-24">
      <div className="shell py-20 sm:py-28">
        <p className="type-label mb-5">Background</p>
        <AnimatedText as="h2" className="type-h2 mb-14 max-w-3xl">
          Publication &amp; education
        </AnimatedText>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="type-label mb-5">Peer-reviewed</p>
            <a
              href={publication.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group block rounded-xl border border-border bg-surface p-8 transition-colors duration-300 hover:border-accent sm:p-10"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="type-h3 text-text transition-colors group-hover:text-accent">
                  {publication.title}
                </h3>
                <span className="font-mono text-xs text-text-faint">{publication.year}</span>
              </div>
              <p className="mt-4 text-sm italic text-text-muted">{publication.venue}</p>
              <p className="mt-5 text-sm leading-relaxed text-text-muted">{publication.abstract}</p>
              <p className="mt-7 font-mono text-[11px] text-text-faint">
                DOI {publication.doi}
                {/* Hidden until hover on a pointer device; permanently visible
                    where there is no hover to reveal it. */}
                <span className="reveal-on-hover ml-3 inline-block text-accent transition-opacity duration-300">
                  Read the paper →
                </span>
              </p>
            </a>
          </div>

          <div className="space-y-12 lg:col-span-5">
            <div>
              <p className="type-label mb-5">Education</p>
              <p className="type-h3 text-text">{education.degree}</p>
              <p className="mt-3 text-sm text-text-muted">{education.institution}</p>
              <p className="text-sm text-text-muted">{education.university}</p>
              <p className="mt-4 font-mono text-xs text-text-faint">
                {education.period} · GPA {education.gpa}
              </p>
            </div>

            <div>
              <p className="type-label mb-5">Certifications</p>
              <ul className="divide-y divide-border">
                {certifications.map((cert) => (
                  <li key={cert.name} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="text-text">{cert.name}</span>
                    <span className="shrink-0 text-text-faint">{cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
