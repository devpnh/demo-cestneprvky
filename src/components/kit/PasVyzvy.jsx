import ZnacenieMotiv from './ZnacenieMotiv.jsx'
import SekciaHlavicka from './SekciaHlavicka.jsx'

/**
 * Záverečný pás výzvy. Každá podstránka ho má a každá ho má rovnaký — je to
 * posledné pásmo pred pätičkou, tmavé, so značkovacím motívom v pozadí.
 *
 * Predtým si ho každá stránka skladala sama z `Sekcia` + `SekciaHlavicka` a
 * líšili sa len texty; rovnaká skladba na piatich miestach je presne to, čo
 * zo stránok robí variácie jedného generovaného bloku. Tu je jedna
 * definícia, ktorú stránka plní obsahom.
 *
 * **Je svetlý, hoci výzva býva tmavá.** Dôvod je rytmus: pod ním stojí tmavá
 * pätička s červeným oparom (pokyn Petra, 27. 8. 2026) a dve tmavé plochy za
 * sebou sú zakázané (STANDARDY B5). Dôraz preto nesie veľkosť titulu a
 * červené tlačidlo, nie farba plochy — a tmavá pätička hneď pod ním je
 * posledný akord stránky.
 */
export default function PasVyzvy({ stitok = 'Obhliadka', nadpis, perex, akcia = null }) {
  return (
    <section
      data-pasmo="biela"
      className="relative isolate overflow-hidden bg-[var(--color-bg)] py-[var(--section-padding-y)] text-[var(--color-text)]"
    >
      <ZnacenieMotiv svetle krytie={0.9} />
      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <SekciaHlavicka stitok={stitok} nadpis={nadpis} perex={perex} akcia={akcia} />
      </div>
    </section>
  )
}
