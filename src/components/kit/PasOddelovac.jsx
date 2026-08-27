import { Prelinacka } from '../primitives/index.js'
import { GALERIA } from '../../content/realizacie.js'

/**
 * Oddeľovač pásiem: fotografia cez celú šírku okna.
 *
 * Vznikol z celoplošného záberu v prvom pásme pod hero, ktorý sa Petrovi
 * páčil (27. 8. 2026) — s tým, že tam má ostať len jeden záber a že sa dá
 * použiť ako oddeľovač sekcií. Je to teda samostatný diel, ktorý sa dá
 * vložiť medzi ktorékoľvek dve pásma stránky.
 *
 * ## Prečo je to `<div>` a nie `<section>`
 *
 * Nie je to obsahové pásmo, je to predel. Ako `<section>` s `data-pasmo` by
 * vstúpil do rytmu pásiem a kontrola B5 by ho počítala; ako `<div>` je pre
 * rytmus neviditeľný a stránka strieda pásma tak, ako keby tam nebol.
 * Opticky je záber tmavý, preto **nesmie ísť tesne pod tmavé pásmo** — pod
 * hero ani pod pás výzvy. Patrí medzi dve svetlé.
 *
 * Šírka ide od hrany po hranu bez `w-screen` s posunom o polovicu: `100vw`
 * počíta aj so zvislým scrollbarom a stránka by dostala pár pixelov
 * vodorovného pretečenia (STANDARDY D1). Pás je preto priamy potomok
 * stránky, ktorá kontajner nemá, a je celoplošný sám od seba.
 *
 * Fotka sa v páse posúva paralaxou, takže predel nie je len obrázok, ale
 * miesto, kde sa stránka nadýchne.
 */
export default function PasOddelovac({ id, vyska = 'h-[clamp(18rem,46vh,32rem)]', reduced = false }) {
  const zaber = GALERIA.find((r) => r.id === id)
  if (!zaber) return null

  return (
    <div data-oddelovac={id}>
      <Prelinacka
        zabery={[
          {
            src: zaber.src,
            w: zaber.w,
            h: zaber.h,
            alt: zaber.alt,
            // Bez popisku (pokyn Petra, 27. 8. 2026). Oddeľovač je predel,
            // nie doklad — čo je na zábere, nesie `alt` pre čítačku, a mono
            // riadok pod pásom bol len ďalší text navyše.
            popis: null,
          },
        ]}
        pomer="auto"
        reduced={reduced}
        parallax={16}
        maxSirka={Infinity}
        sizes="100vw"
        triedaRamu={vyska}
        triedaPopisu="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]"
      />
    </div>
  )
}
