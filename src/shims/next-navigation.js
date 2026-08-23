/**
 * `next/navigation` stand-in (111 corpus components). A demo has no router, so
 * these return inert values rather than throwing — a component that merely
 * CALLS useRouter() on mount must still render.
 */
export function useRouter() {
  return { push() {}, replace() {}, back() {}, forward() {}, refresh() {}, prefetch() {} }
}
export function usePathname() {
  return typeof window === 'undefined' ? '/' : window.location.pathname
}
export function useSearchParams() {
  return new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
}
