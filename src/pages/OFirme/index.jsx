import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Podstranka, Tlacidlo } from '../../components/kit/index.js'
import { PROCES } from '../../content/firma.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import Profil from './sections/Profil.jsx'
import Technologie from './sections/Technologie.jsx'
import Pristup from './sections/Pristup.jsx'
import Legislativa from './sections/Legislativa.jsx'
import Materialy from './sections/Materialy.jsx'
import Aktuality from './sections/Aktuality.jsx'
import PasVideo from './PasVideo.jsx'

const META = routaPodlaCesty('/o-firme')

/**
 * O firme.
 *
 * ## Prečo je stránka postavená nanovo (28. 8. 2026)
 *
 * Predošlá verzia bola jeden 482-riadkový súbor, v ktorom sa v troch
 * pásmach miešalo šesť tém: čísla, identita firmy, výpočet technológií,
 * štyri argumenty, konzultácie, vyhlášky a značky materiálov. Dve pásma
 * niesli tri témy naraz a čitateľ nemal ako vedieť, kde jedna končí — to je
 * tá „neusporiadanosť textu“, ktorú Peter vytkol. Stránka sa preto rozpadla
 * na sekcie ako Domov (`pages/OFirme/sections/`) a **každé pásmo odpovedá
 * na jednu otázku**:
 *
 *  1. `Profil` — kto sme a čo osádzame (biela)
 *  2. `Technologie` — čím pracujeme, triptych s doloženými zábermi (tmavá)
 *  3. `Pristup` — čo z toho plynie, štyri tvrdenia a najsilnejší údaj (biela)
 *  4. `PasVideo` — celoplošný pás s videom, nádych medzi dvomi svetlými pásmami
 *  5. `Legislativa` — podľa čoho navrhujeme a kam po konzultáciu (biela)
 *  6. `Materialy` — z čoho staviame, materiálový list (tmavá)
 *  7. `Aktuality` — jediná položka z pôvodného webu (biela, malé odsadenie)
 *  8. `PasVyzvy` zo šablóny — obhliadka (svetlá, pred tmavou pätičkou)
 *
 * Rytmus: biela → tmavá → biela → [predel] → biela → tmavá → biela → biela.
 * Nikdy dve tmavé za sebou a posledné pásmo je svetlé (STANDARDY B5).
 * `PasVideo` je opticky tmavý, preto stojí medzi dvomi svetlými a nikdy
 * tesne pod tmavým pásmom.
 *
 * ## Jedna mriežka na celú stránku
 *
 * Pásma si delili dvanásťstĺpcovú mriežku každé inak (7/5, 5/7, 4/8, 6/6
 * a k tomu odrážkové odsadenia), takže na 1440 px vzniklo jedenásť zvislých
 * osí textu — väčšina od seba 100 px, čo je akurát na to, aby to vyzeralo
 * rozbito. Stránka má odvtedy **jediné delenie: polovica a polovica**
 * (`HlavickaPasma.jsx`, os 136 a 752) a marginálie vpravo nemá ani
 * hlavička (pokyn Petra, 28. 8. 2026).
 *
 * ## Čo z pôvodnej stránky zámerne odišlo
 *
 * **Mriežka štyroch veľkých čísel** s dopočítavaním od nuly. Je to
 * najrozšírenejší útvar generovaného webu a Peter ho v tej istej podobe
 * odmietol na Domove (28. 8. 2026). Fakty ostali, zmenil sa ich útvar:
 * technický list v `Profil` a jeden údaj vysadený veľký v `Pristup`, lebo
 * „do 30 min“ je jediné číslo firmy, ktoré rozhoduje o zákazke.
 *
 * Hlavička (`StranHlavicka`) a pätička sú spoločné pre celý web a nemenia sa;
 * hlavička len nedostáva `perex`, takže napravo od titulu nestojí nič.
 *
 * Všetky vety o klientovi pochádzajú z `src/content/firma.js`; tu vznikajú
 * len nadpisy sekcií a mikro-labely poskladané z tých istých faktov.
 */
export default function OFirme() {
  return (
    <Podstranka
      meta={META}
      stitok="O firme"
      nadpis="Dopravné stavby od roku 2012"
      /* Výzva — text prvého kroku z `PROCES`, akcie sú obhliadka a galéria. */
      vyzva={{
        stitok: 'Ďalší krok',
        nadpis: 'Dohodneme si obhliadku',
        perex: PROCES[0].popis,
        akcia: (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Tlacidlo variant="primar" data-cta-obhliadka onClick={() => openObhliadka()}>
              Dohodnúť obhliadku a cenu
            </Tlacidlo>
            <Tlacidlo variant="tichy" to="/realizacie">
              Pozrieť realizácie
            </Tlacidlo>
          </div>
        ),
      }}
    >
      <Profil />
      <Technologie />
      <Pristup />
      <PasVideo />
      <Legislativa />
      <Materialy />
      <Aktuality />
    </Podstranka>
  )
}
