import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { altFotky } from './fotky.js'

const BASE = import.meta.env.BASE_URL

/**
 * Kruhový objazd služieb: podpisový prvok webu a zároveň prvok z odboru
 * klienta. Po asfaltovom prstenci obieha deväť fotiek služieb, v strede je
 * ostrovček s fotkou práve aktívnej služby.
 *
 * Tri veci, ktoré sa tu v minulosti pokazili a preto sú riešené takto:
 *
 * 1. `overflow-hidden` na kontajneri je povinné. Rotujúca vrstva `inset-0` má
 *    pri otáčaní rohy až do `velkost · √2`, takže bez orezania rástol
 *    `scrollWidth` stránky (390 → 417 px, nález z QUALITY-LOG 2026-08-24).
 * 2. Polohy uzlov sú v percentách, nie v pixeloch odvodených od `velkost`.
 *    SVG vozovka sa škáluje cez `viewBox`, takže pixelové polomery by sa od
 *    nej odtrhli všade, kde je stĺpec užší ako 600 px (na `lg` má 524 px).
 *    Uzol sedí na kružnici s polomerom 40 % vďaka `inset-[10%]` na otočenom
 *    bode; vnútorná protirotácia drží fotku vzpriamene.
 * 3. Animácia beží cez triedy `.orbit-anim` / `.orbit-anim-rev` v
 *    `src/styles/index.css` a pauzuje sa triedou `.orbit-paused` na rodičovi.
 *    Pri `prefers-reduced-motion` sa trieda vôbec nenasadí, takže sa nehýbe nič.
 *
 * Uzol je `<Link>` na stránku služby s prístupným názvom, nie tlačidlo:
 * objazd je navigácia, nie prepínač. Hover a fokus nad uzlom mení aktívnu
 * službu, klik ide rovno na jej detail.
 */
export default function KruhovyObjazd({
  sluzby,
  active,
  onActive,
  reduced = false,
  velkost = 600,
  uzol = 56,
  interval = 4000,
}) {
  const pocet = sluzby.length
  const [drziKurzor, setDrziKurzor] = useState(false)
  const [drziFokus, setDrziFokus] = useState(false)
  const stoji = reduced || drziKurzor || drziFokus

  // Auto-postup aktívnej služby, kým nad objazdom nedrží používateľ kurzor
  // ani fokus. `setTimeout` a nie `setInterval`: po ručnej zmene sa odpočet
  // začína odznova, takže vybraná služba nezmizne po zlomku sekundy.
  useEffect(() => {
    if (stoji) return undefined
    const t = setTimeout(() => onActive((active + 1) % pocet), interval)
    return () => clearTimeout(t)
  }, [active, stoji, pocet, interval, onActive])

  return (
    <div
      data-objazd=""
      className={`relative mx-auto aspect-square w-full select-none overflow-hidden ${stoji ? 'orbit-paused' : ''}`}
      style={{ maxWidth: `${velkost}px` }}
      onMouseEnter={() => setDrziKurzor(true)}
      onMouseLeave={() => setDrziKurzor(false)}
      onFocusCapture={() => setDrziFokus(true)}
      onBlurCapture={() => setDrziFokus(false)}
    >
      {/* Vozovka: asfaltový prstenec, vlasové krajnice, prerušovaná stredová čiara */}
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="300" cy="300" r="240" fill="none" stroke="var(--color-surface-2)" strokeWidth="52" />
        <circle cx="300" cy="300" r="267" fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx="300" cy="300" r="213" fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx="300" cy="300" r="240" fill="none" stroke="var(--color-bg)" strokeWidth="2.5" strokeDasharray="16 14" />
      </svg>

      {/* Stredový ostrovček: fotka aktívnej služby presne v mieste pozornosti.
          Neaktívne fotky majú prázdny `alt` zámerne, sú to vrstvy jedného
          prelínania, do prístupnostného stromu patrí len tá viditeľná. */}
      <div
        data-hub=""
        className="absolute left-1/2 top-1/2 h-[52.7%] w-[52.7%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        {sluzby.map((s, i) => (
          <img
            key={s.slug}
            src={`${BASE}assets/${s.dlazdica.src}`}
            width={s.dlazdica.w}
            height={s.dlazdica.h}
            alt={i === active ? altFotky(s.dlazdica) : ''}
            aria-hidden={i === active ? undefined : 'true'}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${
              reduced ? '' : 'transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-house)]'
            } ${i === active ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'}`}
          />
        ))}
      </div>

      {/* Obiehajúce uzly: rotujúca vrstva + protismerná kompenzácia */}
      <div className={`absolute inset-0 ${reduced ? '' : 'orbit-anim'}`}>
        {sluzby.map((s, i) => {
          const uhol = (i / pocet) * 360 - 90
          const jeAktivna = i === active
          return (
            <div key={s.slug} className="absolute inset-[10%]" style={{ transform: `rotate(${uhol}deg)` }}>
              <div
                className="absolute left-1/2 top-0"
                style={{
                  height: `${uzol}px`,
                  width: `${uzol}px`,
                  marginLeft: `${-uzol / 2}px`,
                  marginTop: `${-uzol / 2}px`,
                  transform: `rotate(${-uhol}deg)`,
                }}
              >
                <div className={reduced ? '' : 'orbit-anim-rev'}>
                  <Link
                    to={`/sluzby/${s.slug}`}
                    aria-label={s.nazov}
                    onMouseEnter={() => onActive(i)}
                    onFocus={() => onActive(i)}
                    className={`block overflow-hidden rounded-full ${
                      reduced ? '' : 'transition-[transform,border-color] duration-[var(--duration-fast)]'
                    } ${
                      jeAktivna
                        ? 'scale-[1.22] border-[3px] border-[var(--color-accent)]'
                        : 'border-2 border-[var(--color-bg)] hover:border-[var(--color-accent)]'
                    }`}
                    style={{ height: `${uzol}px`, width: `${uzol}px` }}
                  >
                    <img
                      src={`${BASE}assets/${s.dlazdica.src}`}
                      width={s.dlazdica.w}
                      height={s.dlazdica.h}
                      alt={altFotky(s.dlazdica)}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
