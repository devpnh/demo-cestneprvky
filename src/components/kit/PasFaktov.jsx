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
/**
 * Farba oddeľovača: `--color-accent` má na bielej 4,05:1 a na tmavom pásme
 * 3,61:1, teda pod limitom 4,5:1 pre 12 px text. Na svetlom pásme preto
 * tmavší odtieň akcentu (5,76:1), na tmavom farba okolitého textu.
 */
const FARBA_ODDELOVACA = (tmava) =>
  tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-accent-deep)]'

import { sadzba } from '../../lib/sadzba.js'

export default function PasFaktov({ fakty = [], tmava = false, className = '' }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-3 gap-y-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[1.5] tracking-[0.08em] ${
        tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
      } ${className}`}
    >
      {fakty.map((f, i) => (
        <li key={f} className="max-w-full break-words">
          {sadzba(f)}
          {i < fakty.length - 1 ? (
            <span aria-hidden="true" className={FARBA_ODDELOVACA(tmava)}>
              {'\u00a0·'}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
