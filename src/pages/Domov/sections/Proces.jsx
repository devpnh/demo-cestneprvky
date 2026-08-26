import { useState } from 'react'
import { motion } from 'motion/react'
import { Sekcia, SekciaHlavicka, Fotka } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { PROCES } from '../../../content/firma.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

/**
 * Výsledok procesu, nie jeho ilustrácia: hotový priechod so signálnym pásom,
 * vodiacou líniou a vodorovným značením, teda presne to, čo posledný krok
 * („Odovzdanie“) odovzdáva do užívania. Iný obrazový obsah sa nedopĺňa —
 * podklady k jednotlivým krokom (obhliadka, návrh, montáž) neexistujú a
 * vymýšľať sa nebudú.
 */
const VYSLEDOK = GALERIA.find((r) => r.id === 'priechod-signalny-pas')

/** Popisok fotky je fakt: typ prvku a to, čo je z nej doložené (KOMPOZÍCIA §5). */
const popisVysledku = (r) => [r.prvok, ...castiPopisu(r)].filter(Boolean).join(' · ')

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
 *
 * Nad krokmi stojí jeden široký záber hotovej realizácie (`VYSLEDOK`).
 * Spojnica s uzlami ostáva nedotknutá, pás je nad ňou.
 */
export default function Proces() {
  const [aktivny, setAktivny] = useState(0)

  return (
    <Sekcia id="proces" pasmo="biela">
      <SekciaHlavicka stitok="Postup" nadpis="Ako prebieha spolupráca" />

      {/* Široký pás nad krokmi. Sekcia mala 612 px a ani jeden obrazový prvok
          — po zrušení sivého pásma (KOMPOZÍCIA §2) robí rytmus obsah, nie
          odtieň pozadia. Pomer sa mení so šírkou okna: na 390 px by z pásu 3 : 1
          ostal 117 px vysoký prúžok, v ktorom sa priechod nedá prečítať. */}
      {VYSLEDOK ? (
        <Reveal className="mt-14 lg:mt-16">
          <Fotka
            src={VYSLEDOK.src}
            w={VYSLEDOK.w}
            h={VYSLEDOK.h}
            alt={VYSLEDOK.alt}
            popis={popisVysledku(VYSLEDOK)}
            sizes="(min-width: 1024px) 82vw, 100vw"
            // Pás ide cez celú šírku kontajnera (1 168 px), takže strop 960w
            // z mriežky by ho roztiahol o pätinu. Tu si pýtame originál.
            maxSirka={Infinity}
            triedaObrazka="aspect-[4/3] sm:aspect-[21/9] lg:aspect-[3/1]"
            className="[&_figcaption]:border-t [&_figcaption]:border-[var(--color-border)] [&_figcaption]:pt-4"
          />
        </Reveal>
      ) : null}

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
