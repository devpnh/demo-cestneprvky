import { Link } from 'react-router-dom'
import { Reveal, SplitText } from '../primitives/index.js'
import PasFaktov from './PasFaktov.jsx'
import ZnacenieMotiv from './ZnacenieMotiv.jsx'
import Lajna from './Lajna.jsx'
import { sadzba } from '../../lib/sadzba.js'

/**
 * Hlavička podstránky — a zároveň šablóna, ktorú má KAŽDÁ podstránka
 * rovnakú. Skladá sa vždy z tých istých piatich vecí v tom istom poradí:
 * drobčeky alebo štítok, titul, perex, akcentová linka, prípadne fakty.
 *
 * Je tmavá a farebne spracovaná zámerne. Kým bola biela, začínala každá
 * podstránka rovnakým blokom čierneho textu na bielej a horná časť webu
 * pôsobila nudne (výtka Petra, 26. 8. 2026).
 *
 * Pohyb je tu sekvencia, nie jeden fade celej plochy (výtka Petra,
 * 27. 8. 2026: „vyzerá to ako cez WordPress“). Poradie: štítok, titul po
 * slovách, perex, akcentová linka sa dokreslí, fakty nabehnú po jednom.
 * Trvanie celej sekvencie je pod 1,2 s, aby sa nedalo predbehnúť scrollom.
 *
 * V pozadí beží `ZnacenieMotiv` — jazdné pruhy zbiehajúce sa do úbežníka.
 * Farebná plocha ostáva tmavá; červená je len na eyebrow, linke a v jednej
 * čiare motívu, takže akcent drží pod 5 % viewportu (STANDARDY B3).
 *
 * Stránka smie motív nahradiť vlastným pozadím (`pozadie`) — napríklad
 * záberom alebo videom. Vlastné pozadie si nesie svoj scrim samo, lebo
 * hlavička je stále tmavé pásmo s bielym textom a kontrast 4,5:1 musí platiť
 * aj nad najsvetlejším pixelom záberu. Motív a záber sa nekombinujú: dve
 * dekoratívne vrstvy pod jedným titulom sú o jednu viac.
 *
 * Nad záberom je **eyebrow biely, nie červený** — presne ako v hero Domova.
 * `--color-accent-svetly` má nad plochou `--color-surface-2` 5,17:1, ale nad
 * scrimom, cez ktorý presvitá biela čiara značenia, spadol na 390 px na
 * 4,22:1 (namerané auditom B7, 4. 9. 2026), a 12 px text potrebuje 4,5:1.
 * Scrim by musel byť taký hustý, že by zo záberu ostala tmavá plocha.
 * Značková farba preto ostáva na akcentovej linke pod titulom, kde je to
 * plocha, nie 12 px písmo.
 *
 * Hlavička webu je nad týmto pásmom priehľadná s bielym textom — rieši to
 * `Header` podľa prvého `data-pasmo` v `<main>`. Preto si horné odsadenie
 * pod fixnú lištu drží toto pásmo samo.
 *
 * Výška je PEVNÁ (`--hlavicka-vyska`), nie odvodená od obsahu. Celú obrazovku
 * zaberá len hero Domova; podstránky majú jedno pásmo rovnakej veľkosti, aby
 * prechod medzi nimi nemenil miesto, kde začína obsah (Peter, 28. 8. 2026).
 * Titul preto stojí o stupeň nižšie než hero (`--text-5xl`) a má širšiu mieru
 * (22ch): najdlhší názov služby má 51 znakov a pri 16ch a `--text-6xl` sa lámal
 * na štyri riadky, ktoré sa do pevnej výšky nezmestili.
 */
export default function StranHlavicka({
  stitok,
  drobky = null,
  nadpis,
  perex,
  fakty = null,
  akcie = null,
  pozadie = null,
}) {
  // Nad záberom je drobný text biely; nad plochou tmavého pásma značkovo červený.
  const triedaStitku = pozadie
    ? 'text-[rgba(255,255,255,0.86)]'
    : 'text-[var(--color-accent-svetly)]'

  return (
    <section
      data-pasmo="tmava"
      className="relative isolate flex h-[var(--hlavicka-vyska)] items-end overflow-hidden bg-[var(--color-surface-2)] pb-[var(--section-padding-y-sm)] pt-[calc(72px+var(--section-padding-y-sm))]"
    >
      {pozadie ?? <ZnacenieMotiv />}

      <div className="relative w-full">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <Reveal posun="ziadny">
            {drobky ? (
              <nav
                aria-label="Drobková navigácia"
                className={`font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.2em] ${triedaStitku}`}
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
              <p
                className={`font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.2em] ${triedaStitku}`}
              >
                {sadzba(stitok)}
              </p>
            ) : null}
          </Reveal>

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            {/* Titul nabieha po slovách. `sadzba` beží pred delením, takže
                nezlomiteľné medzery ostávajú vnútri slov a delenie ich
                nerozbije — deliaci znak je obyčajná medzera. */}
            <SplitText
              as="h1"
              text={String(sadzba(nadpis))}
              className="max-w-[22ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)] md:text-[length:var(--text-5xl)] lg:col-span-7"
            />
            {perex ? (
              <Reveal
                as="p"
                oneskorenie={220}
                className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[rgba(255,255,255,0.78)] md:text-[length:var(--text-lg)] lg:col-span-5 lg:ml-auto"
              >
                {sadzba(perex)}
              </Reveal>
            ) : null}
          </div>

          {/* Akcentová linka pod titulom — jediná plocha značkovej farby v hlavičke. */}
          <Lajna plna akcent hrubka={3} className="mt-10 w-16" />

          {fakty ? (
            <Reveal oneskorenie={320}>
              <PasFaktov fakty={fakty} tmava className="mt-8" />
            </Reveal>
          ) : null}
          {akcie ? (
            <Reveal oneskorenie={380} className="mt-10 flex flex-wrap gap-4">
              {akcie}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}
