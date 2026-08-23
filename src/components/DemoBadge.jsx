import { createPortal } from 'react-dom'

/**
 * Small fixed footer mark, PLAN.md §4: a demo carries the client's logo and
 * must never be mistakable for their live site. Never removed or hidden by
 * generated content — it sits above everything at a fixed z-index.
 *
 * Rendered through a portal straight into document.body. `position: fixed`
 * only pins to the *viewport* as long as no ancestor establishes its own
 * containing block — and any ancestor with `transform`, `filter`,
 * `backdrop-filter`, `perspective`, `contain`, or `will-change: transform`
 * does exactly that (this is precisely what the motion primitives in this
 * chassis — Reveal, Stagger, Parallax — apply to their own elements once
 * mounted). Section-generating agents are free to wrap arbitrary content in
 * those primitives; if this badge ever ended up nested under one instead of
 * being a plain sibling of <main>, `fixed` would silently degrade into
 * "positioned relative to that transformed ancestor" and the badge renders
 * inline wherever that ancestor happens to sit in the page instead of
 * pinned to a screen corner — which is the exact failure a real-browser
 * screenshot caught (badge floating mid-page over Služby / O-nás content).
 * Portaling to document.body removes that whole failure class: there is no
 * ancestor between this element and <body>, ever, regardless of what the
 * generator produces around <DemoBadge />.
 *
 * Sizing: capped to the viewport width and truncated with an ellipsis so it
 * can never grow into a banner that blocks a CTA underneath it, and padded
 * with env(safe-area-inset-*) so it clears the home-indicator / notch area
 * on mobile instead of hugging the true screen edge.
 */
export default function DemoBadge() {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9998]"
      style={{
        bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        right: 'max(0.75rem, env(safe-area-inset-right))',
      }}
    >
      {/*
        Fixed chrome unavoidably sits over whatever happens to scroll beneath
        it. A real-browser check at 390px caught it fully covering a stat
        card's value on first paint. Rather than move it (every corner has the
        same problem at some scroll position), it recedes: translucent by
        default so content stays readable through it, fully opaque on hover or
        keyboard focus when someone actually wants to read it. Same pattern as
        the usual "made with" badges, and it keeps the mark permanently visible
        — which is the point, since the demo carries the client's own branding.
      */}
      <span
        title="Nezáväzný návrh — PNH Media"
        className="pointer-events-auto inline-block max-w-[calc(100vw-1.5rem)] truncate whitespace-nowrap rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-1.5 text-[10px] font-medium text-[var(--color-muted)] opacity-60 shadow-lg backdrop-blur transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none sm:px-4 sm:py-2 sm:text-[var(--text-xs)]"
        tabIndex={0}
      >
        Nezáväzný návrh — PNH Media
      </span>
    </div>,
    document.body,
  )
}
