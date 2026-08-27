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
        perex={perex ?? meta?.description}
        fakty={fakty}
        akcie={akcie}
      />

      {children}

      {vyzva ? (
        <PasVyzvy stitok={vyzva.stitok} nadpis={vyzva.nadpis} perex={vyzva.perex} akcia={vyzva.akcia} />
      ) : null}
    </>
  )
}
