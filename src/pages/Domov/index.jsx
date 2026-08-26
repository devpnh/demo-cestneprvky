import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import Hero from './sections/Hero.jsx'
import Preco from './sections/Preco.jsx'
import SluzbyPrehlad from './sections/SluzbyPrehlad.jsx'
import Debarierizacia from './sections/Debarierizacia.jsx'
import RealizacieVyber from './sections/RealizacieVyber.jsx'
import Proces from './sections/Proces.jsx'
import KontaktKratky from './sections/KontaktKratky.jsx'

const META = routaPodlaCesty('/')

/**
 * Domovská stránka. Poradie a rytmus pásiem určuje `poznamky/KOMPOZICIA.md`
 * a sú záväzné: tmavá (hero) → svetlá → svetlá → tmavá → svetlá → svetlá →
 * tmavá (kontakt, ktorý plynulo prechádza do tmavej pätičky). Nikdy nie dve
 * tmavé obsahové sekcie za sebou.
 *
 * Konverzná linka: dôvera (hero, fakty, prečo) → ponuka (služby) → dôkaz
 * (debarierizácia, realizácie) → proces → kontakt.
 */
export default function Domov() {
  return (
    <>
      <Seo title={META?.title} description={META?.description} />
      <Hero />
      <Preco />
      <SluzbyPrehlad />
      <Debarierizacia />
      <RealizacieVyber />
      <Proces />
      <KontaktKratky />
    </>
  )
}
