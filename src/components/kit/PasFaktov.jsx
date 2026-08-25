/**
 * Pás overiteľných faktov.
 *
 * Oddeľovač „·“ nesmie začínať riadok (stará kozmetická chyba z QUALITY-LOG),
 * ale nedeliteľná nesmie byť ani celá položka: fakt „Konzultácie: Únia
 * nevidiacich a slabozrakých Slovenska“ má na 390 px cez 440 px a pri
 * `whitespace-nowrap` ťahal `scrollWidth` dokumentu na 461 (nález Staviteľa
 * O firme). Riešenie: text sa láme normálne a oddeľovač je prilepený k
 * poslednému slovu nezlomiteľnou medzerou, takže sám na riadok nikdy
 * neprepadne.
 */
export default function PasFaktov({ fakty = [], tmava = false, className = '' }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-3 gap-y-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[1.5] tracking-[0.08em] ${
        tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
      } ${className}`}
    >
      {fakty.map((f, i) => (
        <li key={f} className="max-w-full break-words">
          {f}
          {i < fakty.length - 1 ? (
            <span aria-hidden="true" className="text-[var(--color-accent)]">
              {'\u00a0·'}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
