import { useState } from 'react'
import { motion } from 'motion/react'
import { Sekcia, SekciaHlavicka } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { PROCES } from '../../../content/firma.js'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Animácia pipeline.
 *
 * Predtým mala každá úsečka vlastný `whileInView` s ručne dopočítaným
 * oneskorením a sedela vnútri kroku, ktorý sa sám posúval o 24 px nahor.
 * Linka sa preto kreslila na podklade, ktorý sa pod ňou ešte hýbal, štyri
 * pozorovatele sa spúšťali každý zvlášť a poradie kreslenia záviselo od toho,
 * ktorý 1 px vysoký prvok stihol pretnúť viewport skôr. Výsledok bol
 * roztrasený a nikdy nie dvakrát rovnaký.
 *
 * Teraz je to jedna sekvencia: orchestruje ju rodič cez `staggerChildren`
 * a varianty sa dedia do vnorených prvkov, takže sa uzol rozsvieti, z neho
 * vybehne úsečka k ďalšiemu uzlu a až potom nastupuje ďalší krok. Kroky menia
 * len priehľadnosť, nie polohu — pipeline tak stojí na mieste a naozaj sa
 * kreslí, nie pláva.
 */
const KONTAJNER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.05 } },
}

/** Krok sa iba prelína. Žiadny posun: linka pod ním nesmie ujsť. */
const KROK = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
}

const UZOL = {
  hidden: { scale: 0.2, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.32, ease: EASE } },
}

/** Úsečka vybehne z uzla až keď je uzol na mieste, preto oneskorenie. */
const USECKA_VODOROVNA = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: EASE, delay: 0.14 } },
}

const USECKA_ZVISLA = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.5, ease: EASE, delay: 0.14 } },
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
 * Sekcia je zámerne bez fotografie: je to schéma postupu, nie galéria.
 */
export default function Proces() {
  const [aktivny, setAktivny] = useState(0)
  const reduced = useReducedMotion()

  return (
    <Sekcia id="proces" pasmo="biela">
      <SekciaHlavicka stitok="Postup" nadpis="Ako prebieha spolupráca" />

      <motion.div
        className="mt-16 grid grid-cols-1 gap-y-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-10"
        initial={reduced ? undefined : 'hidden'}
        whileInView={reduced ? undefined : 'visible'}
        viewport={{ once: true, margin: '-15% 0px' }}
        variants={reduced ? undefined : KONTAJNER}
      >
        {PROCES.map((krok, i) => {
          const je = i === aktivny
          const poslednyKrok = i === PROCES.length - 1
          return (
            <motion.div
              key={krok.id}
              className="relative pl-9 lg:pl-0 lg:pt-9"
              variants={reduced ? undefined : KROK}
              onMouseEnter={() => setAktivny(i)}
            >
              {!poslednyKrok && (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-[4px] top-[25px] h-[calc(100%+32px)] w-px origin-top lg:hidden"
                    style={{ backgroundColor: 'var(--color-border)' }}
                    variants={reduced ? undefined : USECKA_ZVISLA}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-[16px] top-[5px] hidden h-px w-[calc(100%+24px)] origin-left lg:block"
                    style={{ backgroundColor: 'var(--color-border)' }}
                    variants={reduced ? undefined : USECKA_VODOROVNA}
                  />
                </>
              )}

              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-[9px] h-[10px] w-[10px] border transition-colors duration-[var(--duration-fast)] lg:top-0"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  borderColor: 'var(--color-accent)',
                  backgroundColor: je ? 'var(--color-accent)' : 'transparent',
                }}
                variants={reduced ? undefined : UZOL}
              />

              <h3 className="text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {krok.nazov}
              </h3>
              <p className="mt-3 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {krok.popis}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </Sekcia>
  )
}
