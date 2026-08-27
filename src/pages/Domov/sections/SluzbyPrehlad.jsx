import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Sekcia, SekciaHlavicka, MonoStitok, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { SKUPINY, SLUZBY, skupinaPodlaId, sluzbyPodlaSkupiny } from '../../../content/sluzby.js'
import KruhovyObjazd from '../../Sluzby/KruhovyObjazd.jsx'
import { altFotky } from '../../Sluzby/fotky.js'

const BASE = import.meta.env.BASE_URL

/** Perex sa skladá z názvov celkov v dátach, aby na webe nevznikla nová veta o klientovi. */
const PEREX = `Deväť služieb v troch celkoch: ${SKUPINY.map((s) => s.nazov.toLowerCase()).join(', ')}.`

/**
 * Sleduje šírku okna, nie výšku (STANDARDY C2: výšku na dotykových
 * zariadeniach mení lišta prehliadača). Počiatočný stav sa číta priamo z
 * `matchMedia`, takže desktop vykreslí mriežku hneď pri prvom rendere a
 * neprebliskne cez mobilný zoznam.
 */
function useSirsieAkoLg() {
  const [siroke, setSiroke] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const zmena = (e) => setSiroke(e.matches)
    setSiroke(mql.matches)
    mql.addEventListener('change', zmena)
    return () => mql.removeEventListener('change', zmena)
  }, [])
  return siroke
}

/**
 * Služby na Domove — kruhový objazd.
 *
 * Podpisový prvok webu a zároveň prvok z odboru klienta: po asfaltovom
 * prstenci obieha deväť fotiek služieb, v strede je ostrovček s fotkou práve
 * aktívnej služby a vľavo jej detail. Hover alebo fokus nad uzlom prepne
 * detail, klik vedie na stránku služby; bez zásahu sa aktívna služba mení
 * sama každé štyri sekundy a pod kurzorom stojí.
 *
 * Objazd tu už raz bol a v kole 4 ho nahradila mriežka 3 × 3 fotiek. Peter
 * ho 27. 8. 2026 vypýtal späť — mriežka je poriadna, ale je to deviata
 * mriežka fotiek na tom istom webe a stránka po nej vyzerala vygenerovaná.
 * Vracia sa s opravou oboch nameraných výhrad z kola 4:
 *
 * 1. Nesedel na mriežke. Dnes je štvorec objazdu presne siedmimi stĺpcami
 *    dvanásťstĺpcovej mriežky (654,7 px na 1 440 px) a jeho ľavá hrana teda
 *    sedí na tej istej osi ako všetko ostatné v sekcii. `velkost` je 660 px,
 *    teda strop nad šírkou stĺpca — `max-width` sa nikdy neuplatní ako orez.
 * 2. Uzly boli malé. Majú 72 px namiesto 50 px, aktívny 88 px; na fotke
 *    prvku je pri tejto veľkosti vidieť tvar aj farbu.
 *
 * Stĺpce sú centrované na spoločnú os (`items-center`), lebo textový stĺpec
 * je nižší ako štvorec objazdu a zarovnanie hore pod ním nechávalo diery.
 *
 * Na mobile a tablete ostáva zoznam s náhľadmi: kruh sa na 390 px nedá
 * zmysluplne ovládať. Objazd sa pod 1024 px vôbec nemontuje (nie je len
 * skrytý cez CSS), takže telefón nesťahuje deväť fotiek navyše.
 */
export default function SluzbyPrehlad() {
  const reduced = useReducedMotion()
  const siroke = useSirsieAkoLg()
  const [aktivna, setAktivna] = useState(0)
  const vyber = useCallback((i) => setAktivna(i), [])

  const sluzba = SLUZBY[aktivna]
  const skupinaSluzby = skupinaPodlaId(sluzba.skupina)

  return (
    <Sekcia id="sluzby" pasmo="biela">
      <SekciaHlavicka
        stitok="Služby"
        nadpis="Čo realizujeme na pozemných komunikáciách"
        perex={PEREX}
        akcia={
          <Tlacidlo variant="tichy" to="/sluzby">
            Všetkých deväť služieb
          </Tlacidlo>
        }
      />

      {siroke ? (
        <div className="mt-16 grid grid-cols-12 items-center gap-16">
          <Reveal className="col-span-5">
            {/* Postup po deviatich službách ako značenie: dokreslená časť je
                akcentová, zvyšok vlasový. Nahrádza číslovanie 01/02/03, ktoré
                sem podľa STANDARDY B1 nepatrí. */}
            <div aria-hidden="true" className="h-[2px] w-full bg-[var(--color-border)]">
              <div
                className={`h-full bg-[var(--color-accent)] ${
                  reduced ? '' : 'transition-[width] duration-[var(--duration-base)] ease-[var(--ease-house)]'
                }`}
                style={{ width: `${((aktivna + 1) / SLUZBY.length) * 100}%` }}
              />
            </div>

            {/* Pevnú výšku drží celý blok, nie jednotlivé riadky: pri krátkom
                názve tak nevznikne diera medzi titulom a textom a objazd
                vedľa neho pri prepínaní služieb nepodskakuje. */}
            <div key={aktivna} data-objazd-detail="" className="mt-6 min-h-[14rem]">
              <MonoStitok sCiarkou={false}>{skupinaSluzby?.nazov}</MonoStitok>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {sluzba.nazov}
              </h3>
              <p className="mt-4 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {sluzba.perex}
              </p>
            </div>

            <p className="mt-6 flex items-baseline justify-between gap-6 border-t border-[var(--color-border)] pt-4">
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {sluzba.dlazdica.miesto}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] tabular-nums text-[var(--color-muted)]">
                {`${aktivna + 1} / ${SLUZBY.length}`}
              </span>
            </p>

            <Tlacidlo variant="tichy" to={`/sluzby/${sluzba.slug}`} className="mt-8">
              Detail služby
            </Tlacidlo>
          </Reveal>

          <Reveal className="col-span-7" oneskorenie={120}>
            <KruhovyObjazd sluzby={SLUZBY} active={aktivna} onActive={vyber} reduced={reduced} />
          </Reveal>
        </div>
      ) : (
        <div className="mt-12">
          {SKUPINY.map((skupina, si) => (
            <div key={skupina.id} className={si === 0 ? '' : 'mt-12'}>
              <MonoStitok sCiarkou={false}>{skupina.nazov}</MonoStitok>
              <Stagger as="ul" className="mt-4 border-t border-[var(--color-border)]">
                {sluzbyPodlaSkupiny(skupina.id).map((s) => (
                  <StaggerItem as="li" key={s.slug}>
                    <Link
                      to={`/sluzby/${s.slug}`}
                      className="group flex items-start gap-5 border-b border-[var(--color-border)] py-5 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)]"
                    >
                      <img
                        src={`${BASE}assets/${s.dlazdica.src}`}
                        width={s.dlazdica.w}
                        height={s.dlazdica.h}
                        alt={altFotky(s.dlazdica)}
                        loading="lazy"
                        decoding="async"
                        className="h-[64px] w-[96px] shrink-0 object-cover"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                          {s.nazov}
                        </h3>
                        <p className="mt-2 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                          {s.perex}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[2px]"
                        aria-hidden="true"
                      />
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      )}
    </Sekcia>
  )
}
