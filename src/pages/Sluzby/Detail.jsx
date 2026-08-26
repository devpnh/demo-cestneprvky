import { useParams } from 'react-router-dom'
import Seo from '../../components/Seo.jsx'
import NotFound from '../NotFound.jsx'
import {
  Fotka,
  Lajna,
  MonoStitok,
  Sekcia,
  SekciaHlavicka,
  StranHlavicka,
  Tlacidlo,
} from '../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../components/primitives/index.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import { SKUPINY, sluzbaPodlaSlugu } from '../../content/sluzby.js'
import { REALIZACIE, realizaciePodlaSluzby } from '../../content/realizacie.js'
import { FIRMA, PROCES } from '../../content/firma.js'
import KartaSluzby from './KartaSluzby.jsx'
import TabulkaDebuz from './TabulkaDebuz.jsx'
import {
  altFotky,
  fotkaKonzultacii,
  fotkaZoznamu,
  maxSirka,
  popisFotky,
  udajeFotky,
  uvodnaFotkaSluzby,
} from './fotky.js'

/**
 * Malý orez a veľká fotka tej istej scény sú v dátach previazané cez
 * `duplikatOf`. Galéria služby preto pracuje s kľúčom scény, nie so súborom:
 * inak by pod hlavnou fotkou visela ešte raz tá istá scéna v dlaždicovom oreze.
 */
const KLUC_SCENY = new Map(REALIZACIE.map((r) => [r.src, r.duplikatOf || r.src]))
const scena = (src) => KLUC_SCENY.get(src) || src

/**
 * Fotky služby a jej realizácie bez duplicít a bez tých, ktoré na stránke už
 * niekde stoja. `pouzite` je celý zoznam z úvodu, zo zoznamov podkategórií a
 * z bloku konzultácií: fotografia má na stránke dokladať jednu vec na jednom
 * mieste, nie sa opakovať o dve pásma nižšie v inom oreze.
 */
function galeriaSluzby(sluzba, pouzite, maxPocet = 6) {
  const videne = new Set(pouzite.filter(Boolean).map((f) => scena(f.src)))
  const vysledok = []
  const pridaj = (f) => {
    const kluc = scena(f.src)
    if (videne.has(kluc)) return
    videne.add(kluc)
    vysledok.push(f)
  }
  ;(sluzba.fotky || []).forEach(pridaj)
  realizaciePodlaSluzby(sluzba.slug).forEach(pridaj)
  return vysledok.slice(0, maxPocet)
}

// ---------------------------------------------------------------- rytmus pásiem

/**
 * Farba, ktorú by pásmo malo, keby stálo na stránke samo.
 *
 * Hlavička podstránky je od 26. 8. 2026 tmavá (kit `StranHlavicka`), takže
 * rytmus sa počíta od tmavej a prvé obsahové pásmo je vždy svetlé.
 * Výhody sú tmavé zámerne: je to jediné pásmo stránky retardérov, ktoré nesie
 * argumenty a veľké číslo, a stránka bez neho išla päť pásiem v jednej farbe.
 */
const ZAKLADNE_PASMO = {
  hlavicka: 'tmava',
  uvod: 'biela',
  rozsah: 'biela',
  vyhody: 'tmava',
  technicky: 'biela',
  konzultacie: 'tmava',
  galeria: 'tmava',
  suvisiace: 'biela',
  cta: 'tmava',
}

/** Pásma, ktorých farbu drží kompozícia a striedaniu neustupujú. */
const PEVNE_PASMA = new Set(['hlavicka', 'konzultacie', 'cta'])

/**
 * Pásma, pre ktoré je v tomto súbore vysádzaná aj tmavá verzia. Ostatné
 * ostávajú svetlé za každých okolností — rytmus nesmie poslať do tmavého
 * pásma obsah, ktorý tam nemá čitateľné rámy a popisky (tabuľka DEBUZ,
 * karty súvisiacich služieb).
 */
const TMAVU_ZNESIE = new Set(['hlavicka', 'rozsah', 'vyhody', 'konzultacie', 'galeria', 'cta'])

/** Koľko ráz poradie farieb porušuje pravidlá rytmu. */
function pocetChyb(farby) {
  let chyby = 0
  for (let i = 1; i < farby.length; i += 1) {
    // STANDARDY B5: dve tmavé pásma nikdy nesusedia.
    if (farby[i] === 'tmava' && farby[i - 1] === 'tmava') chyby += 1
    // Pokyn manažéra kola 5: ani tri rovnaké pásma za sebou.
    if (i > 1 && farby[i] === farby[i - 1] && farby[i] === farby[i - 2]) chyby += 1
  }
  return chyby
}

/**
 * Poradie farieb pásiem pre konkrétnu stránku služby.
 *
 * Deväť detailov má deväť rôznych sád pásiem: bohatá služba ich má sedem,
 * chudobná štyri. Kým mala každá sekcia farbu napevno, chudobným stránkam
 * vypadli práve tie pásma, ktoré striedanie robili, a ostali tri rovnaké
 * farby za sebou — a to sa nečíta ako predel medzi témami, ale ako diera.
 * Preto sa farba nepriraďuje sekcii, ale počíta z poradia pásiem, ktoré na
 * stránke naozaj vznikli. Obsah sa nikde nedopĺňa.
 *
 * Hľadá sa poradie, ktoré (1) neporuší ani jedno pravidlo rytmu a (2) sa čo
 * najmenej líši od základných farieb vyššie. Pásiem je najviac osem a voľné
 * sú z nich najviac tri, takže sa dajú jednoducho prejsť všetky kombinácie;
 * greedy priradenie zľava doprava tu zlyhávalo — o tom, či smie byť tmavý
 * „Rozsah“, rozhoduje až pásmo o dve nižšie.
 */
function rytmusPasiem(kluce) {
  const moznosti = kluce.map((kluc) =>
    PEVNE_PASMA.has(kluc)
      ? [ZAKLADNE_PASMO[kluc]]
      : TMAVU_ZNESIE.has(kluc)
        ? ['biela', 'tmava']
        : ['biela'],
  )

  let najlepsie = null
  const skus = (i, zatial) => {
    if (i === kluce.length) {
      const zmeny = zatial.filter((f, j) => f !== ZAKLADNE_PASMO[kluce[j]]).length
      const skore = pocetChyb(zatial) * 100 + zmeny
      if (!najlepsie || skore < najlepsie.skore) najlepsie = { skore, farby: [...zatial] }
      return
    }
    for (const farba of moznosti[i]) skus(i + 1, [...zatial, farba])
  }
  skus(0, [])

  return Object.fromEntries(kluce.map((kluc, i) => [kluc, najlepsie.farby[i]]))
}

// ------------------------------------------------------- zoznamy podkategórií

/**
 * Vlasový rám na tmavom pásme je predpísaný v KOMPOZICIA.md ako color-mix nad
 * `--color-bg`, nie ako vlastná rgba. Drží ho jedna konštanta, aby sa zoznamy,
 * tabuľky a štítky na tmavom pásme nerozišli.
 */
const RAM_TMAVA = 'border-[color-mix(in_srgb,var(--color-bg)_18%,transparent)]'

/** Nadpis jedného celku v zozname podkategórií: výrazná linka a názov. */
function NadpisZoznamu({ children, tmava = false, className = '' }) {
  return (
    <h3
      className={`border-t ${
        tmava
          ? 'border-[var(--color-bg)] text-[var(--color-bg)]'
          : 'border-[var(--color-text)] text-[var(--color-text)]'
      } pt-5 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] ${className}`}
    >
      {children}
    </h3>
  )
}

/**
 * Položky celku pod sebou, každá na vlasovej linke. `hornaLinka` je pre
 * rozloženie, v ktorom položky stoja vedľa nadpisu a nie pod ním: horná
 * výrazná linka zoznamu tak pokračuje v tej istej osi ako linka nadpisu.
 */
function PolozkyZoznamu({ polozky, hornaLinka = false, tmava = false, className = '' }) {
  return (
    <ul
      className={`${
        hornaLinka ? `border-t ${tmava ? 'border-[var(--color-bg)]' : 'border-[var(--color-text)]'}` : ''
      } ${className}`}
    >
      {polozky.map((p) => (
        <li
          key={p}
          className={`border-b ${
            tmava ? `${RAM_TMAVA} text-[var(--color-bg)]` : 'border-[var(--color-border)] text-[var(--color-text)]'
          } py-4 font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)]`}
        >
          {p}
        </li>
      ))}
    </ul>
  )
}

/**
 * Fotografia vedľa zoznamu podkategórií. Orez 4/3 je ten istý ako v galérii
 * služby, takže sa fotky na stránke nebijú rôznymi pomermi; `maxSirka`
 * nepustí malý súbor nad 1,4-násobok jeho skutočnej šírky.
 */
function FotkaZoznamu({ fotka, tmava = false }) {
  return (
    <div style={{ maxWidth: maxSirka(fotka) }}>
      <Fotka
        src={fotka.src}
        w={fotka.w}
        h={fotka.h}
        alt={altFotky(fotka)}
        popis={popisFotky(fotka)}
        pomer="4/3"
        tmava={tmava}
      />
    </div>
  )
}

/**
 * Šablóna deviatich stránok služieb. Bohatosť stránky určujú dáta, nie
 * šablóna: služby s plným textom z pôvodného webu majú odseky, zoznamy,
 * výhody, technickú tabuľku aj návod. Nedopĺňa sa žiadny parameter, materiál
 * ani norma, ktoré v dátach nie sú.
 *
 * Služby bez plného textu majú vlastnú kompozíciu úvodného pásma: záber 3:2
 * cez sedem stĺpcov a vedľa neho marginálie — materiály (kde ich dáta majú) a
 * odkaz do galérie realizácií. Stálo tam predtým to, čo klient v podkladoch
 * ešte nedodal („Doplní klient“); pokyn Petra z 26. 8. 2026 to zo stránok
 * vypustil. Pole `chyba` v `src/content/sluzby.js` ostáva ako evidencia pre
 * `poznamky/HANDOVER.md`, len sa nevykresľuje. Prázdne miesto po ňom sa
 * nevypĺňa vatou — fotka dostala väčší podiel šírky aj vyšší orez.
 *
 * Rytmus pásiem drží `rytmusPasiem` vyššie: farby sa nepriraďujú sekciám
 * napevno, ale sa počítajú z poradia pásiem, ktoré na stránke naozaj vznikli.
 */
/**
 * Počet rokov v praxi sa nevypisuje natvrdo: vyťahuje sa z odsekov služby,
 * takže keď klient text zmení, štítok sa zmení s ním, a keď vetu vypustí,
 * štítok zmizne. Číslo patrí výrobku DEBUZ®, nie firme.
 */
function rokyVPraxi(sluzba) {
  for (const odsek of sluzba?.odseky || []) {
    const m = String(odsek).match(/(\d{1,3})\s*rok/i)
    if (m) return m[1]
  }
  return null
}

export default function SluzbaDetail() {
  const { slug } = useParams()
  const sluzba = sluzbaPodlaSlugu(slug)
  const ROKY_V_PRAXI = rokyVPraxi(sluzba)

  // Neexistujúci slug renderuje tú istú 404 ako `*`, takže stránka má stále
  // presne jeden H1 a používateľ dostane rovnaké východiská.
  if (!sluzba) return <NotFound />

  const uvodnaFotka = uvodnaFotkaSluzby(sluzba)
  const maOdseky = Array.isArray(sluzba.odseky) && sluzba.odseky.length > 0

  // Zoznamy podkategórií aj s fotkou, ktorá ich dokladá (kde ju podklady majú).
  const zoznamy = (sluzba.zoznamy || []).map((z) => ({ z, fotka: fotkaZoznamu(sluzba.slug, z.titulok) }))
  const fotkaKonz = fotkaKonzultacii(sluzba.slug)

  /**
   * Jediný zoznam bez fotky nedostane vlastné pásmo, ale pokračuje pod
   * úvodom za prerušovanou linkou. Ako samostatná sekcia to bolo 722 px
   * súvislého textu bez jediného obrazového prvku (KOMPOZICIA §2) a pritom
   * nesie štyri riadky. V úvodnom pásme stojí vedľa fotky služby, ktorá už
   * v ňom je; obsah sa nikde nemení ani nedopĺňa.
   */
  const zoznamVUvode = maOdseky && zoznamy.length === 1 && !zoznamy[0].fotka
  const galeria = galeriaSluzby(sluzba, [uvodnaFotka, ...zoznamy.map((x) => x.fotka), fotkaKonz])
  // Únia nevidiacich a slabozrakých Slovenska je miesto, kam sa chodí po
  // konzultáciu a stanovisko. Pôvodný web na ňu len odkazuje a nič spoločné
  // s ňou netvrdí; dáta preto pole volajú `konzultacie` a nesú aj jeho
  // vlastný štítok, ktorý stránka preberá namiesto vlastného nadpisu.
  const konzultacie = sluzba.konzultacie
  const maKonzultacie = Boolean(konzultacie || (sluzba.normy && sluzba.normy.length))
  const suvisiace = (sluzba.suvisiace || []).map(sluzbaPodlaSlugu).filter(Boolean)
  // Celok, do ktorého služba na `/sluzby` patrí. Na chudobných službách je to
  // riadok marginálií vedľa fotky; názov je z dát, nič sa nedopisuje.
  const skupinaSluzby = SKUPINY.find((s) => s.id === sluzba.skupina)

  // Pásma, ktoré na tejto stránke skutočne vzniknú, v poradí zhora nadol.
  // Hlavička je v zozname tiež: farbu si drží, ale rytmus sa počíta od nej.
  const pasmo = rytmusPasiem(
    [
      'hlavicka',
      'uvod',
      zoznamy.length && !zoznamVUvode ? 'rozsah' : null,
      sluzba.vyhody?.length ? 'vyhody' : null,
      sluzba.tabulka || sluzba.navod ? 'technicky' : null,
      maKonzultacie ? 'konzultacie' : null,
      galeria.length ? 'galeria' : null,
      suvisiace.length ? 'suvisiace' : null,
      'cta',
    ].filter(Boolean),
  )
  const galeriaTmava = pasmo.galeria === 'tmava'
  const rozsahTmava = pasmo.rozsah === 'tmava'
  const vyhodyTmava = pasmo.vyhody === 'tmava'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: sluzba.nazov,
    description: sluzba.seo?.description,
    provider: {
      '@type': 'LocalBusiness',
      name: FIRMA.nazov,
      address: {
        '@type': 'PostalAddress',
        addressLocality: FIRMA.sidlo,
        addressCountry: 'Slovensko',
      },
    },
    areaServed: { '@type': 'Country', name: 'Slovensko' },
  }

  return (
    <>
      <Seo title={sluzba.seo?.title} description={sluzba.seo?.description} jsonLd={jsonLd} />

      {/* Drobček „Služby“ je v `StranHlavicka` obyčajný textový odkaz a jeho
          vlastná inline schránka je vysoká 15 px, čo je na dotyk málo (D2).
          Triedu komponentu zvonku podať nevieme, `label` áno: 44 px vysoký
          inline-flex vnútri odkazu je celý klikateľný, takže dotyková plocha
          sedí. Pozor pri meraní: `a.getBoundingClientRect()` aj tak vráti
          15 px, lebo inline schránka odkazu sa počíta z metriky písma a nie
          z atomického potomka. Trvalá oprava patrí do kitu (jedna trieda na
          `<Link>` v `StranHlavicka.jsx`), tam siahať nesmiem. Len do `lg`,
          desktopové rozloženie ostáva nezmenené (D4). */}
      <StranHlavicka
        drobky={[
          { label: 'Služby', to: '/sluzby' },
          { label: sluzba.nazovKratky || sluzba.nazov },
        ]}
        nadpis={sluzba.nazov}
        perex={sluzba.perex}
      />

      {/* 1. Úvod. Dve kompozície podľa toho, čo je v dátach. */}
      {maOdseky ? (
        <Sekcia pasmo={pasmo.uvod}>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              {sluzba.odseky.map((o, i) => (
                <p
                  key={o.slice(0, 40)}
                  className={`max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-text)] ${
                    i === 0 ? '' : 'mt-6'
                  }`}
                >
                  {o}
                </p>
              ))}
              {sluzba.znacky?.length ? (
                <div className="mt-10 border-t border-[var(--color-border)] pt-5">
                  <MonoStitok>Materiály</MonoStitok>
                  <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                    {sluzba.znacky.join(' · ')}
                  </p>
                </div>
              ) : null}
            </Reveal>

            {uvodnaFotka ? (
              <Reveal className="lg:col-span-5">
                {/* Zvislý záber v polovičnom stĺpci narástol na 1072 px vedľa
                    textu vysokého 400 px a pásmo malo 1292 px, z toho väčšinu
                    prázdnych. Portrét preto dostane orez 3:4; na šírku
                    orientovaný záber ostáva v pôvodnom pomere. */}
                <div style={{ maxWidth: maxSirka(uvodnaFotka) }}>
                  <Fotka
                    src={uvodnaFotka.src}
                    w={uvodnaFotka.w}
                    h={uvodnaFotka.h}
                    alt={altFotky(uvodnaFotka)}
                    popis={popisFotky(uvodnaFotka)}
                    pomer={uvodnaFotka.h > uvodnaFotka.w * 1.34 ? '3/4' : null}
                    priorita
                  />
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Jediný zoznam podkategórií bez vlastnej fotky pokračuje tu, za
              prerušovanou linkou. Vo vlastnom pásme z neho bolo 722 px textu
              bez jediného obrazového prvku; tu stojí v pásme, ktoré fotku
              služby už nesie. Text sa nemení, mení sa len umiestnenie. */}
          {zoznamVUvode ? (
            <>
              <Lajna className="my-16" />
              <SekciaHlavicka stitok="Rozsah" nadpis="Čo služba zahŕňa" />
              <Reveal className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                <NadpisZoznamu className="lg:col-span-4">{zoznamy[0].z.titulok}</NadpisZoznamu>
                <PolozkyZoznamu polozky={zoznamy[0].z.polozky} hornaLinka className="lg:col-span-7 lg:col-start-6" />
              </Reveal>
            </>
          ) : null}
        </Sekcia>
      ) : (
        <Sekcia pasmo={pasmo.uvod} padding="male">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            {uvodnaFotka ? (
              <Reveal className="lg:col-span-7">
                {/* Kým vedľa fotky stál zoznam podkladov, bola fotka plochá
                    (21:9), aby pásmo nenarástlo. Bez neho by z prúžka a
                    prázdneho pravého stĺpca ostala diera, tak má záber orez
                    16:9 a celých sedem stĺpcov. Vyšší orez (3:2) sme skúsili
                    tiež: fotka potom prerástla marginálie o 240 px a pod nimi
                    ostala prázdna plocha. `maxSirka` drží 1,4× originálu. */}
                <div style={{ maxWidth: maxSirka(uvodnaFotka) }}>
                  <Fotka
                    src={uvodnaFotka.src}
                    w={uvodnaFotka.w}
                    h={uvodnaFotka.h}
                    alt={altFotky(uvodnaFotka)}
                    pomer="16/9"
                    priorita
                  />
                </div>
              </Reveal>
            ) : null}

            {/* Marginálie vedľa fotky. To isté rozloženie, akým vedľa tabuľky
                DEBUZ stojí poznámka k nej: vľavo vec, vpravo hodnota, medzi
                riadkami vlasová linka. Obsahom je popisok fotky rozpísaný na
                riadky — pod fotkou preto už nestojí — a materiály z dát.
                Nová veta o klientovi tu nevzniká, odkaz je mikro-label. */}
            <Reveal className="lg:col-span-5 lg:flex lg:h-full lg:flex-col">
              <dl className="border-t border-[var(--color-text)]">
                {[
                  ...udajeFotky(uvodnaFotka || sluzba.dlazdica),
                  ...(sluzba.znacky?.length ? [['Materiály', sluzba.znacky.join(' · ')]] : []),
                  ...(skupinaSluzby ? [['Celok', skupinaSluzby.nazov]] : []),
                ].map(([nazov, hodnota]) => (
                  <div
                    key={nazov}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--color-border)] py-4"
                  >
                    <dt className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      {nazov}
                    </dt>
                    <dd className="max-w-[34ch] text-right font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                      {hodnota}
                    </dd>
                  </div>
                ))}
              </dl>
              {/* Odkaz stojí hneď pod marginálnym zoznamom, nie na spodnej
                  hrane fotky: zarovnanie na spodok síce stĺpec „dorovná“, ale
                  vyrobí medzi zoznamom a odkazom 177 px prázdna. Takto je
                  najväčšia prázdna plocha stĺpca 113 px. */}
              <Tlacidlo variant="tichy" to="/realizacie" className="mt-8 self-start">
                Fotografie z realizácií
              </Tlacidlo>
            </Reveal>
          </div>
        </Sekcia>
      )}

      {/* 2. Zoznamy podkategórií.

          Dva zoznamy vedľa seba boli dva stĺpce holého textu vysoké 722 až
          845 px. Teraz je každý celok samostatný riadok pásma: názov a
          položky na jednej strane, fotografia toho prvku na druhej, strany
          sa striedajú. Fotka sa priraďuje doslova — súbor musí v katalógu
          realizácií patriť tejto službe a jeho `prvok` musí byť položkou
          toho zoznamu (`fotkaZoznamu` v `fotky.js`). Kde takú fotku podklady
          nemajú, riadok fotku nedostane a namiesto prázdneho stĺpca sa
          položky roztiahnu cez sedem stĺpcov. */}
      {zoznamy.length && !zoznamVUvode ? (
        <Sekcia pasmo={pasmo.rozsah}>
          <SekciaHlavicka tmava={rozsahTmava} stitok="Rozsah" nadpis="Čo služba zahŕňa" />
          <div className="mt-12">
            {zoznamy.map(({ z, fotka }, i) => {
              // Striedajú sa len riadky s fotkou: prvý ju má vpravo, druhý vľavo.
              const vlavo = zoznamy.slice(0, i).filter((x) => x.fotka).length % 2 === 1
              return (
                <Reveal
                  key={z.titulok}
                  className={`grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16 ${i === 0 ? '' : 'mt-16'}`}
                >
                  {fotka ? (
                    <>
                      <div
                        className={
                          vlavo
                            ? 'lg:col-span-6 lg:col-start-7 lg:row-start-1'
                            : 'lg:col-span-6 lg:col-start-1 lg:row-start-1'
                        }
                      >
                        <NadpisZoznamu tmava={rozsahTmava}>{z.titulok}</NadpisZoznamu>
                        <PolozkyZoznamu polozky={z.polozky} tmava={rozsahTmava} className="mt-6" />
                      </div>
                      <div
                        className={
                          vlavo
                            ? 'lg:col-span-5 lg:col-start-1 lg:row-start-1'
                            : 'lg:col-span-5 lg:col-start-8 lg:row-start-1'
                        }
                      >
                        <FotkaZoznamu fotka={fotka} tmava={rozsahTmava} />
                      </div>
                    </>
                  ) : (
                    <>
                      <NadpisZoznamu tmava={rozsahTmava} className="lg:col-span-4">
                        {z.titulok}
                      </NadpisZoznamu>
                      <PolozkyZoznamu
                        polozky={z.polozky}
                        hornaLinka
                        tmava={rozsahTmava}
                        className="lg:col-span-7 lg:col-start-6"
                      />
                    </>
                  )}
                </Reveal>
              )
            })}
          </div>
        </Sekcia>
      ) : null}

      {/* 3. Výhody: len tam, kde ich pôvodný web uvádzal (retardéry).

          Jeden stĺpec so širokými riadkami, nie mriežka. Výhod je sedem, a
          sedem je prvočíslo: v dvoch stĺpcoch vyjde 4 + 3, takže posledná
          položka stojí sama a vedľa nej ostane prázdne pole vysoké ako celý
          riadok; v troch stĺpcoch je to 3 + 3 + 1, čo je to isté ešte
          výraznejšie. Jediný stĺpec osirelú položku ani dieru mať nemôže —
          každý riadok je celý riadok. Opticky pridáva ešte jedno: oko číta
          zoznam zhora nadol jednou linkou a neskáče cez 64 px medzeru medzi
          stĺpcami, pričom dĺžka riadkov sa nestrieda náhodne podľa toho, ako
          dlhá je susedná bunka. Je to aj forma, ktorú web na tej istej
          stránke používa v „Čo služba zahŕňa“, v návode na inštaláciu aj v
          zozname podkladov: vlasová linka, akcentová čiarka, veta. */}
      {sluzba.vyhody?.length ? (
        <Sekcia pasmo={pasmo.vyhody}>
          <SekciaHlavicka
            tmava={vyhodyTmava}
            stitok="Výhody"
            nadpis={sluzba.znacky?.length ? `Výhody ${sluzba.znacky[0]}` : 'Výhody riešenia'}
          />
          {/* Pásmo malo vyše 1 000 px súvislého textu bez jediného obrazu.
              Fotografiu sem dať nemôžeme: služba má v podkladoch jediný záber
              retardérov a ten je úvodnou fotkou tej istej stránky. Namiesto
              ilustrácie preto stojí vedľa zoznamu technický štítok s číslom,
              ktoré je doslova v texte klienta („v praxi nachádzajú výborné
              uplatnenie už 25 rokov“) — a je pripísané výrobku, nie firme. */}
          <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
            <Stagger
              className={`border-t ${vyhodyTmava ? RAM_TMAVA : 'border-[var(--color-border)]'} lg:col-span-8`}
              staggerChildren={0.06}
            >
              {sluzba.vyhody.map((v) => (
                <StaggerItem key={v} as="div">
                  <p
                    className={`flex gap-5 border-b ${
                      vyhodyTmava
                        ? `${RAM_TMAVA} text-[var(--color-bg)]`
                        : 'border-[var(--color-border)] text-[var(--color-text)]'
                    } py-5 font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)]`}
                  >
                    {/* Na tmavom pásme má samotný akcent 3,61:1, preto tam
                        čiarku kreslí `--color-accent-svetly` rovnako ako
                        v hlavičke podstránky. */}
                    <span
                      aria-hidden="true"
                      className={`mt-[0.7em] h-[2px] w-4 shrink-0 ${
                        vyhodyTmava ? 'bg-[var(--color-accent-svetly)]' : 'bg-[var(--color-accent)]'
                      }`}
                    />
                    <span className="max-w-[62ch]">{v}</span>
                  </p>
                </StaggerItem>
              ))}
            </Stagger>

            {ROKY_V_PRAXI ? (
              <Reveal className="lg:col-span-4 lg:h-full">
                <div
                  data-prvok="stitok"
                  className={`flex h-full flex-col justify-center border ${
                    vyhodyTmava ? RAM_TMAVA : 'border-[var(--color-border)]'
                  } px-8 py-10`}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <p
                    className={`font-[family-name:var(--font-display)] text-[length:var(--text-5xl)] font-semibold leading-none tracking-[var(--tracking-tight)] ${
                      vyhodyTmava ? 'text-[var(--color-bg)]' : 'text-[var(--color-text)]'
                    }`}
                  >
                    {`${ROKY_V_PRAXI} rokov`}
                  </p>
                  <p
                    className={`mt-4 max-w-[24ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] ${
                      vyhodyTmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
                    }`}
                  >
                    {sluzba.znacky?.length ? `${sluzba.znacky[0]} v praxi` : 'v praxi'}
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>
        </Sekcia>
      ) : null}

      {/* 4. Technický list: tabuľka a návod na inštaláciu (len retardéry).
          Tabuľka drží osem stĺpcov mriežky a vysvetlivka k hviezdičke stojí
          ako marginálie vo voľnom stĺpci — pod tabuľkou visela a pravá
          polovica pásma ostávala prázdna. */}
      {sluzba.tabulka || sluzba.navod ? (
        <Sekcia pasmo={pasmo.technicky}>
          {sluzba.tabulka ? (
            <>
              <SekciaHlavicka stitok="Parametre" nadpis={sluzba.tabulka.titulok} sirkaNadpisu="max-w-[24ch]" />
              <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-8">
                  <TabulkaDebuz tabulka={sluzba.tabulka} bezPoznamky />
                </Reveal>
                {sluzba.tabulka.poznamka ? (
                  <Reveal className="lg:col-span-4">
                    <div className="border-t border-[var(--color-text)] pt-5">
                      <MonoStitok>Poznámka k tabuľke</MonoStitok>
                      <p className="mt-4 max-w-[34ch] font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                        {sluzba.tabulka.poznamka}
                      </p>
                    </div>
                  </Reveal>
                ) : null}
              </div>
            </>
          ) : null}

          {sluzba.navod ? (
            <>
              {sluzba.tabulka ? <Lajna className="my-16" /> : null}
              <Reveal>
                <h3 className="max-w-[24ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                  {sluzba.navod.titulok}
                </h3>
              </Reveal>
              <Stagger as="ol" className="mt-8 max-w-[68ch]" staggerChildren={0.07}>
                {sluzba.navod.kroky.map((k, i) => (
                  <StaggerItem as="li" key={k.slice(0, 40)} className="flex gap-5 border-t border-[var(--color-border)] py-5">
                    <span className="mt-[0.35em] shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] tabular-nums text-[var(--color-accent-deep)]">
                      {i + 1}
                    </span>
                    <span className="font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                      {k}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            </>
          ) : null}
        </Sekcia>
      ) : null}

      {/* 5. Vyhlášky a kam po konzultáciu: tmavé pásmo, mono na predpisy.
          Nadpis bloku je z dát — Únia nevidiacich a slabozrakých Slovenska
          konzultácie poskytuje, nespolupracuje s nami. */}
      {maKonzultacie ? (
        <Sekcia pasmo="tmava">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <MonoStitok tmava>{konzultacie?.stitok || 'Predpisy'}</MonoStitok>
              {konzultacie ? (
                <>
                  <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
                    {konzultacie.nazov}
                  </h2>
                  <p className="mt-6 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
                    {konzultacie.popis}
                  </p>
                  <Tlacidlo
                    variant="sekundar"
                    tmava
                    href={konzultacie.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Otvoriť architektonickebariery.sk v novom okne"
                    className="mt-9"
                  >
                    {konzultacie.odkazText || 'architektonickebariery.sk'}
                  </Tlacidlo>
                </>
              ) : null}
            </Reveal>

            {sluzba.normy?.length || fotkaKonz ? (
              <Reveal className="lg:col-span-5 lg:ml-auto">
                {/* Text bloku hovorí o debarierizačných prvkoch, ku ktorým
                    Únia vydáva stanoviská. Nad zoznamom vyhlášok preto stojí
                    presne taký prvok: signálny pás a vodiaca línia
                    v priechode pre chodcov. Bez neho malo pásmo 634 px bez
                    jediného obrazového prvku. */}
                {fotkaKonz ? (
                  <div className="mb-12" style={{ maxWidth: maxSirka(fotkaKonz) }}>
                    <Fotka
                      src={fotkaKonz.src}
                      w={fotkaKonz.w}
                      h={fotkaKonz.h}
                      alt={altFotky(fotkaKonz)}
                      popis={popisFotky(fotkaKonz)}
                      pomer="4/3"
                      tmava
                    />
                  </div>
                ) : null}
                {sluzba.normy?.length ? (
                  <>
                    <MonoStitok tmava sCiarkou={false}>
                      Vyhlášky
                    </MonoStitok>
                    {/* Vlasový rám na tmavom pásme je predpísaný v KOMPOZICIA.md
                        ako color-mix nad `--color-bg`, nie ako vlastná rgba. */}
                    <ul className="mt-5 border-t border-[color-mix(in_srgb,var(--color-bg)_18%,transparent)]">
                      {sluzba.normy.map((n) => (
                        <li
                          key={n}
                          className="border-b border-[color-mix(in_srgb,var(--color-bg)_18%,transparent)] py-4 font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)]"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </Reveal>
            ) : null}
          </div>
        </Sekcia>
      ) : null}

      {/* 6. Galéria služby. Popisy sú pravdivé: miesto uvádzame len tam, kde ho dáta potvrdzujú. */}
      {galeria.length ? (
        <Sekcia pasmo={pasmo.galeria}>
          <SekciaHlavicka
            tmava={galeriaTmava}
            stitok="Galéria"
            nadpis="Fotografie z realizácií"
            akcia={
              <Tlacidlo variant="tichy" tmava={galeriaTmava} to="/realizacie">
                Všetky realizácie
              </Tlacidlo>
            }
          />
          <Stagger
            className={`mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 ${galeria.length > 2 ? 'lg:grid-cols-3' : ''}`}
            staggerChildren={0.07}
          >
            {galeria.map((f) => (
              <StaggerItem key={f.src}>
                <Fotka
                  src={f.src}
                  w={f.w}
                  h={f.h}
                  alt={altFotky(f)}
                  popis={popisFotky(f)}
                  pomer="4/3"
                  tmava={galeriaTmava}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ) : null}

      {/* 7. Súvisiace služby: karty bez rámu, aby na stránke nestáli tri
          rovnaké orámované boxy vedľa seba (STANDARDY B6). */}
      {suvisiace.length ? (
        <Sekcia pasmo={pasmo.suvisiace}>
          <SekciaHlavicka
            stitok="Ďalej"
            nadpis="Súvisiace služby"
            akcia={
              <Tlacidlo variant="tichy" to="/sluzby">
                Všetkých deväť služieb
              </Tlacidlo>
            }
          />
          <Stagger className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.07}>
            {suvisiace.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <KartaSluzby sluzba={s} variant="holy" />
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ) : null}

      {/* 8. CTA. Nadpis pomenúva túto službu, nie claim firmy: ten istý claim
          nad každou stránkou zoslabol na výplň. Dialóg si predvyplní typ
          prvku názvom služby. */}
      <Sekcia pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Obhliadka"
          nadpis={`Dohodneme obhliadku na ${(sluzba.nazovKratky || sluzba.nazov).toLowerCase()}`}
          perex={PROCES[1].popis}
          akcia={
            <div className="flex flex-wrap items-center gap-6">
              <Tlacidlo variant="primar" onClick={() => openObhliadka(sluzba.nazov)}>
                Dohodnúť obhliadku a cenu
              </Tlacidlo>
              <Tlacidlo variant="tichy" tmava to="/sluzby">
                Všetky služby
              </Tlacidlo>
            </div>
          }
        />
      </Sekcia>
    </>
  )
}
