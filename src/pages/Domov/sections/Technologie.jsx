import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { MonoStitok, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { srcSetPre } from '../../../lib/obrazky.js'
import { FIRMA } from '../../../content/firma.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

const BASE = import.meta.env.BASE_URL

/**
 * Ako to robíme — tmavé pásmo v strede Domova.
 *
 * ## Štvrtý pokus, a prečo padli tri predošlé
 *
 * 1. **Pripnutý panel** (`StickySection`, 240 vh runway). Nebol responzívny:
 *    pod 1024 px sa vôbec nemontoval a bežala druhá, samostatná vetva kódu.
 *    To nie je responzívny komponent, to sú dva.
 * 2. **Lepivý stĺpec s rotátormi** — text stál, zábery išli okolo neho.
 *    Peter to odmietol ako lacné: ľavý stĺpec držal tri riadky textu a pod
 *    nimi pol obrazovky prázdna. Prázdno nie je vzduch.
 * 3. **Striedavé riadky fotka/text.** Peter: „vyzerá jak wordpress pičovina“.
 *    Mal pravdu a je to presné: striedanie obrázok-vľavo / obrázok-vpravo je
 *    najgenerickejšia skladba, aká na webe existuje — je to default každého
 *    Elementor a Divi templatu. Navyše ju držala pri živote len zvislá lajna,
 *    ktorá vypĺňala 330 px prázdneho stĺpca. Keď skladbu drží výplň medzery,
 *    skladba je zlá.
 *
 * ## Čo je namiesto toho
 *
 * **Stoh kariet.** Každá technológia je jedna celoplošná karta: fotografia
 * cez celú plochu, meno a popisok na nej. Karty sa pri scrolle pripínajú pod
 * hlavičku a nová sa nasúva na predošlú, ktorá sa zároveň zmenšuje a stmieva
 * — vznikne stoh, v ktorom vidno hrany kariet pod vrchnou.
 *
 * Rieši to všetky tri chyby naraz: prázdny stĺpec neexistuje (fotka a text sú
 * na jednej ploche), skladba nie je generická a sekcia sa už nedá „prescrollovať
 * bez povšimnutia“ — kartu treba odložiť, aby sa dalo ísť ďalej.
 *
 * Vzor je grounded na 21st.dev (`danielpetho/stacking-cards`, id 25275 —
 * „scroll-driven stack of cards that pin and scale down“). Kód sa NEŤAHAL,
 * denný limit účtu je 0/2, takže mechanika je napísaná na tokenoch projektu:
 * ostrý `--radius-sm`, žiadny `box-shadow` (STANDARDY B2), dve rodiny písma,
 * akcent len ako lajna a štítok.
 *
 * ## Pohyb
 *
 * Toto je ten **jeden sticky-scrub na stránku**, ktorý STANDARDY E1 povoľujú
 * (predošlý zanikol spolu s `StickySection`). Jedna vetva kódu pre všetky
 * šírky — `position: sticky` je responzívne samo o sebe, netreba druhý layout.
 *
 * - **Pripnutie**: `sticky` s `top` odstupňovaným po 16 px, takže pod vrchnou
 *   kartou vidno hrany tých pod ňou. Runway je vlastná výška karty v toku,
 *   žiadny umelý `240vh` kontajner.
 * - **Zmenšenie**: podkladová karta ide na `scale` 0,94 / 0,97 (posledná
 *   ostáva na 1) — cez `useMotionTemplate` ako celý `transform` reťazec,
 *   nie cez `scale` skratku, ktorá v Motion nie je akcelerovaná a pri
 *   dopĺňaní fotiek zahadzuje snímky.
 * - **Stmavenie**: prekryv v `--color-accent-2` ide z 0 na 0,55, takže vrchná
 *   karta má vždy najvyšší kontrast a oko vie, ktorá je aktívna.
 *
 * Animujú sa len `transform` a `opacity`. Pri `prefers-reduced-motion` sa
 * `sticky` ani scrub nemontuje a karty sú obyčajný stĺpec pod sebou — nie je
 * to degradácia obsahu, len sa neskladajú.
 */

const foto = (id) => GALERIA.find((r) => r.id === id)

/**
 * Tri technológie doslova z `FIRMA.technologie.polozky` a ku každej presne tá
 * realizácia, ktorá ju dokladá — stierkovanie k vodorovnému značeniu, lepenie
 * k obrubníku, osádzanie na lepidlo k retardérom. Nič sa nedopĺňa obrázkom
 * „na tému". `.filter` chráni pred tým, aby preklep v `id` urobil prázdny riadok.
 */
const KROKY = [
  { nazov: FIRMA.technologie.polozky[0], foto: foto('vodorovne-znacenie-komunikacia') },
  { nazov: FIRMA.technologie.polozky[1], foto: foto('medeny-hamor-obrubnik') },
  { nazov: FIRMA.technologie.polozky[2], foto: foto('retardery-dvojrad') },
].filter((k) => k.foto && k.nazov)

/** Popisok fotky podľa jediného pravidla webu (`Realizacie/skupiny.js`). */
const popisZaberu = (k) => `${k.foto.prvok} · ${castiPopisu(k.foto)[0]}`

/* Hlavička je 72 px; karta sa pripína 24 px pod ňou a každá ďalšia o 16 px
   nižšie, aby bolo vidieť, že pod vrchnou niečo je. */
const TOP_ZAKLAD = 96
const TOP_KROK = 16

/**
 * Scrim pod textom. Nie je to dekorácia, ale nosič kontrastu: biely text leží
 * na fotografii, ktorej svetlosť sa nedá dopredu zaručiť. Spodná tretina je
 * prakticky plný `--color-accent-2`, takže dvojica biela/#1b1e20 drží nad
 * 15:1 aj na najsvetlejšom zábere (STANDARDY B7). Je to lineárna zmes dvoch
 * tokenov, čo kontrola farieb B3r pripúšťa.
 */
const SCRIM =
  'linear-gradient(to top, var(--color-accent-2) 0%, var(--color-accent-2) 18%, color-mix(in srgb, var(--color-accent-2) 88%, transparent) 42%, color-mix(in srgb, var(--color-accent-2) 45%, transparent) 66%, color-mix(in srgb, var(--color-accent-2) 12%, transparent) 84%, transparent 100%)'

function Karta({ krok, index, pocet, priebeh, reduced }) {
  // Karta sa začne zmenšovať vo chvíli, keď ju začne prekrývať nasledujúca,
  // a dojazd má na konci celého stohu. Posledná karta ostáva na 1 — nie je
  // čím ju prekryť, takže by sa zmenšovala bez príčiny.
  const cielovaSkala = 1 - (pocet - 1 - index) * 0.03
  const zaciatok = index / pocet
  const skala = useTransform(priebeh, [zaciatok, 1], [1, cielovaSkala])
  const transform = useMotionTemplate`scale(${skala})`
  const tien = useTransform(priebeh, [zaciatok, 1], [0, index === pocet - 1 ? 0 : 0.55])

  const obsah = (
    <>
      <img
        src={`${BASE}assets/${krok.foto.src}`}
        srcSet={srcSetPre(krok.foto.src, krok.foto.w)}
        sizes="(min-width: 1024px) 78rem, 100vw"
        width={krok.foto.w}
        height={krok.foto.h}
        alt={krok.foto.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM }} />

      {/* Stmavenie podkladovej karty. `motion.div` s `opacity` je najlacnejší
          spôsob, ako uberať pozornosť — mieša sa to na kompozítore a nesiaha
          to na `filter`, ktorý by z karty urobil obsahujúci blok. */}
      {!reduced ? (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[var(--color-accent-2)]"
          style={{ opacity: tien }}
        />
      ) : null}

      <div className="relative flex h-full flex-col justify-end p-7 sm:p-10 lg:p-14">
        <div
          aria-hidden="true"
          className="mb-6 h-[2px] w-14 bg-[var(--color-accent)] sm:w-20"
        />
        <h3 className="max-w-[18ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)] lg:text-[length:var(--text-4xl)]">
          {krok.nazov}
        </h3>
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-bg)]">
          {popisZaberu(krok)}
        </p>
      </div>
    </>
  )

  const triedaKarty =
    'relative h-[62svh] min-h-[380px] w-full overflow-hidden bg-[var(--color-accent-2)] lg:h-[70svh]'

  // Pri reduced-motion sa `sticky` ani scrub nemontuje: karty sú obyčajný
  // stĺpec. Rovnaké markup, rovnaký obsah — len sa neskladajú.
  if (reduced) {
    return (
      <div className={`${triedaKarty} mb-5`} style={{ borderRadius: 'var(--radius-sm)' }}>
        {obsah}
      </div>
    )
  }

  return (
    <div
      className="sticky mb-5"
      style={{ top: `${TOP_ZAKLAD + index * TOP_KROK}px` }}
    >
      <motion.article
        className={triedaKarty}
        style={{
          transform,
          // `top center`, nie default `center`. Pri strede sa karta zmenšuje
          // na obe strany, takže jej vrch klesne o (1−scale)·výška/2 ≈ 19 px —
          // presne toľko, koľko je odstup `top` medzi kartami, a stoh sa
          // zbehne do jednej hrany (namerané: 115 / 119 / 219 px namiesto
          // 96 / 110 / 124). S kotvou na vrchu sa horná hrana nehýbe a
          // odstupňovanie `top` ostane presne také, aké je zadané.
          transformOrigin: 'top center',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {obsah}
      </motion.article>
    </div>
  )
}

export default function Technologie() {
  const reduced = useReducedMotion()
  const stohRef = useRef(null)
  // Rozsah je prísne rastúci a v [0,1] — `useTransform` s klesajúcim alebo
  // rovným rozsahom hodí vo WAAPI chybu offsetov a zhasne celú stránku
  // (STANDARDY E3, nález 08-23).
  const { scrollYProgress } = useScroll({
    target: stohRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="technologie"
      data-pasmo="tmava"
      className="bg-[var(--color-surface-2)] py-[var(--section-padding-y)] text-[var(--color-bg)]"
    >
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <MonoStitok tmava>Technológie</MonoStitok>
          <div className="mt-5 grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-12 lg:items-end">
            <h2 className="max-w-[14ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)] md:text-[length:var(--text-5xl)] lg:col-span-6">
              Ako to robíme
            </h2>
            <p className="max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-75 lg:col-span-6">
              {FIRMA.technologie.uvod}
            </p>
          </div>
        </Reveal>

        {/* Stoh. Runway je súčet výšok kariet v toku — žiadny umelý
            `height: 240vh`, ktorý by sa pri zmene počtu kariet rozišiel
            s obsahom. Posledná karta má `pb`, aby sa stoh nedotýkal
            záverečného riadku sekcie. */}
        <div ref={stohRef} className="mt-14 pb-10 lg:mt-20">
          {KROKY.map((krok, i) => (
            <Karta
              key={krok.nazov}
              krok={krok}
              index={i}
              pocet={KROKY.length}
              priebeh={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col gap-5 border-t border-[rgba(255,255,255,0.18)] pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10 lg:mt-24">
          <p className="max-w-[42ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-70">
            {FIRMA.technologie.zaver}
          </p>
          <Tlacidlo variant="tichy" tmava to="/sluzby">
            Všetkých deväť služieb
          </Tlacidlo>
        </Reveal>
      </div>
    </section>
  )
}
