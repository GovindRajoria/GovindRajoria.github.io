import { profile } from "../data/content";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's talk" subtle>
      <div className="max-w-2xl">
        <p className="text-base leading-relaxed text-text-muted">
          Open to conversations about computer vision, edge deployment and Intelligent
          Transportation Systems — whether that is a role, a collaboration, or a question about
          something I have written. Email is the most reliable way to reach me.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
          >
            @{profile.githubHandle}
          </a>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
