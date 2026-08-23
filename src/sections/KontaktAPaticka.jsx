import { Phone, Mail, MapPin, ArrowRight, ArrowUp } from 'lucide-react'
import { Reveal, Stagger, StaggerItem, GradientMesh } from '../components/primitives/index.js'

const NAV = [
  { label: 'Služby', href: '#sluzby' },
  { label: 'Debarierizácia', href: '#debarierizacia' },
  { label: 'Technológie', href: '#technologie' },
  { label: 'Realizácie', href: '#realizacie' },
  { label: 'Kontakt', href: '#kontakt' },
]

const JEMNA_LINKA = {
  borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)',
}

export default function KontaktAPaticka() {
  return (
    <section
      id="kontakt"
      className="relative isolate overflow-hidden bg-[var(--color-surface-2)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <GradientMesh
          className="h-full w-full"
          colors={[
            'var(--color-accent-2)',
            'var(--color-surface-2)',
            'var(--color-accent)',
          ]}
        />
      </div>

      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-[var(--section-padding-y)]">
        <Reveal>
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-accent)]">
            Kontakt
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
            Pošlite zadanie, vrátime sa s termínom obhliadky
          </h2>
          <p className="mt-6 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
            {
              'Napíšte nám typ prvku, miesto a rozsah. Ozveme sa s termínom obhliadky a návrhom riešenia na mieru.'
            }
          </p>
        </Reveal>

        <Stagger
          staggerChildren={0.07}
          className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <StaggerItem>
            <a
              href="tel:+421911878789"
              className="flex min-h-[44px] flex-col border-t pt-5"
              style={JEMNA_LINKA}
            >
              <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-70">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Telefón
              </span>
              <span className="mt-3 whitespace-nowrap font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold tabular-nums text-[var(--color-bg)]">
                {'+421 911 87 87 89'}
              </span>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href="mailto:info@cestneprvky.sk"
              className="flex min-h-[44px] flex-col border-t pt-5"
              style={JEMNA_LINKA}
            >
              <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-70">
                <Mail className="h-4 w-4" aria-hidden="true" />
                E-mail
              </span>
              <span className="mt-3 break-words font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold text-[var(--color-bg)]">
                {'info@cestneprvky.sk'}
              </span>
            </a>
          </StaggerItem>

          <StaggerItem>
            <div className="flex min-h-[44px] flex-col border-t pt-5" style={JEMNA_LINKA}>
              <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-70">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Adresa
              </span>
              <span className="mt-3 max-w-[24ch] font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[var(--leading-tight)] text-[var(--color-bg)]">
                {'Borová 3295/36, 010 01 Žilina, Slovensko'}
              </span>
            </div>
          </StaggerItem>
        </Stagger>

        <Reveal className="mt-12">
          <a
            href="mailto:info@cestneprvky.sk"
            className="inline-flex min-h-[52px] items-center gap-3 bg-[var(--color-accent)] px-7 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-semibold text-[var(--color-on-accent)] transition-transform duration-[var(--duration-fast)] hover:translate-x-[2px]"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Dohodnúť obhliadku a cenu
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>

      <footer className="relative mt-[var(--section-padding-y)] border-t" style={JEMNA_LINKA}>
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-[var(--section-padding-y-sm)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <img
                src={`${import.meta.env.BASE_URL}assets/90-logo-cestne-prvky.png`}
                width={145}
                height={86}
                alt={'Cestné prvky s.r.o.'}
                loading="lazy"
                className="h-12 w-auto bg-[var(--color-bg)] p-1"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <p className="mt-5 max-w-[44ch] font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-70">
                {
                  'Značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie, lepené obrubníky a ďalšie prvky pozemných komunikácií.'
                }
              </p>
            </div>

            <nav aria-label="Pätičková navigácia" className="lg:col-span-3">
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
                Navigácia
              </p>
              <ul className="mt-4 flex flex-col gap-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-bg)] opacity-85 transition-opacity duration-[var(--duration-fast)] hover:opacity-100"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-4">
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
                Spojenie
              </p>
              <ul className="mt-4 flex flex-col gap-1">
                <li>
                  <a
                    href="tel:+421911878789"
                    className="inline-flex min-h-[44px] items-center whitespace-nowrap font-[family-name:var(--font-body)] text-[length:var(--text-base)] tabular-nums text-[var(--color-bg)]"
                  >
                    {'+421 911 87 87 89'}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@cestneprvky.sk"
                    className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-bg)]"
                  >
                    {'info@cestneprvky.sk'}
                  </a>
                </li>
                <li>
                  <span className="inline-flex max-w-[30ch] py-2 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
                    {'Borová 3295/36, 010 01 Žilina, Slovensko'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
            style={JEMNA_LINKA}
          >
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              {'© Cestné prvky s.r.o.'}
            </p>
            <a
              href="#uvod"
              className="inline-flex min-h-[44px] items-center gap-2 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-bg)]"
            >
              Späť hore
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
