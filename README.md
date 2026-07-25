# govindrajoria.github.io

Source for my portfolio — [govindrajoria.github.io](https://govindrajoria.github.io)

## Stack

React 19, TypeScript, Vite 8 and Tailwind CSS v4. No animation or UI component
library: the interactions are hand-built, which keeps the production bundle at
roughly 71 kB gzipped.

## Notable pieces

- **`src/components/DetectionCanvas.tsx`** — the hero background is a canvas
  animation mimicking a live object-detection overlay: silhouettes drift across
  lanes and acquire tracked bounding boxes with class labels and confidence
  scores. It is a nod to the day job. Rendering pauses when the tab is hidden or
  the canvas scrolls out of view, and collapses to a single static frame under
  `prefers-reduced-motion`.
- **`src/data/content.ts`** — every string on the site. Components stay
  presentational, so copy changes never touch JSX.
- **`src/hooks/useTheme.ts`** — light/dark with an explicit toggle that
  overrides the system preference and persists. An inline script in
  `index.html` applies the same logic before first paint, so there is no flash
  of the wrong theme.
- **`src/components/Systems.tsx`** — the tabbed explainer implements the
  WAI-ARIA tabs pattern properly: arrow-key navigation, Home/End, and a single
  tab stop.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, `aria-current` on the
active nav item, and a full `prefers-reduced-motion` path that disables the
canvas animation, scroll smoothing, reveals and count-ups.

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
publishes `dist/` to GitHub Pages. The Pages source must be set to **GitHub
Actions** in the repository settings.

## Assets

- `public/resume.pdf` — CV linked from the hero.
- `public/headshot.jpg` — optional. The hero falls back to a monogram if it is
  absent, so the layout never breaks.
