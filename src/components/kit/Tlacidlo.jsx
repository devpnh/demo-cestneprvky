import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * CTA v troch polohách. Primárne tlačidlo je biely text na akcente — tá
 * dvojica má kontrast 4,05:1, takže MUSÍ ostať veľký text (19 px / 600),
 * kde platí limit 3:1 (nález z auditu iterácie 3). Preto je veľkosť napevno
 * v komponente a nedá sa prebiť utilitou zvonku.
 * Bez tieňov (STANDARDY B2), hover = posun o 2 px alebo prekreslenie rámu.
 */
const ZAKLAD =
  'inline-flex min-h-[52px] items-center gap-3 px-7 font-[family-name:var(--font-body)] text-[1.1875rem] font-semibold transition-[transform,background-color,border-color] duration-[var(--duration-fast)]'

export default function Tlacidlo({
  variant = 'primar',
  tmava = false,
  to,
  href,
  onClick,
  sSipkou = variant !== 'sekundar',
  className = '',
  children,
  ...rest
}) {
  const styl =
    variant === 'primar'
      ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:translate-x-[2px] hover:bg-[var(--color-accent-deep)]'
      : variant === 'sekundar'
        ? tmava
          ? 'border border-[rgba(255,255,255,0.35)] text-[var(--color-bg)] hover:border-[var(--color-bg)]'
          : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
        : tmava
          ? 'px-0 text-[var(--color-bg)] hover:translate-x-[2px]'
          : 'px-0 text-[var(--color-text)] hover:translate-x-[2px]'

  const obsah = (
    <>
      {children}
      {sSipkou ? <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
    </>
  )
  const props = {
    className: `${ZAKLAD} ${styl} ${className}`,
    style: { borderRadius: 'var(--radius-sm)' },
    ...rest,
  }

  if (to) return <Link to={to} {...props}>{obsah}</Link>
  if (href) return <a href={href} {...props}>{obsah}</a>
  return <button type="button" onClick={onClick} {...props}>{obsah}</button>
}
