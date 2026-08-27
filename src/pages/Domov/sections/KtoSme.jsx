import { Cislo, Sekcia, SekciaHlavicka, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import { SLUZBY } from '../../../content/sluzby.js'
import { MIESTA_REALIZACII, TYPY_PRVKOV } from '../../../content/realizacie.js'
import GLOBAL from '../../../content/global.json'

/**
 * Prvé pásmo pod hero: kto sme a čo robíme.
 *
 * Zadanie (Peter, 27. 8. 2026): „hneď pod hero by malo byť skôr kto sme, čo
 * sme, a nejako to zaujať návštevníka niečím zaujímavým“.
 *
 * Hero hovorí, ČO firma osádza. Toto pásmo hovorí, KTO to osádza: značka,
 * rok založenia, sídlo a rozsah pôsobenia. Nie je to druhý perex — je to
 * identita a čísla, ktoré sa dajú overiť.
 *
 * ## Čo má zaujať
 *
 * Tri čísla vysadené najväčším rezom stránky, ktoré si pri vstupe do
 * viewportu **dopočítajú svoju hodnotu**. Sú to jediné počítadlá na webe a
 * všetky tri sa rátajú z dát (`SLUZBY`, `TYPY_PRVKOV`, `MIESTA_REALIZACII`),
 * takže nemôže vzniknúť číslo, ktoré by na webe nesedelo s obsahom (A3).
 *
 * Pod nimi stoja štyri tvrdenia firmy — len nadpisy, bez odsekov. Celé
 * znenie je na `/o-firme`, kam odtiaľto vedie odkaz.
 *
 * ## Čo tu bolo predtým
 *
 * Pásmo „Prečo Cestné prvky“ s claimom „Šetríme váš čas aj peniaze“. Bolo
 * to tvrdenie o prínose ešte predtým, než sa návštevník dozvedel, s kým má
 * do činenia. Claim ostáva firme, prínosy sú v štyroch tvrdeniach nižšie.
 *
 * Celoplošný záber, ktorý tu stál, sa osamostatnil do `PasOddelovac` a
 * stojí hneď pod týmto pásmom ako predel — tak si ho Peter vypýtal.
 */

/**
 * Tri čísla o rozsahu práce. Rátajú sa z dát, nevypisujú sa ručne.
 * Rok založenia medzi nimi zámerne nie je: dopočítavať sa k letopočtu od
 * nuly je nezmysel a ako jediné nepočítané číslo by v rade rušil. Rok je
 * v perexe pásma, kde aj patrí.
 */
const CISLA = [
  { hodnota: SLUZBY.length, popis: 'služieb v troch celkoch' },
  { hodnota: TYPY_PRVKOV.length, popis: 'typov prvkov v galérii' },
  { hodnota: MIESTA_REALIZACII.length, popis: 'miest realizácií na Slovensku' },
]

export default function KtoSme() {
  return (
    <Sekcia id="kto-sme" pasmo="biela">
      <SekciaHlavicka
        stitok="Kto sme"
        nadpis={GLOBAL.brand.tagline}
        perex={FIRMA.uvod[0]}
        sirkaNadpisu="max-w-[16ch]"
        className="[&_h2]:text-[length:var(--text-5xl)]"
      />

      {/* Čísla stoja na vlasovej mriežke, nie v orámovaných dlaždiciach:
          hierarchiu tu robí veľkosť, nie rám (STANDARDY B6). */}
      <Stagger className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-3 lg:mt-20">
        {CISLA.map((c) => (
          <StaggerItem key={c.popis} className="border-t border-[var(--color-border)] pt-6">
            <Cislo hodnota={c.hodnota} popis={c.popis} />
          </StaggerItem>
        ))}
      </Stagger>

      <Stagger className="mt-16 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {FIRMA.pristup.map((argument) => (
          <StaggerItem key={argument.nazov} className="border-t border-[var(--color-border)] pt-5">
            <h3 className="max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              {argument.nazov}
            </h3>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-14 lg:mt-16">
        <Tlacidlo variant="tichy" to="/o-firme">
          Ako pracujeme
        </Tlacidlo>
      </Reveal>
    </Sekcia>
  )
}
