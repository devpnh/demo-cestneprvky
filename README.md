# demogen chassis

The podvozok every generated demo is built on. **Not a design system, not a
catalogue of section variants** (PLAN.md §3) — infrastructure plus a shared
motion technique, into which the generator writes bespoke sections.

Stack: React 19 + Vite 6 + Tailwind 4 (`@tailwindcss/vite`, CSS-first config
— there is no `tailwind.config.js`) + `motion` + `lenis` +
`@fontsource-variable/inter`. Zero other runtime dependencies.

## Generator contract

The generator (phase 5, GENERATE) copies this whole tree into a job's repo
and then rewrites a fixed, small set of files. Everything else it must leave
alone.

**The generator OVERWRITES:**

| File | What goes in it |
|---|---|
| `src/styles/tokens.css` | All design tokens as CSS custom properties — colors, type scale, spacing, radius, motion durations/easings. This is the entire rebrand surface: every other file reads tokens via `var(--...)`, never a hardcoded value. |
| `src/content/global.json` | Brand, NAP, contact, nav labels, social links, `seo.noindex`. |
| `src/sections/*.jsx` | The bespoke section components for this client. |
| `src/sections/index.js` | The ordered array of those sections, replacing `PlaceholderHero`. |

**The generator MUST NOT touch:**

- `vite.config.js` — in particular the `DEMOGEN_BASE` wiring (see below).
- `index.html`, `.gitignore`, `package.json`.
- `.github/workflows/deploy.yml`.
- `src/components/Seo.jsx` — reads `global.json` at runtime; never needs
  editing itself.
- `src/components/DemoBadge.jsx` — the "Nezáväzný návrh — PNH Media" mark.
  A demo carries the client's logo and must never be mistakable for their
  live site (PLAN.md §4).
- `src/components/primitives/**` — the technique library sections are built
  from. Sections *use* these; they don't reimplement them.
- `src/lib/**` — the motion vocabulary (`motion.js`), the reduced-motion
  hook, the Lenis wiring. Import from here, don't fork it.
- `src/main.jsx`, `src/App.jsx`.

If a bespoke section needs something a primitive doesn't offer, that's a
chassis change to propose separately — not a reason to inline a one-off
animation in a section file.

## Primitives (`src/components/primitives/`)

Import from the barrel: `import { Reveal, Stagger, ... } from
'../components/primitives/index.js'`.

- **Reveal** — scroll-triggered fade+rise. Reduced-motion aware. Handles
  "already visible on mount" so above-the-fold content doesn't flash in.
- **Stagger** / **StaggerItem** — staggered children reveal; give each
  child `variants={fadeUp}` or wrap it in `StaggerItem`.
- **StickySection** — pinned section with scroll progress, `render(progress)`
  callback for progress-driven effects.
- **Parallax** — `useScroll`/`useTransform` wrapper, `speed` prop controls
  travel distance.
- **Marquee** — pausable (hover), CSS-keyframe marquee, collapses to a
  static row under reduced motion.
- **GradientMesh** — animated CSS gradient mesh background (no canvas, no
  three.js), reads accent colors from tokens by default.
- **SplitText** — word/line stagger reveal, pure `motion`, no GSAP.
- **MagneticCursor** — custom ring cursor, magnetic snap to
  `[data-magnetic]` elements, disabled on touch and under reduced motion.

All of them call `useReducedMotion()` (`src/lib/useReducedMotion.js`)
themselves — sections never need to check it directly.

## Motion vocabulary (`src/lib/motion.js`)

One shared easing curve (`EASE`, expo-out, mirrors `--ease-house` in
tokens.css) plus `fadeUp`, `fadeIn`, `staggerContainer()`, and the
`viewportOnce` scroll-trigger config. Every primitive and every generated
section should animate through these, not bespoke easing curves — that's
what keeps a demo's motion feeling like one system.

## Lenis (`src/lib/useLenis.js`)

Singleton smooth scroll, driven by a **manual** `requestAnimationFrame`
loop — never Lenis's own `autoRaf` (house convention). Disabled entirely
under `prefers-reduced-motion`, cleaned up on unmount. Wired once, in
`App.jsx`; sections never touch it.

## GitHub Pages `base`

Project Pages serve a repo at `https://<org>.github.io/<repo>/`, not from
root. `vite.config.js` reads `DEMOGEN_BASE` from the environment:

```js
base: process.env.DEMOGEN_BASE || '/'
```

`.github/workflows/deploy.yml` sets it to `/${{ github.event.repository.name }}/`
at build time, so every emitted asset URL carries the right prefix
automatically. The generator only needs to make sure the job's repo is
named correctly — it does not need to edit the workflow or the Vite config.

## Local dev / build

```bash
npm install
npm run dev             # local dev server, base '/'
DEMOGEN_BASE=/demo-test/ npm run build   # what CI does, base '/demo-test/'
npm run preview
```

## Deploy

`.github/workflows/deploy.yml` runs on push to `main`: `npm ci` →
`npm run build` (with `DEMOGEN_BASE` set to `/<repo>/`) →
`actions/upload-pages-artifact` (path `dist`) → `actions/deploy-pages`.
Permissions are `contents: read`, `pages: write`, `id-token: write`. The
repo's Pages source must be set to "GitHub Actions" (PLAN.md §6, the
`gh api ... -f 'build_type=workflow'` call in the publish step).
