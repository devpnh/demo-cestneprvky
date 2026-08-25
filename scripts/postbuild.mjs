/**
 * SPA fallback pre GitHub Pages.
 *
 * Pages sú statický hosting: `/demo-cestneprvky/sluzby` na serveri neexistuje
 * ako súbor, takže bez fallbacku dostane návštevník 404 pri každom priamom
 * otvorení hlbokej routy aj pri refreshi. Pages ale servuje `404.html` s
 * návratovým kódom 404 a s obsahom, ktorý dodáme — kópia `index.html` teda
 * naštartuje React router a ten si cestu z adresy prečíta sám.
 *
 * Spúšťa sa z `npm run build` hneď po `vite build`.
 */
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..')
const index = join(KOREN, 'dist', 'index.html')
const fallback = join(KOREN, 'dist', '404.html')

if (!existsSync(index)) {
  console.error('postbuild: dist/index.html neexistuje — bežal vite build?')
  process.exit(1)
}

copyFileSync(index, fallback)

const hash = (p) => createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 12)
const hIndex = hash(index)
const hFallback = hash(fallback)

if (hIndex !== hFallback) {
  console.error(`postbuild: 404.html sa nezhoduje s index.html (${hIndex} vs ${hFallback})`)
  process.exit(1)
}

console.log(`postbuild: dist/404.html = dist/index.html (sha256 ${hIndex}, ${readFileSync(index).length} B)`)
