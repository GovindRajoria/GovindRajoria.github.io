import { useEffect, useState } from "react";

/** True when the visitor has asked the OS to minimise animation. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Same query the cursor and the magnetic pull gate on, so all three agree. */
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * True when the device can actually hover — a mouse or trackpad, not a finger.
 *
 * Anything that reveals content on hover needs this: on a phone there is no
 * hover state to enter, so a panel that only opens on pointerenter is content
 * the visitor can never reach.
 */
export function useHoverCapable() {
  const [capable, setCapable] = useState(
    () => typeof window !== "undefined" && window.matchMedia(HOVER_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(HOVER_QUERY);
    const onChange = (event: MediaQueryListEvent) => setCapable(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return capable;
}
