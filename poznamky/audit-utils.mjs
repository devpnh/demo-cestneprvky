/**
 * Pomocné funkcie auditu (`poznamky/audit.mjs`).
 *
 * Sem patrí všetko, čo sa dá zmerať bez prehliadača: chôdza po súboroch,
 * grep, farebná matematika (WCAG), rozmery obrázkov z hlavičky súboru a
 * množina povolených farieb odvodená z `src/styles/tokens.css`.
 *
 * Žiadne závislosti mimo Node core — audit musí bežať aj vtedy, keď je
 * `node_modules` v rozostavanom stave.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// ---------------------------------------------------------------- súbory

/** Rekurzívne vyzbiera súbory s danými príponami. Neexistujúci adresár = []. */
export function walk(dir, exts) {
  if (!existsSync(dir)) return []
  const out = []
  for (const f of readdirSync(dir)) {
    if (f === 'node_modules' || f.startsWith('.')) continue
    const p = join(dir, f)
    if (statSync(p).isDirectory()) out.push(...walk(p, exts))
    else if (exts.some((e) => f.endsWith(e))) out.push(p)
  }
  return out
}

export const read = (p) => readFileSync(p, 'utf8')

/**
 * Riadky súboru bez komentárov (blokových aj riadkových), s rovnakým počtom
 * riadkov ako originál — čísla riadkov v náleze tak stále sedia.
 *
 * Copy kontroly (pomlčky, čechizmy, vymyslené údaje) merajú text, ktorý uvidí
 * návštevník. Komentár v kóde nie je copy: bez tohto by každá poznámka
 * s pomlčkou vyrobila falošný nález a audit by sa musel zmäkčiť.
 */
export function riadkyBezKomentarov(obsah) {
  let vBloku = false
  return obsah.split('\n').map((raw) => {
    let l = raw
    if (vBloku) {
      const k = l.indexOf('*/')
      if (k === -1) return ''
      vBloku = false
      l = l.slice(k + 2)
    }
    l = l.replace(/\/\*[\s\S]*?\*\//g, '')
    const o = l.indexOf('/*')
    if (o !== -1) {
      vBloku = true
      l = l.slice(0, o)
    }
    // `//` je komentár, len ak pred ním nie je `:` (https://), úvodzovka ani spätná lomka
    const m = l.match(/(^|[^:'"`\\])\/\/.*$/)
    if (m) l = l.slice(0, m.index + (m[1] ? m[1].length : 0))
    return l
  })
}

/**
 * Grep po riadkoch. Vracia `subor:riadok: text`, aby sa každý nález dal
 * overiť bez hádania (požiadavka „údaj, ktorý sa dá overiť“).
 * `bezKomentarov` vyhodí z merania komentáre (copy kontroly).
 */
export function grepFiles(files, re, filter = () => true, koren = '', bezKomentarov = false) {
  const hits = []
  for (const f of files) {
    let obsah
    try {
      obsah = read(f)
    } catch (e) {
      hits.push(`${f}: nedá sa prečítať (${e.message})`)
      continue
    }
    const riadky = bezKomentarov ? riadkyBezKomentarov(obsah) : obsah.split('\n')
    riadky.forEach((line, i) => {
      if (re.test(line) && filter(line)) {
        const nazov = koren && f.startsWith(koren) ? f.slice(koren.length + 1) : f
        hits.push(`${nazov}:${i + 1}: ${line.trim().slice(0, 90)}`)
      }
    })
  }
  return hits
}

export const kB = (bajty) => Math.round(bajty / 1024)

// ---------------------------------------------------------------- rozmery obrázkov

/** Rozmery z hlavičky JPEG (SOFn marker). */
function jpegRozmer(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = buf[i + 1]
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    if (marker === 0xd9) return null
    const dlzka = buf.readUInt16BE(i + 2)
    const jeSOF =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    if (jeSOF) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) }
    i += 2 + dlzka
  }
  return null
}

/** Rozmery z PNG IHDR. */
function pngRozmer(buf) {
  const podpis = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (!podpis.every((b, i) => buf[i] === b)) return null
  if (buf.toString('ascii', 12, 16) !== 'IHDR') return null
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}

/** Rozmery z WebP (VP8 / VP8L / VP8X). */
function webpRozmer(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null
  const typ = buf.toString('ascii', 12, 16)
  if (typ === 'VP8X') return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1 }
  if (typ === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
  if (typ === 'VP8L') {
    const b = buf.readUInt32LE(21)
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }
  }
  return null
}

/** Skutočné rozmery obrázka z hlavičky súboru. `null` = nedá sa prečítať. */
export function rozmeryObrazka(cesta) {
  if (!existsSync(cesta)) return null
  const buf = readFileSync(cesta)
  return jpegRozmer(buf) || pngRozmer(buf) || webpRozmer(buf)
}

// ---------------------------------------------------------------- farby

export const lum = (r, g, b) => {
  const f = (c) => {
    const x = c / 255
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export const kontrastL = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

export const kontrastRGB = (a, b) => kontrastL(lum(a.r, a.g, a.b), lum(b.r, b.g, b.b))

/** `rgb(…)` / `rgba(…)` na `{r,g,b,a}`. Nezname vstupy vracajú `null`. */
export function parseRgb(s) {
  if (!s) return null
  const m = String(s).match(/-?[\d.]+/g)
  if (!m || m.length < 3) return null
  return { r: +m[0], g: +m[1], b: +m[2], a: m[3] != null ? +m[3] : 1 }
}

/** Zloženie farby s alfou nad nepriehľadným podkladom. */
export const zmiesaj = (predok, podklad) => ({
  r: predok.r * predok.a + podklad.r * (1 - predok.a),
  g: predok.g * predok.a + podklad.g * (1 - predok.a),
  b: predok.b * predok.a + podklad.b * (1 - predok.a),
  a: 1,
})

const hexNaRgb = (hex) => {
  const h = hex.replace('#', '')
  const plny = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return { r: parseInt(plny.slice(0, 2), 16), g: parseInt(plny.slice(2, 4), 16), b: parseInt(plny.slice(4, 6), 16) }
}

/**
 * Farebné tokeny z `tokens.css`: každý `--…: #hex`. K nim biela a čierna,
 * ktoré na webe vznikajú zo scrimov a z `color-mix(... , transparent)`.
 */
export function farebneTokeny(cestaTokens) {
  const out = []
  if (!existsSync(cestaTokens)) return out
  const css = read(cestaTokens)
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\b/g)) {
    const rgb = hexNaRgb(m[2].slice(0, 7))
    out.push({ nazov: m[1], hex: m[2], ...rgb })
  }
  for (const [nazov, hex] of [['biela (scrim)', '#ffffff'], ['čierna (scrim)', '#000000']]) {
    if (!out.some((t) => t.hex.toLowerCase() === hex)) out.push({ nazov, hex, ...hexNaRgb(hex) })
  }
  return out
}

/**
 * Je farba v povolenej množine?
 *
 * Povolené je: samotný token, biela, čierna a **lineárna zmes dvoch tokenov**
 * (tak vzniká `color-mix(in srgb, A x%, B)` aj prekrytie scrimom). Meria sa
 * kolmá vzdialenosť od úsečky medzi dvojicou tokenov v sRGB, takže netreba
 * vzorkovať kroky. Alfa sa ignoruje: `rgba(255,255,255,0.35)` je biela.
 */
export function povolenaFarba(rgb, tokeny, tolerancia) {
  const d = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b)
  for (const t of tokeny) if (d(rgb, t) <= tolerancia) return { ok: true, ako: t.nazov }
  for (let i = 0; i < tokeny.length; i += 1) {
    for (let j = i + 1; j < tokeny.length; j += 1) {
      const A = tokeny[i]
      const B = tokeny[j]
      const vx = B.r - A.r
      const vy = B.g - A.g
      const vz = B.b - A.b
      const dlzka2 = vx * vx + vy * vy + vz * vz
      if (dlzka2 === 0) continue
      let t = ((rgb.r - A.r) * vx + (rgb.g - A.g) * vy + (rgb.b - A.b) * vz) / dlzka2
      t = Math.max(0, Math.min(1, t))
      const p = { r: A.r + t * vx, g: A.g + t * vy, b: A.b + t * vz }
      if (d(rgb, p) <= tolerancia) return { ok: true, ako: `zmes ${A.nazov} + ${B.nazov} (${Math.round(t * 100)} %)` }
    }
  }
  return { ok: false, ako: null }
}

/** Limit kontrastu podľa veľkosti textu (WCAG AA): 3:1 pre veľký, inak 4,5:1. */
export const limitKontrastu = (fs, fw) => (fs >= 24 || (fs >= 19 && fw >= 600) ? 3 : 4.5)

/** Slug cesty pre názvy screenshotov: `/sluzby/x` → `sluzby-x`, `/` → `domov`. */
export const slugCesty = (cesta) => cesta.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-') || 'domov'
