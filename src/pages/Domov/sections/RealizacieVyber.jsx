import { Sekcia, SekciaHlavicka, Fotka, Tlacidlo } from '../../../components/kit/index.js'
import { Stagger, StaggerItem, Reveal } from '../../../components/primitives/index.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

/**
 * Šesť záberov na Domov. Vyberáme podľa `id`, nie podľa poradia v poli, aby
 * doplnenie fotky do `realizacie.js` výber nepremiešalo.
 *
 * Kritérium sa zmenilo: pôvodná šestica mala všetky miesta doložené, ale päť
 * zo šiestich fotiek stálo aj inde na tej istej stránke (dlaždice služieb,
 * sticky Debarierizácia, sekcia Prečo). Výber tak bol prakticky opakovaním
 * Domova. Teraz je prvým kritériom, aby sa fotka **inde na `/` nevyskytovala**,
 * a druhým, aby šesť záberov ukázalo šesť rôznych typov prvkov aj prostredí.
 *
 * Cena za to je, že tri zo šiestich miest nie sú doložené. Popisok ich preto
 * nevypisuje (pravidlo `castiPopisu`) a stojí v ňom prostredie. Doplniť miesta
 * je položka v `poznamky/HANDOVER.md`.
 */
const VYBER_ID = [
  'zubacka-nastupiste', // Vodiaca línia · Zubačka
  'signalny-pas-priechod-ba', // Signálny pás · Bratislava
  'nivy-interier-vstup', // Vodiaca línia v interiéri · Bratislava Nivy
  'mosadzne-indikatory-varovny-pas', // Mosadzné indikátory · miesto nedoložené
  'protismykovy-nater-nastupiste', // Protišmykový náter · miesto nedoložené
  'priechod-nerezova-linia', // Vodiaca línia v priechode · miesto nedoložené
]

const VYBER = VYBER_ID.map((id) => GALERIA.find((r) => r.id === id)).filter(Boolean)

/**
 * Popis fotky je fakt. Pravidlo, čo sa smie napísať pod ktorú fotku, je jedno
 * pre celý web a býva v `Realizacie/skupiny.js`; teaser z neho berie prvú časť
 * (doložené miesto, inak prostredie, pri produktovej fotke jej pomenovanie),
 * aby sa popisky Domova a galérie nikdy nerozišli.
 */
const popis = (r) => `${r.prvok} · ${castiPopisu(r)[0]}`

export default function RealizacieVyber() {
  return (
    <Sekcia id="realizacie" pasmo="biela">
      <SekciaHlavicka
        stitok="Realizácie"
        nadpis="Osadené prvky na konkrétnych miestach"
        perex="Ku každej fotografii uvádzame typ prvku a miesto, aby sa dala porovnať s vaším zadaním."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
      >
        {VYBER.map((r) => (
          <StaggerItem key={r.id}>
            <Fotka
              src={r.src}
              w={r.w}
              h={r.h}
              alt={r.alt}
              pomer="4/3"
              popis={popis(r)}
              className="[&_figcaption]:border-t [&_figcaption]:border-[var(--color-border)] [&_figcaption]:pt-4"
            />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-14 flex justify-center lg:mt-16">
        <Tlacidlo variant="tichy" to="/realizacie">
          {`Všetkých ${GALERIA.length} realizácií`}
        </Tlacidlo>
      </Reveal>
    </Sekcia>
  )
}
