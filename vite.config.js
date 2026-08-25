import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// DEMOGEN_BASE is injected per demo by the generator/CI when this chassis is
// built inside a job's repo. GitHub Pages project sites serve from
// /{repo}/, not from root — every emitted asset URL must carry that prefix
// or CSS, fonts and images 404 silently after deploy. See chassis/README.md.
// Lokálne (bez CI) treba rovnaký base ako na Pages, inak preview beží na '/'
// a audit na /demo-cestneprvky/ dostane 404. loadEnv s prázdnym prefixom
// prečíta DEMOGEN_BASE z .env; premenná z prostredia (CI) má prednosť.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  plugins: [react(), tailwindcss()],
  base: process.env.DEMOGEN_BASE || env.DEMOGEN_BASE || '/',
  resolve: {
    alias: [
      // Corpus components are harvested from projects that used these paths.
      // Measured over 4997 components: `@/lib/utils` appears 1103 times and
      // `framer-motion` 446 — without these aliases those components cannot be
      // reused as code at all, only admired as layout DNA.
      { find: /^[@~]\/lib\/utils$/, replacement: fileURLToPath(new URL('./src/lib/utils.js', import.meta.url)) },
      // Registry layouts. shadcn source projects keep the same primitives under
      // @/registry/default/ui/… or ~/registry/miami/ui/… — 1179 corpus
      // components were blocked by nothing but this naming difference, so they
      // are mapped onto the primitives the chassis actually ships.
      {
        find: /^[@~]\/registry\/[^/]+\/lib\/utils$/,
        replacement: fileURLToPath(new URL('./src/lib/utils.js', import.meta.url)),
      },
      {
        find: /^[@~]\/registry\/[^/]+\/ui\/(.*)$/,
        replacement: fileURLToPath(new URL('./src/components/ui/$1', import.meta.url)),
      },
      {
        find: /^~\/components\/ui\/(.*)$/,
        replacement: fileURLToPath(new URL('./src/components/ui/$1', import.meta.url)),
      },
      // NO framer-motion alias. `motion/react` is literally
      // `export * from 'framer-motion'`, so aliasing framer-motion back to it
      // makes the re-export circular and rollup stops resolving useScroll.
      // framer-motion ships as motion's own dependency and resolves by itself.
      // next/* stand-ins: 658 corpus components import these three. Without
      // them those components can only ever be layout inspiration.
      { find: /^next\/link$/, replacement: fileURLToPath(new URL('./src/shims/next-link.jsx', import.meta.url)) },
      { find: /^next\/image$/, replacement: fileURLToPath(new URL('./src/shims/next-image.jsx', import.meta.url)) },
      { find: /^next\/(navigation|router)$/, replacement: fileURLToPath(new URL('./src/shims/next-navigation.js', import.meta.url)) },
      { find: /^@\//, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
      { find: /^~\//, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
    ],
  },
  }
})
