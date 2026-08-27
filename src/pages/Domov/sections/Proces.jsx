import { useEffect, useRef, useState } from 'react'
import { Sekcia, SekciaHlavicka } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { PROCES } from '../../../content/firma.js'

/** Odstup medzi krokmi v sekundách; z neho sa počítajú oneskorenia. */
const KROK_ODSTUP = 0.22

/**
 * Animácia pipeline.
 *
 * Nepoužíva `whileInView` z knižnice `motion`. Prvá verzia mala úsečku vnútri
 * kroku, ktorý sa sám posúval, takže sa linka kreslila na plávajúcom podklade.
 * Druhá verzia to skúsila orchestrovať cez `staggerChildren` a tretia cez
 * `whileInView` s ručnými oneskoreniami — obe zostali stáť. Meranie ukázalo
 * prečo: prvky pod ohybom nemali ani inline štýl s počiatočným stavom
 * (`style` bolo `null` pri `opacity: 1`), teda `initial` sa nikdy nepoužilo
 * a animácia nezačala. Platí to v tomto projekte na `whileInView` všeobecne,
 * nielen tu — je to poznámka do QUALITY-LOG, nie vec tejto sekcie.
 *
 * Preto vlastný `IntersectionObserver` a prechody v CSS: sekcia sa raz
 * prepne do stavu „kreslí sa“ a jednotlivé prvky majú `transition-delay`
 * odvodený od indexu kroku. Rozsvieti sa uzol, z neho vybehne úsečka
 * k ďalšiemu uzlu, potom nastupuje ďalší krok. Kroky menia len priehľadnosť,
 * nie polohu, takže pipeline stojí na mieste a naozaj sa kreslí.
 *
 * Pri `prefers-reduced-motion` je všetko rovno v cieľovom stave.
 */
function useKresliSa(reduced) {
  const ref = useRef(null)
  const [kresli, setKresli] = useState(false)

  useEffect(() => {
    if (reduced) return undefined
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setKresli(true)
      return undefined
    }
    const io = new IntersectionObserver(
      (zaznamy) => {
        if (zaznamy.some((z) => z.isIntersecting)) {
          setKresli(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return [ref, reduced || kresli]
}

/**
 * Ako prebieha spolupráca. Štyri kroky doslova z `PROCES` — žiadne sľuby
 * o termínoch ani cenách, tie v podkladoch nie sú.
 *
 * Poradie nesú uzly na spojnici, nie čísla 01/02/03 (STANDARDY B1): na
 * desktope je z krokov vodorovná linka so štyrmi uzlami, na mobile tá istá
 * linka stojí zvisle. Uzol kroku, na ktorom je kurzor, sa vyplní akcentom;
 * pri načítaní svieti prvý, lebo spolupráca sa začína dopytom.
 *
 * Sekcia je zámerne bez fotografie: je to schéma postupu, nie galéria. Od
 * 27. 8. 2026 je aj bez popisov krokov — na Domove z nej ostala linka so
 * štyrmi menami, ktorá sa dá prečítať na jeden pohľad.
 */
export default function Proces() {
  const [aktivny, setAktivny] = useState(0)
  const reduced = useReducedMotion()
  const [ref, kresli] = useKresliSa(reduced)

  return (
    <Sekcia id="proces" pasmo="biela">
      <SekciaHlavicka stitok="Postup" nadpis="Ako prebieha spolupráca" />

      <div ref={ref} className="mt-16 grid grid-cols-1 gap-y-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-10">
        {PROCES.map((krok, i) => {
          const je = i === aktivny
          const poslednyKrok = i === PROCES.length - 1
          const odstup = i * KROK_ODSTUP
          return (
            <div
              key={krok.id}
              data-krok={i}
              className="relative pl-9 transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:pl-0 lg:pt-9"
              style={{ opacity: kresli ? 1 : 0, transitionDelay: `${odstup}s` }}
              onMouseEnter={() => setAktivny(i)}
            >
              {!poslednyKrok && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute left-[4px] top-[25px] h-[calc(100%+32px)] w-px origin-top transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden"
                    style={{
                      backgroundColor: 'var(--color-border)',
                      transform: `scaleY(${kresli ? 1 : 0})`,
                      transitionDelay: `${odstup + 0.14}s`,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-[16px] top-[5px] hidden h-px w-[calc(100%+24px)] origin-left transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block"
                    style={{
                      backgroundColor: 'var(--color-border)',
                      transform: `scaleX(${kresli ? 1 : 0})`,
                      transitionDelay: `${odstup + 0.14}s`,
                    }}
                  />
                </>
              )}

              <span
                aria-hidden="true"
                data-uzol={i}
                className="absolute left-0 top-[9px] h-[10px] w-[10px] border transition-[transform,opacity,background-color] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:top-0"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  borderColor: 'var(--color-accent)',
                  backgroundColor: je ? 'var(--color-accent)' : 'transparent',
                  transform: `scale(${kresli ? 1 : 0.2})`,
                  opacity: kresli ? 1 : 0,
                  transitionDelay: `${odstup}s`,
                }}
              />

              {/* Bez popisu kroku. Štyri mená sú celá schéma postupu a
                  Domov nemá byť príručka — znenie krokov stojí na `/o-firme`
                  a v perexoch výziev na podstránkach. */}
              <h3 className="text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {krok.nazov}
              </h3>
            </div>
          )
        })}
      </div>
    </Sekcia>
  )
}
