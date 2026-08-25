import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Fotka } from '../../components/kit/index.js'

/**
 * Karta jednej služby. Používa ju prehľad `/sluzby` aj blok „Súvisiace
 * služby“ na detaile, takže obe miesta vyzerajú a správajú sa rovnako.
 *
 * Celá karta je jeden `<Link>`: odkaz „Detail služby“ je preto `<span>`, nie
 * druhý odkaz: vnorený odkaz je neplatné HTML a čítačka by ho ohlásila dvakrát.
 * Hover prekreslí vlasový rám do akcentu a posunie šípku o 2 px; nič sa
 * nezväčšuje a nikde nie je tieň (STANDARDY B2).
 */
export default function KartaSluzby({ sluzba }) {
  const d = sluzba.dlazdica
  return (
    <Link
      to={`/sluzby/${sluzba.slug}`}
      className="group flex h-full flex-col border border-[var(--color-border)] p-5 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)] focus-visible:border-[var(--color-accent)]"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <Fotka src={d.src} w={d.w} h={d.h} alt={d.alt} pomer="3/2" />

      <h3 className="mt-6 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
        {sluzba.nazov}
      </h3>
      <p className="mt-3 max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
        {sluzba.perex}
      </p>

      <span className="mt-auto flex min-h-[44px] items-center gap-2 pt-6 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-text)]">
        Detail služby
        <ArrowRight
          className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[2px]"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}
