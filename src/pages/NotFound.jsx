import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Seo from '../components/Seo.jsx'
import { openObhliadka } from '../lib/obhliadka.js'
import { ROUTA_404 } from '../components/layout/routy.js'

const ODKAZY = [
  { path: '/sluzby', label: 'Služby', popis: 'Deväť prvkov pozemných komunikácií' },
  { path: '/realizacie', label: 'Realizácie', popis: 'Fotografie z vlastných stavieb' },
  { path: '/kontakt', label: 'Kontakt', popis: 'Adresa, telefón a zadanie' },
]

/** 404 v štýle webu: nič sa nestratilo, len sa treba dostať ďalej. */
export default function NotFound() {
  return (
    <>
      <Seo title={ROUTA_404.title} description={ROUTA_404.description} />

      <section
        data-pasmo="biela"
        // Odsadenie pod fixnú hlavičku si drží pásmo samo — `main` ho už nemá,
        // aby mohli byť tmavé hlavičky podstránok až po vrch obrazovky.
        className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pb-[var(--section-padding-y)] pt-[calc(72px+var(--section-padding-y))]"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)] before:h-[2px] before:w-6 before:bg-[var(--color-accent)] before:content-['']">
              404
            </p>
            <h1 className="mt-5 max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              Stránka sa nenašla
            </h1>
            <p className="mt-6 max-w-[54ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              Adresa, ktorú ste otvorili, na tomto webe neexistuje. Pokračujte na prehľad služieb, pozrite si realizácie
              alebo nám rovno napíšte zadanie.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => openObhliadka()}
                className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[var(--color-accent)] px-7 font-[family-name:var(--font-body)] text-[1.1875rem] font-semibold text-[var(--color-on-accent)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-accent-deep)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                Dohodnúť obhliadku a cenu
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                to="/"
                className="inline-flex min-h-[52px] items-center justify-center border border-[var(--color-border)] px-7 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-text)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                Späť na úvod
              </Link>
            </div>
          </div>

          <nav aria-label="Kam ďalej" className="lg:col-span-5">
            <ul className="flex flex-col border-t border-[var(--color-border)]">
              {ODKAZY.map((o) => (
                <li key={o.path}>
                  <Link
                    to={o.path}
                    className="group flex min-h-[44px] items-center justify-between gap-6 border-b border-[var(--color-border)] py-5 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)]"
                  >
                    <span>
                      <span className="block font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
                        {o.label}
                      </span>
                      <span className="mt-1 block font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                        {o.popis}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[2px]"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  )
}
