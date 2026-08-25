/**
 * Technický mikro-štítok (IBM Plex Mono, 12 px, 0,08 em). Na tmavom pásme
 * biela na 72 % s akcentovou čiarkou — samotný `--color-muted` tam nemá
 * kontrast 4,5:1 (nález z auditu iterácie 3).
 */
export default function MonoStitok({ tmava = false, sCiarkou = tmava, className = '', children, ...rest }) {
  return (
    <p
      className={`font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] ${
        tmava ? 'text-[rgba(255,255,255,0.72)]' : 'text-[var(--color-muted)]'
      } ${sCiarkou ? "flex items-center gap-3 before:h-[2px] before:w-6 before:bg-[var(--color-accent)] before:content-['']" : ''} ${className}`}
      {...rest}
    >
      {children}
    </p>
  )
}
