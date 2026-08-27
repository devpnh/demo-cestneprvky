import { Sekcia, SekciaHlavicka, Fotka, Tlacidlo } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

/**
 * Tri zábery na Domov, nie šesť.
 *
 * Šesť rovnakých dlaždíc 4 : 3 bol na tejto stránke už tretí pravidelný
 * raster fotiek pod sebou a celok pôsobil ako sklad obrázkov (výtka Petra,
 * 27. 8. 2026). Domov má ukázať, nie vymenovať: jeden vedúci záber cez
 * sedem stĺpcov a dva menšie vedľa neho. Celá galéria je na `/realizacie`
 * a vedie tam odkaz v hlavičke sekcie.
 *
 * Výber je podľa `id`, nie podľa poradia v poli, aby doplnenie fotky do
 * `realizacie.js` výber nepremiešalo. Kritérium ostáva z kola 4: fotka sa
 * nesmie vyskytovať inde na `/` (dlaždice objazdu, sticky Debarierizácia,
 * záber v Prečo), aby Domov neopakoval sám seba.
 */
const VYBER_ID = [
  'zubacka-nastupiste', // Vodiaca línia · Zubačka
  'signalny-pas-priechod-ba', // Signálny pás · Bratislava
  'nivy-interier-vstup', // Vodiaca línia v interiéri · Bratislava Nivy
]

const VYBER = VYBER_ID.map((id) => GALERIA.find((r) => r.id === id)).filter(Boolean)

/**
 * Popis fotky je fakt. Pravidlo, čo sa smie napísať pod ktorú fotku, je jedno
 * pre celý web a býva v `Realizacie/skupiny.js`; teaser z neho berie prvú časť
 * (doložené miesto, inak prostredie, pri produktovej fotke jej pomenovanie),
 * aby sa popisky Domova a galérie nikdy nerozišli.
 */
const popis = (r) => `${r.prvok} · ${castiPopisu(r)[0]}`

const [VEDUCI, ...VEDLAJSIE] = VYBER

export default function RealizacieVyber() {
  return (
    <Sekcia id="realizacie" pasmo="biela">
      <SekciaHlavicka
        stitok="Realizácie"
        nadpis="Osadené prvky na konkrétnych miestach"
        akcia={
          <Tlacidlo variant="tichy" to="/realizacie">
            {`Všetkých ${GALERIA.length} realizácií`}
          </Tlacidlo>
        }
      />

      <Stagger className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-12">
        {VEDUCI ? (
          <StaggerItem className="lg:col-span-7">
            <Fotka
              src={VEDUCI.src}
              w={VEDUCI.w}
              h={VEDUCI.h}
              alt={VEDUCI.alt}
              pomer="4/3"
              popis={popis(VEDUCI)}
              sizes="(min-width: 1024px) 58vw, 100vw"
              maxSirka={Infinity}
              className="[&_figcaption]:border-t [&_figcaption]:border-[var(--color-border)] [&_figcaption]:pt-4"
            />
          </StaggerItem>
        ) : null}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {VEDLAJSIE.map((r) => (
            <StaggerItem key={r.id}>
              <Fotka
                src={r.src}
                w={r.w}
                h={r.h}
                alt={r.alt}
                pomer="3/2"
                popis={popis(r)}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                className="[&_figcaption]:border-t [&_figcaption]:border-[var(--color-border)] [&_figcaption]:pt-4"
              />
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </Sekcia>
  )
}
