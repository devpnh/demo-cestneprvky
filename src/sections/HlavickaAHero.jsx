import { useEffect, useRef, useState } from 'react'
import { Phone, ArrowRight, ArrowDown, Menu, X } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Reveal, Stagger, StaggerItem, SplitText } from '../components/primitives/index.js'
import { useReducedMotion } from '../lib/useReducedMotion.js'
import { openObhliadka } from '../lib/obhliadka.js'
import ObhliadkaDialog from '../components/ObhliadkaDialog.jsx'

const NAV = [
  { label: 'Služby', href: '#sluzby' },
  { label: 'Debarierizácia', href: '#debarierizacia' },
  { label: 'Realizácie', href: '#realizacie' },
  { label: 'O nás', href: '#o-nas' },
  { label: 'Kontakt', href: '#kontakt' },
]


/**
 * Segmenty hero slučky (public/hero/hero.mp4, 14,4 s). Časy sú stredy
 * prelínačiek vo videu; popisky sú fakty z názvov fotografií klienta.
 * Tretí záber nemá v názve plný názov miesta, preto stojí bez miesta.
 */
const ZABERY = [
  { od: 0, prvok: 'Značenie pre nevidiacich a slabozrakých', miesto: 'Zubačka' },
  { od: 3.8, prvok: 'Vodiaca línia', miesto: 'Tornaľa' },
  { od: 7.2, prvok: 'Varovný pás a protišmykový náter schodiskového stupňa', miesto: null },
  { od: 10.6, prvok: 'Značenie pre nevidiacich a slabozrakých', miesto: 'Zubačka' },
]

const PHONE_HREF = 'tel:+421911878789'
const PHONE = '+421 911 87 87 89'

/** Hlavička: priehľadná nad hero, po 24 px scrollu biela. Fixed, aby hero začínalo pod ňou. */
function Hlavicka() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  // Scroll-progress vlások: scrollYProgress je z definície v [0, 1] (E3 OK).
  const { scrollYProgress } = useScroll()

  const [active, setActive] = useState('')

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
      // Scrollspy cez pozície sekcií, nie IntersectionObserver: ten hlási len
      // zmenené entries a posledná zhoda vie ostať svietiť; STANDARDY D6).
      const hranica = window.scrollY + 72 + window.innerHeight * 0.35
      let cur = ''
      for (const item of NAV) {
        const el = document.getElementById(item.href.slice(1))
        if (el && el.offsetTop <= hranica) cur = item.href
      }
      setActive(cur)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const light = !scrolled && !open
  const textColor = light ? 'text-[var(--color-bg)]' : 'text-[var(--color-text)]'

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-fast)] ${
        light ? 'border-b border-transparent' : 'border-b border-[var(--color-border)] backdrop-blur'
      }`}
      style={{
        backgroundColor: light ? 'transparent' : 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
      }}
    >
      {!reduced && (
        <motion.div
          aria-hidden="true"
          data-scroll-progress
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[var(--color-accent)]"
          style={{ scaleX: scrollYProgress }}
        />
      )}
      <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between gap-6 px-[var(--container-padding-x)]">
        <a href="#uvod" className="flex min-h-[44px] shrink-0 items-center" aria-label={'Cestné prvky s.r.o.'}>
          <img
            src={`${import.meta.env.BASE_URL}assets/91-logo-cestne-prvky-alpha.png`}
            width={145}
            height={86}
            alt={'Cestné prvky s.r.o.'}
            className="h-12 w-auto"
          />
        </a>

        <nav aria-label="Hlavná navigácia" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`border-b-2 py-2 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)] ${
                active === item.href ? 'border-[var(--color-accent)]' : 'border-transparent'
              } ${textColor}`}
              aria-current={active === item.href ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className={`flex min-h-[44px] items-center gap-2 border px-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium transition-colors duration-[var(--duration-fast)] ${
              light
                ? 'border-[rgba(255,255,255,0.35)] text-[var(--color-bg)] hover:border-[var(--color-bg)]'
                : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
            }`}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <Phone className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
            <span className="hidden whitespace-nowrap tabular-nums sm:inline">{PHONE}</span>
            <span className="sr-only sm:hidden">{PHONE}</span>
          </a>

          <button
            type="button"
            onClick={() => openObhliadka()}
            className={`hidden min-h-[44px] items-center px-5 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--duration-fast)] md:flex ${
              light ? 'bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-surface)]' : 'bg-[var(--color-surface-2)] text-[var(--color-bg)] hover:bg-[var(--color-text)]'
            }`}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Dohodnúť obhliadku
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobilne-menu"
            aria-label={open ? 'Zavrieť menu' : 'Otvoriť menu'}
            className={`flex h-[44px] w-[44px] items-center justify-center border lg:hidden ${
              light ? 'border-[rgba(255,255,255,0.35)] text-[var(--color-bg)]' : 'border-[var(--color-border)] text-[var(--color-text)]'
            }`}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

    </header>
      <div
        id="mobilne-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-[var(--color-bg)] lg:hidden"
      >
        <nav aria-label="Mobilná navigácia" className="mx-auto flex max-w-[var(--container-max)] flex-col px-[var(--container-padding-x)] py-6">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 border-b border-[var(--color-border)] py-5 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold text-[var(--color-text)] ${
                active === item.href ? 'pl-1' : ''
              }`}
            >
              {active === item.href && (
                <span aria-hidden="true" className="inline-block h-[2px] w-6 bg-[var(--color-accent)]" />
              )}
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              openObhliadka()
            }}
            className="mt-8 flex min-h-[52px] items-center justify-center gap-3 bg-[var(--color-accent)] px-6 font-[family-name:var(--font-body)] text-[1.1875rem] font-semibold text-[var(--color-on-accent)]"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Dohodnúť obhliadku a cenu
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href={PHONE_HREF}
            className="mt-4 flex min-h-[52px] items-center justify-center gap-3 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium tabular-nums text-[var(--color-text)]"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <Phone className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
            {PHONE}
          </a>
        </nav>
      </div>
    </>
  )
}

/**
 * Pozadie hero: poster (LCP, vždy) + video len na desktope bez reduced-motion
 * a bez Save-Data. Video sa prelína až keď má dáta, dovtedy drží poster.
 */
function HeroPozadie({ onSegment }) {
  const reduced = useReducedMotion()
  const videoRef = useRef(null)
  const bgRef = useRef(null)
  const [chceVideo, setChceVideo] = useState(false)
  const [ready, setReady] = useState(false)
  // Jemný parallax: pozadie sa pri odscrollovaní hero preč škáluje 1 -> 1.06.
  // Rozsah [0, 1] prísne rastúci (E3), obsah a scrim sa nehýbu.
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
      <img
        src={`${import.meta.env.BASE_URL}hero/poster.jpg`}
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
      {/* Scrim: tmavšie dole (text) a vľavo (stĺpec copy), hore len jemne kvôli hlavičke. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(38,41,44,0.45) 0%, rgba(38,41,44,0.18) 35%, rgba(38,41,44,0.55) 65%, rgba(38,41,44,0.88) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(38,41,44,0.55) 0%, rgba(38,41,44,0.15) 55%, rgba(38,41,44,0) 100%)',
        }}
      />
    </div>
  )
}

function PopisokZaberu({ idx }) {
  const z = ZABERY[idx] ?? ZABERY[0]
  return (
    <div
      className="hidden w-[21rem] border border-[rgba(255,255,255,0.22)] bg-[rgba(38,41,44,0.35)] p-5 backdrop-blur-md lg:block"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
        Vlastná realizácia
      </p>
      <p className="mt-3 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)]">
        {z.prvok}
        {z.miesto && (
          <span className="mt-1 block font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
            {z.miesto}
          </span>
        )}
      </p>
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {ZABERY.slice(0, 3).map((s, i) => (
          <span
            key={s.od}
            className="h-[2px] flex-1 transition-colors duration-[var(--duration-fast)]"
            style={{ backgroundColor: (idx % 3) === i || (idx === 3 && i === 0) ? 'var(--color-accent)' : 'rgba(255,255,255,0.28)' }}
          />
        ))}
      </div>
    </div>
  )
}

export default function HlavickaAHero() {
  const [segment, setSegment] = useState(0)

  return (
    <>
      <Hlavicka />

      <section id="uvod" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-[var(--color-bg)]">
        <HeroPozadie onSegment={setSegment} />

        <div className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)] pb-14 pt-[104px] lg:pb-16">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <Stagger staggerChildren={0.07}>
                <StaggerItem>
                  <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.78)]">
                    {'Cestné prvky s.r.o. · Žilina'}
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <h1 className="mt-5 max-w-[18ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-5xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
                    <SplitText as="span" text={'Bezbariérové prvky a dopravné značenie'} staggerChildren={0.05} />
                  </h1>
                </StaggerItem>

                <StaggerItem>
                  <p className="mt-6 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[rgba(255,255,255,0.86)]">
                    {'Značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie studeným plastom a lepené obrubníky pre mestá, župy, správcov ciest a stavebné firmy.'}
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <button
                      type="button"
                      onClick={() => openObhliadka()}
                      className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[var(--color-accent)] px-7 font-[family-name:var(--font-body)] text-[1.1875rem] font-semibold text-[var(--color-on-accent)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-accent-deep,#C5250D)]"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Dohodnúť obhliadku a cenu
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <a
                      href="#realizacie"
                      className="inline-flex min-h-[52px] items-center justify-center border border-[rgba(255,255,255,0.4)] px-7 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-bg)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-bg)]"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Pozrieť realizácie
                    </a>
                  </div>
                </StaggerItem>

              </Stagger>
            </div>

            <div className="flex justify-end lg:col-span-4">
              <Reveal>
                <PopisokZaberu idx={segment} />
              </Reveal>
            </div>
          </div>
        </div>

        <a
          href="#sluzby"
          aria-label="Prejsť na služby"
          className="absolute bottom-5 left-1/2 z-10 hidden h-[44px] w-[44px] -translate-x-1/2 items-center justify-center text-[rgba(255,255,255,0.78)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-bg)] lg:flex"
        >
          <ArrowDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden="true" />
        </a>
      </section>

      <ObhliadkaDialog />
    </>
  )
}
