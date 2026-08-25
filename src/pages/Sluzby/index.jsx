import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Sekcia, SekciaHlavicka, StranHlavicka, Tlacidlo } from '../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../components/primitives/index.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import { SKUPINY, sluzbyPodlaSkupiny } from '../../content/sluzby.js'
import { FIRMA, PROCES } from '../../content/firma.js'
import KartaSluzby from './KartaSluzby.jsx'

const META = routaPodlaCesty('/sluzby')

/** Striedanie pásiem podľa KOMPOZICIA.md: biela → sivá → biela, potom tmavé CTA. */
const PASMA = ['biela', 'siva', 'biela']

/**
 * Prehľad služieb. Deväť služieb v troch celkoch, každý celok jedno pásmo a
 * v ňom tri karty. Žiadne poradové čísla a žiadne tiene: hierarchiu robí
 * veľkosť písma a vlasový rám, ktorý sa pri hoveri prekreslí do akcentu.
 */
export default function Sluzby() {
  return (
    <>
      <Seo title={META?.title} description={META?.description} />

      <StranHlavicka stitok="Služby" nadpis="Prvky pozemných komunikácií" perex={META?.description} />

      {SKUPINY.map((skupina, i) => (
        <Sekcia key={skupina.id} id={skupina.id} pasmo={PASMA[i]}>
          <SekciaHlavicka nadpis={skupina.nazov} perex={skupina.popis} />
          <Stagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.07}>
            {sluzbyPodlaSkupiny(skupina.id).map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <KartaSluzby sluzba={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </Sekcia>
      ))}

      <Sekcia pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Obhliadka"
          nadpis={FIRMA.claim}
          perex={PROCES[0].popis}
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
