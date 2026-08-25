import { MonoStitok } from '../../components/kit/index.js'

/**
 * Čo k službe dopĺňa klient.
 *
 * V dátach je chýbajúci podklad zapísaný ako `[DOPLNÍ KLIENT: veta]`. Kým sa
 * ten reťazec vypisoval doslova, čítal ho klient ako nedorobené CMS pole:
 * hranaté zátvorky, prefix a mono rám okolo jedinej vety. Tu sa reťazec
 * rozpadne na dve veci — na vetu (čo presne od klienta potrebujeme) a na
 * štítok „Doplní klient“.
 *
 * Forma je zámerne tá istá ako pri fakturačných údajoch na `/kontakt`:
 * riadok s vlasovou linkou, vľavo vec, vpravo mono štítok. Web tak hovorí o
 * chýbajúcich podkladoch všade rovnako a nepredstiera, že ich má.
 */
const VZOR = /^\s*\[\s*DOPLNÍ KLIENT\s*:\s*([\s\S]*?)\s*\]\s*$/

/**
 * Zo zástupného reťazca vyberie samotnú vetu; iný tvar necháva tak. Veta sa
 * začína veľkým písmenom: v dátach nadväzuje na prefix „DOPLNÍ KLIENT:“ a bez
 * neho by riadok začínal malým písmenom ako preklep.
 */
export const vetaPodkladu = (retazec) => {
  const zhoda = VZOR.exec(retazec)
  const veta = zhoda ? zhoda[1] : retazec
  return veta ? veta.charAt(0).toUpperCase() + veta.slice(1) : veta
}

/** Nadpis bloku. Mikro-label, nie veta o klientovi — preto je v JSX, nie v dátach. */
export const NADPIS_PODKLADOV = 'Čo k tejto službe dopĺňa klient'

/**
 * Hlavička bloku: mono štítok a nadpis. `velky` je pre samostatné pásmo,
 * menšia veľkosť pre stĺpec vedľa fotky.
 */
export function HlavickaPodkladov({ velky = false, className = '' }) {
  return (
    <div className={className}>
      <MonoStitok>Podklady</MonoStitok>
      <h2
        className={`mt-4 max-w-[24ch] text-balance font-[family-name:var(--font-display)] ${
          velky ? 'text-[length:var(--text-2xl)]' : 'text-[length:var(--text-xl)]'
        } font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]`}
      >
        {NADPIS_PODKLADOV}
      </h2>
    </div>
  )
}

/**
 * Zoznam podkladov. `dt` nesie vetu, `dd` mono štítok; na úzkom stĺpci
 * štítok prepadne pod vetu (`flex-wrap`), takže sa nikdy nezalomí do dvoch
 * riadkov vedľa textu.
 */
export default function ZoznamPodkladov({ polozky = [], className = '' }) {
  if (!polozky.length) return null
  return (
    <dl className={className}>
      {polozky.map((p) => (
        <div
          key={p.slice(0, 40)}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[var(--color-border)] py-4"
        >
          <dt className="min-w-[14rem] max-w-[62ch] flex-1 font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)]">
            {vetaPodkladu(p)}
          </dt>
          <dd className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Doplní klient
          </dd>
        </div>
      ))}
    </dl>
  )
}
