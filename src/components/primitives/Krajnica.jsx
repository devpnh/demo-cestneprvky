import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * Krajnica — prerušované vodorovné značenie pri oboch okrajoch tmavého pásma,
 * ktoré sa pri scrolle **natiera** zhora nadol.
 *
 * ## Načo to je
 *
 * V „Ako to robíme" sa hýbe len stoh kariet v strede; okraje pásma stoja.
 * Peter to pomenoval presne: po krajoch chýba niečo, čo ide s pohybom.
 *
 * ## Tri pokusy a čo z nich platí
 *
 * 1. **Úsek vozovky** pri každom okraji: súvislá čiara, vedľa nej prerušovaná
 *    a v jej medzerách odrazky. Peter: „vyzerá to ako technický rám". Sedí —
 *    dva rytmické stĺpce po oboch stranách obsahu nečíta oko ako cestu, ale
 *    ako orámovanie stránky.
 * 2. **Vlásová linka**, 1 px. Rám zmizol, ale s ním aj téma: Peter na to, že
 *    to už nemá nič spoločné s cestným prvkom. Presné — 1 px je linka
 *    rozhrania. Cestné značenie nie je linka, je to náter, a náter má šírku.
 * 3. **Toto.** Jedna prerušovaná čiara v proporciách skutočného vodorovného
 *    značenia: 10 px široká (pri šírke obsahu 1248 px sedí na 12,5 cm čiaru
 *    v mierke pruhu), čiara ku medzere 1 : 1,7 ako na ceste, lomená biela
 *    plastu, nie čistá — tá vyzerá nalepená.
 *
 * Z prvého pokusu teda ostal rytmus, ale jediný a riedky: tri čiarky na
 * obrazovku namiesto siedmich, a jedna vrstva namiesto troch. Rám z toho
 * nevznikne, lebo nie je čo s čím spárovať; a je to značenie, nie linka.
 * Na oboch koncoch sa pásmo vytráca, aby čiara nemala hranu.
 *
 * ## Pohyb
 *
 * Čiara je nakreslená celá a prekrýva ju doska vo farbe pásma, ktorá pri
 * scrolle klesá (`translateY` 0 → 100 %). Animuje sa jediná vec a jediný
 * `transform`, takže to celé beží na kompozítore. Alternatívy padli: `scaleY`
 * by čiaru naťahovalo namiesto odhaľovania a `clip-path` ani animovaná výška
 * nie sú akcelerované.
 *
 * Doska je holá — bez hlavy značkovacieho stroja na hrane. Akcentový prúžok
 * na reze vyzeral, akoby čiaru ťahalo niečo cudzie; bez neho sa značenie
 * jednoducho natiera samo a rez nie je vidno, lebo doska má farbu pásma.
 *
 * Dráha je zvolená tak, aby sa čiara dopĺňala stále na rovnakom mieste
 * obrazovky: pásmo je vysoké ~3 obrazovky, `start 0.9 → end 0.7` dá rozdiel
 * dráh 0,2 vh, takže natieranie prebieha v pásme 70–90 % výšky okna — tesne
 * pod tým, na čo sa človek práve pozerá.
 *
 * ## Kde presne stojí
 *
 * V strede medzery medzi okrajom stránky a fotkou, nie v pevnom odstupe od
 * okraja. Medzera je `(100 % − --container-max) / 2 + --container-padding-x`
 * (stĺpec obsahu je centrovaný a má vlastný vnútorný odsadok), takže stred je
 * jej polovica a od nej ide preč ešte 5 px na polovicu šírky samotného pásu.
 * S pevným `left: 24px` to sedelo len pri 1280 px a pri každom širšom okne
 * čiara odchádzala k okraju, kým medzera rástla.
 *
 * ## Prečo `hidden` pod 1280 px
 *
 * Čiara patrí do vonkajšieho okraja, nie k textu. Pri 1280 px má na každej
 * strane 23 px vzduchu; užšie okno tú medzeru nemá. Vypnúť ju je čestnejšie
 * než ju pritláčať k obsahu (a je to aj poistka na D1 — čo sa nemontuje,
 * nemôže roztiahnuť stránku).
 *
 * Pri `prefers-reduced-motion` je čiara rovno celá; doska sa nemontuje.
 */

/**
 * Náter. Biela pri 0,24 — o niečo výraznejšia než deliaca linka nad záverom
 * pásma, lebo značenie musí byť čitateľné ako plocha, nie ako vlas.
 *
 * Perióda je 96 px čiara a 160 px medzera (na ceste 3 m : 6 m, tu skrátené,
 * aby na obrazovku vyšli tri čiarky). Rozmery sú v px, nie v %, aby rytmus
 * nezávisel od výšky pásma.
 */
const NATER = 'rgba(255,255,255,0.24)'
const ZNACENIE = `repeating-linear-gradient(to bottom,
  ${NATER} 0px, ${NATER} 96px,
  transparent 96px, transparent 256px)`

/** Vytratenie na oboch koncoch — čiara s ostrou hranou je hrana rámu. */
const STRATENIE = 'linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)'

/**
 * Stred medzery medzi okrajom stránky a stĺpcom obsahu, mínus polovica šírky
 * pásu. `100 %` je šírka sekcie (tá je celoplošná, ale bez scrollbaru — na
 * rozdiel od `100vw`, ktorý by čiaru odsunul o jeho šírku). `min()` netreba:
 * pás sa montuje až od 1280 px, čo je vždy viac než `--container-max`.
 */
const ODSTUP =
  'calc((100% - var(--container-max)) / 4 + var(--container-padding-x) / 2 - 5px)'

function Pas({ strana, posun, reduced }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 hidden w-[10px] overflow-hidden min-[1280px]:block"
      style={{
        [strana === 'vpravo' ? 'right' : 'left']: ODSTUP,
        maskImage: STRATENIE,
        WebkitMaskImage: STRATENIE,
      }}
    >
      <div className="absolute inset-0" style={{ backgroundImage: ZNACENIE }} />

      {/* Doska, ktorá čiaru odhaľuje. Pri reduced-motion sa nemontuje. */}
      {!reduced ? (
        <motion.div
          className="absolute inset-0 bg-[var(--color-surface-2)]"
          style={{ y: posun }}
        />
      ) : null}
    </div>
  )
}

export default function Krajnica({ cielRef }) {
  const reduced = useReducedMotion()
  // Rozsah je prísne rastúci a v [0, 1] (STANDARDY E3).
  const { scrollYProgress } = useScroll({ target: cielRef, offset: ['start 0.9', 'end 0.7'] })
  const posun = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <>
      <Pas strana="vlavo" posun={posun} reduced={reduced} />
      <Pas strana="vpravo" posun={posun} reduced={reduced} />
    </>
  )
}
