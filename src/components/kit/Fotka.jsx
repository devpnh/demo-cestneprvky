import { sadzba } from '../../lib/sadzba.js'

import { MAX_MRIEZKA, srcSetPre, SIZES_MRIEZKA } from '../../lib/obrazky.js'

const BASE = import.meta.env.BASE_URL

/**
 * Fotografia klienta s povinnými rozmermi a popisom. `width`/`height` sú
 * skutočné rozmery súboru (drží CLS na nule), `loading="lazy"` má všetko
 * okrem LCP. Popis je fakt: typ prvku a miesto, nikdy dekoratívna veta.
 *
 * Pomer strán ide inline cez `aspectRatio`, nie cez triedu `aspect-[…]`:
 * Tailwind v4 skenuje zdroj staticky, takže trieda zložená za behu by sa do
 * CSS nikdy nevygenerovala.
 */
export default function Fotka({
  src,
  w,
  h,
  alt,
  popis = null,
  pomer = null,
  priorita = false,
  tmava = false,
  className = '',
  triedaObrazka = '',
  sizes = SIZES_MRIEZKA,
  // Strop kandidátov `srcset`. Dlaždica v mriežke si vystačí s 960w, fotka
  // cez celú šírku kontajnera by sa z nej roztiahla — tá si pýta originál.
  maxSirka = MAX_MRIEZKA,
}) {
  const img = (
    <img
      src={`${BASE}assets/${src}`}
      srcSet={srcSetPre(src, w, maxSirka)}
      sizes={sizes}
      width={w}
      height={h}
      alt={sadzba(alt)}
      loading={priorita ? 'eager' : 'lazy'}
      decoding="async"
      {...(priorita ? { fetchPriority: 'high' } : {})}
      className={`w-full object-cover ${triedaObrazka}`}
      style={{ borderRadius: 'var(--radius-sm)', ...(pomer ? { aspectRatio: pomer } : {}) }}
    />
  )
  if (!popis) return <div className={className}>{img}</div>
  return (
    <figure className={className}>
      {img}
      <figcaption
        className={`mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] ${
          tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
        }`}
      >
        {sadzba(popis)}
      </figcaption>
    </figure>
  )
}
