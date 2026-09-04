import { Sekcia } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import HlavickaPasma from '../HlavickaPasma.jsx'

/**
 * Materiály a značky — tmavé pásmo, materiálový list.
 *
 * ## Prečo tu nie je fotografia
 *
 * Ku každej z piatich značiek by sa dala priradiť fotka, ale všetky tri,
 * ktoré prichádzajú do úvahy (vodorovné značenie, obrubník, retardéry), už
 * na tejto stránke raz stoja — v triptychu technológií, kde dokladajú
 * postup. Zopakovať ich tu by nebol dôkaz, len výplň (KOMPOZÍCIA §2 hovorí,
 * že rytmus musí robiť obsah; robí ho tu **útvar** — technický list, nie
 * ďalší odsek).
 *
 * ## Zástupné polia
 *
 * Piata položka (`Chipfill a Coldfill`) má v dátach popis vo forme
 * `[DOPLNÍ KLIENT: …]`. Na stránku nejde ani ono, ani štítok „doplní
 * klient“: pre návštevníka je to hluk o našej rozrobenosti, nie informácia
 * o materiáli. Ostane samotný názov značky, ktorý je doložený, a keď popis
 * od klienta príde do `src/content/firma.js`, objaví sa tu sám.
 *
 * Vety už prešli slovenskou sadzbou v dátach, takže po jednopísmenových
 * predložkách nesú nezlomiteľnú medzeru. Preto sa tu čistí len obyčajná
 * medzera a tabulátor — `\s+` ani `trim()` by NBSP zrovnali a sadzba by sa
 * stratila.
 */
const ZASTUPNY_TEXT = /\s*\[\s*DOPLNÍ KLIENT\s*:?\s*[\s\S]*?\]\s*/

const bezZastupnehoTextu = (text) => {
  const zdroj = text || ''
  if (!ZASTUPNY_TEXT.test(zdroj)) return zdroj
  return zdroj.replace(ZASTUPNY_TEXT, ' ').replace(/^[ \t]+|[ \t]+$/g, '')
}

/** Vlasová linka na tmavom pásme: biela s nízkou alfou, nie sivá z tokenov. */
const JEMNA_LINKA = { borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)' }

export default function Materialy() {
  return (
    <Sekcia id="materialy" pasmo="tmava">
      <HlavickaPasma
        tmava
        stitok="Materiály"
        nadpis="Značky, s ktorými pracujeme"
        /* Záverečná veta výpočtu technológií patrí sem, k značkám, nie za
           zoznam postupov: hovorí o dodávateľoch materiálu, nie o postupe. */
        text={FIRMA.technologie.zaver}
        sirkaNadpisu="max-w-[16ch]"
      />

      {/* `dt` a `dd` musia byť priamymi deťmi `dl` alebo jedného `div`-u
          v ňom; hlbšie vnorenie by bolo neplatné HTML. Preto je nosičom
          sekvencie `div` (StaggerItem), nie ďalšia obálka. */}
      <Stagger as="dl" className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 lg:mt-20 lg:grid-cols-2" krok={80}>
        {FIRMA.znacky.map((znacka) => {
          const doloziene = bezZastupnehoTextu(znacka.popis)
          return (
            <StaggerItem key={znacka.nazov} className="border-t pt-6" style={JEMNA_LINKA}>
              <dt className="max-w-[24ch] font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-medium leading-[1.25] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
                {znacka.nazov}
              </dt>
              {doloziene ? (
                <dd className="mt-4 max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
                  {doloziene}
                </dd>
              ) : null}
            </StaggerItem>
          )
        })}
      </Stagger>
    </Sekcia>
  )
}
