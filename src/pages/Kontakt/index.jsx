import { Phone, Mail, MapPin } from 'lucide-react'
import Seo from '../../components/Seo.jsx'
import { routaPodlaCesty } from '../../components/layout/routy.js'
import { Sekcia, SekciaHlavicka, StranHlavicka, MonoStitok, Tlacidlo } from '../../components/kit/index.js'
import { Reveal } from '../../components/primitives/index.js'
import ZadanieForm from '../../components/ZadanieForm.jsx'
import global from '../../content/global.json'

const META = routaPodlaCesty('/kontakt')
const NAP = global.nap

/** Adresa jednou vetou, poskladaná z NAP polí — nikdy prepísaná ručne. */
const ADRESA = `${NAP.street}, ${NAP.postalCode} ${NAP.city}, ${NAP.country}`

/** `tel:` sa líši od zobrazenej podoby len medzerami, preto ho skladáme z NAP. */
const TEL_HREF = `tel:${NAP.phone.replace(/\s+/g, '')}`

/**
 * Odkaz do máp namiesto vloženej mapy: Google embed by ťahal cudzie skripty
 * a cookies do dema, ktoré je `noindex` a nemá cookie lištu.
 */
const MAPY_URL =
  'https://www.google.com/maps/search/?api=1&query=Borov%C3%A1%203295%2F36%2C%20010%2001%20%C5%BDilina'

/** Údaje, ktoré v podkladoch klienta nie sú. Nevymýšľame ich, pomenujeme ich. */
const CHYBAJUCE_UDAJE = ['IČO', 'DIČ', 'Otváracie hodiny', 'Konateľ']

const SPOJENIE = [
  { id: 'telefon', ikona: Phone, label: 'Telefón', hodnota: NAP.phone, href: TEL_HREF, nezalamovat: true },
  { id: 'email', ikona: Mail, label: 'E-mail', hodnota: NAP.email, href: `mailto:${NAP.email}` },
  { id: 'adresa', ikona: MapPin, label: 'Adresa', hodnota: ADRESA, href: null },
]

/**
 * Kontakt.
 *
 * Rytmus pásiem podľa `poznamky/KOMPOZICIA.md` §2: biela (hlavička) → biela
 * (spojenie a formulár) → sivá (sídlo ako statický blok s odkazom do máp) →
 * tmavá pätička. Dve tmavé pásma za sebou tu nie sú.
 *
 * Ľavý stĺpec nesie celú vizitku — spojenie aj fakturačné údaje. V prvom kole
 * boli fakturačné údaje dole a stĺpec končil 385 px nad spodkom formulára;
 * presunom hore dostal stĺpec výšku formulára a sivé pásmo dostalo jedinú
 * úlohu: adresu a odkaz do máp.
 *
 * Kontaktné údaje sú doslova z `src/content/global.json`, formulár je
 * existujúci `ZadanieForm` (bez `VITE_FORM_ENDPOINT` beží v demo režime a
 * potvrdenie zobrazí sám). Údaje, ktoré klient neposkytol — IČO, DIČ,
 * otváracie hodiny, meno konateľa — sú označené štítkom, nie dopísané.
 */
export default function Kontakt() {
  return (
    <>
      <Seo title={META?.title} description={META?.description} />

      <StranHlavicka
        stitok="Kontakt"
        nadpis="Napíšte nám typ prvku, miesto a rozsah"
        perex="Ozveme sa a dohodneme ďalší postup. Sídlime v Žiline a realizujeme prvky pozemných komunikácií po celom Slovensku."
      />

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
                          className="flex min-h-[44px] flex-col py-6 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-deep)]"
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

            <Reveal className="mt-14">
              <MonoStitok>Fakturačné údaje</MonoStitok>
              <dl className="mt-6">
                {CHYBAJUCE_UDAJE.map((polozka) => (
                  <div
                    key={polozka}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[var(--color-border)] py-4"
                  >
                    <dt className="font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-text)]">
                      {polozka}
                    </dt>
                    <dd className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      Doplní klient
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

      {/* Sídlo: kontaktný blok s odkazom do máp, žiadny vložený Google embed
          a nič, čo by mapu predstieralo. Nadpisom je samotná adresa. */}
      <Sekcia id="sidlo" pasmo="biela">
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
          akcia={
            <Tlacidlo variant="sekundar" href={MAPY_URL} target="_blank" rel="noopener noreferrer">
              Otvoriť v mapách
            </Tlacidlo>
          }
        />
      </Sekcia>
    </>
  )
}
