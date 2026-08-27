import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { PasOddelovac } from '../../components/kit/index.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
import Hero from './sections/Hero.jsx'
import KtoSme from './sections/KtoSme.jsx'
import SluzbyPrehlad from './sections/SluzbyPrehlad.jsx'
import Debarierizacia from './sections/Debarierizacia.jsx'
import RealizacieVyber from './sections/RealizacieVyber.jsx'
import Proces from './sections/Proces.jsx'
import KontaktKratky from './sections/KontaktKratky.jsx'

const META = routaPodlaCesty('/')

/**
 * Domovská stránka. Rytmus pásiem je záväzný (STANDARDY B5): nikdy dve
 * tmavé za sebou. Pätička je tmavá a ráta sa doň, preto je posledné pásmo
 * svetlé.
 *
 * Konverzná linka: kto sme (identita a čísla) → ponuka (služby) → dôkaz
 * (debarierizácia, realizácie) → proces → kontakt.
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
      <Debarierizacia />
      <RealizacieVyber />
      <Proces />
      <KontaktKratky />
    </>
  )
}
