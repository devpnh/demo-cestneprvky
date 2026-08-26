/**
 * Firemné fakty a texty o firme.
 *
 * Zdroj: `poznamky/OBSAH-ORIGINAL.md` (sekcia O NÁS a KONTAKT), `pipeline/facts.json`.
 * Dve frázy z pôvodného webu sa neprenášajú: superlatív o európskych partneroch
 * bez ich mien (nahradený menami materiálov ColdPlastic a DEBUZ®, mená firiem si
 * vyžiadame v handoveri) a prázdna fráza o technológiách (nahradená konkrétnymi
 * postupmi: stierkovanie, lepenie obrubníkov, osádzanie retardérov).
 */

import { sadzbaHlboko } from '../lib/sadzba.js'
export const FIRMA = sadzbaHlboko({
  nazov: 'Cestné prvky s.r.o.',
  sidlo: 'Žilina',
  rokZalozenia: 2012,
  claim: 'Šetríme váš čas aj peniaze',

  uvod: [
    'Firma Cestné prvky s.r.o. bola založená v roku 2012. Sídlime v Žiline a realizujeme prvky pozemných komunikácií po celom Slovensku.',
    'Osádzame značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie, lepené obrubníky a spomaľovače dopravy. Pracujeme na cestách, chodníkoch, priechodoch, parkoviskách aj vo vnútorných priestoroch.',
  ],

  /**
   * Tá istá veta ako predtým v `uvod[2]`, len rozobraná na časti.
   * Dôvod je čisto sadzobný: je to výpočet troch technológií a ako súvislý
   * odsek sa vysádzal do štvorriadkovej sivej steny s rozstrapkaným pravým
   * okrajom. Výpočet patrí do zoznamu, nie do vety s dvojbodkou.
   */
  technologie: {
    uvod: 'V dopravných stavbách používame technológie, ktoré nevyžadujú zásah do pôvodných konštrukcií.',
    polozky: [
      'Stierkovanie studeným plastom',
      'Lepenie nízkych obrubníkov akrylovým tmelom',
      'Osádzanie retardérov DEBUZ® na dvojzložkové lepidlo',
    ],
    zaver: 'Materiály a technológie odoberáme od európskych výrobcov.',
  },

  pristup: [
    {
      nazov: 'Bez búracích prác a ťažkých mechanizmov',
      popis:
        'Obrubníky lepíme, značenie stierkujeme, retardéry osádzame na lepidlo. Do pôvodných konštrukcií nezasahujeme a povrch vozovky ostáva nepoškodený.',
    },
    {
      nazov: 'Krátke obmedzenie dopravy',
      popis:
        'Lepené obrubníky nadobudnú 100 % pevnosti po 30 minútach, takže sa dá hneď pokračovať v ďalších prácach. Obmedzenia na funkčných komunikáciách trvajú kratšie a klesajú aj náklady s nimi spojené.',
    },
    {
      nazov: 'Súlad s vyhláškami',
      popis:
        'Debarierizačné prvky navrhujeme podľa metodiky pre osoby s obmedzenou schopnosťou pohybu a orientácie v zmysle vyhlášky MŽP SR č. 532/2002 Z. z. a vyhlášky MV SR č. 9/2009 Z. z.',
    },
    {
      nazov: 'Materiály európskych výrobcov',
      popis:
        'Studený plast ColdPlastic bez rozpúšťadiel, retardéry DEBUZ® Kölner Teller z liateho hliníka a DEBUZ® dvojzložkové lepidlo.',
    },
  ],

  normy: ['vyhláška MŽP SR č. 532/2002 Z. z.', 'vyhláška MV SR č. 9/2009 Z. z.'],

  /**
   * POZOR, toto NIE JE vyhlásenie o spolupráci. Pôvodný web na Úniu len
   * odkazuje ako na miesto, kde sa dajú získať konzultácie a stanoviská.
   * Tvrdiť partnerstvo s existujúcou organizáciou bez jej vedomia sa nesmie,
   * preto veta hovorí o tom, čo robí Únia, nie o tom, čo robíme s ňou.
   * `stitok` používajú stránky ako nadpis bloku, aby nikde nestálo „Partner“.
   */
  konzultacie: {
    stitok: 'Kam po konzultáciu',
    nazov: 'Únia nevidiacich a slabozrakých Slovenska',
    popis:
      'Konzultácie k architektonickej prístupnosti pre ľudí so zrakovým postihnutím v exteriéri aj interiéri poskytuje Únia nevidiacich a slabozrakých Slovenska. Vydáva stanoviská k projektovej dokumentácii a konzultuje aplikáciu debarierizačných prvkov priamo na mieste realizácie.',
    odkazText: 'architektonickebariery.sk',
    url: 'https://architektonickebariery.sk/',
  },

  znacky: [
    {
      nazov: 'ColdPlastic',
      popis:
        'Studený plast bez rozpúšťadiel na trvalé vodorovné dopravné značenie. Znáša poveternostné vplyvy aj mechanické zaťaženie a použije sa na všetkých pochôdznych povrchoch.',
    },
    {
      nazov: 'Kaltplastik',
      popis:
        'Studený plast na štruktúrované vodorovné značenie a piktogramy metódou stierkovania, bez zásahu do pôvodných konštrukcií.',
    },
    {
      nazov: 'DEBUZ® – Kölner Teller',
      popis:
        'Retardéry z liateho hliníka vo výške 35 a 50 mm na upokojovanie dopravy. V praxi sa uplatňujú 25 rokov, sú recyklovateľné a dajú sa odstrániť aj použiť znova.',
    },
    {
      nazov: 'DEBUZ® dvojzložkové lepidlo',
      popis:
        'Zabezpečuje priľnavosť retardérov na všetkých typoch asfaltových a betónových vozoviek bez poškodenia povrchu.',
    },
    {
      nazov: 'Chipfill a Coldfill',
      popis:
        'Značky hmôt na opravu výtlkov. [DOPLNÍ KLIENT: technický popis a parametre hmôt Chipfill a Coldfill.]',
    },
  ],

  /** Faktový pás na Domove. Žiadne vymyslené čísla, len overiteľné údaje. */
  fakty: [
    'Od roku 2012',
    'Žilina, realizácie po celom Slovensku',
    'vyhláška MŽP SR č. 532/2002 Z. z.',
    'vyhláška MV SR č. 9/2009 Z. z.',
    'ColdPlastic a DEBUZ® Kölner Teller',
  ],

  /**
   * Jediná položka Aktualít z pôvodného webu. Máme len titulok a rok.
   * Presnú URL článku podklady neobsahujú (`pipeline/facts.json` ani
   * `structure.json` ju nemajú, na pôvodnom webe existuje len výpis
   * https://www.cestneprvky.sk/novinky/), preto `url: null`. Telo nevymýšľame.
   */
  aktuality: [
    {
      titulok: 'Žilinská župa buduje bezpečnostné ostrovčeky, odborníci to vítajú',
      rok: 2021,
      url: null,
      poznamka: '[DOPLNÍ KLIENT: odkaz na pôvodný článok a názov média, ktoré ho vydalo.]',
    },
  ],
})

/**
 * Zápis v registroch. Verejné údaje z Obchodného registra SR (Okresný súd
 * Žilina) a z Registra právnických osôb Štatistického úradu SR, overené
 * 26. 8. 2026. Nahrádzajú zástupné texty, ktoré tu boli predtým.
 *
 * Dátum narodenia konateľa register zverejňuje, na web ale nepatrí — je to
 * osobný údaj, ktorý na obchodnú prezentáciu nie je potrebný.
 *
 * `obchodneMeno` je presné znenie z registra (s čiarkou pred `s.r.o.`).
 * Značka na webe píše „Cestné prvky s.r.o.“ bez čiarky; register sa preto
 * používa iba tam, kde ide o fakturačný údaj.
 *
 * DIČ ani IČ DPH tu nie sú: Obchodný register ani RPO ich nezverejňujú
 * a Finstat je za Cloudflare. Zostávajú na klientovi.
 */
export const REGISTER = {
  obchodneMeno: 'Cestné prvky, s.r.o.',
  ico: '46 875 891',
  pravnaForma: 'Spoločnosť s ručením obmedzeným',
  zapis: 'Okresný súd Žilina, oddiel Sro, vložka č. 57757/L',
  denZapisu: '10. 11. 2012',
  konatel: 'Ján Lešňovský',
  konanie: 'V mene spoločnosti koná konateľ samostatne.',
  zakladneImanie: '5 000 EUR',
}

// Dočasný alias, kým stránky prejdú z `partner` na `konzultacie`.
// Odstrániť pri záverečnej integrácii kola 3.
FIRMA.partner = FIRMA.konzultacie

/**
 * Priebeh spolupráce tak, ako ho navrhujeme my — v podkladoch klienta popis
 * spolupráce nie je. Preto tu nesmie stáť nič, čo by klientovi vkladalo do úst
 * záväzok, ktorý nedal: žiadne lehoty, žiadne ceny, žiadna spoločná preberačka.
 * Vety o technológii sú zúžené na tie prvky, pri ktorých ich pôvodný web
 * naozaj tvrdí (lepené obrubníky, stierkovanie, retardéry na lepidlo).
 * Celý blok je v `poznamky/HANDOVER.md` na potvrdenie klientom.
 *
 * Popisy sú zámerne krátke a približne rovnako dlhé: sekcia ich sádže do
 * štyroch stĺpcov po ~33 znakoch na riadok a dlhé vety tam vyzerali ako
 * štyri rôzne vysoké kôpky textu. Vety o kratšom obmedzení premávky a o
 * pokračovaní prác nesie sekcia Prečo (`FIRMA.pristup`).
 */
export const PROCES = sadzbaHlboko([
  {
    id: 'dopyt',
    nazov: 'Dopyt a obhliadka',
    popis:
      'Napíšete nám typ prvku, miesto a rozsah prác. Ozveme sa a dohodneme obhliadku.',
  },
  {
    id: 'navrh',
    nazov: 'Návrh a ponuka',
    popis:
      'Schému, vzor aj rozloženie prvkov prispôsobíme vašej požiadavke a platným vyhláškam. K návrhu dostanete cenovú ponuku.',
  },
  {
    id: 'realizacia',
    nazov: 'Realizácia',
    popis:
      'Prvky osadíme na mieste. Pri lepených obrubníkoch a stierkovanom značení odpadajú búracie práce aj ťažké mechanizmy.',
  },
  {
    id: 'odovzdanie',
    nazov: 'Odovzdanie',
    popis:
      'Úsek odovzdáme do užívania. Lepené obrubníky majú po 30 minútach 100 % pevnosti.',
  },
])

/** Kontaktné údaje sú v `src/content/global.json` (NAP), tu ich neduplikujeme. */
