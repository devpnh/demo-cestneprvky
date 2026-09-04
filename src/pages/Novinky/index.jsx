import { Link } from 'react-router-dom'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Podstranka, Sekcia, SekciaHlavicka, Tlacidlo } from '../../components/kit/index.js'
import { Reveal } from '../../components/primitives/index.js'
import { FIRMA, PROCES } from '../../content/firma.js'
import { SLUZBY } from '../../content/sluzby.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import Zaznam from './Zaznam.jsx'

const META = routaPodlaCesty('/novinky')

/**
 * Novinky — samostatná podstránka, štvrtá položka hlavnej navigácie.
 *
 * ## Prečo vlastná stránka a nie sekcia na „O firme“ (4. 9. 2026)
 *
 * Pôvodný web mal `Novinky` ako samostatnú položku v menu
 * (`https://www.cestneprvky.sk/novinky/`, výpis WordPress príspevkov) a
 * pätička ho opakovala vo vlastnom stĺpci. Pri prerábke
 * skončil jediný článok ako predposledné pásmo `O firme`, kde ho nikto
 * nehľadal: tá stránka odpovedá na otázku „kto ste a ako pracujete“ a výpis
 * článkov na ňu neodpovedá. Presunom sa `O firme` zbavila pásma, ktoré k jej
 * téme nepatrilo, a novinky dostali adresu, ktorá sa dá poslať.
 *
 * ## Jedno pásmo, a to je celá stránka (pokyn Petra, 4. 9. 2026)
 *
 * Stránka je zámerne krátka: **iba výpis, nič viac**. Skúšali sme pod výpis
 * pridať pásmo súvisiacej služby (lepené obrubníky k článku o ostrovčekoch)
 * a Peter to vrátil — na stránke s novinkami majú byť novinky, nie prílepok,
 * ktorý dopĺňa dĺžku. Kto chce službu, má ju v menu aj v odkaze pod titulkom.
 *
 * V podkladoch je **jeden** článok a máme z neho len titulok a rok — telo,
 * adresu ani názov média pôvodný web neuvádza (`FIRMA.aktuality`, handover
 * bod 18). Nič sa nedopĺňa: žiadne vymyslené príspevky, žiadne „pripravujeme“
 * a žiadny mŕtvy odkaz na titulku. Výpis je pripravený na `n` položiek, takže
 * keď klient články dodá, pribudnú riadky a nie nová skladba.
 *
 * Rytmus: tmavá hlavička → biela (výpis) → biela `PasVyzvy` → tmavá pätička.
 * Nikdy dve tmavé za sebou (STANDARDY B5).
 */

/**
 * Odkaz na súvisiacu službu pod titulkom. Je to jediný preklik v riadku,
 * keď článok nemá `url` — a je náš, takže ho vieme zaručiť. Väzba je v dátach
 * (`FIRMA.aktuality[].sluzba`), nie tu; bez nej sa riadok vykreslí bez odkazu.
 */
function OdkazNaSluzbu({ slug }) {
  const sluzba = SLUZBY.find((s) => s.slug === slug)
  if (!sluzba) return null
  return (
    <p className="mt-5 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
      Súvisiaca služba{' '}
      <Link
        to={`/sluzby/${sluzba.slug}`}
        className="text-[var(--color-text)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent)]"
      >
        {sluzba.nazovKratky || sluzba.nazov}
      </Link>
    </p>
  )
}

export default function Novinky() {
  const clanky = FIRMA.aktuality || []

  return (
    <Podstranka
      meta={META}
      stitok="Novinky"
      nadpis="Čo sa u nás udialo"
      /* Výzva — rovnaká ako na „O firme“: text prvého kroku z `PROCES`. */
      vyzva={{
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
      <Sekcia id="vypis" pasmo="biela">
        {/* Bez perexu. Veta o tom, že máme jeden článok a nedopĺňame telo,
            je poznámka pre klienta, nie pre návštevníka — ten vidí, koľko
            položiek vo výpise je, a vysvetľovať mu to je ospravedlňovanie sa
            (pokyn Petra, 4. 9. 2026). Hlavička je tým jednostĺpcová. */}
        <SekciaHlavicka stitok="Výpis" nadpis="Písali o nás" sirkaNadpisu="max-w-[14ch]" />

        {clanky.length ? (
          <Reveal className="mt-14 lg:mt-20">
            <ul>
              {clanky.map((clanok) => (
                <Zaznam
                  key={clanok.titulok}
                  clanok={clanok}
                  odkaz={clanok.sluzba ? <OdkazNaSluzbu slug={clanok.sluzba} /> : null}
                />
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Sekcia>
    </Podstranka>
  )
}
