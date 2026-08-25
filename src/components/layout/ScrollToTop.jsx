import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Pri zmene routy skroluje okamžite na vrch a presúva fokus na `<main>`.
 *
 * Okamžite, nie plynulo: plynulý dojazd cez celú predchádzajúcu stránku by
 * bežal počas prechodovej animácie a pôsobil ako pád. Lenis má vlastný scroll
 * stav, takže mu treba povedať `scrollTo(0, { immediate: true })`. Samotné
 * `window.scrollTo` by jeho interná pozícia prepísala späť pri ďalšom rAF.
 *
 * Na prvom vykreslení nerobí nič (netreba prepisovať pozíciu, ktorú prehliadač
 * obnovil, ani kradnúť fokus pri načítaní) a pri navigácii na `#kotvu` v rámci
 * tej istej stránky sa na vrch neskroluje.
 */
export default function ScrollToTop({ mainRef }) {
  const { pathname, hash } = useLocation()
  const prvyRender = useRef(true)
  const predchadzajuca = useRef(pathname)

  useEffect(() => {
    if (prvyRender.current) {
      prvyRender.current = false
      predchadzajuca.current = pathname
      return
    }
    if (predchadzajuca.current === pathname) return
    predchadzajuca.current = pathname
    if (hash) return

    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    // Aj s Lenisom: natívna pozícia musí sedieť skôr, než sa fokus presunie.
    window.scrollTo(0, 0)

    const main = mainRef && mainRef.current
    if (main && typeof main.focus === 'function') main.focus({ preventScroll: true })
  }, [pathname, hash, mainRef])

  return null
}
