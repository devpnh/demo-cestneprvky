import { Phone, ArrowRight } from 'lucide-react'
import {
  Reveal,
  Stagger,
  StaggerItem,
  Parallax,
  SplitText,
} from '../components/primitives/index.js'

const NAV = [
  { label: 'Služby', href: '#sluzby' },
  { label: 'Debarierizácia', href: '#debarierizacia' },
  { label: 'Technológie', href: '#technologie' },
  { label: 'Realizácie', href: '#realizacie' },
  { label: 'Kontakt', href: '#kontakt' },
]

const SLUZBY = [
  'Značenie pre nevidiacich a slabozrakých',
  'Vodorovné dopravné značenie',
  'Lepené obrubníky',
  'Spomaľovače dopravy',
  'Zálievkové a vysprávkové hmoty',
  'Bezpečnostný protišmykový náter',
  'Cyklotrasy',
  'Štítky: Braillovo písmo, gravírovanie, hmatové mapy',
  'Odstránenie starého vodorovného dopravného značenia',
]

export default function HlavickaAHero() {
  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--color-bg) 88%, transparent)',
        }}
      >
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-6 px-[var(--container-padding-x)] py-3">
          <a
            href="#uvod"
            className="flex shrink-0 items-center"
            aria-label={'Cestné prvky s.r.o.'}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/90-logo-cestne-prvky.png`}
              width={145}
              height={86}
              alt={'Cestné prvky s.r.o.'}
              className="h-10 w-auto"
            />
          </a>

          <nav
            aria-label="Hlavná navigácia"
            className="hidden items-center gap-8 lg:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="border-b-2 border-transparent py-2 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+421911878789"
              className="flex min-h-[44px] items-center gap-2 border border-[var(--color-border)] px-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-text)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <Phone className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              <span className="hidden whitespace-nowrap tabular-nums sm:inline">
                {'+421 911 87 87 89'}
              </span>
              <span className="sr-only sm:hidden">{'+421 911 87 87 89'}</span>
            </a>

            <a
              href="#kontakt"
              className="hidden min-h-[44px] items-center bg-[var(--color-surface-2)] px-5 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-bg)] transition-opacity duration-[var(--duration-fast)] hover:opacity-90 md:flex"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Dohodnúť obhliadku
            </a>
          </div>
        </div>
      </header>

      <section
        id="uvod"
        className="relative overflow-hidden bg-[var(--color-bg)] pb-[var(--section-padding-y-sm)] pt-[var(--section-padding-y-sm)]"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Stagger staggerChildren={0.07}>
                <StaggerItem>
                  <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {'Cestné prvky s.r.o. · Žilina'}
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <h1 className="mt-6 max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-6xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                    <SplitText
                      as="span"
                      text={'Vodorovné značenie a debarierizácia pozemných komunikácií'}
                      staggerChildren={0.05}
                    />
                  </h1>
                </StaggerItem>

                <StaggerItem>
                  <p className="mt-8 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                    {'Značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie studeným plastom a lepené obrubníky pre mestá, župy, správcov ciest a stavebné firmy.'}
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <a
                      href="#kontakt"
                      className="inline-flex min-h-[52px] items-center gap-3 bg-[var(--color-accent)] px-7 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-semibold text-[var(--color-on-accent)] transition-transform duration-[var(--duration-fast)] hover:translate-x-[2px]"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Dohodnúť obhliadku a cenu
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>

                    <a
                      href="#realizacie"
                      className="inline-flex min-h-[52px] items-center border-b border-[var(--color-text)] px-1 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-text)]"
                    >
                      Pozrieť realizácie
                    </a>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <p className="mt-10 max-w-[56ch] border-t border-[var(--color-border)] pt-6 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
                    {'Od roku 2012 · Žilina, Slovensko · v zmysle vyhlášky MŽP SR č. 532/2002 Z. z.'}
                  </p>
                </StaggerItem>
              </Stagger>
            </div>

            <div className="lg:col-span-7">
              <div className="relative pb-16 pl-6 sm:pb-20 sm:pl-10 lg:pb-24">
                <div
                  aria-hidden="true"
                  className="absolute right-[-8%] top-8 hidden h-[78%] w-[72%] bg-[var(--color-surface-2)] lg:block"
                />

                <Reveal className="relative">
                  <Parallax speed={0.25}>
                    <img
                      src={`${import.meta.env.BASE_URL}assets/10-titulka_o_firme.jpg`}
                      width={1000}
                      height={600}
                      alt="Mosadzné terčíky vodiacej línie osadené v dlažbe chodníka"
                      className="aspect-[5/3] w-full object-cover"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    />
                  </Parallax>

                  <div className="absolute left-4 top-4 max-w-[22ch] bg-[var(--color-surface-2)] px-3 py-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] sm:left-6 sm:top-6">
                    {'Kaltplastik · bez zásahu do pôvodných konštrukcií'}
                  </div>
                </Reveal>

                <div className="absolute bottom-0 left-0 w-[52%] max-w-[17rem] sm:w-[46%]">
                  <Parallax speed={0.45}>
                    <div
                      className="border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}assets/29-Vodiaca-linia-BA.jpg`}
                        width={466}
                        height={350}
                        alt="Vodiaca línia z nerezových indikátorov na chodníku v Bratislave"
                        className="aspect-[4/3] w-full object-cover"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                        {'Vodiaca línia'}
                        <span className="block text-[var(--color-text)]">
                          {'Bratislava'}
                        </span>
                      </p>
                    </div>
                  </Parallax>
                </div>
              </div>
            </div>
          </div>

          <Reveal className="mt-16 border-t border-[var(--color-border)] pt-6 lg:mt-20">
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              Čo realizujeme
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-text)]">
              {SLUZBY.map((sluzba, i) => (
                <li key={sluzba} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-[var(--color-accent)]">
                      ·
                    </span>
                  )}
                  <span>{sluzba}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
