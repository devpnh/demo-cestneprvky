import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import {
  Sekcia,
  SekciaHlavicka,
  StranHlavicka,
  MonoStitok,
  Tlacidlo,
  Fotka,
  Lajna,
} from '../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../components/primitives/index.js'
import { FIRMA } from '../../content/firma.js'
import { openObhliadka } from '../../lib/obhliadka.js'

const META = routaPodlaCesty('/o-firme')

/** Vlasová linka na tmavom pásme: biela s nízkou alfou, nie sivá z tokenov. */
const JEMNA_LINKA = { borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)' }

/**
 * Zástupný text v dátach má tvar `[DOPLNÍ KLIENT: …]`. Hranatá zátvorka na
 * stránke vyzerá ako nedorobené CMS pole, preto z nej berieme len vetu a
 * samotné „doplní klient“ nesie mono štítok — tá istá forma ako v tabuľke
 * fakturačných údajov na `/kontakt`.
 */
const ZASTUPNY_TEXT = /^\[\s*DOPLNÍ KLIENT\s*:?\s*([\s\S]*?)\s*\]$/

function vetaZastupnehoTextu(poznamka, nahrada) {
  const zhoda = (poznamka || '').trim().match(ZASTUPNY_TEXT)
  const veta = (zhoda ? zhoda[1] : poznamka || '').trim()
  if (!veta) return nahrada
  return veta.charAt(0).toUpperCase() + veta.slice(1)
}

/**
 * Prvá veta odseku ako výrazné úvodné vyhlásenie pásma, zvyšok ako telový
 * text. Text sa nemení, mení sa len sadzba: v prvom kole tu stál claim
 * „Šetríme váš čas aj peniaze“, ale na webe smie zaznieť práve raz a to na
 * Domove v sekcii Prečo.
 */
function rozdelPrvuVetu(odsek) {
  const koniec = odsek.indexOf('. ')
  return koniec < 0 ? [odsek, ''] : [odsek.slice(0, koniec + 1), odsek.slice(koniec + 2)]
}

/**
 * O firme.
 *
 * Rytmus pásiem podľa `poznamky/KOMPOZICIA.md` §2: biela (hlavička) → sivá
 * (firma) → biela (prístup) → tmavá (partner a normy) → biela (aktuality) →
 * tmavá (CTA, ktoré plynulo prechádza do tmavej pätičky). Dve tmavé obsahové
 * pásma za sebou nikde nie sú.
 *
 * Všetky vety o klientovi pochádzajú z `src/content/firma.js` a
 * `src/content/global.json`. Tu vznikajú len mikro-labely a nadpisy sekcií
 * poskladané z tých istých faktov (napríklad CTA z krokov `PROCES`).
 *
 * Perex hlavičky je prvý odsek `FIRMA.uvod`, pásmo Firma pokračuje zvyškom —
 * nie je to skrátenie obsahu, ale rozdelenie, aby ten istý odsek nestál na
 * jednej obrazovke dvakrát.
 */
export default function OFirme() {
  const [uvodPerex, ...uvodOdseky] = FIRMA.uvod
  const [vyhlasenie, zvysokPrvehoOdseku] = rozdelPrvuVetu(uvodOdseky[0] || '')
  const odsekyTela = [zvysokPrvehoOdseku, ...uvodOdseky.slice(1)].filter(Boolean)

  return (
    <>
      <Seo title={META?.title} description={META?.description} />

      <StranHlavicka
        stitok="O firme"
        nadpis="Dopravné stavby od roku 2012"
        perex={uvodPerex}
        fakty={FIRMA.fakty}
      />

      {/* Firma — úvodné odseky a claim ako výrazné vyhlásenie, vpravo fotka. */}
      <Sekcia id="firma" pasmo="siva">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <MonoStitok>Firma</MonoStitok>
              <p className="mt-5 max-w-[24ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] font-medium leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {vyhlasenie}
              </p>
            </Reveal>

            <Reveal className="mt-9">
              {odsekyTela.map((odsek, i) => (
                <p
                  key={odsek}
                  className={`max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)] ${
                    i > 0 ? 'mt-6' : ''
                  }`}
                >
                  {odsek}
                </p>
              ))}
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5">
            <Fotka
              src="10-titulka_o_firme.jpg"
              w={1000}
              h={600}
              pomer="5/3"
              alt="Mosadzné hmatové indikátory osadené v dlažbe chodníka"
              popis="Hmatové indikátory · značenie pre nevidiacich a slabozrakých"
            />
          </Reveal>
        </div>
      </Sekcia>

      {/* Prístup — štyri argumenty ako vysadené názvy so súvislým textom,
          nie dlaždice: tie isté fakty ako na Domove, iná forma. */}
      <Sekcia id="pristup" pasmo="biela">
        <SekciaHlavicka
          stitok="Prístup"
          nadpis="Technológie bez zásahu do pôvodných konštrukcií"
          sirkaNadpisu="max-w-[24ch]"
        />

        <ul className="mt-14">
          {FIRMA.pristup.map((argument, i) => (
            <li
              key={argument.nazov}
              className={`border-t border-[var(--color-border)] ${i === 0 ? '' : 'mt-10'} pt-8`}
            >
              <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-16">
                <h3 className="max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)] lg:col-span-5">
                  {argument.nazov}
                </h3>
                <p className="max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)] lg:col-span-7">
                  {argument.popis}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Sekcia>

      {/* Partner a legislatíva na tmavom pásme. */}
      <Sekcia id="partner" pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Spolupráca"
          nadpis={FIRMA.partner.nazov}
          perex={FIRMA.partner.popis}
          sirkaNadpisu="max-w-[16ch]"
        />

        <Reveal className="mt-10">
          <Tlacidlo
            variant="tichy"
            tmava
            href={FIRMA.partner.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pozrieť architektonickebariery.sk
          </Tlacidlo>
        </Reveal>

        <Lajna tmava className="mt-12" />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <MonoStitok tmava>Legislatíva</MonoStitok>
            <ul className="mt-6">
              {FIRMA.normy.map((norma) => (
                <li
                  key={norma}
                  className="max-w-[34ch] border-t py-4 font-[family-name:var(--font-mono)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)]"
                  style={JEMNA_LINKA}
                >
                  {norma}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <MonoStitok tmava>Materiály a značky</MonoStitok>
            <Stagger staggerChildren={0.06} as="ul" className="mt-6 flex flex-wrap gap-3">
              {FIRMA.znacky.map((znacka) => (
                <StaggerItem
                  as="li"
                  key={znacka.nazov}
                  className="border px-4 py-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)]"
                  style={{ ...JEMNA_LINKA, borderRadius: 'var(--radius-sm)' }}
                >
                  {znacka.nazov}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Sekcia>

      {/* Aktuality — jediná položka z pôvodného webu. `url` je null, preto to
          nie je odkaz, ale položka s poznámkou pre klienta. Telo článku nemáme. */}
      <Sekcia id="aktuality" pasmo="biela">
        <SekciaHlavicka nadpis="Aktuality" sirkaNadpisu="max-w-[12ch]" />

        <ul className="mt-12">
          {FIRMA.aktuality.map((clanok, i) => (
            <li
              key={clanok.titulok}
              className={`border-t border-[var(--color-border)] ${i === 0 ? '' : 'mt-10'} pt-8`}
            >
              <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-16">
                <MonoStitok className="lg:col-span-3">{clanok.rok}</MonoStitok>
                <div className="lg:col-span-9">
                  <h3 className="max-w-[30ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                    {clanok.titulok}
                  </h3>
                  <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-[var(--color-border)] pt-4">
                    <p className="max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                      {vetaZastupnehoTextu(clanok.poznamka, 'Odkaz na pôvodný článok a názov média.')}
                    </p>
                    <MonoStitok className="shrink-0">Doplní klient</MonoStitok>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Sekcia>

      {/* CTA — text krokov z `PROCES`, akcie sú obhliadka a galéria realizácií. */}
      <Sekcia id="obhliadka" pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Ďalší krok"
          nadpis="Dohodneme si obhliadku"
          perex="Pozrieme sa na povrch, spád a organizáciu dopravy priamo na mieste. Potom navrhneme riešenie a cenovú ponuku na konkrétny rozsah prác."
          sirkaNadpisu="max-w-[14ch]"
        />
        <Reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Tlacidlo variant="primar" onClick={() => openObhliadka()}>
            Dohodnúť obhliadku a cenu
          </Tlacidlo>
          <Tlacidlo variant="tichy" tmava to="/realizacie">
            Pozrieť realizácie
          </Tlacidlo>
        </Reveal>
      </Sekcia>
    </>
  )
}
