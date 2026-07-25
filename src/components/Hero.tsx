import { useState } from "react";
import { profile, stats } from "../data/content";
import { useCountUp } from "../hooks/useCountUp";
import { DetectionCanvas } from "./DetectionCanvas";

const HEADSHOT = `${import.meta.env.BASE_URL}headshot.jpg`;
const RESUME = `${import.meta.env.BASE_URL}resume.pdf`;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Portrait with a typographic fallback. Dropping a square image at
 * public/headshot.jpg is all that is needed to show a photo; without one the
 * monogram reads as a deliberate choice rather than a broken image.
 */
function Portrait() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-border bg-accent-wash font-mono text-2xl font-semibold text-accent sm:h-28 sm:w-28"
      >
        {initials(profile.name)}
      </div>
    );
  }

  return (
    <img
      src={HEADSHOT}
      alt={`${profile.name}, ${profile.role}`}
      width={112}
      height={112}
      onError={() => setFailed(true)}
      className="h-24 w-24 shrink-0 rounded-2xl border border-border object-cover sm:h-28 sm:w-28"
      style={{ boxShadow: "var(--shadow)" }}
    />
  );
}

function Stat({ value, label, detail }: { value: string; label: string; detail: string }) {
  const { ref, display } = useCountUp(value);

  return (
    <div className="group bg-surface p-5 transition-colors hover:bg-accent-wash">
      <dt
        ref={ref as React.Ref<HTMLElement>}
        className="font-mono text-2xl font-semibold tabular-nums text-accent sm:text-3xl"
      >
        {display}
      </dt>
      <dd className="mt-2 text-sm font-medium text-text">{label}</dd>
      <dd className="mt-1 text-xs leading-relaxed text-text-faint">{detail}</dd>
    </div>
  );
}

export function Hero() {
  return (
    <div id="top" className="relative overflow-hidden">
      {/* Ambient detection overlay: on-theme, and paused whenever off-screen. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
        aria-hidden="true"
      >
        <DetectionCanvas />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Portrait />

          <div className="min-w-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-text-muted backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Available · {profile.location}
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-4 text-lg text-text sm:text-xl">
              <span className="font-medium text-accent">{profile.role}</span>
              <span className="text-text-faint"> at </span>
              <span className="font-medium">{profile.company}</span>
            </p>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
              {profile.headline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5 hover:opacity-90"
              >
                Get in touch
              </a>
              <a
                href={RESUME}
                download
                className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                Download CV
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                GitHub
              </a>
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
          {stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} detail={stat.detail} />
          ))}
        </dl>
      </div>
    </div>
  );
}
