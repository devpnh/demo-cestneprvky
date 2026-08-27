import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Reveal, Stagger, StaggerItem, SplitText, TextRotate } from '../../../components/primitives/index.js'
import { Tlacidlo } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { openObhliadka } from '../../../lib/obhliadka.js'
import { FIRMA } from '../../../content/firma.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

/**
 * Segmenty hero slučky (`public/hero/hero.mp4`, 14,4 s). Časy sú stredy
 * prelínačiek vo videu, popisky sú fakty z názvov fotografií klienta.
 * Tretí záber nemá v názve plný názov miesta, preto stojí bez miesta.
 * (Prenesené z pôvodnej jednostránky `src/sections/HlavickaAHero.jsx`.)
 *
 * `isteMiesto` je tu preto, aby sa záber dal poslať do `castiPopisu` z
 * `Realizacie/skupiny.js` — pravidlo popisku má na celom webe žiť na jednom
 * mieste (galéria, lightbox, sticky-scrub, táto karta).
 */
const ZABERY = [
  { od: 0, prvok: 'Značenie pre nevidiacich a slabozrakých', miesto: 'Zubačka', isteMiesto: true },
  { od: 3.8, prvok: 'Vodiaca línia', miesto: 'Tornaľa', isteMiesto: true },
  { od: 7.2, prvok: 'Varovný pás a protišmykový náter schodiskového stupňa', miesto: null, isteMiesto: false },
  { od: 10.6, prvok: 'Značenie pre nevidiacich a slabozrakých', miesto: 'Zubačka', isteMiesto: true },
]

/** Texty rotátora v karte. Sú to tie isté fakty zo `ZABERY`, len rozdelené na
 *  meno prvku a miesto, aby sa dali vymieňať samostatne. Kde miesto nevieme
 *  doložiť, ostáva prázdny reťazec — karta mlčí, nedopĺňa. */
const MENA_PRVKOV = ZABERY.map((z) => z.prvok)
const MIESTA_ZABEROV = ZABERY.map((z) => castiPopisu(z).join(' · '))

/**
 * Dvojitý scrim nad záberom. Hodnoty nie sú vkusové: text hero sedí v dolnej
 * tretine a vľavo, takže tam musí byť podklad tmavý natoľko, aby biele telo
 * malo 4,5:1 aj nad najsvetlejším pixelom záberu (namerané, nie odhadnuté).
 */
const SCRIM_ZVISLY =
  'linear-gradient(180deg, rgba(38,41,44,0.52) 0%, rgba(38,41,44,0.26) 26%, rgba(38,41,44,0.74) 62%, rgba(38,41,44,0.93) 100%)'
const SCRIM_VODOROVNY =
  'linear-gradient(90deg, rgba(38,41,44,0.62) 0%, rgba(38,41,44,0.22) 55%, rgba(38,41,44,0) 100%)'

/**
 * Pozadie hero: poster je LCP obrázok a je tam vždy, video sa naň prelína až
 * po `canplay` a len na širokej obrazovke bez `prefers-reduced-motion` a bez
 * `Save-Data` (STANDARDY C5). Na 390 px video v DOM vôbec nevznikne.
 */
function HeroPozadie({ onSegment }) {
  const reduced = useReducedMotion()
  const videoRef = useRef(null)
  const bgRef = useRef(null)
  const [chceVideo, setChceVideo] = useState(false)
  const [ready, setReady] = useState(false)
  // Jemný parallax: pozadie sa pri odchode hero škáluje 1 -> 1.06. Vstupný
  // rozsah scrollYProgress je z definície [0, 1] a prísne rastúci (E3).
  const { scrollYProgress } = useScroll({ target: bgRef, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  useEffect(() => {
    if (reduced) return undefined
    const saveData = navigator.connection && navigator.connection.saveData
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setChceVideo(mq.matches && !saveData)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduced])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !chceVideo) return undefined
    const play = v.play()
    if (play && typeof play.catch === 'function') play.catch(() => {})
    return undefined
  }, [chceVideo])

  const onTime = () => {
    const v = videoRef.current
    if (!v) return
    const t = v.currentTime
    let idx = 0
    for (let i = 0; i < ZABERY.length; i += 1) if (t >= ZABERY[i].od) idx = i
    onSegment(idx)
  }

  return (
    <div ref={bgRef} className="absolute inset-0 overflow-hidden bg-[var(--color-surface-2)]" aria-hidden="true">
      <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
        {/* Poster je LCP obrázok. `srcset` preto, aby telefón neťahal
            1920 px verziu (Lighthouse mobile hlásil 222 kB navyše);
            `sizes="100vw"`, lebo pozadie vždy vypĺňa celú šírku. */}
        <img
          src={`${import.meta.env.BASE_URL}hero/poster.jpg`}
          srcSet={[
            `${import.meta.env.BASE_URL}hero/poster-960.jpg 960w`,
            `${import.meta.env.BASE_URL}hero/poster-1440.jpg 1440w`,
            `${import.meta.env.BASE_URL}hero/poster.jpg 1920w`,
          ].join(', ')}
          sizes="100vw"
          width={1920}
          height={1080}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {chceVideo && (
          <video
            ref={videoRef}
            data-hero-video
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[var(--duration-slow)]"
            style={{ opacity: ready ? 1 : 0 }}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={`${import.meta.env.BASE_URL}hero/poster.jpg`}
            onCanPlay={() => setReady(true)}
            onTimeUpdate={onTime}
            tabIndex={-1}
          >
            <source src={`${import.meta.env.BASE_URL}hero/hero.mp4`} type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className="absolute inset-0" style={{ background: SCRIM_ZVISLY }} />
      <div className="absolute inset-0" style={{ background: SCRIM_VODOROVNY }} />
    </div>
  )
}

/**
 * Sklená karta s popiskom práve bežiaceho záberu. Je viazaná na video, preto
 * žije len tam, kde video existuje (≥ 1024 px). Na 390 px sa nerenderuje —
 * plávajúca karta nad textom hero bola stará chyba z QUALITY-LOG.
 *
 * Karta nemá mono nadpis „Vlastná realizácia“: bola to tretia veta, ktorou web
 * hovoril o tých istých fotkách (galéria mala „Realizácia klienta“, sticky
 * ďalšiu). Ostal typ prvku a pod ním miesto — a to len tam, kde ho vieme
 * doložiť, presne podľa `castiPopisu`. Kde miesto nevieme, nič sa nedopĺňa.
 */
function PopisokZaberu({ idx }) {
  // Text karty neskáče, ale sa prepisuje po znakoch a riadi ho `idx` — teda
  // to, čo je práve na plátne. Je to ten istý vzťah ako v podklade
  // (`jumpTo` na prvok, ktorý sa dostal do zorného poľa), len tu ho namiesto
  // scrollu udáva prelínačka vo videu.
  const prvokRef = useRef(null)
  const miestoRef = useRef(null)
  useEffect(() => {
    prvokRef.current?.jumpTo(idx)
    miestoRef.current?.jumpTo(idx)
  }, [idx])

  return (
    <div
      data-hero-karta
      className="hidden w-[21rem] border border-[rgba(255,255,255,0.24)] bg-[rgba(38,41,44,0.42)] p-5 backdrop-blur-md lg:block"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <p className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
        <TextRotate
          ref={prvokRef}
          texts={MENA_PRVKOV}
          auto={false}
          animatePresenceMode="popLayout"
          staggerFrom="first"
          staggerDuration={0.008}
          splitLevelClassName="overflow-hidden pb-[0.08em]"
          transition={{ type: 'spring', duration: 0.6, bounce: 0 }}
        />
      </p>
      <p className="mt-3 min-h-[1.25rem] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.86)]">
        <TextRotate
          ref={miestoRef}
          texts={MIESTA_ZABEROV}
          auto={false}
          animatePresenceMode="popLayout"
          splitBy="words"
          staggerDuration={0.012}
          splitLevelClassName="overflow-hidden"
          transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
          initial={{ opacity: 0, y: '60%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-60%' }}
        />
      </p>
      <div className="mt-5 flex gap-1.5" aria-hidden="true">
        {ZABERY.slice(0, 3).map((s, i) => (
          <span
            key={s.od}
            className="h-[2px] flex-1 transition-colors duration-[var(--duration-fast)]"
            style={{
              backgroundColor:
                idx % 3 === i || (idx === 3 && i === 0) ? 'var(--color-accent)' : 'rgba(255,255,255,0.28)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/** Šípka na ďalšiu sekciu. Lenis drží vlastnú pozíciu scrollu, natívny skok
 *  na kotvu by prepísal späť pri najbližšom rAF, preto skrolujeme cez neho.
 *
 *  Sedí na ľavej osi mriežky, nie v strede obrazovky: obsah hero je zarovnaný
 *  vľavo, takže vycentrovaná šípka visela sama a nesedela s ničím. Obal má
 *  presne ten istý kontajner ako obsah hero (78rem + `--container-padding-x`),
 *  preto je ľavá hrana šípky totožná s ľavou hranou H1 aj tlačidiel.
 *  Obal je `pointer-events-none`, aby neúmyselne neprekryl tlačidlá nad ním. */
function ScrollCue() {
  const reduced = useReducedMotion()

  const naSluzby = (e) => {
    const el = document.getElementById('sluzby')
    if (!el || !window.__lenis) return
    e.preventDefault()
    window.__lenis.scrollTo(el)
  }

  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-full max-w-[var(--container-max)] -translate-x-1/2 px-[var(--container-padding-x)]">
      <a
        data-scroll-cue
        href="#sluzby"
        onClick={naSluzby}
        aria-label="Prejsť na služby"
        className="pointer-events-auto hidden h-[44px] w-[44px] items-center justify-start text-[rgba(255,255,255,0.86)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-bg)] lg:flex"
      >
        {reduced ? (
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
        ) : (
          <motion.span
            className="flex"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
          </motion.span>
        )}
      </a>
    </div>
  )
}

/**
 * Hero domovskej stránky: presne jedna obrazovka (`100svh`, nie `100vh` — C1)
 * a jediný `<h1>` celej stránky.
 *
 * Sekcia začína na samom vrchu dokumentu a je tmavá až po hornú hranu: fixná
 * hlavička je nad hero priehľadná s bielym textom (C3, C4) a bez tmavého
 * podkladu by bola neviditeľná. Obsah preto začína až pod jej 72 px.
 * Hlavičku ani dialóg obhliadky tu nerenderujeme, tie vlastní shell v App.jsx.
 */
export default function Hero() {
  const [segment, setSegment] = useState(0)

  return (
    <section
      id="uvod"
      data-hero
      data-pasmo="tmava"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[var(--color-surface-2)] text-[var(--color-bg)]"
    >
      {/* Obsah je v DOM prvý zámerne: prvé dieťa sekcie má byť kontajner
          s rovnakou ľavou hranou ako v ostatných pásmach (audit meria
          zarovnanie práve na ňom). Pozadie je mimo toku (`absolute inset-0`)
          a obsah má `z-10`, takže poradie v DOM na vrstvenie nemá vplyv.
          Spodný padding je od 1024 px väčší, lebo pod tlačidlami stojí na tej
          istej ľavej osi šípka na ďalšiu sekciu; pri `lg:pb-16` by jej ostali
          nad hlavou 4 px. */}
      <div
        data-hero-obsah
        className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)] pb-14 pt-[104px] lg:pb-28"
      >
        <Stagger>
          <StaggerItem>
            <p
              data-kontrast="hero-stitok"
              className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.86)]"
            >
              {`${FIRMA.nazov} · ${FIRMA.sidlo}`}
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1
              data-kontrast="hero-h1"
              className="mt-5 max-w-[28ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)] md:text-[length:var(--text-5xl)]"
            >
              <SplitText as="span" text="Prvky pozemných komunikácií pre mestá a stavebné firmy" />
            </h1>
          </StaggerItem>

          <div className="mt-8 grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <StaggerItem>
                <p
                  data-kontrast="hero-perex"
                  className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-bg)]"
                >
                  {FIRMA.uvod[1]}
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Tlacidlo variant="primar" onClick={() => openObhliadka()}>
                    Dohodnúť obhliadku a cenu
                  </Tlacidlo>
                  <Tlacidlo variant="sekundar" tmava to="/sluzby">
                    Pozrieť služby
                  </Tlacidlo>
                </div>
              </StaggerItem>
            </div>

            <div className="hidden justify-end lg:col-span-5 lg:flex">
              <Reveal>
                <PopisokZaberu idx={segment} />
              </Reveal>
            </div>
          </div>
        </Stagger>
      </div>

      <HeroPozadie onSegment={setSegment} />
      <ScrollCue />
    </section>
  )
}
