import { useCallback, useEffect, useState } from 'react'
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
  className = '',
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
        data-prelinacka=""
        className="relative w-full overflow-hidden bg-[var(--color-surface)]"
        style={{ aspectRatio: pomer, borderRadius: 'var(--radius-sm)' }}
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

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-[var(--color-border)] pt-4">
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
