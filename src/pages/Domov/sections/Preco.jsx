import { Sekcia, SekciaHlavicka } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'

/**
 * Štyri argumenty, prečo firma robí veci tak, ako ich robí. Texty sú doslova
 * z `FIRMA.pristup`, nadpis je claim klienta z pôvodného webu.
 *
 * Zámerne editoriálne, nie kartové: žiadne číslované dlaždice 01/02/03 a
 * žiadne orámované boxy (STANDARDY B1, B6). Argument drží pohromade vlasová
 * linka nad ním a odsadenie, nie rám. Ľavé hrany oboch stĺpcov sedia na
 * mriežke sekcie.
 *
 * Od 1024 px je každý argument `subgrid`: názov a popis nesedia vo vlastnom
 * boxe, ale v spoločných riadkoch mriežky sekcie. Bez toho dvojriadkový názov
 * („Bez búracích prác a ťažkých mechanizmov“) zatlačil svoj popis o 29 px
 * nižšie než popis vedľajšieho stĺpca a prvý riadok mriežky sa rozišiel.
 * `subgrid` je tu lepší než pevná `min-height` názvu: druhý riadok mriežky
 * má oba názvy jednoriadkové a nedostane prázdne miesto navyše.
 * Medzery riadkov si položka prepisuje na nulu (`gap-y-0`), lebo zdedená
 * `gap-y-12` sekcie by sa vsunula medzi názov a popis; ich odstup drží `mt-4`.
 */
export default function Preco() {
  return (
    <Sekcia id="preco" pasmo="siva">
      <SekciaHlavicka stitok="Prečo Cestné prvky" nadpis={FIRMA.claim} perex={FIRMA.uvod[2]} />

      <Stagger
        staggerChildren={0.07}
        className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-2"
      >
        {FIRMA.pristup.map((argument) => (
          <StaggerItem
            key={argument.nazov}
            className="border-t border-[var(--color-border)] pt-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-y-0"
          >
            <h3 className="max-w-[24ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              {argument.nazov}
            </h3>
            <p className="mt-4 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {argument.popis}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Sekcia>
  )
}
