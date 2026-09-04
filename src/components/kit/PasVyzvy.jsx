import ZnacenieMotiv from './ZnacenieMotiv.jsx'
import { Reveal } from '../primitives/index.js'
import { sadzba } from '../../lib/sadzba.js'

/**
 * Záverečný pás výzvy. Každá podstránka ho má a každá ho má rovnaký — je to
 * posledné pásmo pred pätičkou, tmavé, so značkovacím motívom v pozadí.
 *
 * Predtým si ho každá stránka skladala sama z `Sekcia` + `SekciaHlavicka` a
 * líšili sa len texty; rovnaká skladba na piatich miestach je presne to, čo
 * zo stránok robí variácie jedného generovaného bloku. Tu je jedna
 * definícia, ktorú stránka plní obsahom.
 *
 * **Bez mikro-štítku nad nadpisom.** „Ďalší krok“, „Obhliadka“, „Zadanie“ —
 * štyri stránky mali nad tým istým nadpisom štyri rôzne slová, ktoré nič
 * nedodávali: nadpis „Dohodneme si obhliadku“ hovorí to isté celou vetou.
 * Štítok navyše tlačil nadpis o riadok nižšie od tlačidla, ktoré mu patrí
 * (pokyn Petra, 4. 9. 2026). Mikro-štítky ostávajú v obsahových pásmach, kde
 * číslujú a triedia; tu je jedna veta a jedno tlačidlo.
 *
 * ## Prečo si pás skladá dva stĺpce sám a nepoužíva `SekciaHlavicka`
 *
 * V obsahových pásmach je vpravo perex a stĺpce sedia na spodnej hrane. Tu je
 * vpravo tlačidlo, a to je iný útvar: kým tam stál perex AJ tlačidlá, bol
 * pravý stĺpec o polovicu vyšší než nadpis a pri spodnom zarovnaní klesol
 * nadpis až pod červené tlačidlo — dvojica, ktorá patrí k sebe, pôsobila
 * rozpojene (výtka Petra, 4. 9. 2026).
 *
 * Rozdelenie je preto **správa vľavo, akcia vpravo**: nadpis a perex sú
 * jeden blok v ľavom stĺpci a vpravo stojí len akcia, zvislo vycentrovaná
 * proti tomu bloku. Stredy nadpisu a červeného tlačidla si tak na 1440 px
 * sadnú na seba do 7 px na štyroch z piatich pásiem. Piate je `/sluzby`
 * (nadpis dva riadky, perex tri) — tam ostáva nadpis o 41 px vyššie než
 * tlačidlo. To je opačný smer než pôvodná chyba a číta sa ako hierarchia,
 * nie ako rozpad; dorovnať by sa to dalo len tak, že by tlačidlo vypadlo
 * z mriežky a viezlo sa na absolútnej pozícii, čo je krehkejšie než 41 px.
 *
 * Akcia nemá `ml-auto`: začína na ôsmom stĺpci mriežky, takže červené
 * tlačidlo stojí na tej istej zvislej osi na všetkých podstránkach bez
 * ohľadu na to, aké je široké.
 *
 * **Je svetlý, hoci výzva býva tmavá.** Dôvod je rytmus: pod ním stojí tmavá
 * pätička s červeným oparom (pokyn Petra, 27. 8. 2026) a dve tmavé plochy za
 * sebou sú zakázané (STANDARDY B5). Dôraz preto nesie veľkosť titulu a
 * červené tlačidlo, nie farba plochy — a tmavá pätička hneď pod ním je
 * posledný akord stránky.
 */
export default function PasVyzvy({ nadpis, perex, akcia = null }) {
  return (
    <section
      data-pasmo="biela"
      className="relative isolate overflow-hidden bg-[var(--color-bg)] py-[var(--section-padding-y)] text-[var(--color-text)]"
    >
      <ZnacenieMotiv svetle krytie={0.9} />
      <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {sadzba(nadpis)}
              </h2>
              {perex ? (
                <p className="mt-6 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                  {sadzba(perex)}
                </p>
              ) : null}
            </div>
            {akcia ? <div className="lg:col-span-5">{akcia}</div> : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
