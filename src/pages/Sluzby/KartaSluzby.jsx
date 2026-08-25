import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Fotka } from '../../components/kit/index.js'
import { altFotky } from './fotky.js'

/**
 * Karta jednej služby v štyroch polohách. Deväť rovnakých orámovaných kariet
 * v troch identických riadkoch bolo pôvodné riešenie a kontrola ho vrátila
 * (STANDARDY B6): sekcia nemala hierarchiu a ani jedna služba nemala väčšiu
 * váhu než ostatné. Preto:
 *
 * - `nosna` — karta cez dva stĺpce s fotkou 16:9 a druhým odstavcom textu;
 *   dostáva ju prvá služba prvého celku, ktorá je nosnou službou firmy.
 * - `strucna` — úzka karta vedľa nosnej: fotka, názov, odkaz. Perex sa na
 *   `lg` skrýva, inak by dvojica v treťom stĺpci prerástla nosnú kartu o
 *   tretinu; na užších obrazovkách karty nikoho netlačia a perex ostáva.
 * - `holy` — bez rámu: fotka, vlasová linka, text. Druhý a tretí celok a
 *   „Súvisiace služby“ na detailoch, aby orámované boxy neboli na stránke
 *   trikrát po sebe.
 * - `ram` — pôvodná orámovaná karta.
 *
 * Celá karta je jeden `<Link>`: odkaz „Detail služby“ je preto `<span>`, nie
 * druhý odkaz — vnorený odkaz je neplatné HTML a čítačka by ho ohlásila
 * dvakrát. Hover prekreslí vlasovú linku do akcentu a posunie šípku o 2 px;
 * nič sa nezväčšuje a nikde nie je tieň (STANDARDY B2).
 */
export default function KartaSluzby({ sluzba, variant = 'ram' }) {
  const d = sluzba.dlazdica
  const nosna = variant === 'nosna'
  const strucna = variant === 'strucna'
  const holy = variant === 'holy'

  const obal = holy
    ? 'group flex h-full flex-col'
    : `group flex h-full flex-col border border-[var(--color-border)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)] focus-visible:border-[var(--color-accent)] ${
        nosna ? 'p-5 sm:p-7' : 'p-5'
      }`

  return (
    <Link
      to={`/sluzby/${sluzba.slug}`}
      className={obal}
      style={holy ? undefined : { borderRadius: 'var(--radius-md)' }}
    >
      <Fotka src={d.src} w={d.w} h={d.h} alt={altFotky(d)} pomer={nosna ? '16/9' : '3/2'} />

      {/* Bez rámu drží text pohromade vlasová linka nad ním; v akcente sa
          prekresľuje pri hoveri rovnako, ako inde rám karty. */}
      <div
        className={`${holy ? 'mt-6 border-t border-[var(--color-border)] pt-5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]' : ''} flex flex-1 flex-col`}
      >
        <h3
          className={`font-[family-name:var(--font-display)] ${
            nosna ? 'text-[length:var(--text-2xl)]' : 'text-[length:var(--text-xl)]'
          } font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)] ${holy ? '' : 'mt-6'}`}
        >
          {sluzba.nazov}
        </h3>

        {/* Úzka karta perex na `lg` nemá: dvojica v treťom stĺpci by s ním
            prerástla nosnú kartu o tretinu. Nižšie, kde karty stoja pod sebou
            alebo v dvojici, výška nikoho neobmedzuje a perex tam ostáva. */}
        <p
          className={`mt-3 max-w-[52ch] font-[family-name:var(--font-body)] ${
            nosna ? 'text-[length:var(--text-lg)]' : 'text-[length:var(--text-base)]'
          } leading-[var(--leading-normal)] text-[var(--color-muted)] ${strucna ? 'lg:hidden' : ''}`}
        >
          {sluzba.perex}
        </p>

        {/* Nosná karta má miesto navyše, tak dostane aj prvý odstavec textu
            služby. Žiadna nová veta nevzniká, je to text z dát. */}
        {nosna && sluzba.odseky?.length ? (
          <p className="mt-4 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
            {sluzba.odseky[0]}
          </p>
        ) : null}

        <span className="mt-auto flex min-h-[44px] items-center gap-2 pt-6 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-text)]">
          Detail služby
          <ArrowRight
            className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[2px]"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}
