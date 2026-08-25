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
import { sluzbaPodlaSlugu } from '../../content/sluzby.js'
import { REALIZACIE, realizaciePodlaSluzby } from '../../content/realizacie.js'
import { FIRMA, PROCES } from '../../content/firma.js'
import KartaSluzby from './KartaSluzby.jsx'
import TabulkaDebuz from './TabulkaDebuz.jsx'
import ZoznamPodkladov, { HlavickaPodkladov } from './Podklady.jsx'
import { altFotky, maxSirka, uvodnaFotkaSluzby } from './fotky.js'

/**
 * Malý orez a veľká fotka tej istej scény sú v dátach previazané cez
 * `duplikatOf`. Galéria služby preto pracuje s kľúčom scény, nie so súborom:
 * inak by pod hlavnou fotkou visela ešte raz tá istá scéna v dlaždicovom oreze.
 */
const KLUC_SCENY = new Map(REALIZACIE.map((r) => [r.src, r.duplikatOf || r.src]))
const scena = (src) => KLUC_SCENY.get(src) || src

/** Fotky služby a jej realizácie bez duplicít a bez tej, ktorá je už v úvode. */
function galeriaSluzby(sluzba, uvodna, maxPocet = 6) {
  const videne = new Set(uvodna ? [scena(uvodna.src)] : [])
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

/** Popisok fotky: typ prvku, kde ho poznáme, a miesto (neisté miesto už dáta prepísali). */
const popisFotky = (f) => (f.prvok ? `${f.prvok} · ${f.miesto}` : f.miesto)

/**
 * Šablóna deviatich stránok služieb. Bohatosť stránky určujú dáta, nie
 * šablóna: služby s plným textom z pôvodného webu majú odseky, zoznamy,
 * výhody, technickú tabuľku aj návod. Nedopĺňa sa žiadny parameter, materiál
 * ani norma, ktoré v dátach nie sú.
 *
 * Služby bez plného textu majú vlastnú kompozíciu úvodného pásma. Kým mali tú
 * istú ako bohaté (text vľavo, fotka vpravo), ostal z pásma na `/sluzby/
 * cyklotrasy` prázdny stĺpec vysoký 398 px a celá stránka pôsobila ako
 * nedorobená šablóna. Teraz je úvod jeden riadok: široký záber 21:9 vľavo,
 * zoznam „Čo k tejto službe dopĺňa klient“ vpravo. Prázdne miesto sa
 * nevypĺňa vatou, mení sa rozloženie tých istých prvkov.
 *
 * Rytmus pásiem drží KOMPOZICIA.md; dve tmavé za sebou sú zakázané, preto
 * galéria ustúpi na bielu tam, kde pred ňou stojí tmavé pásmo s vyhláškami.
 */
export default function SluzbaDetail() {
  const { slug } = useParams()
  const sluzba = sluzbaPodlaSlugu(slug)

  // Neexistujúci slug renderuje tú istú 404 ako `*`, takže stránka má stále
  // presne jeden H1 a používateľ dostane rovnaké východiská.
  if (!sluzba) return <NotFound />

  const uvodnaFotka = uvodnaFotkaSluzby(sluzba)
  const maOdseky = Array.isArray(sluzba.odseky) && sluzba.odseky.length > 0
  const galeria = galeriaSluzby(sluzba, uvodnaFotka)
  // Únia nevidiacich a slabozrakých Slovenska je miesto, kam sa chodí po
  // konzultáciu a stanovisko. Pôvodný web na ňu len odkazuje a nič spoločné
  // s ňou netvrdí; dáta preto pole volajú `konzultacie` a nesú aj jeho
  // vlastný štítok, ktorý stránka preberá namiesto vlastného nadpisu.
  const konzultacie = sluzba.konzultacie
  const maKonzultacie = Boolean(konzultacie || (sluzba.normy && sluzba.normy.length))
  const pasmoGalerie = maKonzultacie ? 'biela' : 'tmava'
  const suvisiace = (sluzba.suvisiace || []).map(sluzbaPodlaSlugu).filter(Boolean)
  const maPodklady = Boolean(sluzba.chyba?.length)
  // Pri chudobných službách stojí zoznam podkladov rovno v úvodnom pásme.
  // Samostatné sivé pásmo len s ním by bolo takmer prázdne.
  const podkladyVUvode = !maOdseky && maPodklady

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
        <Sekcia pasmo="biela">
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
                    popis={uvodnaFotka.miesto}
                    pomer={uvodnaFotka.h > uvodnaFotka.w * 1.34 ? '3/4' : null}
                    priorita
                  />
                </div>
              </Reveal>
            ) : null}
          </div>
        </Sekcia>
      ) : (
        <Sekcia pasmo="biela" padding="male">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            {uvodnaFotka ? (
              <Reveal className="lg:col-span-7">
                {/* Široký orez namiesto celého záberu: úvodné pásmo tak drží
                    výšku pod 620 px aj na stránke, ktorá má okrem fotky a
                    zoznamu podkladov už len hlavičku. */}
                <div style={{ maxWidth: maxSirka(uvodnaFotka) }}>
                  <Fotka
                    src={uvodnaFotka.src}
                    w={uvodnaFotka.w}
                    h={uvodnaFotka.h}
                    alt={altFotky(uvodnaFotka)}
                    popis={uvodnaFotka.miesto}
                    pomer="21/9"
                    priorita
                  />
                </div>
                {sluzba.znacky?.length ? (
                  <div className="mt-10 border-t border-[var(--color-border)] pt-5">
                    <MonoStitok>Materiály</MonoStitok>
                    <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                      {sluzba.znacky.join(' · ')}
                    </p>
                  </div>
                ) : null}
              </Reveal>
            ) : null}

            {podkladyVUvode ? (
              <Reveal className="lg:col-span-5">
                <HlavickaPodkladov />
                <ZoznamPodkladov polozky={sluzba.chyba} className="mt-6" />
              </Reveal>
            ) : null}
          </div>
        </Sekcia>
      )}

      {/* 2. Zoznamy podkategórií: stĺpce s vlasovou linkou, položky pod sebou. */}
      {sluzba.zoznamy?.length ? (
        <Sekcia pasmo="siva">
          <SekciaHlavicka stitok="Rozsah" nadpis="Čo služba zahŕňa" />
          {/* Aj jediný zoznam ostáva v polovičnom stĺpci: cez celú šírku
              kontajnera by z položiek boli nečitateľne dlhé riadky. */}
          <Stagger className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12" staggerChildren={0.07}>
            {sluzba.zoznamy.map((z) => (
              <StaggerItem key={z.titulok}>
                <h3 className="border-t border-[var(--color-text)] pt-5 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                  {z.titulok}
                </h3>
                <ul className="mt-6">
                  {z.polozky.map((p) => (
                    <li
                      key={p}
                      className="border-b border-[var(--color-border)] py-4 font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-text)]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ) : null}

      {/* 3. Výhody: len tam, kde ich pôvodný web uvádzal (retardéry). */}
      {sluzba.vyhody?.length ? (
        <Sekcia pasmo="biela">
          <SekciaHlavicka
            stitok="Výhody"
            nadpis={sluzba.znacky?.length ? `Výhody ${sluzba.znacky[0]}` : 'Výhody riešenia'}
          />
          <Stagger className="mt-12 grid grid-cols-1 gap-x-16 gap-y-1 lg:grid-cols-2" staggerChildren={0.06}>
            {sluzba.vyhody.map((v) => (
              <StaggerItem key={v} as="div">
                {/* `h-full`: bez neho končí vlasová linka krátkej výhody hore
                    v riadku a linka dlhej výhody dole, a mriežka sa rozstrapká. */}
                <p className="flex h-full gap-4 border-b border-[var(--color-border)] py-5 font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                  <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-4 shrink-0 bg-[var(--color-accent)]" />
                  <span className="max-w-[52ch]">{v}</span>
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ) : null}

      {/* 4. Technický list: tabuľka a návod na inštaláciu (len retardéry).
          Tabuľka drží osem stĺpcov mriežky a vysvetlivka k hviezdičke stojí
          ako marginálie vo voľnom stĺpci — pod tabuľkou visela a pravá
          polovica pásma ostávala prázdna. */}
      {sluzba.tabulka || sluzba.navod ? (
        <Sekcia pasmo="biela">
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

            {sluzba.normy?.length ? (
              <Reveal className="lg:col-span-5 lg:ml-auto">
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
              </Reveal>
            ) : null}
          </div>
        </Sekcia>
      ) : null}

      {/* 6. Galéria služby. Popisy sú pravdivé: miesto uvádzame len tam, kde ho dáta potvrdzujú. */}
      {galeria.length ? (
        <Sekcia pasmo={pasmoGalerie}>
          <SekciaHlavicka
            tmava={pasmoGalerie === 'tmava'}
            stitok="Galéria"
            nadpis="Fotografie z realizácií"
            akcia={
              <Tlacidlo variant="tichy" tmava={pasmoGalerie === 'tmava'} to="/realizacie">
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
                  tmava={pasmoGalerie === 'tmava'}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ) : null}

      {/* 7. Čo od klienta potrebujeme. Zámerne nenápadné: je to demo a klient
          má vidieť, ktoré miesta čakajú na jeho podklady. Nič sa nepredstiera. */}
      {maPodklady && !podkladyVUvode ? (
        <Sekcia pasmo="siva" padding="male">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <HlavickaPodkladov velky />
            </Reveal>
            <Reveal className="lg:col-span-8">
              <ZoznamPodkladov polozky={sluzba.chyba} />
            </Reveal>
          </div>
        </Sekcia>
      ) : null}

      {/* 8. Súvisiace služby: karty bez rámu, aby na stránke nestáli tri
          rovnaké orámované boxy vedľa seba (STANDARDY B6). */}
      {suvisiace.length ? (
        <Sekcia pasmo="biela">
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

      {/* 9. CTA. Nadpis pomenúva túto službu, nie claim firmy: ten istý claim
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
