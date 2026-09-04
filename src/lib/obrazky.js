const BASE = import.meta.env.BASE_URL

/**
 * Jedno pravidlo pre responzívne fotografie.
 *
 * V `public/assets/240/`, `480/` a `960/` sú zmenšené varianty s tými istými
 * názvami súborov (generované, needitujú sa ručne). Bez nich sťahovala
 * galéria na mobile fotky v 1 200 až 1 600 px do 350 px slotu: 1,67 MB na
 * stránku a LCP 5,2 s, hoci LCP prvkom je nadpis — obrázky mu brali pásmo.
 *
 * Priečinok `240/` pribudol 4. 9. 2026 pre **miniatúry v zoznamoch služieb**:
 * riadok má obrázok 96 px široký, takže aj na displeji s trojnásobnou hustotou
 * stačí 288 px. Dovtedy tam išiel originál 600 px — deväť takých fotiek je
 * pol megabajtu za miniatúry, ktoré majú spolu 148 kB.
 *
 * Variant sa ponúka len vtedy, keď je originál naozaj väčší; `240/` majú len
 * tie fotky, ktoré v miniatúre naozaj stoja (deväť dlaždíc služieb), preto je
 * za samostatným prepínačom.
 */
export function srcSetPre(src, w, maxSirka = Infinity, s240 = false) {
  return [
    s240 && w > 240 ? `${BASE}assets/240/${src} 240w` : null,
    w > 480 ? `${BASE}assets/480/${src} 480w` : null,
    w > 960 && maxSirka >= 960 ? `${BASE}assets/960/${src} 960w` : null,
    w <= maxSirka ? `${BASE}assets/${src} ${w}w` : null,
  ]
    .filter(Boolean)
    .join(', ')
}

/**
 * Strop pre dlaždice v mriežke. Telefón s pomerom pixelov 2,6 si pri
 * `sizes: 100vw` vypýta zdroj široký 1 080 px a stiahne originál, hoci
 * dlaždica má 412 px. Variant 960w je na nej stále 2,3-násobná hustota, teda
 * opticky nerozoznateľný, a stránka je o vyše megabajt ľahšia. Lightbox strop
 * nemá, tam sa fotka pozerá na celé okno.
 */
export const MAX_MRIEZKA = 960

/**
 * Obrázok zaberá celú šírku stĺpca; stĺpce sú 2 / 2 / 3 podľa šírky okna.
 * Od 4. 9. 2026 je mriežka realizácií dvojstĺpcová aj na telefóne, takže
 * `100vw` by pýtalo dvojnásobne veľký zdroj, než sa vykreslí — a nesúlad
 * `sizes` s rozložením je najčastejšia chyba pri `srcset`.
 */
export const SIZES_MRIEZKA = '(min-width: 1024px) 33vw, 50vw'

/** Miniatúra v riadku zoznamu služieb je vždy 96 px široká. */
export const SIZES_MINIATURA = '96px'

/** Lightbox zobrazuje fotku cez celé okno. */
export const SIZES_PLNA = '100vw'
