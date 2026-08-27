import { Phone, Mail, MapPin } from 'lucide-react'
import { Sekcia, SekciaHlavicka, MonoStitok, Tlacidlo } from '../../../components/kit/index.js'
import { Stagger, StaggerItem, Reveal } from '../../../components/primitives/index.js'
import { openObhliadka } from '../../../lib/obhliadka.js'
import { PROCES } from '../../../content/firma.js'
import GLOBAL from '../../../content/global.json'

const NAP = GLOBAL.nap
const TEL_HREF = `tel:${NAP.phone.replace(/\s/g, '')}`
const ADRESA = `${NAP.street}, ${NAP.postalCode} ${NAP.city}, ${NAP.country}`

/** Vlasová linka pásma. Odkedy je pásmo svetlé, je to obyčajný token. */
const JEMNA_LINKA = { borderColor: 'var(--color-border)' }

/**
 * Kontakt v skratke — posledné pásmo domovskej stránky.
 *
 * **Je svetlé.** Bolo tmavé a plynulo prechádzalo do rovnako tmavej pätičky;
 * odkedy má pätička späť červený opar (pokyn Petra, 27. 8. 2026), musí byť
 * pásmo nad ňou svetlé, inak sú to dve tmavé plochy za sebou (STANDARDY B5).
 * Tmavá pätička je tak posledný akord stránky, nie pokračovanie bloku, ktorý
 * sa začal už o obrazovku vyššie.
 *
 * Texty sú z dát: perex je prvý krok spolupráce (`PROCES`), NAP údaje sú
 * doslova z `global.json`.
 */
export default function KontaktKratky() {
  return (
    <Sekcia
      id="kontakt"
      pasmo="biela"
    >
      <SekciaHlavicka
        stitok="Kontakt"
        nadpis="Pošlite zadanie, dohodneme obhliadku"
        perex={PROCES[0].popis}
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StaggerItem>
          <a href={TEL_HREF} className="flex min-h-[44px] flex-col border-t pt-5" style={JEMNA_LINKA}>
            <MonoStitok sCiarkou={false} className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
              Telefón
            </MonoStitok>
            <span className="mt-3 whitespace-nowrap font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold tabular-nums text-[var(--color-text)]">
              {NAP.phone}
            </span>
          </a>
        </StaggerItem>

        <StaggerItem>
          <a
            href={`mailto:${NAP.email}`}
            className="flex min-h-[44px] flex-col border-t pt-5"
            style={JEMNA_LINKA}
          >
            <MonoStitok sCiarkou={false} className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
              E-mail
            </MonoStitok>
            <span className="mt-3 break-words font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
              {NAP.email}
            </span>
          </a>
        </StaggerItem>

        <StaggerItem>
          <div className="flex min-h-[44px] flex-col border-t pt-5" style={JEMNA_LINKA}>
            <MonoStitok sCiarkou={false} className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
              Adresa
            </MonoStitok>
            <span className="mt-3 max-w-[24ch] font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[var(--leading-tight)] text-[var(--color-text)]">
              {ADRESA}
            </span>
          </div>
        </StaggerItem>
      </Stagger>

      <Reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <Tlacidlo variant="primar" onClick={() => openObhliadka()}>
          {GLOBAL.contact.ctaLabel}
        </Tlacidlo>
        <Tlacidlo variant="tichy" to="/kontakt">
          Celý kontakt
        </Tlacidlo>
      </Reveal>
    </Sekcia>
  )
}
