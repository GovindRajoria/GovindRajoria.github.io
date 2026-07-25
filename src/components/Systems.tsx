import { useId, useRef, useState } from "react";
import { systems } from "../data/content";
import { Section } from "./Section";

/**
 * Tabbed explainer for the four production systems. Implements the WAI-ARIA
 * tabs pattern: arrow keys move between tabs, Home/End jump to the ends, and
 * only the active tab is in the focus order.
 */
export function Systems() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + systems.length) % systems.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTab(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTab(active - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(systems.length - 1);
        break;
    }
  };

  const current = systems[active];

  return (
    <Section
      id="systems"
      eyebrow="Domain"
      title="Computer vision for traffic management"
      subtle
    >
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-text-muted">
        Intelligent Transportation Systems run on cameras mounted over live highways and toll
        plazas. The models behind them execute on roadside edge hardware with a fixed frame
        budget, no operator watching, and no second chance at a vehicle that has already passed.
        These are the four systems I work on, described for anyone who does not spend their day
        in this domain.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr]">
        <div
          role="tablist"
          aria-label="Traffic management systems"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {systems.map((system, index) => {
            const selected = index === active;
            return (
              <button
                key={system.abbr}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={`shrink-0 rounded-lg border px-4 py-3 text-left transition-all lg:w-full ${
                  selected
                    ? "border-accent bg-accent-wash"
                    : "border-border bg-surface hover:border-accent/50 hover:bg-accent-wash/40"
                }`}
              >
                <span
                  className={`block font-mono text-sm font-semibold ${
                    selected ? "text-accent" : "text-text"
                  }`}
                >
                  {system.abbr}
                </span>
                <span className="mt-0.5 hidden text-xs leading-snug text-text-faint lg:block">
                  {system.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          style={{ boxShadow: "var(--shadow)" }}
        >
          {/* key forces a remount so the fade replays on every tab change. */}
          <div key={active} className="animate-[fadeIn_0.35s_ease-out]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {current.abbr}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-text">{current.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
              {current.description}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
