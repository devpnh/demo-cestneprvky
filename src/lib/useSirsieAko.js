import { useEffect, useState } from 'react'

/**
 * Je okno širšie než `px`? Vracia `false`, kým sa nevie (SSR).
 *
 * Je to hook, a nie `hidden sm:block`, lebo rozdiel medzi mobilným
 * a desktopovým útvarom nie je vo viditeľnosti, ale v tom, **čo sa vôbec
 * zmontuje**. Dva markupy nad sebou s `display:none` by telefón stále stiahol
 * — `<img>` v skrytom prvku sa načíta — a to je presne ten druh nákladu, ktorý
 * mobilná verzia nemá niesť (STANDARDY F1).
 *
 * Prvý render už pozná odpoveď (`matchMedia` v inicializátore stavu), takže
 * neprebliskne nesprávny útvar a nič neposkočí (D5).
 */
export function useSirsieAko(px) {
  const [siroke, setSiroke] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${px}px)`).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${px}px)`)
    const zmena = (e) => setSiroke(e.matches)
    setSiroke(mql.matches)
    mql.addEventListener('change', zmena)
    return () => mql.removeEventListener('change', zmena)
  }, [px])
  return siroke
}
