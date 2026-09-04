import { GALERIA } from '../../content/realizacie.js'
import { castiPopisu } from '../Realizacie/skupiny.js'
import { FIRMA } from '../../content/firma.js'

/**
 * Doložené zábery pre stránku „O firme“ — na jednom mieste, nie rozsypané
 * po sekciách.
 *
 * Pravidlo priradenia je doslovné, nie kompozičné: fotka smie stáť pri
 * tvrdení iba vtedy, keď tvrdenie dokladá. Fotografia „na tému“ sa
 * nedopĺňa a prázdne miesto sa nevypĺňa (STANDARDY A3, KOMPOZÍCIA §2).
 *
 * Druhé pravidlo je, že **na stránke nestojí ten istý súbor dvakrát**.
 * Preto sú tu tri technológie so svojimi zábermi a sekcia „Prístup“ ich
 * už nemá: jej štyri tvrdenia hovoria o dôsledkoch tých istých troch
 * postupov a druhý orez tej istej scény by nebol ďalší dôkaz, len výplň.
 */

/** Záznam galérie podľa `id`, alebo `null` — preklep nesmie zhodiť stránku. */
export const zaber = (id) => GALERIA.find((r) => r.id === id) || null

/**
 * Popisok pod fotkou podľa jediného pravidla webu (`Realizacie/skupiny.js`):
 * typ prvku, potom miesto (len keď je doložené) a prostredie.
 */
export const popisZaberu = (r) => [r.prvok, ...castiPopisu(r)].filter(Boolean).join(' · ')

/**
 * Tri technológie z `FIRMA.technologie.polozky` a ku každej presne tá
 * realizácia, ktorá ju dokladá:
 *
 *  • stierkovanie studeným plastom — záber vodorovného značenia,
 *  • lepenie nízkych obrubníkov — lepený obrubník na hotovom asfaltovom
 *    kryte (Medený Hámor),
 *  • osádzanie retardérov DEBUZ® — osadené spomaľovače Kölner Teller.
 *
 * `filter` chráni pred tým, aby preklep v `id` alebo doplnenie štvrtej
 * položky do dát urobili prázdny stĺpec.
 */
export const TECHNOLOGIE = [
  { nazov: FIRMA.technologie.polozky[0], foto: zaber('vodorovne-znacenie-komunikacia') },
  { nazov: FIRMA.technologie.polozky[1], foto: zaber('medeny-hamor-obrubnik') },
  { nazov: FIRMA.technologie.polozky[2], foto: zaber('retardery-dvojrad') },
].filter((t) => t.nazov && t.foto)
