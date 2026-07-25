import { profile } from "../data/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-xs text-text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono">
          Built with React, Vite and TypeScript ·{" "}
          <a
            href={`${profile.github}/GovindRajoria.github.io`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-accent"
          >
            source
          </a>
        </p>
      </div>
    </footer>
  );
}
