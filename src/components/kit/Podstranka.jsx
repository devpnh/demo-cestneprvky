import Seo from '../Seo.jsx'
import StranHlavicka from './StranHlavicka.jsx'
import PasVyzvy from './PasVyzvy.jsx'

/**
 * Šablóna podstránky. Jedna pre celý web.
 *
 * Podstránka je vždy tá istá kostra: SEO, tmavá hlavička so značkovacím
 * motívom, obsahové pásma a záverečný pás výzvy. Stránka dodáva obsah, nie skladbu — tým sa drží rytmus a nemôže sa
 * stať, že si dve stránky poskladajú rovnaké bloky v inom poradí alebo že
 * niektorej vypadne výzva na konci.
 *
 * Rytmus pásiem vnútri `children` si stráži stránka (STANDARDY B5: nikdy dve
 * tmavé za sebou). Keďže `PasVyzvy` je tmavý, POSLEDNÉ pásmo v `children`
 * musí byť svetlé — to je jediné pravidlo, ktoré šablóna kladie navonok.
 *
 * `pozadie` je nepovinné pozadie hlavičky; bez neho tam beží značkovací
 * motív. Stránka ho posiela vtedy, keď má vlastný záber, ktorý o nej hovorí
 * viac než abstraktné pruhy — vrstva si potom nesie aj svoj scrim.
 *
 * `perex` a `fakty` sú nepovinné a hlavička bez nich stojí. Perex NEDEDÍ
 * `meta.description`: popis pre vyhľadávače je písaný pre výsledok hľadania
 * („Pozrite si rozsah prác…“, „Filtrujte podľa prvku a miesta.“) a nad
 * titulom podstránky znel ako marginália (výtka Petra, 28. 8. 2026). Kto
 * chce perex, napíše ho stránke priamo.
 */
export default function Podstranka({
  meta = null,
  title = null,
  description = null,
  jsonLd = null,
  stitok,
  drobky = null,
  nadpis,
  perex,
  fakty = null,
  akcie = null,
  pozadie = null,
  vyzva = null,
  children,
}) {
  return (
    <>
      <Seo title={title ?? meta?.title} description={description ?? meta?.description} jsonLd={jsonLd} />
      <StranHlavicka
        stitok={stitok}
        drobky={drobky}
        nadpis={nadpis}
        perex={perex}
        fakty={fakty}
        akcie={akcie}
        pozadie={pozadie}
      />

      {children}

      {vyzva ? (
        <PasVyzvy stitok={vyzva.stitok} nadpis={vyzva.nadpis} perex={vyzva.perex} akcia={vyzva.akcia} />
      ) : null}
    </>
  )
}
