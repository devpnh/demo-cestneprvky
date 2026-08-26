import { Link } from 'react-router-dom'
import { Reveal } from '../primitives/index.js'
import PasFaktov from './PasFaktov.jsx'
import { sadzba } from '../../lib/sadzba.js'

/**
 * Hlavička podstránky.
 *
 * Je tmavá a farebne spracovaná zámerne. Kým bola biela, začínala každá
 * podstránka rovnakým blokom čierneho textu na bielej a horná časť webu
 * pôsobila nudne (výtka Petra, 26. 8. 2026). Vzorom je hero na podstránkach
 * doktorzub.com: eyebrow vysadený v značkovej farbe s veľkým prestrkom,
 * pod titulom akcentová linka a zvyšok striedmy.
 *
 * Preklad do tejto značky: plocha nemôže byť červená (červená je signálna
 * farba dopravného značenia a `STANDARDY` B3 ju držia pod 5 % viewportu),
 * takže hĺbku robí tmavé pásmo a červená ostáva na eyebrow a na linke.
 * Na tmavom podklade má `--color-accent` len 3,61:1, preto sa tu používa
 * `--color-accent-svetly` (5,17:1).
 *
 * Hlavička webu je nad týmto pásmom priehľadná s bielym textom — rieši to
 * `Header` podľa prvého `data-pasmo` v `<main>`. Preto si horné odsadenie
 * pod fixnú lištu drží toto pásmo samo.
 */
export default function StranHlavicka({ stitok, drobky = null, nadpis, perex, fakty = null, akcie = null }) {
  return (
    <section
      data-pasmo="tmava"
      className="bg-[var(--color-surface-2)] pb-[var(--section-padding-y-sm)] pt-[calc(72px+var(--section-padding-y-sm))]"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          {drobky ? (
            <nav
              aria-label="Drobková navigácia"
              className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.2em] text-[var(--color-accent-svetly)]"
            >
              {drobky.map((d, i) => (
                <span key={d.to || d.label}>
                  {/* Oddeľovač má krytie 0,55 a nie menej: pri 0,4 mal na tmavom
                      pásme 3,63:1, teda pod limitom 4,5:1 pre 12 px text. */}
                  {i > 0 ? (
                    <span aria-hidden="true" className="mx-2 text-[rgba(255,255,255,0.55)]">
                      ·
                    </span>
                  ) : null}
                  {d.to ? (
                    <Link
                      to={d.to}
                      className="inline-flex min-h-[44px] items-center hover:text-[var(--color-bg)] lg:min-h-0"
                    >
                      {sadzba(d.label)}
                    </Link>
                  ) : (
                    <span className="text-[rgba(255,255,255,0.72)]">{sadzba(d.label)}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : stitok ? (
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.2em] text-[var(--color-accent-svetly)]">
              {sadzba(stitok)}
            </p>
          ) : null}

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <h1 className="max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-6xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)] lg:col-span-7">
              {sadzba(nadpis)}
            </h1>
            {perex ? (
              <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[rgba(255,255,255,0.78)] lg:col-span-5 lg:ml-auto">
                {sadzba(perex)}
              </p>
            ) : null}
          </div>

          {/* Akcentová linka pod titulom — jediná plocha značkovej farby v hlavičke. */}
          <div aria-hidden="true" className="mt-10 h-[3px] w-16 bg-[var(--color-accent)]" />

          {fakty ? <PasFaktov fakty={fakty} tmava className="mt-8" /> : null}
          {akcie ? <div className="mt-10 flex flex-wrap gap-4">{akcie}</div> : null}
        </Reveal>
      </div>
    </section>
  )
}
