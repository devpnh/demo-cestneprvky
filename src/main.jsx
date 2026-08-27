import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import './styles/index.css'
import App from './App.jsx'

// GitHub Pages servuje projektový web z /demo-cestneprvky/, nie z rootu,
// router musí mať ten istý prefix ako Vite base, inak by `/sluzby` mierilo
// mimo web. Trailing slash preč: react-router si basename normalizuje sám,
// ale bez neho je porovnávanie ciest čitateľnejšie.
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

// Skrytý východiskový stav vstupných animácií visí na tejto triede
// (`src/styles/index.css`). Nasadzuje sa pred prvým renderom, a keď
// JavaScript nebeží alebo prehliadač nemá IntersectionObserver, nenasadí sa
// vôbec — obsah je potom celý viditeľný, nikdy nie natrvalo skrytý.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
