/**
 * The house motion vocabulary. Every section and primitive reuses these
 * instead of inventing new easing/duration/variant values — this is what
 * keeps a generated demo feeling like one coherent piece of motion design
 * rather than a pile of independently-animated widgets.
 */

// Expo-out — the one curve used everywhere in this chassis. Mirrors
// --ease-house in tokens.css (keep the two in sync if either changes).
export const EASE = [0.16, 1, 0.3, 1]

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
}

/** Container variant for staggered children — pair with fadeUp/fadeIn on each child. */
export function staggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  }
}

/** Shared "reveal once" viewport config for whileInView triggers. */
export const viewportOnce = { once: true, amount: 0.3 }
