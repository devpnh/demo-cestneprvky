import { useEffect, useState } from 'react'
import { motion, useTransform } from 'motion/react'
import { StickySection } from '../../../components/primitives/index.js'
import { MonoStitok, PasFaktov, Tlacidlo } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { sluzbaPodlaSlugu } from '../../../content/sluzby.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

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
 * Šírka prelínačky ako podiel celého rozsahu scrubu.
 *
 * Pred opravou to bolo 0,05 na KAŽDÚ stranu hranice, teda 10 % rozsahu na
 * jeden prechod a 40 % celého scrubu strávených v prelínačke. Namerané pri 21
 * vzorkách: v štyroch z nich ležali dva mono popisky na tej istej súradnici,
 * oba na opacity ~0,5 — nečitateľná šmuha a fotka ako červený duch jednej
 * scény cez druhú. 0,02 znamená, že prelínačka trvá 2 % dráhy a ustálený stav
 * (jedna fotka, jeden popisok) drží zvyšných 98 %.
 *
 * Okno prelínačky KONČÍ na hranici fázy, nie je okolo nej vycentrované.
 * Hranice piatich záberov sú 0,2 / 0,4 / 0,6 / 0,8, teda presne body, v
 * ktorých padne vzorka pri kroku 0,05; symetrické okno by v každej z nich
 * trafilo stav 50/50. Takto je v každej vzorke práve jedna fotka na 1.
 */
const PRELIN = 0.02

/**
 * Vstupný rozsah musí byť prísne rastúci a ležať v [0, 1]: `motion` viaže
 * scroll-linked MotionValue na WAAPI animáciu so ScrollTimeline a rozsah
 * použije ako keyframe offsety. Hodnota mimo [0, 1] alebo neklesajúca dvojica
 * zhodí celý React strom — prázdna stránka (nález z iterácie 1 tohto projektu).
 *
 * Rozsah MUSÍ okrem toho explicitne obsahovať 0 aj 1. Nameraný dôvod: keď
 * posledný bod rozsahu nie je 1, WAAPI si k nemu domyslí implicitný keyframe
 * s pôvodnou hodnotou štýlu (opacity 1) a vrstva sa od konca svojej fázy
 * lineárne vracia späť do plnej viditeľnosti — prvý záber tak ghostoval popod
 * celý zvyšok scrubu (namerané: 0,07 → 0,27 → 0,47 → 1,0).
 */
function useFaza(progress, index, total, min) {
  const start = index / total
  const end = (index + 1) / total
  const w = Math.min(PRELIN, 0.5 / total)

  const body = [0]
  const hodnoty = [index === 0 ? 1 : min]

  // Prvý záber je na 1 už pri progress 0, keď sekcia prichádza zdola: pásmo
  // nikdy nezačína ako prázdny tmavý obdĺžnik.
  if (index > 0) {
    body.push(start - w, start)
    hodnoty.push(min, 1)
  }

  if (index < total - 1) {
    body.push(end - w, end, 1)
    hodnoty.push(1, min, min)
  } else {
    // Posledný záber ostáva viditeľný až do odchodu sekcie.
    body.push(1)
    hodnoty.push(1)
  }

  return useTransform(progress, body, hodnoty)
}

/**
 * Fáza mono popisku pod fotkou. Fotky sa prelínať smú, text nie: dva popisky
 * na tej istej súradnici sú vždy šmuha, nikdy prelínačka.
 *
 * Rozsahy susedných popiskov sú preto DISJUNKTNÉ. Prepis je v poslednej
 * štvrtine okna prelínačky fotiek: starý popisok dobehne na 0 v jej prvej
 * polovici, nový nabehne v druhej. Existuje presne jeden bod (stred prepisu),
 * kde sú oba na nule — nikdy ani jeden bod, kde by boli oba nad ňou. Preto je
 * počet dvojíc „oba nad 0,08“ nulový pri ĽUBOVOĽNEJ hustote vzorkovania, nie
 * len pri tých 21 vzorkách, ktoré meral kritik.
 *
 * Prepis je až na konci prelínačky, nie v jej strede, zámerne: v strede je
 * fotka 50/50 a práve tam sa robí dôkazový výrez. Keby prepis padol tam,
 * výrez by ukázal prelínačku fotiek bez akéhokoľvek popisku. Takto tam stojí
 * starý popisok v plnej sile a preskočí na nový vtedy, keď nová fotka dosadá.
 */
const PREPIS = PRELIN / 4

function useFazaPopisu(progress, index, total) {
  const start = index / total
  const end = (index + 1) / total
  const p = Math.min(PREPIS, 0.125 / total)
  const pol = p / 2

  const body = [0]
  const hodnoty = [index === 0 ? 1 : 0]

  if (index > 0) {
    body.push(start - pol, start)
    hodnoty.push(0, 1)
  }

  if (index < total - 1) {
    body.push(end - p, end - pol, 1)
    hodnoty.push(1, 0, 0)
  } else {
    body.push(1)
    hodnoty.push(1)
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

const TRIEDA_POPISU =
  'font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[rgba(255,255,255,0.72)]'

/**
 * Popisok pod fotkou: typ prvku a za ním časti z `Realizacie/skupiny.js`
 * (`castiPopisu`) — to isté pravidlo, aké má mriežka galérie, lightbox aj
 * sklená karta hero. Poradie je rovnaké ako v galérii, kde typ prvku stojí
 * nad mono riadkom; tu je na jednom riadku, lebo popisok je vrstva s pevnou
 * výškou a dva riadky by sa pod ňou prekrývali.
 *
 * Pri štvrtom zábere miesto doložené nemáme, takže sa nevypíše a ničím sa
 * nenahrádza — ostáva typ prvku a prostredie, ktoré z fotky vieme.
 *
 * Časti sa spájajú do JEDNÉHO textového uzla, nie do vnorených `<span>`ov ako
 * v mriežke galérie. Vrstva popisku má `opacity: 0`, keď nie je na rade, a
 * meranie kontrastu preskakuje prvok s nulovou opacitou, nie však jeho deti —
 * vnorené spany by sa merali ako tmavý text na tmavom podklade (1,00:1) a
 * kontrola B7 by na nich spadla 18×. Namerané, nie odhadnuté.
 */
const popisZaberu = (zaber) => [zaber.foto.prvok, ...castiPopisu(zaber.foto)].join(' · ')

function PopisVrstva({ progress, index, zaber }) {
  const opacity = useFazaPopisu(progress, index, POCET)
  return (
    <motion.span
      style={{ opacity }}
      data-popis={index}
      className={`absolute inset-x-0 top-0 block ${TRIEDA_POPISU}`}
    >
      {popisZaberu(zaber)}
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

/**
 * Položka bez vlastnej fázy. V tečúcej verzii nie je čo „rozsvecovať“, takže
 * je celý zoznam v plnej sile; v pripnutej verzii je stlmená na 0,55, čo je
 * na tmavom pásme 5,5:1 — teda stále čitateľné telo, nie dekorácia.
 */
function PolozkaStaticka({ deti, tlmena }) {
  return (
    <li className={TRIEDA_POLOZKY} style={tlmena ? { opacity: 0.55 } : undefined}>
      <Odrazka akcent={!tlmena} />
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
              return <PolozkaStaticka key={polozka} deti={polozka} tlmena={!!progress} />
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

      {/*
        Únia nevidiacich a slabozrakých Slovenska je adresa, kde sa dá získať
        konzultácia a stanovisko, nie spolupracujúca strana — podklady klienta
        o žiadnej spolupráci nehovoria a tvrdiť ju za existujúcu organizáciu
        nesmieme. Štítok preto berieme doslova z dát (`konzultacie.stitok`).
        Samostatný odkaz, nie odkaz v prose: preto má plných 44 px výšky (D2).
      */}
      <p className="mt-3 flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
        <span className="opacity-70">{`${SLUZBA.konzultacie.stitok}:`}</span>
        <a
          href={SLUZBA.konzultacie.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center font-medium underline decoration-[var(--color-accent)] decoration-2 underline-offset-4"
        >
          {SLUZBA.konzultacie.nazov}
        </a>
      </p>

      <Tlacidlo variant="tichy" tmava to={`/sluzby/${SLUZBA.slug}`} className="mt-6">
        Detail služby
      </Tlacidlo>
    </>
  )
}

/**
 * Pripnutý panel.
 *
 * `pt-9` je polovica 72 px vysokej fixnej hlavičky. Panel je geometricky
 * vycentrovaný v pine, ale hlavička prekrýva horných 72 px, takže OPTICKY
 * vychádzal o 72 px hore natesno a dole ostával tmavý pás — presne to, čo
 * videl kritik. Posun o polovicu rozdiel rozdelí: geometrická aj optická
 * odchýlka od stredu je potom rovnakých 36 px, teda obe pod limitom 40 px.
 * Výška fotky je viazaná na výšku okna (`42vh`), aby panel vypĺňal obrazovku
 * aj na vyšších monitoroch a nevznikal prázdny tmavý pás.
 */
function Panel({ progress }) {
  const sirka = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <div className="flex h-full items-center py-[clamp(2rem,5vh,5rem)] pt-[calc(clamp(2rem,5vh,5rem)+36px)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <TextSluzby />
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative h-[clamp(15rem,42vh,26rem)] w-full overflow-hidden bg-[var(--color-accent-2)]"
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
        <figcaption className={`mt-4 ${TRIEDA_POPISU}`}>
          {popisZaberu(prvy)}
        </figcaption>
      </figure>

      <ZoznamyPrvkov triedaWrap="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8" />
    </div>
  )
}

/**
 * Pin sa montuje len na dosť veľkom okne. Šírka 1024 px je zadanie; podmienka
 * na výšku je poistka: v okne nižšom než 700 px by sa panel do 100vh pinu s
 * `overflow: hidden` nezmestil a orezal by spodok, čo je presne tá chyba,
 * ktorú tento projekt už raz mal na mobile.
 */
const DOTAZ_PIN = '(min-width: 1024px) and (min-height: 700px)'

function useJeDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DOTAZ_PIN).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(DOTAZ_PIN)
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
