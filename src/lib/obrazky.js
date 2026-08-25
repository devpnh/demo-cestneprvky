const BASE = import.meta.env.BASE_URL

/**
 * Jedno pravidlo pre responzívne fotografie.
 *
 * V `public/assets/480/` a `public/assets/960/` sú zmenšené varianty s tými
 * istými názvami súborov (generované, needitujú sa ručne). Bez nich sťahovala
 * galéria na mobile fotky v 1 200 až 1 600 px do 350 px slotu: 1,67 MB na
 * stránku a LCP 5,2 s, hoci LCP prvkom je nadpis — obrázky mu brali pásmo.
 *
 * Variant sa ponúka len vtedy, keď je originál naozaj väčší; menšie fotky
 * (600×390 dlaždice z pôvodného webu) žiadny zmenšený súbor nemajú.
 */
export function srcSetPre(src, w, maxSirka = Infinity) {
  return [
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

/** Obrázok zaberá celú šírku stĺpca; stĺpce sú 1 / 2 / 3 podľa šírky okna. */
export const SIZES_MRIEZKA = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

/** Lightbox zobrazuje fotku cez celé okno. */
export const SIZES_PLNA = '100vw'
