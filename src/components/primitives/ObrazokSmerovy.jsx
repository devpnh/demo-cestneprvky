import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const BASE = import.meta.env.BASE_URL

/**
 * Rám, do ktorého sa fotka **vytrie z tej strany, z ktorej prišiel kurzor**.
 *
 * Prevzatý vzor: `saurabh-2607/great-ui-image-hover-reveal` z 21st.dev, variant
 * `directional`. Z predlohy ostáva jadro — uhol kurzora voči stredu prvku cez
 * `Math.atan2` preložený na jednu zo štyroch strán a `clip-path: inset()` ako
 * spôsob výteru. Prepísané je zvyšné: predloha vytiera jednu fotku v jednom
 * boxe pri nájazde naň, my vytierame **N fotiek v jednom ráme, riadené
 * nájazdom na riadok zoznamu vedľa rámu**. Smer sa preto neberie zo vstupu do
 * rámu (do toho kurzor nikdy nevojde), ale zo vstupu do riadku.
 *
 * ## Prečo dve vrstvy, a nie N
 *
 * Prvá verzia mala všetkých päť fotiek ako vrstvy nad sebou a neaktívne
 * animovala do skrytého stavu. Vyzeralo to správne na papieri a zle na
 * obrazovke: prichádzajúca aj odchádzajúca fotka sa zrezávajú k tej istej
 * hrane, takže v polovici výteru obe zaberali spodnú polovicu rámu a horná
 * polovica bola holé pozadie — cez celý prechod preblikával tmavý pruh.
 *
 * Preto sú vrstvy presne dve: **spodok** drží predchádzajúcu fotku celú a
 * nehybnú, **vrch** je tá nová a vytiera sa cez ňu. Pod výterom je tak vždy
 * obraz, nikdy pozadie. Po dobehnutí sa vrch stane spodkom.
 *
 * ## Prístupnosť a klávesnica
 *
 * Riadky sú `<button>` a fokus prepína rovnako ako nájazd; pri klávesnici
 * neexistuje uhol, preto volajúci posiela smer odvodený od poradia (nový index
 * vyšší než starý = zdola, nižší = zhora). Pohyb tak sleduje pohyb v zozname.
 * Pri `prefers-reduced-motion` sa fotka len prepne, bez výteru.
 *
 * `alt` nesie len vrchná vrstva — spodok je v tej chvíli podklad pod výterom
 * a čítačka by inak ohlásila dva popisy naraz.
 *
 * ## Vrstva môže byť aj text
 *
 * Záber bez `src`, ktorý má `text`, sa vykreslí ako typografický panel na
 * akcentovej ploche. Je to pre prípad, keď k položke zoznamu podklady
 * doloženú fotografiu NEMAJÚ: doplniť ju záberom „na tému" sa nesmie a
 * nechať prázdny rám je diera. Tvrdenie sa preto vysádže — panel prejde tým
 * istým výterom ako fotka, takže sa z rytmu nevymyká.
 */

/** Uhol kurzora voči stredu prvku → strana, z ktorej prišiel. */
export function smerZUdalosti(e, prvok) {
  if (!prvok) return 'bottom'
  const { left, top, width, height } = prvok.getBoundingClientRect()
  const x = e.clientX - left - width / 2
  const y = e.clientY - top - height / 2
  const uhol = (Math.atan2(y, x) * 180) / Math.PI
  if (uhol > -45 && uhol <= 45) return 'right'
  if (uhol > 45 && uhol <= 135) return 'bottom'
  if (uhol > -135 && uhol <= -45) return 'top'
  return 'left'
}

/** Skrytý stav výteru pre danú stranu. Fotka je zrezaná na nulu pri tej hrane. */
const SKRYTY = {
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}
const PLNY = 'inset(0% 0% 0% 0%)'

function Vrstva({ zaber, style, alt, ...rest }) {
  if (!zaber.src && zaber.text) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-[var(--color-accent)] p-8 lg:p-12"
        style={style}
        {...rest}
      >
        {zaber.stitok ? (
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.82)]">
            {zaber.stitok}
          </p>
        ) : null}
        <p className="mt-4 max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-on-accent)]">
          {zaber.text}
        </p>
      </motion.div>
    )
  }
  return (
    <motion.img
      src={`${BASE}assets/${zaber.src}`}
      width={zaber.w}
      height={zaber.h}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
      style={style}
      {...rest}
    />
  )
}

/**
 * @param {Array<{src,w,h,alt}>} zabery  Fotky v poradí riadkov zoznamu.
 * @param {number} aktivny  Index práve zvolenej fotky.
 * @param {'top'|'bottom'|'left'|'right'} smer  Strana, z ktorej má vytrieť.
 */
export default function ObrazokSmerovy({ zabery, aktivny, smer = 'bottom', pomer = '4/3', className = '' }) {
  const reduced = useReducedMotion()
  const [spodok, setSpodok] = useState(aktivny)
  // Smer sa zmrazí vo chvíli, keď sa výter spustí. Keby sa čítal priebežne,
  // ďalší pohyb myšou po riadku by prepísal `clip-path` uprostred prechodu
  // a fotka by sa počas dojazdu zlomila do inej osi.
  const smerVyteru = useRef(smer)
  if (aktivny !== spodok) smerVyteru.current = smer

  // Pri `prefers-reduced-motion` neexistuje prechod, takže spodok nemá čo
  // dobiehať — drží sa rovno na aktívnej fotke.
  useEffect(() => {
    if (reduced) setSpodok(aktivny)
  }, [reduced, aktivny])

  const vrch = zabery[aktivny]
  const pod = zabery[spodok]
  const prechod = spodok !== aktivny

  return (
    <div
      className={`relative w-full overflow-hidden bg-[var(--color-accent-2)] ${className}`}
      style={{ aspectRatio: pomer, borderRadius: 'var(--radius-sm)' }}
    >
      {prechod && pod ? <Vrstva zaber={pod} alt="" style={{ zIndex: 0 }} /> : null}
      {vrch ? (
        <Vrstva
          // `key` na indexe je tu zámerné: nová fotka MÁ vzniknúť ako nový
          // prvok, aby `initial` (skrytý stav) naozaj platil. Bez remountu by
          // `motion` animoval z aktuálnej hodnoty a prvý výter by sa nekonal.
          key={aktivny}
          zaber={vrch}
          alt={vrch.alt}
          style={{ zIndex: 1 }}
          initial={{ clipPath: prechod && !reduced ? SKRYTY[smerVyteru.current] : PLNY }}
          animate={{ clipPath: PLNY }}
          transition={
            reduced
              ? { duration: 0 }
              : // Výter je rýchlejší než dojazd ostatných animácií webu: je to
                // reakcia na kurzor, nie príchod obsahu. Nad 0,5 s začne
                // pôsobiť ako lag myši (merané na 0,4 / 0,55 / 0,7 s).
                { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
          }
          onAnimationComplete={() => setSpodok(aktivny)}
        />
      ) : null}
    </div>
  )
}
