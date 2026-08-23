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

/**
 * Sets document.title, meta description, OG tags, JSON-LD LocalBusiness
 * (from global.json) and honours the noindex flag. DEFAULT NOINDEX ON —
 * PLAN.md requires demos stay out of search until handover explicitly
 * flips seo.noindex to false. Never touched by the generator's content
 * pass beyond editing global.json.
 */
export default function Seo() {
  useEffect(() => {
    const { brand, nap, contact, seo, social } = global

    document.title = seo?.title || brand?.name || 'Demo'
    upsertMeta('name', 'description', seo?.description)

    const noindex = seo?.noindex !== false
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', seo?.title || brand?.name)
    upsertMeta('property', 'og:description', seo?.description)
    upsertMeta('property', 'og:type', 'website')
    if (seo?.ogImage) upsertMeta('property', 'og:image', seo.ogImage)
    upsertMeta('name', 'twitter:card', seo?.ogImage ? 'summary_large_image' : 'summary')

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
  }, [])

  return null
}
