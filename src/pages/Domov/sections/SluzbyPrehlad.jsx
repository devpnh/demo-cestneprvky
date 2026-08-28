import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Sekcia, MonoStitok, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem, TextRotate } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { SKUPINY, SLUZBY, sluzbyPodlaSkupiny } from '../../../content/sluzby.js'
import KruhovyObjazd from '../../Sluzby/KruhovyObjazd.jsx'
import { altFotky } from '../../Sluzby/fotky.js'

const BASE = import.meta.env.BASE_URL

/** Texty rotátorov. Sú to celé polia z dát, nie vety poskladané v JSX. */
const MENA_SLUZIEB = SLUZBY.map((s) => s.nazov)
const MENA_SKUPIN = SLUZBY.map((s) => SKUPINY.find((k) => k.id === s.skupina)?.nazov ?? '')
const MIESTA = SLUZBY.map((s) => s.dlazdica.miesto)

/**
 * Optická veľkosť mena služby. Deväť názvov má od 10 do 52 znakov a v jednej
 * veľkosti sa rozsah rozliezol od jedného riadku po päť (54 až 270 px na
 * 1 440 px). Stĺpec je centrovaný na os objazdu, takže s každou zmenou dĺžky
 * poskočil aj celý text — pri rotátore to bije do očí dvojnásobne.
 *
 * Krátke meno preto sadzíme väčšie a dlhé menšie, takže každé zaberie dva až
 * tri riadky a má rovnakú optickú váhu. Sú to tri existujúce tokeny, žiadna
 * nová hodnota. Merané na 1 024, 1 280 a 1 440 px: pri tomto zaradení sa
 * žiadne meno nedostane nad 162 px, teda nad rezervu bloku.
 */
function velkostMena(nazov) {
  if (nazov.length <= 16) return 'var(--text-5xl)'
  if (nazov.length <= 35) return 'var(--text-4xl)'
  return 'var(--text-3xl)'
}

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

  // Tri rotátory, jeden zdroj pravdy: index aktívnej služby. `jumpTo` je
  // presne ten režim z podkladu — text skočí na to, čo má návštevník práve
  // pred očami, namiesto toho, aby si tikal vlastným taktom.
  const stitokRef = useRef(null)
  const menoRef = useRef(null)
  const miestoRef = useRef(null)
  useEffect(() => {
    stitokRef.current?.jumpTo(aktivna)
    menoRef.current?.jumpTo(aktivna)
    miestoRef.current?.jumpTo(aktivna)
  }, [aktivna])

  const sluzba = SLUZBY[aktivna]

  return (
    // Spodné odsadenie je jeden a pol násobku a je to inline štýl zámerne
    // (`Sekcia` nemá asymetrické odsadenie; trieda `pb-*` by sa s
    // `py-[var(...)]` bila o rovnakú špecificitu).
    //
    // Dôvod je meraný: štvorec objazdu má 660 px, textový stĺpec vedľa neho
    // ~450 px a stĺpce sú centrované na spoločnú os, takže koleso prečnieva
    // dole o ~105 px. Od jeho spodnej hrany po tmavé pásmo Technológií ostávalo
    // 108 px — a keďže je to kruh, jeho optická hmota siaha ďalej než jeho box.
    // Koleso tak vyzeralo, akoby zasahovalo do nasledujúcej sekcie (výtka
    // Petra, 28. 8. 2026). S 1,5× odsadením je odstup ~300 px a objazd sa
    // uzatvára v svojom pásme.
    <Sekcia id="sluzby" pasmo="biela" style={{ paddingBottom: 'calc(var(--section-padding-y) * 1.5)' }}>
      {siroke ? (
        // Odstup od hlavičky je väčší, než býva medzi hlavičkou a obsahom
        // pásma. Dôvod je tvar: objazd je kruh a jeho box sa dotýka jeho
        // najvyššieho bodu, takže pri bežných 64 px sa okraj kruhu tlačil
        // k perexu a opticky vstupoval do hlavičky (výtka Petra, 28. 8. 2026).
        // So 144 px má kruh okolo seba dych a hlavička ostáva samostatným blokom.
        <div className="grid grid-cols-12 items-center gap-16">
          <Reveal className="col-span-5">
            {/* Nadpis stojí TU, v stĺpci vedľa objazdu, nie nad celým pásmom.
                Samostatná hlavička sekcie („Čo realizujeme na pozemných
                komunikáciách" s perexom, potom krátke „Čo osádzame" s odkazom
                na deväť služieb) bola nad kruhom oddelená medzerou a čítala sa
                ako nadpis stránky, nie ako popis toho, čo sa točí vedľa.
                Odkaz „Všetkých deväť služieb" je preč — pod nadpisom stojí
                „Detail služby", ktorý vedie na práve vybraný prvok, a to je
                z tohto miesta užitočnejšia cesta ďalej (pokyn Petra, 28. 8. 2026). */}
            <MonoStitok sCiarkou={false}>Služby</MonoStitok>
            <h2 className="mb-10 mt-4 max-w-[12ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              Čo osádzame
            </h2>

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

            {/* Bez perexu. Domov službu pomenúva, nevysvetľuje ju — celý
                text stojí na `/sluzby/<slug>`, kam vedie odkaz pod menom.
                Pevnú výšku drží celý blok, nie jednotlivé riadky: pri krátkom
                názve tak nevznikne diera a objazd vedľa neho pri prepínaní
                nepodskakuje.

                Meno služby sa nevymieňa skokom, ale po znakoch (`TextRotate`).
                Riadi ho ten istý index ako oblúk na objazde, takže sa text
                a fotka menia ako jedna udalosť — nie ako dve animácie, ktoré
                sa náhodou zišli. Znaky bežia v maske `overflow-hidden`,
                rovnako ako slová v `SplitText`, aby sa nevynárali cez susedný
                riadok. Pri `prefers-reduced-motion` sa text len prepíše. */}
            <div data-objazd-detail="" className="mt-7 flex min-h-[11rem] flex-col justify-start">
              <MonoStitok sCiarkou={false}>
                <TextRotate
                  ref={stitokRef}
                  texts={MENA_SKUPIN}
                  auto={false}
                  animatePresenceMode="popLayout"
                  splitBy="words"
                  staggerDuration={0.012}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
                  initial={{ opacity: 0, y: '60%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '-60%' }}
                />
              </MonoStitok>
              {/* Šírka riadku je v `rem`, nie v `ch`: `ch` sa počíta z veľkosti
                  písma, takže by sa s ňou menila aj šírka sadzby a meranie
                  riadkov by neplatilo. `min-h` je rezerva na tri riadky —
                  vďaka nej má blok stále tú istú výšku a objazd vedľa neho
                  stojí. */}
              <h3
                className="mt-4 min-h-[10.5rem] max-w-[26rem] font-[family-name:var(--font-display)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]"
                style={{ fontSize: velkostMena(sluzba.nazov) }}
              >
                <TextRotate
                  ref={menoRef}
                  texts={MENA_SLUZIEB}
                  auto={false}
                  animatePresenceMode="popLayout"
                  staggerFrom="first"
                  staggerDuration={0.006}
                  splitLevelClassName="overflow-hidden pb-[0.08em]"
                  transition={{ type: 'spring', duration: 0.6, bounce: 0 }}
                />
              </h3>
            </div>

            <p className="mt-6 flex items-baseline justify-between gap-6 border-t border-[var(--color-border)] pt-4">
              <span className="min-h-[1.25rem] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                <TextRotate
                  ref={miestoRef}
                  texts={MIESTA}
                  auto={false}
                  animatePresenceMode="popLayout"
                  splitBy="words"
                  staggerDuration={0.012}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
                  initial={{ opacity: 0, y: '60%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '-60%' }}
                />
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
        <div>
          <MonoStitok sCiarkou={false}>Služby</MonoStitok>
          <h2 className="mb-10 mt-4 max-w-[12ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            Čo osádzame
          </h2>
          {SKUPINY.map((skupina, si) => (
            <div key={skupina.id} className={si === 0 ? '' : 'mt-12'}>
              <MonoStitok sCiarkou={false}>{skupina.nazov}</MonoStitok>
              <Stagger as="ul" className="mt-4 border-t border-[var(--color-border)]">
                {sluzbyPodlaSkupiny(skupina.id).map((s) => (
                  <StaggerItem as="li" key={s.slug}>
                    <Link
                      to={`/sluzby/${s.slug}`}
                      className="group flex items-center gap-5 border-b border-[var(--color-border)] py-4 transition-colors duration-[var(--duration-hover)] hover:border-[var(--color-accent)]"
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
                      {/* Aj tu bez perexu, rovnako ako na desktope: Domov
                          službu pomenúva, text stojí na jej stránke. Zoznam
                          sa tým na 390 px skrátil o vyše tisíc pixelov. */}
                      <div className="flex min-w-0 flex-1 items-center">
                        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                          {s.nazov}
                        </h3>
                      </div>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-hover)] group-hover:translate-x-[2px]"
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
