import { useEffect, useMemo, useRef, useState } from "react";
import { navLinks, profile } from "../data/content";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { gsap } from "../lib/gsap";
import { useMagnetic } from "../hooks/useMagnetic";
import { useReducedMotion } from "../hooks/useMotionPrefs";

export function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const sectionIds = useMemo(() => navLinks.map((link) => link.href.slice(1)), []);
  const activeId = useScrollSpy(sectionIds);
  const reduced = useReducedMotion();

  useMagnetic(root, "[data-magnetic]", 0.22);

  // Reveal the bar once the curtain has lifted.
  useEffect(() => {
    if (!ready || reduced) return;
    gsap.from(root.current, { yPercent: -100, duration: 1, ease: "expo.out", delay: 0.15 });
  }, [ready, reduced]);

  // Read-through meter along the bottom edge of the bar. Scrubbed against the
  // document rather than any one section, and kept on under reduced motion —
  // it reports position, it is not decoration — but without the easing lag.
  useEffect(() => {
    const el = progress.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: reduced ? true : 0.3,
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  // Hide on scroll down, show on scroll up — keeps the viewport clear while
  // reading but puts navigation one flick away.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setHidden(y > lastY && y > 220);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Sibling of the bar, not a child of it: the header translates itself
          out of view on scroll-down, which is exactly when read-through
          progress is advancing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[91] h-px bg-border/60"
      >
        <div ref={progress} className="nav-progress h-px w-full bg-accent" />
      </div>

      <header
        ref={root}
        className="fixed inset-x-0 top-0 z-[90] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: hidden && !open ? "translateY(-100%)" : "translateY(0)" }}
      >
        <div className="border-b border-border/70 bg-bg/75 backdrop-blur-xl">
          <div className="shell flex h-16 items-center justify-between gap-6 sm:h-18">
            <a href="#top" className="group flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150"
              />
              <span className="font-mono text-sm tracking-tight text-text">
                {profile.name.split(" ")[0].toLowerCase()}
                <span className="text-accent">.</span>
                dev
              </span>
            </a>

            <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => {
                const active = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "true" : undefined}
                    className={`relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                      active ? "text-accent" : "text-text-faint hover:text-text"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 bottom-1 h-px origin-left bg-accent transition-transform duration-500 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                data-magnetic
                className="hidden rounded-full border border-border-bright px-4 py-2 font-mono text-xs uppercase tracking-widest text-text transition-colors duration-300 hover:border-accent hover:text-accent md:inline-block"
              >
                Contact
              </a>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
                className="rounded-full border border-border-bright p-2.5 text-text transition-colors duration-300 hover:border-accent hover:text-accent md:hidden"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                >
                  {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="border-b border-border bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <ul className="shell py-4">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3 text-2xl text-text transition-colors hover:text-accent"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="font-mono text-[10px] text-text-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
