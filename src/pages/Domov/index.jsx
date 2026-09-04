import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import Hero from './sections/Hero.jsx'
import KtoSme from './sections/KtoSme.jsx'
import SluzbyPrehlad from './sections/SluzbyPrehlad.jsx'
import Technologie from './sections/Technologie.jsx'
import RealizacieVyber from './sections/RealizacieVyber.jsx'
import Proces from './sections/Proces.jsx'
import KontaktKratky from './sections/KontaktKratky.jsx'

const META = routaPodlaCesty('/')

/**
 * Domovská stránka. Rytmus pásiem je záväzný (STANDARDY B5): nikdy dve
 * tmavé za sebou. Pätička je tmavá a ráta sa doň, preto je posledné pásmo
 * svetlé.
 *
 * Konverzná linka: kto sme (identita a čísla) → technológie (AKO) →
 * dôkaz (realizácie, KDE) → proces → kontakt.
 *
 * Každé pásmo odpovedá na inú otázku a žiadne dve na tú istú. Dve pásma
 * 28. 8. 2026 padli na pokyn Petra:
 *
 *  • „Debarierizácia" — pripnutý scroll-scrub cez päť fotiek jednej služby,
 *    tretia sekcia po sebe o tom istom. Jej miesto drží `Technologie`.
 * Pásmo služieb (kruhový objazd) ostáva. 28. 8. 2026 z neho padla len jeho
 * hlavička („Čo realizujeme na pozemných komunikáciách" s perexom) — objazd
 * s deviatimi prvkami hovorí sám za seba a nadpis nad ním bol tretí nadpis
 * na tú istú tému.
 *
 * Súbor zrušenej sekcie ostáva v `poznamky/removed/`.
 *
 * Celoplošná fotografia medzi `KtoSme` a `SluzbyPrehlad` (`PasOddelovac`)
 * padla 4. 9. 2026 na pokyn majiteľa: bol to predel bez obsahu a paralaxa
 * v ňom pri krajných polohách scrollu odhaľovala svetlý pruh pozadia rámu.
 * Pásma na seba nadväzujú priamo; odstup drží polovičné spodné odsadenie
 * `KtoSme` (rovnaký spoj ako `Proces` → `KontaktKratky`).
 */
export default function Domov() {
  return (
    <>
      <Seo title={META?.title} description={META?.description} />
      <Hero />
      <KtoSme />
      <SluzbyPrehlad />
      <Technologie />
      <RealizacieVyber />
      <Proces />
      <KontaktKratky />
    </>
  )
}
