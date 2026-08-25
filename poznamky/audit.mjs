/**
 * Mechanický audit dema demo-cestneprvky podľa STANDARDY.md.
 * Spustenie: node poznamky/audit.mjs [--shots <dir>] [--tag iterN]
 * Predpoklad: `npm run build` v koreni repa a `npx vite preview --port 4320 --strictPort` beží.
 * Výstup: riadky "✅ A1 …" / "❌ A1 … (detail)", na konci súhrn a exit code 1 pri ❌.
 */
import { chromium } from 'playwright'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'


const SITE = join(dirname(fileURLToPath(import.meta.url)), '..')
// playwright-core neexportuje ./lib/* cez "exports" — načítaj cez absolútnu cestu.
const { PNG } = createRequire(import.meta.url)(join(SITE, 'node_modules/playwright-core/lib/utilsBundle.js'))
const URL = 'http://localhost:4320/demo-cestneprvky/'
const args = process.argv.slice(2)
const shotsDir = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null
const tag = args.includes('--tag') ? args[args.indexOf('--tag') + 1] : 'audit'

const results = []
const ok = (id, msg) => results.push({ id, ok: true, msg })
const bad = (id, msg) => results.push({ id, ok: false, msg })
const check = (id, cond, okMsg, badMsg) => (cond ? ok(id, okMsg) : bad(id, badMsg))

// ---------------------------------------------------------------- súbory
function walk(dir, exts) {
  const out = []
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) out.push(...walk(p, exts))
    else if (exts.some((e) => f.endsWith(e))) out.push(p)
  }
  return out
}
const sectionFiles = walk(join(SITE, 'src/sections'), ['.jsx'])
const copyFiles = [...sectionFiles, join(SITE, 'src/content/global.json')]
const srcAll = walk(join(SITE, 'src'), ['.jsx', '.js', '.css', '.json'])
const read = (p) => readFileSync(p, 'utf8')
const grepFiles = (files, re, filter = () => true) => {
  const hits = []
  for (const f of files) read(f).split('\n').forEach((line, i) => { if (re.test(line) && filter(line)) hits.push(`${f.split('/').slice(-2).join('/')}:${i + 1}: ${line.trim().slice(0, 90)}`) })
  return hits
}

const FACT_DASH_OK = /DEBUZ|Štítky –|KT –|Kölner/
let h = grepFiles(copyFiles, /—|–/, (l) => !FACT_DASH_OK.test(l))
check('A1', h.length === 0, 'žiadne pomlčky v našej copy', `${h.length} pomlčiek: ${h.slice(0, 3).join(' | ')}`)
h = grepFiles(srcAll, /odoslať|úprimne|narovinu|ještě dnes|stvořeno|inovatívne riešeni|synergi|lídri na trhu|komplexné riešenia|špičkov|garantujeme 100|24\/7/i)
check('A2', h.length === 0, 'žiadne slop slová', `${h.length}: ${h.slice(0, 3).join(' | ')}`)
h = grepFiles(copyFiles, /\bIČO\b|\bDIČ\b|rokov skúsenost|spokojných|recenzi|hviezd|★/)
check('A3', h.length === 0, 'žiadne vymyslené údaje (IČO/DIČ/recenzie/roky)', `${h.length}: ${h.slice(0, 3).join(' | ')}`)
h = grepFiles(copyFiles, /\bOdoslať\b/)
const telCount = grepFiles(sectionFiles, /href=\{?["']?tel:|PHONE_HREF/).length
check('A4', h.length === 0 && telCount >= 2, `CTA bez „Odoslať“, tel: ${telCount}×`, `Odoslať ${h.length}×, tel ${telCount}×`)
h = grepFiles(copyFiles, /\b(které|již|ještě|zde|společnost|naše služby jsou)\b/i)
check('A5', h.length === 0, 'bez čechizmov', `${h.length}: ${h.slice(0, 3).join(' | ')}`)
const facts = ['Cestné prvky s.r.o.', 'Borová 3295/36', '010 01 Žilina', 'info@cestneprvky.sk', '+421 911 87 87 89', '2012']
const missing = facts.filter((f) => grepFiles(copyFiles, new RegExp(f.replace(/[.+]/g, '\\$&'))).length === 0)
check('A6', missing.length === 0, 'fakty doslova prítomné', `chýba: ${missing.join(', ')}`)
h = grepFiles(srcAll, /recent posts|maisonco|connor|caroline|observatory|lorem ipsum/i)
check('A7', h.length === 0, 'žiadna stopa po MaisonCo', `${h.length}: ${h.slice(0, 2).join(' | ')}`)

h = grepFiles(sectionFiles, />\s*0[1-9]\s*<|['"]0[1-9]['"]/)
check('B1', h.length === 0, 'žiadne 01/02/03 dlaždice', `${h.length}: ${h.slice(0, 2).join(' | ')}`)
h = grepFiles(sectionFiles, /box-shadow|\bshadow-(?!none)/)
check('B2', h.length === 0, 'žiadny box-shadow v sekciách', `${h.length}: ${h.slice(0, 2).join(' | ')}`)
h = grepFiles(srcAll, /#0e5c66|#f6a21c|#3970ff|#7c3aed|#a855f7|#8b5cf6/i)
check('B3', h.length === 0, 'žiadne cudzie hexy', `${h.length}: ${h.slice(0, 2).join(' | ')}`)
h = grepFiles(sectionFiles, /font-(bold|extrabold|black)|font-weight:\s*[789]00/)
check('B4', h.length === 0, 'žiadny rez ≥ 700 v sekciách', `${h.length}: ${h.slice(0, 2).join(' | ')}`)
h = grepFiles(srcAll, /scroll-behavior:\s*smooth/)
check('E4', h.length === 0, 'žiadny scroll-behavior: smooth', `${h.length}: ${h.slice(0, 2).join(' | ')}`)

// F1 média
const assetsDir = join(SITE, 'public/assets')
const usedAssets = new Set()
for (const f of sectionFiles) for (const m of read(f).matchAll(/['"`/]([A-Za-z0-9_.-]+\.(?:jpe?g|png|webp))['"`]/g)) usedAssets.add(m[1])
const heavy = [...usedAssets].filter((a) => existsSync(join(assetsDir, a)) && statSync(join(assetsDir, a)).size > 250 * 1024).map((a) => `${a} ${Math.round(statSync(join(assetsDir, a)).size / 1024)}kB`)
check('F1a', heavy.length === 0, `${usedAssets.size} použitých fotiek ≤ 250 kB`, `ťažké: ${heavy.slice(0, 6).join(', ')}${heavy.length > 6 ? ` +${heavy.length - 6}` : ''}`)
const heroDir = join(SITE, 'public/hero')
const mp4 = existsSync(join(heroDir, 'hero.mp4')) ? statSync(join(heroDir, 'hero.mp4')).size : 0
const poster = existsSync(join(heroDir, 'poster.jpg')) ? statSync(join(heroDir, 'poster.jpg')).size : 0
check('F1b', mp4 > 0 && mp4 <= 3 * 1024 * 1024 && poster > 0 && poster <= 250 * 1024, `hero.mp4 ${Math.round(mp4 / 1024)} kB, poster ${Math.round(poster / 1024)} kB`, `hero.mp4 ${Math.round(mp4 / 1024)} kB / poster ${Math.round(poster / 1024)} kB mimo limitu`)

// ---------------------------------------------------------------- prehliadač
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const parseRgb = (s) => { const m = s.match(/[\d.]+/g) || []; return { r: +m[0], g: +m[1], b: +m[2], a: m[3] != null ? +m[3] : 1 } }

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
async function run(name, vp, mobile, reduced = false) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, reducedMotion: reduced ? 'reduce' : 'no-preference' })
  const page = await ctx.newPage(); const errs = []
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(1800)
  const top = await page.evaluate(() => {
    const cs = getComputedStyle; const q = (s) => document.querySelector(s)
    const header = q('header'); const hero = q('#uvod'); const v = q('#uvod video')
    const nav = q('header nav a')
    const txt = [...hero.querySelectorAll('h1,p,a'), ...document.querySelectorAll('header nav a, header a, header button')].filter((e) => e.textContent.trim() && e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return { tag: e.tagName, text: e.textContent.trim().slice(0, 40), color: cs(e).color, fs: parseFloat(cs(e).fontSize), fw: +cs(e).fontWeight, x: r.x, y: r.y, w: r.width, h: r.height, bg: cs(e).backgroundColor } })
    return {
      vh: innerHeight, heroH: hero.getBoundingClientRect().height, heroMinH: cs(hero).minHeight,
      headerPos: cs(header).position, headerBg: cs(header).backgroundColor, navColor: nav ? cs(nav).color : null,
      video: v ? { playing: !v.paused && v.readyState > 2, muted: v.muted, loop: v.loop, inline: v.playsInline, preload: v.preload } : null,
      lcp: (() => { const i = q('#uvod img'); return i ? { fp: i.getAttribute('fetchpriority'), w: i.naturalWidth } : null })(),
      txt,
    }
  })
  const shot = await page.screenshot({ type: 'png' })
  const png = PNG.sync.read(shot)
  // B7 hero: kontrast textu voči reálnym pixelom pod ním (25. percentil jasu v boxe)
  const heroContrast = []
  for (const t of top.txt) {
    if (t.y > top.vh || t.w < 10 || t.h < 8) continue
    const c = parseRgb(t.color); if (c.a === 0) continue
    const x0 = Math.max(0, Math.floor(t.x)), x1 = Math.min(png.width - 1, Math.floor(t.x + t.w)), y0 = Math.max(0, Math.floor(t.y)), y1 = Math.min(png.height - 1, Math.floor(t.y + t.h))
    const L = []
    for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) { const i = (png.width * y + x) * 4; L.push(lum(png.data[i], png.data[i + 1], png.data[i + 2])) }
    L.sort((a, b) => a - b)
    const textL = lum(c.r, c.g, c.b)
    const bgL = textL > 0.5 ? L[Math.floor(L.length * 0.25)] : L[Math.floor(L.length * 0.75)]
    const cr = contrast(textL, bgL)
    const big = t.fs >= 24 || (t.fs >= 19 && t.fw >= 600)
    heroContrast.push({ text: t.text, cr: +cr.toFixed(2), need: big ? 3 : 4.5 })
  }
  const failing = heroContrast.filter((c) => c.cr < c.need)
  // ďalšie merania po scrolle
  await page.evaluate(() => window.scrollTo(0, 300)); await page.waitForTimeout(600)
  const scrolled = await page.evaluate(() => ({ headerBg: getComputedStyle(document.querySelector('header')).backgroundColor, navColor: document.querySelector('header nav a') ? getComputedStyle(document.querySelector('header nav a')).color : null }))
  // v2: H1/logo/nav/scrollspy/progress
  const extra = await page.evaluate(() => {
    const h1 = document.querySelector('h1'); const cs = getComputedStyle(h1)
    const logo = document.querySelector('header img')
    return { h1Fs: parseFloat(cs.fontSize), h1Lines: Math.round(h1.getBoundingClientRect().height / parseFloat(cs.lineHeight)), logoH: logo ? Math.round(logo.getBoundingClientRect().height) : 0, navHrefs: [...document.querySelectorAll('header nav a')].map((a) => a.getAttribute('href')), progressEl: !!document.querySelector('[data-scroll-progress]') }
  })
  let spy = []; let progress = null
  if (!mobile) {
    await page.evaluate(() => { const el = document.getElementById('realizacie'); window.scrollTo(0, el.offsetTop + 200) }); await page.waitForTimeout(700)
    spy = await page.evaluate(() => [...document.querySelectorAll('header nav a')].filter((a) => a.getAttribute('aria-current') === 'true').map((a) => a.getAttribute('href')))
    progress = await page.evaluate(() => {
      const el = document.querySelector('[data-scroll-progress]'); if (!el) return { exists: false }
      const m = getComputedStyle(el).transform.match(/matrix\(([-\d.]+)/)
      const expected = scrollY / (document.body.scrollHeight - innerHeight)
      return { exists: true, scaleX: m ? +m[1] : 1, expected: +expected.toFixed(3) }
    })
  }
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)) } window.scrollTo(0, 0) })
  await page.waitForTimeout(500)
  const full = await page.evaluate(() => {
    const cs = getComputedStyle
    const small = [...document.querySelectorAll('a,button')].map((a) => { const r = a.getBoundingClientRect(); return { t: (a.getAttribute('aria-label') || a.textContent).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), inline: cs(a).display === 'inline' } }).filter((x) => x.w > 0 && !x.inline && (x.h < 44 || x.w < 44))
    const inputs = [...document.querySelectorAll('input,textarea,select')].map((i) => parseFloat(cs(i).fontSize)).filter((s) => s < 16)
    const sections = [...document.querySelectorAll('main section[id]')].map((s) => ({ id: s.id, bg: cs(s).backgroundColor }))
    const dark = (bg) => { const m = bg.match(/[\d.]+/g) || [255, 255, 255]; return (+m[0] + +m[1] + +m[2]) / 3 < 100 }
    let twoDark = []
    for (let i = 1; i < sections.length; i += 1) if (dark(sections[i].bg) && dark(sections[i - 1].bg)) twoDark.push(`${sections[i - 1].id}→${sections[i].id}`)
    const shadows = [...document.querySelectorAll('main section *')].filter((e) => { const s = cs(e).boxShadow; return s && s !== 'none' }).length
    const weights = [...new Set([...document.querySelectorAll('main h1,main h2,main h3,main p,main a,main li')].map((e) => +cs(e).fontWeight))].filter((w) => w >= 700)
    const pairs = {}
    for (const e of document.querySelectorAll('main h1,main h2,main h3,main p,main a,main li,main th,main td,main span')) {
      if (!e.textContent.trim() || e.closest('#uvod') || e.closest('header') || e.closest('[data-na-fotke]') || e.children.length || /Nezáväzný návrh/.test(e.textContent)) continue
      let bg = 'rgba(0, 0, 0, 0)'; let n = e; while (n && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) { bg = cs(n).backgroundColor; n = n.parentElement }
      const k = `${cs(e).color}|${bg}|${parseFloat(cs(e).fontSize)}|${cs(e).fontWeight}`; pairs[k] = (pairs[k] || 0) + 1
    }
    const imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length
    const lazyMissing = [...document.querySelectorAll('main img')].filter((i) => !i.closest('#uvod') && !i.closest('header') && i.loading !== 'lazy').map((i) => i.getAttribute('src').split('/').pop())
    return { scrollW: document.documentElement.scrollWidth, vpw: innerWidth, small, inputs, sections, twoDark, shadows, weights, pairs, imgsNoAlt, lazyMissing, title: document.title, desc: (document.querySelector('meta[name=description]') || {}).content || '', h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang, noindex: !!document.querySelector('meta[name=robots][content*=noindex]') }
  })
  // v4: mobil geometria Debarierizácie + H2 viditeľnosť po scrole na sekciu
  let mob = null
  if (mobile) {
    mob = await page.evaluate((vh) => {
      const sec = document.getElementById('debarierizacia')
      const inner = sec.firstElementChild.getBoundingClientRect().height
      window.scrollTo(0, sec.getBoundingClientRect().top + scrollY - 90)
      return { secH: Math.round(sec.getBoundingClientRect().height), innerH: Math.round(inner) }
    }, vp.height)
    await page.waitForTimeout(500)
    mob.h2 = await page.evaluate((vh) => { const r = document.querySelector('#debarierizacia h2').getBoundingClientRect(); return r.top >= 0 && r.bottom <= vh }, vp.height)
  }
  // v4: Sluzby — kruhový objazd: uzly, hub, aktívna fotka
  let sluzby = null
  if (!mobile && !reduced) {
    await page.evaluate(() => { const sec = document.getElementById('sluzby'); window.scrollTo(0, sec.getBoundingClientRect().top + scrollY + 180) })
    await page.waitForTimeout(900)
    sluzby = await page.evaluate(() => {
      const sec = document.getElementById('sluzby')
      const wheel = [...sec.querySelectorAll('[data-objazd]')].find((w) => w.getBoundingClientRect().width > 0)
      const hubImgs = wheel ? [...wheel.querySelectorAll('[data-hub] img')] : []
      const visible = hubImgs.filter((i) => getComputedStyle(i).opacity === '1')
      const circleImgs = [...sec.querySelectorAll('img')].filter((i) => !i.closest('[data-hub]') && !i.closest('[data-objazd]') && ['999px', '9999px'].some((v) => getComputedStyle(i).borderRadius.includes(v))).length
      return { wheel: !!wheel, nodes: wheel ? wheel.querySelectorAll('button').length : 0, hubImgs: hubImgs.length, hubVisible: visible.length, spin: wheel && wheel.querySelector('.orbit-anim') ? getComputedStyle(wheel.querySelector('.orbit-anim')).animationPlayState : null, strayCircles: circleImgs }
    })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
  }
  if (shotsDir) await page.screenshot({ path: `${shotsDir}/${tag}-${name}.jpeg`, fullPage: true, type: 'jpeg', quality: 70 })
  await ctx.close()
  return { top, heroContrast, failing, scrolled, extra, spy, progress, mob, sluzby, full, errs }
}

const d = await run('1440', { width: 1440, height: 900 }, false)
const m = await run('390', { width: 390, height: 844 }, true)
const m768 = await run('768', { width: 768, height: 1024 }, true)
const r = await run('1440-reduced', { width: 1440, height: 900 }, false, true)

// v4: dialóg — 5 CTA, Esc/scrim, fokus, scroll-lock, tiene, prefill
async function checkDialog() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  const isOpen = () => page.evaluate(() => !!document.querySelector('[role="dialog"][data-state="open"]'))
  const out = { opens: 0, of: 5 }
  await page.click('header button:has-text("Dohodnúť obhliadku")'); await page.waitForTimeout(400)
  if (await isOpen()) out.opens += 1
  const y0 = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 500); await page.waitForTimeout(300)
  out.scrollLocked = (await page.evaluate(() => scrollY)) === y0
  out.shadows = await page.evaluate(() => [...document.querySelectorAll('[role="dialog"], [role="dialog"] *')].filter((e) => { const sh = getComputedStyle(e).boxShadow; return sh && sh !== 'none' && !/^(rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?)+$/.test(sh) }).length)
  await page.keyboard.press('Escape'); await page.waitForTimeout(300)
  out.escClosed = !(await isOpen())
  out.focusBack = await page.evaluate(() => (document.activeElement?.textContent || '').trim() === 'Dohodnúť obhliadku')
  await page.click('#uvod button:has-text("Dohodnúť obhliadku a cenu")'); await page.waitForTimeout(300)
  if (await isOpen()) out.opens += 1
  await page.mouse.click(40, 450); await page.waitForTimeout(300)
  out.scrimClosed = !(await isOpen())
  const sy = await page.evaluate(() => document.getElementById('sluzby').offsetTop)
  await page.evaluate((v) => window.scrollTo(0, v + 200), sy); await page.waitForTimeout(700)
  const activeName = await page.evaluate(() => document.querySelector('#sluzby h3').textContent)
  await page.click('#sluzby button:has-text("Konzultovať konkrétny prvok")'); await page.waitForTimeout(300)
  if (await isOpen()) out.opens += 1
  out.prefill = (await page.evaluate(() => document.querySelector('[role="dialog"] select')?.value)) === activeName
  await page.keyboard.press('Escape'); await page.waitForTimeout(200)
  const ky = await page.evaluate(() => document.getElementById('kontakt').offsetTop)
  await page.evaluate((v) => window.scrollTo(0, v + 200), ky); await page.waitForTimeout(700)
  await page.click('#kontakt button:has-text("Dohodnúť obhliadku a cenu")'); await page.waitForTimeout(300)
  if (await isOpen()) out.opens += 1
  await page.keyboard.press('Escape'); await page.waitForTimeout(200)
  await ctx.close()
  const mc = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const mp = await mc.newPage(); await mp.goto(URL, { waitUntil: 'networkidle' })
  await mp.click('button[aria-controls="mobilne-menu"]'); await mp.waitForTimeout(300)
  await mp.click('nav[aria-label="Mobilná navigácia"] button:has-text("Dohodnúť obhliadku a cenu")'); await mp.waitForTimeout(400)
  const md = await mp.evaluate(() => { const dg = document.querySelector('[role="dialog"][data-state="open"]'); if (!dg) return null; const rr = dg.getBoundingClientRect(); return { w: Math.round(rr.width), h: Math.round(rr.height) } })
  if (md) out.opens += 1
  out.mobileSheet = !!md && md.w === 390 && md.h >= 800
  await mc.close()
  return out
}
const dlg = await checkDialog()
await browser.close()

check('G0', d.errs.length === 0 && m.errs.length === 0, 'žiadne runtime chyby', `chyby: ${[...d.errs, ...m.errs].slice(0, 3).join(' | ')}`)
check('C1', Math.abs(d.top.heroH - d.top.vh) <= 2 && Math.abs(m.top.heroH - m.top.vh) <= 2 && /svh|dvh/.test(d.top.heroMinH) === false, `hero = 1 obrazovka (1440: ${Math.round(d.top.heroH)}/${d.top.vh}, 390: ${Math.round(m.top.heroH)}/${m.top.vh})`, `hero výška 1440: ${Math.round(d.top.heroH)}/${d.top.vh}, 390: ${Math.round(m.top.heroH)}/${m.top.vh}`)
check('C3', d.top.headerPos === 'fixed' && d.top.headerBg === 'rgba(0, 0, 0, 0)' && d.scrolled.headerBg !== 'rgba(0, 0, 0, 0)', 'hlavička fixed, priehľadná hore, plná po scrolle', `pos ${d.top.headerPos}, top ${d.top.headerBg}, scrolled ${d.scrolled.headerBg}`)
check('C4', d.top.navColor === 'rgb(255, 255, 255)' && d.scrolled.navColor === 'rgb(38, 41, 44)', 'nav biela nad hero, tmavá po scrolle', `nav top ${d.top.navColor}, scrolled ${d.scrolled.navColor}`)
check('C5', d.top.video && d.top.video.playing && d.top.video.muted && d.top.video.loop && d.top.video.inline && !m.top.video && !r.top.video && d.top.lcp && d.top.lcp.fp === 'high', `video hrá na 1440 (muted/loop/inline), žiadne na 390 ani pri reduced-motion, poster fetchpriority=high`, `video 1440 ${JSON.stringify(d.top.video)}, 390 ${!!m.top.video}, reduced ${!!r.top.video}, lcp ${JSON.stringify(d.top.lcp)}`)
check('B7a', d.failing.length === 0 && m.failing.length === 0, `kontrast hero textu nad scrimom OK (min ${Math.min(...[...d.heroContrast, ...m.heroContrast].map((c) => c.cr))}:1)`, `pod limitom: ${[...d.failing, ...m.failing].map((c) => `„${c.text}“ ${c.cr}:1 < ${c.need}`).slice(0, 4).join('; ')}`)
const pairFails = []
for (const [k, n] of Object.entries({ ...d.full.pairs, ...m.full.pairs })) {
  const [col, bg, fs, fw] = k.split('|'); const c = parseRgb(col); const b = parseRgb(bg)
  if (c.a === 0) continue
  const cr = contrast(lum(c.r, c.g, c.b), lum(b.r, b.g, b.b)); const big = +fs >= 24 || (+fs >= 19 && +fw >= 600)
  if (cr < (big ? 3 : 4.5)) pairFails.push(`${col} na ${bg} @${fs}px/${fw} = ${cr.toFixed(2)}:1 (${n}×)`)
}
check('B7b', pairFails.length === 0, 'kontrast všetkých textových dvojíc mimo hero OK', pairFails.slice(0, 4).join('; '))
check('B5', d.full.twoDark.length === 0, `rytmus pásiem OK (${d.full.sections.map((s) => s.id).join(' → ')})`, `dve tmavé sekcie za sebou: ${d.full.twoDark.join(', ')}`)
check('B2r', d.full.shadows === 0, 'žiadny box-shadow v renderi sekcií', `${d.full.shadows} prvkov s tieňom`)
check('B4r', d.full.weights.length === 0, 'žiadny rez ≥ 700 v renderi', `rezy: ${d.full.weights.join(', ')}`)
check('D1', d.full.scrollW === d.full.vpw && m.full.scrollW === m.full.vpw, 'bez horizontálneho overflow (1440, 390)', `scrollWidth 1440: ${d.full.scrollW}, 390: ${m.full.scrollW}`)
check('D2', m.full.small.length === 0, 'tap targety ≥ 44 px na 390', `malé: ${m.full.small.slice(0, 5).map((s) => `${s.t} ${s.w}×${s.h}`).join('; ')}`)
check('D3', m.full.inputs.length === 0, 'inputy ≥ 16 px', `${m.full.inputs.length} inputov < 16 px`)
check('F4', d.full.noindex && d.full.lang === 'sk' && d.full.h1 === 1 && d.full.title.length <= 70 && d.full.desc.length <= 160 && d.full.imgsNoAlt === 0, `noindex, lang sk, 1× H1, title ${d.full.title.length}, description ${d.full.desc.length}, alt všade`, `noindex ${d.full.noindex}, lang ${d.full.lang}, h1 ${d.full.h1}, title ${d.full.title.length}, desc ${d.full.desc.length}, bez alt ${d.full.imgsNoAlt}`)
check('F1c', d.full.lazyMissing.length === 0, 'fotky mimo hero lazy', `bez loading=lazy: ${d.full.lazyMissing.join(', ')}`)
check('H1v2', d.extra.h1Lines <= 2 && d.extra.h1Fs <= 72 && m.extra.h1Lines <= 3, `H1 ${d.extra.h1Fs}px / ${d.extra.h1Lines} riadky (1440), ${m.extra.h1Lines} riadky (390)`, `H1 ${d.extra.h1Fs}px, riadky 1440: ${d.extra.h1Lines}, 390: ${m.extra.h1Lines}`)
check('LOGOv2', d.extra.logoH >= 48 && d.extra.logoH <= 56, `logo v headeri ${d.extra.logoH}px`, `logo ${d.extra.logoH}px (mimo 48–56)`)
check('NAVv2', d.extra.navHrefs.length === 5 && d.extra.navHrefs.includes('#o-nas') && !d.extra.navHrefs.includes('#technologie') && d.spy.length === 1 && d.spy[0] === '#realizacie', `nav 5 anchorov s #o-nas (bez #technologie), scrollspy aktívne: ${d.spy[0]}`, `nav ${JSON.stringify(d.extra.navHrefs)}, spy ${JSON.stringify(d.spy)}`)
check('DIALOGv4', dlg.opens === 5 && dlg.escClosed && dlg.scrimClosed && dlg.focusBack && dlg.scrollLocked && dlg.shadows === 0 && dlg.prefill && dlg.mobileSheet, `dialóg: 5/5 CTA otvára, Esc+scrim zatvárajú, fokus späť, scroll-lock, 0 tieňov, prefill, mobil sheet`, `dialóg: ${JSON.stringify(dlg)}`)
check('SLUZBYv4', d.sluzby && d.sluzby.wheel && d.sluzby.nodes === 9 && d.sluzby.hubImgs === 9 && d.sluzby.hubVisible === 1 && d.sluzby.spin === 'running' && d.sluzby.strayCircles === 0, `Služby: objazd s 9 uzlami, hub ukazuje 1 aktívnu fotku, orbita beží`, `Služby: ${JSON.stringify(d.sluzby)}`)
check('MOBv4', m.mob && m.mob.h2 && m768.mob && m768.mob.h2 && m.mob.secH < 1.6 * m.mob.innerH && m768.mob.secH < 1.6 * m768.mob.innerH && m768.full.scrollW === 768, `Debarierizácia mobil: H2 viditeľné na 390 aj 768, výška sekcie ~ obsah (${m.mob && m.mob.secH}/${m.mob && m.mob.innerH}), 768 bez overflow`, `mob: 390 ${JSON.stringify(m.mob)}, 768 ${JSON.stringify(m768.mob)}, scrollW768 ${m768.full.scrollW}`)
check('SCRLv2', d.progress && d.progress.exists && Math.abs(d.progress.scaleX - d.progress.expected) <= 0.1 && r.extra.progressEl === false, `scroll-progress scaleX ${d.progress && d.progress.scaleX && d.progress.scaleX.toFixed(3)} ~ ${d.progress && d.progress.expected}; pri reduced-motion neexistuje`, `progress ${JSON.stringify(d.progress)}, reduced má element: ${r.extra.progressEl}`)

// ---------------------------------------------------------------- výstup
let fails = 0
for (const x of results) { if (!x.ok) fails += 1; console.log(`${x.ok ? '✅' : '❌'} ${x.id.padEnd(4)} ${x.msg}`) }
console.log(`\n${results.length - fails}/${results.length} OK · ${fails} ❌`)
process.exit(fails ? 1 : 0)
