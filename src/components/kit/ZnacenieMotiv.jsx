/**
 * Značkovací motív: jazdné pruhy miznúce do diaľky.
 *
 * Podpisová dekorácia webu. Nie je to abstraktný gradient — je to to, čo
 * firma reálne robí: prerušovaná stredová čiara a krajnice v perspektíve.
 * Beží pod hlavičkou podstránky a pod pásom výzvy, takže má každá stránka
 * rovnaký rukopis a rovnaký zdroj pohybu.
 *
 * ## Úbežník je ZA hranou, nie v ploche
 *
 * Prvá verzia mala úbežník vnútri kresby (1180, 150) a ešte v ňom kreslila
 * bodku. Čiary sa teda zbiehali do viditeľného bodu a motív vyzeral ako
 * schéma perspektívy, nie ako cesta — pozornosť skončila v rohu pásma
 * (výtka Petra, 27. 8. 2026: „nech to nejde do jedného bodu, ale do
 * stratena, ten bod nech je mimo hero, akoby za ním“).
 *
 * Úbežník je preto **mimo `viewBox`** (x 1560 pri šírke 1200) a bodka je
 * preč. Čiary navyše k nemu vyblednú do nuly cez gradient na ťahu, takže sa
 * stratia skôr, než by sa stihli zbehnúť — kresba nemá koniec, ktorý by sa
 * dal nájsť očami.
 *
 * Čiary sa posúvajú k úbežníku cez `stroke-dashoffset` (trieda `.pruhy-beh`
 * v `index.css`, 34 s lineárne). Pri `prefers-reduced-motion` stoja.
 *
 * Kontrast: čiary sú takmer priehľadné (0,08 až 0,16) a k pravému okraju
 * ešte blednú, takže text nad nimi drží svoj pomer voči pozadiu pásma a nie
 * voči čiare (B7).
 *
 * `svetle` prepne kresbu na svetlé pásmo: čiary sú potom z inkoustu, nie
 * z bielej, a majú nižšie krytie — na bielej je aj slabá tmavá čiara vidieť
 * silnejšie než slabá biela na tmavej.
 */

/** y-ová súradnica čiary na ľavom okraji; úbežník je vpravo za hranou. */
const PRUHY = [
  { y: -120, sirka: 1, krytie: 0.1 },
  { y: 90, sirka: 1.5, krytie: 0.12 },
  { y: 300, sirka: 2.5, krytie: 0.16, akcent: true },
  { y: 520, sirka: 3.5, krytie: 0.12 },
  { y: 760, sirka: 5, krytie: 0.08 },
]

/**
 * Úbežník leží za pravou hranou kresby (`viewBox` je široký 1200), takže
 * priesečník čiar na stránke nikdy nie je vidieť.
 */
const UBEZNIK = { x: 1560, y: 120 }

export default function ZnacenieMotiv({ className = '', krytie = 1, svetle = false }) {
  // Gradienty musia mať v dokumente jedinečné `id`. Motív stojí na stránke
  // aj dvakrát (hlavička + pás výzvy), preto sa id odvodzuje od varianty a
  // nie od náhody — s náhodou by sa pri každom rendere menilo.
  const idBiely = `pruh-mizne-${svetle ? 'svetle' : 'tmave'}`
  const idAkcent = `pruh-mizne-akcent-${svetle ? 'svetle' : 'tmave'}`
  const zakladna = svetle ? 'var(--color-text)' : 'var(--color-bg)'

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMaxYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: krytie }}
    >
      <defs>
        {/* Vyblednutie do stratena. `userSpaceOnUse` preto, aby gradient bežal
            cez celú kresbu a nie cez ohraničenie každej čiary zvlášť —
            inak by každá vyblednutá inde a perspektíva by sa rozpadla. */}
        {[
          [idBiely, zakladna],
          [idAkcent, 'var(--color-accent)'],
        ].map(([id, farba]) => (
          <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1="-200" y1="0" x2="1150" y2="0">
            <stop offset="0" stopColor={farba} stopOpacity="1" />
            <stop offset="0.55" stopColor={farba} stopOpacity="0.75" />
            <stop offset="1" stopColor={farba} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {PRUHY.map((p) => (
        <line
          key={p.y}
          x1="-200"
          y1={p.y}
          x2={UBEZNIK.x}
          y2={UBEZNIK.y}
          stroke={`url(#${p.akcent ? idAkcent : idBiely})`}
          strokeWidth={p.sirka}
          strokeOpacity={svetle ? p.krytie * 0.6 : p.krytie}
          strokeDasharray="46 34"
          className="pruhy-beh"
        />
      ))}
    </svg>
  )
}
