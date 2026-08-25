/**
 * Technická tabuľka retardérov. Hlavička aj bunky sú doslova z
 * `src/content/sluzby.js` vrátane pomlčky v názve produktu
 * (`Typ KT – 50`) a hviezdičky, ktorú vysvetľuje poznámka pod tabuľkou.
 *
 * Mobilná lekcia z QUALITY-LOG (iterácia 5): `min-w-[30rem]` vnútri
 * `overflow-x-auto` odsunulo na 390 px celý stĺpec „Typ KT – 35“ mimo obraz,
 * takže polovica parametrov na telefóne zmizla. Preto `min-w-0` a šírka sa
 * púšťa až od `sm`; na 390 px sa všetky tri stĺpce zmestia a text sa zalomí.
 * `table-fixed` s pevným pomerom stĺpcov drží zalomenie predvídateľné.
 */
export default function TabulkaDebuz({ tabulka }) {
  if (!tabulka) return null
  const { hlavicka = [], riadky = [], poznamka } = tabulka

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-0 table-fixed border-collapse font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] leading-[var(--leading-normal)] sm:min-w-[30rem] sm:text-[length:var(--text-sm)]">
          {/* Stĺpec s názvom parametra je najužší zámerne: hlavičky
              `Typ KT – 50` a `Typ KT – 35 *` sa na 390 px musia zmestiť na
              jeden riadok, názvy parametrov sa zalomiť môžu. */}
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '35%' }} />
            <col style={{ width: '35%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--color-text)]">
              {hlavicka.map((h, i) => (
                <th
                  key={h || `stlpec-${i}`}
                  scope="col"
                  className={`py-3 pr-2 sm:pr-3 text-left align-bottom font-medium ${
                    i === 0 ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]'
                  }`}
                >
                  {h || <span className="sr-only">Parameter</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riadky.map((r) => (
              <tr key={r[0]} className="border-b border-[var(--color-border)]">
                <th scope="row" className="py-3 pr-2 sm:pr-3 text-left align-top font-normal text-[var(--color-muted)]">
                  {r[0]}
                </th>
                {r.slice(1).map((bunka, i) => (
                  <td key={`${r[0]}-${i}`} className="py-3 pr-2 sm:pr-3 align-top tabular-nums text-[var(--color-text)]">
                    {bunka}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {poznamka ? (
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
          {poznamka}
        </p>
      ) : null}
    </div>
  )
}
