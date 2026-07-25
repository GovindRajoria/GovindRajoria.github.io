import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view so the nav can highlight it.
 * Picks the entry closest to the top of the viewport rather than simply the
 * first intersecting one, which keeps the highlight stable on long sections.
 */
export function useScrollSpy(ids: readonly string[], offsetPx = 96) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) return;

    const pick = () => {
      let best: { id: string; distance: number } | null = null;
      for (const node of nodes) {
        const top = node.getBoundingClientRect().top - offsetPx;
        // Sections above the fold count; the last one passed wins.
        if (top <= 0) {
          const distance = Math.abs(top);
          if (!best || distance < best.distance) best = { id: node.id, distance };
        }
      }
      setActive(best?.id ?? null);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [ids, offsetPx]);

  return active;
}
