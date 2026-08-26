import { MonoStitok, Sekcia, Fotka } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import { GALERIA } from '../../../content/realizacie.js'

/**
 * Dáta prechádzajú slovenskou sadzbou (`src/lib/sadzba.js`), takže názvy
 * argumentov nesú nezlomiteľné medzery („prác a ťažkých“). Kľúč sa preto
 * normalizuje, inak by sa priradenie fotky rozbilo o neviditeľný znak.
 */
const kluc = (t) => String(t || '').replace(/\s+/g, ' ')

/**
 * Fotografia ku každému argumentu. Podmienka je jediná: záber musí tvrdenie
 * naozaj dokladať, nie ho ilustrovať „na tému“. Preto sa berie z katalógu
 * `GALERIA` podľa `id` a pri každom je napísané, čím ho dokladá.
 *
 * `pozicia` posúva orez, keď doklad neleží v strede záberu: pri
 * `vodorovne-znacenie-komunikacia` je zdroj vysoký portrét 721 × 1 600 px a
 * čerstvé značenie parkovacích boxov leží v pásme 780 až 1 185 px. Orez 3 : 2
 * cez stred (560 až 1 041 px) by ukázal stromy a panelák, orez po spodnú hranu
 * (1 119 až 1 600 px) len holý asfalt; 65 % vyberie pásmo 727 až 1 208 px,
 * teda značenie aj ulicu v prevádzke.
 */
const DOKLAD = {
  // Lepený obrubník leží na neporušenom novom kryte: žiadna búračka, žiadny bager.
  'Bez búracích prác a ťažkých mechanizmov': { id: 'medeny-hamor-obrubnik' },
  // Bez fotky zámerne. Toto tvrdenie je o lepených obrubníkoch (30 minút do
  // plnej pevnosti) a jediná scéna, ktorá ich dokladá, stojí o bunku vyššie
  // pri prvom argumente. Záber vodorovného značenia by tvrdenie neilustroval,
  // ale podsúval: hovorí o inej technológii. Namiesto fotky sem ide technický
  // štítok s číslami, ktoré sú doslova v texte argumentu.
  'Krátke obmedzenie dopravy': {
    stitok: { hodnota: '30 min', popis: '100 % pevnosti lepeného obrubníka' },
  },
  // Varovný pás a vodiaca línia sú presne tie prvky, ktoré vyhlášky predpisujú.
  'Súlad s vyhláškami': { id: 'vodiaca-linia-pozdlz-cesty' },
  // Vodiaca línia v priechode je realizovaná zo studeného plastu ColdPlastic,
  // teda z prvého materiálu, ktorý popis argumentu menuje. Fotku retardérov
  // (`retardery-dvojrad`) tu zámerne nepoužívame: je to jediný záber DEBUZ®
  // v celom katalógu a o sekciu nižšie stojí ako dlaždica služby
  // „Spomaľovače dopravy“. Tá istá fotografia dvakrát na jednej obrazovke
  // je viditeľná a lacná; druhý záber retardérov si pýtame v handoveri.
  'Materiály európskych výrobcov': { id: 'priechod-vodiaca-linia-ba' },
}

/**
 * Doklad k argumentu: fotografia, technický štítok, alebo nič. Vracia sa
 * s rozlíšeným druhom, aby sa v mriežke vykreslila správna bunka.
 */
const dokladPre = (nazov) => {
  const z = DOKLAD[kluc(nazov)]
  if (!z) return null
  if (z.stitok) return { druh: 'stitok', ...z.stitok }
  const foto = GALERIA.find((r) => r.id === z.id)
  return foto ? { druh: 'foto', ...foto, pozicia: z.pozicia || '' } : null
}

/**
 * Argument sa na `lg` skladá z troch riadkov spoločnej mriežky (`subgrid`):
 * fotka, názov, popis. Vďaka tomu sedia oba stĺpce riadok po riadku aj vtedy,
 * keď je názov vľavo dvojriadkový a vpravo jednoriadkový. Fotky majú rovnaký
 * pomer aj rovnakú šírku stĺpca, takže prvý riadok je v oboch stĺpcoch
 * rovnako vysoký. Medzery riadkov si položka prepisuje na nulu (`gap-y-0`),
 * lebo zdedená `gap-y-12` sekcie by sa vsunula medzi fotku a názov; odstupy
 * držia `mb-6` a `mt-4`.
 */
const SIZES_DOKLAD = '(min-width: 1024px) 40vw, 100vw'

/**
 * Štyri argumenty, prečo firma robí veci tak, ako ich robí. Texty sú doslova
 * z `FIRMA.pristup`, nadpis je claim klienta z pôvodného webu.
 *
 * Ku každému argumentu stojí fotografia, ktorá ho dokladá. Dôvod je v
 * KOMPOZÍCII §2: web má odo dneška dve pásma namiesto troch, takže rytmus
 * nerobí odtieň pozadia, ale obsah — sekcia s 900 px textu a bez jediného
 * obrazového prvku sa vracia na prepracovanie. Priradenie fotiek je v `DOKLAD`
 * aj s dôvodom pri každej; čo fotka nedokladá, to sa k argumentu nedáva.
 *
 * Zámerne editoriálne, nie kartové: žiadne číslované dlaždice 01/02/03 a
 * žiadne orámované boxy (STANDARDY B1, B6). Argument drží pohromade vlasová
 * linka nad ním a odsadenie, nie rám. Ľavé hrany oboch stĺpcov sedia na
 * mriežke sekcie.
 */
export default function Preco() {
  return (
    <Sekcia id="preco" pasmo="biela">
      {/* Hlavička zámerne nepoužíva `SekciaHlavicka`: tá stavia perex do
          12-stĺpcovej mriežky s dorazením vpravo (`lg:ml-auto`), takže mu ľavá
          hrana vychádzala na 855 px, kým druhý stĺpec argumentov pod ním
          začína na 752 px. Rozdiel 103 px bolo v sekcii vidno. Hlavička preto
          beží na tej istej dvojstĺpcovej mriežke ako argumenty a perex sedí
          presne nad popisom vpravo, oboma hranami. */}
      <Reveal className="grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-2 lg:items-end">
        <div>
          <MonoStitok>Prečo Cestné prvky</MonoStitok>
          <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            {FIRMA.claim}
          </h2>
        </div>
        <p className="font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
          {FIRMA.technologie.uvod}
        </p>
      </Reveal>

      <Stagger
        staggerChildren={0.07}
        className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-2"
      >
        {FIRMA.pristup.map((argument) => {
          const foto = dokladPre(argument.nazov)
          return (
            <StaggerItem
              key={argument.nazov}
              className="border-t border-[var(--color-border)] pt-6 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:gap-y-0"
            >
              {foto && foto.druh === 'foto' ? (
                <Fotka
                  src={foto.src}
                  w={foto.w}
                  h={foto.h}
                  alt={foto.alt}
                  pomer="3/2"
                  sizes={SIZES_DOKLAD}
                  className="mb-6"
                  triedaObrazka={foto.pozicia}
                />
              ) : foto && foto.druh === 'stitok' ? (
                <div
                  className="mb-6 flex flex-col justify-center border border-[var(--color-border)] px-8"
                  style={{ borderRadius: 'var(--radius-sm)', aspectRatio: '3/2' }}
                >
                  <p className="font-[family-name:var(--font-display)] text-[length:var(--text-5xl)] font-semibold leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                    {foto.hodnota}
                  </p>
                  <p className="mt-4 max-w-[22ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
                    {foto.popis}
                  </p>
                </div>
              ) : (
                // Prázdny riadok mriežky drží zarovnanie, keby k argumentu
                // doložený záber nebol; sám o sebe nič nekreslí.
                <div aria-hidden="true" />
              )}
              <h3 className="max-w-[24ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {argument.nazov}
              </h3>
              <p className="mt-4 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {argument.popis}
              </p>
            </StaggerItem>
          )
        })}
      </Stagger>
    </Sekcia>
  )
}
