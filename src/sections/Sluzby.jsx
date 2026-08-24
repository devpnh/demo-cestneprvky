import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '../components/primitives/index.js'
import { useReducedMotion } from '../lib/useReducedMotion.js'
import { openObhliadka } from '../lib/obhliadka.js'

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

/**
 * Kruhový objazd ako znovupoužiteľný blok: desktop 600 px, mobil 340 px.
 * Rozmery sa odvíjajú od `velkost`; uzly majú na mobile plných 44 px (tap target).
 */
function KruhovyObjazd({ velkost, uzol, hub, polozky, active, locked, reduced, spinning, onHoverStart, onHoverEnd, onEnterNode, onSelect }) {
  const polomer = Math.round(velkost * 0.4)
  const cesta = Math.round(velkost * 0.0867)
  const okraj = Math.round(cesta / 2 + 1)
  const stred = velkost / 2
  return (
    <div
      data-objazd=""
      className={`relative mx-auto aspect-square w-full select-none overflow-hidden ${spinning ? '' : 'orbit-paused'}`}
      style={{ maxWidth: `${velkost}px` }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <svg viewBox={`0 0 ${velkost} ${velkost}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx={stred} cy={stred} r={polomer} fill="none" stroke="var(--color-surface-2)" strokeWidth={cesta} />
        <circle cx={stred} cy={stred} r={polomer + okraj} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx={stred} cy={stred} r={polomer - okraj} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx={stred} cy={stred} r={polomer} fill="none" stroke="var(--color-bg)" strokeWidth="2.5" strokeDasharray="16 14" />
      </svg>

      {/* Stredový ostrovček: projekt aktívnej služby presne v mieste pozornosti */}
      <div
        data-hub=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ height: `${hub}px`, width: `${hub}px` }}
      >
        {polozky.map((polozka, i) => (
          <img
            key={polozka.foto}
            src={`${import.meta.env.BASE_URL}assets/${polozka.foto}`}
            width={600}
            height={390}
            alt={i === active ? polozka.alt : ''}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover ${
              reduced ? '' : 'transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-house)]'
            } ${i === active ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'}`}
          />
        ))}
      </div>

      {/* Obiehajúce prvky: rotujúca vrstva + protismerná kompenzácia */}
      <div className={`absolute inset-0 ${reduced ? '' : 'orbit-anim'}`}>
        {polozky.map((polozka, i) => {
          const uhol = (i / polozky.length) * 360 - 90
          const jeAktivna = active === i
          return (
            <div
              key={polozka.foto}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{ transform: `rotate(${uhol}deg) translateY(-${polomer}px) rotate(${-uhol}deg)` }}
            >
              <div className={reduced ? '' : 'orbit-anim-rev'}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  onMouseEnter={() => onEnterNode(i)}
                  onFocus={() => onEnterNode(i)}
                  aria-label={polozka.nazov}
                  aria-pressed={locked && jeAktivna}
                  className={`block overflow-hidden rounded-full ${
                    reduced ? '' : 'transition-[transform,border-color] duration-[var(--duration-fast)]'
                  } ${
                    jeAktivna
                      ? 'scale-[1.22] border-[3px] border-[var(--color-accent)]'
                      : 'border-2 border-[var(--color-bg)] hover:border-[var(--color-accent)]'
                  }`}
                  style={{ height: `${uzol}px`, width: `${uzol}px`, marginLeft: `-${uzol / 2}px`, marginTop: `-${uzol / 2}px` }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}assets/${polozka.foto}`}
                    width={600}
                    height={390}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Sluzby() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [locked, setLocked] = useState(false)
  const [hovering, setHovering] = useState(false)
  const aktivna = POLOZKY[active]
  const spinning = !reduced && !locked && !hovering

  // Auto-postup aktívneho prvku, kým používateľ nedrží kurzor na objazde
  // a nič si nezamkol klikom. Pri reduced-motion sa nič samo nehýbe.
  useEffect(() => {
    if (reduced || locked || hovering) return undefined
    const t = setInterval(() => setActive((a) => (a + 1) % POLOZKY.length), 4000)
    return () => clearInterval(t)
  }, [reduced, locked, hovering])

  const vyberPrvok = (i) => {
    if (locked && active === i) {
      setLocked(false)
    } else {
      setActive(i)
      setLocked(true)
    }
  }

  return (
    <section id="sluzby" className="bg-[var(--color-bg)] py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Služby
              </p>
              <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                Čo realizujeme na pozemných komunikáciách
              </h2>
            </div>
            <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)] lg:col-span-5 lg:ml-auto">
              {'Deväť prvkov v troch celkoch: debarierizácia a značenie, konštrukčné prvky vozovky, povrchy a údržba. Rozsah aj materiál prispôsobíme zadaniu objednávateľa.'}
            </p>
          </div>
        </Reveal>

        {/* Desktop: kruhový objazd: prvky obiehajú po ceste, hover nad uzlom
            zobrazí projekt v strede objazdu; detail vľavo. */}
        <div className="mt-16 hidden lg:mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-16">
          <Reveal className="lg:col-span-5 lg:self-center">
            <div aria-hidden="true" className="h-[2px] w-full" style={{ backgroundColor: 'var(--color-border)' }}>
              <div
                className={`h-full bg-[var(--color-accent)] ${reduced ? '' : 'transition-[width] duration-[var(--duration-fast)]'}`}
                style={{ width: `${((active + 1) / POLOZKY.length) * 100}%` }}
              />
            </div>

            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mt-5"
            >
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {SKUPINA_POLOZKY[active]}
              </p>
              <h3 className="mt-3 min-h-[62px] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {aktivna.nazov}
              </h3>
              <p className="mt-3 min-h-[78px] max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
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

            <button
              type="button"
              onClick={() => openObhliadka(aktivna.nazov)}
              className="mt-10 inline-flex min-h-[44px] items-center gap-2 border-b-2 border-[var(--color-accent)] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-semibold text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)]"
            >
              Konzultovať konkrétny prvok so zadaním
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </Reveal>

          <Reveal className="lg:col-span-7">
            <KruhovyObjazd
              velkost={600}
              uzol={56}
              hub={316}
              polozky={POLOZKY}
              active={active}
              locked={locked}
              reduced={reduced}
              spinning={spinning}
              onHoverStart={() => setHovering(true)}
              onHoverEnd={() => setHovering(false)}
              onEnterNode={(i) => setActive(i)}
              onSelect={vyberPrvok}
            />
          </Reveal>
        </div>

        {/* Mobil: zoznam s náhľadmi (objazd je len na desktope) */}
        <div className="mt-14 lg:hidden">
          {SKUPINY.map((skupina, si) => (
            <div key={skupina.skupina} className={si === 0 ? '' : 'mt-12'}>
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {skupina.skupina}
              </p>
              <ul className="mt-3 border-t border-[var(--color-border)]">
                {skupina.polozky.map((polozka) => (
                  <li key={polozka.nazov} className="border-b border-[var(--color-border)] py-4">
                    <div className="flex items-start gap-5">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/${polozka.foto}`}
                        width={600}
                        height={390}
                        alt={polozka.alt}
                        loading="lazy"
                        className="h-[72px] w-[72px] shrink-0 object-cover"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                          {polozka.nazov}
                        </h3>
                        <p className="mt-2 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                          {polozka.popis}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Reveal className="mt-12">
            <button
              type="button"
              onClick={() => openObhliadka()}
              className="inline-flex min-h-[44px] items-center gap-2 border-b-2 border-[var(--color-accent)] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-semibold text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)]"
            >
              Konzultovať konkrétny prvok so zadaním
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
