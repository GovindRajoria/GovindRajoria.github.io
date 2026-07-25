import { profile } from "../data/content";
import { AnimatedText } from "./AnimatedText";

export function Contact() {
  return (
    <section id="contact" className="hairline scroll-mt-24 bg-bg-raise">
      <div className="shell py-24 sm:py-36">
        <p className="type-label mb-8">Contact</p>

        <AnimatedText as="h2" className="type-display max-w-5xl" by="words" stagger={0.06}>
          Let's build something
        </AnimatedText>

        <AnimatedText as="p" className="type-lead mt-10 max-w-2xl">
          Open to conversations about computer vision, edge deployment and Intelligent
          Transportation Systems — a role, a collaboration, or a question about something I have
          written. Email reaches me fastest.
        </AnimatedText>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="group relative overflow-hidden rounded-full bg-accent px-7 py-4 text-sm font-medium text-bg"
          >
            <span className="relative z-10">{profile.email}</span>
            <span className="absolute inset-0 -translate-y-full bg-text transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-border-bright px-7 py-4 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            @{profile.githubHandle}
          </a>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-border-bright px-7 py-4 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
