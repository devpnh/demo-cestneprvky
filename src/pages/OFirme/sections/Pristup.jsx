import { Sekcia } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { CISLA_FIRMY, FIRMA } from '../../../content/firma.js'
import HlavickaPasma from '../HlavickaPasma.jsx'

/**
 * Prístup — štyri tvrdenia o tom, **čo z tých technológií plynie pre
 * objednávateľa**. Pásmo hneď za technológiami, lebo je ich dôsledkom.
 *
 * ## Prečo tu nie sú fotografie
 *
 * Tri zábery, ktoré tvrdenia dokladajú (lepený obrubník, varovný pás,
 * retardéry), stoja o pásmo vyššie pri technológiách. Tá istá fotografia
 * dvakrát na jednej stránke nie je druhý dôkaz, len opakovanie — a štvrté
 * tvrdenie doložený záber nemá vôbec.
 *
 * Nosičom pásma je preto **údaj**: „do 30 min“ je najsilnejšie číslo firmy
 * a doteraz bolo zahrabané uprostred odseku. Je z `CISLA_FIRMY`, nie
 * napísané ručne — to isté číslo nesie aj Domov.
 *
 * ## Zarovnanie
 *
 * Tvrdenia stáli predtým v stĺpci `col-span-7` s odrážkou pred textom,
 * takže ich ľavá hrana bola na 677 px — teda ani na ľavej osi stránky
 * (136), ani na pravej (752), a ani na osi perexov (855). Teraz sú to dve
 * polovice ako všade inde a **akcentová značka je nad menom, nie pred ním**:
 * text tak začína presne na osi stĺpca (dôvod v `HlavickaPasma`).
 */

/** Najsilnejší údaj firmy: „do 30 min a lepený obrubník má 100 % pevnosti“. */
const PEVNOST = CISLA_FIRMY.find((c) => c.id === 'pevnost')

/**
 * Doska s údajom. Tmavá plocha vnútri svetlého pásma, nie akcentová: biely
 * 12 px mono text na akcente má 4,05:1, teda pod limitom 4,5:1. Na tmavej
 * doske má jednotka v svetlom akcente 5,17:1 a popisok 12,6:1 (B7).
 */
function DoskaUdaja() {
  if (!PEVNOST) return null
  return (
    <div
      className="bg-[var(--color-surface-2)] p-8 lg:p-10"
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <div aria-hidden="true" className="mb-7 h-[3px] w-14 bg-[var(--color-accent)]" />
      <p
        aria-label={`${PEVNOST.predpona} ${PEVNOST.hodnota} ${PEVNOST.jednotka} ${PEVNOST.popis}`}
        className="flex items-baseline gap-[0.18em] font-[family-name:var(--font-display)] text-[length:var(--text-6xl)] font-semibold leading-none tracking-[var(--tracking-tight)] text-[var(--color-bg)]"
      >
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-body)] text-[length:var(--text-xl)] font-normal text-[rgba(255,255,255,0.72)]"
        >
          {PEVNOST.predpona}
        </span>
        <span aria-hidden="true" className="tabular-nums">
          {PEVNOST.hodnota}
        </span>
        <span aria-hidden="true" className="text-[length:var(--text-2xl)] text-[var(--color-accent-svetly)]">
          {PEVNOST.jednotka}
        </span>
      </p>
      <p
        aria-hidden="true"
        className="mt-5 max-w-[24ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[rgba(255,255,255,0.72)]"
      >
        {PEVNOST.popis}
      </p>
    </div>
  )
}

export default function Pristup() {
  return (
    <Sekcia id="pristup" pasmo="biela">
      <HlavickaPasma
        stitok="Prístup"
        nadpis="Prečo to robíme takto"
        sirkaNadpisu="max-w-[14ch]"
        aside={<DoskaUdaja />}
      />

      {/* Tvrdenia v dvoch poloviciach, text vždy viditeľný — je to stránka
          o firme a vety sa majú čítať, nie odomykať klikom. */}
      <Stagger
        as="ul"
        className="mt-16 grid grid-cols-1 gap-x-16 gap-y-10 lg:mt-20 lg:grid-cols-2"
        krok={90}
      >
        {FIRMA.pristup.map((argument) => (
          <StaggerItem as="li" key={argument.nazov} className="border-t border-[var(--color-border)] pt-6">
            <span aria-hidden="true" className="block h-[2px] w-6 bg-[var(--color-accent)]" />
            <h3 className="mt-5 max-w-[24ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              {argument.nazov}
            </h3>
            <p className="mt-4 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {argument.popis}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Sekcia>
  )
}
