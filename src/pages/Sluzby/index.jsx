import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Sekcia, SekciaHlavicka, StranHlavicka, Tlacidlo } from '../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../components/primitives/index.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import { SKUPINY, sluzbyPodlaSkupiny } from '../../content/sluzby.js'
import { PROCES } from '../../content/firma.js'
import KartaSluzby from './KartaSluzby.jsx'

const META = routaPodlaCesty('/sluzby')

/** Striedanie pásiem podľa KOMPOZICIA.md: biela → sivá → biela, potom tmavé CTA. */
const PASMA = ['biela', 'siva', 'biela']

/**
 * Prehľad služieb. Deväť služieb v troch celkoch, každý celok jedno pásmo.
 *
 * Celky nemajú rovnakú sadzbu zámerne. Prvý celok stojí na nosnej službe
 * firmy — dostáva kartu cez dva stĺpce s fotkou 16:9 a druhým odstavcom
 * textu, zvyšné dve služby celku stoja pod sebou v treťom stĺpci. Druhý a
 * tretí celok sú bez rámu: fotka, vlasová linka, text. Tri identické riadky
 * orámovaných kariet za sebou kontrola vracia (STANDARDY B6) a hierarchiu tu
 * aj tak robí veľkosť, nie rám.
 */
export default function Sluzby() {
  return (
    <>
      <Seo title={META?.title} description={META?.description} />

      <StranHlavicka stitok="Služby" nadpis="Prvky pozemných komunikácií" perex={META?.description} />

      {SKUPINY.map((skupina, i) => {
        const sluzby = sluzbyPodlaSkupiny(skupina.id)
        const prvyCelok = i === 0
        const [nosna, ...zvysne] = sluzby

        return (
          <Sekcia key={skupina.id} id={skupina.id} pasmo={PASMA[i]}>
            <SekciaHlavicka nadpis={skupina.nazov} perex={skupina.popis} />

            {prvyCelok ? (
              <Stagger className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12" staggerChildren={0.07}>
                <StaggerItem className="lg:col-span-8">
                  <KartaSluzby sluzba={nosna} variant="nosna" />
                </StaggerItem>
                {/* Na tablete stoja obe úzke karty vedľa seba, na `lg` pod
                    sebou v treťom stĺpci vedľa nosnej karty. */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
                  {zvysne.map((s) => (
                    <StaggerItem key={s.slug} className="h-full">
                      <KartaSluzby sluzba={s} variant="strucna" />
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            ) : (
              <Stagger className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.07}>
                {sluzby.map((s) => (
                  <StaggerItem key={s.slug} className="h-full">
                    <KartaSluzby sluzba={s} variant="holy" />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </Sekcia>
        )
      })}

      {/* CTA. Nadpisom bol claim firmy, ktorý takto stál na dvanástich
          stránkach zo štrnástich a zoslabol na výplň; ostáva na Domove, kde
          patrí. Perex je druhý krok procesu: prvý sa začína „Napíšete nám…“
          a vedľa tohto nadpisu znel ako zajakávanie. */}
      <Sekcia pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Obhliadka"
          nadpis="Napíšte nám, čo potrebujete osadiť"
          perex={PROCES[1].popis}
          akcia={
            <Tlacidlo variant="primar" onClick={() => openObhliadka()}>
              Dohodnúť obhliadku a cenu
            </Tlacidlo>
          }
        />
      </Sekcia>
    </>
  )
}
