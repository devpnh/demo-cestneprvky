import { motion } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * Deliaca linka v reči odboru: prerušovaná čiara ako vodorovné dopravné
 * značenie. Kreslí sa zľava doprava pri vstupe do viewportu (whileInView,
 * žiadne scroll-linkovanie — E3), pri reduced-motion je hneď celá.
 */
export default function Lajna({ tmava = false, akcent = false, className = '' }) {
  const reduced = useReducedMotion()
  const farba = akcent
    ? 'var(--color-accent)'
    : tmava
      ? 'color-mix(in srgb, var(--color-bg) 28%, transparent)'
      : 'var(--color-border)'
  const styl = {
    height: 2,
    backgroundImage: `repeating-linear-gradient(90deg, ${farba} 0 18px, transparent 18px 30px)`,
  }
  if (reduced) return <div aria-hidden="true" className={className} style={styl} />
  return (
    <motion.div
      aria-hidden="true"
      className={`origin-left ${className}`}
      style={styl}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}
