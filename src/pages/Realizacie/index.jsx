import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { MonoStitok, Sekcia, SekciaHlavicka, StranHlavicka, Tlacidlo } from '../../components/kit/index.js'
import { Reveal } from '../../components/primitives/index.js'
import { GALERIA, MIESTA_REALIZACII } from '../../content/realizacie.js'
import { openObhliadka } from '../../lib/obhliadka.js'
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
import Lightbox from './Lightbox.jsx'

const META = routaPodlaCesty('/realizacie')
const BASE = import.meta.env.BASE_URL

/** Koľko služieb má v galérii aspoň jednu fotku (fakt do hlavičky, počítaný z dát). */
const POCET_SLUZIEB = new Set(GALERIA.map((r) => r.sluzba)).size

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

  // Zmena filtra mení poradie aj obsah zoznamu, takže index otvoreného náhľadu
  // by ukazoval na inú fotku. Náhľad sa preto zatvorí.
  useEffect(() => {
    setAktivny(null)
  }, [prvok, miesto])

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
    <>
      <Seo title={META?.title} description={META?.description} />

      <StranHlavicka
        stitok="Realizácie"
        nadpis="Fotografie realizovaných prvkov"
        perex={META?.description}
        fakty={[`${GALERIA.length} fotografií`, `${POCET_SLUZIEB} služieb`, 'Exteriér a interiér']}
      />

      {/*
        `padding="ziadne"` + vlastný spodný padding z toho istého tokenu: medzi
        lajnou `StranHlavicka` a filtračnou lištou inak stáli dva spodné/horné
        paddingy nad sebou (2 × 79 px) a prvá fotka spadla pod ohyb. Rytmus
        drží spodná hrana pásma, ktorá ostáva na `--section-padding-y`.
      */}
      <Sekcia pasmo="biela" padding="ziadne" className="pb-[var(--section-padding-y)]">
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
           * Skutočná masonry cez CSS `columns`, nie jednotný pomer s orezom.
           * Zábery majú pomery od 0,45 (721×1600) po 1,54 (600×390) a námetom
           * je vodiaca čiara bežiaca do diaľky; pri jednotnom 4:3 oreze by z
           * portrétových fotiek zostal stred bez začiatku aj konca línie.
           * `columns` necháva každý záber celý, `width`/`height` na `<img>`
           * držia pomer, takže rozloženie stĺpcov nepreskakuje pri lazy-loade.
           */
          <div className="mt-10 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
            {filtrovane.map((r, i) => (
              <figure key={r.id} className="mb-12 break-inside-avoid">
                <button
                  type="button"
                  ref={(el) => {
                    if (el) dlazdice.current.set(r.id, el)
                    else dlazdice.current.delete(r.id)
                  }}
                  onClick={() => otvor(i, r.id)}
                  data-dlazdica={r.id}
                  aria-label={`Zväčšiť fotografiu: ${r.alt}`}
                  className="group block w-full overflow-hidden border border-[var(--color-border)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <img
                    src={`${BASE}assets/${r.src}`}
                    width={r.w}
                    height={r.h}
                    alt={r.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full bg-[var(--color-surface)] transition-transform duration-[var(--duration-fast)] motion-safe:group-hover:scale-[1.02]"
                  />
                </button>
                <figcaption className="mt-4 border-t border-[var(--color-border)] pt-4">
                  <span className="block max-w-[30ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium leading-[var(--leading-normal)] text-[var(--color-text)]">
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
              </figure>
            ))}
          </div>
        )}

        {/*
          Miesta z názvov fotografií klienta, vrátane ôsmich, ku ktorým fotku
          nemáme. Stojí až za mriežkou zámerne: je to doklad o rozsahu, nie
          filter, a nad mriežkou by odtlačil prvú fotku pod ohyb.

          Mená miest sú v prirodzenom písme, nie v mono verzálkach ako
          `PasFaktov`: sú to vlastné mená, teda obsah, nie technický štítok
          (STANDARDY B4), a pätnásť verzálkových názvov za sebou sa číta ako
          krik. Oddeľovač je prilepený nezlomiteľnou medzerou, aby nikdy
          nezačínal riadok, a `--color-accent-deep` má na bielej 5,76:1.
        */}
        <div className="mt-16 border-t border-[var(--color-border)] pt-8">
          <MonoStitok>Miesta realizácií</MonoStitok>
          <ul className="mt-5 flex max-w-[70ch] flex-wrap gap-x-3 gap-y-1 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
            {MIESTA_REALIZACII.map((m, i) => (
              <li key={m} className="max-w-full">
                {m}
                {i < MIESTA_REALIZACII.length - 1 ? (
                  <span aria-hidden="true" className="text-[var(--color-accent-deep)]">
                    {'\u00a0·'}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </Sekcia>

      <Sekcia pasmo="tmava">
        <SekciaHlavicka
          tmava
          stitok="Zadanie"
          nadpis="Pošlite zadanie, vrátime sa s termínom obhliadky"
          perex="Napíšte nám typ prvku, miesto a rozsah. Ozveme sa s termínom obhliadky a návrhom riešenia na mieru."
          akcia={
            <div className="flex flex-wrap gap-4">
              <Tlacidlo variant="primar" onClick={() => openObhliadka()}>
                Dohodnúť obhliadku a cenu
              </Tlacidlo>
              <Tlacidlo variant="sekundar" tmava to="/kontakt">
                Kontakt
              </Tlacidlo>
            </div>
          }
        />
      </Sekcia>

      {aktivny !== null && filtrovane[aktivny] ? (
        <Lightbox
          polozky={filtrovane}
          index={aktivny}
          onZavri={() => setAktivny(null)}
          onPrepni={prepni}
        />
      ) : null}
    </>
  )
}
