import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered once, at module scope, so every component imports the same
// configured instance rather than re-registering plugins per mount.
gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

// A single house easing curve keeps motion feeling like one system.
export const EASE = "power3.out";
export const EASE_IN_OUT = "power2.inOut";
export const EXPO = "expo.out";

export { gsap, ScrollTrigger, SplitText, Observer };
