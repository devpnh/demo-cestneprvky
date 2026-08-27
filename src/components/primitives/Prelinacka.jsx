import { useCallback, useEffect, useRef, useState } from 'react'
import { sadzba } from '../../lib/sadzba.js'
import { MAX_MRIEZKA, srcSetPre } from '../../lib/obrazky.js'

const BASE = import.meta.env.BASE_URL

/**
 * Prelínačka fotografií: jeden veľký záber, ktorý sa sám vymieňa za ďalší.
 *
 * Vznikla presunom animácie zo stredu kruhového objazdu. Tam mala fotka
 * priemer ~230 px a menila sa pod prstencom ikon, takže sa na ňu nedalo
 * poriadne pozerať; tu má celú šírku kontajnera a je to jediná vec v pásme,
 * na ktorú sa oko sústredí (pokyn Petra, 27. 8. 2026: „tú animáciu tých
 * obrázkov daj niekde inde, kde sa hodí“).
 *
 * ## Ako sa prelína
 *
 * Odchádzajúca fotka ostáva **nepriehľadná** pod prichádzajúcou a zhasne až
 * potom, keď ju už nová celá prekrýva. Bez toho sú v polovici prechodu
 * priesvitné obe, presvitajú cez seba a vyzerá to ako porucha — presne to
 * bola pôvodná výtka „glitchuje pri prepínaní“. Vrstvy riadi `z-index`,
 * nie poradie v DOM.
 *
 * Popisok pod fotkou je fakt (typ prvku a miesto), nie dekoratívna veta, a
 * mení sa spolu so záberom. Pod ním sú prepínače v podobe čiarok
 * vodorovného značenia — aktívna je akcentová, ostatné vlasové.
 *
 * Posun stojí, kým je nad prelínačkou kurzor alebo fokus, a pri
 * `prefers-reduced-motion` nezačne vôbec: vtedy je to obyčajná fotka
 * s prepínačmi.
 */
export default function Prelinacka({
  zabery,
  pomer = '16/9',
  interval = 5200,
  sizes = '(min-width: 1280px) 1168px, 100vw',
  maxSirka = MAX_MRIEZKA,
  reduced = false,
  parallax = 0,
  className = '',
  triedaRamu = '',
  triedaPopisu = '',
}) {
  const pocet = zabery.length
  const [aktivny, setAktivny] = useState(0)
  const [predchadzajuci, setPredchadzajuci] = useState(0)
  const [stoji, setStoji] = useState(false)

  useEffect(() => {
    if (reduced || stoji || pocet < 2) return undefined
    const t = setTimeout(() => setAktivny((i) => (i + 1) % pocet), interval)
    return () => clearTimeout(t)
  }, [aktivny, reduced, stoji, pocet, interval])

  // Spodná vrstva zhasne až po dobehnutí prechodu, nie súčasne s ním.
  useEffect(() => {
    if (predchadzajuci === aktivny) return undefined
    const t = setTimeout(() => setPredchadzajuci(aktivny), 700)
    return () => clearTimeout(t)
  }, [aktivny, predchadzajuci])

  const vyber = useCallback((i) => setAktivny(i), [])

  /**
   * Paralaxa záberu. Fotka je o `parallax` percent vyššia než rám a v ňom sa
   * posúva podľa toho, kde je rám voči oknu — dolu pri nábehu, hore pri
   * odchode. Meria sa v rAF a zapisuje priamo do štýlu, nie cez `useState`:
   * pri scrollovaní by to inak bolo prekreslenie Reactu na každý snímok.
   *
   * `0` paralaxu vypína a vrstva ostane bez transformu — pri
   * `prefers-reduced-motion` sa efekt nezapne vôbec.
   */
  const ramRef = useRef(null)
  const vrstvaRef = useRef(null)
  useEffect(() => {
    if (!parallax || reduced) return undefined
    const ram = ramRef.current
    const vrstva = vrstvaRef.current
    if (!ram || !vrstva) return undefined
    let raf = 0
    const zmeraj = () => {
      raf = 0
      const r = ram.getBoundingClientRect()
      const rozsah = window.innerHeight + r.height
      // 0 = rám práve vstupuje zdola, 1 = práve odchádza hore.
      const podiel = Math.min(1, Math.max(0, (window.innerHeight - r.top) / rozsah))
      vrstva.style.transform = `translate3d(0, ${((0.5 - podiel) * parallax).toFixed(2)}%, 0)`
    }
    const naplanuj = () => {
      if (!raf) raf = requestAnimationFrame(zmeraj)
    }
    zmeraj()
    window.addEventListener('scroll', naplanuj, { passive: true })
    window.addEventListener('resize', naplanuj, { passive: true })
    return () => {
      window.removeEventListener('scroll', naplanuj)
      window.removeEventListener('resize', naplanuj)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [parallax, reduced])

  const zaber = zabery[aktivny]

  return (
    <figure
      className={className}
      onMouseEnter={() => setStoji(true)}
      onMouseLeave={() => setStoji(false)}
      onFocusCapture={() => setStoji(true)}
      onBlurCapture={() => setStoji(false)}
    >
      <div
        ref={ramRef}
        data-prelinacka=""
        className={`relative w-full overflow-hidden bg-[var(--color-surface)] ${triedaRamu}`}
        // `pomer="auto"` je pre pás, ktorý si výšku drží triedou (celoplošný
        // záber). Vtedy sa `aspect-ratio` nenastavuje vôbec, inak by prebilo
        // výšku z triedy.
        // `pomer="auto"` je pre pás cez celú šírku okna, ktorý si výšku drží
        // triedou. Vtedy sa nenastavuje ani `aspect-ratio` (prebilo by výšku
        // z triedy), ani rádius — pás od hrany po hranu zaoblené rohy nemá.
        style={pomer === 'auto' ? undefined : { aspectRatio: pomer, borderRadius: 'var(--radius-sm)' }}
      >
        <div
          ref={vrstvaRef}
          className="absolute inset-0"
          style={parallax && !reduced ? { top: `${-parallax / 2}%`, bottom: `${-parallax / 2}%`, height: 'auto' } : undefined}
        >
        {zabery.map((z, i) => {
          const je = i === aktivny
          const bolo = i === predchadzajuci
          return (
            <img
              key={z.src}
              src={`${BASE}assets/${z.src}`}
              srcSet={srcSetPre(z.src, z.w, maxSirka)}
              sizes={sizes}
              width={z.w}
              height={z.h}
              alt={je ? sadzba(z.alt) : ''}
              aria-hidden={je ? undefined : 'true'}
              // Všetky lazy vrátane prvej: prelínačka stojí pod ohybom, LCP
              // prvkom je nadpis a `eager` na nej len kradol pásmo (F5).
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover ${
                reduced ? '' : 'transition-[opacity,transform] duration-700 ease-[var(--ease-house)]'
              } ${je || bolo ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
              style={{ zIndex: je ? 2 : bolo ? 1 : 0 }}
            />
          )
        })}
        </div>
      </div>

      <figcaption className={`mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-[var(--color-border)] pt-4 ${triedaPopisu}`}>
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
          {sadzba(zaber.popis)}
        </span>

        {/* Prepínače v reči odboru: čiarky vodorovného značenia. Tlačidlo má
            44 px dotykovú plochu, viditeľná je z nej len čiarka (D2). */}
        <span className="flex items-center">
          {zabery.map((z, i) => (
            <button
              key={z.src}
              type="button"
              onClick={() => vyber(i)}
              aria-label={`Zobraziť fotografiu ${i + 1} z ${pocet}: ${z.popis}`}
              aria-current={i === aktivny ? 'true' : undefined}
              className="group flex h-[44px] w-[44px] items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <span
                aria-hidden="true"
                className={`block h-[2px] w-6 transition-colors duration-[var(--duration-fast)] ${
                  i === aktivny
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-[var(--color-border)] group-hover:bg-[var(--color-muted)]'
                }`}
              />
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}
