import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Sekcia, SekciaHlavicka, MonoStitok, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { SKUPINY, SLUZBY, sluzbyPodlaSkupiny, skupinaPodlaId } from '../../../content/sluzby.js'
import KruhovyObjazd from '../../Sluzby/KruhovyObjazd.jsx'

const BASE = import.meta.env.BASE_URL

/** Perex sa skladá z názvov celkov v dátach, aby na webe nevznikla nová veta o klientovi. */
const PEREX = `Deväť služieb v troch celkoch: ${SKUPINY.map((s) => s.nazov.toLowerCase()).join(', ')}.`

/**
 * Sleduje šírku okna, nie výšku (STANDARDY C2: výšku na dotykových
 * zariadeniach mení lišta prehliadača). Počiatočný stav sa číta priamo z
 * `matchMedia`, takže desktop vykreslí objazd hneď pri prvom rendere a
 * neprebliskne cez mobilný zoznam.
 */
function useSirsieAkoLg() {
  const [siroke, setSiroke] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const zmena = (e) => setSiroke(e.matches)
    setSiroke(mql.matches)
    mql.addEventListener('change', zmena)
    return () => mql.removeEventListener('change', zmena)
  }, [])
  return siroke
}

/**
 * Služby na Domove. Na `lg` a vyššie je to kruhový objazd: podpisový prvok
 * webu aj prvok z odboru klienta; vľavo stojí detail práve aktívnej služby.
 * Na mobile a tablete je to čistý zoznam so skupinami a náhľadmi: koleso sa
 * na 390 px nedá zmysluplne ovládať a v behu v4 sa z mobilu na pokyn
 * odstránilo, takže sa sem nevracia.
 *
 * Objazd sa pod 1024 px vôbec nemontuje (nie je len skrytý cez CSS): audit
 * potom počíta presne deväť uzlov a nie osemnásť, a telefón nedrží v pamäti
 * deväť fotiek, ktoré nikdy neuvidí.
 */
export default function SluzbyPrehlad() {
  const reduced = useReducedMotion()
  const siroke = useSirsieAkoLg()
  const [active, setActive] = useState(0)
  const vyber = useCallback((i) => setActive(i), [])

  const aktivna = SLUZBY[active]
  const skupinaAktivnej = skupinaPodlaId(aktivna.skupina)

  return (
    <Sekcia id="sluzby" pasmo="biela">
      <SekciaHlavicka
        stitok="Služby"
        nadpis="Čo realizujeme na pozemných komunikáciách"
        perex={PEREX}
        akcia={
          <Tlacidlo variant="tichy" to="/sluzby">
            Všetkých deväť služieb
          </Tlacidlo>
        }
      />

      {siroke ? (
        <div className="mt-10 grid grid-cols-12 items-start gap-16">
          <Reveal className="col-span-5 self-center">
            <div aria-hidden="true" className="h-[2px] w-full bg-[var(--color-border)]">
              <div
                className={`h-full bg-[var(--color-accent)] ${
                  reduced ? '' : 'transition-[width] duration-[var(--duration-fast)]'
                }`}
                style={{ width: `${((active + 1) / SLUZBY.length) * 100}%` }}
              />
            </div>

            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              // Pevnú výšku drží celý blok, nie jednotlivé riadky: pri krátkom
              // názve tak nevznikne diera medzi titulom a textom, a poloha
              // objazdu ostáva pri prepínaní služieb rovnaká (nález z behu v4).
              className="mt-5 min-h-[15rem]"
            >
              <MonoStitok sCiarkou={false}>{skupinaAktivnej?.nazov}</MonoStitok>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {aktivna.nazov}
              </h3>
              <p className="mt-4 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {aktivna.perex}
              </p>
            </motion.div>

            <p className="mt-5 flex items-baseline justify-between gap-6 border-t border-[var(--color-border)] pt-4">
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {aktivna.dlazdica.miesto}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] tabular-nums text-[var(--color-muted)]">
                {`${active + 1} / ${SLUZBY.length}`}
              </span>
            </p>

            <Tlacidlo variant="tichy" to={`/sluzby/${aktivna.slug}`} className="mt-8">
              Detail služby
            </Tlacidlo>
          </Reveal>

          <Reveal className="col-span-7">
            <KruhovyObjazd
              sluzby={SLUZBY}
              active={active}
              onActive={vyber}
              reduced={reduced}
              velkost={600}
              uzol={56}
            />
          </Reveal>
        </div>
      ) : (
        <div className="mt-12">
          {SKUPINY.map((skupina, si) => (
            <div key={skupina.id} className={si === 0 ? '' : 'mt-12'}>
              <MonoStitok sCiarkou={false}>{skupina.nazov}</MonoStitok>
              <ul className="mt-4 border-t border-[var(--color-border)]">
                {sluzbyPodlaSkupiny(skupina.id).map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/sluzby/${s.slug}`}
                      className="group flex items-start gap-5 border-b border-[var(--color-border)] py-5 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)]"
                    >
                      <img
                        src={`${BASE}assets/${s.dlazdica.src}`}
                        width={s.dlazdica.w}
                        height={s.dlazdica.h}
                        alt={s.dlazdica.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-[72px] w-[72px] shrink-0 object-cover"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                          {s.nazov}
                        </h3>
                        <p className="mt-2 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                          {s.perex}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[2px]"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Sekcia>
  )
}
