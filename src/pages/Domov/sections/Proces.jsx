import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Sekcia, SekciaHlavicka } from '../../../components/kit/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { PROCES } from '../../../content/firma.js'

/**
 * Perex pásma. Skladá sa z krokov v dátach, nie z novej vety o klientovi.
 * Nesmie sľúbiť lehotu ani cenu vopred — `firma.js` to zakazuje výslovne,
 * lebo podklady klienta o žiadnych lehotách nehovoria. Druhá veta je preto
 * posledná veta kroku „Návrh a ponuka", doslova z dát.
 */
const PEREX = `Od dopytu po odovzdanie úseku do užívania. ${PROCES[1].popis.split('. ').pop()}`

/**
 * Postup sa kreslí SCROLLOM a je to **značenie vozovky**, nie drôtený model.
 *
 * ## Čo bolo zle (dvakrát)
 *
 * Prvá verzia mala `IntersectionObserver`, ktorý raz prepol sekciu do stavu
 * „kreslí sa", a prvky mali `transition-delay` podľa indexu. Odmerané po
 * 80 ms: t=80 krok 0 už na opacity 0,64; t=500 tri kroky hotové; t=800 koniec.
 * Úsečka sa teda kreslila POD rodičom, ktorý sa sám prelínal — nevidieť
 * kresliacu sa čiaru, vidieť blok, ktorý sa zjaví. A celé to dobehlo skôr,
 * než sa naň stihol niekto pozrieť.
 *
 * Druhá verzia (scroll namiesto časovača) to opravila mechanicky, ale ostala
 * **nevýrazná a neinteraktívna** (výtka Petra, 28. 8. 2026): vlasová linka
 * 1 px a štvorčeky 10 px sú na bielom pásme cez celú šírku okna prakticky
 * neviditeľné, a hover som pri prepise vyhodil, takže sa s pásmom nedalo
 * nič robiť.
 *
 * ## Čo je namiesto toho
 *
 * Spojnica je **prerušované vodorovné značenie, ktoré sa pred očami
 * prestrieka na súvislú akcentovú čiaru.** Je to prvok z odboru klienta —
 * tá istá reč, akou hovorí prerušovaná čiara v hlavičke a vozovka objazdu —
 * a nie neutrálna „pipeline". Podklad je `repeating-linear-gradient`
 * (nie `border-dashed`: ten nedovolí nastaviť dĺžku čiarky a medzery
 * nezávisle a na 2 px hrúbke sa zaokrúhľuje rôzne v každom prehliadači).
 *
 * Hrúbky: linka 3 px namiesto 1 px, uzol 16 px namiesto 10 px. Sú to
 * najmenšie hodnoty, pri ktorých je značenie na bielom pásme čitateľné zo
 * vzdialenosti, z akej sa pozerá na celú sekciu.
 *
 * ## Interakcia
 *
 * Krok je `<button>` a reaguje na nájazd aj na fokus: jeho uzol sa vyplní,
 * meno sa vysvieti na akcent a popis prestane byť tlmený. Kroky, na ktorých
 * kurzor nie je, majú popis na 60 % — nie preto, aby sa nedali prečítať, ale
 * aby bolo vidieť, čo je vybrané. Bez zásahu svieti prvý krok, lebo
 * spolupráca sa začína dopytom.
 *
 * `whileInView` z knižnice `motion` sa v tomto projekte nepoužíva — merane
 * nefunguje (prvky pod ohybom nedostanú `initial`), pozri QUALITY-LOG.
 * `useScroll` + `useTransform` funguje a je použitý aj v hero a v `Technologie`.
 */

/** Podiel dráhy, ktorý pripadne na jeden krok. */
const OKNO = 1 / PROCES.length

/** Prerušované značenie ako podklad spojnice: 14 px čiarka, 12 px medzera. */
const ZNACENIE =
  'repeating-linear-gradient(90deg, var(--color-border) 0 14px, transparent 14px 26px)'
const ZNACENIE_ZVISLE =
  'repeating-linear-gradient(180deg, var(--color-border) 0 14px, transparent 14px 26px)'

/**
 * Vstupný rozsah `useTransform` musí byť prísne rastúci a v [0, 1] — inak
 * `motion` zhodí celý React strom (nález z iterácie 1, viď pôvodnú
 * `Debarierizacia.jsx`). `zovri` to drží aj pri krajných indexoch.
 */
const zovri = (v) => Math.min(1, Math.max(0, v))

function Krok({ krok, index, posledny, progress, reduced, aktivny, onAktivny }) {
  const start = index * OKNO
  // Uzol sa rozsvieti na začiatku svojho okna, značenie sa strieka zvyškom
  // okna až k ďalšiemu uzlu. Uzol teda vždy predbehne čiaru, ktorá z neho ide.
  const uzolDo = zovri(start + OKNO * 0.28)
  const linkaOd = zovri(start + OKNO * 0.22)
  const linkaDo = zovri(start + OKNO)

  const uzolScale = useTransform(progress, [start, uzolDo], [0.3, 1])
  const uzolOpacity = useTransform(progress, [start, uzolDo], [0, 1])
  // Uzol, cez ktorý už značenie prešlo, ostáva vyplnený. Bez toho boli
  // prvé dva uzly duté, hoci čiara za nimi bola nastriekaná — vyzeralo to,
  // akoby sa značenie kreslilo mimo nich. Výplň je binárna: polovyplnený
  // štvorček vyzerá ako chyba vykreslenia, nie ako medzistav.
  const uzolVypln = useTransform(progress, (v) => (v >= uzolDo ? 'var(--color-accent)' : 'var(--color-bg)'))
  const linkaScale = useTransform(progress, [linkaOd, linkaDo], [0, 1])

  const je = index === aktivny

  return (
    <div data-krok={index} className="relative">
      {!posledny && (
        <>
          {/* Zvislé značenie (do 1024 px). `100% + 40px` sadá na uzol ďalšieho
              kroku: medzera medzi krokmi je `gap-y-14` (56 px), podklad začína
              28 px pod vrchom kroku a uzol ďalšieho je 12 px pod jeho vrchom. */}
          <span
            aria-hidden="true"
            className="absolute left-[6px] top-[28px] h-[calc(100%+40px)] w-[3px] lg:hidden"
            style={{ background: ZNACENIE_ZVISLE }}
          >
            <motion.span
              className="absolute inset-0 block origin-top bg-[var(--color-accent)]"
              style={{ scaleY: reduced ? 1 : linkaScale }}
            />
          </span>
          {/* Vodorovné značenie (od 1024 px). `100% + 24px` od 24 px sadá na
              ľavú hranu ďalšieho stĺpca: 24 + Š + 16 = Š + 40 = Š + `gap-x-10`. */}
          <span
            aria-hidden="true"
            className="absolute left-[24px] top-[6px] hidden h-[3px] w-[calc(100%+16px)] lg:block"
            style={{ background: ZNACENIE }}
          >
            <motion.span
              className="absolute inset-0 block origin-left bg-[var(--color-accent)]"
              style={{ scaleX: reduced ? 1 : linkaScale }}
            />
          </span>
        </>
      )}

      <motion.span
        aria-hidden="true"
        data-uzol={index}
        className="absolute left-0 top-[6px] h-[16px] w-[16px] border-2 lg:top-0"
        style={{
          borderRadius: 'var(--radius-sm)',
          borderColor: 'var(--color-accent)',
          backgroundColor: reduced || je ? 'var(--color-accent)' : uzolVypln,
          scale: reduced ? 1 : uzolScale,
          opacity: reduced ? 1 : uzolOpacity,
        }}
      />

      <button
        type="button"
        onMouseEnter={() => onAktivny(index)}
        onFocus={() => onAktivny(index)}
        // Bez `onClick` bolo tlačidlo na dotyku mŕtve: `onMouseEnter` sa na
        // telefóne nespustí a fokus po ťuknutí nedostane každý prehliadač
        // (Safari na iOS ho tlačidlu nedáva). Prvok, ktorý vyzerá stlačiteľne
        // a na stlačenie nereaguje, je horší než obyčajný text.
        onClick={() => onAktivny(index)}
        aria-pressed={je}
        className="block w-full pl-10 text-left lg:pl-0 lg:pt-10"
      >
        <span
          className="block text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] transition-colors duration-[var(--duration-hover)] ease-[var(--ease-house)]"
          style={{ color: je ? 'var(--color-accent-deep)' : 'var(--color-text)' }}
        >
          {krok.nazov}
        </span>
        {/* Neaktívny krok sa NESMIE stmievať cez `opacity`. Bolo tu
            `opacity: je ? 1 : 0.6`, čo z `--color-muted` (5,6:1) spravilo
            reálnych rgb(157,160,163) = 2,62:1 — teda tri zo štyroch popisov
            pod limitom 4,5:1 (B7, nameral audit 28. 8.). Hierarchiu nesie
            farba, nie priesvitnosť: aktívny krok ide na plný ink, ostatné
            ostávajú na `--color-muted`, ktorý sám o sebe limit spĺňa. */}
        <span
          className="mt-3 block max-w-[34ch] font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] transition-colors duration-[var(--duration-hover)]"
          style={{ color: je ? 'var(--color-text)' : 'var(--color-muted)' }}
        >
          {krok.popis}
        </span>
      </button>
    </div>
  )
}

/**
 * Ako prebieha spolupráca. Štyri kroky doslova z `PROCES` — žiadne sľuby
 * o termínoch ani cenách, tie v podkladoch nie sú.
 *
 * Poradie nesú uzly na spojnici, nie čísla 01/02/03 (STANDARDY B1): na
 * desktope je z krokov vodorovná linka so štyrmi uzlami, na mobile tá istá
 * linka stojí zvisle. Kreslí sa scrollom — mechanika a dôvod sú pri `Krok`.
 *
 * Sekcia je zámerne bez fotografie: je to schéma postupu, nie galéria.
 * Popisy krokov (`PROCES[].popis`) sa vykresľujú od 28. 8. 2026; predtým tu
 * boli len štyri holé mená a pod nimi ~300 px bielej, čo nevyzeralo stručne,
 * ale nedokončene.
 */
export default function Proces() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  // Bez zásahu svieti prvý krok: spolupráca sa začína dopytom.
  const [aktivny, setAktivny] = useState(0)

  // Rozsah: od chvíle, keď mriežka vojde do okna zdola, po chvíľu, keď jej
  // spodok vystúpi nad polovicu. Na 1440×900 je to ~700 px dráhy na štyri
  // kroky, teda ~175 px na krok. Pri užšom rozsahu (skúšané 0,9 → 0,55, čo
  // dávalo ~90 px na krok) linka preletela celú schému za štvrtinu otáčky
  // kolieska a efekt bol späť tam, kde bol s časovačom.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 1', 'end 0.45'] })

  return (
    // Spodné odsadenie je polovičné a je to inline štýl zámerne: `Sekcia`
    // nemá asymetrické odsadenie a trieda `pb-*` by sa s `py-[var(...)]`
    // bila o rovnakú špecificitu (o víťazovi by rozhodlo poradie v CSS, nie
    // zápis tu). Pod Postupom stojí Kontakt, teda ďalšie svetlé pásmo —
    // plné odsadenie oboch dávalo medzi poslednou vetou kroku a štítkom
    // „KONTAKT“ 250 px prázdna.
    <Sekcia id="proces" pasmo="biela" style={{ paddingBottom: 'calc(var(--section-padding-y) / 2)' }}>
      <SekciaHlavicka stitok="Postup" nadpis="Ako prebieha spolupráca" perex={PEREX} />

      <div ref={ref} className="mt-16 grid grid-cols-1 gap-y-14 lg:mt-20 lg:grid-cols-4 lg:gap-x-10">
        {PROCES.map((krok, i) => (
          <Krok
            key={krok.id}
            krok={krok}
            index={i}
            posledny={i === PROCES.length - 1}
            progress={scrollYProgress}
            reduced={reduced}
            aktivny={aktivny}
            onAktivny={setAktivny}
          />
        ))}
      </div>
    </Sekcia>
  )
}
