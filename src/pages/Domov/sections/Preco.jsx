import { Sekcia, SekciaHlavicka, Fotka, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

/**
 * Prečo Cestné prvky — prezentačné pásmo, nie výklad.
 *
 * Predtým tu stáli štyri argumenty ako mriežka 2 × 2, každý s vlastnou
 * fotkou a štyriadkovým odsekom. Bola to najhustejšia textová plocha na
 * Domove a spolu so zvyškom stránky pôsobila ako „kopa textu nahádzaná na
 * seba“ (výtka Petra, 27. 8. 2026). Domov má predávať, nie vysvetľovať.
 *
 * Zostali teda len tvrdenia — štyri krátke nadpisy na vlasovej mriežke —
 * jeden veľký záber cez celú šírku kontajnera a jedno číslo vysadené tak
 * veľko, aby sa dalo prečítať z druhej strany miestnosti. **Celé znenie
 * argumentov nezmizlo z webu, stojí na `/o-firme`** v pásme „Technológie bez
 * zásahu do pôvodných konštrukcií“, kam odtiaľto vedie odkaz.
 *
 * Fotka je jedna a veľká namiesto troch malých: tri dokladové zábery po
 * 368 px sa na Domove bili s deviatimi fotkami objazdu a šiestimi
 * realizáciami hneď pod nimi.
 */

/** Záber sekcie. Vodiaca línia pozdĺž cesty je presne ten prvok, ktorý vyhlášky predpisujú. */
const ZABER = GALERIA.find((r) => r.id === 'vodiaca-linia-pozdlz-cesty') || null

/**
 * Jediné číslo sekcie. Nie je vymyslené ani zaokrúhlené pre efekt — stojí
 * doslova v texte argumentu „Krátke obmedzenie dopravy“ (`firma.js`).
 */
const CISLO = { hodnota: '30 min', popis: '100 % pevnosti lepeného obrubníka' }

export default function Preco() {
  return (
    <Sekcia id="preco" pasmo="biela">
      <SekciaHlavicka
        stitok="Prečo Cestné prvky"
        nadpis={FIRMA.claim}
        perex={FIRMA.technologie.uvod}
        sirkaNadpisu="max-w-[14ch]"
      />

      {ZABER ? (
        <Reveal className="mt-14 lg:mt-20">
          <Fotka
            src={ZABER.src}
            w={ZABER.w}
            h={ZABER.h}
            alt={ZABER.alt}
            pomer="16/9"
            popis={`${ZABER.prvok} · ${castiPopisu(ZABER)[0]}`}
            sizes="(min-width: 1280px) 1168px, 100vw"
            maxSirka={Infinity}
          />
        </Reveal>
      ) : null}

      <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-12">
        {/* Číslo drží ľavý stĺpec samo. Je to jediná vec v sekcii vysadená
            veľkosťou hlavného nadpisu, takže sa oko zastaví práve tu. */}
        <Reveal className="lg:col-span-4">
          <p className="font-[family-name:var(--font-display)] text-[length:var(--text-6xl)] font-semibold leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            {CISLO.hodnota}
          </p>
          <p className="mt-5 max-w-[24ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
            {CISLO.popis}
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-8">
          {FIRMA.pristup.map((argument) => (
            <StaggerItem key={argument.nazov} className="border-t border-[var(--color-border)] pt-5">
              <h3 className="max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {argument.nazov}
              </h3>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal className="mt-14 lg:mt-16">
        <Tlacidlo variant="tichy" to="/o-firme">
          Ako pracujeme
        </Tlacidlo>
      </Reveal>
    </Sekcia>
  )
}
