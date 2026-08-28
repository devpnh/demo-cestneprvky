import { useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * Pausable marquee via CSS keyframes (no per-frame JS). Content is
 * duplicated once so the loop is seamless at translateX(-50%). Pauses on
 * hover by default; collapses to a static, non-scrolling row under
 * prefers-reduced-motion.
 */
export default function Marquee({ children, className, durationS = 30, pauseOnHover = true, ...props }) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)

  if (reduced) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ overflow: 'hidden' }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      {...props}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `demogen-marquee-scroll ${durationS}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        <div style={{ display: 'flex' }}>{children}</div>
        {/* aria-hidden alone keeps this clone out of the accessibility tree
            but NOT out of the tab order — any link/button inside `children`
            would still be keyboard-focusable here, landing screen-reader and
            keyboard users on a "phantom" duplicate with nothing announced.
            `inert` additionally removes it from focus and interaction. */}
        <div style={{ display: 'flex' }} aria-hidden="true" inert>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes demogen-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
