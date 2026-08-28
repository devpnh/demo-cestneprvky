import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Stagger, StaggerItem, SplitText } from '../../../components/primitives/index.js'
import { Tlacidlo } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { openObhliadka } from '../../../lib/obhliadka.js'
import { FIRMA } from '../../../content/firma.js'

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
function HeroPozadie() {
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
 * Hero domovskej stránky: presne jedna obrazovka (`100svh`, nie `100vh` — C1)
 * a jediný `<h1>` celej stránky.
 *
 * Sekcia začína na samom vrchu dokumentu a je tmavá až po hornú hranu: fixná
 * hlavička je nad hero priehľadná s bielym textom (C3, C4) a bez tmavého
 * podkladu by bola neviditeľná. Obsah preto začína až pod jej 72 px.
 * Hlavičku ani dialóg obhliadky tu nerenderujeme, tie vlastní shell v App.jsx.
 */
export default function Hero() {
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

          <div className="mt-8">
            <div>
              <StaggerItem>
                <p
                  data-kontrast="hero-perex"
                  className="max-w-[54ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-bg)]"
                >
                  {FIRMA.uvod[1]}
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Tlacidlo variant="primar" data-cta-obhliadka onClick={() => openObhliadka()}>
                    Dohodnúť obhliadku a cenu
                  </Tlacidlo>
                  <Tlacidlo variant="sekundar" tmava to="/sluzby">
                    Pozrieť služby
                  </Tlacidlo>
                </div>
              </StaggerItem>
            </div>
          </div>
        </Stagger>
      </div>

      <HeroPozadie />
    </section>
  )
}
