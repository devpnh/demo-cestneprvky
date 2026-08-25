/**
 * Firemné fakty a texty o firme.
 *
 * Zdroj: `poznamky/OBSAH-ORIGINAL.md` (sekcia O NÁS a KONTAKT), `pipeline/facts.json`.
 * Dve frázy z pôvodného webu sa neprenášajú: superlatív o európskych partneroch
 * bez ich mien (nahradený menami materiálov ColdPlastic a DEBUZ®, mená firiem si
 * vyžiadame v handoveri) a prázdna fráza o technológiách (nahradená konkrétnymi
 * postupmi: stierkovanie, lepenie obrubníkov, osádzanie retardérov).
 */
export const FIRMA = {
  nazov: 'Cestné prvky s.r.o.',
  sidlo: 'Žilina',
  rokZalozenia: 2012,
  claim: 'Šetríme váš čas aj peniaze',

  uvod: [
    'Firma Cestné prvky s.r.o. bola založená v roku 2012. Sídlime v Žiline a realizujeme prvky pozemných komunikácií po celom Slovensku.',
    'Pracujeme pre mestá, župy, správcov ciest, stavebné firmy a developerov. Osádzame značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie, lepené obrubníky a spomaľovače dopravy.',
    'V dopravných stavbách používame technológie, ktoré nevyžadujú zásah do pôvodných konštrukcií: stierkovanie studeným plastom, lepenie nízkych obrubníkov akrylovým tmelom a osádzanie retardérov DEBUZ® na dvojzložkové lepidlo. Materiály a technológie odoberáme od európskych výrobcov.',
  ],

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

  partner: {
    nazov: 'Únia nevidiacich a slabozrakých Slovenska',
    popis:
      'Poskytuje konzultácie k riešeniam architektonickej prístupnosti pre ľudí so zrakovým postihnutím v exteriéri aj interiéri, vydáva stanoviská k projektovej dokumentácii a konzultuje aplikáciu debarierizačných prvkov priamo na mieste realizácie.',
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
    'Konzultácie: Únia nevidiacich a slabozrakých Slovenska',
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
}

/**
 * Priebeh spolupráce. Popisy sú vecné, bez sľubov o termínoch a cenách,
 * ktoré v podkladoch nemáme.
 */
export const PROCES = [
  {
    id: 'dopyt',
    nazov: 'Dopyt a obhliadka',
    popis:
      'Napíšete nám typ prvku, miesto a rozsah. Dohodneme si obhliadku a pozrieme sa na povrch, spád a organizáciu dopravy priamo na mieste.',
  },
  {
    id: 'navrh',
    nazov: 'Návrh a ponuka',
    popis:
      'Navrhneme riešenie, schému a materiál podľa vyhlášok a vášho zadania. K nemu dostanete cenovú ponuku na konkrétny rozsah prác.',
  },
  {
    id: 'realizacia',
    nazov: 'Realizácia',
    popis:
      'Prvky osadíme technológiou, ktorá nevyžaduje búracie práce ani ťažké mechanizmy. Obmedzenia dopravy držíme na nevyhnutnom čase.',
  },
  {
    id: 'odovzdanie',
    nazov: 'Odovzdanie',
    popis:
      'Úsek prejdeme spolu s vami, skontrolujeme osadenie prvkov a odovzdáme dielo do užívania.',
  },
]

/** Kontaktné údaje sú v `src/content/global.json` (NAP), tu ich neduplikujeme. */
