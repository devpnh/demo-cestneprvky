import { useState } from 'react'
import { motion } from 'motion/react'
import { Sekcia, SekciaHlavicka } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { PROCES } from '../../../content/firma.js'

/**
 * Spojnica medzi dvoma uzlami. Kreslí sa pri vstupe do viewportu
 * (`whileInView`, žiadne scroll-linkovanie — E3), pri `prefers-reduced-motion`
 * je hneď celá. Vodorovná verzia platí od 1024 px, zvislá pod ňou.
 */
function Spojnica({ zvisla = false, poradie = 0, className = '' }) {
  const reduced = useReducedMotion()
  const styl = { backgroundColor: 'var(--color-border)' }

  if (reduced) return <span aria-hidden="true" className={className} style={styl} />

  return (
    <motion.span
      aria-hidden="true"
      className={`${className} ${zvisla ? 'origin-top' : 'origin-left'}`}
      style={styl}
      initial={zvisla ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={zvisla ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: poradie * 0.12 }}
    />
  )
}

/**
 * Ako prebieha spolupráca. Štyri kroky doslova z `PROCES` — žiadne sľuby
 * o termínoch ani cenách, tie v podkladoch nie sú.
 *
 * Poradie nesú uzly na spojnici, nie čísla 01/02/03 (STANDARDY B1): na
 * desktope je z krokov vodorovná linka so štyrmi uzlami, na mobile tá istá
 * linka stojí zvisle. Uzol kroku, na ktorom je kurzor, sa vyplní akcentom;
 * pri načítaní svieti prvý, lebo spolupráca sa začína dopytom.
 */
export default function Proces() {
  const [aktivny, setAktivny] = useState(0)

  return (
    <Sekcia id="proces" pasmo="siva">
      <SekciaHlavicka stitok="Postup" nadpis="Ako prebieha spolupráca" />

      <Stagger
        staggerChildren={0.08}
        className="mt-16 grid grid-cols-1 gap-y-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-10"
      >
        {PROCES.map((krok, i) => {
          const je = i === aktivny
          return (
            <StaggerItem
              key={krok.id}
              className="relative pl-9 lg:pl-0 lg:pt-9"
              onMouseEnter={() => setAktivny(i)}
            >
              {i < PROCES.length - 1 && (
                <>
                  <Spojnica
                    zvisla
                    poradie={i}
                    className="absolute left-[4px] top-[25px] h-[calc(100%+32px)] w-px lg:hidden"
                  />
                  <Spojnica
                    poradie={i}
                    className="absolute left-[16px] top-[5px] hidden h-px w-[calc(100%+24px)] lg:block"
                  />
                </>
              )}

              <span
                aria-hidden="true"
                className="absolute left-0 top-[9px] h-[10px] w-[10px] border transition-colors duration-[var(--duration-fast)] lg:top-0"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  borderColor: 'var(--color-accent)',
                  backgroundColor: je ? 'var(--color-accent)' : 'transparent',
                }}
              />

              <h3 className="text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {krok.nazov}
              </h3>
              <p className="mt-3 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {krok.popis}
              </p>
            </StaggerItem>
          )
        })}
      </Stagger>
    </Sekcia>
  )
}
