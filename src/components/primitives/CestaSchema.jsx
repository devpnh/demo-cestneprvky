import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const BASE = import.meta.env.BASE_URL

/**
 * Úsek vozovky, na ktorý sa počas scrollovania **nastrieka značenie**.
 *
 * Nie je to video — je to fotografia asfaltu a nad ňou SVG vrstva značenia,
 * ktorej prvky pribúdajú podľa polohy scrollu.
 *
 * ## Prečo fotografia a nie plný SVG
 *
 * Prvá verzia mala aj vozovku ako SVG obdĺžnik v `--color-surface-2`. Peter
 * to 28. 8. 2026 odmietol slovami, že to vyzerá „ako robené v skicári", a mal
 * pravdu: rovná tmavá plocha s bielymi obdĺžnikmi je diagram, nie cesta.
 * Chýbalo jediné — povrch. Asfalt je zrnitý, má odtieňové mapy po valcovaní
 * a vyleštené stopy po kolesách, a práve to robí rozdiel medzi schémou
 * a niečím, čo vyzerá ako skutočný úsek.
 *
 * Podklad je preto fotografia (`95-asfalt-podklad.jpg`), vygenerovaná na to
 * cez Higgsfield (`nano_banana_pro`, 2 kredity) ako čistý asfalt bez jediného
 * značenia — práve preto, aby všetko značenie mohlo vzniknúť až tu a dalo sa
 * animovať. Fotografia klienta sa použiť nedala: na všetkých je značenie už
 * hotové.
 *
 * ## Čo robí značenie hodnoverným
 *
 * Tri veci, žiadna z nich nie je ozdoba:
 *
 * 1. **Farba nie je biela.** Studený plast je teplý lomený tón (`#e9e6df`),
 *    nie `#ffffff`. Čisto biela na fotografii asfaltu okamžite prezradí, že
 *    je to nalepený tvar.
 * 2. **Značenie má hrúbku.** Reálny nástrek stojí nad povrchom pár milimetrov
 *    a vrhá tieň. Rieši to jeden `feDropShadow` na celej vrstve značenia —
 *    jeden filter, nie trinásť.
 * 3. **Priehľadnosť 0,92.** Zrno asfaltu presvitá cez náter tak, ako presvitá
 *    aj v skutočnosti; pri plnom kryte pôsobí značenie ako nálepka.
 *
 * Varovné pásy majú navyše **rastrové výstupky** (`<pattern>` s krúžkami) —
 * to je presne ten prvok, ktorý firma osádza, a bez štruktúry by to bol len
 * červený obdĺžnik.
 *
 * ## Poradie
 *
 * Prvky pribúdajú v poradí, v akom sa práca robí: okraje vozovky, deliaca
 * čiara po čiarkach, priečna čiara, priechod pre chodcov zľava doprava
 * a nakoniec varovné pásy. Pri `prefers-reduced-motion` je schéma rovno celá.
 */

/** Vstupný rozsah `useTransform` musí byť prísne rastúci a v [0, 1]. */
const zovri = (v) => Math.min(1, Math.max(0, v))

/** Lomená biela studeného plastu. Nie `#ffffff` — tá na asfalte vyzerá nalepená. */
const NATER = '#e9e6df'

function Prvok({ progress, od, do: doKedy, zdola = true, reduced, children }) {
  const a = zovri(od)
  const b = zovri(Math.max(doKedy, od + 0.001))
  const opacity = useTransform(progress, [a, b], [0, 0.92])
  const posun = useTransform(progress, [a, b], [zdola ? 12 : -12, 0])

  if (reduced) return <g opacity="0.92">{children}</g>
  return <motion.g style={zdola ? { opacity, y: posun } : { opacity, x: posun }}>{children}</motion.g>
}

const CIARKY = [40, 116, 192, 268, 344]
const PRUHY = [84, 132, 180, 228, 276]

export default function CestaSchema({ className = '' }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'end 0.5'] })

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden bg-[var(--color-surface-2)] ${className}`}
      style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-sm)' }}
    >
      <img
        src={`${BASE}assets/95-asfalt-podklad.jpg`}
        width={671}
        height={1000}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <svg
        viewBox="0 0 400 600"
        role="img"
        aria-label="Úsek vozovky so značením: okraje, deliaca čiara, priečna čiara, priechod pre chodcov a varovné pásy"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Jeden tieň na celú vrstvu značenia — nie trinásť filtrov.
              Dáva náteru hrúbku; bez neho leží farba v rovine fotografie. */}
          <filter id="cesta-vystup" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.6" stdDeviation="1.1" floodColor="#000" floodOpacity="0.5" />
          </filter>
          {/* Výstupky varovného pásu. Bez nich je to červený obdĺžnik; s nimi
              je to prvok, ktorý pod nohou aj palicou naozaj cítiť. */}
          <pattern id="cesta-vystupky" width="13" height="13" patternUnits="userSpaceOnUse">
            <circle cx="6.5" cy="6.5" r="3.4" fill="#000" fillOpacity="0.22" />
            <circle cx="6.5" cy="5.6" r="3.4" fill="#fff" fillOpacity="0.13" />
          </pattern>
        </defs>

        <g filter="url(#cesta-vystup)">
          <Prvok progress={scrollYProgress} od={0} do={0.12} reduced={reduced}>
            <rect x="34" y="0" width="6" height="600" fill={NATER} />
            <rect x="360" y="0" width="6" height="600" fill={NATER} />
          </Prvok>

          {CIARKY.map((y, i) => (
            <Prvok
              key={y}
              progress={scrollYProgress}
              od={0.14 + i * 0.052}
              do={0.14 + i * 0.052 + 0.06}
              reduced={reduced}
            >
              <rect x="194" y={y} width="12" height="48" fill={NATER} />
            </Prvok>
          ))}

          <Prvok progress={scrollYProgress} od={0.44} do={0.52} reduced={reduced}>
            <rect x="40" y="424" width="320" height="10" fill={NATER} />
          </Prvok>

          {PRUHY.map((x, i) => (
            <Prvok
              key={x}
              progress={scrollYProgress}
              od={0.54 + i * 0.042}
              do={0.54 + i * 0.042 + 0.05}
              zdola={false}
              reduced={reduced}
            >
              <rect x={x} y="452" width="30" height="86" fill={NATER} />
            </Prvok>
          ))}

          <Prvok progress={scrollYProgress} od={0.78} do={0.94} reduced={reduced}>
            <g>
              <rect x="40" y="556" width="146" height="26" fill="var(--color-accent)" />
              <rect x="40" y="556" width="146" height="26" fill="url(#cesta-vystupky)" />
              <rect x="214" y="556" width="146" height="26" fill="var(--color-accent)" />
              <rect x="214" y="556" width="146" height="26" fill="url(#cesta-vystupky)" />
            </g>
          </Prvok>
        </g>
      </svg>
    </div>
  )
}
