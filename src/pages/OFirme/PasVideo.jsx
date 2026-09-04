import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const BASE = import.meta.env.BASE_URL

/**
 * Celoplošný pás s videom — predel medzi dvomi svetlými pásmami.
 *
 * Ide cez celú šírku okna vo vlastnom pomere 16:9, takže záber nie je
 * orezaný ani zhora, ani zdola. Miesto je jediné možné: pás je opticky
 * tmavý, takže musí stáť medzi dvomi svetlými pásmami (medzi „Prístup“
 * a „Kam po konzultáciu“), nikdy nad tmavým alebo pod ním.
 *
 * Nahradil fotografický `PasOddelovac` na tom istom mieste: záber, na ktorom
 * stroj nanáša vodorovné značenie, hovorí o remesle firmy viac než statická
 * fotka a je to jediné miesto na podstránke, kde sa niečo hýbe samo.
 *
 * ## Pravidlá sú tie isté ako pri hero videu na Domove (STANDARDY C5)
 *
 *  • **Poster je vždy v DOM** a video sa naň prelína až po `canplay`, takže
 *    pás nikdy nie je prázdny obdĺžnik.
 *  • **Video vzniká len nad 1024 px**, bez `prefers-reduced-motion` a bez
 *    `Save-Data`. Na telefóne je v DOM iba poster (75 kB), nie 2,3 MB videa.
 *  • `muted playsInline loop preload="metadata"`, bez ovládacích prvkov a
 *    `tabIndex={-1}` — je to plocha, nie prehrávač, do tabovania nepatrí.
 *
 * ## Prečo `<div>` a nie `<section>`
 *
 * Rovnaký dôvod ako pri `PasOddelovac`: nie je to obsahové pásmo, je to
 * predel. Ako `<section>` s `data-pasmo` by vstúpil do rytmu pásiem a
 * kontrola B5 by ho počítala. Opticky je tmavý, preto stojí medzi dvomi
 * svetlými pásmami a nikdy tesne pod tmavým.
 *
 * Šírka ide od hrany po hranu bez `w-screen`: `100vw` počíta aj so zvislým
 * scrollbarom a stránka by dostala pár pixelov vodorovného pretečenia
 * (STANDARDY D1). Pás je preto priamy potomok stránky, ktorá kontajner nemá.
 *
 * `alt` popisuje, čo je na zábere, a **netvrdí, že je to realizácia
 * klienta** — v katalógu `REALIZACIE` tento súbor nie je a popisok pod pásom
 * preto žiadny nie je (STANDARDY A3).
 */
export default function PasVideo({
  // Pomer záberu, nie výška pásma: 16/9 je natívny pomer súboru, takže sa
  // z videa neoreže nič (pokyn Petra, 28. 8. 2026 — „nekropni to tak veľmi,
  // vytiahni z toho maximum“). Predtým to bol pruh clamp(18rem,46vh,32rem),
  // z ktorého na 1440 px ostalo 60 % obrazu a stroj bol na hrane orezu.
  // `max-h` je poistka pre veľmi široké monitory: nad ~1600 px by pás
  // presiahol výšku okna a nedal by sa vidieť naraz.
  triedaRamu = 'aspect-video max-h-[92svh]',
  alt = 'Stroj nanáša bielu čiaru vodorovného dopravného značenia na asfaltovú vozovku',
}) {
  const reduced = useReducedMotion()
  const videoRef = useRef(null)
  const [chceVideo, setChceVideo] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return undefined
    const saveData = navigator.connection && navigator.connection.saveData
    const mq = window.matchMedia('(min-width: 1024px)')
    const uprav = () => setChceVideo(mq.matches && !saveData)
    uprav()
    mq.addEventListener('change', uprav)
    return () => mq.removeEventListener('change', uprav)
  }, [reduced])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !chceVideo) return undefined
    // Autoplay môže byť odmietnutý (napr. politika prehliadača); poster
    // v tom prípade ostane a pás vyzerá ako fotografický predel.
    const prehraj = v.play()
    if (prehraj && typeof prehraj.catch === 'function') prehraj.catch(() => {})
    return undefined
  }, [chceVideo])

  return (
    <div data-pas-video className={`relative w-full overflow-hidden bg-[var(--color-accent-2)] ${triedaRamu}`}>
      <img
        src={`${BASE}video/poster.jpg`}
        srcSet={`${BASE}video/poster-960.jpg 960w, ${BASE}video/poster.jpg 1280w`}
        sizes="100vw"
        width={1280}
        height={720}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {chceVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[var(--duration-slow)]"
          style={{ opacity: ready ? 1 : 0 }}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={`${BASE}video/poster.jpg`}
          onCanPlay={() => setReady(true)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <source src={`${BASE}video/znacenie.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  )
}
