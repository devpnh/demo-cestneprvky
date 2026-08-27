import { SekciaHlavicka, Tlacidlo } from '../../../components/kit/index.js'
import { Prelinacka, Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { useReducedMotion } from '../../../lib/useReducedMotion.js'
import { FIRMA } from '../../../content/firma.js'
import { GALERIA } from '../../../content/realizacie.js'
import { castiPopisu } from '../../Realizacie/skupiny.js'

/**
 * Prvé pásmo pod hero. Jeho jediná úloha je **zastaviť oko** (pokyn Petra,
 * 27. 8. 2026: „potrebujeme tam chytiť oko zákazníka“).
 *
 * ## Ako je to postavené
 *
 * 1. **Biely nádych.** Hero je tmavé a plné fotky; hneď za ním musí prísť
 *    vzduch, inak sa oko nemá kde zastaviť. Preto je hore len eyebrow,
 *    claim firmy vysadený najväčším rezom stránky a jedna veta vpravo.
 * 2. **Záber cez celú šírku okna.** Nie do kontajnera — pás ide od hrany po
 *    hranu a je vysoký cez pol obrazovky. Je to jediné miesto na webe, kde
 *    fotka opúšťa mriežku, a práve preto funguje ako zarážka.
 * 3. **Paralaxa.** Fotka je v páse o 16 % vyššia a pri scrollovaní sa v ňom
 *    posúva. Pás tým dostane hĺbku a oko ho zaregistruje aj periférne.
 * 4. **Prelínačka.** Štyri zábery, štyri rôzne typy prvkov — pás sa mení,
 *    takže sa naň dá pozerať dlhšie než dve sekundy.
 *
 * ## Čo tu predtým bolo a prečo to nefungovalo
 *
 * Najprv štyri argumenty ako mriežka 2 × 2, každý s fotkou a štvorriadkovým
 * odsekom: najhustejšia textová plocha na Domove. Potom ten istý obsah bez
 * odsekov a s jedným zaradeným záberom v kontajneri: čisté, ale bez dôrazu —
 * pás v mriežke vyzerá ako ďalšia dlaždica. **Celé znenie argumentov
 * nezmizlo z webu**, stojí na `/o-firme`, kam odtiaľto vedie odkaz.
 *
 * Pás je zámerne až POD bielou hlavičkou a nie hneď pod hero: fotka so
 * scrimom je opticky tmavá plocha a tesne pod tmavým hero by to boli dve
 * tmavé plochy za sebou (STANDARDY B5).
 */

/**
 * Štyri zábery, štyri rôzne typy prvkov — pás tak neukáže štyrikrát to
 * isté. Vyberá sa podľa `id`, takže doplnenie fotky do `realizacie.js` výber
 * nepremieša, a žiadny z nich nestojí inde na Domove (objazd je dnes bez
 * fotiek, Debarierizácia a výber realizácií majú vlastné).
 */
const ZABERY_ID = [
  'vodiaca-linia-pozdlz-cesty', // Vodiaca línia — prvok, ktorý vyhlášky predpisujú
  'protismykovy-nater-nastupiste', // Protišmykový náter
  'nerezove-indikatory-detail', // Nerezové indikátory
  'signalny-pas-vstup', // Signálny pás
]

/**
 * Jediné číslo sekcie. Nie je vymyslené ani zaokrúhlené pre efekt — stojí
 * doslova v texte argumentu „Krátke obmedzenie dopravy“ (`firma.js`).
 */
const CISLO = { hodnota: '30 min', popis: '100 % pevnosti lepeného obrubníka' }

/** Popisok pod fotkou je fakt; pravidlo, čo sa smie napísať, žije v `skupiny.js`. */
const ZABERY = ZABERY_ID.map((id) => GALERIA.find((r) => r.id === id))
  .filter(Boolean)
  .map((r) => ({ src: r.src, w: r.w, h: r.h, alt: r.alt, popis: `${r.prvok} · ${castiPopisu(r)[0]}` }))

export default function Preco() {
  const reduced = useReducedMotion()

  return (
    /*
     * Sekcia si píše vlastnú kostru namiesto `Sekcia` z kitu: kit vždy
     * zabalí obsah do kontajnera 78 rem a pás cez celú šírku okna by sa
     * doňho nezmestil. `data-pasmo` a odsadenia sú preto ručne, ale
     * z tých istých tokenov, takže rytmus aj kontrola B5 sedia.
     */
    <section id="preco" data-pasmo="biela" className="bg-[var(--color-bg)] py-[var(--section-padding-y)] text-[var(--color-text)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <SekciaHlavicka
          stitok="Prečo Cestné prvky"
          nadpis={FIRMA.claim}
          perex={FIRMA.technologie.uvod}
          sirkaNadpisu="max-w-[12ch]"
          className="[&_h2]:text-[length:var(--text-5xl)]"
        />
      </div>

      {/*
        Pás cez celú šírku okna. Nie `w-screen` s posunom o polovicu:
        `100vw` počíta aj so zvislým scrollbarom, takže by stránka dostala
        pár pixelov vodorovného pretečenia a padla by kontrola D1. Tento pás
        je priamy potomok sekcie, ktorá kontajner nemá, takže je od hrany po
        hranu sám od seba.
      */}
      {ZABERY.length ? (
        <Reveal className="mt-16 lg:mt-20">
          <Prelinacka
            zabery={ZABERY}
            pomer="auto"
            reduced={reduced}
            parallax={16}
            maxSirka={Infinity}
            sizes="100vw"
            triedaRamu="h-[clamp(22rem,58vh,40rem)] [border-radius:0]"
            triedaPopisu="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]"
          />
        </Reveal>
      ) : null}

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-12">
          {/* Číslo drží ľavý stĺpec samo. Je to jediná vec v sekcii vysadená
              veľkosťou hlavného nadpisu, takže sa oko zastaví práve tu. */}
          <Reveal className="lg:col-span-4">
            <p className="font-[family-name:var(--font-display)] text-[length:var(--text-6xl)] font-semibold leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              {CISLO.hodnota}
            </p>
            <p className="mt-5 max-w-[24ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
              {CISLO.popis}
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {FIRMA.pristup.map((argument) => (
              <StaggerItem key={argument.nazov} className="border-t border-[var(--color-border)] pt-5">
                <h3 className="max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                  {argument.nazov}
                </h3>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-14 lg:mt-16">
          <Tlacidlo variant="tichy" to="/o-firme">
            Ako pracujeme
          </Tlacidlo>
        </Reveal>
      </div>
    </section>
  )
}
