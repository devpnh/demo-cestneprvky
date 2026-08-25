import { useEffect, useState } from 'react'
import { motion, useTransform } from 'motion/react'
import { StickySection } from '../../../components/primitives/index.js'
import { MonoStitok, PasFaktov, Tlacidlo } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { sluzbaPodlaSlugu } from '../../../content/sluzby.js'
import { GALERIA } from '../../../content/realizacie.js'

const SLUZBA = sluzbaPodlaSlugu('znacenie-pre-nevidiacich')
const BASE = import.meta.env.BASE_URL

const fotka = (id) => GALERIA.find((r) => r.id === id)

/**
 * Zábery scrubu. Každý je jedna položka zo `zoznamy` služby, ku ktorej
 * existuje doložená fotografia v `realizacie.js` — nič sa nedopĺňa obrázkom
 * „na tému“. Poradie kopíruje poradie v dátach: najprv exteriér, na konci
 * interiér. `.filter` chráni pred tým, aby preklep v `id` urobil prázdny záber.
 */
const ZABERY = [
  { skupina: 'Exteriér', polozka: 'Varovný pás', foto: fotka('varovny-pas-ba') },
  { skupina: 'Exteriér', polozka: 'Signálny pás', foto: fotka('tornala-signalny-pas') },
  { skupina: 'Exteriér', polozka: 'Vodiaca línia', foto: fotka('nivy-vodiaca-linia') },
  { skupina: 'Exteriér', polozka: 'Nerezové indikátory v exteriéri', foto: fotka('nerezove-indikatory-varovny-pas') },
  { skupina: 'Interiér', polozka: 'Vodiaca línia', foto: fotka('nivy-interier-hala') },
].filter((z) => z.foto)

const POCET = ZABERY.length

/** Index záberu pre položku zoznamu, alebo -1, keď k nej fotku nemáme. */
const indexZaberu = (skupina, polozka) =>
  ZABERY.findIndex((z) => z.skupina === skupina && z.polozka === polozka)

/**
 * Vstupný rozsah musí byť prísne rastúci a ležať v [0, 1]: `motion` viaže
 * scroll-linked MotionValue na WAAPI animáciu so ScrollTimeline a rozsah
 * použije ako keyframe offsety. Hodnota mimo [0, 1] alebo neklesajúca dvojica
 * zhodí celý React strom — prázdna stránka (nález z iterácie 1 tohto projektu).
 */
function useFaza(progress, index, total, min) {
  const start = index / total
  const end = (index + 1) / total
  const fade = Math.min(0.05, 0.5 / total)
  const prvy = index === 0
  const posledny = index === total - 1

  // Rozsah MUSÍ začínať na 0 a končiť na 1. Nameraný dôvod: keď posledný bod
  // rozsahu nie je 1, WAAPI si k nemu domyslí implicitný keyframe s pôvodnou
  // hodnotou štýlu (opacity 1) a vrstva sa od konca svojej fázy lineárne
  // vracia späť do plnej viditeľnosti — prvý záber tak ghostoval popod celý
  // zvyšok scrubu (namerané: 0,07 → 0,27 → 0,47 → 1,0).
  const body = [0]
  const hodnoty = [prvy ? 1 : min]

  if (prvy) {
    // Prvý záber je viditeľný už pri progress 0, keď sekcia prichádza zdola:
    // pásmo nikdy nezačína ako prázdny tmavý obdĺžnik.
    body.push(0.001)
    hodnoty.push(1)
  } else {
    body.push(start - fade, start + fade)
    hodnoty.push(min, 1)
  }

  if (posledny) {
    // Posledný záber ostáva viditeľný až do odchodu sekcie.
    body.push(0.999, 1)
    hodnoty.push(1, 1)
  } else {
    body.push(end - fade, end + fade, 1)
    hodnoty.push(1, min, min)
  }

  return useTransform(progress, body, hodnoty)
}

function FotoVrstva({ progress, index, zaber }) {
  const opacity = useFaza(progress, index, POCET, 0)
  return (
    <motion.img
      style={{ opacity, borderRadius: 'var(--radius-sm)' }}
      src={`${BASE}assets/${zaber.foto.src}`}
      width={zaber.foto.w}
      height={zaber.foto.h}
      alt={zaber.foto.alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
      data-zaber={index}
    />
  )
}

/** Miesto realizácie pod fotkou; „Realizácia klienta“ tam, kde miesto nevieme doložiť. */
function PopisVrstva({ progress, index, zaber }) {
  const opacity = useFaza(progress, index, POCET, 0)
  return (
    <motion.span
      style={{ opacity }}
      className="absolute inset-x-0 top-0 block font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[rgba(255,255,255,0.72)]"
    >
      {zaber.foto.miesto}
    </motion.span>
  )
}

const TRIEDA_POLOZKY =
  'flex items-baseline gap-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)]'

function Odrazka({ akcent }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[0.55em] inline-block h-[6px] w-[6px] shrink-0 ${
        akcent ? 'bg-[var(--color-accent)]' : 'bg-[rgba(255,255,255,0.45)]'
      }`}
    />
  )
}

/** Položka, ktorú scrub rozsvieti (má vlastný záber). Základ 0,55 = 5,5:1 na tmavom. */
function PolozkaScrub({ progress, index, deti }) {
  const opacity = useFaza(progress, index, POCET, 0.55)
  return (
    <motion.li style={{ opacity }} className={TRIEDA_POLOZKY}>
      <Odrazka akcent />
      <span>{deti}</span>
    </motion.li>
  )
}

/** Položka bez fotky: ostáva čitateľná, len sa nerozsvecuje. */
function PolozkaStaticka({ deti }) {
  return (
    <li className={TRIEDA_POLOZKY} style={{ opacity: 0.55 }}>
      <Odrazka akcent={false} />
      <span>{deti}</span>
    </li>
  )
}

function ZoznamyPrvkov({ progress = null, triedaWrap = 'mt-8 grid grid-cols-1 gap-6' }) {
  return (
    <div className={triedaWrap}>
      {SLUZBA.zoznamy.map((zoznam) => (
        <div key={zoznam.titulok}>
          <MonoStitok tmava sCiarkou={false}>
            {zoznam.titulok}
          </MonoStitok>
          <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
            {zoznam.polozky.map((polozka) => {
              const i = indexZaberu(zoznam.titulok, polozka)
              if (progress && i >= 0) {
                return <PolozkaScrub key={polozka} progress={progress} index={i} deti={polozka} />
              }
              return <PolozkaStaticka key={polozka} deti={polozka} />
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** Ľavý stĺpec: text služby. Identický pre pin aj pre tečúcu verziu. */
function TextSluzby() {
  return (
    <>
      <MonoStitok tmava>Debarierizácia</MonoStitok>

      <h2 className="mt-5 max-w-[18ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
        {'Bezbariérové prvky bez zásahu do pôvodných konštrukcií'}
      </h2>

      {/* Z troch odsekov služby berie sekcia prvý: druhý hovorí o normách, ktoré
          sú pod ním ako mono pás, a tretí o indikátoroch, ktoré sú menovite v
          zozname prvkov aj na fotkách. Celý text je na `/sluzby/<slug>`. */}
      <p className="mt-6 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
        {SLUZBA.odseky[0]}
      </p>

      <PasFaktov fakty={SLUZBA.normy} tmava className="mt-6" />

      {/* Samostatný odkaz, nie odkaz v prose: preto má plných 44 px výšky (D2). */}
      <p className="mt-3 flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
        <span className="opacity-70">{'Partner:'}</span>
        <a
          href={SLUZBA.partner.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center font-medium underline decoration-[var(--color-accent)] decoration-2 underline-offset-4"
        >
          {SLUZBA.partner.nazov}
        </a>
      </p>

      <Tlacidlo variant="tichy" tmava to={`/sluzby/${SLUZBA.slug}`} className="mt-6">
        Detail služby
      </Tlacidlo>
    </>
  )
}

/**
 * Pripnutý panel (len ≥ 1024 px). Výška obsahu je zámerne držaná pod ~640 px,
 * aby sa zmestil aj do 768 px vysokého okna — `StickySection` má na pine
 * `overflow: hidden` a čokoľvek vyššie by sa oreza­lo.
 */
function Panel({ progress }) {
  const sirka = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <div className="flex h-full items-center py-[clamp(2rem,5vh,5rem)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <TextSluzby />
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--color-accent-2)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {ZABERY.map((zaber, i) => (
                <FotoVrstva key={zaber.foto.id} zaber={zaber} progress={progress} index={i} />
              ))}
            </div>

            <div className="relative mt-4 h-5">
              {ZABERY.map((zaber, i) => (
                <PopisVrstva key={zaber.foto.id} zaber={zaber} progress={progress} index={i} />
              ))}
            </div>

            <div
              className="mt-4 h-[2px] w-full"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 22%, transparent)' }}
            >
              <motion.div style={{ width: sirka }} className="h-full bg-[var(--color-accent)]" />
            </div>

            <ZoznamyPrvkov progress={progress} triedaWrap="mt-7 grid grid-cols-1 gap-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Tečúca verzia: pod 1024 px a pri `prefers-reduced-motion`. Pin s
 * `overflow: hidden` v 100vh kontajneri v tomto projekte už raz orezal H2
 * úplne (v4, 390 aj 768 px), preto sa scrub pod 1024 px vôbec nemontuje —
 * nie je len skrytý, neexistuje.
 */
function TokovaSekcia() {
  const prvy = ZABERY[0]
  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
      <TextSluzby />

      <figure className="mt-8">
        <div
          className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-accent-2)]"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          <img
            src={`${BASE}assets/${prvy.foto.src}`}
            width={prvy.foto.w}
            height={prvy.foto.h}
            alt={prvy.foto.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <figcaption className="mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
          {prvy.foto.miesto}
        </figcaption>
      </figure>

      <ZoznamyPrvkov triedaWrap="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8" />
    </div>
  )
}

/** ≥ 1024 px = pin, nižšie tečúca sekcia. Prepínač je `matchMedia`, nie CSS. */
function useJeDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = (e) => setDesktop(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return desktop
}

/**
 * Jediná scroll-linkovaná animácia na celom webe (KOMPOZÍCIA §4). Runway
 * 260vh dáva piatim záberom po ~32vh dráhy; `useScroll` v `StickySection`
 * vracia progress v [0, 1], takže vstupy `useTransform` sú vždy v rozsahu.
 */
export default function Debarierizacia() {
  const desktop = useJeDesktop()
  const reduced = useReducedMotion()
  const pin = desktop && !reduced

  return (
    <section id="debarierizacia" data-pasmo="tmava" className="bg-[var(--color-surface-2)] text-[var(--color-bg)]">
      {pin ? (
        <StickySection
          heightVh={260}
          className="bg-[var(--color-surface-2)]"
          render={(scrollYProgress) => <Panel progress={scrollYProgress} />}
        />
      ) : (
        <TokovaSekcia />
      )}
    </section>
  )
}
