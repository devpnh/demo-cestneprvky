/**
 * Pásmo stránky. Jediné miesto, kde sa rozhoduje o pozadí, farbe textu a
 * vertikálnom rytme — vďaka tomu majú všetky stránky rovnaký raster aj keď
 * ich stavia viac rúk. Rytmus striedania pásiem drží stránka (STANDARDY B5:
 * nikdy dve tmavé za sebou), `data-pasmo` slúži auditu na jeho zmeranie.
 */
const PASMA = {
  biela: 'bg-[var(--color-bg)] text-[var(--color-text)]',
  siva: 'bg-[var(--color-surface)] text-[var(--color-text)]',
  tmava: 'bg-[var(--color-surface-2)] text-[var(--color-bg)]',
}

export default function Sekcia({
  id,
  pasmo = 'biela',
  padding = 'plne',
  className = '',
  vnutorne = '',
  children,
  ...rest
}) {
  const py = padding === 'male' ? 'py-[var(--section-padding-y-sm)]' : padding === 'ziadne' ? '' : 'py-[var(--section-padding-y)]'
  return (
    <section id={id} data-pasmo={pasmo} className={`${PASMA[pasmo]} ${py} ${className}`} {...rest}>
      <div className={`mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] ${vnutorne}`}>{children}</div>
    </section>
  )
}

/** Kontajner na použitie mimo <Sekcia> (napr. v hero alebo v pásme na celú šírku). */
export function Kontajner({ className = '', children }) {
  return <div className={`mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] ${className}`}>{children}</div>
}
