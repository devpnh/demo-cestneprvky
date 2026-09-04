import { useEffect, useRef, useState } from 'react'
import { Parallax } from '../../components/primitives/index.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
import { srcSetPre, MAX_MRIEZKA, SIZES_MRIEZKA } from '../../lib/obrazky.js'
import { sadzba } from '../../lib/sadzba.js'

const BASE = import.meta.env.BASE_URL

/**
 * Fotografia, ktorá sa pri vstupe do okna **vytrie zdola nahor** a vnútri
 * rámu sa počas scrollu posúva paralaxou.
 *
 * ## Prečo vlastný komponent a nie `Fotka` + `Reveal`
 *
 * Slovník pohybu webu má výter už zavedený — `ObrazokSmerovy` ním mení
 * zábery pri nájazde kurzora. Tu je ten istý pohyb použitý ako **príchod**
 * obsahu: fotka sa nevynorí zospodu ako celý blok (to robí `Reveal`), ale
 * odkryje sa spod vlastnej hrany, tak ako sa stierkuje značenie. Je to
 * jediný prezentačný prvok tejto stránky a opakuje sa štyrikrát: raz
 * v profile, trikrát v triptychu technológií, kde sa výtery reťazia
 * s odstupom (`oneskorenie`).
 *
 * `Reveal` sa naň použiť nedá: jeho stavy sú v `src/styles/index.css`
 * napevno (opacity + posun) a pridať do zdieľanej vrstvy piaty variant kvôli
 * jednej stránke by znamenalo, že ho o týždeň niekto použije inde a rozbije
 * rytmus. Preto má výter vlastný `IntersectionObserver` — presne ako `Cislo`,
 * ktoré si ho z rovnakého dôvodu drží tiež.
 *
 * ## Prístupnosť a pomalé linky
 *
 * Bez `IntersectionObserver` (staré prehliadače, prerender) je fotka rovno
 * odkrytá — animácia nesmie byť jediná cesta k obsahu. To isté platí pri
 * `prefers-reduced-motion`: vtedy sa nekoná ani výter, ani paralax.
 *
 * `w`/`h` sú skutočné rozmery súboru, takže rám nedrží miesto odhadom a CLS
 * ostáva na nule (STANDARDY F1).
 */
export default function FotkaVyter({
  src,
  w,
  h,
  alt,
  popis = null,
  pomer = '4/5',
  oneskorenie = 0,
  rychlost = 0.12,
  tmava = false,
  sizes = SIZES_MRIEZKA,
  // Strop kandidátov `srcset` — tá istá hodnota a ten istý dôvod ako v `Fotka`:
  // dlaždica v mriežke si vystačí s 960w, fotka cez celú šírku kontajnera si
  // pýta originál (vtedy volajúci pošle `Infinity`).
  maxSirka = MAX_MRIEZKA,
  className = '',
  // Pomer strán sa dá prebiť triedami (`aspect-[…]`), keď má rám na mobile
  // iný orez než na desktope. Inline `aspectRatio` sa vtedy nenastaví, inak
  // by trieda nemala čo prebiť — inline štýl vyhráva nad utilitou vždy.
  triedaRamu = '',
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [odhalene, setOdhalene] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setOdhalene(true)
      return undefined
    }
    const io = new IntersectionObserver(
      (zaznamy) => {
        for (const z of zaznamy) {
          // Druhá podmienka je tá istá poistka ako v `src/lib/odhalenie.js`:
          // prvok NAD oknom (po obnove pozície scrollu alebo skoku na kotvu)
          // sa ako pretínajúci nikdy nenahlási a ostal by navždy zrezaný.
          if (!z.isIntersecting && z.boundingClientRect.bottom >= 0) continue
          io.disconnect()
          setOdhalene(true)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const zrezanie = reduced || odhalene ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)'

  const obrazok = (
    <img
      src={`${BASE}assets/${src}`}
      srcSet={srcSetPre(src, w, maxSirka)}
      sizes={sizes}
      width={w}
      height={h}
      alt={sadzba(alt)}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  )

  return (
    <figure className={className}>
      <div
        ref={ref}
        className={`relative w-full overflow-hidden bg-[var(--color-surface)] ${triedaRamu}`}
        style={{
          ...(triedaRamu ? {} : { aspectRatio: pomer }),
          borderRadius: 'var(--radius-sm)',
          clipPath: zrezanie,
          // Dojazd je dlhší než pri ostatných vstupoch webu (0,6 s): výter cez
          // celú výšku fotky sa pri kratšom čase číta ako preblik, nie ako
          // odkrytie. Pri reduced-motion sa prechod nemontuje vôbec.
          transition: reduced
            ? undefined
            : `clip-path var(--duration-slow) var(--ease-house) ${oneskorenie}ms`,
        }}
      >
        {/* Rám je o kúsok menší než obraz v ňom, takže sa pri posune
            neodkryje pozadie. Paralax sa pri reduced-motion sám vypína. */}
        <Parallax speed={rychlost} className="absolute inset-[-5%]">
          {obrazok}
        </Parallax>
      </div>
      {popis ? (
        <figcaption
          className={`mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] ${
            tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
          }`}
        >
          {sadzba(popis)}
        </figcaption>
      ) : null}
    </figure>
  )
}
