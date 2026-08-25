import { Link } from 'react-router-dom'
import { Reveal } from '../primitives/index.js'
import MonoStitok from './MonoStitok.jsx'
import PasFaktov from './PasFaktov.jsx'
import Lajna from './Lajna.jsx'

/**
 * Hlavička podstránky. Jednotná pre všetky routy, aby web pôsobil ako jeden
 * dokument: drobkový štítok, H1, perex a voliteľný pás faktov, zakončené
 * prerušovanou linkou. Hlavička webu je fixed a nepriehľadná nad
 * podstránkami, preto tu stačí menší horný padding.
 */
export default function StranHlavicka({ stitok, drobky = null, nadpis, perex, fakty = null, akcie = null }) {
  return (
    <section data-pasmo="biela" className="bg-[var(--color-bg)] pb-[var(--section-padding-y-sm)] pt-[var(--section-padding-y-sm)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          {drobky ? (
            <nav aria-label="Drobková navigácia" className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {drobky.map((d, i) => (
                <span key={d.to || d.label}>
                  {i > 0 ? <span aria-hidden="true" className="mx-2 text-[var(--color-accent-deep)]">·</span> : null}
                  {d.to ? (
                    // `inline-flex` + `min-h-[44px]`: inline odkaz má schránku
                    // z metriky písma (15 px), takže by na mobile prepadol
                    // kontrolou tap targetov, aj keď sa naň dá trafiť.
                    <Link
                      to={d.to}
                      className="inline-flex min-h-[44px] items-center hover:text-[var(--color-text)] lg:min-h-0"
                    >
                      {d.label}
                    </Link>
                  ) : (
                    <span className="text-[var(--color-text)]">{d.label}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : stitok ? (
            <MonoStitok>{stitok}</MonoStitok>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <h1 className="max-w-[18ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-5xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)] lg:col-span-7">
              {nadpis}
            </h1>
            {perex ? (
              <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)] lg:col-span-5 lg:ml-auto">
                {perex}
              </p>
            ) : null}
          </div>

          {fakty ? <PasFaktov fakty={fakty} className="mt-10" /> : null}
          {akcie ? <div className="mt-10 flex flex-wrap gap-4">{akcie}</div> : null}
        </Reveal>
        <Lajna className="mt-12" />
      </div>
    </section>
  )
}
