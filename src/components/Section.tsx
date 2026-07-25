import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  subtle?: boolean;
};

/**
 * Shared section shell: consistent vertical rhythm, a heading pattern used
 * across the page, and a one-shot reveal transition once scrolled into view.
 */
export function Section({ id, eyebrow, title, children, subtle = false }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or reduced motion): show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-border ${subtle ? "bg-bg-subtle" : "bg-bg"}`}
    >
      <div
        ref={ref}
        data-visible={visible}
        className="reveal mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <header className="mb-10 sm:mb-12">
          {eyebrow && (
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold text-text sm:text-3xl">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
