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
    // Dialóg „Dohodnúť obhliadku“ potrebuje stop()/start() pri otvorení.
    window.__lenis = lenis

    let frameId
    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      if (window.__lenis === lenis) window.__lenis = undefined
      lenis.destroy()
    }
  }, [reduced])
}
