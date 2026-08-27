import { Link } from 'react-router-dom'
import { GradientMesh, Reveal, SplitText, Stagger, StaggerItem } from '../primitives/index.js'
import ZnacenieMotiv from '../kit/ZnacenieMotiv.jsx'
import { NAV } from './routy.js'
import { SLUZBY } from '../../content/sluzby.js'
import { FIRMA } from '../../content/firma.js'

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
 * **Je tmavá a v pozadí jej beží červený opar** (`GradientMesh`) — Peter si
 * ho vypýtal späť aj s pohybom (27. 8. 2026). Tri rozostrené škvrny majú
 * každá vlastnú dráhu a nesúdeliteľný čas obehu, takže sa opar prelieva bez
 * čitateľného taktu.
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
 * hlasnejší predel na tom istom mieste.
 *
 * ## Skladá sa ako hero podstránok
 *
 * Pokyn Petra (27. 8. 2026) znel „dynamický footer podobne ako hero sekcia
 * na podstránkach“, takže má tie isté štyri veci v tom istom poradí ako
 * `StranHlavicka`: značkovací motív v pozadí, mono eyebrow, veta vysadená
 * displejovým rezom, ktorá nabieha po slovách, a pod ňou obsah, ktorý
 * nastupuje po sebe.
 *
 * Vrstvy pozadia sú dve a v tomto poradí: `GradientMesh` (prelievajúci sa
 * červený opar) a nad ním `ZnacenieMotiv` (jazdné pruhy miznúce do
 * stratena). Opar dáva teplo, pruhy kresbu; samotný opar bol mäkký a nemal
 * sa čoho chytiť.
 *
 * Veta nie je nová copy — je to ten istý text, aký v pätičke stál doteraz
 * ako drobný odstavec. Zmenila sa len jeho veľkosť a to, že nabieha. Logo
 * stojí nad ňou ako podpis; kým bolo v samostatnom stĺpci pod linkou,
 * ostávalo pri ňom 300 px prázdna.
 */

/** Čo firma robí. Jediná veta pätičky, doteraz drobná, dnes vysadená veľkosťou. */
const VETA =
  'Značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie, lepené obrubníky a ďalšie prvky pozemných komunikácií.'

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[var(--color-surface-2)]">
      <GradientMesh />
      <ZnacenieMotiv krytie={0.85} />

      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
        {/* Hlava pätičky v skladbe hero podstránok: eyebrow, veta po slovách,
            akcentová linka. Rovnaké poradie, rovnaké tempo. */}
        <Reveal posun="ziadny">
          <img
            src={`${import.meta.env.BASE_URL}assets/91-logo-cestne-prvky-alpha.png`}
            width={145}
            height={86}
            alt="Cestné prvky s.r.o."
            loading="lazy"
            className="h-12 w-auto"
          />
          <p className="mt-8 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.2em] text-[var(--color-accent-svetly)]">
            {`Od roku ${FIRMA.rokZalozenia}, ${FIRMA.sidlo}`}
          </p>
        </Reveal>

        <SplitText
          as="p"
          text={VETA}
          className="mt-6 max-w-[26ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]"
        />

        <div aria-hidden="true" className="mt-10 h-[3px] w-16 bg-[var(--color-accent)]" />

        <Stagger className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <StaggerItem as="nav" aria-label="Pätičková navigácia" className="lg:col-span-4">
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              Navigácia
            </p>
            <ul className="mt-3 flex flex-col">
              {NAV.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-bg)] opacity-85 transition-opacity duration-[var(--duration-fast)] hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem as="nav" aria-label="Služby" className="lg:col-span-8">
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)] opacity-60">
              Služby
            </p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2">
              {SLUZBY.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/sluzby/${s.slug}`}
                    className="inline-flex min-h-[44px] items-center pr-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-85 transition-opacity duration-[var(--duration-fast)] hover:opacity-100"
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
