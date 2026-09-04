/**
 * Mechanický audit viacstránkového webu Cestné prvky s.r.o. (PROMPT v5).
 *
 * Spustenie:
 *   node poznamky/audit.mjs [--routes all|<cesta>[,<cesta>]] [--url <base>]
 *                           [--dist <cesta>] [--shots <dir>] [--tag <tag>] [--json <subor>]
 *
 * Predpoklad: nad `--dist` beží statický preview na `--url` (SPA fallback zapnutý).
 *   npx vite build && node scripts/postbuild.mjs
 *   npx vite preview --port 4320 --strictPort
 *
 * Výstup: riadky `✅ ID  [cesta] text` / `❌ ID  [cesta] text (detail)`,
 * súhrn `x/y OK · n ❌`, tabuľka podľa routov a voliteľný strojový `--json`.
 * Exit code 1, ak je čo i len jedna ❌.
 *
 * Zoznam všetkých kontrol s jednou vetou, čo merajú, je na konci súboru.
 */
import { chromium } from 'playwright'
import { existsSync, statSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import {
  walk,
  read,
  grepFiles,
  kB,
  rozmeryObrazka,
  lum,
  kontrastRGB,
  parseRgb,
  zmiesaj,
  farebneTokeny,
  povolenaFarba,
  limitKontrastu,
  slugCesty,
} from './audit-utils.mjs'
import { meranieStranky, prebudStranku } from './audit-meranie.mjs'

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..')
// playwright-core neexportuje ./lib/* cez "exports" — načítaj cez absolútnu cestu.
const { PNG } = createRequire(import.meta.url)(join(KOREN, 'node_modules/playwright-core/lib/utilsBundle.js'))

// ---------------------------------------------------------------- argumenty
const argv = process.argv.slice(2)
const arg = (meno, vych) => {
  const i = argv.indexOf(`--${meno}`)
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : vych
}
const BASE = arg('url', 'http://localhost:4320/demo-cestneprvky').replace(/\/$/, '')
const DIST = (() => {
  const d = arg('dist', 'dist')
  return d.startsWith('/') ? d : join(KOREN, d)
})()
const SHOTS = arg('shots', null)
const TAG = arg('tag', 'audit')
const JSON_OUT = arg('json', null)
const ROUTES_ARG = arg('routes', 'all')

// tolerancia farieb B3r: euklidovská vzdialenosť v sRGB (0–441)
const TOL_FARBA = 8
// tolerancia zarovnania ALIGN v px
const TOL_ALIGN = 1
// tolerancia výšky hero voči obrazovke v px
const TOL_HERO = 2

const VIEWPORTY = [
  { meno: '1440', width: 1440, height: 900, mobile: false },
  { meno: '768', width: 768, height: 1024, mobile: true },
  { meno: '390', width: 390, height: 844, mobile: true },
]

// ---------------------------------------------------------------- výsledky
const vysledky = []
const zapis = (id, route, ok, text, detail = '') => vysledky.push({ id, route, ok, detail: ok ? text : `${text}${detail ? ` (${detail})` : ''}` })
const skontroluj = (id, route, fn) => {
  try {
    const v = fn()
    zapis(id, route, v.ok, v.text, v.detail)
  } catch (e) {
    zapis(id, route, false, 'kontrolu sa nepodarilo vykonať', `výnimka: ${e && e.message ? e.message : e}`)
  }
}
const skontrolujAsync = async (id, route, fn) => {
  try {
    const v = await fn()
    zapis(id, route, v.ok, v.text, v.detail)
  } catch (e) {
    zapis(id, route, false, 'kontrolu sa nepodarilo vykonať', `výnimka: ${e && e.message ? e.message : e}`)
  }
}

const skratka = (pole, n = 3) => {
  const p = pole.slice(0, n).join(' | ')
  return pole.length > n ? `${p} … +${pole.length - n}` : p
}

// ---------------------------------------------------------------- dáta z src/content
let OBSAH = null
let obsahChyba = null
try {
  const nacitaj = async (f) => (await import(pathToFileURL(join(KOREN, 'src/content', f)).href))
  OBSAH = {
    routes: await nacitaj('routes.js'),
    sluzby: await nacitaj('sluzby.js'),
    realizacie: await nacitaj('realizacie.js'),
    firma: await nacitaj('firma.js'),
  }
} catch (e) {
  obsahChyba = e && e.message ? e.message : String(e)
}

const VSETKY_CESTY = OBSAH ? OBSAH.routes.VSETKY_CESTY : []
const CESTA_404_TEST = OBSAH ? OBSAH.routes.CESTA_404_TEST : '/neexistujuca-stranka'
const SLUGY = OBSAH ? OBSAH.sluzby.SLUGY : []
const SLUZBY = OBSAH ? OBSAH.sluzby.SLUZBY : []

const CESTY =
  ROUTES_ARG === 'all'
    ? [...VSETKY_CESTY, CESTA_404_TEST]
    : ROUTES_ARG.split(',').map((c) => (c.startsWith('/') ? c : `/${c}`))

// ---------------------------------------------------------------- súborové kontroly
const S = (p) => join(KOREN, p)
/**
 * Rozsah súborových kontrol.
 *
 * `src/sections/**` je mŕtvy kód predchádzajúceho behu a číta sa zámerne nie
 * (S3 stráži, že ho nikto neimportuje). `src/components/ui/**` je radix chassis
 * so zákazom meniť — jeho tiene a rezy chytá render (B2r/B4r), nie grep.
 */
const copySubory = [
  ...walk(S('src/pages'), ['.jsx', '.js']),
  ...walk(S('src/components/layout'), ['.jsx', '.js']),
  ...walk(S('src/components/kit'), ['.jsx', '.js']),
  ...walk(S('src/components'), ['.jsx', '.js']).filter((f) => /src\/components\/[^/]+\.(jsx|js)$/.test(f)),
  ...walk(S('src/content'), ['.jsx', '.js', '.json']),
  // DemoBadge nesie PNH značku dema („Nezáväzný návrh — PNH Media“), nie copy
  // klienta, a podľa PLAN.md sa nesmie meniť — do copy kontrol nepatrí.
].filter((f) => !/DemoBadge\.jsx$/.test(f))
const vsetkySrc = [
  ...copySubory,
  ...walk(S('src/components/primitives'), ['.jsx', '.js']),
  ...walk(S('src/styles'), ['.css']),
  S('src/App.jsx'),
  S('src/main.jsx'),
  ...walk(S('src/lib'), ['.js']),
].filter((f) => existsSync(f))

/** Grep nad kódom vrátane komentárov. */
const G = (files, re, filter) => grepFiles(files, re, filter, KOREN)
/** Grep nad copy: komentáre sa nepočítajú, meria sa text pre návštevníka. */
const GC = (files, re, filter) => grepFiles(files, re, filter, KOREN, true)

// A1 — doslovné názvy produktov sú jediná povolená výnimka pre pomlčku
const NAZOV_S_POMLCKOU = /DEBUZ|Kölner|KT\s*–|Štítky\s*–|Typ KT/
skontroluj('A1', '—', () => {
  const h = GC(copySubory, /—|–/, (l) => !NAZOV_S_POMLCKOU.test(l))
  return { ok: h.length === 0, text: `žiadne pomlčky v copy (${copySubory.length} súborov, komentáre sa nerátajú)`, detail: `${h.length}× pomlčka: ${skratka(h)}` }
})

skontroluj('A2', '—', () => {
  const h = GC(vsetkySrc, /odoslať|úprimne|narovinu|ještě dnes|stvořeno|inovatívne riešeni|synergi|lídri na trhu|komplexné riešenia|špičkov|garantujeme 100|24\/7/i)
  return { ok: h.length === 0, text: 'žiadne slop slová', detail: `${h.length}×: ${skratka(h)}` }
})

skontroluj('A3', '—', () => {
  // IČO/DIČ len s číslom za nimi: „IČO: [DOPLNÍ KLIENT]“ je poctivé, „IČO: 12345678“ vymyslené.
  const h = GC(copySubory, /\bIČO\b\s*[:\s]\s*\d|\bDIČ\b\s*[:\s]\s*\d|\d+\s*rokov skúsenost|\d+\s*spokojných|recenzi|★|\d+\s*hviezd/i)
  return { ok: h.length === 0, text: 'žiadne vymyslené údaje (IČO/DIČ s číslom, roky skúseností, počty, recenzie, hviezdy)', detail: `${h.length}×: ${skratka(h)}` }
})

skontroluj('A4', '—', () => {
  const h = GC(copySubory, /\bOdoslať\b/)
  const tel = G(vsetkySrc, /href=\{?["'`]?tel:|PHONE_HREF|tel:\+421/).length
  return {
    ok: h.length === 0 && tel >= 2,
    text: `CTA bez „Odoslať“, tel: odkaz ${tel}×`,
    detail: `„Odoslať“ ${h.length}× (${skratka(h, 2)}), tel: ${tel}× (treba ≥ 2)`,
  }
})

skontroluj('A5', '—', () => {
  const h = GC(copySubory, /\b(které|již|ještě|zde|společnost|naše služby jsou)\b/i)
  return { ok: h.length === 0, text: 'bez čechizmov', detail: `${h.length}×: ${skratka(h)}` }
})

skontroluj('A6', '—', () => {
  const fakty = ['Cestné prvky s.r.o.', 'Borová 3295/36', '010 01 Žilina', 'info@cestneprvky.sk', '+421 911 87 87 89', '2012']
  const chyba = fakty.filter((f) => GC(copySubory, new RegExp(f.replace(/[.+*?^${}()|[\]\\]/g, '\\$&'))).length === 0)
  return { ok: chyba.length === 0, text: `${fakty.length} faktov klienta doslova prítomných v src`, detail: `chýba: ${chyba.join(', ')}` }
})

skontroluj('A7', '—', () => {
  const h = G(vsetkySrc, /recent posts|maisonco|connor|caroline|observatory|lorem ipsum/i)
  return { ok: h.length === 0, text: 'žiadna stopa po šablóne MaisonCo', detail: `${h.length}×: ${skratka(h, 2)}` }
})

skontroluj('B1', '—', () => {
  const h = GC(copySubory, />\s*0[1-9]\s*<|['"]0[1-9]['"]/)
  return { ok: h.length === 0, text: 'žiadne číslované dlaždice 01/02/03', detail: `${h.length}×: ${skratka(h, 2)}` }
})

skontroluj('B2', '—', () => {
  const h = GC(vsetkySrc.filter((f) => !/DemoBadge\.jsx$/.test(f)), /box-shadow|\bshadow-(?!none)/)
  return { ok: h.length === 0, text: 'žiadny box-shadow v zdroji (mimo DemoBadge)', detail: `${h.length}×: ${skratka(h, 2)}` }
})

skontroluj('B3', '—', () => {
  const h = GC(vsetkySrc, /#0e5c66|#f6a21c|#3970ff|#7c3aed|#a855f7|#8b5cf6/i)
  return { ok: h.length === 0, text: 'žiadne cudzie hexy v zdroji', detail: `${h.length}×: ${skratka(h, 2)}` }
})

skontroluj('B4', '—', () => {
  const h = GC(vsetkySrc, /font-(bold|extrabold|black)\b|font-weight:\s*[789]00/)
  return { ok: h.length === 0, text: 'žiadny rez ≥ 700 v zdroji', detail: `${h.length}×: ${skratka(h, 2)}` }
})

skontroluj('E4', '—', () => {
  const h = GC(vsetkySrc, /scroll-behavior:\s*smooth/)
  return { ok: h.length === 0, text: 'žiadny scroll-behavior: smooth', detail: `${h.length}×: ${skratka(h, 2)}` }
})

// --- médiá
const ASSETS = S('public/assets')
const HERO_DIR = S('public/hero')

/** Všetky `{src, w, h}` z `src/content/*` — F1d ich porovná so súbormi. */
function fotkyZObsahu() {
  const out = []
  const videne = new Set()
  const chod = (uzol, kde) => {
    if (!uzol || typeof uzol !== 'object') return
    if (Array.isArray(uzol)) {
      uzol.forEach((u, i) => chod(u, `${kde}[${i}]`))
      return
    }
    if (typeof uzol.src === 'string' && /\.(jpe?g|png|webp)$/i.test(uzol.src)) {
      const kluc = `${uzol.src}|${uzol.w}|${uzol.h}|${kde}`
      if (!videne.has(kluc)) {
        videne.add(kluc)
        out.push({ src: uzol.src, w: uzol.w, h: uzol.h, kde })
      }
    }
    for (const [k, v] of Object.entries(uzol)) if (v && typeof v === 'object') chod(v, `${kde}.${k}`)
  }
  if (!OBSAH) return out
  for (const [meno, mod] of Object.entries(OBSAH)) for (const [exp, val] of Object.entries(mod)) chod(val, `${meno}.js:${exp}`)
  return out
}

skontroluj('F1a', '—', () => {
  const fotky = fotkyZObsahu()
  if (!OBSAH) return { ok: false, text: 'fotky z src/content sa nedali načítať', detail: obsahChyba }
  const tazke = fotky
    .filter((f) => existsSync(join(ASSETS, f.src)) && statSync(join(ASSETS, f.src)).size > 250 * 1024)
    .map((f) => `${f.src} ${kB(statSync(join(ASSETS, f.src)).size)} kB`)
  const unikat = new Set(fotky.map((f) => f.src))
  return { ok: tazke.length === 0, text: `${unikat.size} použitých fotiek ≤ 250 kB`, detail: `nad limit: ${skratka([...new Set(tazke)], 6)}` }
})

skontroluj('F1b', '—', () => {
  const mp4 = existsSync(join(HERO_DIR, 'hero.mp4')) ? statSync(join(HERO_DIR, 'hero.mp4')).size : 0
  const poster = existsSync(join(HERO_DIR, 'poster.jpg')) ? statSync(join(HERO_DIR, 'poster.jpg')).size : 0
  const ok = mp4 > 0 && mp4 <= 3 * 1024 * 1024 && poster > 0 && poster <= 250 * 1024
  return { ok, text: `hero.mp4 ${kB(mp4)} kB ≤ 3072, poster.jpg ${kB(poster)} kB ≤ 250`, detail: `hero.mp4 ${kB(mp4)} kB, poster.jpg ${kB(poster)} kB` }
})

skontroluj('F1d', '—', () => {
  if (!OBSAH) return { ok: false, text: 'rozmery fotiek sa nedali overiť', detail: `src/content sa nenaimportoval: ${obsahChyba}` }
  const fotky = fotkyZObsahu()
  if (fotky.length === 0) return { ok: false, text: 'v src/content nie je ani jedna fotka s w/h', detail: 'hľadal som objekty {src, w, h}' }
  const zle = []
  for (const f of fotky) {
    const cesta = join(ASSETS, f.src)
    if (!existsSync(cesta)) {
      zle.push(`${f.kde}: ${f.src} neexistuje v public/assets`)
      continue
    }
    const r = rozmeryObrazka(cesta)
    if (!r) {
      zle.push(`${f.kde}: ${f.src} sa nedá prečítať (neznámy formát)`)
      continue
    }
    if (f.w !== r.w || f.h !== r.h) zle.push(`${f.kde}: ${f.src} dáta ${f.w}×${f.h} ≠ súbor ${r.w}×${r.h}`)
  }
  return { ok: zle.length === 0, text: `${fotky.length} záznamov fotiek má w/h zhodné so súborom`, detail: `${zle.length}×: ${skratka([...new Set(zle)], 4)}` }
})

skontroluj('F1e', '—', () => {
  if (!existsSync(ASSETS)) return { ok: false, text: 'public/assets neexistuje', detail: ASSETS }
  const tazke = readdirSync(ASSETS)
    .map((f) => ({ f, size: statSync(join(ASSETS, f)).size }))
    .filter((x) => x.size > 250 * 1024)
    .map((x) => `${x.f} ${kB(x.size)} kB`)
  const mp4 = existsSync(join(HERO_DIR, 'hero.mp4')) ? statSync(join(HERO_DIR, 'hero.mp4')).size : 0
  const poster = existsSync(join(HERO_DIR, 'poster.jpg')) ? statSync(join(HERO_DIR, 'poster.jpg')).size : 0
  const heroOk = mp4 > 0 && mp4 <= 3 * 1024 * 1024 && poster > 0 && poster <= 250 * 1024
  const pocet = readdirSync(ASSETS).length
  return {
    ok: tazke.length === 0 && heroOk,
    text: `všetkých ${pocet} súborov v public/assets ≤ 250 kB, hero ${kB(mp4)} kB / poster ${kB(poster)} kB`,
    detail: `${tazke.length} nad 250 kB: ${skratka(tazke, 5)}${heroOk ? '' : ` · hero.mp4 ${kB(mp4)} kB, poster ${kB(poster)} kB`}`,
  }
})

// --- štruktúra
skontroluj('S1', '—', () => {
  const idx = join(DIST, 'index.html')
  const nf = join(DIST, '404.html')
  if (!existsSync(idx)) return { ok: false, text: 'SPA fallback sa nedá overiť', detail: `${relative(KOREN, idx)} neexistuje — bežal build?` }
  if (!existsSync(nf)) return { ok: false, text: 'SPA fallback chýba', detail: `${relative(KOREN, nf)} neexistuje` }
  const a = readFileSync(idx)
  const b = readFileSync(nf)
  return {
    ok: a.equals(b),
    text: `404.html je bajt na bajt zhodné s index.html (${a.length} B)`,
    detail: `index.html ${a.length} B vs 404.html ${b.length} B, zhodné: ${a.equals(b)}`,
  }
})

skontroluj('S2', '—', () => {
  if (!OBSAH) return { ok: false, text: 'routy sa nedali načítať', detail: obsahChyba }
  const chybajuce = SLUGY.filter((s) => !VSETKY_CESTY.includes(`/sluzby/${s}`))
  const ok = VSETKY_CESTY.length === 15 && chybajuce.length === 0
  return {
    ok,
    text: `VSETKY_CESTY = ${VSETKY_CESTY.length} ciest, všetkých ${SLUGY.length} slugov má cestu`,
    detail: `ciest ${VSETKY_CESTY.length} (má byť 15), slugov ${SLUGY.length}, bez cesty: ${chybajuce.join(', ') || '—'}`,
  }
})

skontroluj('S3', '—', () => {
  // Špecifikátor sa rozvinie proti adresáru súboru: `./sections/Hero.jsx` vnútri
  // `src/pages/Domov` je legitímny, mŕtvy je len `src/sections`.
  const kde = [...walk(S('src/pages'), ['.jsx', '.js']), ...walk(S('src/components'), ['.jsx', '.js'])]
  const MRTVY = S('src/sections')
  const h = []
  for (const f of kde) {
    read(f).split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
        const spec = m[1]
        let ciel = null
        if (spec.startsWith('.')) ciel = join(dirname(f), spec)
        else if (/^[@~]\//.test(spec)) ciel = join(S('src'), spec.slice(2))
        if (ciel && (ciel === MRTVY || ciel.startsWith(`${MRTVY}/`))) {
          h.push(`${relative(KOREN, f)}:${i + 1}: ${line.trim().slice(0, 90)}`)
        }
      }
    })
  }
  return { ok: h.length === 0, text: `žiadny z ${kde.length} súborov v src/pages a src/components neimportuje zo src/sections`, detail: `${h.length}×: ${skratka(h, 3)}` }
})

// ---------------------------------------------------------------- prehliadač
const TOKENY = farebneTokeny(S('src/styles/tokens.css'))

/** Median vzorky podľa jasu. */
const medianFarba = (vzorky) => {
  if (!vzorky.length) return null
  const s = [...vzorky].sort((a, b) => lum(a.r, a.g, a.b) - lum(b.r, b.g, b.b))
  return s[Math.floor(s.length / 2)]
}

/**
 * Podklad pod textom vzorkovaný z renderu: mediány riadkov tesne nad, pod a
 * vedľa glyfov (tam je vždy pozadie, nie písmo), z nich ten s najhorším
 * kontrastom. Vracia `null`, keď je text mimo screenshotu.
 */
function vzorkujPodklad(png, t, textRgb) {
  const tesny = t.tesny || { x: t.x, y: t.y, w: t.w, h: t.h }
  const x0 = Math.max(0, Math.round(tesny.x))
  const x1 = Math.min(png.width - 1, Math.round(tesny.x + tesny.w))
  if (x1 <= x0) return null
  // Vnútri rámu prvku, nikdy na ňom (akcentové podčiarknutie odkazu nie je podklad).
  const hore = Math.round(t.y + (t.okraje ? t.okraje.hore : 0))
  const dole = Math.round(t.y + t.h - (t.okraje ? t.okraje.dole : 0))
  const kandidati = new Set([hore + 1, hore + 2, Math.round(tesny.y) - 2, Math.round(tesny.y) - 1])
  if (!t.podciarknuty) {
    kandidati.add(Math.round(tesny.y + tesny.h) + 1)
    kandidati.add(Math.round(tesny.y + tesny.h) + 2)
    kandidati.add(dole - 2)
    kandidati.add(dole - 1)
  }
  const riadky = []
  for (const y of kandidati) {
    if (y < 0 || y >= png.height) continue
    const vzorky = []
    for (let x = x0; x <= x1; x += 2) {
      const i = (png.width * y + x) * 4
      vzorky.push({ r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] })
    }
    const m = medianFarba(vzorky)
    if (m) riadky.push(m)
  }
  // ľavý pás vedľa prvého riadku textu
  const posun = 1 + Math.round(t.okraje ? t.okraje.vlavo : 0)
  const lx0 = Math.max(0, x0 - 6 - posun)
  const lx1 = Math.max(0, x0 - posun)
  if (lx1 > lx0) {
    const vzorky = []
    for (let y = Math.max(0, Math.round(t.y)); y <= Math.min(png.height - 1, Math.round(t.y + t.h)); y += 2) {
      for (let x = lx0; x <= lx1; x += 1) {
        const i = (png.width * y + x) * 4
        vzorky.push({ r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] })
      }
    }
    const m = medianFarba(vzorky)
    if (m) riadky.push(m)
  }
  if (!riadky.length) return null
  let najhorsi = riadky[0]
  for (const r of riadky) if (kontrastRGB(textRgb, r) < kontrastRGB(textRgb, najhorsi)) najhorsi = r
  return { rgb: najhorsi, pocet: riadky.length }
}

/** B7 nad jedným meraním. `png` môže byť `null`, keď nič nepotrebuje pixel. */
function vyhodnotKontrast(m, png) {
  const zle = []
  const nemerane = []
  const skupiny = new Map()
  let najhorsi = { cr: Infinity, text: '' }
  for (const t of m.texty) {
    const c = parseRgb(t.color)
    if (!c) {
      nemerane.push(`${t.cesta}: nečitateľná farba „${t.color}“`)
      continue
    }
    let bg = null
    let zdroj = ''
    if (!t.potrebujePixel && t.podklad) {
      bg = t.podklad
      zdroj = 'vypočítané'
    } else if (png) {
      const v = vzorkujPodklad(png, t, c)
      if (v) {
        bg = v.rgb
        zdroj = `pixel (${v.pocet} pásov)`
      }
    }
    if (!bg) {
      nemerane.push(`${t.cesta} „${t.text}“: podklad sa nedá určiť${png ? ' ani z renderu' : ' (chýba render)'}`)
      continue
    }
    const alfa = (c.a == null ? 1 : c.a) * (t.opacity == null ? 1 : t.opacity)
    const farbaTextu = alfa < 1 ? zmiesaj({ ...c, a: alfa }, bg) : c
    const cr = kontrastRGB(farbaTextu, bg)
    const limit = limitKontrastu(t.fs, t.fw)
    if (cr < najhorsi.cr) najhorsi = { cr, text: t.text }
    if (cr < limit) {
      // Zoskupené podľa dvojice farieb a rezu: sto rovnakých oddeľovačov je
      // jedna chyba na jednom mieste, nie sto riadkov v hlásení.
      const kluc = `${Math.round(farbaTextu.r)},${Math.round(farbaTextu.g)},${Math.round(farbaTextu.b)}|${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}|${Math.round(t.fs)}|${t.fw}`
      if (!skupiny.has(kluc)) {
        skupiny.set(kluc, {
          pocet: 0,
          popis: `${t.cesta} „${t.text}“ ${Math.round(t.fs)}px/${t.fw} ${cr.toFixed(2)}:1 < ${limit} [${zdroj}, text rgb(${Math.round(farbaTextu.r)},${Math.round(farbaTextu.g)},${Math.round(farbaTextu.b)}) na rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})]`,
        })
      }
      skupiny.get(kluc).pocet += 1
    }
  }
  for (const s of skupiny.values()) zle.push(s.pocet > 1 ? `${s.popis} ×${s.pocet}` : s.popis)
  return { zle, nemerane, najhorsi, pocet: m.texty.length }
}

/** B3r nad jedným meraním. */
function vyhodnotFarby(m) {
  const zle = []
  for (const f of m.farby) {
    const v = povolenaFarba(f, TOKENY, TOL_FARBA)
    if (!v.ok) zle.push(`${f.typ} rgb(${Math.round(f.r)},${Math.round(f.g)},${Math.round(f.b)}) ×${f.pocet} napr. ${f.cesta}`)
  }
  return zle
}

// ---------------------------------------------------------------- beh prehliadača
const urlCesty = (cesta) => `${BASE}${cesta === '/' ? '/' : cesta}`

if (SHOTS) mkdirSync(SHOTS, { recursive: true })

// Preflight: keď preview nebeží, každá prehliadačová kontrola spadne s
// „ECONNREFUSED“. To je pravdivé, ale operátor si to má prečítať hneď hore.
try {
  const ovladac = new AbortController()
  const cas = setTimeout(() => ovladac.abort(), 6000)
  const odpoved = await fetch(`${BASE}/`, { signal: ovladac.signal })
  clearTimeout(cas)
  if (!odpoved.ok) console.error(`⚠  preview ${BASE}/ odpovedá ${odpoved.status} — prehliadačové kontroly budú ❌`)
} catch (e) {
  console.error(`⚠  preview ${BASE}/ neodpovedá (${e && e.message ? e.message : e}) — všetky prehliadačové kontroly budú ❌ s týmto dôvodom`)
}

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })

async function novyKontext(vp, reduced = false) {
  return browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
}

/** Načíta cestu, prebudí ju scrollom a vráti meranie + chyby konzoly. */
async function nacitaj(ctx, cesta, { shot = null } = {}) {
  const page = await ctx.newPage()
  const chyby = []
  page.on('pageerror', (e) => chyby.push(`pageerror: ${(e && e.message) || e}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') chyby.push(`console.error: ${msg.text().slice(0, 160)}`)
  })
  await page.goto(urlCesty(cesta), { waitUntil: 'load', timeout: 25000 })
  await page.waitForTimeout(800)
  await prebudStranku(page)
  const m = await page.evaluate(meranieStranky, {})
  if (shot) {
    await page.screenshot({ path: shot, fullPage: true, type: 'jpeg', quality: 70 })
  }
  return { page, m, chyby }
}

const merania = {} // merania[cesta][viewport] = { m, chyby, kontrast, farbyZle }

for (const vp of VIEWPORTY) {
  const ctx = await novyKontext(vp)
  for (const cesta of CESTY) {
    const zaznam = { m: null, chyby: [], kontrast: null, farbyZle: [], chyba: null }
    try {
      const shot = SHOTS && (vp.meno === '1440' || vp.meno === '390') ? join(SHOTS, `${TAG}-${slugCesty(cesta)}-${vp.meno}.jpeg`) : null
      const { page, m, chyby } = await nacitaj(ctx, cesta, { shot })
      zaznam.m = m
      zaznam.chyby = chyby
      // B7: render potrebujeme len vtedy, keď je pod textom fotka, gradient alebo scrim
      const potrebujePixel = m.texty.some((t) => t.potrebujePixel)
      let png = null
      if (potrebujePixel) {
        try {
          png = PNG.sync.read(await page.screenshot({ fullPage: true, type: 'png' }))
        } catch (e) {
          zaznam.chyba = `render pre B7 sa nepodaril: ${e.message}`
        }
      }
      zaznam.kontrast = vyhodnotKontrast(m, png)
      zaznam.farbyZle = vyhodnotFarby(m)
      // výrez hero na domove
      if (SHOTS && cesta === '/' && (vp.meno === '1440' || vp.meno === '390')) {
        const hero = await page.$('[data-hero], #uvod, main section')
        if (hero) await hero.screenshot({ path: join(SHOTS, `${TAG}-domov-hero-${vp.meno}.jpeg`), type: 'jpeg', quality: 70 })
      }
      await page.close()
    } catch (e) {
      zaznam.chyba = (e && e.message ? e.message : String(e)).slice(0, 200)
    }
    merania[cesta] = merania[cesta] || {}
    merania[cesta][vp.meno] = zaznam
  }
  await ctx.close()
}

// ---------------------------------------------------------------- kontroly na každej ceste
const M = (cesta, vp) => {
  const z = merania[cesta] && merania[cesta][vp]
  if (!z) throw new Error(`meranie ${cesta} @${vp} chýba`)
  if (z.chyba) throw new Error(`${cesta} @${vp}: ${z.chyba}`)
  if (!z.m) throw new Error(`${cesta} @${vp}: stránka sa nenačítala`)
  return z
}

const NAP = { adresa: 'Borová 3295/36', telefon: '+421 911 87 87 89', mail: 'info@cestneprvky.sk' }

for (const cesta of CESTY) {
  skontroluj('G0', cesta, () => {
    const vsetky = []
    for (const vp of VIEWPORTY) {
      const z = merania[cesta] && merania[cesta][vp.meno]
      if (!z) continue
      if (z.chyba) vsetky.push(`@${vp.meno} ${z.chyba}`)
      vsetky.push(...z.chyby.map((c) => `@${vp.meno} ${c}`))
    }
    return { ok: vsetky.length === 0, text: 'bez pageerror a console.error na 1440/768/390', detail: `${vsetky.length}×: ${skratka(vsetky, 3)}` }
  })

  skontroluj('F4', cesta, () => {
    const { m } = M(cesta, '1440')
    const s = m.seo
    const noindex = /noindex/.test(s.robots || '')
    // Neprázdny `alt` je povinný; jediná výnimka je vedome dekoratívna fotka
    // (`aria-hidden` predok alebo role=presentation), kde je správne `alt=""`.
    const bezAltu = m.obrazky.filter((i) => !i.dekorativny && (!i.maAlt || !i.alt.trim())).map((i) => `${i.src || i.cesta}`)
    const dekorBezAtributu = m.obrazky.filter((i) => i.dekorativny && !i.maAlt).map((i) => `${i.src || i.cesta} (dekoratívna, chýba alt="")`)
    const dekor = m.obrazky.filter((i) => i.dekorativny).length
    const ok = noindex && s.lang === 'sk' && s.h1Pocet === 1 && s.title.length <= 70 && (s.description || '').length <= 160 && (s.description || '').length > 0 && bezAltu.length === 0 && dekorBezAtributu.length === 0
    return {
      ok,
      text: `noindex, lang=sk, 1× H1, title ${s.title.length}/70, description ${(s.description || '').length}/160, alt na ${m.obrazky.length - dekor} fotkách (${dekor} dekoratívnych pod aria-hidden má správne alt="")`,
      detail: `robots="${s.robots}", lang=${s.lang}, h1=${s.h1Pocet} (${skratka(s.h1Texty, 2)}), title ${s.title.length}, desc ${(s.description || '').length}, bez altu: ${skratka([...bezAltu, ...dekorBezAtributu], 4) || '—'}`,
    }
  })

  skontroluj('F5', cesta, () => {
    const { m } = M(cesta, '1440')
    const bezRozmerov = m.obrazky.filter((i) => !i.w || !i.h).map((i) => `${i.src || i.cesta} width=${i.w} height=${i.h}`)
    const bezLazy = m.obrazky.filter((i) => i.docTop >= m.rozmery.innerH && i.loading !== 'lazy').map((i) => `${i.src || i.cesta} @y=${i.docTop} loading=${i.loading}`)
    return {
      ok: bezRozmerov.length === 0 && bezLazy.length === 0,
      text: `${m.obrazky.length} fotiek má width+height, mimo prvej obrazovky všetky loading=lazy`,
      detail: `bez rozmerov ${bezRozmerov.length}: ${skratka(bezRozmerov, 3)}; bez lazy ${bezLazy.length}: ${skratka(bezLazy, 3)}`,
    }
  })

  skontroluj('D1', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const { m } = M(cesta, vp.meno)
      if (m.rozmery.scrollW !== m.rozmery.innerW) {
        zle.push(`@${vp.meno}: scrollWidth ${m.rozmery.scrollW} ≠ innerWidth ${m.rozmery.innerW}; prečnieva ${skratka(m.pretekajuce.map((p) => `${p.cesta} do ${p.right}px`), 2)}`)
      }
    }
    return { ok: zle.length === 0, text: 'bez horizontálneho overflow na 1440/768/390', detail: zle.join(' | ') }
  })

  skontroluj('SADZBA', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const { m } = M(cesta, vp.meno)
      const n = (m.sadzbaZle || []).length
      if (n) zle.push(`@${vp.meno}: ${n}× ${skratka(m.sadzbaZle, 2)}`)
    }
    return {
      ok: zle.length === 0,
      text: 'slovenská sadzba: žiadny riadok nekončí jednopísmenovou predložkou ani spojkou',
      detail: zle.join(' | '),
    }
  })

  skontroluj('D2', cesta, () => {
    const { m } = M(cesta, '390')
    const zle = m.male.map((s) => `${s.cesta} „${s.popis}“ ${s.w}×${s.h}px`)
    return { ok: zle.length === 0, text: 'klikacie prvky ≥ 44 px na 390 (mimo inline odkazov v texte)', detail: `${zle.length}×: ${skratka(zle, 4)}` }
  })

  skontroluj('D3', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const { m } = M(cesta, vp.meno)
      for (const f of m.maleFonty) zle.push(`@${vp.meno} ${f.cesta} ${f.fs}px`)
    }
    return { ok: zle.length === 0, text: 'input/select/textarea ≥ 16 px', detail: `${zle.length}×: ${skratka(zle, 4)}` }
  })

  skontroluj('B2r', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const { m } = M(cesta, vp.meno)
      for (const t of m.tiene) zle.push(`@${vp.meno} ${t.cesta}: ${t.tien}`)
    }
    return { ok: zle.length === 0, text: 'v renderi 0 prvkov s box-shadow (výnimka DemoBadge)', detail: `${zle.length}×: ${skratka(zle, 3)}` }
  })

  skontroluj('B4r', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const { m } = M(cesta, vp.meno)
      for (const r of m.rezy) zle.push(`@${vp.meno} ${r.cesta} fw=${r.fw} „${r.text}“`)
    }
    return { ok: zle.length === 0, text: 'v renderi 0 prvkov s font-weight ≥ 700', detail: `${zle.length}×: ${skratka(zle, 3)}` }
  })

  skontroluj('B3r', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const z = M(cesta, vp.meno)
      for (const f of z.farbyZle) zle.push(`@${vp.meno} ${f}`)
    }
    const unik = [...new Set(zle)]
    return {
      ok: unik.length === 0,
      text: `všetky farby textu, pozadia a rámov sú tokeny z tokens.css (tolerancia ΔRGB ≤ ${TOL_FARBA}; povolené aj lineárne zmesi dvoch tokenov = color-mix a scrimy)`,
      detail: `${unik.length} farieb mimo tokenov (tolerancia ΔRGB ≤ ${TOL_FARBA}): ${skratka(unik, 4)}`,
    }
  })

  skontroluj('B5', cesta, () => {
    const { m } = M(cesta, '1440')
    if (!m.pasma.length) return { ok: false, text: 'rytmus pásiem sa nedá zmerať', detail: `v <main> nie je ani jeden [data-pasmo]; sekcie bez pásma: ${skratka(m.sekcieBezPasma, 4) || '—'}` }
    const dvojice = []
    for (let i = 1; i < m.pasma.length; i += 1) {
      if (m.pasma[i].pasmo === 'tmava' && m.pasma[i - 1].pasmo === 'tmava') dvojice.push(`${m.pasma[i - 1].id} → ${m.pasma[i].id}`)
    }
    const ok = dvojice.length === 0 && m.sekcieBezPasma.length === 0
    return {
      ok,
      text: `rytmus pásiem: ${m.pasma.map((p) => p.pasmo[0]).join('')} (${m.pasma.length} pásiem vrátane pätičky, ${m.vnoreneSekcie} vnorených sekcií sa do rytmu neráta)`,
      detail: `dve tmavé za sebou: ${dvojice.join(', ') || '—'}; vrchné sekcie bez data-pasmo: ${skratka(m.sekcieBezPasma, 4) || '—'}`,
    }
  })

  skontroluj('ALIGN', cesta, () => {
    const zle = []
    for (const vp of VIEWPORTY) {
      const { m } = M(cesta, vp.meno)
      if (!m.zarovnanie.length) {
        zle.push(`@${vp.meno}: v <main> nie je ani jedna <section>`)
        continue
      }
      for (const z of m.zarovnanie) {
        if (z.chyba) zle.push(`@${vp.meno} ${z.sekcia}: ${z.chyba}`)
        else if (Math.abs(z.rozdiel) > TOL_ALIGN) zle.push(`@${vp.meno} ${z.sekcia}: ${z.dieta} má left ${z.skutocne}px, kontajner ${z.ocakavane}px, odchýlka ${z.rozdiel > 0 ? '+' : ''}${z.rozdiel}px`)
      }
    }
    const pocet = (merania[cesta]['1440'].m && merania[cesta]['1440'].m.zarovnanie.length) || 0
    return { ok: zle.length === 0, text: `ľavé hrany ${pocet} sekcií sedia na kontajneri (tolerancia ${TOL_ALIGN} px)`, detail: `${zle.length}×: ${skratka(zle, 4)}` }
  })

  skontroluj('B7', cesta, () => {
    const zle = []
    const nemerane = []
    let najhorsi = { cr: Infinity, text: '' }
    let pocet = 0
    for (const vp of VIEWPORTY) {
      const z = M(cesta, vp.meno)
      if (!z.kontrast) {
        nemerane.push(`@${vp.meno}: kontrast sa nezmeral`)
        continue
      }
      pocet += z.kontrast.pocet
      if (z.kontrast.najhorsi.cr < najhorsi.cr) najhorsi = z.kontrast.najhorsi
      zle.push(...z.kontrast.zle.map((x) => `@${vp.meno} ${x}`))
      nemerane.push(...z.kontrast.nemerane.map((x) => `@${vp.meno} ${x}`))
    }
    return {
      ok: zle.length === 0 && nemerane.length === 0,
      text: `${pocet} textových prvkov: telo ≥ 4,5:1, veľký text (≥ 24 px, alebo ≥ 19 px pri reze 600+) ≥ 3:1, najhorší nameraný ${Number.isFinite(najhorsi.cr) ? najhorsi.cr.toFixed(2) : '—'}:1 („${najhorsi.text}“)`,
      detail: `pod limitom ${zle.length}: ${skratka(zle, 3)}${nemerane.length ? ` · nezmerané ${nemerane.length}: ${skratka(nemerane, 2)}` : ''}`,
    }
  })

  skontroluj('NAVv5', cesta, () => {
    const { m } = M(cesta, '1440')
    if (!m.nav) return { ok: false, text: 'navigácia sa nenašla', detail: 'v <header> nie je <nav>' }
    const pocetOk = m.nav.length === 5
    const aktivne = m.nav.filter((a) => a.current === 'page')
    const jeSluzba = cesta === '/sluzby' || cesta.startsWith('/sluzby/')
    const ocakavanaAktivna = VSETKY_CESTY.includes(cesta) && cesta !== '/'
    let aktivnaOk = true
    let aktivnaDetail = ''
    if (ocakavanaAktivna) {
      const chcem = jeSluzba ? 'Služby' : (m.nav.find((a) => (a.href || '').endsWith(cesta)) || {}).text
      aktivnaOk = aktivne.length === 1 && (!chcem || aktivne[0].text === chcem)
      aktivnaDetail = `aktívne [${aktivne.map((a) => a.text).join(', ') || '—'}], očakávam „${chcem || '?'}“`
    } else {
      aktivnaOk = aktivne.length === 0
      aktivnaDetail = `mimo navigácie nemá byť aria-current, je: [${aktivne.map((a) => a.text).join(', ') || '—'}]`
    }
    // mŕtve odkazy v pätičke
    const zlyOdkaz = []
    if (!m.patickaOdkazy) zlyOdkaz.push('<footer> na stránke nie je')
    else {
      const zaklad = new global.URL(BASE).pathname.replace(/\/$/, '')
      for (const o of m.patickaOdkazy) {
        const h = o.href
        if (!h) {
          zlyOdkaz.push(`„${o.text}“ bez href`)
          continue
        }
        if (/^(tel:|mailto:|https?:\/\/|\/\/)/.test(h)) continue
        const bezZakladu = h.startsWith(zaklad) ? h.slice(zaklad.length) || '/' : h
        const cistá = bezZakladu.split('?')[0].split('#')[0].replace(/\/$/, '') || '/'
        if (!VSETKY_CESTY.includes(cistá)) zlyOdkaz.push(`„${o.text}“ → ${h} (cesta ${cistá} neexistuje)`)
      }
    }
    return {
      ok: pocetOk && aktivnaOk && zlyOdkaz.length === 0,
      text: `hlavná navigácia 5 položiek (${m.nav.map((a) => a.text).join(', ')}), aria-current sedí, pätička bez mŕtveho odkazu (${(m.patickaOdkazy || []).length} odkazov)`,
      detail: `položiek ${m.nav.length} (má byť 5); ${aktivnaDetail}; mŕtve odkazy ${zlyOdkaz.length}: ${skratka(zlyOdkaz, 3)}`,
    }
  })

  skontroluj('NAPv5', cesta, () => {
    const { m } = M(cesta, '1440')
    if (m.patickaText == null) return { ok: false, text: 'NAP sa nedá overiť', detail: 'na stránke nie je <footer>' }
    const chyba = Object.entries(NAP).filter(([, v]) => !m.patickaText.includes(v)).map(([k, v]) => `${k}: „${v}“`)
    return { ok: chyba.length === 0, text: 'NAP (adresa, telefón, e-mail) je v pätičke', detail: `chýba v pätičke: ${chyba.join(', ')}` }
  })
}

// ---------------------------------------------------------------- kontroly viazané na stránky
const maCestu = (c) => CESTY.includes(c)

// --- C1 hero
if (maCestu('/')) {
  skontroluj('C1', '/', () => {
    const d = M('/', '1440').m
    const mo = M('/', '390').m
    if (!d.hero || !mo.hero) return { ok: false, text: 'hero sa nenašlo', detail: 'chýba [data-hero] aj #uvod aj main section' }
    const rozdielD = d.hero.vyska - d.rozmery.innerH
    const rozdielM = mo.hero.vyska - mo.rozmery.innerH
    const zdroj = `${d.hero.trieda} ${d.hero.inlineStyl}`
    const maSvh = /\b(min-h-\[[^\]]*svh\]|min-height:\s*[\d.]+svh)/.test(zdroj) || /svh/.test(zdroj)
    const maVh = /(?<![sdl])vh\b/.test(zdroj)
    const okVyska = Math.abs(rozdielD) <= TOL_HERO && Math.abs(rozdielM) <= TOL_HERO
    return {
      ok: okVyska && maSvh && !maVh,
      text: `hero = 1 obrazovka (1440: ${d.hero.vyska}/${d.rozmery.innerH}, 390: ${mo.hero.vyska}/${mo.rozmery.innerH}), min-height v svh`,
      detail: `1440 ${d.hero.vyska}/${d.rozmery.innerH} (Δ${rozdielD}), 390 ${mo.hero.vyska}/${mo.rozmery.innerH} (Δ${rozdielM}), tolerancia ${TOL_HERO}px; svh v zdroji: ${maSvh}, holé vh: ${maVh}; trieda hero: ${d.hero.trieda.slice(0, 120)}`,
    }
  })
}

// --- C3/C4 hlavička, C5 video, RMv5 reduced motion
async function hlavickaAVideo() {
  const vp = VIEWPORTY[0]
  const ctx = await novyKontext(vp)
  const out = { domovTop: null, domovScroll: null, sluzbyTop: null, video: null, poster: null, chyby: [] }
  try {
    const page = await ctx.newPage()
    page.on('pageerror', (e) => out.chyby.push(`pageerror: ${(e && e.message) || e}`))
    await page.goto(urlCesty('/'), { waitUntil: 'load', timeout: 25000 })
    await page.waitForTimeout(2600)
    const citaj = () =>
      page.evaluate(() => {
        const h = document.querySelector('header')
        const v = document.querySelector('[data-hero-video]') || document.querySelector('main video')
        const hero = document.querySelector('[data-hero], #uvod, main section')
        const img = hero ? hero.querySelector('img') : null
        return {
          bg: h ? getComputedStyle(h).backgroundColor : null,
          color: h ? getComputedStyle(h).color : null,
          position: h ? getComputedStyle(h).position : null,
          scrollY: Math.round(window.scrollY),
          video: v ? { muted: v.muted, loop: v.loop, playsInline: v.playsInline, paused: v.paused, readyState: v.readyState, preload: v.preload } : null,
          poster: img ? { src: (img.getAttribute('src') || '').split('/').pop(), fp: img.getAttribute('fetchpriority') } : null,
        }
      })
    out.domovTop = await citaj()
    out.video = out.domovTop.video
    out.poster = out.domovTop.poster
    await page.evaluate(() => {
      if (window.__lenis) window.__lenis.scrollTo(400, { immediate: true })
      window.scrollTo(0, 400)
    })
    await page.waitForTimeout(900)
    out.domovScroll = await citaj()
    await page.goto(urlCesty('/sluzby'), { waitUntil: 'load', timeout: 25000 })
    await page.waitForTimeout(900)
    out.sluzbyTop = await citaj()
    await page.close()
  } finally {
    await ctx.close()
  }
  return out
}

let HV = null
if (maCestu('/')) {
  try {
    HV = await hlavickaAVideo()
  } catch (e) {
    HV = { chyba: e.message }
  }

  skontroluj('C3', '/', () => {
    if (!HV || HV.chyba) return { ok: false, text: 'hlavičku sa nepodarilo zmerať', detail: HV ? HV.chyba : 'meranie nebežalo' }
    const t = HV.domovTop
    const s = HV.domovScroll
    const priehladna = t.bg === 'rgba(0, 0, 0, 0)' || t.bg === 'transparent'
    const plna = s.bg !== 'rgba(0, 0, 0, 0)' && s.bg !== 'transparent'
    return {
      ok: t.position === 'fixed' && priehladna && plna && s.scrollY >= 24,
      text: `hlavička fixed, nad hero priehľadná (${t.bg}), po ${s.scrollY} px plná (${s.bg})`,
      detail: `position=${t.position}, bg pred scrollom ${t.bg}, po scrolle (${s.scrollY} px) ${s.bg}`,
    }
  })

  skontroluj('C4', '/', () => {
    if (!HV || HV.chyba) return { ok: false, text: 'farbu textu hlavičky sa nepodarilo zmerať', detail: HV ? HV.chyba : 'meranie nebežalo' }
    // Hlavička sa neriadi cestou, ale prvým pásmom stránky: nad tmavým je
    // priehľadná s bielym textom, nad svetlým plná s tmavým. Podstránky majú
    // od 26. 8. 2026 tmavú `StranHlavicka`, takže sa na `/sluzby` očakáva
    // to isté správanie ako na `/` — a 404 (svetlé pásmo) overuje druhú vetvu.
    const biela = HV.domovTop.color === 'rgb(255, 255, 255)'
    const tmava = HV.domovScroll.color === 'rgb(38, 41, 44)'
    const sluzbyBiela = HV.sluzbyTop.color === 'rgb(255, 255, 255)'
    const sluzbyPriehladna = HV.sluzbyTop.bg === 'rgba(0, 0, 0, 0)' || HV.sluzbyTop.bg === 'transparent'
    return {
      ok: biela && tmava && sluzbyBiela && sluzbyPriehladna && HV.sluzbyTop.scrollY === 0,
      text: 'nad tmavým pásmom biely text a priehľadné pozadie (/ aj /sluzby), po scrolle rgb(38, 41, 44)',
      detail: `/ hore color=${HV.domovTop.color}, / po scrolle color=${HV.domovScroll.color}, /sluzby pri scrollY=${HV.sluzbyTop.scrollY}: bg=${HV.sluzbyTop.bg} color=${HV.sluzbyTop.color}`,
    }
  })
}

async function reducedMotionDomov() {
  const ctx = await novyKontext(VIEWPORTY[0], true)
  const out = { chyby: [] }
  try {
    const page = await ctx.newPage()
    page.on('pageerror', (e) => out.chyby.push(`pageerror: ${(e && e.message) || e}`))
    page.on('console', (m) => {
      if (m.type() === 'error') out.chyby.push(`console.error: ${m.text().slice(0, 140)}`)
    })
    await page.goto(urlCesty('/'), { waitUntil: 'load', timeout: 25000 })
    await page.waitForTimeout(1500)
    Object.assign(
      out,
      await page.evaluate(() => ({
        video: !!(document.querySelector('[data-hero-video]') || document.querySelector('main video')),
        progres: !!document.querySelector('[data-scroll-progress]'),
        sticky: !!document.querySelector('[data-sticky], #technologie'),
      })),
    )
    // sticky sekcia: H2 musí byť po scrolle na ňu vo viewporte
    out.h2 = await page.evaluate(async () => {
      const sec = document.querySelector('[data-sticky]') || document.getElementById('technologie')
      if (!sec) return { ok: false, dovod: 'sticky sekcia sa nenašla ([data-sticky] ani #technologie)' }
      window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY + 100)
      await new Promise((r) => setTimeout(r, 600))
      const h2 = sec.querySelector('h2')
      if (!h2) return { ok: false, dovod: 'sticky sekcia nemá <h2>' }
      const r = h2.getBoundingClientRect()
      return { ok: r.top >= 0 && r.bottom <= window.innerHeight && r.height > 0, top: Math.round(r.top), bottom: Math.round(r.bottom), vh: window.innerHeight }
    })
    await page.close()
  } finally {
    await ctx.close()
  }
  return out
}

let RM = null
if (maCestu('/')) {
  try {
    RM = await reducedMotionDomov()
  } catch (e) {
    RM = { chyba: e.message }
  }

  skontroluj('C5', '/', () => {
    if (!HV || HV.chyba) return { ok: false, text: 'video sa nepodarilo zmerať', detail: HV ? HV.chyba : 'meranie nebežalo' }
    const v = HV.video
    const m390 = M('/', '390').m.video
    const rmVideo = RM && !RM.chyba ? RM.video : null
    const hraje = !!v && !v.paused && v.readyState > 2
    const posterOk = !!HV.poster && HV.poster.fp === 'high'
    const ok = hraje && v.muted && v.loop && v.playsInline && !m390 && rmVideo === false && posterOk
    return {
      ok,
      text: `video na 1440 hrá (muted/loop/playsInline), na 390 ani pri reduced-motion neexistuje, poster fetchpriority=high`,
      detail: `1440: ${v ? JSON.stringify(v) : 'video nie je v DOM'}; 390 video: ${!!m390}; reduced-motion video: ${rmVideo === null ? 'nezmerané' : rmVideo}; poster: ${JSON.stringify(HV.poster)}`,
    }
  })

  skontroluj('RMv5', '/', () => {
    if (!RM || RM.chyba) return { ok: false, text: 'reduced-motion vetva sa nepodarila zmerať', detail: RM ? RM.chyba : 'meranie nebežalo' }
    const h2ok = RM.h2 && RM.h2.ok
    const ok = RM.chyby.length === 0 && RM.video === false && RM.progres === false && h2ok
    return {
      ok,
      text: 'pri prefers-reduced-motion: 0 chýb, žiadne video, žiadny scroll-progress, H2 sticky sekcie vo viewporte',
      detail: `chyby ${RM.chyby.length} (${skratka(RM.chyby, 2)}), video ${RM.video}, progres ${RM.progres}, H2: ${JSON.stringify(RM.h2)}`,
    }
  })
}

// --- ROUTEv5 prechod medzi routami
if (maCestu('/') && maCestu('/sluzby')) {
  await skontrolujAsync('ROUTEv5', '/', async () => {
    const ctx = await novyKontext(VIEWPORTY[0])
    try {
      const page = await ctx.newPage()
      const chyby = []
      page.on('pageerror', (e) => chyby.push(`pageerror: ${(e && e.message) || e}`))
      await page.goto(urlCesty('/'), { waitUntil: 'load', timeout: 25000 })
      await page.waitForTimeout(900)
      const pred = await page.evaluate(() => ({ url: location.pathname, h1: (document.querySelector('h1') || {}).textContent || null }))
      await page.evaluate(() => window.scrollTo(0, 600))
      await page.waitForTimeout(400)
      const odkaz = page.locator('header nav a', { hasText: 'Služby' }).first()
      if ((await odkaz.count()) === 0) return { ok: false, text: 'prechod routov sa nedá overiť', detail: 'v hlavičke nie je odkaz „Služby“' }
      await odkaz.click()
      await page.waitForTimeout(1400)
      const po = await page.evaluate(() => {
        const obal = document.querySelector('#obsah > *')
        return {
          url: location.pathname,
          h1: (document.querySelector('h1') || {}).textContent || null,
          scrollY: Math.round(window.scrollY),
          fokus: document.activeElement ? document.activeElement.id || document.activeElement.tagName : null,
          transform: obal ? getComputedStyle(obal).transform : 'obal #obsah > * neexistuje',
        }
      })
      const ok = po.url !== pred.url && po.h1 !== pred.h1 && po.scrollY === 0 && po.fokus === 'obsah' && po.transform === 'none' && chyby.length === 0
      return {
        ok,
        text: `klik na „Služby“: URL ${pred.url} → ${po.url}, H1 sa zmenil, scrollY 0, fokus na main#obsah, transform: none`,
        detail: `url ${pred.url} → ${po.url}; h1 „${pred.h1}“ → „${po.h1}“; scrollY ${po.scrollY}; fokus ${po.fokus} (má byť „obsah“); transform ${po.transform}; chyby ${chyby.length}: ${skratka(chyby, 2)}`,
      }
    } finally {
      await ctx.close()
    }
  })
}

// --- DIALOGv5 dialóg obhliadky
await skontrolujAsync('DIALOGv5', maCestu('/') ? '/' : CESTY[0], async () => {
  const cesta = maCestu('/') ? '/' : CESTY[0]
  const ctx = await novyKontext(VIEWPORTY[0])
  const zlyBod = []
  try {
    const page = await ctx.newPage()
    await page.goto(urlCesty(cesta), { waitUntil: 'load', timeout: 25000 })
    await page.waitForTimeout(900)
    await prebudStranku(page)
    const otvoreny = () => page.evaluate(() => !!document.querySelector('[role="dialog"][data-state="open"]'))
    // Podľa `data-cta-obhliadka`, nie podľa textu: filter na /obhliadk/i
    // chytal aj krok Postupu „Dopyt a obhliadka“, ktorý je prepínač kroku a
    // dialóg otvárať NEMÁ — kontrola potom hlásila 3/4 na fungujúcom webe.
    const spustace = page.locator('[data-cta-obhliadka]:visible')
    const pocet = await spustace.count()
    if (pocet === 0) zlyBod.push('na stránke nie je ani jedno tlačidlo s `data-cta-obhliadka`')
    let otvorilo = 0
    for (let i = 0; i < pocet; i += 1) {
      const t = spustace.nth(i)
      const popis = (await t.textContent()).trim().slice(0, 32)
      try {
        await t.scrollIntoViewIfNeeded()
        await t.click({ timeout: 4000 })
        await page.waitForTimeout(450)
        if (await otvoreny()) otvorilo += 1
        else zlyBod.push(`CTA „${popis}“ (#${i + 1}) dialóg neotvorilo`)
        await page.keyboard.press('Escape')
        await page.waitForTimeout(350)
      } catch (e) {
        zlyBod.push(`CTA „${popis}“ (#${i + 1}) sa nedá kliknúť: ${e.message.split('\n')[0].slice(0, 70)}`)
      }
    }
    // Esc, scrim, fokus, scroll-lock, tiene — na prvom spúšťači
    let esc = null
    let scrim = null
    let fokus = null
    let zamok = null
    let tiene = null
    if (pocet > 0) {
      const prvy = spustace.first()
      await prvy.scrollIntoViewIfNeeded()
      await prvy.click()
      await page.waitForTimeout(500)
      const y0 = await page.evaluate(() => Math.round(window.scrollY))
      tiene = await page.evaluate(() =>
        [...document.querySelectorAll('[role="dialog"], [role="dialog"] *')].filter((e) => {
          const s = getComputedStyle(e).boxShadow
          return s && s !== 'none' && !/^(rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?)+$/.test(s)
        }).length,
      )
      await page.mouse.wheel(0, 600)
      await page.waitForTimeout(400)
      const y1 = await page.evaluate(() => Math.round(window.scrollY))
      const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow)
      zamok = { y0, y1, overflow, ok: y0 === y1 }
      await page.keyboard.press('Escape')
      await page.waitForTimeout(450)
      esc = !(await otvoreny())
      fokus = await page.evaluate(() => (document.activeElement ? (document.activeElement.textContent || '').trim().slice(0, 32) : null))
      await prvy.click()
      await page.waitForTimeout(450)
      await page.mouse.click(20, Math.round(VIEWPORTY[0].height / 2))
      await page.waitForTimeout(450)
      scrim = !(await otvoreny())
      if (!scrim) await page.keyboard.press('Escape')
    }
    // mobil: celoobrazovkový panel
    let mobil = null
    const mctx = await novyKontext(VIEWPORTY[2])
    try {
      const mp = await mctx.newPage()
      await mp.goto(urlCesty(cesta), { waitUntil: 'load', timeout: 25000 })
      await mp.waitForTimeout(900)
      const mt = mp.locator('button:visible').filter({ hasText: /obhliadk/i }).first()
      if ((await mt.count()) > 0) {
        await mt.scrollIntoViewIfNeeded()
        await mt.click()
        await mp.waitForTimeout(600)
        mobil = await mp.evaluate(() => {
          const d = document.querySelector('[role="dialog"][data-state="open"]')
          if (!d) return null
          const r = d.getBoundingClientRect()
          return { w: Math.round(r.width), h: Math.round(r.height), vw: window.innerWidth, vh: window.innerHeight }
        })
      } else {
        // menu môže spúšťač skrývať za hamburgerom
        const ham = mp.locator('button[aria-controls="mobilne-menu"]')
        if ((await ham.count()) > 0) {
          await ham.click()
          await mp.waitForTimeout(400)
          const mt2 = mp.locator('button:visible').filter({ hasText: /obhliadk/i }).first()
          if ((await mt2.count()) > 0) {
            await mt2.click()
            await mp.waitForTimeout(600)
            mobil = await mp.evaluate(() => {
              const d = document.querySelector('[role="dialog"][data-state="open"]')
              if (!d) return null
              const r = d.getBoundingClientRect()
              return { w: Math.round(r.width), h: Math.round(r.height), vw: window.innerWidth, vh: window.innerHeight }
            })
          }
        }
      }
    } finally {
      await mctx.close()
    }
    const mobilOk = !!mobil && mobil.w >= mobil.vw - 1 && mobil.h >= mobil.vh - 40
    const ok = pocet > 0 && otvorilo === pocet && esc === true && scrim === true && fokus !== null && /obhliadk/i.test(fokus || '') && zamok && zamok.ok && tiene === 0 && mobilOk
    return {
      ok,
      text: `${otvorilo}/${pocet} CTA otvára dialóg, Esc aj scrim zatvárajú, fokus späť na spúšťač, scroll zamknutý, 0 tieňov, na 390 celoobrazovkový panel`,
      detail: `CTA ${otvorilo}/${pocet}${zlyBod.length ? ` (${skratka(zlyBod, 3)})` : ''}; Esc zavrel ${esc}; scrim zavrel ${scrim}; fokus po zavretí „${fokus}“; scroll-lock ${JSON.stringify(zamok)}; tiene ${tiene}; mobil ${JSON.stringify(mobil)}`,
    }
  } finally {
    await ctx.close()
  }
})

// --- SLUZBYv5
if (maCestu('/sluzby')) {
  await skontrolujAsync('SLUZBYv5', '/sluzby', async () => {
    const ctx = await novyKontext(VIEWPORTY[0])
    let karty = null
    let neznameSlugy = []
    try {
      const page = await ctx.newPage()
      await page.goto(urlCesty('/sluzby'), { waitUntil: 'load', timeout: 25000 })
      await page.waitForTimeout(800)
      await prebudStranku(page)
      karty = await page.evaluate(() => {
        const odkazy = [...document.querySelectorAll('main a[href]')].map((a) => a.getAttribute('href')).filter((h) => /\/sluzby\/[^/]+$/.test(h))
        return [...new Set(odkazy)]
      })
      await page.close()
    } finally {
      await ctx.close()
    }
    const slugyZoStranky = karty.map((h) => h.split('/').pop())
    neznameSlugy = slugyZoStranky.filter((s) => !SLUGY.includes(s))
    const chybajuce = SLUGY.filter((s) => !slugyZoStranky.includes(s))

    // tabuľka DEBUZ na 390
    const mctx = await novyKontext(VIEWPORTY[2])
    let tab = null
    try {
      const mp = await mctx.newPage()
      await mp.goto(urlCesty('/sluzby/spomalovace-dopravy'), { waitUntil: 'load', timeout: 25000 })
      await mp.waitForTimeout(800)
      await prebudStranku(mp)
      tab = await mp.evaluate(() => {
        const t = document.querySelector('main table')
        if (!t) return { jeTabulka: false, text: document.querySelector('main') ? document.querySelector('main').textContent.replace(/\s+/g, ' ').slice(0, 200) : null }
        const okolie = t.closest('section') || t.parentElement
        const text = `${t.textContent} ${okolie ? okolie.textContent : ''}`.replace(/\s+/g, ' ')
        let obal = t.parentElement
        let scrolluje = null
        while (obal && obal !== document.body) {
          if (obal.scrollWidth > obal.clientWidth + 1) {
            scrolluje = { el: obal.tagName + '.' + (obal.getAttribute('class') || '').split(' ')[0], scrollW: obal.scrollWidth, clientW: obal.clientWidth }
            break
          }
          obal = obal.parentElement
        }
        return {
          jeTabulka: true,
          debuz: /DEBUZ/i.test(text),
          kt50: /KT\s*[–\-]?\s*50/i.test(text),
          kt35: /KT\s*[–\-]?\s*35/i.test(text),
          scrolluje,
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
        }
      })
      await mp.close()
    } finally {
      await mctx.close()
    }
    const tabOk = tab && tab.jeTabulka && tab.debuz && tab.kt50 && tab.kt35 && !tab.scrolluje && tab.scrollW === tab.innerW
    const ok = karty.length === 9 && chybajuce.length === 0 && neznameSlugy.length === 0 && tabOk
    return {
      ok,
      text: `/sluzby má ${karty.length} kariet na existujúce detaily; tabuľka DEBUZ na 390 px obsahuje KT 50 aj KT 35 bez horizontálneho scrollu`,
      detail: `kariet ${karty.length} (má byť 9), chýbajú slugy: ${chybajuce.join(', ') || '—'}, neznáme: ${neznameSlugy.join(', ') || '—'}; tabuľka: ${JSON.stringify(tab)}`,
    }
  })
}

// --- GALv5
if (maCestu('/realizacie')) {
  await skontrolujAsync('GALv5', '/realizacie', async () => {
    const ctx = await novyKontext(VIEWPORTY[0])
    try {
      const page = await ctx.newPage()
      await page.goto(urlCesty('/realizacie'), { waitUntil: 'load', timeout: 25000 })
      await page.waitForTimeout(900)
      await prebudStranku(page)
      const pocetDlazdic = () => page.evaluate(() => document.querySelectorAll('main [data-dlazdica], main figure, main a[href*="#"] img, main img').length)
      const pred = await page.evaluate(() => ({
        dlazdice: (document.querySelectorAll('main [data-dlazdica]').length || document.querySelectorAll('main figure').length || document.querySelectorAll('main img').length),
        query: location.search,
      }))
      const filtre = page.locator('main [data-filtre] button, main [role="tablist"] button, main [data-filter], main button[aria-pressed]')
      const pocetFiltrov = await filtre.count()
      let poFiltri = null
      if (pocetFiltrov > 1) {
        await filtre.nth(1).click()
        await page.waitForTimeout(800)
        poFiltri = await page.evaluate(() => ({
          dlazdice: (document.querySelectorAll('main [data-dlazdica]').length || document.querySelectorAll('main figure').length || document.querySelectorAll('main img').length),
          query: location.search,
        }))
      }
      // lightbox
      const spustac = page.locator('main [data-dlazdica], main figure button, main figure a, main button:has(img)').first()
      let lb = null
      if ((await spustac.count()) > 0) {
        await spustac.scrollIntoViewIfNeeded()
        await spustac.click({ timeout: 4000 }).catch(() => {})
        await page.waitForTimeout(700)
        lb = await page.evaluate(() => {
          const d = document.querySelector('[data-lightbox], [role="dialog"][data-state="open"]')
          if (!d) return { otvoreny: false }
          const s = getComputedStyle(d)
          const r = d.getBoundingClientRect()
          return { otvoreny: true, position: s.position, top: s.top, rectTop: Math.round(r.top) }
        })
        if (lb.otvoreny) {
          await page.keyboard.press('Escape')
          await page.waitForTimeout(600)
          lb.zavrelEsc = await page.evaluate(() => !document.querySelector('[data-lightbox], [role="dialog"][data-state="open"]'))
          lb.fokus = await page.evaluate(() => (document.activeElement ? document.activeElement.tagName + (document.activeElement.getAttribute('data-dlazdica') != null ? '[data-dlazdica]' : '') : null))
        }
      }
      await page.close()
      const filtreOk = !!poFiltri && poFiltri.query !== pred.query && poFiltri.dlazdice !== pred.dlazdice
      const lbOk = !!lb && lb.otvoreny && lb.position === 'fixed' && (lb.top === '0px' || lb.rectTop === 0) && lb.zavrelEsc === true && lb.fokus !== 'BODY'
      return {
        ok: filtreOk && lbOk,
        text: `filtre menia počet dlaždíc aj URL query; lightbox je position: fixed s top 0, Esc zatvára a vracia fokus`,
        detail: `filtrov nájdených ${pocetFiltrov} (selektory: [data-filtre] button, [role=tablist] button, [data-filter], button[aria-pressed]); pred ${JSON.stringify(pred)}, po ${JSON.stringify(poFiltri)}; lightbox ${JSON.stringify(lb)}`,
      }
    } finally {
      await ctx.close()
    }
  })
}

// --- OBSAHv5
skontroluj('OBSAHv5', '/sluzby', () => {
  if (!OBSAH) return { ok: false, text: 'obsahové pokrytie sa nedá overiť', detail: `src/content sa nenaimportoval: ${obsahChyba}` }
  // Dáta prechádzajú slovenskou sadzbou (`src/lib/sadzba.js`), takže názvy
  // obsahujú nezlomiteľné medzery. Text stránky sa tu normalizuje cez
  // `\s+`, čo NBSP zmaže, preto sa musí normalizovať aj očakávaná strana —
  // inak by sa porovnávala sadzba, nie obsah.
  const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim()
  const chyby = []
  let overene = 0
  if (maCestu('/sluzby')) {
    const z = merania['/sluzby'] && merania['/sluzby']['1440']
    if (!z || !z.m) chyby.push('/sluzby sa nenačítalo')
    else {
      overene += 1
      const text = z.m.hlavnyText || ''
      for (const s of SLUZBY)
        if (!norm(text).includes(norm(s.nazov)) && !norm(text).includes(norm(s.nazovKratky || s.nazov)))
          chyby.push(`/sluzby neobsahuje názov „${s.nazov}“`)
    }
  }
  let detailov = 0
  for (const s of SLUZBY) {
    const cesta = `/sluzby/${s.slug}`
    if (!maCestu(cesta)) continue
    const z = merania[cesta] && merania[cesta]['1440']
    if (!z || !z.m) {
      chyby.push(`${cesta} sa nenačítalo`)
      continue
    }
    detailov += 1
    overene += 1
    const h1 = z.m.seo.h1Texty
    if (h1.length !== 1 || norm(h1[0]) !== norm(s.nazov)) chyby.push(`${cesta}: H1 = ${JSON.stringify(h1)}, má byť „${s.nazov}“`)
  }
  if (overene === 0) return { ok: false, text: 'obsahové pokrytie sa neoverilo', detail: 'v --routes nie je /sluzby ani žiadny detail služby' }
  return {
    ok: chyby.length === 0,
    text: `${SLUZBY.length} názvov služieb je v texte /sluzby a všetkých ${detailov} overených detailov má H1 presne rovný názvu služby`,
    detail: `${chyby.length}×: ${skratka(chyby, 4)}`,
  }
})

await browser.close()

// ---------------------------------------------------------------- výstup
const KONTROLY_SUBOROVE = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'B1', 'B2', 'B3', 'B4', 'E4', 'F1a', 'F1b', 'F1d', 'F1e', 'S1', 'S2', 'S3']
const KONTROLY_NA_CESTU = ['G0', 'F4', 'F5', 'D1', 'SADZBA', 'D2', 'D3', 'B2r', 'B4r', 'B3r', 'B5', 'ALIGN', 'B7', 'NAVv5', 'NAPv5']
const KONTROLY_STRANKOVE = ['C1', 'C3', 'C4', 'C5', 'RMv5', 'ROUTEv5', 'DIALOGv5', 'SLUZBYv5', 'GALv5', 'OBSAHv5']

let chyb = 0
for (const v of vysledky) {
  if (!v.ok) chyb += 1
  const kde = v.route === '—' ? '' : ` [${v.route}]`
  console.log(`${v.ok ? '✅' : '❌'} ${v.id.padEnd(8)}${kde} ${v.detail}`)
}

console.log(`\n${vysledky.length - chyb}/${vysledky.length} OK · ${chyb} ❌`)
console.log(
  `Kontroly: ${KONTROLY_SUBOROVE.length} súborových + ${KONTROLY_NA_CESTU.length} na každú z ${CESTY.length} ciest + ${KONTROLY_STRANKOVE.length} viazaných na konkrétne stránky = ${vysledky.length} riadkov`,
)
console.log(`Merané na 1440×900, 768×1024 a 390×844; base ${BASE}; dist ${DIST}`)

// tabuľka podľa routov
const sirka = Math.max(12, ...CESTY.map((c) => c.length)) + 2
console.log(`\n${'CESTA'.padEnd(sirka)}${'OK'.padStart(4)}${'❌'.padStart(5)}  CHYBNÉ KONTROLY`)
const riadok = (meno, zoznam) => {
  const ok = zoznam.filter((v) => v.ok).length
  const zle = zoznam.filter((v) => !v.ok)
  console.log(`${meno.padEnd(sirka)}${String(ok).padStart(4)}${String(zle.length).padStart(4)}  ${zle.map((v) => v.id).join(', ') || '—'}`)
}
riadok('súbory (—)', vysledky.filter((v) => v.route === '—'))
for (const c of CESTY) riadok(c, vysledky.filter((v) => v.route === c))

if (JSON_OUT) {
  const cesta = JSON_OUT.startsWith('/') ? JSON_OUT : join(KOREN, JSON_OUT)
  mkdirSync(dirname(cesta), { recursive: true })
  writeFileSync(cesta, `${JSON.stringify(vysledky.map(({ id, route, ok, detail }) => ({ id, route, ok, detail })), null, 2)}\n`)
  console.log(`\nJSON: ${relative(KOREN, cesta) || cesta} (${vysledky.length} záznamov)`)
}
if (SHOTS) console.log(`Screenshoty: ${SHOTS} (${TAG}-<cesta>-{1440,390}.jpeg)`)

process.exit(chyb ? 1 : 0)

/* ----------------------------------------------------------------------------
 * ZOZNAM KONTROL (ID · kde beží · čo meria)
 *
 * SÚBOROVÉ (raz za beh; čítané zdroje: src/pages/**, src/components/layout/**,
 * src/components/kit/**, src/components/*.jsx, src/content/**, plus pre B2/B3/B4/E4
 * aj src/components/primitives/**, src/lib/**, src/styles/**, App.jsx, main.jsx.
 * Nečítané zámerne: src/sections/** (mŕtvy kód, stráži S3), src/components/ui/**
 * (radix chassis so zákazom meniť — jeho tiene a rezy chytá render B2r/B4r) a
 * DemoBadge.jsx v copy kontrolách (značka PNH, nie copy klienta).
 * Copy kontroly A1, A3, A4, A5, A6, B1 merajú text bez komentárov v kóde.)
 *   A1   copy      Žiadna em/en pomlčka v našej copy; výnimka doslovné názvy (DEBUZ® – Kölner Teller, Typ KT – 50/35, Štítky – Braillovo písmo).
 *   A2   src       Žiadne slop slová (odoslať, špičkový, komplexné riešenia, synergia, 24/7…).
 *   A3   copy      Žiadne vymyslené údaje: IČO alebo DIČ s číslom, roky skúseností, počty spokojných, recenzie, hviezdy. „IČO: [DOPLNÍ KLIENT]“ prejde.
 *   A4   copy+src  Žiadne CTA „Odoslať“ a aspoň dva `tel:` odkazy v zdroji.
 *   A5   copy      Žiadne čechizmy (které, již, ještě, zde, společnost).
 *   A6   copy      Šesť faktov klienta (názov, adresa, PSČ + mesto, e-mail, telefón, rok 2012) je v zdroji doslova.
 *   A7   src       Žiadna stopa po pôvodnej šablóne MaisonCo (Connor, Observatory, Recent Posts, lorem ipsum).
 *   B1   copy      Žiadne číslované dlaždice 01/02/03.
 *   B2   src       Žiadny `box-shadow` ani `shadow-*` v zdroji (výnimka DemoBadge).
 *   B3   src       Žiadne cudzie hexy mimo palety klienta.
 *   B4   src       Žiadny font-weight ≥ 700 v zdroji (font-bold/extrabold/black, font-weight: 700+).
 *   E4   src       Žiadny `scroll-behavior: smooth` (bije sa s Lenisom).
 *   F1a  public    Každá fotka použitá v src/content má ≤ 250 kB.
 *   F1b  public    hero.mp4 ≤ 3 MB a poster.jpg ≤ 250 kB.
 *   F1d  public    Každý `src` v src/content existuje a jeho skutočné rozmery sa zhodujú s `w`/`h` v dátach (rozdiel = budúci CLS).
 *   F1e  public    Žiadny súbor v public/assets nie je väčší než 250 kB; hero.mp4 a poster.jpg v limite.
 *   S1   dist      dist/404.html existuje a je bajt na bajt zhodné s dist/index.html (SPA fallback pre Pages).
 *   S2   content   VSETKY_CESTY má práve 15 ciest a každý slug zo SLUGY má svoju cestu.
 *   S3   src       Žiadny súbor v src/pages ani src/components neimportuje zo src/sections (mŕtvy kód).
 *
 * NA KAŽDEJ CESTE (15 ciest z VSETKY_CESTY + CESTA_404_TEST; viewporty 1440×900, 768×1024, 390×844)
 *   G0    Nula `pageerror` a nula `console.error` na všetkých troch viewportoch.
 *   F4    `noindex`, `lang="sk"`, presne 1× `<h1>`, title ≤ 70, description ≤ 160 a neprázdna, každý `<img>` má neprázdny `alt`; jediná výnimka je vedome dekoratívna fotka pod `aria-hidden="true"` alebo `role="presentation"`, tá musí mať `alt=""`.
 *   F5    Každý `<img>` má atribúty `width` aj `height`; každý `<img>` mimo prvej obrazovky má `loading="lazy"`.
 *   D1    `document.documentElement.scrollWidth === innerWidth` na 390, 768 aj 1440; pri páde vypíše prečnievajúce prvky.
 *   D2    Klikacie prvky (a, button, [role=button], select, input) majú na 390 px aspoň 44×44 px; inline odkaz v odseku je výnimka (WCAG 2.5.8).
 *   D3    `input`, `select`, `textarea` majú font-size ≥ 16 px (iOS zoom).
 *   B2r   V renderi nula prvkov so skutočným `box-shadow` (výnimka DemoBadge).
 *   B4r   V renderi nula viditeľných textových prvkov s `font-weight ≥ 700`.
 *   B3r   Žiadna vypočítaná farba textu, pozadia ani rámu mimo tokenov z tokens.css; povolené sú aj lineárne zmesi dvoch tokenov (color-mix, scrimy), tolerancia ΔRGB ≤ 8 v sRGB.
 *   B5    Poradie pásiem: sekcie `<main>` podľa `data-pasmo` plus pätička podľa jej nameraného pozadia — nikde dve `tmava` za sebou; každá vrchná `<section>` musí `data-pasmo` mať (vnorené sekcie sa do rytmu nerátajú).
 *   ALIGN Ľavý okraj prvého viditeľného potomka kontajnera každej sekcie sa rovná ľavému okraju kontajnera `max-w-[var(--container-max)]`, tolerancia 1 px. Kontajnerom môže byť aj samotná `<section>`; sekcia, ktorá kontajner nesie až vo vnorených sekciách, sa meria cez ne.
 *   B7    Kontrast reálne použitých dvojíc text/pozadie: telo ≥ 4,5:1, veľký text (≥ 24 px, alebo ≥ 19 px pri reze 600+) ≥ 3:1. Nad plnou farbou počíta presne; nad fotkou, gradientom, scrimom a pod `fixed`/`sticky`/`absolute` vrstvou vzorkuje pixely z full-page renderu tesne nad, pod a vedľa glyfov (mediány pásov, z nich najhorší). Rámy a podčiarknutie sa nevzorkujú. Kumulatívna `opacity` predkov sa do farby textu započíta. Rovnaká dvojica farieb a rezov je v hlásení jeden riadok s počtom.
 *   NAVv5 Hlavná navigácia má práve 4 položky, aktívna položka má `aria-current="page"` (na `/sluzby/<slug>` je to „Služby“), a v pätičke nie je mŕtvy odkaz — každý `href` vedie na existujúcu cestu alebo je `tel:`/`mailto:`/absolútny.
 *   SADZBA Žiadny vykreslený riadok nekončí jednopísmenovou predložkou ani spojkou (slovenská sadzba, `src/lib/sadzba.js`).
 *   NAPv5 Adresa, telefón aj e-mail sú v pätičke na tejto ceste (druhá polovica požiadavky OBSAHv5).
 *
 * VIAZANÉ NA KONKRÉTNE STRÁNKY
 *   C1       `/`   Hero je presne jedna obrazovka na 1440 aj 390 (tolerancia 2 px) a jeho `min-height` je v `svh`, nie `vh`.
 *   C3       `/`   Hlavička je `fixed`, nad hero priehľadná a po 24 px scrollu plná.
 *   C4       `/` + `/sluzby`  Nad hero je text hlavičky biely, po scrolle `rgb(38, 41, 44)`; na `/sluzby` je hlavička plná a tmavá už pri `scrollY = 0`.
 *   C5       `/`   Video hrá na 1440 (`muted`, `loop`, `playsInline`), na 390 ani pri `prefers-reduced-motion` v DOM neexistuje, poster má `fetchpriority="high"`.
 *   RMv5     `/`   Pri `prefers-reduced-motion`: 0 chýb, žiadne video, žiadny scroll-progress vlások, H2 sticky sekcie je po scrolle celé vo viewporte.
 *   ROUTEv5  `/` → `/sluzby`  Klik na položku navigácie zmení URL aj `<h1>`, `scrollY` je 0, fokus je na `<main id="obsah">` a obal prechodu má po dobehnutí `transform: none`.
 *   DIALOGv5 `/`   Každé viditeľné tlačidlo s textom „obhliadk…“ otvorí dialóg; Esc aj klik na scrim zatvárajú; fokus sa vráti na spúšťač; scroll `body` je zamknutý; dialóg má 0 tieňov; na 390 px je to celoobrazovkový panel.
 *   SLUZBYv5 `/sluzby` + `/sluzby/spomalovace-dopravy`  Prehľad má 9 kariet na existujúce detaily; tabuľka DEBUZ obsahuje na 390 px KT 50 aj KT 35 a nikde nescrolluje do strany.
 *   GALv5    `/realizacie`  Filtre menia počet dlaždíc aj URL query; lightbox sa otvára, je `position: fixed` s `top: 0`, Esc ho zatvára a vracia fokus na spúšťač.
 *   OBSAHv5  `/sluzby` + detaily  Každý z 9 názvov služieb je v texte `/sluzby` a `<h1>` každého detailu sa presne rovná poľu `nazov` tej služby.
 * -------------------------------------------------------------------------- */
