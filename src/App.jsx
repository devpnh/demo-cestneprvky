import { useLenis } from './lib/useLenis.js'
import Seo from './components/Seo.jsx'
import DemoBadge from './components/DemoBadge.jsx'
import sections from './sections/index.js'

// The chassis composes infrastructure only. Everything visible between Seo
// and DemoBadge is the generator's bespoke output via sections/index.js.
export default function App() {
  useLenis()

  return (
    <>
      <Seo />
      <main>
        {sections.map((Section, i) => (
          <Section key={Section.displayName || Section.name || i} />
        ))}
      </main>
      <DemoBadge />
    </>
  )
}
