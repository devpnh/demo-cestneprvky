import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Sekcia, SekciaHlavicka, MonoStitok, Tlacidlo, Fotka } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { SKUPINY, sluzbyPodlaSkupiny } from '../../../content/sluzby.js'
import { altFotky } from '../../Sluzby/fotky.js'

const BASE = import.meta.env.BASE_URL

/** Perex sa skladá z názvov celkov v dátach, aby na webe nevznikla nová veta o klientovi. */
const PEREX = `Deväť služieb v troch celkoch: ${SKUPINY.map((s) => s.nazov.toLowerCase()).join(', ')}.`

/**
 * Dlaždica má na `lg` presne 368 px (kontajner 1 168 px, tri stĺpce, medzera
 * 32 px), teda 26 vw na 1 440 px. Bez tejto hodnoty by si prehliadač podľa
 * predvoleného `SIZES_MRIEZKA` pýtal 33 vw a sťahoval zbytočne väčší variant.
 */
const SIZES_DLAZDICA = '(min-width: 1024px) 26vw, 100vw'

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
 * Jedna služba ako fotografická dlaždica. Prehľad, nie katalóg: fotka, názov
 * a šípka, žiadny perex — perexy stoja na `/sluzby`, kde má návštevník na
 * čítanie priestor. Celá dlaždica je odkaz, takže cieľ má vyše 300 × 290 px.
 *
 * Hover je jazyk kitu (KOMPOZÍCIA §4): vlasový rám do akcentu, šípka o 2 px
 * vpravo a priblíženie fotky o 2 %. Priblíženie je pod `motion-safe`, rám a
 * šípka ostávajú aj pri `prefers-reduced-motion`, aby bol stav kurzora
 * čitateľný bez pohybu.
 */
function Dlazdica({ sluzba }) {
  return (
    <Link
      to={`/sluzby/${sluzba.slug}`}
      data-dlazdica="sluzba"
      className="group block"
    >
      <Fotka
        src={sluzba.dlazdica.src}
        w={sluzba.dlazdica.w}
        h={sluzba.dlazdica.h}
        alt={altFotky(sluzba.dlazdica)}
        pomer="3/2"
        sizes={SIZES_DLAZDICA}
        className="overflow-hidden border border-[var(--color-border)] transition-colors duration-[var(--duration-fast)] [border-radius:var(--radius-sm)] group-hover:border-[var(--color-accent)]"
        triedaObrazka="motion-safe:transition-transform motion-safe:duration-[var(--duration-slow)] motion-safe:group-hover:scale-[1.02]"
      />
      <div className="mt-4 flex min-h-[3.25rem] items-start justify-between gap-4">
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          {sluzba.nazovKratky || sluzba.nazov}
        </h3>
        <ArrowRight
          className="mt-[3px] h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[2px]"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}

/**
 * Služby na Domove.
 *
 * Od `lg` je to mriežka 3 × 3: tri riadky = tri celky zo `SKUPINY`, ktoré
 * majú presne 3 + 3 + 3 služby. Predchodcom bol kruhový objazd; kolo 4 ho
 * zrušilo, lebo ako prehľad nefungoval — deväť náhľadov po 50 px neukázalo
 * nič, poradie sa z kruhu nedalo prečítať a fotka orezaná do kruhu prestala
 * byť fotkou. Objazd navyše nesedel na mriežke kontajnera (ľavá hrana 717 px
 * proti stĺpcom na 136 a 752 px) a pod textovým stĺpcom nechával 150 px
 * prázdna. Mriežka stojí na tých istých stĺpcoch ako všetko ostatné v sekcii
 * a prázdne miesto v nej nevzniká.
 *
 * Vizuálnu silu nesie deväť skutočných fotografií klienta, nie dekorácia.
 * Riadok celku uvádza mono štítok a vlasová linka cez celú šírku kontajnera.
 *
 * Na mobile a tablete ostáva zoznam s náhľadmi: mriežka troch dlaždíc sa na
 * 390 px zmysluplne nezobrazí a zoznam s perexom tam funguje. Nad 1024 px sa
 * zoznam vôbec nemontuje (nie je len skrytý cez CSS) a naopak — na stránke je
 * tak vždy práve deväť fotiek služieb, nie osemnásť, a telefón nesťahuje
 * dlaždice, ktoré nikdy neuvidí.
 */
export default function SluzbyPrehlad() {
  const siroke = useSirsieAkoLg()

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
        <div className="mt-14">
          {SKUPINY.map((skupina, si) => (
            <div key={skupina.id} className={si === 0 ? '' : 'mt-14'}>
              <MonoStitok sCiarkou={false}>{skupina.nazov}</MonoStitok>
              <div aria-hidden="true" className="mt-4 h-px w-full bg-[var(--color-border)]" />
              <Stagger staggerChildren={0.06} className="mt-8 grid grid-cols-3 gap-x-8">
                {sluzbyPodlaSkupiny(skupina.id).map((s) => (
                  <StaggerItem key={s.slug}>
                    <Dlazdica sluzba={s} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12">
          {SKUPINY.map((skupina, si) => (
            <div key={skupina.id} className={si === 0 ? '' : 'mt-12'}>
              <MonoStitok sCiarkou={false}>{skupina.nazov}</MonoStitok>
              <ul className="mt-4 border-t border-[var(--color-border)]">
                {sluzbyPodlaSkupiny(skupina.id).map((s) => (
                  <li key={s.slug}>
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Sekcia>
  )
}
