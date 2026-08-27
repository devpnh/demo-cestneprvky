/**
 * Vstupné animácie webu: jeden zdieľaný `IntersectionObserver` a prechody
 * v CSS. Nie `whileInView` z knižnice `motion`.
 *
 * Prečo nie knižnica: v tomto projekte `whileInView` nespúšťa nič. Prvok
 * hlboko pod ohybom má `opacity: 1` a žiadny inline `style`, teda `initial`
 * sa naň nikdy nepoužilo. Príčina je meraná (27. 8. 2026): keď je celý strom
 * stránky zabalený v `motion.div` prechodu routov v `App.jsx`, potomkovia si
 * počiatočný variant neuplatnia — čakajú na propagáciu variantu od rodiča,
 * ktorý žiadne varianty nemá. Po odstránení toho jedného wrappera mali tie
 * isté prvky `opacity: 0; transform: translateY(24px)` úplne správne.
 *
 * Dôsledok bol, že na webe nebežala ani jedna vstupná animácia — vyzeral
 * staticky ako vygenerovaná šablóna, hoci komponenty na animácie mal.
 * Preto sa celá vrstva presunula na `IntersectionObserver` + CSS: nemá
 * rodičovský kontext, ktorý by ju vedel takto potichu vypnúť, a rovnaký
 * postup už raz zabral v sekcii Proces.
 *
 * Skrývanie zapína trieda `js-motion` na `<html>`, ktorú nasadí `main.jsx`
 * ešte pred prvým renderom. Bez JavaScriptu (alebo keď observer nie je) sa
 * trieda nenasadí a obsah je od začiatku celý viditeľný.
 */

let observer = null

function ziskaj() {
  if (observer) return observer
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null
  observer = new IntersectionObserver(
    (zaznamy) => {
      for (const z of zaznamy) {
        // Druhá podmienka rieši prvky NAD oknom: po obnove pozície scrollu
        // alebo po skoku na kotvu ich observer nikdy nenahlási ako
        // pretínajúce sa, a bez nej by ostali navždy neviditeľné.
        if (!z.isIntersecting && z.boundingClientRect.bottom >= 0) continue
        z.target.setAttribute('data-odhal', 'in')
        observer.unobserve(z.target)
      }
    },
    // Prah 0 a nie 0,15: prvok vyšší ako niekoľko obrazoviek by pomerový
    // prah nikdy nedosiahol. Spodné `-8 %` znamená „spusti, keď horná hrana
    // prejde 92 % výšky okna“, teda tesne po tom, ako sa objaví.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

/** Prihlási prvok na odhalenie. Vracia funkciu na odhlásenie. */
export function sleduj(el) {
  const io = ziskaj()
  if (!el) return () => {}
  if (!io) {
    el.setAttribute('data-odhal', 'in')
    return () => {}
  }
  io.observe(el)
  return () => io.unobserve(el)
}
