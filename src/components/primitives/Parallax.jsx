import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * useScroll/useTransform parallax wrapper. `speed` is the travel distance in
 * "hundreds of px" either direction as the element crosses the viewport —
 * 0.3 is subtle, 1 is pronounced. Falls back to a static div under
 * prefers-reduced-motion.
 */
export default function Parallax({ children, className, speed = 0.3, ...props }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}px`, `${speed * 100}px`])

  if (reduced) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }} {...props}>
      {children}
    </motion.div>
  )
}
