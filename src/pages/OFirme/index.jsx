import { useRef, useState } from 'react'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import {
  Podstranka,
  Sekcia,
  SekciaHlavicka,
  MonoStitok,
  Tlacidlo,
  Fotka,
  Lajna,
  Cislo,
} from '../../components/kit/index.js'
import { Reveal, ObrazokSmerovy, smerZUdalosti } from '../../components/primitives/index.js'
import { CISLA_FIRMY, FIRMA, PROCES } from '../../content/firma.js'
import { castiPopisu } from '../Realizacie/skupiny.js'
import { MIESTA_REALIZACII, REALIZACIE } from '../../content/realizacie.js'
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

/**
 * Štyri čísla o firme. Tie isté, aké nesie Domov — a práve preto tu: stránka
 * „O firme" bola jediné miesto webu, kde o firme nestál ani jeden overiteľný
 * údaj, len súvislý text. Miesta sa doplnia z galérie, `firma.js` o nej nevie.
 */
const CISLA = CISLA_FIRMY.map((c) =>
  c.id === 'miesta' ? { ...c, hodnota: MIESTA_REALIZACII.length } : c,
)

/**
 * Stĺpec tvrdení a rám, ktorý sa k nim viaže.
 *
 * Riadky sú `<button>`, nie `<div>` s `onMouseEnter`: inak by sa rám nedal
 * ovládať klávesnicou vôbec. Fokus prepína rovnako ako nájazd; keďže pri
 * klávesnici neexistuje uhol kurzora, smer výteru sa odvodí z posunu
 * v zozname (nižšie = zdola), takže pohyb obrazu sleduje pohyb fokusu.
 */
function PristupDuo() {
  const [aktivny, setAktivny] = useState(0)
  const [smer, setSmer] = useState('bottom')
  const predosly = useRef(0)

  const zvol = (i, e) => {
    if (i === predosly.current) return
    if (e && e.clientX !== undefined && e.currentTarget) setSmer(smerZUdalosti(e, e.currentTarget))
    else setSmer(i > predosly.current ? 'bottom' : 'top')
    predosly.current = i
    setAktivny(i)
  }

  const zaber = ZABERY_PRISTUPU[aktivny]

  return (
    <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <ul className="lg:col-span-6">
        {FIRMA.pristup.map((argument, i) => {
          const je = i === aktivny
          return (
            <li key={argument.nazov}>
              <button
                type="button"
                onMouseEnter={(e) => zvol(i, e)}
                onFocus={() => zvol(i)}
                onClick={(e) => zvol(i, e)}
                aria-pressed={je}
                className="group w-full border-t border-[var(--color-border)] py-7 text-left transition-colors duration-[var(--duration-hover)] ease-[var(--ease-house)] hover:border-[var(--color-accent)]"
              >
                <span className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-[8px] w-[8px] shrink-0 transition-colors duration-[var(--duration-hover)]"
                    style={{
                      backgroundColor: je ? 'var(--color-accent)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                  <span className="min-w-0">
                    <span className="block max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                      {argument.nazov}
                    </span>
                    {/* Text tvrdenia je viditeľný vždy, nie len pri aktívnom
                        riadku: je to stránka o firme a vety sa majú čítať,
                        nie odomykať. Rám vedľa nich je ilustrácia, nie obsah. */}
                    <span className="mt-4 block max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                      {argument.popis}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* `sticky` drží rám v obraze počas celého zoznamu. `top` je 72 px
          fixnej hlavičky plus dych, aby pod ňou rám nezačínal natesno. */}
      <div className="lg:col-span-6">
        <div className="lg:sticky lg:top-[104px]">
          <ObrazokSmerovy zabery={ZABERY_PRISTUPU} aktivny={aktivny} smer={smer} pomer="4/3" />
          <p className="mt-4 min-h-[1.25rem] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {zaber?.popis || ''}
          </p>
        </div>
      </div>
    </div>
  )
}

/** Sadzba v dátach vkladá nezlomiteľné medzery, kľúč ich vracia na obyčajné. */
const fotkaArgumentu = (nazov) =>
  ZAZNAM_PODLA_SUBORU.get(FOTKA_ARGUMENTU[(nazov || '').replace(/\u00A0/g, ' ')]) || null

/**
 * Vrstvy rámu v sekcii Prístup — jedna na každé tvrdenie, v tom istom poradí.
 * Tvrdenie s doloženým záberom dostane fotku, tvrdenie bez neho typografický
 * panel. `stitok` aj `text` sú z `FIRMA.pristup`, nič sa nedopĺňa.
 */
const ZABERY_PRISTUPU = FIRMA.pristup.map((argument) => {
  const f = fotkaArgumentu(argument.nazov)
  if (f) return { src: f.src, w: f.w, h: f.h, alt: altFotky(f), popis: popisFotky(f) }
  return {
    stitok: 'Lepené obrubníky',
    text: '100 % pevnosti po 30 minútach',
    popis: null,
  }
})


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
    <Podstranka
      meta={META}
      stitok="O firme"
      nadpis="Dopravné stavby od roku 2012"
      perex={uvodPerex}
      fakty={FIRMA.fakty}
      /* Výzva — text kroku z `PROCES`, akcie sú obhliadka a galéria realizácií. */
      vyzva={{
        stitok: 'Ďalší krok',
        nadpis: 'Dohodneme si obhliadku',
        perex: PROCES[0].popis,
        akcia: (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Tlacidlo variant="primar" data-cta-obhliadka onClick={() => openObhliadka()}>
              Dohodnúť obhliadku a cenu
            </Tlacidlo>
            <Tlacidlo variant="tichy" to="/realizacie">
              Pozrieť realizácie
            </Tlacidlo>
          </div>
        ),
      }}
    >

      {/* Čísla hneď pod hlavičkou. Stránka o firme mala doteraz o firme
          samé vety a ani jeden overiteľný údaj; štyri čísla sú to prvé,
          čo od dodávateľa chce mesto aj stavebná firma. */}
      <Sekcia id="cisla" pasmo="biela" padding="male">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {CISLA.map((c) => (
            <Reveal key={c.id} className="border-t border-[var(--color-border)] pt-6">
              <Cislo hodnota={c.hodnota} jednotka={c.jednotka} predpona={c.predpona} popis={c.popis} />
            </Reveal>
          ))}
        </div>
      </Sekcia>

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

      {/* Prístup — štyri tvrdenia a vedľa nich rám, ktorý ukazuje, čo tvrdia.

          ## Čo tu bolo predtým (do 28. 8. 2026)

          Zvislý zoznam, v ktorom sa strany striedali: raz text vľavo a fotka
          vpravo, raz naopak. Malo to dve chyby naraz. Argument „Krátke
          obmedzenie dopravy" doložený záber nemá (jediná scéna s lepenými
          obrubníkmi stojí o riadok vyššie a druhý orez tej istej scény by
          nebol ďalší dôkaz, len výplň), takže jeho riadok ostával z polovice
          prázdny — ~200 px diery uprostred pásma. A striedanie strán robilo
          zo štyroch tvrdení cikcak, v ktorom oko na každom riadku hľadalo,
          kde sa začína text.

          ## Čo je namiesto toho

          Tvrdenia stoja pod sebou v jednom stĺpci a rám vedľa nich je
          `sticky` — drží sa v obraze, kým čitateľ prechádza zoznamom, a mení
          sa výterom z tej strany, z ktorej prišiel kurzor (`ObrazokSmerovy`,
          vzor z 21st.dev; ten istý prvok nesie Domov v pásme Technológie).

          Tvrdenie bez doloženej fotografie nedostane fotku „na tému" ani
          prázdny rám: rám sa preň zmení na akcentový panel s tým, čo to
          tvrdenie hovorí. Údaj je doslova z `FIRMA.pristup` a je to zároveň
          najsilnejšie číslo firmy. */}
      <Sekcia id="pristup" pasmo="biela">
        <SekciaHlavicka
          stitok="Prístup"
          nadpis="Technológie bez zásahu do pôvodných konštrukcií"
          sirkaNadpisu="max-w-[24ch]"
        />

        <PristupDuo />
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

    </Podstranka>
  )
}
