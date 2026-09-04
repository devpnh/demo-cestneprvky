import { Phone, Mail, MapPin } from 'lucide-react'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Podstranka, Sekcia, SekciaHlavicka, MonoStitok, Tlacidlo } from '../../components/kit/index.js'
import { Reveal } from '../../components/primitives/index.js'
import MapaSlovenska from '../../components/MapaSlovenska.jsx'
import ZadanieForm from '../../components/ZadanieForm.jsx'
import { sadzba } from '../../lib/sadzba.js'
import { REGISTER } from '../../content/firma.js'
import global from '../../content/global.json'

const META = routaPodlaCesty('/kontakt')
const NAP = global.nap

/** Adresa jednou vetou, poskladaná z NAP polí — nikdy prepísaná ručne. */
const ADRESA = `${NAP.street}, ${NAP.postalCode} ${NAP.city}, ${NAP.country}`

/** `tel:` sa líši od zobrazenej podoby len medzerami, preto ho skladáme z NAP. */
const TEL_HREF = `tel:${NAP.phone.replace(/\s+/g, '')}`

/**
 * Odkaz do máp namiesto vloženej mapy: Google embed by ťahal cudzie skripty
 * a cookies do dema, ktoré je `noindex` a nemá cookie lištu. Samotná mapa na
 * stránke je vlastné inline SVG (`components/MapaSlovenska.jsx`), to isté,
 * aké kreslí `/realizacie`.
 */
const MAPY_URL =
  'https://www.google.com/maps/search/?api=1&query=Borov%C3%A1%203295%2F36%2C%20010%2001%20%C5%BDilina'

/**
 * Zápis firmy tak, ako stojí v Obchodnom registri SR. Hodnoty vlastní
 * `src/content/firma.js`, tu sa im len dávajú štítky a poradie.
 *
 * DIČ ani IČ DPH v registri nie sú a v podkladoch klienta tiež nie, takže tu
 * riadok pre ne nie je: vymyslené číslo je horšie než chýbajúce. Otváracie
 * hodiny nie sú údaj z registra a klient ich nedodal, preto sú tiež preč.
 * Dátum narodenia konateľa register zverejňuje, ale na obchodnú prezentáciu
 * nepatrí — je to osobný údaj, ktorý na kontakt nikto nepotrebuje.
 *
 * `REGISTER.konanie` (spôsob konania štatutára) tu nie je: blok sa volá
 * fakturačné údaje a spôsob konania na faktúru ani do hlavičky obchodného
 * kontaktu nepatrí. Bez neho sa ľavý stĺpec zmestí k formuláru namiesto toho,
 * aby ho prerástol o dve tretiny obrazovky.
 *
 * **Základné imanie, deň zápisu a konateľ odišli úplne** (pokyn Petra,
 * 4. 9. 2026) — aj z dát, nie len z tohto zoznamu. Imanie sa na faktúru
 * neuvádza a 5 000 EUR je zákonné minimum, takže ako jediné číslo v bloku
 * hovorilo o firme presne to, čo hovoriť nemá; deň zápisu duplikoval „od roku
 * 2012“ z pätičky a hlavičiek; meno konateľa je osobný údaj a kontakt je na
 * firmu, nie na človeka. Zostávajú štyri riadky, ktoré naozaj idú na faktúru.
 *
 * `REGISTER` je doslovný odpis z registra a cez `sadzbaHlboko` neprešiel,
 * preto ho tu ženieme cez `sadzba()`: „vložka č. 57757/L“ by inak nechala
 * skratku na konci riadka.
 */
const REGISTROVE_UDAJE = [
  { label: 'Obchodné meno', hodnota: REGISTER.obchodneMeno },
  { label: 'IČO', hodnota: REGISTER.ico },
  { label: 'Právna forma', hodnota: REGISTER.pravnaForma },
  { label: 'Zápis', hodnota: REGISTER.zapis },
].map(({ label, hodnota }) => ({ label, hodnota: sadzba(hodnota) }))

const SPOJENIE = [
  { id: 'telefon', ikona: Phone, label: 'Telefón', hodnota: NAP.phone, href: TEL_HREF, nezalamovat: true },
  { id: 'email', ikona: Mail, label: 'E-mail', hodnota: NAP.email, href: `mailto:${NAP.email}` },
  { id: 'adresa', ikona: MapPin, label: 'Adresa', hodnota: ADRESA, href: null },
]

/**
 * Kontakt.
 *
 * Rytmus pásiem podľa `poznamky/KOMPOZICIA.md` §2: biela (hlavička) → biela
 * (spojenie a formulár) → biela (sídlo s mapou) → tmavá pätička. Dve tmavé
 * pásma za sebou tu nie sú.
 *
 * Ľavý stĺpec nesie celú vizitku — spojenie aj údaje zo zápisu. V prvom kole
 * boli fakturačné údaje dole a stĺpec končil 385 px nad spodkom formulára;
 * presunom hore dostal stĺpec výšku formulára a pásmo Sídlo dostalo jedinú
 * úlohu: mapu, adresu a odkaz do máp.
 *
 * Kontaktné údaje sú doslova z `src/content/global.json`, údaje o zápise
 * z `REGISTER` v `src/content/firma.js` a formulár je existujúci
 * `ZadanieForm` (bez `VITE_FORM_ENDPOINT` beží v demo režime a potvrdenie
 * zobrazí sám).
 */
export default function Kontakt() {
  // Bez `vyzva`: záverečný pás výzvy má každá podstránka okrem tejto —
  // vyzývať na kontakt na kontaktnej stránke je nábytok navyše, formulár
  // stojí hneď pod hlavičkou.
  return (
    <Podstranka
      meta={META}
      stitok="Kontakt"
      nadpis="Napíšte nám typ prvku, miesto a rozsah"
      perex="Ozveme sa a dohodneme ďalší postup."
    >

      {/* Spojenie a formulár. Formulár je zámerne na svetlom pásme — jeho polia
          sú navrhnuté ako biele s vlasovým rámom. Malý horný padding preto, že
          hlavička je tiež biela: plný rytmus by medzi linkou a formulárom
          nechal 210 px prázdnej bielej plochy bez zmeny pásma. */}
      <Sekcia id="spojenie" pasmo="biela" padding="male">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <MonoStitok>Spojenie</MonoStitok>
            </Reveal>

            <ul className="mt-8">
              {SPOJENIE.map(({ id, ikona: Ikona, label, hodnota, href, nezalamovat }) => {
                const hodnotaTrieda = `mt-3 block font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-medium leading-[var(--leading-tight)] text-[var(--color-text)] ${
                  nezalamovat ? 'whitespace-nowrap tabular-nums' : 'max-w-[24ch] break-words'
                }`
                const stitok = (
                  <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    <Ikona className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                )
                return (
                  <li key={id} className="border-t border-[var(--color-border)] first:border-t-0">
                    <Reveal>
                      {href ? (
                        <a
                          href={href}
                          className="flex min-h-[44px] flex-col py-6 transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent-deep)]"
                        >
                          {stitok}
                          <span className={hodnotaTrieda}>{hodnota}</span>
                        </a>
                      ) : (
                        <div className="flex min-h-[44px] flex-col py-6">
                          {stitok}
                          <span className={hodnotaTrieda}>{hodnota}</span>
                        </div>
                      )}
                    </Reveal>
                  </li>
                )
              })}
            </ul>

            {/* Fakturačné údaje: štítok naľavo, hodnota napravo od neho, nie pod
                ním — riadkov je osem a osem dvojriadkových blokov by z vizitky
                spravilo druhý formulár. Na 390 px sa dvojica zloží pod seba,
                lebo „Okresný súd Žilina, oddiel Sro, vložka č. 57757/L“ sa do
                polovice mobilnej šírky nezmestí. */}
            <Reveal className="mt-14">
              <MonoStitok>Fakturačné údaje</MonoStitok>
              <dl className="mt-6">
                {REGISTROVE_UDAJE.map(({ label, hodnota }) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-[var(--color-border)] py-3 sm:grid-cols-[9rem_1fr] sm:items-baseline"
                  >
                    <dt className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      {label}
                    </dt>
                    <dd className="font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
                      {hodnota}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal
              className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                Pošlite zadanie
              </h2>
              <div className="mt-8">
                <ZadanieForm />
              </div>
              <p className="mt-6 max-w-[46ch] font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {`V ostrej verzii chodí zadanie priamo na ${NAP.email}.`}
              </p>
            </Reveal>
          </div>
        </div>
      </Sekcia>

      {/* Sídlo: vlastné inline SVG Slovenska s jedinou značkou, ten istý obrys
          aký kreslí `/realizacie`. Žiadny iframe, žiadny cudzí mapový podklad,
          žiadne cookies. Vedľa mapy stojí adresa a odkaz do máp; na 390 px sa
          mriežka zloží a mapa ostane nad textom. */}
      <Sekcia id="sidlo" pasmo="biela">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-7">
            {/* `sidloAkcent`: Žilina je tu jediná značka na mape, takže smie
                niesť značkovú červenú — na `/realizacie` je červená vyhradená
                bodom realizácií a sídlo tam ostáva atramentové. */}
            <MapaSlovenska sidloAkcent popis={`Mapa Slovenska so sídlom firmy v Žiline, ${ADRESA}`} />
          </Reveal>

          <div className="lg:col-span-5">
            <SekciaHlavicka
              stitok="Sídlo"
              // Adresa po riadkoch ako na obálke: pri jednom reťazci s `text-balance`
              // sa zalomilo PSČ na „010 / 01“. Celý reťazec `ADRESA` ostáva na
              // stránke v riadku Adresa v ľavom stĺpci.
              nadpis={
                <>
                  {`${NAP.street},`}
                  <br />
                  {`${NAP.postalCode} ${NAP.city},`}
                  <br />
                  {NAP.country}
                </>
              }
              sirkaNadpisu="max-w-[16ch]"
            />
            <Reveal className="mt-8">
              <Tlacidlo variant="sekundar" href={MAPY_URL} target="_blank" rel="noopener noreferrer">
                Otvoriť v mapách
              </Tlacidlo>
            </Reveal>
          </div>
        </div>
      </Sekcia>
    </Podstranka>
  )
}
