import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { altFotky } from './fotky.js'

const BASE = import.meta.env.BASE_URL

/** Geometria SVG vozovky. Uzly aj oblúk počítajú z tých istých čísel. */
const STRED = 300
const POLOMER = 240
const SIRKA_VOZOVKY = 52
const OBVOD = 2 * Math.PI * POLOMER
/** Koľko stupňov zaberá akcentový oblúk pod aktívnym uzlom. */
const OBLUK_STUPNE = 30

/**
 * Kruhový objazd služieb: podpisový prvok webu a prvok z odboru klienta.
 * Deväť fotiek stojí na asfaltovom prstenci, v strede je ostrovček s fotkou
 * aktívnej služby a po vozovke k nej obieha akcentový oblúk.
 *
 * ## Prečo uzly NEOBIEHAJÚ
 *
 * Prvá verzia otáčala celý veniec uzlov (`orbit-spin`, 80 s na otáčku) a
 * uzly si protirotáciou držali vzpriamenú fotku. Vyzeralo to dobre a
 * nefungovalo to: uzol sa pod kurzorom hýbe, takže sa naň nedá trafiť, a
 * keď sa trafíte, `onMouseEnter` objazd zastaví — kurzor však medzitým
 * skĺzol vedľa, `onMouseLeave` ho pustí a uzol utečie. To bola Petrova
 * výtka „koleso vôbec nefunguje a glitchuje pri prepínaní“ (27. 8. 2026).
 *
 * Uzly preto stoja. Pohyb nesie **akcentový oblúk**, ktorý po vozovke
 * prebehne k práve aktívnej službe, a prelínačka fotky v strede. Cieľ na
 * kliknutie je tým pádom nehybný a stav sa mení len vtedy, keď to
 * návštevník naozaj chce.
 *
 * Oblúk sa točí po kratšej strane: uhol sa drží ako **spojitá** hodnota a
 * pri zmene sa k nej pripočíta rozdiel normalizovaný do (−180°, 180°]. Bez
 * toho by prechod z deviatej služby na prvú (340° → 0°) obehol dookola.
 *
 * Automatický posun beží, kým nad objazdom nedrží návštevník kurzor ani
 * fokus. `setTimeout` a nie `setInterval`: po ručnej zmene sa odpočet
 * začína odznova, takže vybraná služba nezmizne po zlomku sekundy.
 * Pri `prefers-reduced-motion` sa neposúva nič a oblúk skáče bez prechodu.
 */
export default function KruhovyObjazd({
  sluzby,
  active,
  onActive,
  reduced = false,
  velkost = 660,
  uzol = 72,
  interval = 4500,
}) {
  const pocet = sluzby.length
  const [drziKurzor, setDrziKurzor] = useState(false)
  const [drziFokus, setDrziFokus] = useState(false)
  const stoji = reduced || drziKurzor || drziFokus

  // Spojitý uhol oblúka. Rastie alebo klesá po kratšej strane, takže sa
  // nikdy neobrátí dokola.
  const [uhol, setUhol] = useState(() => (active / pocet) * 360)
  const uholRef = useRef(uhol)
  useEffect(() => {
    const ciel = (active / pocet) * 360
    const rozdiel = (((ciel - uholRef.current) % 360) + 540) % 360 - 180
    uholRef.current += rozdiel
    setUhol(uholRef.current)
  }, [active, pocet])

  useEffect(() => {
    if (stoji) return undefined
    const t = setTimeout(() => onActive((active + 1) % pocet), interval)
    return () => clearTimeout(t)
  }, [active, stoji, pocet, interval, onActive])

  /**
   * Predchádzajúca fotka ostrovčeka. Bez nej sa dve fotky prelínali OBE
   * priesvitné naraz — v polovici prechodu presvitala jedna cez druhú a
   * vyzeralo to ako porucha, nie ako prelínačka (výtka Petra „glitchuje pri
   * prepínaní“, 27. 8. 2026).
   *
   * Správne prelínanie potrebuje spodnú vrstvu nepriehľadnú: odchádzajúca
   * fotka ostáva na `opacity: 1` pod prichádzajúcou, kým tá nabehne, a
   * zhasne až potom — vtedy ju už prekrýva nepriehľadná nová.
   */
  const [predchadzajuca, setPredchadzajuca] = useState(active)
  useEffect(() => {
    if (predchadzajuca === active) return undefined
    const t = setTimeout(() => setPredchadzajuca(active), 620)
    return () => clearTimeout(t)
  }, [active, predchadzajuca])

  const vyber = useCallback((i) => () => onActive(i), [onActive])

  const dlzkaObluka = (OBVOD * OBLUK_STUPNE) / 360

  return (
    <div
      data-objazd=""
      className="relative mx-auto aspect-square w-full select-none"
      style={{ maxWidth: `${velkost}px` }}
      onMouseEnter={() => setDrziKurzor(true)}
      onMouseLeave={() => setDrziKurzor(false)}
      onFocusCapture={() => setDrziFokus(true)}
      onBlurCapture={() => setDrziFokus(false)}
    >
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* Vozovka: asfaltový prstenec, vlasové krajnice, prerušovaná stredová čiara */}
        <circle cx={STRED} cy={STRED} r={POLOMER} fill="none" stroke="var(--color-surface-2)" strokeWidth={SIRKA_VOZOVKY} />
        <circle cx={STRED} cy={STRED} r={POLOMER + SIRKA_VOZOVKY / 2} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx={STRED} cy={STRED} r={POLOMER - SIRKA_VOZOVKY / 2} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle
          cx={STRED}
          cy={STRED}
          r={POLOMER}
          fill="none"
          stroke="var(--color-bg)"
          strokeWidth="2.5"
          strokeDasharray="16 14"
        />

        {/* Akcentový oblúk pod aktívnym uzlom. Vnútorný `rotate` ho posadí
            pod uzol na dvanástej hodine, vonkajší ho vedie k aktívnemu. */}
        <g
          data-objazd-oblúk=""
          style={{
            transform: `rotate(${uhol}deg)`,
            transformOrigin: `${STRED}px ${STRED}px`,
            transition: reduced ? 'none' : 'transform 700ms var(--ease-house)',
          }}
        >
          <circle
            cx={STRED}
            cy={STRED}
            r={POLOMER}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={SIRKA_VOZOVKY}
            strokeOpacity="0.92"
            strokeDasharray={`${dlzkaObluka} ${OBVOD}`}
            transform={`rotate(${-90 - OBLUK_STUPNE / 2} ${STRED} ${STRED})`}
          />
        </g>
      </svg>

      {/* Stredový ostrovček: fotka aktívnej služby presne v mieste pozornosti.
          Neaktívne fotky majú prázdny `alt` zámerne, sú to vrstvy jedného
          prelínania, do prístupnostného stromu patrí len tá viditeľná. */}
      <div
        data-hub=""
        className="absolute left-1/2 top-1/2 h-[52.7%] w-[52.7%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        {sluzby.map((s, i) => {
          const jeAktivna = i === active
          const jePredchadzajuca = i === predchadzajuca
          return (
            <img
              key={s.slug}
              src={`${BASE}assets/${s.dlazdica.src}`}
              width={s.dlazdica.w}
              height={s.dlazdica.h}
              alt={jeAktivna ? altFotky(s.dlazdica) : ''}
              aria-hidden={jeAktivna ? undefined : 'true'}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover ${
                reduced ? '' : 'transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-house)]'
              } ${jeAktivna ? 'scale-100 opacity-100' : jePredchadzajuca ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
              style={{ zIndex: jeAktivna ? 2 : jePredchadzajuca ? 1 : 0 }}
            />
          )
        })}
      </div>

      {/* Nehybné uzly. Polohy sú v percentách, nie v pixeloch odvodených od
          `velkost`: SVG vozovka sa škáluje cez `viewBox`, takže pixelový
          polomer by sa od nej odtrhol na každej inej šírke stĺpca. Uzol sedí
          na kružnici s polomerom 40 % vďaka `inset-[10%]` na otočenom bode a
          protirotácia drží fotku vzpriamenú. */}
      {/*
        Obaly uzlov MUSIA byť `pointer-events-none`. Každý z deviatich je
        priehľadný štvorec cez celú plochu objazdu a prekrývajú sa; bez toho
        chytal všetky pohyby myši ten posledný v poradí a na uzly 1 až 8 sa
        nedalo ani kliknúť, ani na ne nabehnúť kurzorom. Playwright to hlási
        doslova: „div.absolute.inset-[10%] intercepts pointer events“.
        Bola to hlavná časť výtky „koleso vôbec nefunguje“ (27. 8. 2026).
        Ukazovateľ si zapína späť až samotný odkaz.
      */}
      <div className="pointer-events-none absolute inset-0">
        {sluzby.map((s, i) => {
          // Uzol stojí na hornom okraji otočeného štvorca, teda na −90° jeho
          // vlastnej sústavy. Výsledný uhol na kružnici je preto
          // `−90 + i · (360 / počet)` a nula uzlov sedí na dvanástej hodine —
          // presne tam, kde ju hľadá akcentový oblúk.
          const uholUzla = (i / pocet) * 360
          const jeAktivna = i === active
          return (
            <div key={s.slug} className="absolute inset-[10%]" style={{ transform: `rotate(${uholUzla}deg)` }}>
              <div
                className="absolute left-1/2 top-0"
                style={{
                  height: `${uzol}px`,
                  width: `${uzol}px`,
                  marginLeft: `${-uzol / 2}px`,
                  marginTop: `${-uzol / 2}px`,
                  transform: `rotate(${-uholUzla}deg)`,
                }}
              >
                <Link
                  to={`/sluzby/${s.slug}`}
                  aria-label={s.nazov}
                  onMouseEnter={vyber(i)}
                  onFocus={vyber(i)}
                  className={`pointer-events-auto block overflow-hidden rounded-full ${
                    reduced ? '' : 'transition-[transform,border-color] duration-[var(--duration-fast)] ease-[var(--ease-house)]'
                  } ${
                    jeAktivna
                      ? 'scale-[1.18] border-[3px] border-[var(--color-bg)]'
                      : 'border-2 border-[var(--color-bg)] hover:scale-[1.08]'
                  }`}
                  style={{ height: `${uzol}px`, width: `${uzol}px` }}
                >
                  <img
                    src={`${BASE}assets/${s.dlazdica.src}`}
                    width={s.dlazdica.w}
                    height={s.dlazdica.h}
                    alt={altFotky(s.dlazdica)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
