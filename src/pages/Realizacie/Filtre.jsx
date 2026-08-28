import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const MONO = 'font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em]'

/**
 * Vlasový čip miesta.
 *
 * Aktívny stav je akcentový RÁM a akcentový šev, nie akcentová plocha: biely
 * text na `--color-accent` má 4,05:1 a rovnako aj akcentový text na bielej, čo
 * pri 14 px nesplní 4,5:1 (STANDARDY B7). Text preto ostáva atramentový
 * (13,6:1) a akcent nesie rám so švom.
 */
function Cip({ aktivny, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktivny}
      className={`inline-flex min-h-[44px] items-center gap-2.5 border px-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] transition-colors duration-[var(--duration-hover)] ${
        aktivny
          ? 'border-[var(--color-accent)] bg-[var(--color-surface)] font-medium text-[var(--color-text)]'
          : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]'
      }`}
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <span
        aria-hidden="true"
        className={`h-[14px] w-[2px] shrink-0 ${aktivny ? 'bg-[var(--color-accent)]' : 'bg-transparent'}`}
      />
      {children}
    </button>
  )
}

/**
 * Natívny `select` v mono. Text má 16 px zámerne: menší by na iOS pri fokuse
 * spustil zoom (STANDARDY D3). Aktívny výber nesie akcentový rám, rovnakou
 * rečou ako aktívny čip.
 */
function Vyber({ id, stitok, hodnota, onZmena, prazdnyPopis, moznosti }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {/* Pod 640 px má štítok vlastný riadok: `select` je tam na plnú šírku,
          takže by sa vedľa neho aj tak nezmestil a jeden filter by mal štítok
          hore a druhý vľavo. `w-full` to zjednotí. */}
      <label htmlFor={id} className={`${MONO} w-full text-[var(--color-muted)] sm:w-auto`}>
        {stitok}
      </label>
      <div className="relative">
        <select
          id={id}
          value={hodnota}
          onChange={(e) => onZmena(e.target.value)}
          className={`min-h-[44px] w-full appearance-none border bg-[var(--color-bg)] py-2 pl-4 pr-11 font-[family-name:var(--font-mono)] text-[length:var(--text-base)] text-[var(--color-text)] transition-colors duration-[var(--duration-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:w-auto ${
            hodnota ? 'border-[var(--color-accent)] font-medium' : 'border-[var(--color-border)] hover:border-[var(--color-text)]'
          }`}
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          <option value="">{prazdnyPopis}</option>
          {moznosti.map((m) => (
            <option key={m.hodnota} value={m.hodnota}>
              {m.popis}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
        />
      </div>
    </div>
  )
}

/** Pod 640 px sa čipy miest nemontujú vôbec, nie sú len skryté (počíta ich audit). */
function useKompakt() {
  const [kompakt, setKompakt] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const on = (e) => setKompakt(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return kompakt
}

/**
 * Filtračná lišta galérie: dva riadky, nie stena volieb.
 *
 * Typ prvku je `select` s ôsmimi celkami — ako čipy by to bolo 14 tlačidiel a
 * prvé, čo by z galérie bolo vidieť, by boli voľby, nie fotky. Miest je sedem;
 * na desktope sú to čipy, lebo mená miest sú vtedy naraz čitateľné a to je celá
 * hodnota tohto filtra. Pod 640 px by tie isté čipy zabrali štyri riadky a
 * odsunuli prvú fotku o 250 px nižšie, preto sú tam tiež `select`.
 */
export default function Filtre({ skupiny, miesta, prvok, miesto, onPrvok, onMiesto, pocet, celkom, onZrusit }) {
  const kompakt = useKompakt()
  const maFilter = Boolean(prvok || miesto)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <Vyber
          id="filter-prvok"
          stitok="Typ prvku"
          hodnota={prvok}
          onZmena={onPrvok}
          prazdnyPopis={`Všetky prvky (${celkom})`}
          moznosti={skupiny.map((s) => ({ hodnota: s.nazov, popis: `${s.nazov} (${s.pocet})` }))}
        />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p aria-live="polite" data-pocet className={`${MONO} tabular-nums text-[var(--color-muted)]`}>
            {`${pocet} z ${celkom}`}
          </p>
          {maFilter ? (
            <button
              type="button"
              onClick={onZrusit}
              data-zrusit
              className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-text)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4"
            >
              Zrušiť filtre
            </button>
          ) : null}
        </div>
      </div>

      {kompakt ? (
        <div className="mt-5">
          <Vyber
            id="filter-miesto"
            stitok="Miesto"
            hodnota={miesto}
            onZmena={onMiesto}
            prazdnyPopis="Všetky miesta"
            moznosti={miesta.map((m) => ({ hodnota: m, popis: m }))}
          />
        </div>
      ) : (
        <div role="group" aria-label="Filter podľa miesta" className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className={`${MONO} text-[var(--color-muted)]`}>Miesto</span>
          <div className="flex flex-wrap gap-2">
            <Cip aktivny={miesto === ''} onClick={() => onMiesto('')}>
              Všetko
            </Cip>
            {miesta.map((m) => (
              <Cip key={m} aktivny={miesto === m} onClick={() => onMiesto(m)}>
                {m}
              </Cip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
