import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Explicit prefers-reduced-motion hook — every motion primitive gates on this. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const handleChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return reduced
}
