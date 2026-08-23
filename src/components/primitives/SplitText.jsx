import { Fragment } from 'react'
import { motion } from 'motion/react'
import { EASE, viewportOnce } from '../../lib/motion.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * Word/line stagger reveal, pure `motion` — no GSAP SplitText dependency.
 * splitBy: 'word' (default) or 'line' (splits on \n and inserts <br/>).
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  className,
  splitBy = 'word',
  staggerChildren = 0.04,
  ...props
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <Tag className={className} {...props}>
        {text}
      </Tag>
    )
  }

  const pieces = splitBy === 'line' ? text.split('\n') : text.split(' ')

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren } },
  }
  const item = {
    hidden: { opacity: 0, y: '0.6em' },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  }

  return (
    <Tag className={className} {...props}>
      <motion.span
        style={{ display: 'inline' }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={container}
      >
        {pieces.map((piece, i) => (
          <Fragment key={i}>
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
              <motion.span style={{ display: 'inline-block' }} variants={item}>
                {piece}
              </motion.span>
            </span>
            {/* The separating space must be a real, breakable space that
                lives OUTSIDE the inline-block mask span above -- not a
                trailing character inside it. Two things break word
                spacing here otherwise: (1) an inline-block establishes
                its own line box, and CSS collapses whitespace at the end
                of a line box, so a trailing U+0020 placed inside would
                silently disappear and run words together; (2) the
                previous version used a U+00A0 (non-breaking space) as
                the separator, which does survive collapsing but also
                blocks the browser from ever wrapping a line between
                words -- headings/paragraphs would render as one
                unbreakable run and overflow on narrow viewports. A plain
                ' ' as a sibling text node between two inline-level boxes
                is preserved AND wraps normally. */}
            {splitBy === 'word' && i < pieces.length - 1 ? ' ' : null}
            {splitBy === 'line' && i < pieces.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}
