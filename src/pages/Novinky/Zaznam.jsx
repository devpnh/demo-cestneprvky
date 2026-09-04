import { MonoStitok } from '../../components/kit/index.js'

/**
 * Jeden záznam vo výpise noviniek.
 *
 * Riadok je vodorovný, nie kartička: novinky sú text, nie dlaždice, a jediná
 * položka v mriežke kariet by vyzerala ako chyba načítania. Rok stojí vľavo
 * ako marginália, titulok drží celý zvyšok šírky.
 *
 * **Keď `url` chýba, nerobí sa z titulku mŕtvy odkaz.** Vtedy je to citácia
 * titulku, nie preklik — a návštevníkovi sa o chýbajúcej adrese nič nepíše
 * (pýtame si ju v `poznamky/HANDOVER.md`, bod 18). Odkaz na súvisiacu službu
 * pod titulkom je náš vlastný, takže tam preklik je vždy — riadok tak nikdy
 * nekončí naslepo.
 */
export default function Zaznam({ clanok, odkaz = null }) {
  const titulok = (
    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-[var(--duration-hover)] ease-[var(--ease-house)] group-hover:bg-[length:100%_1px]">
      {clanok.titulok}
    </span>
  )

  return (
    <li className="border-t border-[var(--color-text)] pt-6 first:border-t-2">
      <div className="grid grid-cols-1 gap-x-16 gap-y-4 lg:grid-cols-12">
        <MonoStitok className="lg:col-span-2 lg:pt-[0.55rem]">{String(clanok.rok)}</MonoStitok>

        <div className="lg:col-span-10">
          <h3 className="max-w-[26ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium sm:text-[length:var(--text-3xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            {clanok.url ? (
              <a href={clanok.url} target="_blank" rel="noopener noreferrer" className="group">
                {titulok}
              </a>
            ) : (
              clanok.titulok
            )}
          </h3>

          {odkaz}
        </div>
      </div>
    </li>
  )
}
