import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Phone, ArrowRight, Menu, X } from 'lucide-react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import { NAV } from './routy.js'

const PHONE_HREF = 'tel:+421911878789'
const PHONE = '+421 911 87 87 89'

const VYSKA = 72

/**
 * Fixná hlavička viacstránkového webu.
 *
 * Priehľadná je iba nad hero na domovskej stránke a iba do 24 px scrollu
 * (STANDARDY C3); nad svetlými podstránkami je od prvého pixelu biela s
 * tmavým textom (C4). Farbu textu drží `color` na `<header>` a potomkovia ju
 * dedia, takže je to jedno miesto pravdy a jedno miesto merania pre audit.
 *
 * Mobilné menu je ZÁMERNE súrodenec `<header>`, nie jeho potomok: hlavička má
 * `backdrop-filter`, ktorý z každého `position: fixed` potomka spraví
 * absolútne pozíciovaný prvok (C7, reálny pád v tomto projekte 2026-08-23).
 */
export default function Header() {
  const { pathname } = useLocation()

  /**
   * Priehľadná hlavička nepatrí len Domovu. Podstránky majú odo dneška tmavú
   * hlavičku stránky, takže sa nad ňou musí správať rovnako ako nad hero.
   * Namiesto zoznamu ciest sa preto pozerá na prvé pásmo v `<main>`: keď je
   * tmavé, hlavička je priehľadná s bielym textom. Po prechode routy sa obsah
   * vymieňa až po dobehnutí animácie, preto druhé meranie s odstupom.
   */
  const [nadTmavym, setNadTmavym] = useState(false)
  useEffect(() => {
    const zisti = () => {
      const prve = document.querySelector('main [data-pasmo]')
      setNadTmavym(prve ? prve.getAttribute('data-pasmo') === 'tmava' : false)
    }
    zisti()
    const id = window.setTimeout(zisti, 400)
    return () => window.clearTimeout(id)
  }, [pathname])
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const tlacidloRef = useRef(null)

  // Meranie scrollu pre prah 24 px, po ktorom hlavička zbelie.
  //
  // Merala sa tu aj druhá vec: podiel prejdenej stránky pre značkovací pás
  // pod hlavičkou. Pás bol odstránený (pokyn Petra, 28. 8. 2026), s ním aj
  // jeho výpočet — `scrollHeight` pri každom rámci je nútené prepočítanie
  // rozloženia a nemá sa počítať pre nič.
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Zmena routy menu vždy zavrie, bez vracania fokusu, ten patrí <main>.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const zavri = useCallback((vratitFokus) => {
    setOpen(false)
    if (vratitFokus && tlacidloRef.current) tlacidloRef.current.focus()
  }, [])

  // Zámok scrollu pod otvoreným menu: natívny overflow aj Lenis.
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (window.__lenis) window.__lenis.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') zavri(true)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      if (window.__lenis) window.__lenis.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, zavri])

  const light = nadTmavym && !scrolled && !open

  return (
    <>
      <header
        data-hlavicka
        data-light={light ? 'true' : 'false'}
        className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-[background-color,border-color] duration-[var(--duration-fast)] ${
          light ? 'border-b border-transparent' : 'border-b border-[var(--color-border)] backdrop-blur'
        }`}
        style={{
          // Po scrolle nepriehľadná biela: pod ňou prebehne obsah podstránky
          // a priesvitná hlavička by na fotkách realizácií strácala kontrast.
          backgroundColor: light ? 'transparent' : 'var(--color-bg)',
          color: light ? 'var(--color-bg)' : 'var(--color-text)',
        }}
      >
        <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between gap-6 px-[var(--container-padding-x)]">
          <Link to="/" className="flex min-h-[44px] shrink-0 items-center" aria-label="Cestné prvky s.r.o., domov">
            <img
              src={`${import.meta.env.BASE_URL}assets/92-logo-cestne-prvky-clean.png`}
              width={145}
              height={86}
              alt="Cestné prvky s.r.o."
              className="h-12 w-auto"
            />
          </Link>

          <nav aria-label="Hlavná navigácia" className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              // Podčiarknutie sa dokresľuje zľava, nie preblikne farbou
              // rámu. Je to ten istý pohyb ako pri `Lajna` a pri páse
              // postupu — jeden pohyb pre jednu vec na celom webe.
              //
              // Leží na `top-full`, teda tesne POD schránkou odkazu, nie na
              // jeho spodnej hrane: kontrola kontrastu B7 sníma pásy cez
              // schránku textu a akcentový prúžok vnútri nej čítala ako
              // pozadie textu (biela na #F03314 = 4,05:1). Vonku má text
              // pod sebou pásmo hlavičky a pomer sedí.
              <NavLink
                key={item.path}
                to={item.path}
                data-nav-link
                className="group relative py-2 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium"
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-full h-[2px] origin-left bg-[var(--color-accent)] transition-transform duration-[var(--duration-hover)] ease-[var(--ease-house)] ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PHONE_HREF}
              aria-label={`Zavolať ${PHONE}`}
              className={`flex h-[44px] min-w-[44px] items-center justify-center gap-2 border px-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium transition-colors duration-[var(--duration-hover)] sm:px-4 ${
                light
                  ? 'border-[rgba(255,255,255,0.35)] hover:border-[var(--color-bg)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-text)]'
              }`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <Phone className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
              <span className="hidden whitespace-nowrap tabular-nums sm:inline">{PHONE}</span>
            </a>

            <button
              type="button"
              data-cta-obhliadka onClick={() => openObhliadka()}
              className={`hidden h-[44px] items-center px-5 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--duration-hover)] md:flex ${
                light
                  ? 'bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]'
              }`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Dohodnúť obhliadku
            </button>

            <button
              ref={tlacidloRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobilne-menu"
              aria-label={open ? 'Zavrieť menu' : 'Otvoriť menu'}
              className={`flex h-[44px] w-[44px] items-center justify-center border lg:hidden ${
                light ? 'border-[rgba(255,255,255,0.35)]' : 'border-[var(--color-border)]'
              }`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Súrodenec hlavičky, nie potomok. Pozri komentár pri komponente (C7). */}
      <div
        id="mobilne-menu"
        hidden={!open}
        data-mobilne-menu
        className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-[var(--color-bg)] lg:hidden"
        style={{ top: `${VYSKA}px` }}
      >
        <nav
          aria-label="Mobilná navigácia"
          className="mx-auto flex max-w-[var(--container-max)] flex-col px-[var(--container-padding-x)] py-6"
        >
          {NAV.map((item, i) => (
            // Položky nabiehajú po sebe, aby otvorenie menu bolo pohyb a nie
            // preblik. Oneskorenie je inline, lebo `Stagger` sem nepasuje —
            // menu nemá spúšťač vo viewporte, spúšťačom je stav `open`.
            <NavLink
              key={item.path}
              to={item.path}
              style={reduced ? undefined : { animation: `menu-polozka var(--duration-base) var(--ease-house) ${i * 55}ms both` }}
              className={({ isActive }) =>
                `flex min-h-[56px] items-center gap-4 border-b border-[var(--color-border)] py-4 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold text-[var(--color-text)] ${
                  isActive ? 'pl-1' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span aria-hidden="true" className="inline-block h-[2px] w-6 bg-[var(--color-accent)]" />}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}

          <button
            type="button"
            data-cta-obhliadka
            onClick={() => {
              zavri(false)
              openObhliadka()
            }}
            className="mt-8 flex min-h-[52px] items-center justify-center gap-3 bg-[var(--color-accent)] px-6 font-[family-name:var(--font-body)] text-[1.1875rem] font-semibold text-[var(--color-on-accent)] transition-transform duration-[var(--duration-hover)] active:scale-[0.98]"
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
