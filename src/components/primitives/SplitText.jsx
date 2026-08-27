import { Fragment, useEffect, useRef } from 'react'
import { sleduj } from '../../lib/odhalenie.js'

/**
 * Nadpis, ktorý nabieha po slovách (alebo po riadkoch). Rovnaká mechanika
 * ako zvyšok vstupov: jeden observer a prechody v CSS.
 *
 * Slovo je v maske `overflow: hidden`, takže sa nevynára cez okolitý text,
 * ale vysúva sa spod vlastnej účaria. Medzera medzi slovami je skutočný
 * medzerový uzol MEDZI maskami, nie znak vnútri masky: na konci riadkového
 * boxu by ju CSS zlúčilo a slová by sa zliali, a nezlomiteľná medzera by
 * zase zakázala zalomenie a nadpis by pretiekol.
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  splitBy = 'word',
  krok = 45,
  ...props
}) {
  const ref = useRef(null)
  useEffect(() => sleduj(ref.current), [])

  const kusy = splitBy === 'line' ? text.split('\n') : text.split(' ')

  return (
    <Tag className={className} {...props}>
      <span ref={ref} data-odhal="" data-odhal-slova="" style={{ '--odhal-krok': `${krok}ms` }}>
        {kusy.map((kus, i) => (
          <Fragment key={`${kus}-${i}`}>
            <span className="inline-block overflow-hidden align-top">
              <span data-odhal-slovo="" className="inline-block" style={{ '--i': i }}>
                {kus}
              </span>
            </span>
            {splitBy === 'word' && i < kusy.length - 1 ? ' ' : null}
            {splitBy === 'line' && i < kusy.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
