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
import { Reveal } from '../../components/primitives/index.js'
import { FIRMA, PROCES } from '../../content/firma.js'
import { openObhliadka } from '../../lib/obhliadka.js'

const META = routaPodlaCesty('/o-firme')

/** Vlasová linka na tmavom pásme: biela s nízkou alfou, nie sivá z tokenov. */
const JEMNA_LINKA = { borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)' }

/**
 * Zástupné pole v dátach má tvar `[DOPLNÍ KLIENT: …]` a býva vložené do vety
 * (`FIRMA.znacky`) aj samostatné (`FIRMA.aktuality`). Hranatá zátvorka na
 * stránke vyzerá ako nedorobené CMS pole, preto text rozoberieme na doloženú
 * časť a na chýbajúcu; „doplní klient“ nesie mono štítok — tá istá forma ako
 * v tabuľke fakturačných údajov na `/kontakt`.
 */
const ZASTUPNY_TEXT = /\[\s*DOPLNÍ KLIENT\s*:?\s*([\s\S]*?)\s*\]/

function rozoberZastupnyText(text) {
  const zdroj = (text || '').trim()
  const zhoda = zdroj.match(ZASTUPNY_TEXT)
  if (!zhoda) return { doloziene: zdroj, chyba: '' }
  const doloziene = (zdroj.slice(0, zhoda.index) + zdroj.slice(zhoda.index + zhoda[0].length))
    .replace(/\s+/g, ' ')
    .trim()
  const chyba = zhoda[1].trim()
  return { doloziene, chyba: chyba ? chyba.charAt(0).toUpperCase() + chyba.slice(1) : '' }
}

/**
 * Prvá veta odseku ako výrazné úvodné vyhlásenie pásma, zvyšok ako telový
 * text. Text sa nemení, mení sa len sadzba: v prvom kole tu stál claim
 * „Šetríme váš čas aj peniaze“, ale na webe smie zaznieť práve raz a to na
 * Domove v sekcii Prečo.
 */

/**
 * O firme.
 *
 * Rytmus pásiem podľa `poznamky/KOMPOZICIA.md` §2: biela (hlavička) → sivá
 * (firma) → biela (prístup) → tmavá (konzultácie, normy, materiály) → biela
 * (aktuality) → tmavá (CTA, ktoré plynulo prechádza do tmavej pätičky). Dve
 * tmavé obsahové pásma za sebou nikde nie sú.
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
        {/* Text vľavo, fotka vpravo, obe centrované na spoločnú os: bloky majú
            rôznu výšku a zarovnanie hore nechávalo pod fotkou 180 px prázdna.
            Textový stĺpec je zúžený na 46ch, aby mal riadok čitateľnú dĺžku a
            pravý okraj netrhalo do strapcov. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <MonoStitok>Firma</MonoStitok>
              <h2 className="mt-5 max-w-[14ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                Čo osádzame
              </h2>
            </Reveal>

            <Reveal className="mt-8">
              {uvodOdseky.map((odsek, i) => (
                <p
                  key={odsek}
                  className={`max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)] ${
                    i > 0 ? 'mt-5' : ''
                  }`}
                >
                  {odsek}
                </p>
              ))}
            </Reveal>

            {/* Výpočet technológií je zoznam, nie veta s dvojbodkou. Ako súvislý
                odsek to bola štvorriadková stena s rozstrapkaným okrajom. */}
            <Reveal className="mt-9">
              <p className="max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                {FIRMA.technologie.uvod}
              </p>
              <ul className="mt-5 max-w-[46ch]">
                {FIRMA.technologie.polozky.map((polozka, i) => (
                  <li
                    key={polozka}
                    // Posledná položka má aj spodnú linku, inak blok zoznamu
                    // opticky nekončí a záverečná veta z neho visí.
                    className={`border-t border-[var(--color-border)] py-3 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)] ${
                      i === FIRMA.technologie.polozky.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    {polozka}
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {FIRMA.technologie.zaver}
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5 lg:col-start-8">
            <Fotka
              src="10-titulka_o_firme.jpg"
              w={1000}
              h={600}
              pomer="4/5"
              alt="Mosadzné hmatové indikátory osadené v dlažbe chodníka"
              popis="Hmatové indikátory v dlažbe chodníka"
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

      {/* Kam po konzultáciu, legislatíva a materiály na tmavom pásme.
          Blok o Únii nevidiacich a slabozrakých Slovenska NIE JE vyhlásenie o
          vzťahu s ňou: hovorí o tom, čo Únia robí, a odkazuje na jej web.
          Znenie vlastní `FIRMA.konzultacie`, tu sa neprepisuje. */}
      <Sekcia id="konzultacie" pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok={FIRMA.konzultacie.stitok}
          nadpis={FIRMA.konzultacie.nazov}
          perex={FIRMA.konzultacie.popis}
          sirkaNadpisu="max-w-[16ch]"
        />

        <Reveal className="mt-10">
          <Tlacidlo
            variant="tichy"
            tmava
            href={FIRMA.konzultacie.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Pozrieť ${FIRMA.konzultacie.odkazText}`}
          </Tlacidlo>
        </Reveal>

        <Lajna tmava className="mt-12" />

        <Reveal className="mt-14">
          <MonoStitok tmava>Legislatíva</MonoStitok>
          <ul className="mt-6 grid grid-cols-1 gap-x-16 sm:grid-cols-2">
            {FIRMA.normy.map((norma) => (
              <li
                key={norma}
                className="border-t py-4 font-[family-name:var(--font-mono)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)]"
                style={JEMNA_LINKA}
              >
                {norma}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-16">
          <MonoStitok tmava>Materiály a značky</MonoStitok>
        </Reveal>

        {/* Značky ako heslá so slovníkovým popisom: `dt` a `dd` sú priamymi
            deťmi jedného `div`-u v `dl`, hlbšie vnorenie by bolo neplatné HTML.
            Preto je `Reveal` samotný ten `div`. */}
        <dl className="mt-8">
          {FIRMA.znacky.map((znacka, i) => {
            const { doloziene, chyba } = rozoberZastupnyText(znacka.popis)
            return (
              <Reveal
                key={znacka.nazov}
                className={`grid grid-cols-1 gap-4 border-t pt-6 lg:grid-cols-12 lg:gap-16 ${i === 0 ? '' : 'mt-8'}`}
                style={JEMNA_LINKA}
              >
                <dt className="max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-medium leading-[var(--leading-tight)] text-[var(--color-bg)] lg:col-span-4">
                  {znacka.nazov}
                </dt>
                <dd className="lg:col-span-8">
                  {doloziene ? (
                    <p className="max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
                      {doloziene}
                    </p>
                  ) : null}
                  {chyba ? (
                    <div
                      className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t pt-4 ${doloziene ? 'mt-4' : ''}`}
                      style={JEMNA_LINKA}
                    >
                      <p className="max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
                        {chyba}
                      </p>
                      <MonoStitok tmava sCiarkou={false} className="shrink-0">
                        Doplní klient
                      </MonoStitok>
                    </div>
                  ) : null}
                </dd>
              </Reveal>
            )
          })}
        </dl>
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
                      {rozoberZastupnyText(clanok.poznamka).chyba || 'Odkaz na pôvodný článok a názov média.'}
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
          perex={PROCES[0].popis}
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
