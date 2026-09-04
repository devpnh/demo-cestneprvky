import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Podstranka, Sekcia, Tlacidlo } from '../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../components/primitives/index.js'
import { GALERIA } from '../../content/realizacie.js'
import { openObhliadka } from '../../lib/obhliadka.js'
import { MAX_MRIEZKA, SIZES_MRIEZKA, srcSetPre } from '../../lib/obrazky.js'
import {
  castiPopisu,
  GALERIA_ZORADENA,
  MIESTA_DOLOZENE,
  NAZVY_SKUPIN,
  SKUPINY_PRVKOV,
  skupinaPreTyp,
  typySkupiny,
} from './skupiny.js'
import Filtre from './Filtre.jsx'
import MapaRealizacii from './MapaRealizacii.jsx'
import Lightbox from './Lightbox.jsx'

const META = routaPodlaCesty('/realizacie')
const BASE = import.meta.env.BASE_URL

/**
 * Koľko dlaždíc má mriežka pod 640 px pred rozkliknutím.
 *
 * Pod 640 px je mriežka jednostĺpcová a 32 fotiek v nej dá vyše dvadsať
 * obrazoviek jedného nepretržitého stĺpca. Vybrali sme dávkovanie, nie dva
 * užšie stĺpce: pri dvoch stĺpcoch má fotka na 390 px šírku 179 px a práve
 * fotografia je na tejto stránke celý dôkaz — vodiaca línia bežiaca do diaľky
 * sa v 179 px nedá prečítať. Dávkovanie necháva fotku cez celú šírku a skráti
 * prvý pohľad na 12 dlaždíc; zvyšok sa do DOM vôbec nevloží, takže sa
 * nesťahujú ani ich súbory.
 */
const PRVA_DAVKA = 12

/** Skloňovanie mikro-labelu tlačidla; v slovenčine sa mení aj „ďalší“, nielen podstatné meno. */
const dalsieFotografie = (n) => {
  if (n === 1) return 'ďalšiu fotografiu'
  if (n < 5) return `ďalšie ${n} fotografie`
  return `ďalších ${n} fotografií`
}

/**
 * Pravda o tom, či mriežka beží v jednom stĺpci (`grid-cols-1` do 639 px).
 * Dlaždice sa pod týmto bodom naozaj nemontujú, nie sú len skryté — inak by
 * sa fotky stiahli a stránka by ostala rovnako vysoká.
 */
function useJedenStlpec() {
  const [jeden, setJeden] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const on = (e) => setJeden(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return jeden
}

export default function Realizacie() {
  const [params, setParams] = useSearchParams()

  // Hodnota z URL platí, len keď existuje v dátach; navyše prijmeme aj starý
  // odkaz na konkrétny typ prvku a preložíme ho na jeho celok, aby raz poslaný
  // link neskončil na prázdnej galérii.
  const surovyPrvok = params.get('prvok') ?? ''
  const prvok = NAZVY_SKUPIN.includes(surovyPrvok) ? surovyPrvok : skupinaPreTyp(surovyPrvok)
  const suroveMiesto = params.get('miesto') ?? ''
  const miesto = MIESTA_DOLOZENE.includes(suroveMiesto) ? suroveMiesto : ''

  const [aktivny, setAktivny] = useState(null)
  const dlazdice = useRef(new Map())
  const vratFokus = useRef(null)

  const jedenStlpec = useJedenStlpec()
  const [rozbalene, setRozbalene] = useState(false)
  const fokusPoRozbaleni = useRef(null)

  const filtrovane = useMemo(() => {
    const typy = typySkupiny(prvok)
    return GALERIA_ZORADENA.filter(
      (r) => (!typy || typy.includes(r.prvok)) && (!miesto || r.miesto === miesto),
    )
  }, [prvok, miesto])

  // Filter je stav v URL, aby sa výber dal poslať odkazom. `replace` preto, aby
  // sa história nezaplnila každým kliknutím a tlačidlo Späť viedlo preč zo
  // stránky, nie cez desať medzistavov filtra.
  const nastav = useCallback(
    (kluc, hodnota) => {
      const dalsie = new URLSearchParams(params)
      if (hodnota) dalsie.set(kluc, hodnota)
      else dalsie.delete(kluc)
      setParams(dalsie, { replace: true })
    },
    [params, setParams],
  )

  // Skrátený je len jednostĺpcový pohľad a len dovtedy, kým ho návštevník
  // nerozbalí. `viditelne` je vždy PREFIX `filtrovane`, takže index dlaždice
  // je zároveň indexom do plného zoznamu — lightbox aj šípky v ňom prechádzajú
  // celú filtrovanú sadu, nielen prvú dávku.
  const skratene = jedenStlpec && !rozbalene && filtrovane.length > PRVA_DAVKA
  const viditelne = skratene ? filtrovane.slice(0, PRVA_DAVKA) : filtrovane

  // Zmena filtra mení poradie aj obsah zoznamu, takže index otvoreného náhľadu
  // by ukazoval na inú fotku. Náhľad sa preto zatvorí a mriežka sa vráti na
  // prvú dávku — po novom filtri je zoznam iný a kratší.
  useEffect(() => {
    setAktivny(null)
    setRozbalene(false)
  }, [prvok, miesto])

  // Tlačidlo po kliknutí zmizne, takže by fokus spadol na `<body>` a klávesnica
  // by začala odznova. Presunieme ho na prvú odkrytú dlaždicu; `preventScroll`
  // preto, aby sa pohľad neposunul preč od miesta, kde tlačidlo stálo.
  useEffect(() => {
    if (!rozbalene) return
    const id = fokusPoRozbaleni.current
    fokusPoRozbaleni.current = null
    if (!id) return
    const el = dlazdice.current.get(id)
    if (el && typeof el.focus === 'function') el.focus({ preventScroll: true })
  }, [rozbalene])

  const rozbal = () => {
    fokusPoRozbaleni.current = filtrovane[PRVA_DAVKA] ? filtrovane[PRVA_DAVKA].id : null
    setRozbalene(true)
  }

  // Fokus sa po zatvorení vracia na dlaždicu, ktorá náhľad otvorila. Beží až po
  // odmontovaní `Lightbox`u, teda po tom, ako z `#root` zmizne `inert`.
  useEffect(() => {
    if (aktivny !== null) return
    const ciel = vratFokus.current
    vratFokus.current = null
    if (ciel && typeof ciel.focus === 'function') ciel.focus()
  }, [aktivny])

  const otvor = (i, id) => {
    vratFokus.current = dlazdice.current.get(id) ?? null
    setAktivny(i)
  }

  const prepni = useCallback(
    (delta) => {
      setAktivny((i) => (i === null ? i : (i + delta + filtrovane.length) % filtrovane.length))
    },
    [filtrovane.length],
  )

  const zrus = () => setParams(new URLSearchParams(), { replace: true })

  return (
    <Podstranka
      meta={META}
      stitok="Realizácie"
      nadpis="Fotografie realizovaných prvkov"
      vyzva={{
        nadpis: 'Pošlite zadanie k prvku z galérie',
        perex: 'Napíšte nám typ prvku, miesto a rozsah prác. Ozveme sa a dohodneme ďalší postup.',
        akcia: (
          <div className="flex flex-wrap gap-4">
            <Tlacidlo variant="primar" data-cta-obhliadka onClick={() => openObhliadka()}>
              Dohodnúť obhliadku a cenu
            </Tlacidlo>
            <Tlacidlo variant="sekundar" to="/kontakt">
              Kontakt
            </Tlacidlo>
          </div>
        ),
      }}
    >
      {/*
        Vlastné paddingy namiesto `padding="plne"`. Plný horný padding (79 px)
        nad spodným paddingom `StranHlavicka` dával 2 × 79 px a prvá fotka
        spadla pod ohyb; nula ich naopak zlepila a filtračná lišta sedela
        priamo na hrane tmavého pásma (výtka Petra). Horná hrana preto beží na
        malom tokene — lišta má nad sebou vzduch, ale mriežka ostáva nad
        ohybom. Spodná hrana drží rytmus pásma na `--section-padding-y`.
      */}
      <Sekcia
        pasmo="biela"
        padding="ziadne"
        className="pt-[var(--section-padding-y-sm)] pb-[var(--section-padding-y)]"
      >
        <Reveal>
          <Filtre
            skupiny={SKUPINY_PRVKOV}
            miesta={MIESTA_DOLOZENE}
            prvok={prvok}
            miesto={miesto}
            onPrvok={(v) => nastav('prvok', v)}
            onMiesto={(v) => nastav('miesto', v)}
            pocet={filtrovane.length}
            celkom={GALERIA.length}
            onZrusit={zrus}
          />
        </Reveal>

        {filtrovane.length === 0 ? (
          <div className="mt-12 border-t border-[var(--color-border)] pt-10">
            <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {'Pre túto kombináciu prvku a miesta nemáme fotografiu. Skúste iný typ prvku alebo iné miesto.'}
            </p>
            <Tlacidlo variant="sekundar" onClick={zrus} className="mt-8">
              Zrušiť filtre
            </Tlacidlo>
          </div>
        ) : (
          /*
           * Kontaktný hárok, nie masonry.
           *
           * Predtým tu bola skutočná masonry cez CSS `columns`: každý záber
           * ostal celý, ale zábery majú pomery od 0,45 (721 × 1600) po 1,54
           * (600 × 390), takže stĺpce mali rôzne dlhé dlaždice, popisky sa
           * míňali o desiatky pixelov a stena tridsiatich dvoch fotiek
           * pôsobila rozhádzane (výtka Petra, 27. 8. 2026).
           *
           * Mriežka má preto jeden pomer 4:3 a jednu výšku popisku, takže
           * riadky sedia na spoločnej linke. Orez je vedomá strata: portrétová
           * fotka v nej nemá začiatok ani koniec vodiacej línie. Celý záber
           * ostáva k dispozícii na kliknutie — lightbox ho ukazuje
           * neorezaný a v plnom rozlíšení, mriežka je len register.
           */
          <Stagger krok={45} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {viditelne.map((r, i) => (
              <StaggerItem as="figure" key={r.id} className="min-w-0">
                <button
                  type="button"
                  ref={(el) => {
                    if (el) dlazdice.current.set(r.id, el)
                    else dlazdice.current.delete(r.id)
                  }}
                  onClick={() => otvor(i, r.id)}
                  data-dlazdica={r.id}
                  aria-label={`Zväčšiť fotografiu: ${r.alt}`}
                  className="group block aspect-[4/3] w-full overflow-hidden border border-[var(--color-border)] transition-colors duration-[var(--duration-hover)] hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <img
                    src={`${BASE}assets/${r.src}`}
                    srcSet={srcSetPre(r.src, r.w, MAX_MRIEZKA)}
                    sizes={SIZES_MRIEZKA}
                    width={r.w}
                    height={r.h}
                    alt={r.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full bg-[var(--color-surface)] object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-house)] motion-safe:group-hover:scale-[1.04]"
                  />
                </button>
                {/* Pevná výška popisku drží spodné hrany riadka na jednej linke
                    aj pri jedno- a dvojriadkovom názve prvku. */}
                <figcaption className="mt-4 flex min-h-[3.5rem] flex-col border-t border-[var(--color-border)] pt-3">
                  <span className="line-clamp-1 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium leading-[var(--leading-normal)] text-[var(--color-text)]">
                    {r.prvok}
                  </span>
                  {/* Pravidlo popisku je v `skupiny.js` — rovnaké tu, v lightboxe aj vo výbere na Domove. */}
                  <span className="mt-1 block font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {castiPopisu(r).map((cast, j) => (
                      <span key={cast}>
                        {j > 0 ? (
                          <span aria-hidden="true" className="mx-2 text-[var(--color-accent-deep)]">
                            ·
                          </span>
                        ) : null}
                        {cast}
                      </span>
                    ))}
                  </span>
                </figcaption>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {/*
          Odkrytie zvyšku mriežky. Tlačidlo existuje len v jednostĺpcovom
          pohľade a len kým je čo odkrývať; na 640 px a vyššie sa nemontuje,
          tam je mriežka dvoj- a trojstĺpcová a celá naraz. Nemá `aria-pressed`
          ani `data-filter` zámerne — nie je to filter a nesmie sa doňho
          zamiešať ani pri automatickom meraní.
        */}
        {skratene ? (
          <div className="mt-8">
            <Tlacidlo variant="sekundar" onClick={rozbal} data-rozbalit className="w-full justify-center">
              {`Zobraziť ${dalsieFotografie(filtrovane.length - PRVA_DAVKA)}`}
            </Tlacidlo>
          </div>
        ) : null}

        <MapaRealizacii />
      </Sekcia>

      {aktivny !== null && filtrovane[aktivny] ? (
        <Lightbox
          polozky={filtrovane}
          index={aktivny}
          onZavri={() => setAktivny(null)}
          onPrepni={prepni}
        />
      ) : null}
    </Podstranka>
  )
}
