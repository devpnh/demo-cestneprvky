/**
 * Slovenská sadzba: jednopísmenové predložky a spojky nesmú ostať na konci
 * riadka a číslo sa nesmie odtrhnúť od jednotky. Riešime to nezlomiteľnou
 * medzerou priamo v dátach, nie v komponentoch — copy prechádza cez desiatky
 * miest a jedno pravidlo na jednom mieste je jediné, čo sa dá udržať.
 *
 * Slugy, triedy a URL adresy medzeru neobsahujú, takže sa ich to netýka.
 */
const NBSP = ' '

/** a, i, o, u, s, k, v, z na konci riadka. Napríklad „lepené obrubníky a“. */
const JEDNOPISMENOVE = /(^|[\s(„"'])([aiouvszkAIOUVSZK])\s+/g
/** Číslo a jednotka: 30 min, 500 mm, 100 %, 2,5 kg, 35 mm. */
const CISLO_JEDNOTKA = /(\d)\s+(%|mm|cm|km|kg|min|m|h|t)(?=[\s.,;:)]|$)/g
/** Skratka s číslom: č. 532/2002. */
// Bez \b: JS ho počíta len nad [A-Za-z0-9_], takže pred „č“ nikdy nesedí.
const SKRATKA_CISLO = /(č\.)\s+(?=\d)/g

export function sadzba(text) {
  if (typeof text !== 'string' || !text.includes(' ')) return text
  return text
    .replace(JEDNOPISMENOVE, `$1$2${NBSP}`)
    .replace(CISLO_JEDNOTKA, `$1${NBSP}$2`)
    .replace(SKRATKA_CISLO, `$1${NBSP}`)
}

/** Prejde pole alebo objekt do hĺbky a upraví každý reťazec. */
export function sadzbaHlboko(hodnota) {
  if (typeof hodnota === 'string') return sadzba(hodnota)
  if (Array.isArray(hodnota)) return hodnota.map(sadzbaHlboko)
  if (hodnota && typeof hodnota === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(hodnota)) out[k] = sadzbaHlboko(v)
    return out
  }
  return hodnota
}
