import { useEffect, useRef } from "react";
import { profile } from "../data/content";
import { EXPO, gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useMotionPrefs";
import { AnimatedText } from "./AnimatedText";
import { DetectionCanvas } from "./DetectionCanvas";
import { Portrait } from "./Portrait";

const BASE = import.meta.env.BASE_URL;

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ready || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EXPO } });

      tl.from(".hero-rule", { scaleX: 0, duration: 1.2, stagger: 0.08 }, 0)
        .from(".hero-meta", { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.07 }, 0.35)
        .from(
          ".hero-portrait",
          { autoAlpha: 0, y: 40, scale: 0.97, duration: 1.3 },
          0.25,
        )
        .from(".hero-cta", { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.08 }, 0.7)
        .from(".hero-scroll", { autoAlpha: 0, duration: 0.6 }, 1);

      // Parallax: the portrait drifts slower than the page, the type faster.
      gsap.to(".hero-portrait", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-type", {
        yPercent: -8,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section ref={root} id="top" className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
      {/* Ambient detection overlay behind the type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-55 [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_78%)]"
      >
        <DetectionCanvas />
      </div>

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="hero-type lg:col-span-8">
            <div className="hero-meta mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="type-label flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Open to opportunities
              </span>
              <span className="type-label">{profile.location}</span>
            </div>

            <AnimatedText
              as="h1"
              className="type-display"
              by="words"
              stagger={0.07}
              immediate
              play={ready}
            >
              Govind Kumar
            </AnimatedText>

            <div className="hero-rule mt-8 h-px w-full origin-left bg-border" />

            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <AnimatedText as="p" className="type-lead max-w-xl" immediate play={ready} delay={0.5}>
                {profile.summary}
              </AnimatedText>

              <dl className="hero-meta shrink-0 space-y-3 sm:text-right">
                <div>
                  <dt className="type-label">Role</dt>
                  <dd className="mt-1 text-sm text-text">{profile.role}</dd>
                </div>
                <div>
                  <dt className="type-label">Company</dt>
                  <dd className="mt-1 text-sm text-text">{profile.company}</dd>
                </div>
                <div>
                  <dt className="type-label">Focus</dt>
                  <dd className="mt-1 text-sm text-text">Edge computer vision</dd>
                </div>
              </dl>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="hero-cta group relative overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg"
              >
                <span className="relative z-10">Get in touch</span>
                <span className="absolute inset-0 -translate-y-full bg-text transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              </a>
              <a
                href={`${BASE}resume.pdf`}
                download
                className="hero-cta rounded-full border border-border-bright px-6 py-3 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Download CV
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="hero-cta rounded-full border border-border-bright px-6 py-3 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                GitHub
              </a>
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hero-cta rounded-full border border-border-bright px-6 py-3 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="hero-portrait lg:col-span-4">
            <Portrait />
          </div>
        </div>

        <div className="hero-scroll mt-20 flex items-center gap-3">
          <span className="type-label">Scroll</span>
          <span aria-hidden="true" className="h-px w-16 bg-border-bright" />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 animate-bounce text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
