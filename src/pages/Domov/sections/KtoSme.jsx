import { Check } from 'lucide-react'
import { Sekcia, MonoStitok, PasFaktov, Tlacidlo } from '../../../components/kit/index.js'
import { CestaSchema, Reveal } from '../../../components/primitives/index.js'
import { CISLA_FIRMY, FIRMA } from '../../../content/firma.js'
import { MIESTA_REALIZACII } from '../../../content/realizacie.js'

/**
 * Prvé pásmo pod hero: kto sme a čo za nami stojí.
 *
 * ## Zjednodušené 28. 8. 2026
 *
 * Pásmo narástlo na štyri bloky textu (nadpis, perex, štyri čísla, štyri
 * tvrdenia s odsekmi, bežiaci pás miest) a bolo z neho druhé „o firme".
 * Peter vypýtal menej textu a návrat bližšie k tomu, čo mal pôvodný web
 * v sekcii O NÁS — tri krátke vety a claim.
 *
 * Ostal preto claim ako nadpis, jedna veta pod ním, štyri čísla vedľa a
 * štyri prednosti ako **holé mená bez odsekov**. Celé znenie predností je
 * na `/o-firme`, kam odtiaľto vedie odkaz.
 *
 * ## Prečo tu nie sú veľké čísla
 *
 * Štyri údaje tu chvíľu stáli vysadené v `--text-6xl` s akcentovou jednotkou
 * a dopočítavali sa od nuly. Je to najrozšírenejší útvar generovaného webu —
 * „veľké číslo, malý popisok pod ním, štyrikrát vedľa seba" — a Peter ho
 * 28. 8. 2026 pomenoval presne tak. Rovnaké slová má aj podklad k dizajnu,
 * ktorý sme si k tejto práci načítali: veľké číslo s malým popiskom je
 * šablónová odpoveď.
 *
 * Fakty ostávajú, lebo sú to tie správne fakty. Zmenil sa ich útvar: sú to
 * riadky `údaj — čo znamená` na vlasovej mriežke, sadzba údaja je `--text-xl`
 * (teda ako meno prednosti nižšie, nie trojnásobok nadpisu) a nič sa
 * nedopočítava. Číslo, ktoré si pýta pozornosť veľkosťou, tu nemá čo robiť;
 * pozornosť si má pýtať claim.
 *
 * ## Odkiaľ je claim
 *
 * `FIRMA.claim` — „Šetríme váš čas aj peniaze" je doslova nadpis pôvodnej
 * sekcie O NÁS. Doteraz nebol na webe nikde a pásmo namiesto neho nieslo
 * `GLOBAL.brand.tagline`, čo je popis odboru, nie tvrdenie firmy.
 *
 * Vetu pôvodného webu „Spolupracujeme s významnými európskymi spoločnosťami"
 * sem zámerne NEBERIEME v tomto znení: je to superlatív o tretích stranách
 * bez ich mien a `firma.js` ho pre celý web zakazuje. To isté hovorí
 * `FIRMA.technologie.zaver` overiteľne — „Materiály a technológie odoberáme
 * od európskych výrobcov" — a v tomto znení stojí v pásme Technológie.
 */

/** Miesta sa doplnia do čísla až tu — `firma.js` o galérii nevie a vedieť nemá. */
const CISLA = CISLA_FIRMY.map((c) =>
  c.id === 'miesta' ? { ...c, hodnota: MIESTA_REALIZACII.length } : c,
)

export default function KtoSme() {
  return (
    // Spodné odsadenie je polovičné a je to inline štýl zámerne (`Sekcia`
    // nemá asymetrické odsadenie a trieda by sa s jej vlastnou bila o rovnakú
    // špecificitu). Pod týmto pásmom stál do 4. 9. 2026 celoplošný
    // fotografický predel; po jeho zrušení sedia dve svetlé pásma na sebe
    // a plné odsadenie z oboch strán by z toho spoja urobilo prázdnu dieru.
    // S polovičným je spoj rovnako široký ako `Proces` → `KontaktKratky`.
    <Sekcia id="kto-sme" pasmo="biela" style={{ paddingBottom: 'calc(var(--section-padding-y) / 2)' }}>
      <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Namiesto fotografie schéma vozovky, na ktorú sa scrollom nastrieka
            značenie (`CestaSchema`). Fotka tu bola a 28. 8. 2026 padla:
            fotografií je na Domove päť ďalších a šiesta už nič nové
            nehovorila. Schéma naproti tomu ukáže poradie prác firmy —
            okraje, deliaca čiara, priečna čiara, priechod a nakoniec
            varovné pásy v akcente.

            Plaketa s údajom „do 30 min", ktorá tu chvíľu ležala cez roh
            schémy, je preč (pokyn Petra, 28. 8. 2026). Samotný údaj ostáva
            v mono riadku faktov vpravo — je to najsilnejšie číslo firmy
            a nemá zo stránky zmiznúť len preto, že zmizol jeho rámček. */}
        <Reveal className="lg:col-span-6">
          <div className="relative h-full">
            <CestaSchema className="h-full" />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6">
          <MonoStitok>Kto sme</MonoStitok>
          <h2 className="mt-5 max-w-[13ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)] md:text-[length:var(--text-5xl)]">
            {FIRMA.claim}
          </h2>
          <p className="mt-6 max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
            {FIRMA.uvod[0]}
          </p>

          {/* Odškrtaný zoznam predností. Sú to tie isté štyri tvrdenia, len
              namiesto štvorstĺpcovej mriežky nadpisov je z nich zoznam, ktorý
              sa dá prečítať za sekundu. Fajka je akcentová a 16 px — je to
              značka, nie ikona so vlastným významom, preto `aria-hidden`. */}
          <ul className="mt-8 grid grid-cols-1 gap-y-4">
            {FIRMA.pristup.map((argument) => (
              <li key={argument.nazov} className="flex items-start gap-3">
                <Check
                  aria-hidden="true"
                  className="mt-[0.2em] h-4 w-4 shrink-0 text-[var(--color-accent)]"
                  strokeWidth={3}
                />
                <span className="font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                  {argument.nazov}
                </span>
              </li>
            ))}
          </ul>

          {/* Zvyšné údaje ako jeden mono riadok, nie ako blok veľkých čísel:
              ten útvar Peter 28. 8. 2026 odmietol ako typicky generovaný. */}
          <PasFaktov
            className="mt-8"
            fakty={CISLA_FIRMY.map((c) =>
              [c.predpona, c.hodnota ?? MIESTA_REALIZACII.length, c.jednotka].filter(Boolean).join(' '),
            )}
          />

          <Tlacidlo variant="primar" to="/o-firme" className="mt-8">
            Ako pracujeme
          </Tlacidlo>
        </Reveal>
      </div>
    </Sekcia>
  )
}
