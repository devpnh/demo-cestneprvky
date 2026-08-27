import { Children, cloneElement, isValidElement, useEffect, useRef } from 'react'
import { sleduj } from '../../lib/odhalenie.js'

/**
 * Odhalenie skupiny: kontajner sleduje viewport, potomkovia nastupujú po
 * sebe. Oneskorenie nesie CSS premenná `--i` na potomkovi, takže celá
 * sekvencia stojí na jednom observeri a nie na jednom pre každú dlaždicu.
 *
 * Zachovaná je pôvodná dvojica `<Stagger><StaggerItem>`, aby sa nemuseli
 * prepisovať volania na stránkach.
 */
export default function Stagger({
  as: Tag = 'div',
  krok = 70,
  className = '',
  style,
  children,
  ...props
}) {
  const ref = useRef(null)
  useEffect(() => sleduj(ref.current), [])

  let i = 0
  const deti = Children.map(children, (dieta) => {
    if (!isValidElement(dieta)) return dieta
    const index = i++
    return cloneElement(dieta, { style: { ...dieta.props.style, '--i': index } })
  })

  return (
    <Tag
      ref={ref}
      data-odhal=""
      data-odhal-skupina=""
      className={className}
      style={{ ...style, '--odhal-krok': `${krok}ms` }}
      {...props}
    >
      {deti}
    </Tag>
  )
}

/** Potomok skupiny. Vlastný spúšťač nemá, riadi ho `<Stagger>` nad ním. */
export function StaggerItem({ as: Tag = 'div', className = '', style, children, ...props }) {
  return (
    <Tag data-odhal-dieta="" className={className} style={style} {...props}>
      {children}
    </Tag>
  )
}
