import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { fadeUp, viewportOnce } from '../../lib/motion.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

/**
 * Scroll-triggered fade+rise. Reduced-motion aware (renders a plain element,
 * no animation, no observer) and falls back the same way when
 * IntersectionObserver isn't available at all — `whileInView` has no other
 * way to trigger, so without this fallback content below the fold would
 * stay permanently at its hidden variant in that environment.
 *
 * Handles "already visible on mount": above-the-fold content is checked
 * against the viewport on first paint and, if already in view, is driven to
 * its visible state via an explicit `animate` prop. That's deliberate
 * rather than re-assigning `initial` on a later render — `initial` is only
 * honoured at a component's actual mount, so flipping it after the fact on
 * the same mounted instance is a no-op and would leave already-visible,
 * above-the-fold content sitting invisible forever if whileInView's own
 * observer callback is ever late or skipped. `animate` is reactive on every
 * render, so this path is guaranteed to resolve to visible.
 */
export default function Reveal({ as = 'div', variants = fadeUp, className, children, ...props }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [alreadyVisible, setAlreadyVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setAlreadyVisible(rect.top < window.innerHeight && rect.bottom > 0)
  }, [])

  if (reduced || !supportsIntersectionObserver) {
    const Tag = as
    return (
      <Tag ref={ref} className={className} {...props}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={alreadyVisible ? 'visible' : undefined}
      whileInView={alreadyVisible ? undefined : 'visible'}
      viewport={viewportOnce}
      variants={variants}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
