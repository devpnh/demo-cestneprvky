/**
 * `next/link` stand-in. 343 corpus components import it; a demo is a plain Vite
 * SPA, so a Link is an anchor. Keeping the same import specifier means those
 * components need no edit at all.
 */
export default function Link({ href, children, ...rest }) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
