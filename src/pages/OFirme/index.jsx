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
import { castiPopisu } from '../Realizacie/skupiny.js'
import { REALIZACIE } from '../../content/realizacie.js'
// Popisok pod fotkou má na celom webe jedno pravidlo a to žije v `Sluzby/fotky.js`
// (typ prvku, prostredie, miesto len keď je doložené). Preto sa sem importuje
// namiesto toho, aby si stránka písala vlastnú verziu tej istej vety.
import { altFotky, maxSirka, popisFotky } from '../Sluzby/fotky.js'
import { openObhliadka } from '../../lib/obhliadka.js'

const META = routaPodlaCesty('/o-firme')

/**
 * Fotografia k argumentu v sekcii Prístup.
 *
 * Kľúč je názov argumentu z `FIRMA.pristup`, hodnota súbor z katalógu
 * `REALIZACIE`. Priradenie je doslovné, nie kompozičné:
 *
 *  • „Bez búracích prác a ťažkých mechanizmov“ — lepený obrubník na hotovom
 *    asfaltovom kryte je presne ten postup, o ktorom argument hovorí;
 *  • „Súlad s vyhláškami“ — varovný pás zo štruktúrovaného značenia je
 *    debarierizačný prvok, ktorý sa podľa uvedených vyhlášok navrhuje;
 *  • „Materiály európskych výrobcov“ — osadené retardéry DEBUZ® Kölner
 *    Teller, teda jeden z troch materiálov, ktoré argument menuje.
 *
 * Argument „Krátke obmedzenie dopravy“ tu nie je. Hovorí o lepených
 * obrubníkoch a jediná scéna, ktorá ich dokladá (Medený Hámor), stojí
 * o riadok vyššie pri prvom argumente. Druhý orez tej istej scény by nebol
 * ďalší dôkaz, len výplň, preto ten riadok ostáva bez fotky.
 */
const FOTKA_ARGUMENTU = {
  'Bez búracích prác a ťažkých mechanizmov': '13-Medeny_Hamor_1-scaled.jpg',
  'Súlad s vyhláškami': '23-BA-1-scaled.jpg',
  'Materiály európskych výrobcov': '03-MT_1-600x390.jpg',
}

const ZAZNAM_PODLA_SUBORU = new Map(REALIZACIE.map((r) => [r.src, r]))

/** Sadzba v dátach vkladá nezlomiteľné medzery, kľúč ich vracia na obyčajné. */
const fotkaArgumentu = (nazov) =>
  ZAZNAM_PODLA_SUBORU.get(FOTKA_ARGUMENTU[(nazov || '').replace(/\u00A0/g, ' ')]) || null

/** Vlasová linka na tmavom pásme: biela s nízkou alfou, nie sivá z tokenov. */
const JEMNA_LINKA = { borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)' }

/**
 * Zástupné pole v dátach má tvar `[DOPLNÍ KLIENT: …]` a býva vložené do vety
 * (`FIRMA.znacky`) aj samostatné (`FIRMA.aktuality`). Na stránku nejde ani
 * ono, ani štítok „doplní klient“: pre návštevníka je to hluk o našej
 * rozrobenosti, nie informácia o firme. Zostane len doložená časť vety, a keď
 * po odstránení nezostane nič, riadok sa nevykreslí. `src/content/**` sa
 * nemení — čo tam raz príde, sa objaví samo.
 *
 * Vety už prešli slovenskou sadzbou v `src/content/firma.js`, takže po
 * jednopísmenových predložkách nesú nezlomiteľnú medzeru. Preto tu žiadne
 * `\s+` ani `trim()`: obe by NBSP zrovnali na obyčajnú medzeru a sadzba by
 * sa stratila. Čistí sa len obyčajná medzera a tabulátor, a veta bez
 * zástupného poľa sa nedotýka vôbec.
 */
const ZASTUPNY_TEXT = /\s*\[\s*DOPLNÍ KLIENT\s*:?\s*[\s\S]*?\]\s*/

const bezZastupnehoTextu = (text) => {
  const zdroj = text || ''
  if (!ZASTUPNY_TEXT.test(zdroj)) return zdroj
  return zdroj.replace(ZASTUPNY_TEXT, ' ').replace(/^[ \t]+|[ \t]+$/g, '')
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
/** Doklad k pásmu konzultácií: prvok, ktorý vyhlášky predpisujú. */
const FOTO_KONZULTACIE = REALIZACIE.find((r) => r.id === 'tornala-signalny-pas') || null

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
      <Sekcia id="firma" pasmo="biela">
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

      {/* Prístup — štyri argumenty, tri z nich s fotografiou toho, čo tvrdia.

          Tie isté vety nesie Domov v sekcii Prečo, ale v inej forme: tam sú
          dva stĺpce holého textu na jednej mriežke, tu je každý argument
          samostatný riadok pásma a vedľa neho stojí záber z realizácie, ktorá
          ho dokladá. Strany sa striedajú. Bez fotiek to bolo 1004 px súvislého
          textu bez jediného obrazového prvku (KOMPOZICIA §2). Priradenie fotky
          k argumentu je v `FOTKA_ARGUMENTU` hore aj s odôvodnením; argument,
          ku ktorému podklady doložený záber nemajú, ostáva bez fotky a jeho
          text sa namiesto toho roztiahne cez sedem stĺpcov. */}
      <Sekcia id="pristup" pasmo="biela">
        <SekciaHlavicka
          stitok="Prístup"
          nadpis="Technológie bez zásahu do pôvodných konštrukcií"
          sirkaNadpisu="max-w-[24ch]"
        />

        <ul className="mt-14">
          {FIRMA.pristup.map((argument, i) => {
            const fotka = fotkaArgumentu(argument.nazov)
            // Striedajú sa len riadky s fotkou: prvý ju má vpravo, druhý vľavo.
            const vlavo =
              FIRMA.pristup.slice(0, i).filter((a) => fotkaArgumentu(a.nazov)).length % 2 === 1
            return (
              <li
                key={argument.nazov}
                className={`border-t border-[var(--color-border)] ${i === 0 ? '' : 'mt-14'} pt-8`}
              >
                <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                  <div
                    className={
                      fotka
                        ? vlavo
                          ? 'lg:col-span-7 lg:col-start-6 lg:row-start-1'
                          : 'lg:col-span-7 lg:col-start-1 lg:row-start-1'
                        : 'lg:col-span-7 lg:col-start-1 lg:row-start-1'
                    }
                  >
                    <h3 className="max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                      {argument.nazov}
                    </h3>
                    <p className="mt-5 max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                      {argument.popis}
                    </p>
                  </div>

                  {fotka ? (
                    <div
                      className={
                        vlavo
                          ? 'lg:col-span-4 lg:col-start-1 lg:row-start-1'
                          : 'lg:col-span-4 lg:col-start-9 lg:row-start-1'
                      }
                    >
                      {/* Orez 4/3 je ten istý pomer ako v galérii realizácií,
                          `maxSirka` nepustí 600 px súbor nad jeho možnosti. */}
                      <div style={{ maxWidth: maxSirka(fotka) }}>
                        <Fotka
                          src={fotka.src}
                          w={fotka.w}
                          h={fotka.h}
                          alt={altFotky(fotka)}
                          popis={popisFotky(fotka)}
                          pomer="3/2"
                        />
                      </div>
                    </div>
                  ) : null}
                </Reveal>
              </li>
            )
          })}
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

        {/* Pásmo bolo 1 469 px súvislého textu bez jediného obrazu, teda presne
            to, čo sa na `/o-firme` vytýkalo. Signálny pás v Tornali je prvok,
            ku ktorému Únia vydáva stanoviská a ktorý predpisujú obe vyhlášky
            uvedené o kus nižšie, takže pásmo dokladá, nie zdobí. */}
        {FOTO_KONZULTACIE ? (
          <Reveal className="mt-12">
            <Fotka
              src={FOTO_KONZULTACIE.src}
              w={FOTO_KONZULTACIE.w}
              h={FOTO_KONZULTACIE.h}
              alt={FOTO_KONZULTACIE.alt}
              popis={`${FOTO_KONZULTACIE.prvok} · ${castiPopisu(FOTO_KONZULTACIE)[0]}`}
              tmava
              sizes="(min-width: 1024px) 82vw, 100vw"
              maxSirka={Infinity}
              triedaObrazka="aspect-[4/3] sm:aspect-[21/9] lg:aspect-[3/1]"
              className="[&_figcaption]:border-t [&_figcaption]:pt-4"
            />
          </Reveal>
        ) : null}

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
            const doloziene = bezZastupnehoTextu(znacka.popis)
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
                </dd>
              </Reveal>
            )
          })}
        </dl>
      </Sekcia>

      {/* Aktuality — jediná položka z pôvodného webu. `url` je null, preto to
          nie je odkaz, len titulok a rok. Telo článku ani adresu pôvodného
          média nemáme a poznámku o tom, že chýbajú, návštevník čítať nemá.

          Pásmo je zámerne na malom odsadku a nadpis stojí vedľa položky, nie
          nad ňou: na plnom odsadku so samostatnou hlavičkou zaberal jeden
          titulok bez odkazu 539 px, čo je na jednu vetu pol obrazovky. Fotku
          k nemu nedávame — článok je o bezpečnostných ostrovčekoch a záber
          lepeného ostrovčeka si v `sluzby.js` (lepené obrubníky) od klienta
          práve pýtame, takže by vedľa titulku stál prvok, ktorý s ním
          nesúvisí. Zrušiť sa pásmo nedá: oddeľuje tmavé pásmo vyhlášok od
          tmavého CTA (STANDARDY B5). */}
      <Sekcia id="aktuality" pasmo="biela" padding="male">
        <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 className="max-w-[12ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)] lg:col-span-4">
            Aktuality
          </h2>

          <ul className="lg:col-span-8">
            {FIRMA.aktuality.map((clanok, i) => (
              <li
                key={clanok.titulok}
                className={`border-t border-[var(--color-text)] ${i === 0 ? '' : 'mt-10'} pt-5`}
              >
                <MonoStitok>{clanok.rok}</MonoStitok>
                <h3 className="mt-4 max-w-[34ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                  {clanok.titulok}
                </h3>
              </li>
            ))}
          </ul>
        </Reveal>
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
