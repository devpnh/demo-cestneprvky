import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/motion.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

/**
 * Staggered children reveal. Wrap a list of elements; give each child
 * `variants={fadeUp}` (or StaggerItem below) and the container fans the
 * reveal out across them. Same "already visible on mount" / no-
 * IntersectionObserver-support handling as Reveal.jsx — see that file for
 * why `animate` (not a re-assigned `initial`) drives the above-the-fold
 * case, and why missing IntersectionObserver support falls back to a plain,
 * fully-visible render instead of a permanently-hidden one.
 */
export default function Stagger({
  as = 'div',
  staggerChildren = 0.08,
  delayChildren = 0,
  className,
  children,
  ...props
}) {
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
      variants={staggerContainer(staggerChildren, delayChildren)}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

/** Convenience child for use inside <Stagger> — plain fadeUp, no own trigger. */
export function StaggerItem({ as = 'div', className, children, ...props }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag className={className} variants={fadeUp} {...props}>
      {children}
    </MotionTag>
  )
}
