import { useState } from 'react'
import { MonoStitok } from '../../components/kit/index.js'
import MapaSlovenska from '../../components/MapaSlovenska.jsx'
import { sadzba } from '../../lib/sadzba.js'
import { MAPA_BODY } from '../../content/mapa.js'
import { MIESTA_REALIZACII } from '../../content/realizacie.js'

/**
 * Mapa miest realizácií.
 *
 * Obrys aj značky kreslí zdieľaný `components/MapaSlovenska.jsx` — to isté
 * SVG používa `/kontakt` pre samotné sídlo. Tu k nemu pribúda pätnásť bodov
 * a zoznam miest vedľa nich.
 *
 * Mapa je dekorácia k zoznamu, nie náhrada zaň — zoznam pätnástich miest
 * stojí vedľa nej a je to on, čo číta odčítač obrazovky.
 *
 * Body sa neoznačujú menovkami: pätnásť popiskov na takto malej ploche by sa
 * prekrývalo. Meno sa ukazuje pri prejdení myšou nad bodom alebo nad položkou
 * zoznamu, a to v pevnom riadku pod mapou, aby sa nič neposúvalo.
 */
export default function MapaRealizacii() {
  const [aktivne, setAktivne] = useState(null)

  return (
    <div className="mt-16 border-t border-[var(--color-border)] pt-8">
      <MonoStitok>Miesta realizácií</MonoStitok>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-7">
          <MapaSlovenska
            body={MAPA_BODY}
            aktivne={aktivne}
            naNajazd={setAktivne}
            popis={`Mapa Slovenska s ${MAPA_BODY.length} miestami realizácií a so sídlom firmy v Žiline`}
          />

          {/* Pevný riadok: mení sa text, nie výška, takže mapa pod kurzorom neposkakuje. */}
          <p className="mt-4 min-h-[1.5rem] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {aktivne || sadzba(`Sídlo Žilina a ${MAPA_BODY.length} doložených miest realizácií`)}
          </p>
        </div>

        {/* Dva stĺpce aj na `lg`: pätnásť položiek pod sebou meria vyše 700 px,
            teda dvojnásobok mapy, a ľavý stĺpec by pod ňou zíval prázdny. */}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:col-span-5">
          {MIESTA_REALIZACII.map((m) => (
            <li
              key={m}
              onMouseEnter={() => setAktivne(m)}
              onMouseLeave={() => setAktivne(null)}
              className={`border-b border-[var(--color-border)] py-2 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] transition-colors duration-[var(--duration-fast)] ${
                aktivne === m ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'
              }`}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
