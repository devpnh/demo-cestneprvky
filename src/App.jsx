import { useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useLenis } from './lib/useLenis.js'
import DemoBadge from './components/DemoBadge.jsx'
import ObhliadkaDialog from './components/ObhliadkaDialog.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'

// Stránky sú importované priamo, nie cez `lazy`.
//
// Dôvod je meraný: pri lenivom načítaní vykreslí Suspense najprv fallback
// vysoký 60 vh, pätička sedí hneď pod ním a po dorazení chunku spadne o
// niekoľko tisíc pixelov nižšie. Lighthouse to videl ako jediný veľký posun
// s CLS 0,404 (`body > div#root > footer`). Delenie na chunky pritom
// neušetrilo takmer nič: spoločný balík má 496 kB, kým chunky stránok mali
// 1 až 28 kB, teda dokopy okolo 50 kB. Za odstránený skok layoutu je to
// výmena, ktorú robíme radi.
import Domov from './pages/Domov/index.jsx'
import Sluzby from './pages/Sluzby/index.jsx'
import SluzbaDetail from './pages/Sluzby/Detail.jsx'
import Realizacie from './pages/Realizacie/index.jsx'
import OFirme from './pages/OFirme/index.jsx'
import Novinky from './pages/Novinky/index.jsx'
import Kontakt from './pages/Kontakt/index.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * Prechod medzi routami: fade + 14 px zdola, 500 ms, house easing.
 *
 * Je to CSS animácia na obyčajnom `<div>` s `key={pathname}`, nie
 * `AnimatePresence` s `motion.div`. Dôvod je meraný (27. 8. 2026): ten
 * wrapper bol rodičom celého stromu stránky a potomkovia si pod ním
 * neuplatnili vlastný počiatočný variant — čakali na propagáciu od rodiča,
 * ktorý žiadne varianty nemal. Výsledkom bolo, že NA CELOM WEBE nebežala
 * ani jedna vstupná animácia; po odstránení wrappera nabehli všetky.
 * Pozri `src/lib/odhalenie.js`.
 *
 * `key` na `<div>` stačí: React pri zmene cesty starý uzol zahodí a nový
 * namontuje, takže animácia beží od začiatku. Odchádzajúca vrstva sa
 * nekreslí zámerne — s ňou by sa dve stránky prekrývali a `ScrollToTop` by
 * skákal cez obsah, ktorý už nie je aktuálny.
 */
function PrechodRoutov() {
  const location = useLocation()

  return (
    <div key={location.pathname} data-prechod-strany="">
      <Routes location={location}>
        <Route path="/" element={<Domov />} />
        <Route path="/sluzby" element={<Sluzby />} />
        <Route path="/sluzby/:slug" element={<SluzbaDetail />} />
        <Route path="/realizacie" element={<Realizacie />} />
        <Route path="/o-firme" element={<OFirme />} />
        <Route path="/novinky" element={<Novinky />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

/**
 * Shell webu: hlavička, `<main>`, pätička a raz namontované globálne prvky
 * (dialóg obhliadky, demo značka, Lenis). Sekcie a stránky sú v `src/pages/*`.
 */
export default function App() {
  useLenis()
  const mainRef = useRef(null)
  // Odsadenie pod fixnú hlavičku si rieši prvé pásmo stránky samo
  // (`StranHlavicka`, hero, 404), aby mohlo ísť tmavé až po vrch obrazovky.

  return (
    <>
      <Header />
      <ScrollToTop mainRef={mainRef} />
      <main
        id="obsah"
        ref={mainRef}
        tabIndex={-1}
        // Fokus sem presúva ScrollToTop programovo, outline by pri klikaní myšou
        // len blikol okolo celej stránky.
        className="outline-none"
      >
        <PrechodRoutov />
      </main>
      <Footer />
      <ObhliadkaDialog />
      <DemoBadge />
    </>
  )
}
