import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

export const TYPY_PRVKOV = [
  'Značenie pre nevidiacich a slabozrakých',
  'Vodorovné dopravné značenie',
  'Odstránenie starého vodorovného dopravného značenia',
  'Lepené obrubníky',
  'Spomaľovače dopravy (retardéry)',
  'Cyklotrasy',
  'Zálievkové a vysprávkové hmoty',
  'Bezpečnostný protišmykový náter',
  'Štítky: Braillovo písmo, gravírovanie, hmatové mapy',
  'Iné',
]

const POLE =
  'w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 font-[family-name:var(--font-body)] text-[16px] leading-[var(--leading-normal)] text-[var(--color-text)] outline-none transition-colors duration-[var(--duration-fast)] focus:border-[var(--color-accent)]'

const LABEL =
  'block font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]'

/**
 * Zdieľaný formulár zadania (popup aj prípadné osadenie v Kontakte).
 * Endpoint podľa PNH konvencie cez env (Formspark); bez neho beží demo režim
 * a submit zobrazí potvrdenie bez odoslania.
 */
export default function ZadanieForm({ predvolenyTyp = '' }) {
  const [odoslane, setOdoslane] = useState(false)
  const [posiela, setPosiela] = useState(false)
  const [chyba, setChyba] = useState('')
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT || ''

  const onSubmit = async (e) => {
    e.preventDefault()
    setChyba('')
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    if (!endpoint) {
      setOdoslane(true)
      return
    }
    setPosiela(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setOdoslane(true)
    } catch {
      setChyba('Zadanie sa nepodarilo poslať. Skúste to znova, alebo napíšte na info@cestneprvky.sk.')
    } finally {
      setPosiela(false)
    }
  }

  if (odoslane) {
    return (
      <div aria-live="polite">
        <p className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
          {'Ďakujeme, ozveme sa s termínom obhliadky.'}
        </p>
        {!endpoint && (
          <p className="mt-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
            {'Toto je ukážkové demo: zadanie sa zatiaľ nikam neodosiela. V ostrej verzii príde priamo na info@cestneprvky.sk.'}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <label htmlFor="typ-prvku" className={LABEL}>
          Typ prvku
        </label>
        {/* `appearance-none` zhodí natívnu šípku, takže pole vyzeralo ako
            needitovateľný input. Šípku kreslíme sami a necháme jej miesto
            v pravom paddingu, aby dlhé názvy typov nepodliezali pod ňu. */}
        <div className="relative mt-2">
          <select
            id="typ-prvku"
            name="typ_prvku"
            defaultValue={predvolenyTyp || TYPY_PRVKOV[0]}
            className={`${POLE} appearance-none pr-11`}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            {TYPY_PRVKOV.map((typ) => (
              <option key={typ} value={typ}>
                {typ}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent)]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="miesto" className={LABEL}>
          Miesto realizácie
        </label>
        <input
          id="miesto"
          name="miesto"
          type="text"
          autoComplete="off"
          placeholder="Mesto, ulica alebo úsek"
          className={`${POLE} mt-2`}
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>

      <div>
        <label htmlFor="rozsah" className={LABEL}>
          Rozsah a popis
        </label>
        <textarea
          id="rozsah"
          name="rozsah"
          rows={4}
          placeholder="Čo treba zrealizovať, približný rozsah, termín"
          className={`${POLE} mt-2 resize-y`}
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>

      <div>
        <label htmlFor="kontakt-udaj" className={LABEL}>
          E-mail alebo telefón
        </label>
        <input
          id="kontakt-udaj"
          name="kontakt"
          type="text"
          required
          autoComplete="email"
          placeholder="Aby sme sa vám vedeli ozvať"
          className={`${POLE} mt-2`}
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>

      {chyba && (
        <p className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-accent)]" aria-live="polite">
          {chyba}
        </p>
      )}

      <button
        type="submit"
        disabled={posiela}
        className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[var(--color-accent)] px-7 font-[family-name:var(--font-body)] text-[1.1875rem] font-semibold text-[var(--color-on-accent)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-accent-deep,#C5250D)] disabled:opacity-60"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        {posiela ? 'Posiela sa…' : 'Poslať zadanie'}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
