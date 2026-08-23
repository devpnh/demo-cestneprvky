import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const isTouchDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

/**
 * Custom ring cursor that snaps to the center of any element matching
 * `magneticSelector` (default [data-magnetic]) and scales up while over it.
 * Disabled entirely on touch devices and under prefers-reduced-motion —
 * mount App once with <MagneticCursor />; mark interactive elements with
 * data-magnetic to opt them in.
 */
export default function MagneticCursor({ size = 32, magneticSelector = '[data-magnetic]' }) {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { damping: 25, stiffness: 300, mass: 0.5 })
  const springY = useSpring(y, { damping: 25, stiffness: 300, mass: 0.5 })

  useEffect(() => {
    if (reduced || isTouchDevice()) {
      setEnabled(false)
      return undefined
    }
    setEnabled(true)

    function handleMove(e) {
      const magnet = e.target.closest?.(magneticSelector)
      if (magnet) {
        const rect = magnet.getBoundingClientRect()
        x.set(rect.left + rect.width / 2 - size / 2)
        y.set(rect.top + rect.height / 2 - size / 2)
        setHovering(true)
      } else {
        x.set(e.clientX - size / 2)
        y.set(e.clientY - size / 2)
        setHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [reduced, magneticSelector, size, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: '9999px',
        border: '1.5px solid var(--color-text)',
        pointerEvents: 'none',
        zIndex: 9999,
        x: springX,
        y: springY,
      }}
      animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 0.6 : 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}
