# govindrajoria.github.io

Source for my portfolio — [govindrajoria.github.io](https://govindrajoria.github.io)

## Stack

React 19, TypeScript, Vite 8, Tailwind CSS v4, **GSAP 3.15** (ScrollTrigger,
SplitText, Observer) and **Lenis** for smooth scrolling. Committed dark theme.

The accent is a signal lime because that is the colour real detection overlays
get drawn in — bounding boxes, HUD readouts, confidence labels. The surface is
meant to look like the work.

## Interaction architecture

**`src/hooks/useSmoothScroll.ts`** — Lenis driven by GSAP's ticker rather than
its own RAF loop. Two details matter: `ScrollTrigger.update` runs on every Lenis
scroll event, or pinned sections drift out of sync with the virtual scroll
position; and `gsap.ticker.lagSmoothing(0)` stops GSAP compensating after a long
frame, which would make scrubbed timelines jump. Anchor clicks are intercepted
and routed through `lenis.scrollTo`, since a native jump fights the virtual
scroll.

**`src/components/AnimatedText.tsx`** — masked line reveals via `SplitText`.
Splitting waits on `document.fonts.ready`, because measuring line breaks against
a fallback face produces the wrong breaks. `autoSplit: true` re-splits on resize
and `onSplit` rebuilds the tween against the new lines.

**`src/components/Systems.tsx`** — the four traffic systems as a horizontally
scrolled track that the page pins. `end` is a function and
`invalidateOnRefresh` is set so the distance is recomputed rather than baked in
at creation; without it the track desyncs from the pin after a resize. Panel
reveals use `containerAnimation` so they trigger on horizontal position. Pinning
is gated behind a `gsap.matchMedia` desktop query — a pinned horizontal track on
a phone fights the browser's own scroll.

**`src/components/Cursor.tsx`** and **`Portrait.tsx`** — pointer tracking via
`gsap.quickTo`, which reuses one tween instance instead of allocating per
event. Neither touches React state, so moving the mouse never triggers a
render. The CSS that hides the system cursor is gated behind a `body` attribute
the component sets, so a mount failure can never leave the page cursor-less.

**`src/components/Marquee.tsx`** — speed and direction fold in scroll velocity,
so the band accelerates while scrolling and reverses on scroll-up.

**`src/components/Preloader.tsx`** — the counter is tied to
`document.fonts.ready`, so it covers a real event rather than being pure
theatre.

## Portrait treatment

Base state is `grayscale(1) contrast(1.14) brightness(0.92)` so the photo sits
inside the dark theme; hover restores the real image over 0.75s. A
`linear-gradient` mask fades the bottom edge out, so the figure reads against the
page rather than against its background. `Portrait.tsx` also defines an SVG
`feColorMatrix` + `feComponentTransfer` duotone filter (`#duotone-lime`) — that
maps luminance onto an arbitrary two-colour ramp, which `filter: grayscale()`
cannot. Corner brackets and a `person 0.99` label are pushed forward on Z inside
the tilt, so the whole thing reads as a tracked detection.

## Accessibility

Semantic landmarks, skip link, visible focus rings, `aria-current` on the active
nav item, and full keyboard parity on the project rows (hover animations also
fire on focus).

`prefers-reduced-motion` is a real path, not a token gesture: Lenis is never
constructed, the preloader is skipped entirely, text renders unsplit, the
pinned horizontal track becomes a vertical stack, the custom cursor does not
mount, counters show final values, and the hero canvas draws a single static
frame.

## Local development

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # tsc -b && vite build
npm run preview  # serve dist/ locally
npm run lint     # oxlint
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which lints, builds and
publishes `dist/` to GitHub Pages. Pages source must be set to **GitHub
Actions**.

## Assets

Fonts are declared by hand in `index.css` rather than importing the Fontsource
index files, which pull Cyrillic, Greek and Vietnamese subsets — around 300 kB
of glyphs this site never renders. Latin only, with `unicode-range` and
`font-display: swap`.

- `public/portrait.{jpg,webp}` + `@2x` — hero portrait, 4:5, served via
  `<picture>` with WebP first.
- `public/resume.pdf` — CV linked from the hero.
