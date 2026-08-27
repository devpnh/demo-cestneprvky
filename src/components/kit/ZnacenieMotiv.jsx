/**
 * Značkovací motív: jazdné pruhy zbiehajúce sa do úbežníka.
 *
 * Podpisová dekorácia webu. Nie je to abstraktný gradient — je to to, čo
 * firma reálne robí: prerušovaná stredová čiara a krajnice v perspektíve.
 * Beží pod tmavými pásmami (hlavička podstránky, pás výzvy, pätička), takže
 * má každá stránka rovnaký rukopis a rovnaký zdroj pohybu.
 *
 * Čiary sa posúvajú k úbežníku cez `stroke-dashoffset` (trieda `.pruhy-beh`
 * v `index.css`, 30 s lineárne). Je to jediná nekonečná animácia na webe
 * okrem objazdu; pri `prefers-reduced-motion` stojí, ako všetko ostatné.
 *
 * Kontrast: čiary majú krytie 0,10 až 0,16 na tmavom pásme, takže text nad
 * nimi drží svoj pomer voči pozadiu pásma a nie voči čiare (B7).
 */

/** y-ová súradnica čiary na ľavom okraji; úbežník je vpravo hore. */
const PRUHY = [
  { y: -120, sirka: 1, krytie: 0.1 },
  { y: 90, sirka: 1.5, krytie: 0.12 },
  { y: 300, sirka: 2.5, krytie: 0.16, akcent: true },
  { y: 520, sirka: 3.5, krytie: 0.12 },
  { y: 760, sirka: 5, krytie: 0.08 },
]

const UBEZNIK = { x: 1180, y: 150 }

export default function ZnacenieMotiv({ className = '', krytie = 1 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMaxYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: krytie }}
    >
      {PRUHY.map((p) => (
        <line
          key={p.y}
          x1="-200"
          y1={p.y}
          x2={UBEZNIK.x}
          y2={UBEZNIK.y}
          stroke={p.akcent ? 'var(--color-accent)' : 'var(--color-bg)'}
          strokeWidth={p.sirka}
          strokeOpacity={p.krytie}
          strokeDasharray="46 34"
          className="pruhy-beh"
        />
      ))}
      {/* Úbežník sám: bod, do ktorého cesta uteká. */}
      <circle cx={UBEZNIK.x} cy={UBEZNIK.y} r="2" fill="var(--color-accent)" fillOpacity="0.5" />
    </svg>
  )
}
