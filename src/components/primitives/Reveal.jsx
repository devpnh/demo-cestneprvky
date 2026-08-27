import { useEffect, useRef } from 'react'
import { sleduj } from '../../lib/odhalenie.js'

/**
 * Odhalenie pri vstupe do viewportu: opacity 0 → 1 a 22 px zdola.
 *
 * Mechanika je v `src/lib/odhalenie.js` (zdieľaný IntersectionObserver) a
 * v `src/styles/index.css` (prechody). Tu je len prihlásenie prvku.
 *
 * `posun` mení dráhu na vodorovnú alebo ju vypína — tak vie mať jedna
 * stránka viac ako jeden druh vstupu bez toho, aby si každá sekcia písala
 * vlastnú animáciu.
 */
export default function Reveal({ as: Tag = 'div', posun = 'zdola', oneskorenie = 0, className = '', style, children, ...props }) {
  const ref = useRef(null)

  useEffect(() => sleduj(ref.current), [])

  return (
    <Tag
      ref={ref}
      data-odhal=""
      data-odhal-posun={posun}
      className={className}
      style={oneskorenie ? { ...style, '--odhal-oneskorenie': `${oneskorenie}ms` } : style}
      {...props}
    >
      {children}
    </Tag>
  )
}
