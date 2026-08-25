import { useEffect } from 'react'
import global from '../content/global.json'

function upsertMeta(attr, key, content) {
  if (content === null || content === undefined || content === '') return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/** Odstráni JSON-LD bloky predchádzajúcej routy, ktoré tá nová už nepoužíva. */
function odstranStareJsonLd(odIndexu) {
  for (let i = odIndexu; i < 20; i += 1) {
    const el = document.getElementById(`ld-page-${i}`)
    if (!el) break
    el.remove()
  }
}

/**
 * Sets document.title, meta description, OG tags, JSON-LD LocalBusiness
 * (from global.json) and honours the noindex flag. DEFAULT NOINDEX ON:
 * PLAN.md requires demos stay out of search until handover explicitly
 * flips seo.noindex to false.
 *
 * Viacstránková verzia: každá route si komponent montuje sama a posiela
 * vlastný `title` / `description` / `ogImage`, ktoré prebijú `global.json`.
 * `jsonLd` je voliteľné pole ďalších objektov (Service, BreadcrumbList…).
 * Efekt závisí na props, takže `<title>` sa mení pri každej navigácii (F4).
 */
export default function Seo({ title, description, ogImage, jsonLd }) {
  // Pole objektov nie je stabilná referencia medzi rendermi, do dependency
  // array ide jeho serializácia, inak by efekt bežal pri každom renderi.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const { brand, nap, contact, seo, social } = global

    const finalTitle = title || seo?.title || brand?.name || 'Demo'
    const finalDescription = description || seo?.description
    const rawOgImage = ogImage || seo?.ogImage

    document.title = finalTitle
    upsertMeta('name', 'description', finalDescription)

    const noindex = seo?.noindex !== false
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', finalTitle)
    upsertMeta('property', 'og:description', finalDescription)
    upsertMeta('property', 'og:type', 'website')
    if (rawOgImage) {
      // Relatívna cesta („assets/…“) by sa na /sluzby/<slug> rozvinula proti
      // adresári routy a ukázala na neexistujúci súbor, preto vždy cez BASE_URL.
      const absolutna = /^(https?:)?\/\//.test(rawOgImage) || rawOgImage.startsWith('/')
      upsertMeta('property', 'og:image', absolutna ? rawOgImage : `${import.meta.env.BASE_URL}${rawOgImage}`)
    }
    upsertMeta('name', 'twitter:card', rawOgImage ? 'summary_large_image' : 'summary')

    const address = {
      '@type': 'PostalAddress',
      streetAddress: nap?.street || undefined,
      addressLocality: nap?.city || undefined,
      postalCode: nap?.postalCode || undefined,
      addressCountry: nap?.country || undefined,
    }
    const sameAs = social ? Object.values(social).filter(Boolean) : []

    upsertJsonLd('ld-local-business', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: nap?.businessName || brand?.name,
      telephone: nap?.phone || contact?.phone || undefined,
      email: nap?.email || contact?.email || undefined,
      address,
      ...(sameAs.length ? { sameAs } : {}),
    })

    const extra = jsonLdKey ? JSON.parse(jsonLdKey) : []
    const zoznam = Array.isArray(extra) ? extra : [extra]
    zoznam.forEach((data, i) => upsertJsonLd(`ld-page-${i}`, data))
    odstranStareJsonLd(zoznam.length)
  }, [title, description, ogImage, jsonLdKey])

  return null
}
