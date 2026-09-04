import { Sekcia, MonoStitok, Tlacidlo, Lajna } from '../../../components/kit/index.js'
import { Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import HlavickaPasma from '../HlavickaPasma.jsx'
import FotkaVyter from '../FotkaVyter.jsx'
import { zaber, popisZaberu } from '../fotky.js'

/**
 * Podľa čoho navrhujeme — vyhlášky a kam po konzultáciu.
 *
 * Blok o Únii nevidiacich a slabozrakých Slovenska **nie je vyhlásenie
 * o vzťahu s ňou**: hovorí o tom, čo Únia robí, a odkazuje na jej web.
 * Znenie vlastní `FIRMA.konzultacie` a tu sa neprepisuje ani slovo.
 *
 * Predtým bolo toto pásmo tmavé a niesli ho tri veci naraz: konzultácie,
 * vyhlášky a päť značiek materiálov — 1 469 px súvislého textu na jednej
 * ploche. Značky sa odsťahovali do vlastného pásma (`Materialy.jsx`) a tu
 * ostala jedna téma.
 *
 * Doklad k pásmu je signálny pás v Tornali — prvok, ku ktorému Únia vydáva
 * stanoviská a ktorý predpisujú obe uvedené vyhlášky. Fotografia teda
 * dokladá, nezdobí.
 */

const FOTO = zaber('tornala-signalny-pas')

export default function Legislativa() {
  return (
    <Sekcia id="konzultacie" pasmo="biela">
      <HlavickaPasma
        stitok={FIRMA.konzultacie.stitok}
        nadpis={FIRMA.konzultacie.nazov}
        text={FIRMA.konzultacie.popis}
        sirkaNadpisu="max-w-[16ch]"
        aside={
          <Tlacidlo
            className="mt-8"
            variant="tichy"
            href={FIRMA.konzultacie.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Pozrieť ${FIRMA.konzultacie.odkazText}`}
          </Tlacidlo>
        }
      />

      {FOTO ? (
        <FotkaVyter
          className="mt-14"
          src={FOTO.src}
          w={FOTO.w}
          h={FOTO.h}
          alt={FOTO.alt}
          popis={popisZaberu(FOTO)}
          rychlost={0.14}
          sizes="(min-width: 1024px) 78rem, 100vw"
          maxSirka={Infinity}
          triedaRamu="aspect-[4/3] sm:aspect-[21/9] lg:aspect-[3/1]"
        />
      ) : null}

      <Lajna className="mt-16" />

      {/* Vyhlášky ako technický zoznam v mono — je to citácia predpisu, teda
          presne ten druh textu, pre ktorý je mono rez na tomto webe
          vyhradený (STANDARDY B4). Ľavá polovica pomenúva, pravá cituje;
          tie isté dve osi ako po celej stránke. */}
      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
        <div>
          <MonoStitok>Legislatíva</MonoStitok>
          <p className="mt-5 max-w-[30ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
            Podľa týchto predpisov navrhujeme debarierizačné prvky.
          </p>
        </div>

        <Stagger as="ul" krok={90}>
          {FIRMA.normy.map((norma, i) => (
            <StaggerItem
              as="li"
              key={norma}
              className={`border-t border-[var(--color-border)] py-5 ${i === 0 ? 'lg:border-t-0 lg:pt-0' : ''}`}
            >
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                {norma}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Sekcia>
  )
}
