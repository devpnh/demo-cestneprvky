/**
 * Mapa routov nového viacstránkového webu.
 *
 * Hlavná navigácia má maximálne 5 položiek (`vNavigacii: true`); Domov je
 * dostupný cez logo, CTA „Dohodnúť obhliadku a cenu“ otvára `ObhliadkaDialog`.
 * `title` je do 70 znakov, `description` do 160 znakov (STANDARDY F4).
 * Stránky služieb dedia SEO z `SLUZBY[].seo`, aby texty žili na jednom mieste.
 */

import { sadzbaHlboko } from '../lib/sadzba.js'
import { SLUZBY } from './sluzby.js'

/** Statické routy. Stránky služieb sa dopĺňajú nižšie zo `SLUZBY`. */
export const ROUTY = sadzbaHlboko([
  {
    path: '/',
    id: 'domov',
    label: 'Domov',
    vNavigacii: false,
    title: 'Cestné prvky s.r.o. | bezbariérové prvky a dopravné značenie',
    description:
      'Značenie pre nevidiacich, vodorovné dopravné značenie studeným plastom, lepené obrubníky a spomaľovače dopravy. Žilina, realizácie po celom Slovensku.',
  },
  {
    path: '/sluzby',
    id: 'sluzby',
    label: 'Služby',
    vNavigacii: true,
    title: 'Služby | Cestné prvky s.r.o., Žilina',
    description:
      'Deväť služieb v troch celkoch: debarierizácia a značenie, prvky vo vozovke, údržba a povrchy. Pozrite si rozsah prác a vyžiadajte obhliadku.',
  },
  {
    path: '/realizacie',
    id: 'realizacie',
    label: 'Realizácie',
    vNavigacii: true,
    title: 'Realizácie | Cestné prvky s.r.o.',
    description:
      'Fotografie osadených prvkov: vodiace línie, varovné a signálne pásy, nerezové indikátory, obrubníky a retardéry. Filtrujte podľa prvku a miesta.',
  },
  {
    path: '/o-firme',
    id: 'o-firme',
    label: 'O firme',
    vNavigacii: true,
    title: 'O firme | Cestné prvky s.r.o., od roku 2012',
    description:
      'Cestné prvky s.r.o. zo Žiliny osádza prvky pozemných komunikácií od roku 2012. Prístup, technológie ColdPlastic a DEBUZ® a súlad s vyhláškami.',
  },
  {
    path: '/kontakt',
    id: 'kontakt',
    label: 'Kontakt',
    vNavigacii: true,
    title: 'Kontakt | Cestné prvky s.r.o., Borová 3295/36, Žilina',
    description:
      'Napíšte nám typ prvku, miesto a rozsah. Telefón +421 911 87 87 89, info@cestneprvky.sk, Borová 3295/36, 010 01 Žilina.',
  },
])

/** Stránky služieb: `/sluzby/<slug>`, poradie z navigácie pôvodného webu. */
export const ROUTY_SLUZIEB = SLUZBY.map((s) => ({
  path: `/sluzby/${s.slug}`,
  id: `sluzba-${s.slug}`,
  label: s.nazovKratky || s.nazov,
  vNavigacii: false,
  rodic: '/sluzby',
  slug: s.slug,
  title: s.seo.title,
  description: s.seo.description,
}))

/** Route pre neexistujúce cesty. */
export const ROUTA_404 = {
  path: '*',
  id: 'nenajdene',
  label: 'Stránka sa nenašla',
  vNavigacii: false,
  title: 'Stránka sa nenašla | Cestné prvky s.r.o.',
  description:
    'Túto stránku sme nenašli. Pokračujte na prehľad služieb, galériu realizácií alebo na kontakt.',
}

/** Všetky routy vrátane stránok služieb a 404. */
export const VSETKY_ROUTY = [...ROUTY, ...ROUTY_SLUZIEB, ROUTA_404]

/** Položky hlavnej navigácie, maximálne päť. */
export const NAVIGACIA = ROUTY.filter((r) => r.vNavigacii)

/** Konkrétne URL cesty pre obchádzku auditom (slugy rozvinuté, bez `*`). */
export const VSETKY_CESTY = [...ROUTY, ...ROUTY_SLUZIEB].map((r) => r.path)

/** Cesta, ktorá nemá route: audit ňou overí 404. */
export const CESTA_404_TEST = '/neexistujuca-stranka'

/** Route podľa cesty (pre `Seo` komponent a drobčeka). */
export const routaPodlaCesty = (path) => VSETKY_ROUTY.find((r) => r.path === path)
