import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const BASE = import.meta.env.BASE_URL

/**
 * Dvojitý scrim nad záberom — tie isté hodnoty a ten istý dôvod ako v hero
 * Domova. Text hlavičky sedí v dolnej časti pásma a vľavo, takže tam musí byť
 * podklad tmavý natoľko, aby biele telo malo 4,5:1 aj nad bielou čiarou
 * značenia, ktorá je najsvetlejším miestom záberu. Zvislý scrim je dole
 * hustejší než na Domove (0,95), lebo pásmo je nižšie a titul stojí bližšie
 * k spodnej hrane.
 */
const SCRIM_ZVISLY =
  'linear-gradient(180deg, rgba(38,41,44,0.62) 0%, rgba(38,41,44,0.34) 24%, rgba(38,41,44,0.80) 60%, rgba(38,41,44,0.95) 100%)'
const SCRIM_VODOROVNY =
  'linear-gradient(90deg, rgba(38,41,44,0.66) 0%, rgba(38,41,44,0.24) 55%, rgba(38,41,44,0) 100%)'

/**
 * Pozadie hlavičky podstránky „O firme“ — záber, na ktorom stroj nanáša
 * vodorovné značenie.
 *
 * ## Prečo je video hore a nie uprostred stránky
 *
 * Predtým to bol celoplošný pás (`PasVideo`) medzi „Prístup“ a „Legislatívou“.
 * Stálo tam bez väzby na text nad ním aj pod ním — čitateľ prešiel od štyroch
 * tvrdení k šestnástim sekundám asfaltu a späť k vyhláškam, takže to pôsobilo
 * náhodne (výtka Petra, 4. 9. 2026). Ako pozadie hlavičky robí to isté video
 * prácu, ktorú tam predtým robil abstraktný `ZnacenieMotiv`: hovorí, čo firma
 * robí, hneď pod titulom a nekrája stránku na dve polovice.
 *
 * Hlavička si drží pevnú výšku (`--hlavicka-vyska`), preto je záber
 * `object-cover` a nie vo vlastnom pomere — orez je tu na mieste, lebo je to
 * podklad textu, nie samostatný obraz.
 *
 * ## Pravidlá sú tie isté ako pri hero videu na Domove (STANDARDY C5)
 *
 *  • **Poster je vždy v DOM** a video sa naň prelína až po `canplay`, takže
 *    pásmo nikdy nie je prázdny obdĺžnik.
 *  • **Video vzniká len nad 1024 px**, bez `prefers-reduced-motion` a bez
 *    `Save-Data`. Na telefóne je v DOM iba poster (75 kB), nie 2,3 MB videa.
 *  • `muted playsInline loop preload="metadata"`, bez ovládacích prvkov a
 *    `tabIndex={-1}` — je to plocha, nie prehrávač, do tabovania nepatrí.
 *
 * Celá vrstva je `aria-hidden`: je to dekoratívny podklad titulu, nie obsah,
 * a `alt` by čítačke ohlásil obrázok, ktorý nič nedopĺňa (STANDARDY A3).
 * V katalógu `REALIZACIE` tento súbor nie je, takže sa netvrdí, že je to
 * realizácia klienta.
 */
export default function HlavickaVideo() {
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
    // v tom prípade ostane a hlavička vyzerá ako fotografická.
    const prehraj = v.play()
    if (prehraj && typeof prehraj.catch === 'function') prehraj.catch(() => {})
    return undefined
  }, [chceVideo])

  return (
    <div
      data-hlavicka-video
      className="absolute inset-0 overflow-hidden bg-[var(--color-accent-2)]"
      aria-hidden="true"
    >
      <img
        src={`${BASE}video/poster.jpg`}
        srcSet={`${BASE}video/poster-960.jpg 960w, ${BASE}video/poster.jpg 1280w`}
        sizes="100vw"
        width={1280}
        height={720}
        alt=""
        fetchPriority="high"
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
        >
          <source src={`${BASE}video/znacenie.mp4`} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0" style={{ background: SCRIM_ZVISLY }} />
      <div className="absolute inset-0" style={{ background: SCRIM_VODOROVNY }} />
    </div>
  )
}
