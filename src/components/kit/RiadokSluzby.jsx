import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { sadzba } from '../../lib/sadzba.js'
import { SIZES_MINIATURA, srcSetPre } from '../../lib/obrazky.js'

const BASE = import.meta.env.BASE_URL

/**
 * Jedna služba ako riadok zoznamu — mobilný útvar výpisu služieb.
 *
 * Na telefóne je deväť služieb deväť kariet s fotkou 233 px na výšku, čo je
 * 5 700 px scrollu na `/sluzby` a to isté znova v „Súvisiacich službách“.
 * Riadok má miniatúru 96 x 64, meno a šípku, teda ~96 px: deväť služieb sa
 * zmestí na jednu obrazovku a palec ich prejde jedným ťahom (4. 9. 2026).
 *
 * **Prečo riadky a nie mriežka 2 x 5 dlaždíc.** Mená služieb sú dlhé
 * („Značenie pre nevidiacich a slabozrakých“, „Odstránenie starého
 * vodorovného dopravného značenia“) a v polovičnej šírke sa lámu na štyri
 * riadky. Mriežka preto nie je nižšia, len drobnejšia a horšie čitateľná;
 * namerané na oboch variantoch (4. 9. 2026).
 *
 * Perex je nepovinný a orezaný na dva riadky: na `/sluzby` je stránka
 * o službách a jedna veta „pre koho“ tam patrí, na Domove sa služba len
 * pomenúva a text stojí na jej stránke.
 *
 * Celý riadok je jeden `<Link>` vysoký ≥ 72 px, teda pohodlne nad 44 px
 * tapovacieho minima (D2, Apple HIG 44 pt, Material 48 dp). Deliaca je
 * vlasová linka pod riadkom, nie rám okolo každého (B2, B6).
 */
export default function RiadokSluzby({ sluzba, alt, perex = false }) {
  const d = sluzba.dlazdica
  return (
    <Link
      to={`/sluzby/${sluzba.slug}`}
      className="group flex min-h-[72px] items-center gap-4 border-b border-[var(--color-border)] py-4 transition-colors duration-[var(--duration-hover)] hover:border-[var(--color-accent)]"
    >
      <img
        src={`${BASE}assets/${d.src}`}
        srcSet={srcSetPre(d.src, d.w, Infinity, true)}
        sizes={SIZES_MINIATURA}
        width={d.w}
        height={d.h}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-[64px] w-[96px] shrink-0 object-cover"
        style={{ borderRadius: 'var(--radius-sm)' }}
      />
      <div className="min-w-0 flex-1">
        {/* Krátke meno, nie plné: „Značenie pre nevidiacich a slabozrakých“
            sa v riadku láme na tri riadky a pravidlo je najviac dva.
            Plné meno stojí na stránke služby a v jej `<h1>`. */}
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-lg)] font-semibold leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          {sadzba(sluzba.nazovKratky || sluzba.nazov)}
        </h3>
        {/* Perex je 16 px, nie 14: na telefóne je to telo textu, nie popisok. */}
        {perex && sluzba.perex ? (
          <p className="mt-1 line-clamp-2 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)] sm:text-[length:var(--text-sm)]">
            {sadzba(sluzba.perex)}
          </p>
        ) : null}
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-hover)] group-hover:translate-x-[2px]"
        aria-hidden="true"
      />
    </Link>
  )
}
