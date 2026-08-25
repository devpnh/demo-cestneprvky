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

/**
 * Malý orez a veľká fotka tej istej scény sú v dátach previazané cez
 * `duplikatOf`. Galéria služby preto pracuje s kľúčom scény, nie so súborom:
 * inak by pod hlavnou fotkou visela ešte raz tá istá scéna v dlaždicovom oreze.
 */
const KLUC_SCENY = new Map(REALIZACIE.map((r) => [r.src, r.duplikatOf || r.src]))
const scena = (src) => KLUC_SCENY.get(src) || src

/** Fotky služby a jej realizácie bez duplicít a bez tej, ktorá je už v úvode. */
function galeriaSluzby(sluzba, maxPocet = 6) {
  const uvodna = sluzba.fotky?.[0]
  const videne = new Set(uvodna ? [scena(uvodna.src)] : [])
  const vysledok = []
  const pridaj = (f) => {
    const kluc = scena(f.src)
    if (videne.has(kluc)) return
    videne.add(kluc)
    vysledok.push(f)
  }
  ;(sluzba.fotky || []).slice(1).forEach(pridaj)
  realizaciePodlaSluzby(sluzba.slug).forEach(pridaj)
  return vysledok.slice(0, maxPocet)
}

/** Popisok fotky: typ prvku, kde ho poznáme, a miesto (neisté miesto už dáta prepísali). */
const popisFotky = (f) => (f.prvok ? `${f.prvok} · ${f.miesto}` : f.miesto)

/**
 * Fotku nikdy neroztiahneme viac ako 1,4× nad jej skutočnú šírku. Podklady od
 * klienta majú od 416 do 1600 px a mäkká, prefúknutá fotka na celý stĺpec
 * vyzerá lacno; radšej ostane menšia (STANDARDY F2: rozlíšenie sa neznižuje
 * a ani nepredstiera).
 */
const maxSirka = (f) => `${Math.round(f.w * 1.4)}px`

/** Rámovaná mono poznámka o tom, čo od klienta ešte potrebujeme. */
function DoplniKlient({ polozky, className = '' }) {
  return (
    <div
      className={`border border-[var(--color-border)] p-5 sm:p-6 ${className}`}
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <MonoStitok>Doplní klient</MonoStitok>
      <ul className="mt-4">
        {polozky.map((c) => (
          <li
            key={c.slice(0, 40)}
            className="border-t border-[var(--color-border)] py-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] leading-[var(--leading-normal)] text-[var(--color-muted)] first:border-t-0 first:pt-1"
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Šablóna deviatich stránok služieb. Bohatosť stránky určujú dáta, nie
 * šablóna: služby s plným textom z pôvodného webu majú odseky, zoznamy,
 * výhody, technickú tabuľku aj návod, ostatné majú hlavičku, fotku, blok
 * „Doplní klient“, súvisiace služby a CTA. Prázdne miesto sa nevypĺňa vatou
 * a nedopĺňa sa žiadny parameter, materiál ani norma, ktoré v dátach nie sú.
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

  const uvodnaFotka = sluzba.fotky?.[0]
  const maOdseky = Array.isArray(sluzba.odseky) && sluzba.odseky.length > 0
  const galeria = galeriaSluzby(sluzba)
  const maPartner = Boolean(sluzba.partner || (sluzba.normy && sluzba.normy.length))
  const pasmoGalerie = maPartner ? 'biela' : 'tmava'
  const suvisiace = (sluzba.suvisiace || []).map(sluzbaPodlaSlugu).filter(Boolean)
  // Služby bez plného textu majú v úvodnom pásme voľný stĺpec vedľa fotky.
  // Poznámka „Doplní klient“ ide rovno doň: inak by za fotkou nasledovalo
  // takmer prázdne pásmo a stránka by pôsobila ako nedorobená šablóna.
  const chybaVUvode = !maOdseky && Boolean(sluzba.chyba?.length)

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

      {/* 1. Úvod: text z originálu a hlavná fotka. Bez odsekov ostáva fotka
          sama, perex sa neopakuje, stojí o pár centimetrov vyššie v hlavičke. */}
      <Sekcia pasmo="biela">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          {maOdseky ? (
            <>
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
                  <div style={{ maxWidth: maxSirka(uvodnaFotka) }}>
                    <Fotka
                      src={uvodnaFotka.src}
                      w={uvodnaFotka.w}
                      h={uvodnaFotka.h}
                      alt={uvodnaFotka.alt}
                      popis={uvodnaFotka.miesto}
                      priorita
                    />
                  </div>
                </Reveal>
              ) : null}
            </>
          ) : (
            <>
              {uvodnaFotka ? (
                <Reveal className="lg:col-span-7">
                  <div style={{ maxWidth: maxSirka(uvodnaFotka) }}>
                    <Fotka
                      src={uvodnaFotka.src}
                      w={uvodnaFotka.w}
                      h={uvodnaFotka.h}
                      alt={uvodnaFotka.alt}
                      popis={uvodnaFotka.miesto}
                      priorita
                    />
                  </div>
                </Reveal>
              ) : null}
              {sluzba.znacky?.length || chybaVUvode ? (
                <Reveal className="lg:col-span-5">
                  {sluzba.znacky?.length ? (
                    <div className="border-t border-[var(--color-border)] pt-5">
                      <MonoStitok>Materiály</MonoStitok>
                      <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                        {sluzba.znacky.join(' · ')}
                      </p>
                    </div>
                  ) : null}
                  {chybaVUvode ? (
                    <DoplniKlient polozky={sluzba.chyba} className={sluzba.znacky?.length ? 'mt-8' : ''} />
                  ) : null}
                </Reveal>
              ) : null}
            </>
          )}
        </div>
      </Sekcia>

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

      {/* 4. Technický list: tabuľka a návod na inštaláciu (len retardéry). */}
      {sluzba.tabulka || sluzba.navod ? (
        <Sekcia pasmo="biela">
          {sluzba.tabulka ? (
            <>
              <SekciaHlavicka stitok="Technický popis" nadpis={sluzba.tabulka.titulok} sirkaNadpisu="max-w-[24ch]" />
              <Reveal className="mt-12">
                <div
                  className="max-w-[46rem] border border-[var(--color-border)] p-5 sm:p-8"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <TabulkaDebuz tabulka={sluzba.tabulka} />
                </div>
              </Reveal>
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
                    <span className="mt-[0.35em] shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] tabular-nums text-[var(--color-accent)]">
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

      {/* 5. Vyhlášky a partner: tmavé pásmo, mono na predpisy. */}
      {maPartner ? (
        <Sekcia pasmo="tmava">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <MonoStitok tmava>Konzultácie a predpisy</MonoStitok>
              {sluzba.partner ? (
                <>
                  <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
                    {sluzba.partner.nazov}
                  </h2>
                  <p className="mt-6 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
                    {sluzba.partner.popis}
                  </p>
                  <Tlacidlo
                    variant="sekundar"
                    tmava
                    href={sluzba.partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Otvoriť architektonickebariery.sk v novom okne"
                    className="mt-9"
                  >
                    architektonickebariery.sk
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
                  alt={f.alt}
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
      {sluzba.chyba?.length && !chybaVUvode ? (
        <Sekcia pasmo="siva" padding="male">
          <Reveal>
            <DoplniKlient polozky={sluzba.chyba} className="max-w-[72ch] bg-[var(--color-bg)]" />
          </Reveal>
        </Sekcia>
      ) : null}

      {/* 8. Súvisiace služby: tie isté karty ako v prehľade. */}
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
          <Stagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.07}>
            {suvisiace.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <KartaSluzby sluzba={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ) : null}

      {/* 9. CTA: dialóg si predvyplní typ prvku názvom tejto služby. */}
      <Sekcia pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Obhliadka"
          nadpis={FIRMA.claim}
          perex={PROCES[0].popis}
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
