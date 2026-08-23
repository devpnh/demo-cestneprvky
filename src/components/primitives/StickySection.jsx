import { useRef } from 'react'
import { useScroll } from 'motion/react'

/**
 * Pinned section with scroll progress. `heightVh` beyond 100 is scroll
 * *runway* — extra document height the section reserves purely so
 * scrollYProgress has room to travel from 0 → 1 while the content stays
 * pinned, for `render` to consume as a progress-driven effect.
 *
 * That runway is only meaningful if something actually consumes
 * scrollYProgress. Static `children` don't animate against scroll — pinning
 * them for longer than one viewport just leaves the reader scrolling past a
 * dead, unchanging screen, which renders as a large empty gap once the
 * pinned content has nothing left to do for the remaining runway. So an
 * enlarged `heightVh` is only honoured when a `render` callback is actually
 * supplied; plain children always get a single 100vh pin with zero wasted
 * scroll height.
 */
export default function StickySection({ children, className, heightVh = 100, render, ...props }) {
  const ref = useRef(null)
  const hasRender = typeof render === 'function'
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const effectiveHeightVh = hasRender ? heightVh : 100

  return (
    <section
      ref={ref}
      className={className}
      style={{ height: `${effectiveHeightVh}vh`, position: 'relative' }}
      {...props}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {hasRender ? render(scrollYProgress) : children}
      </div>
    </section>
  )
}
