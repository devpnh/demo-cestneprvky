import { Link } from 'react-router-dom'
import { GradientMesh, Reveal, Stagger, StaggerItem } from '../primitives/index.js'
import ZnacenieMotiv from '../kit/ZnacenieMotiv.jsx'
import { NAV } from './routy.js'
import { SLUZBY } from '../../content/sluzby.js'

/** Vlasová linka na tmavom pásme: biela s nízkou alfou, nie sivá z tokenov. */
const JEMNA_LINKA = {
  borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)',
}

const PHONE_HREF = 'tel:+421911878789'
const PHONE = '+421 911 87 87 89'
const EMAIL = 'info@cestneprvky.sk'
const ADRESA = 'Borová 3295/36, 010 01 Žilina, Slovensko'

/**
 * Pätička na každej stránke. Vznikla vydelením z pôvodnej sekcie
 * `KontaktAPaticka.jsx` (tam ostáva kontaktný blok jednostránky).
 *
 * Odkazy vedú výhradne na routy. Pôvodná pätička mala mŕtvu kotvu
 * `#technologie`, ktorá nikam neviedla; tu už kotvy nie sú vôbec.
 * Žiadne sociálne siete (klient ich nemá), žiadne tiene (B2), žiadne
 * `min-h`, o rytmus pásiem sa stará stránka nad pätičkou (B5).
 *
 * **Je tmavá a v pozadí jej bežia dve vrstvy** (pokyn Petra, 27. 8. 2026):
 * `GradientMesh` — červený opar, ktorého tri rozostrené škvrny majú každá
 * vlastnú dráhu a nesúdeliteľný čas obehu (26 s, 34 s, 41 s), takže sa
 * prelieva bez čitateľného taktu — a nad ním `ZnacenieMotiv`, jazdné pruhy
 * miznúce do stratena. Opar dáva teplo, pruhy kresbu; samotný opar bol
 * mäkký a nemal sa čoho chytiť.
 *
 * Obsah pätičky ostáva presne taký, aký bol. Skúšali sme jej dať skladbu
 * hero podstránok (logo, eyebrow, veta v displejovom reze, akcentová
 * linka), ale pätička tým narástla o vyše 300 px a začala súťažiť s pásmom
 * výzvy nad sebou — Peter to vrátil s tým, že do pozadia patrí animácia,
 * nie ďalšie poschodie. Zostáva teda kompaktná: logo a veta, dve
 * navigácie, NAP a podpis.
 *
 * Aby popri tom platilo pravidlo „nikdy dve tmavé plochy za sebou“, je
 * **pásmo nad pätičkou svetlé**: `PasVyzvy` na podstránkach aj `Kontakt
 * v skratke` na Domove. Tmavá pätička je tak posledný akord stránky, nie
 * pokračovanie predchádzajúceho tmavého bloku. Kontrola B5 to meria vrátane
 * pätičky.
 *
 * Nad stĺpcami nie je žiadna deliaca čiara (pokyn Petra, 27. 8. 2026):
 * pätičku od pásma nad ňou oddeľuje zmena farby plochy, a to je dosť —
 * červená prerušovaná čiara cez celú šírku k tomu pridávala druhý,
 * hlasnejší predel na tom istom mieste. Stĺpce nabiehajú po sebe.
 */
export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[var(--color-surface-2)]">
      <GradientMesh />
      <ZnacenieMotiv krytie={0.85} />

      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-[var(--section-padding-y-sm)]">
        <Stagger className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <StaggerItem className="lg:col-span-4">
            <img
              src={`${import.meta.env.BASE_URL}assets/92-logo-cestne-prvky-clean.png`}
              width={145}
              height={86}
              alt="Cestné prvky s.r.o."
              loading="lazy"
              className="h-12 w-auto"
            />
            <p className="mt-5 max-w-[40ch] font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-70">
              Značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie, lepené obrubníky a ďalšie prvky
              pozemných komunikácií.
            </p>
          </StaggerItem>

          <StaggerItem as="nav" aria-label="Pätičková navigácia" className="lg:col-span-3">
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              Navigácia
            </p>
            <ul className="mt-3 flex flex-col">
              {NAV.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-bg)] opacity-85 transition-opacity duration-[var(--duration-hover)] hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem as="nav" aria-label="Služby" className="lg:col-span-5">
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              Služby
            </p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2">
              {SLUZBY.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/sluzby/${s.slug}`}
                    className="inline-flex min-h-[44px] items-center pr-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-85 transition-opacity duration-[var(--duration-hover)] hover:opacity-100"
                  >
                    {s.nazovKratky || s.nazov}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>

        <Reveal className="mt-10 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3" style={JEMNA_LINKA}>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              Adresa
            </p>
            <p className="mt-2 max-w-[28ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-85">
              {ADRESA}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              E-mail
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-1 inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-bg)]"
            >
              {EMAIL}
            </a>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              Telefón
            </p>
            <a
              href={PHONE_HREF}
              className="mt-1 inline-flex min-h-[44px] items-center whitespace-nowrap font-[family-name:var(--font-body)] text-[length:var(--text-base)] tabular-nums text-[var(--color-bg)]"
            >
              {PHONE}
            </a>
          </div>
        </Reveal>

        <div className="mt-8 border-t pt-6" style={JEMNA_LINKA}>
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
            Cestné prvky s.r.o., Žilina, od roku 2012
          </p>
        </div>
      </div>
    </footer>
  )
}
