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
 */
export default function PasVyzvy({ stitok = 'Obhliadka', nadpis, perex, akcia = null }) {
  return (
    <section data-pasmo="tmava" className="relative isolate overflow-hidden bg-[var(--color-surface-2)] py-[var(--section-padding-y)] text-[var(--color-bg)]">
      <ZnacenieMotiv krytie={0.9} />
      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <SekciaHlavicka tmava stitok={stitok} nadpis={nadpis} perex={perex} akcia={akcia} />
      </div>
    </section>
  )
}
