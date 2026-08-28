import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const BASE = import.meta.env.BASE_URL

/**
 * Priechod pre chodcov v diagonálnom zábere, ktorý sa scrollom **nastrieka**.
 *
 * Nie je to video — je to fotografia asfaltu a nad ňou SVG vrstva značenia,
 * ktorej prvky pribúdajú podľa polohy scrollu.
 *
 * ## Skladba
 *
 * Vzor je referencia, ktorú poslal Peter (28. 8. 2026): pohľad zhora, ale
 * **natočený o 22°**, so značením, ktoré vybieha zo všetkých štyroch strán.
 * Tri veci z nej robia obraz namiesto schémy:
 *
 * 1. **Diagonála.** Vodorovné pruhy sú statické; natočená sústava má smer
 *    a pohyb, aj keď stojí.
 * 2. **Značenie preteká cez okraje.** Nič nie je vycentrované ani celé
 *    v ráme, takže rám prestane byť hranicou obrázka a stane sa výrezom
 *    z niečoho väčšieho. Preto tu nie je maska ani vinetácia — orez robí
 *    prácu za ne.
 * 3. **Tri druhy prvkov, nie jeden.** Zebra, prerušovaná deliaca čiara
 *    a signálne pásy v akcente. Jediný druh vyzerá ako vzorka, tri ako úsek.
 *
 * Proti referencii je rozdiel v jednej veci: tam je asfalt plochý sivý
 * gradient, tu je to fotografia (`95-asfalt-podklad.jpg`, generovaná cez
 * Higgsfield ako čistý povrch bez značenia, aby všetko značenie mohlo vzniknúť
 * až tu a dalo sa animovať). Fotografia klienta sa použiť nedala: na všetkých
 * je značenie už hotové.
 *
 * ## Čo robí značenie hodnoverným
 *
 * Farba nie je biela (`#e9e6df` — studený plast je teplý lomený tón, čisto
 * biela na fotografii asfaltu okamžite prezradí nalepený tvar), značenie má
 * hrúbku (jeden `feDropShadow` na celej vrstve, nie filter na každom prvku)
 * a priehľadnosť 0,92, takže zrno asfaltu presvitá cez náter tak ako v
 * skutočnosti.
 *
 * Signálne pásy majú navyše **ryhovanie** (`<pattern>`) a hlbší tieň než
 * náter: sú to osadené prvky stojace nad vozovkou, nie farba na nej. Je to
 * presne ten prvok, ktorým sa firma živí.
 *
 * ## Poradie
 *
 * Deliaca čiara, potom zebra pruh po pruhu naprieč záberom, nakoniec signálne
 * pásy. Pri `prefers-reduced-motion` je záber rovno celý.
 */

/** Vstupný rozsah `useTransform` musí byť prísne rastúci a v [0, 1]. */
const zovri = (v) => Math.min(1, Math.max(0, v))

/** Lomená biela studeného plastu. Nie `#ffffff` — tá na asfalte vyzerá nalepená. */
const NATER = '#e9e6df'

function Prvok({ progress, od, do: doKedy, reduced, children }) {
  const a = zovri(od)
  const b = zovri(Math.max(doKedy, od + 0.001))
  const opacity = useTransform(progress, [a, b], [0, 0.94])
  const posun = useTransform(progress, [a, b], [26, 0])

  if (reduced) return <g opacity="0.94">{children}</g>
  return <motion.g style={{ opacity, x: posun }}>{children}</motion.g>
}

/** Zebra: osem pruhov, ktoré presahujú cez obe bočné hrany. */
const ZEBRA = Array.from({ length: 8 }, (_, i) => -150 + i * 108)
/** Prerušovaná deliaca čiara nad zebrou a pod ňou. */
const CIARKY = Array.from({ length: 8 }, (_, i) => -200 + i * 132)

export default function CestaSchema({ className = '' }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  // Rozsah aj okná prvkov sú premerané, nie odhadnuté.
  //
  // Verzia 1: rozsah `start 0.95 → end 0.5`, okná stlačené do jeho začiatku.
  // Namerané: keď bol vrch pásma na 500 px, bolo hotových 8 zo 17 prvkov —
  // celá deliaca čiara sa vykreslila skôr, než sa na ňu dalo pozrieť.
  //
  // Verzia 2: `start 0.9 → end 0.65`, okná rozložené po celej dráhe. Lepšie,
  // ale stále zle, a chyba bola v tom, ČO som meral: sledoval som viditeľnosť
  // ZÁBERU, nie polohu v pásme. Progres 1 nastal, keď mal záber vrch na
  // −22 px — sám o sebe „viditeľný na 95 %", lenže čitateľ je v tej chvíli
  // dávno za pásmom a signálne pásy mu nabehli za chrbtom.
  //
  // Verzia 3: dráha končí, keď je záber CELÝ v okne (`end 0.85`, teda spodok
  // na 765 px a vrch na ~158 px), a posledný prvok dobehne ešte pred koncom
  // dráhy (okno 0,72–0,88). Akcentové pásy tak vzniknú v okamihu, keď je
  // záber najlepšie vidieť, nie keď odchádza.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'end 0.85'] })

  return (
    <div
      ref={ref}
      // Bez pevného pomeru strán: rám sa naťahuje na výšku celého pásma
      // (grid je `items-stretch`), takže záber a text vedľa neho končia na
      // jednej linke. `min-h` je poistka, keby textový stĺpec raz skrátol.
      className={`relative h-full min-h-[24rem] w-full overflow-hidden bg-[var(--color-surface-2)] ${className}`}
      style={{ borderRadius: 'var(--radius-lg)' }}
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

      {/* Svetlo cez povrch. Referencia má asfalt ako gradient — fotografia je
          rovnomernejšia, takže svetlo dopĺňa toto: rozjasnenie vľavo hore
          a stmavenie k pravému spodnému rohu. Bez neho je povrch plochý. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(148deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 34%, rgba(12,14,16,0.30) 78%, rgba(12,14,16,0.46) 100%)',
        }}
      />

      {/* viewBox je zámerne väčší než súradnice prvkov a má presne pomer rámu
          (1040 : 780 = 4 : 3), takže `slice` nič nezväčšuje ani neoreže
          nesymetricky. Prvá verzia mala štvorcový viewBox v 4 : 3 ráme a
          `slice` ho nafúkol tak, že v zábere ostali štyri obrovské pruhy
          namiesto celej kompozície. */}
      <svg
        viewBox="-220 -60 1040 780"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Priechod pre chodcov: deliaca čiara, priečne pruhy a signálne pásy pre nevidiacich"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="cesta-vystup" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="1.4" dy="2" stdDeviation="1.4" floodColor="#000" floodOpacity="0.5" />
          </filter>
          {/* Signálny pás stojí nad vozovkou výrazne viac než nástrek (je to
              osadený prvok, nie farba), preto má vlastný, hlbší tieň. */}
          <filter id="cesta-pas" x="-16%" y="-16%" width="132%" height="132%">
            <feDropShadow dx="2" dy="3.4" stdDeviation="2.4" floodColor="#000" floodOpacity="0.62" />
          </filter>
          {/* Ryhovanie signálneho pásu — bez neho je to len farebný obdĺžnik. */}
          <pattern id="cesta-ryhy" width="20" height="10" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="9" height="10" fill="#000" fillOpacity="0.20" />
            <rect x="9" y="0" width="2" height="10" fill="#fff" fillOpacity="0.16" />
          </pattern>
        </defs>

        {/* Celá sústava je natočená. Rotácia je na skupine, nie na jednotlivých
            prvkoch: tie sú v pravouhlých súradniciach, čo drží kód čitateľný
            a rozostupy presné. */}
        <g transform="rotate(-22 300 330)">
          <g filter="url(#cesta-vystup)">
            {CIARKY.map((x, i) => (
              <Prvok
                key={`c${x}`}
                progress={scrollYProgress}
                od={i * 0.028}
                do={i * 0.028 + 0.05}
                reduced={reduced}
              >
                <rect x={x} y="16" width="74" height="13" rx="1" fill={NATER} />
                <rect x={x} y="588" width="74" height="13" rx="1" fill={NATER} />
              </Prvok>
            ))}

            {ZEBRA.map((x, i) => (
              <Prvok
                key={`z${x}`}
                progress={scrollYProgress}
                od={0.27 + i * 0.05}
                do={0.27 + i * 0.05 + 0.07}
                reduced={reduced}
              >
                <rect x={x} y="112" width="66" height="394" rx="2" fill={NATER} />
              </Prvok>
            ))}
          </g>

          <Prvok progress={scrollYProgress} od={0.72} do={0.88} reduced={reduced}>
            <g filter="url(#cesta-pas)">
              <rect x="-220" y="52" width="520" height="42" rx="3" fill="var(--color-accent)" />
              <rect x="-220" y="52" width="520" height="42" rx="3" fill="url(#cesta-ryhy)" />
              <rect x="330" y="520" width="520" height="42" rx="3" fill="var(--color-accent)" />
              <rect x="330" y="520" width="520" height="42" rx="3" fill="url(#cesta-ryhy)" />
            </g>
          </Prvok>
        </g>
      </svg>
    </div>
  )
}
