import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion.js'

/**
 * Lenis singleton wired through a MANUAL requestAnimationFrame loop — house
 * convention across the PNH repos, never Lenis's own autoRaf. Disabled
 * entirely under prefers-reduced-motion, cleaned up on unmount.
 */
export function useLenis() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      autoRaf: false,
    })

    let frameId
    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [reduced])
}
