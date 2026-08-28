import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { PasOddelovac } from '../../components/kit/index.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
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
 * `PasOddelovac` je fotografia cez celú šírku okna medzi dvomi pásmami.
 * Nie je to obsahové pásmo a `data-pasmo` nemá, takže do rytmu nevstupuje;
 * opticky je však tmavý, preto stojí medzi dvomi svetlými a nikdy nie tesne
 * pod hero.
 */
export default function Domov() {
  const reduced = useReducedMotion()

  return (
    <>
      <Seo title={META?.title} description={META?.description} />
      <Hero />
      <KtoSme />
      <PasOddelovac id="vodiaca-linia-pozdlz-cesty" reduced={reduced} />
      <SluzbyPrehlad />
      <Technologie />
      <RealizacieVyber />
      <Proces />
      <KontaktKratky />
    </>
  )
}
