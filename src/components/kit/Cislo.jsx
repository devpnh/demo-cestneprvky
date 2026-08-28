import { useEffect, useRef } from 'react'
import { sadzba } from '../../lib/sadzba.js'

/**
 * Číslo, ktoré pri vstupe do viewportu dobehne na svoju hodnotu.
 *
 * Je to jediná odchýlka od slovníka pohybu (STANDARDY E1: fade, slide,
 * stagger, hover). Dôvod je zadanie: prvé pásmo pod hero má návštevníka
 * zaujať a číslo, ktoré sa dopočíta, je jediná vec na stránke, ktorá sa
 * mení sama a pritom nesie fakt, nie dekoráciu. Preto je aj obmedzená —
 * beží raz, netrvá ani sekundu a pol a inde na webe nie je.
 *
 * **Hodnoty sa nikde nevypisujú ručne**, počítajú sa z dát (počet služieb,
 * typov prvkov, miest realizácií). Nemá teda ako vzniknúť číslo, ktoré by
 * na webe nesedelo s obsahom (STANDARDY A3).
 *
 * Odpočet zapisuje priamo do DOM cez `ref`, nie cez `useState`: inak by to
 * bolo prekreslenie Reactu na každý snímok. `tabular-nums` drží šírku
 * číslic, takže sa pri počítaní nehýbe popisok pod číslom.
 *
 * Pri `prefers-reduced-motion` sa číslo rovno vypíše.
 */
export default function Cislo({ hodnota, popis, jednotka = null, predpona = null, trvanie = 1200, className = '' }) {
  const cisloRef = useRef(null)

  useEffect(() => {
    const el = cisloRef.current
    if (!el) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      el.textContent = String(hodnota)
      return undefined
    }

    el.textContent = '0'
    let raf = 0
    let zaciatok = 0
    const krok = (t) => {
      if (!zaciatok) zaciatok = t
      const podiel = Math.min(1, (t - zaciatok) / trvanie)
      // Expo-out, tá istá krivka ako `--ease-house`: číslo vyletí a dosadne.
      const tlmene = 1 - (1 - podiel) ** 3
      el.textContent = String(Math.round(hodnota * tlmene))
      if (podiel < 1) raf = requestAnimationFrame(krok)
    }

    const io = new IntersectionObserver(
      (zaznamy) => {
        for (const z of zaznamy) {
          if (!z.isIntersecting && z.boundingClientRect.bottom >= 0) continue
          io.disconnect()
          raf = requestAnimationFrame(krok)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [hodnota, trvanie])

  // Popis pre čítačku aj pre `aria-label` musí obsahovať jednotku, inak
  // odznie „30 a lepený obrubník má 100 % pevnosti" — veta bez rozmeru.
  const cele = [predpona, `${hodnota}`, jednotka, popis].filter(Boolean).join(' ')

  return (
    <div className={className}>
      {/* Prístupnostne je hodnota v `aria-label`, aby čítačka nečítala
          medzistavy odpočtu; vizuálna vrstva je pre ňu skrytá. */}
      <p
        aria-label={cele}
        className="flex items-baseline gap-[0.18em] font-[family-name:var(--font-display)] text-[length:var(--text-6xl)] font-semibold leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)]"
      >
        {/* Predpona („do 30 min") je menšia a tlmená: je to spojka vo vete,
            nie údaj. Bez nej by sa „30 min" čítalo ako trvanie práce. */}
        {predpona ? (
          <span
            aria-hidden="true"
            className="font-[family-name:var(--font-body)] text-[length:var(--text-xl)] font-normal text-[var(--color-muted)]"
          >
            {predpona}
          </span>
        ) : null}
        <span ref={cisloRef} aria-hidden="true" className="tabular-nums">
          {hodnota}
        </span>
        {/* Jednotka je súčasťou čísla, nie popisku pod ním: „30" nad popiskom
            sa číta ako poradie, „30 min" ako údaj. Je preto na tej istej
            účiarie, len v menšom stupni a v akcente — aby ju oko vzalo naraz
            s číslom a nie ako ďalší riadok. */}
        {jednotka ? (
          <span
            aria-hidden="true"
            className="text-[length:var(--text-2xl)] text-[var(--color-accent)]"
          >
            {jednotka}
          </span>
        ) : null}
      </p>
      <p
        aria-hidden="true"
        className="mt-4 max-w-[20ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]"
      >
        {/* Sadzba je povinná aj tu: bez nej ostalo „typov prvkov v“ na konci
            riadka a jednopísmenová predložka visela sama (kontrola SADZBA). */}
        {sadzba(popis)}
      </p>
    </div>
  )
}
