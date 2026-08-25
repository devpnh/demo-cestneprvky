import { Suspense, lazy, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from './lib/useLenis.js'
import { useReducedMotion } from './lib/useReducedMotion.js'
import DemoBadge from './components/DemoBadge.jsx'
import ObhliadkaDialog from './components/ObhliadkaDialog.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'

// Stránky lenivo: bundle sa rozpadne na chunk na routu, takže domovská
// stránka neťahá tabuľku DEBUZ ani galériu realizácií.
const Domov = lazy(() => import('./pages/Domov/index.jsx'))
const Sluzby = lazy(() => import('./pages/Sluzby/index.jsx'))
const SluzbaDetail = lazy(() => import('./pages/Sluzby/Detail.jsx'))
const Realizacie = lazy(() => import('./pages/Realizacie/index.jsx'))
const OFirme = lazy(() => import('./pages/OFirme/index.jsx'))
const Kontakt = lazy(() => import('./pages/Kontakt/index.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/** Neutrálny fallback, ktorý rezervuje výšku. Bez neho by pätička vyskočila hore. */
function Nacitava() {
  return <div className="min-h-[60vh]" aria-hidden="true" />
}

/**
 * Prechod medzi routami: fade + 12 px slide-up, 300 ms, house easing.
 *
 * `mode="wait"` drží starú stránku, kým nedobehne jej exit, preto ide dovnútra
 * `<Routes location={location}>`: AnimatePresence si odkladá predchádzajúci
 * React element aj s jeho vtedajším `location`, takže odchádzajúca vrstva
 * naozaj vykresľuje starú routu a nie novú.
 *
 * Transform na wrapperi je len počas animácie. `motion` po dobehnutí na
 * východiskové hodnoty zapíše `transform: none`, takže `position: fixed`
 * potomkov stránok nič trvalo nerozbije.
 */
function PrechodRoutov() {
  const location = useLocation()
  const reduced = useReducedMotion()

  const animacia = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} {...animacia}>
        <Suspense fallback={<Nacitava />}>
          <Routes location={location}>
            <Route path="/" element={<Domov />} />
            <Route path="/sluzby" element={<Sluzby />} />
            <Route path="/sluzby/:slug" element={<SluzbaDetail />} />
            <Route path="/realizacie" element={<Realizacie />} />
            <Route path="/o-firme" element={<OFirme />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Shell webu: hlavička, `<main>`, pätička a raz namontované globálne prvky
 * (dialóg obhliadky, demo značka, Lenis). Sekcie a stránky sú v `src/pages/*`.
 */
export default function App() {
  useLenis()
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  // Na domovskej stránke začína hero pod priehľadnou hlavičkou, preto tam
  // žiadny odsadzujúci padding nie je; podstránky ho potrebujú (C3).
  const isHome = pathname === '/'

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
        className={`outline-none ${isHome ? '' : 'pt-[72px]'}`}
      >
        <PrechodRoutov />
      </main>
      <Footer />
      <ObhliadkaDialog />
      <DemoBadge />
    </>
  )
}
