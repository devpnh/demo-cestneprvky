import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '../components/primitives/index.js'
import { useReducedMotion } from '../lib/useReducedMotion.js'

/**
 * Katalóg služieb: vľavo index z veľkých titulov (žiadne boxy, žiadne čísla),
 * vpravo sticky panel s fotkou aktívnej služby, popisom a polohou v zozname.
 * Fotky = dlaždice služieb z pôvodného webu klienta, miesta z názvov súborov;
 * kde plný názov miesta nie je istý, stojí pravdivé „Vlastná realizácia“.
 */
const SKUPINY = [
  {
    skupina: 'Debarierizácia a značenie',
    polozky: [
      {
        nazov: 'Značenie pre nevidiacich a slabozrakých',
        popis:
          'Štruktúrované značenie a piktogramy stierkovaním studeným plastom Kaltplastik, mosadzné a nerezové indikátory.',
        foto: '00-ZubaC48Dka-600x390.jpg',
        miesto: 'Zubačka',
        alt: 'Značenie pre nevidiacich na nástupišti, Zubačka',
      },
      {
        nazov: 'Vodorovné dopravné značenie',
        popis:
          'Inštalácie z materiálov ColdPlastik: priechody pre chodcov, vodiace línie, opticko-akustická brzda, piktogramy.',
        foto: '02-PD-1-600x390.jpg',
        miesto: 'Vlastná realizácia',
        alt: 'Vodorovné dopravné značenie priechodu pre chodcov',
      },
      {
        nazov: 'Odstránenie starého vodorovného dopravného značenia',
        popis:
          'Odstránenie prekonaného značenia pred obnovou trasy alebo zmenou organizácie dopravy.',
        foto: '08-BA_Bosakova-600x390.jpg',
        miesto: 'Bratislava Bosákova',
        alt: 'Odstránenie starého vodorovného dopravného značenia, Bratislava Bosákova',
      },
    ],
  },
  {
    skupina: 'Konštrukčné prvky vozovky',
    polozky: [
      {
        nazov: 'Lepené obrubníky',
        popis:
          'Nízke obrubníky lepené tmelom na báze akrylovej živice, bez búracích prác a ťažkých mechanizmov.',
        foto: '01-Medeny_Hamor_1-600x390.jpg',
        miesto: 'Medený Hámor',
        alt: 'Lepené cestné obrubníky, Medený Hámor',
      },
      {
        nazov: 'Spomaľovače dopravy (retardéry)',
        popis:
          'DEBUZ® retardéry Kölner Teller z liateho hliníka na upokojovanie dopravy pri školách a priechodoch pre chodcov.',
        foto: '03-MT_1-600x390.jpg',
        miesto: 'Vlastná realizácia',
        alt: 'Spomaľovače dopravy Kölner Teller osadené na vozovke',
      },
      {
        nazov: 'Cyklotrasy',
        popis:
          'Značenie a bezpečnostné prvky cyklistických chodníkov a ich napojení na komunikácie.',
        foto: '06-IMG_1565-480x390.jpg',
        miesto: 'Vlastná realizácia',
        alt: 'Značenie cyklotrasy na komunikácii',
      },
    ],
  },
  {
    skupina: 'Povrchy a údržba',
    polozky: [
      {
        nazov: 'Zálievkové a vysprávkové hmoty',
        popis:
          'Ošetrenie škár a lokálnych porúch krytu vozovky zálievkovými a vysprávkovými hmotami.',
        foto: '04-zalievkove_hmoty_01-600x390.jpg',
        miesto: 'Vlastná realizácia',
        alt: 'Aplikácia zálievkovej hmoty do škáry vozovky',
      },
      {
        nazov: 'Bezpečnostný protišmykový náter',
        popis:
          'Protišmykový náter na miesta so zvýšeným rizikom šmyku, na pochôdzne aj pojazdné plochy.',
        foto: '05-Protismykove-pasy-Filakovo3-416x390.jpg',
        miesto: 'Fiľakovo',
        alt: 'Bezpečnostné protišmykové pásy, Fiľakovo',
      },
      {
        nazov: 'Štítky: Braillovo písmo, gravírovanie, hmatové mapy',
        popis:
          'Orientačné štítky, gravírovanie a hmatové mapy pre osoby so zrakovým postihnutím.',
        foto: '07-Braill-600x390.jpg',
        miesto: 'Produktová fotografia',
        alt: 'Orientačné štítky s Braillovým písmom',
      },
    ],
  },
]

const POLOZKY = SKUPINY.flatMap((s) => s.polozky)
const SKUPINA_POLOZKY = POLOZKY.map(
  (p) => SKUPINY.find((s) => s.polozky.includes(p)).skupina,
)

export default function Sluzby() {
  const reduced = useReducedMotion()
  const rowRefs = useRef([])
  const [scrollIdx, setScrollIdx] = useState(0)
  const [hoverIdx, setHoverIdx] = useState(null)
  const active = hoverIdx ?? scrollIdx
  const aktivna = POLOZKY[active]

  // Aktívny riadok podľa pozície scrollu: posledný riadok nad čiarou v ~45 %
  // viewportu. Zámerne pozičná matematika, nie IntersectionObserver (D6).
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const line = window.scrollY + window.innerHeight * 0.45
      let idx = 0
      rowRefs.current.forEach((el, i) => {
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= line) idx = i
        }
      })
      setScrollIdx(idx)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  let globalIdx = -1

  return (
    <section id="sluzby" className="bg-[var(--color-bg)] py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Služby
              </p>
              <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                Čo realizujeme na pozemných komunikáciách
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {'Deväť prvkov v troch celkoch: debarierizácia a značenie, konštrukčné prvky vozovky, povrchy a údržba. Rozsah aj materiál prispôsobíme zadaniu objednávateľa.'}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Index služieb: veľké tituly, aktívny nesie šev a plný atrament */}
          <div className="lg:col-span-7">
            {SKUPINY.map((skupina, si) => (
              <div key={skupina.skupina} className={si === 0 ? '' : 'mt-12 lg:mt-14'}>
                <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {skupina.skupina}
                </p>
                <ul className="mt-3 border-t border-[var(--color-border)]">
                  {skupina.polozky.map((polozka) => {
                    globalIdx += 1
                    const i = globalIdx
                    const jeAktivna = active === i
                    return (
                      <li
                        key={polozka.nazov}
                        ref={(el) => { rowRefs.current[i] = el }}
                        className="relative border-b border-[var(--color-border)]"
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-4 bottom-4 w-[2px] transition-colors duration-[var(--duration-fast)] ${
                            jeAktivna ? 'bg-[var(--color-accent)]' : 'bg-transparent'
                          }`}
                        />
                        <button
                          type="button"
                          onMouseEnter={() => setHoverIdx(i)}
                          onMouseLeave={() => setHoverIdx(null)}
                          onFocus={() => setHoverIdx(i)}
                          onBlur={() => setHoverIdx(null)}
                          aria-current={jeAktivna ? 'true' : undefined}
                          className="block w-full py-4 pl-5 text-left lg:py-5"
                        >
                          <span className="flex items-start gap-5">
                            <img
                              src={`${import.meta.env.BASE_URL}assets/${polozka.foto}`}
                              width={600}
                              height={390}
                              alt={polozka.alt}
                              loading="lazy"
                              className="h-[72px] w-[72px] shrink-0 object-cover lg:hidden"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                            />
                            <span className="min-w-0">
                              <span
                                className={`block font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] lg:text-[length:var(--text-3xl)] ${
                                  reduced ? '' : 'transition-[color,transform] duration-[var(--duration-fast)]'
                                } ${
                                  jeAktivna
                                    ? 'text-[var(--color-text)] lg:translate-x-[6px]'
                                    : 'text-[var(--color-text)] lg:translate-x-0 lg:text-[var(--color-muted)]'
                                }`}
                              >
                                {polozka.nazov}
                              </span>
                              <span className="mt-2 block max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)] lg:hidden">
                                {polozka.popis}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Sticky panel: fotka, poloha v katalógu, popis a miesto */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[104px]">
              <div
                className="relative aspect-[600/390] w-full overflow-hidden bg-[var(--color-surface)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {POLOZKY.map((polozka, i) => (
                  <img
                    key={polozka.foto}
                    src={`${import.meta.env.BASE_URL}assets/${polozka.foto}`}
                    width={600}
                    height={390}
                    alt={i === active ? polozka.alt : ''}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover ${
                      reduced ? '' : 'transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-house)]'
                    } ${i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
                  />
                ))}
              </div>

              <div
                aria-hidden="true"
                className="mt-5 h-[2px] w-full"
                style={{ backgroundColor: 'var(--color-border)' }}
              >
                <div
                  className={`h-full bg-[var(--color-accent)] ${reduced ? '' : 'transition-[width] duration-[var(--duration-fast)]'}`}
                  style={{ width: `${((active + 1) / POLOZKY.length) * 100}%` }}
                />
              </div>

              <motion.div
                key={active}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-5"
              >
                <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {SKUPINA_POLOZKY[active]}
                </p>
                <p className="mt-3 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                  {aktivna.popis}
                </p>
              </motion.div>

              <p className="mt-5 flex items-baseline justify-between gap-6 border-t border-[var(--color-border)] pt-4">
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {aktivna.miesto}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] tabular-nums text-[var(--color-muted)]">
                  {`${active + 1} / ${POLOZKY.length}`}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Reveal className="mt-14">
          <a
            href="#kontakt"
            className="inline-flex min-h-[44px] items-center gap-2 border-b-2 border-[var(--color-accent)] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-semibold text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)]"
          >
            Konzultovať konkrétny prvok so zadaním
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
