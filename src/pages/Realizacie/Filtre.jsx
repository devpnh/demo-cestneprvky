import { MonoStitok } from '../../components/kit/index.js'

/**
 * Vlasový čip filtra.
 *
 * Aktívny stav je akcentový RÁM a akcentový šev, nie akcentová plocha:
 * biely text na `--color-accent` má 4,05:1 a rovnako aj akcentový text na
 * bielej, čo pri 14 px nesplní 4,5:1 (STANDARDY B7). Text preto ostáva
 * atramentový (13,6:1) a akcent nesie rám so švom — rovnaká reč ako aktívny
 * riadok v katalógu služieb.
 */
function Cip({ aktivny, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktivny}
      className={`inline-flex min-h-[44px] items-center gap-2.5 border px-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] transition-colors duration-[var(--duration-fast)] ${
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

function Skupina({ stitok, hodnoty, vybrane, onVyber, nazovSkupiny }) {
  return (
    <div role="group" aria-label={nazovSkupiny}>
      <MonoStitok>{stitok}</MonoStitok>
      <div className="mt-4 flex flex-wrap gap-2">
        <Cip aktivny={vybrane === ''} onClick={() => onVyber('')}>
          Všetko
        </Cip>
        {hodnoty.map((h) => (
          <Cip key={h} aktivny={vybrane === h} onClick={() => onVyber(h)}>
            {h}
          </Cip>
        ))}
      </div>
    </div>
  )
}

/**
 * Dva nezávislé filtre nad galériou. Stav drží URL (`?prvok=…&miesto=…`),
 * takže konkrétny výber sa dá poslať odkazom a prežije obnovenie stránky.
 */
export default function Filtre({ typy, miesta, prvok, miesto, onPrvok, onMiesto }) {
  return (
    <div className="grid grid-cols-1 gap-10">
      <Skupina
        stitok="Typ prvku"
        nazovSkupiny="Filter podľa typu prvku"
        hodnoty={typy}
        vybrane={prvok}
        onVyber={onPrvok}
      />
      <Skupina
        stitok="Miesto"
        nazovSkupiny="Filter podľa miesta"
        hodnoty={miesta}
        vybrane={miesto}
        onVyber={onMiesto}
      />
    </div>
  )
}
