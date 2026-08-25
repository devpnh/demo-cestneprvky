/**
 * Pás overiteľných faktov. Položka aj so svojím oddeľovačom je jedna
 * nedeliteľná jednotka (`whitespace-nowrap`), inak „·“ visí na začiatku
 * alebo konci riadka na 390 px — stará kozmetická chyba z QUALITY-LOG.
 */
export default function PasFaktov({ fakty = [], tmava = false, className = '' }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-3 gap-y-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] ${
        tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
      } ${className}`}
    >
      {fakty.map((f, i) => (
        <li key={f} className="whitespace-nowrap">
          {f}
          {i < fakty.length - 1 ? <span aria-hidden="true" className="ml-3 text-[var(--color-accent)]">·</span> : null}
        </li>
      ))}
    </ul>
  )
}
