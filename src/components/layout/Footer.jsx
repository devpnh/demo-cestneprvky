import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../primitives/index.js'
import Lajna from '../kit/Lajna.jsx'
import { NAV } from './routy.js'
import { SLUZBY } from '../../content/sluzby.js'

const PHONE_HREF = 'tel:+421911878789'
const PHONE = '+421 911 87 87 89'
const EMAIL = 'info@cestneprvky.sk'
const ADRESA = 'Borová 3295/36, 010 01 Žilina, Slovensko'

/** Mikro-label stĺpca. Rovnaká sadzba ako `MonoStitok`, ale bez akcentovej čiarky. */
const STITOK =
  'font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]'

/**
 * Pätička na každej stránke. Vznikla vydelením z pôvodnej sekcie
 * `KontaktAPaticka.jsx` (tam ostáva kontaktný blok jednostránky).
 *
 * **Je svetlá, a to je oprava rytmu, nie estetická rozmarnosť.** Kým bola
 * tmavá, stálo na trinástich z pätnástich ciest tmavé pásmo výzvy priamo nad
 * tmavou pätičkou a spodok stránky bol jeden súvislý tmavý blok vysoký vyše
 * dvoch obrazoviek (STANDARDY B5, pokyn Petra 27. 8. 2026). Audit to
 * nezachytil, lebo pätičku do rytmu pásiem zámerne neráta — meria len
 * `<main>`.
 *
 * Prečo sa nesvetlelo naopak pásmo výzvy: `/sluzby` má tri svetlé obsahové
 * pásma za sebou, svetlá výzva by z nich spravila štyri a padlo by pravidlo
 * „nikdy tri rovnaké za sebou“. Tmavá výzva je navyše posledný dôraz stránky
 * a ten dôraz má niesť ona, nie zoznam odkazov pod ňou.
 *
 * Od tmavého pásma nad sebou ju oddeľuje prerušovaná akcentová čiara, ktorá
 * sa dokreslí pri vstupe do viewportu — ten istý pohyb ako všade inde na
 * webe. Tá istá čiara ju oddelí aj tam, kde nad ňou stojí svetlé pásmo
 * (`/kontakt`, 404).
 *
 * Odkazy vedú výhradne na routy. Pôvodná pätička mala mŕtvu kotvu
 * `#technologie`, ktorá nikam neviedla; tu už kotvy nie sú vôbec.
 * Žiadne sociálne siete (klient ich nemá), žiadne tiene (B2), žiadne
 * `min-h`, o rytmus pásiem sa stará stránka nad pätičkou (B5).
 */
export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-[var(--section-padding-y-sm)]">
        <Lajna akcent className="mb-12 w-full" />

        <Stagger className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <StaggerItem className="lg:col-span-4">
            <img
              src={`${import.meta.env.BASE_URL}assets/91-logo-cestne-prvky-alpha.png`}
              width={145}
              height={86}
              alt="Cestné prvky s.r.o."
              loading="lazy"
              className="h-12 w-auto"
            />
            <p className="mt-5 max-w-[40ch] font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              Značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie, lepené obrubníky a ďalšie prvky
              pozemných komunikácií.
            </p>
          </StaggerItem>

          <StaggerItem as="nav" aria-label="Pätičková navigácia" className="lg:col-span-3">
            <p className={STITOK}>Navigácia</p>
            <ul className="mt-3 flex flex-col">
              {NAV.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-deep)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem as="nav" aria-label="Služby" className="lg:col-span-5">
            <p className={STITOK}>Služby</p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2">
              {SLUZBY.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/sluzby/${s.slug}`}
                    className="inline-flex min-h-[44px] items-center pr-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-deep)]"
                  >
                    {s.nazovKratky || s.nazov}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>

        <Reveal className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--color-border)] pt-8 sm:grid-cols-3">
          <div>
            <p className={STITOK}>Adresa</p>
            <p className="mt-2 max-w-[28ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
              {ADRESA}
            </p>
          </div>
          <div>
            <p className={STITOK}>E-mail</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-1 inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-deep)]"
            >
              {EMAIL}
            </a>
          </div>
          <div>
            <p className={STITOK}>Telefón</p>
            <a
              href={PHONE_HREF}
              className="mt-1 inline-flex min-h-[44px] items-center whitespace-nowrap font-[family-name:var(--font-body)] text-[length:var(--text-base)] tabular-nums text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-deep)]"
            >
              {PHONE}
            </a>
          </div>
        </Reveal>

        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <p className={STITOK}>Cestné prvky s.r.o., Žilina, od roku 2012</p>
        </div>
      </div>
    </footer>
  )
}
