import { useCallback, useEffect, useRef, useState } from 'react'
import { Accessibility, Bike, Blocks, Droplets, Eraser, Hand, Route, ShieldCheck, TrafficCone } from 'lucide-react'

/** Geometria SVG vozovky. Uzly aj oblúk počítajú z tých istých čísel. */
const STRED = 300
const POLOMER = 240
const SIRKA_VOZOVKY = 52
/** Polomer obežnej dráhy ako podiel šírky objazdu — uzly jazdia po strede vozovky. */
const PODIEL_DRAHY = POLOMER / (STRED * 2)
/** Uhol, na ktorom stojí „predok“ objazdu: 90° je v súradniciach SVG dole, teda najbližšie k divákovi. */
const PREDOK = 90
/** Celá otáčka za 96 s. Pomalšie než v predlohe (60 s): uzol sa musí dať pohodlne kliknúť. */
const OTACKA_MS = 96000

/**
 * Ikona pre každú službu. Kruh nesie ikony, nie fotografie — deväť fotiek
 * orezaných do 56 px koliesok nekomunikovalo nič a fotografie majú na tejto
 * stránke vlastné miesto (prelínačka v pásme „Prečo“ a výber realizácií).
 */
const IKONY = {
  'znacenie-pre-nevidiacich': Accessibility,
  'vodorovne-dopravne-znacenie': Route,
  'lepene-obrubniky': Blocks,
  'spomalovace-dopravy': TrafficCone,
  'zalievkove-a-vyspravkove-hmoty': Droplets,
  'protismykovy-nater': ShieldCheck,
  cyklotrasy: Bike,
  'stitky-braillovo-pismo': Hand,
  'odstranenie-znacenia': Eraser,
}

/** Rozdiel dvoch uhlov normalizovaný do (−180°, 180°], teda po kratšej strane. */
const kratsiaCesta = (z, na) => (((na - z) % 360) + 540) % 360 - 180

/**
 * Kruhový objazd služieb — orbitálna os v reči tohto webu.
 *
 * Deväť uzlov obieha po asfaltovom prstenci. Uzol, ktorý je práve vpredu
 * (dole, najbližšie k divákovi), je aktívny a stránka vedľa neho vypisuje
 * jeho celok a názov — objazd teda **beží a ukazuje sám od seba**, bez toho,
 * aby doň musel niekto kliknúť. Kliknutie uzol pripne: otáčanie zastane,
 * kliknutý uzol sa po kratšej strane presunie dopredu a uzly z toho istého
 * celku pulzujú akcentom. Ďalšie kliknutie naň (alebo klik do plochy
 * objazdu) pripnutie zruší a objazd sa rozbehne.
 *
 * ## Čo sa tu už raz pokazilo
 *
 * 1. **Ovládať sa dal iba posledný uzol.** Každý uzol visel v priehľadnom
 *    štvorci cez celú plochu objazdu a tie sa prekrývali, takže myš chytal
 *    ten posledný v poradí. Obaly sú preto `pointer-events-none` a
 *    ukazovateľ si zapína späť len samotné tlačidlo.
 * 2. **Prepínanie sa dialo pod kurzorom.** Aktívnu službu menil `hover`,
 *    takže pri prechode myšou cez kruh preblikla polovica služieb. Hover
 *    dnes iba zastaví otáčanie, výber mení klik alebo fokus.
 * 3. **Otáčanie cez React stav.** Predloha prepisuje uhol `setState`om každých
 *    50 ms; tu ho drží `useRef` a rAF slučka zapisuje transformácie priamo do
 *    DOM. React sa prekresľuje len vtedy, keď sa naozaj zmení aktívna služba,
 *    teda raz za ~10 s namiesto dvadsaťkrát za sekundu.
 *
 * Hĺbka je zo `sin` uhla: uzol vpredu má krytie 1 a vyšší `z-index`, uzol za
 * ostrovčekom bledne na 0,45 a ide pod neho. Vďaka tomu kruh pôsobí ako
 * priestor a nie ako plochý ciferník.
 *
 * Pri `prefers-reduced-motion` sa neotáča nič: uzly stoja na svojich miestach
 * a výber sa mení len klikom.
 */
export default function KruhovyObjazd({ sluzby, active, onActive, reduced = false, velkost = 660, uzol = 56 }) {
  const pocet = sluzby.length
  const [pripnuta, setPripnuta] = useState(null)
  const [drziKurzor, setDrziKurzor] = useState(false)

  const uholRef = useRef(0)
  const uzolRefs = useRef([])
  const obalRef = useRef(null)
  /**
   * Polomer dráhy v pixeloch, meraný zo skutočnej šírky objazdu.
   *
   * Percentá by tu boli chyba: `translate` počíta percentá z veľkosti
   * SAMOTNÉHO prvku (56 px uzla), nie z rodiča, takže by uzly skončili
   * natlačené na strede. Preto sa šírka meria a prepočítava pri každej
   * zmene rozmeru.
   */
  const polomerRef = useRef(0)
  const activeRef = useRef(active)
  activeRef.current = active

  const stoji = reduced || drziKurzor || pripnuta !== null

  /**
   * Zapíše polohu, hĺbku a poradie všetkých uzlov pre daný uhol natočenia.
   * Beží v rAF slučke aj pri pripnutí, preto je to `useCallback` bez závislosti
   * na stave — všetko, čo potrebuje, si berie z refov a z argumentov.
   */
  const nakresli = useCallback(
    (sPrechodom) => {
      const u = uholRef.current
      let predny = 0
      let najlepsi = -2
      for (let i = 0; i < pocet; i += 1) {
        const rad = (((i / pocet) * 360 + u) * Math.PI) / 180
        const sin = Math.sin(rad)
        if (sin > najlepsi) {
          najlepsi = sin
          predny = i
        }
        const el = uzolRefs.current[i]
        if (!el) continue
        const hlbka = (1 + sin) / 2
        el.style.transition = sPrechodom
          ? 'transform 700ms var(--ease-house), opacity 700ms var(--ease-house)'
          : 'none'
        const r = polomerRef.current
        el.style.transform = `translate3d(calc(${(Math.cos(rad) * r).toFixed(2)}px - 50%), calc(${(
          Math.sin(rad) * r
        ).toFixed(2)}px - 50%), 0)`
        el.style.opacity = String(0.45 + 0.55 * hlbka)
        el.style.zIndex = String(10 + Math.round(20 * hlbka))
      }
      return predny
    },
    [pocet],
  )

  // Meranie šírky a prvé vykreslenie. `ResizeObserver` a nie `resize` na
  // okne: objazd mení šírku aj vtedy, keď sa mení mriežka okolo neho bez
  // zmeny okna (STANDARDY C2 — na dotyku sa výška okna mení sama).
  useEffect(() => {
    const el = obalRef.current
    if (!el) return undefined
    const zmeraj = () => {
      polomerRef.current = el.getBoundingClientRect().width * PODIEL_DRAHY
      nakresli(false)
    }
    zmeraj()
    const ro = new ResizeObserver(zmeraj)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nakresli])

  // Otáčanie. rAF s reálnym delta časom, takže rýchlosť nezávisí od
  // snímkovej frekvencie a po prepnutí karty prehliadača nepreskočí.
  useEffect(() => {
    if (stoji) return undefined
    let raf = 0
    let posledny = 0
    const krok = (t) => {
      if (posledny) {
        uholRef.current = (uholRef.current + ((t - posledny) / OTACKA_MS) * 360) % 360
        const predny = nakresli(false)
        if (predny !== activeRef.current) onActive(predny)
      }
      posledny = t
      raf = requestAnimationFrame(krok)
    }
    raf = requestAnimationFrame(krok)
    return () => cancelAnimationFrame(raf)
  }, [stoji, nakresli, onActive])

  /** Pripne službu: otáčanie zastane a uzol sa po kratšej strane presunie dopredu. */
  const pripni = useCallback(
    (i) => {
      if (pripnuta === i) {
        setPripnuta(null)
        return
      }
      const ciel = PREDOK - (i / pocet) * 360
      uholRef.current += kratsiaCesta(uholRef.current, ciel)
      setPripnuta(i)
      onActive(i)
      // Prechod sa musí zapísať do štýlu ešte pred novým transformom, inak
      // by prehliadač oba zlúčil do jedného snímku a uzol by skočil.
      requestAnimationFrame(() => nakresli(!reduced))
    },
    [pripnuta, pocet, onActive, nakresli, reduced],
  )

  const skupinaAktivnej = sluzby[active]?.skupina

  return (
    <div
      ref={obalRef}
      data-objazd=""
      className="relative mx-auto aspect-square w-full select-none"
      style={{ maxWidth: `${velkost}px` }}
      onMouseEnter={() => setDrziKurzor(true)}
      onMouseLeave={() => setDrziKurzor(false)}
    >
      {/* Klik do plochy objazdu (nie na uzol) pripnutie zruší. Je to `div`,
          nie `button`: klávesnica má na zrušenie Escape a pre čítačku by tu
          bolo deviate zbytočné tlačidlo bez obsahu. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        onClick={() => setPripnuta(null)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setPripnuta(null)
        }}
      />

      <svg viewBox="0 0 600 600" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx={STRED} cy={STRED} r={POLOMER} fill="none" stroke="var(--color-surface-2)" strokeWidth={SIRKA_VOZOVKY} />
        <circle cx={STRED} cy={STRED} r={POLOMER + SIRKA_VOZOVKY / 2} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx={STRED} cy={STRED} r={POLOMER - SIRKA_VOZOVKY / 2} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx={STRED} cy={STRED} r={POLOMER} fill="none" stroke="var(--color-bg)" strokeWidth="2.5" strokeDasharray="16 14" />
      </svg>

      {/* Ostrovček: dve rozbiehajúce sa akcentové kružnice a počet služieb.
          Je to jediné miesto na webe s pulzom — kruh je podpisový prvok a
          pulz mu dáva stred, ku ktorému sa doprava vzťahuje. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
        {!reduced && (
          <>
            <span aria-hidden="true" className="ostrovcek-pulz absolute inset-0 rounded-full border border-[var(--color-accent)]" />
            <span
              aria-hidden="true"
              className="ostrovcek-pulz absolute inset-0 rounded-full border border-[var(--color-accent)]"
              style={{ animationDelay: '1.6s' }}
            />
          </>
        )}
        <p className="relative text-center font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[1.6] tracking-[0.2em] text-[rgba(255,255,255,0.72)]">
          {pocet}
          <br />
          služieb
        </p>
      </div>

      {/* Obaly uzlov MUSIA byť `pointer-events-none` — pozri bod 1 v doku
          komponentu. Ukazovateľ si zapína späť len samotné tlačidlo. */}
      <div className="pointer-events-none absolute inset-0">
        {sluzby.map((s, i) => {
          const Ikona = IKONY[s.slug] || Route
          const jeAktivna = i === active
          const jePripnuta = i === pripnuta
          // „Príbuzné“ nie sú vymyslený vzťah: je to ten istý celok služieb
          // zo `sluzby.js`. Zvýrazňujú sa len vtedy, keď je niečo pripnuté.
          const jePribuzna = pripnuta !== null && !jePripnuta && s.skupina === skupinaAktivnej

          return (
            <div
              key={s.slug}
              ref={(el) => {
                uzolRefs.current[i] = el
              }}
              className="absolute left-1/2 top-1/2"
              style={{ width: `${uzol}px`, height: `${uzol}px` }}
            >
              <button
                type="button"
                data-uzol={i}
                aria-pressed={jePripnuta}
                // Čiarka, nie pomlčka: kontrola A1 nepovoľuje pomlčky v copy
                // a `aria-label` je copy — číta ho čítačka nahlas.
                aria-label={`${s.nazov}, ${jePripnuta ? 'zrušiť výber' : 'vybrať službu'}`}
                onClick={() => pripni(i)}
                onFocus={() => onActive(i)}
                className={`pointer-events-auto flex h-full w-full items-center justify-center rounded-full border-2 transition-[background-color,border-color,transform,color] duration-[var(--duration-fast)] ease-[var(--ease-house)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] ${
                  jeAktivna
                    ? 'scale-125 border-[var(--color-bg)] bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                    : jePribuzna
                      ? 'uzol-pulz border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-text)]'
                      : 'border-[var(--color-bg)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
                }`}
              >
                <Ikona className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
