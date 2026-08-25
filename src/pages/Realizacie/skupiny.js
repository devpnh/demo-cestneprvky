import { GALERIA, TYPY_PRVKOV } from '../../content/realizacie.js'

/**
 * Filtrovacie celky galérie.
 *
 * `src/content/realizacie.js` rozlišuje 14 typov prvkov, lebo tak presne je
 * fotka popísaná. Na filter je to jemnejšie delenie, než návštevník potrebuje:
 * „Vodiaca línia“ a „Vodiaca línia v priechode pre chodcov“ sú preňho jedna
 * otázka. Zoskupenie preto robíme TU, nad dátami — popisok pod fotkou aj
 * naďalej hovorí presný typ z dát, mení sa len podanie filtra.
 *
 * Názvy celkov sú slovník klienta: „Prvky vo vozovke“ je doslova skupina zo
 * `src/content/sluzby.js` a jej obsah sedí prvok po prvku. „Priechod pre
 * chodcov“ patrí k vodorovnému značeniu, lebo priechod JE vodorovné značenie.
 */
const DEFINICIA = [
  ['Vodiace línie', ['Vodiaca línia', 'Vodiaca línia v priechode pre chodcov']],
  ['Varovné a signálne pásy', ['Varovný pás', 'Signálny pás']],
  ['Nerezové a mosadzné indikátory', ['Nerezové indikátory', 'Mosadzné indikátory']],
  ['Vodorovné dopravné značenie', ['Vodorovné dopravné značenie', 'Priechod pre chodcov']],
  ['Protišmykové nátery', ['Protišmykový náter']],
  ['Prvky vo vozovke', ['Lepený obrubník', 'Spomaľovače dopravy', 'Cyklotrasa']],
  ['Zálievkové hmoty', ['Zálievková hmota']],
  ['Štítky s Braillovým písmom', ['Štítky s Braillovým písmom']],
]

// Poistka: typ pridaný do dát, ktorý tu nikto nezaradí, dostane vlastný celok.
// Bez nej by taká fotka z filtra ticho vypadla.
const POKRYTE = new Set(DEFINICIA.flatMap(([, typy]) => typy))
const NEPOKRYTE = TYPY_PRVKOV.filter((t) => !POKRYTE.has(t)).map((t) => [t, [t]])

/** Celky s počtom fotografií; prázdne celky sa nezobrazujú. */
export const SKUPINY_PRVKOV = [...DEFINICIA, ...NEPOKRYTE]
  .map(([nazov, typy]) => ({ nazov, typy, pocet: GALERIA.filter((r) => typy.includes(r.prvok)).length }))
  .filter((s) => s.pocet > 0)

export const NAZVY_SKUPIN = SKUPINY_PRVKOV.map((s) => s.nazov)

/** Celok, do ktorého patrí konkrétny typ z dát (spätná kompatibilita starých odkazov). */
export const skupinaPreTyp = (typ) => SKUPINY_PRVKOV.find((s) => s.typy.includes(typ))?.nazov ?? ''

/** Typy jedného celku, alebo `null` pre „všetky prvky“. */
export const typySkupiny = (nazov) => SKUPINY_PRVKOV.find((s) => s.nazov === nazov)?.typy ?? null

/**
 * Do filtra miest idú len doložené miesta. „Realizácia klienta“ je náhrada za
 * neznáme miesto, nie miesto — ako voľba filtra by sľubovala niečo, čo nevieme.
 * Abecedne, aby tri bratislavské lokality stáli pri sebe.
 */
export const MIESTA_DOLOZENE = [...new Set(GALERIA.filter((r) => r.isteMiesto).map((r) => r.miesto))].sort((a, b) =>
  a.localeCompare(b, 'sk'),
)

/**
 * Poradie galérie: doložené miesta idú dopredu. Fotka s menom mesta je silnejší
 * dôkaz než fotka bez neho, takže prvá obrazovka nesie tie overiteľné.
 * `sort` je v JS stabilný, poradie vnútri oboch skupín ostáva z dát.
 */
export const GALERIA_ZORADENA = [...GALERIA].sort((a, b) => Number(b.isteMiesto) - Number(a.isteMiesto))

/**
 * Časti popisku pod fotkou, v poradí, v akom sa vypisujú.
 *
 * Tri prípady, jedno pravidlo na jednom mieste:
 *  • produktová fotografia sa nesmie tváriť ako záber z osadenia, preto
 *    nedostane ani miesto, ani prostredie, len pomenovanie toho, čím je;
 *  • doložené miesto sa vypíše aj s prostredím;
 *  • nedoložené miesto sa nevypisuje vôbec — náhrada „Realizácia klienta“
 *    stála pod 17 z 32 fotiek a galéria tým pôsobila, akoby o vlastných
 *    stavbách nič nevedela. Ostáva prostredie, ktoré vieme z fotky.
 */
export const castiPopisu = (r) => {
  if (r.produktovaFoto) return ['Produktová fotografia']
  if (r.isteMiesto) return [r.miesto, r.prostredie]
  return [r.prostredie]
}
