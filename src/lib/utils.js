import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The `cn` helper virtually every shadcn-derived component imports from
 * `@/lib/utils` — 1103 components in the corpus do, and without it none of them
 * compiles here however good a fit they were.
 *
 * Same implementation as shadcn's, deliberately: a component copied from the
 * corpus must behave identically, or "verbatim reuse" is a lie the build only
 * discovers at runtime.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
