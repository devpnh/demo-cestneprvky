import { useEffect, useRef } from 'react'
import { sleduj } from '../../lib/odhalenie.js'

/**
 * Deliaca linka v reči odboru: prerušovaná čiara ako vodorovné dopravné
 * značenie. Kreslí sa zľava doprava pri vstupe do viewportu — rovnakým
 * observerom ako všetky ostatné vstupy (`src/lib/odhalenie.js`), nie
 * `whileInView`, ktorý v tomto projekte nespúšťa nič.
 */
export default function Lajna({ tmava = false, akcent = false, plna = false, hrubka = 2, className = '' }) {
  const ref = useRef(null)
  useEffect(() => sleduj(ref.current), [])

  const farba = akcent
    ? 'var(--color-accent)'
    : tmava
      ? 'color-mix(in srgb, var(--color-bg) 28%, transparent)'
      : 'var(--color-border)'

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-odhal=""
      data-lajna=""
      className={className}
      style={{
        height: hrubka,
        // `plna` je krátka akcentová linka pod titulom, `prerušovaná` je
        // deliaca čiara sekcií. Kreslia sa rovnako, líšia sa len výplňou.
        ...(plna
          ? { backgroundColor: farba }
          : { backgroundImage: `repeating-linear-gradient(90deg, ${farba} 0 18px, transparent 18px 30px)` }),
      }}
    />
  )
}
