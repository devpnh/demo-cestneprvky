import { useEffect, useState } from 'react'
import { MonoStitok } from '../../components/kit/index.js'
import { sadzba } from '../../lib/sadzba.js'
import { MAPA_BODY, MAPA_OBRYS, MAPA_SIDLO, MAPA_VIEWBOX } from '../../content/mapa.js'
import { MIESTA_REALIZACII } from '../../content/realizacie.js'

/**
 * Mapa miest realizácií.
 *
 * Vlastné inline SVG, žiadny embed a žiadny externý mapový podklad: stránka
 * tým nenačítava cudzí skript ani cookies a mapa vyzerá ako technický výkres,
 * nie ako turistická mapa. Obrys aj body sú v `src/content/mapa.js`.
 *
 * Mapa je dekorácia k zoznamu, nie náhrada zaň — zoznam pätnástich miest
 * stojí vedľa nej a je to on, čo číta odčítač obrazovky. SVG má preto
 * `role="img"` a jeden súhrnný popis.
 *
 * Body sa neoznačujú menovkami: pätnásť popiskov na takto malej ploche by sa
 * prekrývalo. Meno sa ukazuje pri prejdení myšou nad bodom alebo nad položkou
 * zoznamu, a to v pevnom riadku pod mapou, aby sa nič neposúvalo.
 */
export default function MapaRealizacii() {
  const [aktivne, setAktivne] = useState(null)
  // Mapa má na mobile 350 px šírky, takže sa Slovensko zmestí do pásika
  // vysokého 170 px. Body v jednotkách viewBoxu sa zmenšia s ním a pri
  // priemere 8 by mali na obrazovke necelé 3 px. Preto sa pod 640 px kreslia
  // väčšie; nie je to iný komponent, len iná hrúbka čiary.
  const [uzke, setUzke] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const uprav = () => setUzke(mq.matches)
    uprav()
    mq.addEventListener('change', uprav)
    return () => mq.removeEventListener('change', uprav)
  }, [])

  const R = uzke ? 16 : 8
  const R_AKTIVNY = uzke ? 22 : 12
  const LEM = uzke ? 5 : 3

  return (
    <div className="mt-16 border-t border-[var(--color-border)] pt-8">
      <MonoStitok>Miesta realizácií</MonoStitok>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-7">
          <svg
            viewBox={MAPA_VIEWBOX}
            role="img"
            aria-label={`Mapa Slovenska s ${MAPA_BODY.length} miestami realizácií a so sídlom firmy v Žiline`}
            className="w-full"
          >
            <path
              d={MAPA_OBRYS}
              fill="var(--color-surface)"
              stroke="var(--color-border)"
              strokeWidth={uzke ? 3 : 2}
              strokeLinejoin="round"
            />

            {/* Sídlo: prstenec, aby sa nepomýlilo s realizáciou. */}
            <g>
              <circle cx={MAPA_SIDLO.x} cy={MAPA_SIDLO.y} r={uzke ? 20 : 11} fill="none" stroke="var(--color-text)" strokeWidth={uzke ? 5 : 3} />
              <circle cx={MAPA_SIDLO.x} cy={MAPA_SIDLO.y} r={uzke ? 6 : 3} fill="var(--color-text)" />
              {/* Jediná menovka na mape. Bez nej by prstenec nikto neprečítal
                  ako sídlo a mapa by nemala orientačný bod. */}
              <text
                x={MAPA_SIDLO.x + (uzke ? 32 : 20)}
                y={MAPA_SIDLO.y + (uzke ? 10 : 6)}
                fontFamily="var(--font-mono)"
                fontSize={uzke ? 30 : 18}
                letterSpacing={uzke ? 2.4 : 1.4}
                fill="var(--color-text)"
              >
                ŽILINA
              </text>
              <title>{`${MAPA_SIDLO.nazov}, sídlo firmy`}</title>
            </g>

            {MAPA_BODY.map((b) => {
              const je = aktivne === b.nazov
              return (
                <g key={b.nazov} onMouseEnter={() => setAktivne(b.nazov)} onMouseLeave={() => setAktivne(null)}>
                  {/* Biely lem oddelí body, ktoré si v okolí Bratislavy sadajú na seba. */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={je ? R_AKTIVNY : R}
                    fill="var(--color-accent)"
                    stroke="var(--color-bg)"
                    strokeWidth={LEM}
                    className="transition-all duration-[var(--duration-fast)]"
                  />
                  <title>{b.nazov}</title>
                </g>
              )
            })}
          </svg>

          {/* Pevný riadok: mení sa text, nie výška, takže mapa pod kurzorom neposkakuje. */}
          <p className="mt-4 min-h-[1.5rem] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {aktivne || sadzba(`Sídlo Žilina a ${MAPA_BODY.length} doložených miest realizácií`)}
          </p>
        </div>

        {/* Dva stĺpce aj na `lg`: pätnásť položiek pod sebou meria vyše 700 px,
            teda dvojnásobok mapy, a ľavý stĺpec by pod ňou zíval prázdny. */}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:col-span-5">
          {MIESTA_REALIZACII.map((m) => (
            <li
              key={m}
              onMouseEnter={() => setAktivne(m)}
              onMouseLeave={() => setAktivne(null)}
              className={`border-b border-[var(--color-border)] py-2 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] transition-colors duration-[var(--duration-fast)] ${
                aktivne === m ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'
              }`}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
