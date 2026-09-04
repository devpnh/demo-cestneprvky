/**
 * Skupina kariet: na telefóne vodorovný pás so `scroll-snap`, od 640 px
 * mriežka, ktorú si volá miesto použitia.
 *
 * Tri fotky vedľa seba na desktope sa na 390 px poskladali pod seba a z jednej
 * skupiny sa stali tri celoobrazovkové zábery za sebou — presne ten „scroll
 * obrovských fotiek po jednej“, ktorý Peter vytkol (4. 9. 2026). Vodorovný pás
 * z nich robí zase **jeden útvar**: skupina zaberie jednu obrazovku namiesto
 * troch a fotka ostane dosť veľká na to, aby bolo vidieť, čo dokladá.
 *
 * Detaily, ktoré rozhodujú o tom, či sa to na telefóne správa dobre:
 *
 *  • **Karta má 78 vw**, takže z nasledujúcej vidno kúsok — to je jediný
 *    signál, že sa dá ťahať. Šípky ani bodky pás nemá; posúva sa prstom.
 *  • **`touch-action: pan-y`** — pás nesmie chytať zvislý scroll stránky.
 *  • Bleed cez záporné okraje: prvá karta začína na osi kontajnera a pás
 *    končí až na hrane okna. Kontajner má `overflow-x-auto`, takže dokument
 *    **nepretečie** (STANDARDY D1) — over to meraním, nie okom.
 *  • `scroll-snap-type: x mandatory` a `snap-start` na kartách: prst pustí
 *    kartu na hrane, nie v polovici.
 *  • Od 640 px sa pás nemontuje — tam platí `triedaMriezky` a všetko je ako
 *    predtým, vrátane desktopu (D4).
 */
export default function PasKariet({ triedaMriezky, className = '', children }) {
  return (
    <div
      className={`-mx-[var(--container-padding-x)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--container-padding-x)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 ${triedaMriezky} ${className}`}
      /* `scroll-padding-inline` musí byť, inak `snap-start` zarovná prvú
         kartu na hranu okna a nie na os kontajnera: snapport je scrollport,
         nie padding box, takže pás sa sám odroluje o šírku odsadenia
         (namerané: karta na x = 0 namiesto x = 20). */
      style={{ touchAction: 'pan-y', scrollPaddingInline: 'var(--container-padding-x)' }}
    >
      {children}
    </div>
  )
}
