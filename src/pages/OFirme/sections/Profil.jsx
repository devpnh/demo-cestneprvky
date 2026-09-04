import { Sekcia, MonoStitok, Tlacidlo, Lajna } from '../../../components/kit/index.js'
import { Reveal, Stagger, StaggerItem } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import { MIESTA_REALIZACII } from '../../../content/realizacie.js'
import FotkaVyter from '../FotkaVyter.jsx'

/**
 * Profil — prvé pásmo pod hlavičkou. Odpovedá na jedinú otázku: **kto sme
 * a čo osádzame**.
 *
 * ## Čo tu bolo predtým
 *
 * Pásmo nieslo naraz štyri veci: nadpis, dva odseky úvodu, výpočet troch
 * technológií so zoznamom a záverečnú vetu o dodávateľoch — a nad tým ešte
 * mriežku štyroch veľkých čísel. Technológie preto majú vlastné pásmo
 * (`Technologie.jsx`) a značky materiálov tiež (`Materialy.jsx`).
 *
 * ## Prečo tu nie sú veľké čísla
 *
 * Štyri čísla v `--text-6xl` s dopočítavaním od nuly sú najrozšírenejší
 * útvar generovaného webu a Peter ho na Domove pomenoval presne tak
 * (28. 8. 2026, `Domov/sections/KtoSme.jsx`). Fakty ostávajú, mení sa ich
 * forma: riadky technického listu — mono názov údaja, pod ním hodnota.
 *
 * Všetky štyri hodnoty sú z dát: rok a sídlo z `FIRMA`, počet miest z dĺžky
 * `MIESTA_REALIZACII`. Pôsobnosť je doslovná časť vety pôvodného webu
 * („po celom Slovensku“).
 *
 * Mriežka listu je `col-span-3` v dvanástich stĺpcoch, nie `grid-cols-4`:
 * tretia bunka tak padne presne na 752 px, teda na pravú os stránky, a
 * nie o 12 px vedľa nej (pozri `HlavickaPasma`).
 */
const UDAJE = [
  { nazov: 'Založená', hodnota: String(FIRMA.rokZalozenia) },
  { nazov: 'Sídlo', hodnota: FIRMA.sidlo },
  { nazov: 'Pôsobnosť', hodnota: 'Celé Slovensko' },
  { nazov: 'Miesta realizácií', hodnota: String(MIESTA_REALIZACII.length) },
]

export default function Profil() {
  return (
    <Sekcia id="profil" pasmo="biela">
      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <MonoStitok>Profil</MonoStitok>
            <h2 className="mt-5 max-w-[14ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              Čo osádzame
            </h2>
          </Reveal>

          {/* Úvodná veta stránky. Bola aj perexom hlavičky; tam ju Peter
              28. 8. 2026 zrušil („odstráň marginálie z hero sekcie napravo“),
              takže na stránke stojí práve raz — tu. */}
          <Reveal className="mt-8" oneskorenie={80}>
            <p className="max-w-[46ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {FIRMA.uvod[0]}
            </p>
          </Reveal>

          <Reveal className="mt-9" oneskorenie={160}>
            <Tlacidlo variant="tichy" to="/sluzby">
              Rozsah prác po službách
            </Tlacidlo>
          </Reveal>
        </div>

        {/* Fotografia sa odkryje výterom zdola a vnútri rámu sa pri scrolle
            posúva. Je to firemná titulka, jediný záber, ktorý v katalógu
            realizácií nie je (a byť nemá — nie je to realizácia). */}
        <FotkaVyter
          src="10-titulka_o_firme.jpg"
          w={1000}
          h={600}
          pomer="4/3"
          rychlost={0.16}
          alt="Mosadzné hmatové indikátory osadené v dlažbe chodníka"
          popis="Hmatové indikátory v dlažbe chodníka"
          sizes="(min-width: 1024px) 48vw, 100vw"
        />
      </div>

      <Lajna className="mt-16 lg:mt-20" />

      <Stagger className="mt-10 grid grid-cols-2 gap-x-16 gap-y-8 lg:grid-cols-12">
        {UDAJE.map((u) => (
          <StaggerItem key={u.nazov} className="lg:col-span-3">
            <MonoStitok>{u.nazov}</MonoStitok>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-medium leading-[1.2] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              {u.hodnota}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Sekcia>
  )
}
