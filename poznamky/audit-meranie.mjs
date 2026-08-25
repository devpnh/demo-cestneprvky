/**
 * Merania vykonané vnútri prehliadača (`page.evaluate`) pre `poznamky/audit.mjs`.
 *
 * Funkcie odtiaľto sa serializujú do stránky, takže NESMÚ siahať na nič
 * z Node scope — všetko potrebné prichádza jediným argumentom. Vracajú
 * surové čísla a selektory; vyhodnotenie (✅/❌) robí audit, aby sa dala
 * kontrola zmeniť bez znovuspustenia prehliadača.
 */

/** Jedno kolo merania nad načítanou stránkou. Volá sa cez `page.evaluate`. */
export function meranieStranky(vstup) {
  const cs = getComputedStyle
  const KONTAJNER = '[class*="max-w-[var(--container-max)]"]'
  // DemoBadge je portál do <body> bez data atribútu; drží ho jedine z-[9998].
  const DEMO_BADGE = '[data-demo-badge], [class*="z-[9998]"]'

  const parse = (s) => {
    if (!s) return null
    const m = String(s).match(/-?[\d.]+/g)
    if (!m || m.length < 3) return null
    return { r: +m[0], g: +m[1], b: +m[2], a: m[3] != null ? +m[3] : 1 }
  }

  const cesta = (el) => {
    const kusy = []
    let n = el
    while (n && n.nodeType === 1 && kusy.length < 4) {
      let s = n.tagName.toLowerCase()
      if (n.id) {
        kusy.unshift(`${s}#${n.id}`)
        break
      }
      const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)
      if (cls.length) s += `.${cls[0]}`
      kusy.unshift(s)
      n = n.parentElement
    }
    return kusy.join('>')
  }

  const viditelny = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width <= 0.5 || r.height <= 0.5) return false
    const s = cs(el)
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false
    if (el.closest('[hidden]')) return false
    return true
  }

  /**
   * Reálny tieň = aspoň jedna vrstva, ktorá má farbu s alfou > 0 a zároveň
   * nenulovú dĺžku. Tailwind `ring-0` / `shadow-none` a radix chassis nechávajú
   * v `box-shadow` prázdne vrstvy typu `rgba(0,0,0,0) 0px 0px 0px 0px`.
   */
  const skutocnyTien = (s) => {
    if (!s || s === 'none') return false
    const vrstvy = s.split(/,(?![^(]*\))/)
    return vrstvy.some((v) => {
      const mFarba = v.match(/rgba?\([^)]*\)/)
      const farba = mFarba ? parse(mFarba[0]) : { r: 0, g: 0, b: 0, a: 1 }
      if (!farba || farba.a === 0) return false
      const dlzky = v.replace(/rgba?\([^)]*\)/g, '').match(/-?[\d.]+px/g) || []
      return dlzky.some((d) => parseFloat(d) !== 0)
    })
  }

  // ---------------------------------------------------------------- SEO
  const metaObsah = (sel) => {
    const el = document.querySelector(sel)
    return el ? el.getAttribute('content') || '' : null
  }
  const h1 = [...document.querySelectorAll('h1')]
  const obrazky = [...document.querySelectorAll('img')].map((i) => {
    const r = i.getBoundingClientRect()
    return {
      src: (i.getAttribute('src') || '').split('/').pop(),
      cesta: cesta(i),
      maAlt: i.hasAttribute('alt'),
      alt: i.getAttribute('alt') || '',
      w: i.getAttribute('width'),
      h: i.getAttribute('height'),
      loading: i.getAttribute('loading'),
      docTop: Math.round(r.top + window.scrollY),
      vHlavicke: !!i.closest('header'),
      // Vedome dekoratívna fotka: `aria-hidden` predok alebo role=presentation.
      dekorativny: !!i.closest('[aria-hidden="true"]') || ['presentation', 'none'].includes(i.getAttribute('role')),
    }
  })

  const seo = {
    title: document.title || '',
    description: metaObsah('meta[name="description"]'),
    robots: metaObsah('meta[name="robots"]'),
    lang: document.documentElement.getAttribute('lang'),
    h1Pocet: h1.length,
    h1Texty: h1.map((e) => e.textContent.trim()),
  }

  // ---------------------------------------------------------------- rozmery a overflow
  const rozmery = {
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    innerH: window.innerHeight,
    docH: document.documentElement.scrollHeight,
    telaScrollW: document.body.scrollWidth,
  }

  // najširší prvok, ktorý prečnieva — bez neho je „overflow“ neopraviteľný údaj
  const pretekajuce = []
  if (rozmery.scrollW > rozmery.innerW) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const pravy = r.right + window.scrollX
      if (pravy > rozmery.innerW + 1) pretekajuce.push({ cesta: cesta(el), right: Math.round(pravy), w: Math.round(r.width) })
      if (pretekajuce.length > 40) break
    }
  }

  // ---------------------------------------------------------------- tap targety a polia
  const male = []
  for (const el of document.querySelectorAll('a, button, [role="button"], select, input')) {
    if (el.type === 'hidden') continue
    if (!viditelny(el)) continue
    const s = cs(el)
    // Vnorený odkaz v odseku nie je tap target (WCAG 2.5.8 „inline“ výnimka).
    if (s.display === 'inline' && el.tagName === 'A' && el.closest('p, li, figcaption')) continue
    if (s.pointerEvents === 'none') continue
    const r = el.getBoundingClientRect()
    if (r.height < 44 || r.width < 44) {
      male.push({ cesta: cesta(el), popis: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 32), w: Math.round(r.width), h: Math.round(r.height) })
    }
  }

  const maleFonty = []
  for (const el of document.querySelectorAll('input, select, textarea')) {
    if (el.type === 'hidden') continue
    const fs = parseFloat(cs(el).fontSize)
    if (fs < 16) maleFonty.push({ cesta: cesta(el), fs })
  }

  // ---------------------------------------------------------------- tiene a rezy
  const tiene = []
  const rezy = []
  const farby = new Map()
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg')) continue
    const tag = el.tagName
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'LINK' || tag === 'TITLE' || tag === 'META') continue
    const s = cs(el)
    const vDeme = !!el.closest(DEMO_BADGE)
    if (!vDeme && skutocnyTien(s.boxShadow) && viditelny(el)) {
      if (tiene.length < 40) tiene.push({ cesta: cesta(el), tien: s.boxShadow.slice(0, 60) })
    }
    if (viditelny(el) && el.textContent.trim() && +s.fontWeight >= 700) {
      if (rezy.length < 40) rezy.push({ cesta: cesta(el), fw: +s.fontWeight, text: el.textContent.trim().slice(0, 30) })
    }
    if (!viditelny(el)) continue
    const pridaj = (typ, hodnota) => {
      const c = parse(hodnota)
      if (!c || c.a === 0) return
      const kluc = `${typ}|${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)}`
      if (!farby.has(kluc)) farby.set(kluc, { typ, r: c.r, g: c.g, b: c.b, pocet: 0, cesta: cesta(el), vlastnost: typ })
      farby.get(kluc).pocet += 1
    }
    if (el.textContent.trim()) pridaj('color', s.color)
    pridaj('background', s.backgroundColor)
    for (const strana of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(s[`border${strana}Width`]) > 0 && s[`border${strana}Style`] !== 'none') pridaj('border', s[`border${strana}Color`])
    }
  }

  // ---------------------------------------------------------------- pásma
  const pasma = [...document.querySelectorAll('main [data-pasmo]')].map((el) => ({
    id: el.id || cesta(el),
    pasmo: el.getAttribute('data-pasmo'),
  }))
  // Rytmus pásiem tvoria len vrchné sekcie; vnorená <section> (napr. vnútri
  // sticky-scrubu) nie je súrodencom v poradí a pásmo mať nemusí.
  const vrchneSekcie = [...document.querySelectorAll('main section')].filter((s) => {
    const rodic = s.parentElement ? s.parentElement.closest('section') : null
    return !rodic
  })
  const sekcieBezPasma = vrchneSekcie.filter((s) => !s.hasAttribute('data-pasmo')).map((s) => s.id || cesta(s))
  const vnoreneSekcie = [...document.querySelectorAll('main section')].length - vrchneSekcie.length

  // ---------------------------------------------------------------- zarovnanie na kontajner
  const zarovnanie = []
  for (const sec of document.querySelectorAll('main section')) {
    const nazov = sec.id || sec.getAttribute('data-pasmo') || cesta(sec)
    if (!viditelny(sec)) continue
    const kont = sec.matches(KONTAJNER) ? sec : [...sec.querySelectorAll(KONTAJNER)].find((k) => k.closest('section') === sec)
    if (!kont) {
      // Sekcia bez vlastného kontajnera je v poriadku len vtedy, keď kontajner
      // nesú jej vnorené sekcie — tie sa merajú samostatne v tomto cykle.
      if (sec.querySelector('section')) continue
      zarovnanie.push({ sekcia: nazov, chyba: 'sekcia nemá kontajner max-w-[var(--container-max)]' })
      continue
    }
    const kr = kont.getBoundingClientRect()
    const ocakavane = kr.left + parseFloat(cs(kont).paddingLeft)
    const dieta = [...kont.children].find((d) => {
      const ds = cs(d)
      if (ds.position === 'absolute' || ds.position === 'fixed') return false
      if (d.getAttribute('aria-hidden') === 'true') return false
      return viditelny(d)
    })
    if (!dieta) {
      zarovnanie.push({ sekcia: nazov, chyba: 'kontajner nemá viditeľného potomka' })
      continue
    }
    const dr = dieta.getBoundingClientRect()
    zarovnanie.push({
      sekcia: nazov,
      ocakavane: +ocakavane.toFixed(2),
      skutocne: +dr.left.toFixed(2),
      rozdiel: +(dr.left - ocakavane).toFixed(2),
      dieta: cesta(dieta),
    })
  }

  // ---------------------------------------------------------------- text na kontrast
  const nadMediom = (el, er) => {
    const obal = el.closest('section, header, footer') || document.body
    for (const m of obal.querySelectorAll('img, video, canvas')) {
      const p = cs(m).position
      if (p !== 'absolute' && p !== 'fixed') continue
      const r = m.getBoundingClientRect()
      if (!(r.right < er.left || r.left > er.right || r.bottom < er.top || r.top > er.bottom)) return true
    }
    return false
  }

  const texty = []
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg') || el.closest(DEMO_BADGE)) continue
    const vlastnyText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    if (!vlastnyText) continue
    if (!viditelny(el)) continue
    const s = cs(el)
    const c = parse(s.color)
    if (!c || c.a === 0) continue
    const r = el.getBoundingClientRect()
    if (r.width < 6 || r.height < 6) continue

    // podklad: hľadaj prvú nepriehľadnú farbu smerom hore; cestou si všímaj,
    // či nad textom nie je gradient, priesvitná vrstva alebo médium — vtedy
    // sa podklad nedá vypočítať a meria sa pixel pod textom.
    let n = el
    let obrazok = false
    let priesvitny = false
    let podklad = null
    let fixed = false
    let plavajuci = false
    let opacita = 1
    while (n) {
      const ns = cs(n)
      opacita *= +ns.opacity
      if (ns.position === 'fixed') fixed = true
      if (ns.backgroundImage && ns.backgroundImage !== 'none') obrazok = true
      const bg = parse(ns.backgroundColor)
      if (bg && bg.a === 1) {
        podklad = { r: bg.r, g: bg.g, b: bg.b }
        break
      }
      if (bg && bg.a > 0) priesvitny = true
      // Priehľadná hlavička nad hero, absolútne vrstvy, sticky pásy: čo je pod
      // nimi, sa z DOM nedá vypočítať — jediná pravda je pixel v renderi.
      if (ns.position === 'fixed' || ns.position === 'sticky' || ns.position === 'absolute') plavajuci = true
      n = n.parentElement
    }
    const potrebujePixel = obrazok || priesvitny || plavajuci || !podklad || nadMediom(el, r)

    // Tesný obdĺžnik okolo skutočných glyfov: bez neho by sa vzorkoval aj
    // prázdny zvyšok bloku a kontrast by meral iný podklad, než je pod textom.
    let tesny = null
    try {
      const rng = document.createRange()
      rng.selectNodeContents(el)
      const rects = [...rng.getClientRects()].filter((q) => q.width > 0 && q.height > 0)
      if (rects.length) {
        const l = Math.min(...rects.map((q) => q.left))
        const t = Math.min(...rects.map((q) => q.top))
        const rr = Math.max(...rects.map((q) => q.right))
        const b = Math.max(...rects.map((q) => q.bottom))
        tesny = { x: l + window.scrollX, y: t + window.scrollY, w: rr - l, h: b - t }
      }
    } catch (e) {
      tesny = null
    }

    texty.push({
      cesta: cesta(el),
      text: el.textContent.trim().slice(0, 44),
      color: s.color,
      fs: parseFloat(s.fontSize),
      fw: +s.fontWeight,
      opacity: +opacita.toFixed(3),
      podklad,
      potrebujePixel,
      fixed,
      x: r.left + window.scrollX,
      y: r.top + window.scrollY,
      w: r.width,
      h: r.height,
      tesny,
      // Rámy prvku sa nesmú vzorkovať ako podklad: akcentové podčiarknutie
      // odkazu by inak vyšlo ako „pozadie textu“ a kontrast by bol falošný.
      okraje: {
        hore: parseFloat(s.borderTopWidth) || 0,
        dole: parseFloat(s.borderBottomWidth) || 0,
        vlavo: parseFloat(s.borderLeftWidth) || 0,
      },
      // Podčiarknutie leží tesne pod glyfmi; tie riadky sa vzorkovať nesmú,
      // inak vyjde ako podklad farba linky (reálny nález na odkaze ÚNSS).
      podciarknuty: /underline|overline|line-through/.test(s.textDecorationLine || ''),
    })
    if (texty.length > 900) break
  }

  // ---------------------------------------------------------------- navigácia a pätička
  const navEl = document.querySelector('header nav[aria-label="Hlavná navigácia"]') || document.querySelector('header nav')
  const nav = navEl
    ? [...navEl.querySelectorAll('a')].map((a) => ({
        href: a.getAttribute('href'),
        text: a.textContent.trim(),
        current: a.getAttribute('aria-current'),
      }))
    : null
  const navMobil = [...document.querySelectorAll('[data-mobilne-menu] nav a')].map((a) => ({
    href: a.getAttribute('href'),
    text: a.textContent.trim(),
    current: a.getAttribute('aria-current'),
  }))

  const paticka = document.querySelector('footer')
  const patickaOdkazy = paticka
    ? [...paticka.querySelectorAll('a')].map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim().slice(0, 40) }))
    : null
  const patickaText = paticka ? paticka.textContent.replace(/\s+/g, ' ').trim() : null

  // ---------------------------------------------------------------- hlavička, hero, video
  const headerEl = document.querySelector('header')
  const hlavicka = headerEl
    ? {
        position: cs(headerEl).position,
        bg: cs(headerEl).backgroundColor,
        color: cs(headerEl).color,
        light: headerEl.getAttribute('data-light'),
        vyska: Math.round(headerEl.getBoundingClientRect().height),
        progres: !!document.querySelector('[data-scroll-progress]'),
      }
    : null

  const heroEl = document.querySelector('[data-hero]') || document.querySelector('#uvod') || document.querySelector('main section')
  const hero = heroEl
    ? {
        selector: cesta(heroEl),
        vyska: Math.round(heroEl.getBoundingClientRect().height),
        minHeightPx: cs(heroEl).minHeight,
        trieda: heroEl.getAttribute('class') || '',
        inlineStyl: heroEl.getAttribute('style') || '',
      }
    : null

  const videoEl = document.querySelector('[data-hero-video]') || document.querySelector('main video')
  const video = videoEl
    ? {
        muted: videoEl.muted,
        loop: videoEl.loop,
        playsInline: videoEl.playsInline,
        paused: videoEl.paused,
        readyState: videoEl.readyState,
        preload: videoEl.preload,
        autoplay: videoEl.autoplay,
      }
    : null

  const posterEl = heroEl ? heroEl.querySelector('img') : null
  const poster = posterEl
    ? { src: (posterEl.getAttribute('src') || '').split('/').pop(), fetchpriority: posterEl.getAttribute('fetchpriority'), loading: posterEl.getAttribute('loading') }
    : null

  const mainEl = document.querySelector('main')
  const hlavnyText = mainEl ? mainEl.textContent.replace(/\s+/g, ' ').trim().slice(0, 60000) : null

  return {
    url: location.pathname + location.search,
    hlavnyText,
    seo,
    obrazky,
    rozmery,
    pretekajuce,
    male,
    maleFonty,
    tiene,
    rezy,
    farby: [...farby.values()],
    pasma,
    sekcieBezPasma,
    vnoreneSekcie,
    zarovnanie,
    texty,
    nav,
    navMobil,
    patickaOdkazy,
    patickaText,
    hlavicka,
    hero,
    video,
    poster,
    vstup,
  }
}

/** Prejde celú stránku scrollom, aby sa spustili `Reveal`/`Stagger`, a vráti sa hore. */
export async function prebudStranku(page) {
  await page.evaluate(async () => {
    const krok = Math.max(300, Math.round(window.innerHeight * 0.8))
    for (let y = 0; y < document.documentElement.scrollHeight; y += krok) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    // 700 ms: hlavička sa vracia do priehľadného stavu cez --duration-fast (0,4 s)
    await new Promise((r) => setTimeout(r, 700))
  })
}
