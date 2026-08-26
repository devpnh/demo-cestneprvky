import { useEffect, useState } from 'react'
import { MAPA_OBRYS, MAPA_SIDLO, MAPA_VIEWBOX } from '../content/mapa.js'

/**
 * Obrys Slovenska ako inline SVG.
 *
 * Jeden zdroj pre obe stránky, ktoré mapu potrebujú: `/realizacie` ju kreslí
 * s pätnástimi bodmi realizácií, `/kontakt` len so sídlom. Predtým bolo celé
 * SVG napevno v `pages/Realizacie/MapaRealizacii.jsx` a druhá stránka by ho
 * musela skopírovať — dva obrysy, dve hrúbky čiary, dve pravdy.
 *
 * Žiadny embed a žiadny externý mapový podklad: stránka tým nenačítava cudzí
 * skript ani cookies a mapa vyzerá ako technický výkres, nie ako turistická
 * mapa. Obrys aj body sú v `src/content/mapa.js`.
 *
 * Mapa je dekorácia k textu, nie náhrada zaň — odčítač obrazovky číta zoznam
 * miest vedľa nej, respektíve adresu. SVG má preto `role="img"` a jeden
 * súhrnný popis, ktorý si volajúca stránka určí sama.
 *
 * @param {object} props
 * @param {Array<{nazov: string, x: number, y: number}>} [props.body] body realizácií
 * @param {string|null} [props.aktivne] názov zvýrazneného bodu (drží ho stránka)
 * @param {(nazov: string|null) => void} [props.naNajazd] hlásenie nájazdu myšou
 * @param {boolean} [props.sidlo] kresliť prstenec a menovku sídla
 * @param {string} props.popis obsah `aria-label`
 * @param {string} [props.className] trieda na `<svg>`
 */
export default function MapaSlovenska({
  body = [],
  aktivne = null,
  naNajazd = null,
  sidlo = true,
  popis,
  className = 'w-full',
}) {
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
    <svg viewBox={MAPA_VIEWBOX} role="img" aria-label={popis} className={className}>
      <path
        d={MAPA_OBRYS}
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth={uzke ? 3 : 2}
        strokeLinejoin="round"
      />

      {/* Sídlo: prstenec, aby sa nepomýlilo s realizáciou. */}
      {sidlo ? (
        <g>
          <circle
            cx={MAPA_SIDLO.x}
            cy={MAPA_SIDLO.y}
            r={uzke ? 20 : 11}
            fill="none"
            stroke="var(--color-text)"
            strokeWidth={uzke ? 5 : 3}
          />
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
      ) : null}

      {body.map((b) => {
        const je = aktivne === b.nazov
        return (
          <g
            key={b.nazov}
            onMouseEnter={naNajazd ? () => naNajazd(b.nazov) : undefined}
            onMouseLeave={naNajazd ? () => naNajazd(null) : undefined}
          >
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
  )
}
