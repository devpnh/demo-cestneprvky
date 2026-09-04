import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Podstranka, Tlacidlo } from '../../components/kit/index.js'
import { PROCES } from '../../content/firma.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import Profil from './sections/Profil.jsx'
import Technologie from './sections/Technologie.jsx'
import Pristup from './sections/Pristup.jsx'
import Legislativa from './sections/Legislativa.jsx'
import Materialy from './sections/Materialy.jsx'
import HlavickaVideo from './HlavickaVideo.jsx'

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
 *  4. `Legislativa` — podľa čoho navrhujeme a kam po konzultáciu (biela)
 *  5. `Materialy` — z čoho staviame, materiálový list (tmavá)
 *  6. `PasVyzvy` zo šablóny — obhliadka (svetlá, pred tmavou pätičkou)
 *
 * Rytmus: biela → tmavá → biela → biela → tmavá → biela. Nikdy dve tmavé za
 * sebou a posledné pásmo je svetlé (STANDARDY B5).
 *
 * ## Video je pozadie hlavičky, nie pásmo uprostred (4. 9. 2026)
 *
 * Záber so strojom, ktorý nanáša vodorovné značenie, bol celoplošný pás medzi
 * „Prístupom“ a „Legislatívou“. Nemal väzbu na text nad ním ani pod ním a
 * pôsobil, akoby ho tam niekto hodil náhodne (výtka Petra). Ide preto hore
 * ako pozadie hlavičky (`HlavickaVideo`), kde nahradil abstraktný
 * `ZnacenieMotiv`: to isté video tam robí tú istú prácu — hovorí, čo firma
 * robí — ale hneď pod titulom a bez rezu v strede stránky.
 *
 * ## Novinky odišli na vlastnú podstránku (4. 9. 2026)
 *
 * Siedme pásmo bol výpis jediného článku (`Aktuality`). Na stránku, ktorá
 * odpovedá na otázku „kto ste a ako pracujete“, výpis článkov nepatrí a nikto
 * ho tam nehľadal — pôvodný web mal `Novinky` ako samostatnú položku v menu.
 * Obsah je odvtedy na `/novinky` (`src/pages/Novinky/`), dáta ostali na tom
 * istom mieste (`FIRMA.aktuality`).
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
      /* Pozadie hlavičky: záber značkovacieho stroja namiesto značkovacieho motívu. */
      pozadie={<HlavickaVideo />}
      stitok="O firme"
      nadpis="Dopravné stavby od roku 2012"
      /* Výzva — text prvého kroku z `PROCES`, akcie sú obhliadka a galéria. */
      vyzva={{
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
      <Legislativa />
      <Materialy />
    </Podstranka>
  )
}
