import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Fotka, RiadokSluzby } from '../../components/kit/index.js'
import { useSirsieAko } from '../../lib/useSirsieAko.js'
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
 * - `riadok` — široký riadok cez celú šírku kontajnera: fotka vľavo na
 *   štyroch stĺpcoch, text vpravo na ôsmich. Dostáva ho tretí celok, aby
 *   `/sluzby` nekončili druhým riadkom troch rovnakých dlaždíc pod prvým
 *   (to je presne tvar, po ktorom stránka pôsobí ako vygenerovaná).
 * - `ram` — pôvodná orámovaná karta.
 *
 * **Pod 640 px žiadna z týchto polôh neplatí a karta je `RiadokSluzby`** —
 * miniatúra, meno, jedna veta, šípka. Karta má na telefóne fotku vysokú
 * 233 px a s textom vyjde na ~600 px; deväť takých je 5 700 px scrollu, teda
 * presne ten „scroll obrovských fotiek po jednej“, ktorý Peter vytkol
 * (4. 9. 2026). Útvar je ten istý ako v zozname služieb na Domove, aby sa
 * čitateľ učil jeden tvar, nie tri.
 *
 * Prepína sa to hookom, nie triedou `sm:hidden`: dva markupy nad sebou by
 * telefón obidva stiahol aj s fotkami.
 *
 * Celá karta je jeden `<Link>`: odkaz „Detail služby“ je preto `<span>`, nie
 * druhý odkaz — vnorený odkaz je neplatné HTML a čítačka by ho ohlásila
 * dvakrát. Hover prekreslí vlasovú linku do akcentu a posunie šípku o 2 px;
 * nič sa nezväčšuje a nikde nie je tieň (STANDARDY B2).
 */
export default function KartaSluzby({ sluzba, variant = 'ram' }) {
  const siroke = useSirsieAko(640)
  const d = sluzba.dlazdica
  const nosna = variant === 'nosna'
  const strucna = variant === 'strucna'
  const holy = variant === 'holy'
  const riadok = variant === 'riadok'

  if (!siroke) return <RiadokSluzby sluzba={sluzba} alt={altFotky(d)} perex />

  if (riadok) {
    return (
      <Link
        to={`/sluzby/${sluzba.slug}`}
        className="group grid grid-cols-1 items-center gap-6 border-t border-[var(--color-border)] py-8 transition-colors duration-[var(--duration-hover)] hover:border-[var(--color-accent)] sm:grid-cols-12 sm:gap-10"
      >
        <Fotka
          src={d.src}
          w={d.w}
          h={d.h}
          alt={altFotky(d)}
          pomer="3/2"
          sizes="(min-width: 640px) 33vw, 100vw"
          className="overflow-hidden sm:col-span-4"
          triedaObrazka="motion-safe:transition-transform motion-safe:duration-[var(--duration-slow)] motion-safe:group-hover:scale-[1.03]"
        />
        <div className="sm:col-span-8">
          <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[1.15] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            {sluzba.nazov}
          </h3>
          <p className="mt-3 max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
            {sluzba.perex}
          </p>
          <span className="mt-5 flex min-h-[44px] items-center gap-2 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-text)]">
            Detail služby
            <ArrowRight
              className="h-4 w-4 text-[var(--color-accent)] transition-transform duration-[var(--duration-hover)] group-hover:translate-x-[3px]"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    )
  }

  const obal = holy
    ? 'group flex h-full flex-col'
    : `group flex h-full flex-col border border-[var(--color-border)] transition-colors duration-[var(--duration-hover)] hover:border-[var(--color-accent)] focus-visible:border-[var(--color-accent)] ${
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
        className={`${holy ? 'mt-6 border-t border-[var(--color-border)] pt-5 transition-colors duration-[var(--duration-hover)] group-hover:border-[var(--color-accent)]' : ''} flex flex-1 flex-col`}
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
            className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-[var(--duration-hover)] group-hover:translate-x-[2px]"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}
