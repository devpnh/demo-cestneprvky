/**
 * Adaptér nad `src/content/routes.js`.
 *
 * Kontrakt v zadaní hovoril o `ROUTES`, dátový agent exportoval `ROUTY`,
 * `NAVIGACIA` a `routaPodlaCesty`. Shell (hlavička, pätička, zástupné stránky)
 * číta routy odtiaľto, takže prípadné premenovanie v dátovej vrstve sa opraví
 * na jednom mieste a nie v šiestich komponentoch naraz.
 * `src/content/*` sa nesmie meniť, vlastní ho iný agent.
 *
 * Výber cez `data[meno]`, nie cez pomenovaný import: pri pomenovanom importe
 * by rollup na chýbajúci `ROUTES` hlásil warning pri každom builde.
 */
import * as data from '../../content/routes.js'

const vyber = (...mena) => {
  for (const meno of mena) if (data[meno]) return data[meno]
  return undefined
}

/** Statické routy (bez stránok služieb a bez 404). */
export const ROUTES = vyber('ROUTES', 'ROUTY') || []

/** Presne štyri položky hlavnej navigácie. */
export const NAV = vyber('NAVIGACIA') || ROUTES.filter((r) => r.vNavigacii)

const podlaCesty = vyber('routaPodlaCesty')

/** Meta jednej routy podľa cesty: `title` a `description` pre `<Seo>`. */
export const routaPodlaCesty = podlaCesty || ((path) => ROUTES.find((r) => r.path === path))

/** Meta 404 stránky; ak ju dáta nemajú, drží ju shell sám. */
export const ROUTA_404 = vyber('ROUTA_404') || {
  title: 'Stránka sa nenašla | Cestné prvky s.r.o.',
  description: 'Túto stránku sme nenašli. Pokračujte na prehľad služieb, galériu realizácií alebo na kontakt.',
}
