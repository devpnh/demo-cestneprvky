import { Sekcia, MonoStitok } from '../../../components/kit/index.js'
import { Reveal } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'

/**
 * Aktuality — jediná položka z pôvodného webu.
 *
 * `url` je `null`, preto to nie je odkaz, len titulok a rok. Telo článku
 * ani adresu média podklady neobsahujú a poznámku o tom, že chýbajú, nemá
 * návštevník čítať (pýtame si ju v `poznamky/HANDOVER.md`).
 *
 * Pásmo je na malom odsadení a nadpis stojí vedľa položky, nie nad ňou: na
 * plnom odsadení so samostatnou hlavičkou zaberal jeden titulok bez odkazu
 * pol obrazovky. Delenie je na polovice ako po celej stránke — predtým tu
 * bolo 4/8, teda ďalšia zvislá os navyše (`HlavickaPasma`).
 *
 * Fotografiu k titulku nedávame — článok je o bezpečnostných ostrovčekoch
 * a záber lepeného ostrovčeka si v `sluzby.js` od klienta práve pýtame.
 *
 * Sekcia sa vykreslí len vtedy, keď v dátach niečo je.
 */
export default function Aktuality() {
  if (!FIRMA.aktuality?.length) return null

  return (
    <Sekcia id="aktuality" pasmo="biela" padding="male">
      <Reveal className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
        <h2 className="max-w-[12ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          Aktuality
        </h2>

        <ul className="lg:pt-[0.9rem]">
          {FIRMA.aktuality.map((clanok, i) => (
            <li
              key={clanok.titulok}
              className={`border-t border-[var(--color-text)] ${i === 0 ? '' : 'mt-10'} pt-5`}
            >
              <MonoStitok>{String(clanok.rok)}</MonoStitok>
              <h3 className="mt-4 max-w-[34ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {clanok.titulok}
              </h3>
            </li>
          ))}
        </ul>
      </Reveal>
    </Sekcia>
  )
}
