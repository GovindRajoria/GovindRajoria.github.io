import { profile } from "../data/content";

export function Footer() {
  return (
    <footer className="hairline">
      <div className="shell flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] text-text-faint">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p className="font-mono text-[11px] text-text-faint">
          React · GSAP · Lenis ·{" "}
          <a
            href={`${profile.github}/GovindRajoria.github.io`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-300 hover:text-accent"
          >
            source
          </a>
        </p>
      </div>
    </footer>
  );
}
