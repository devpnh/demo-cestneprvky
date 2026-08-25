/**
 * Dátová vrstva služieb Cestné prvky s.r.o.
 *
 * Zdroj obsahu: `poznamky/OBSAH-ORIGINAL.md` (vyčistený scrape cestneprvky.sk)
 * a `pipeline/facts.json`. Služby 1 až 4 majú v origináli plný text a je tu
 * prenesený celý (odseky, zoznamy podkategórií, výhody, technická tabuľka,
 * návod na inštaláciu). Služby 5 až 9 mali v origináli len názov a dlaždicu:
 * majú preto perex odvodený z názvu a v poli `chyba` presne pomenované,
 * čo klient doplní. Nič sa nedopĺňa odhadom.
 *
 * Pravidlá copy: hlas klienta (slovesá, oslovenie čitateľa), žiadne pomlčky
 * okrem doslovných názvov produktov (DEBUZ® – Kölner Teller, Typ KT – 50,
 * Štítky – Braillovo písmo…), žiadne superlatívy bez mena a žiadne vymyslené
 * parametre, normy ani materiály.
 *
 * Rozmery fotiek sú namerané cez `sips -g pixelWidth -g pixelHeight`.
 * `isteMiesto: false` znamená, že plný názov miesta z názvu súboru nevieme
 * potvrdiť (skratky MT, TN, BB, PD, TT, `Subor_00*`, číselné názvy z Facebooku);
 * odhady sú v `poznamky/MAPA-OBSAHU.md` v zozname pre handover.
 */

import { sadzbaHlboko } from '../lib/sadzba.js'

/** Tri celky, do ktorých sa deväť služieb delí na `/sluzby`. Zdôvodnenie zaradenia je v MAPE. */
export const SKUPINY = sadzbaHlboko([
  {
    id: 'debarierizacia-a-znacenie',
    nazov: 'Debarierizácia a značenie',
    popis:
      'Prvky, ktoré vedú a informujú chodca: štruktúrované značenie pre nevidiacich a slabozrakých, vodorovné dopravné značenie a hmatové štítky.',
  },
  {
    id: 'prvky-vo-vozovke',
    nazov: 'Prvky vo vozovke',
    popis:
      'Prvky, ktoré osádzame priamo do vozovky alebo na jej okraj a menia jej usporiadanie: lepené obrubníky, spomaľovače dopravy a cyklotrasy.',
  },
  {
    id: 'udrzba-a-povrchy',
    nazov: 'Údržba a povrchy',
    popis:
      'Zásahy do povrchu vozovky a chodníka: zálievky škár a výtlkov, protišmykové nátery a odstránenie prekonaného značenia.',
  },
])

export const SLUZBY = sadzbaHlboko([
  {
    slug: 'znacenie-pre-nevidiacich',
    nazov: 'Značenie pre nevidiacich a slabozrakých',
    nazovKratky: 'Značenie pre nevidiacich',
    skupina: 'debarierizacia-a-znacenie',
    perex:
      'Štruktúrované značenie a mosadzné či nerezové indikátory, ktoré vedú a varujú osoby so zrakovým postihnutím na chodníku, priechode aj vo vnútri budovy.',
    odseky: [
      'Štruktúrované vodorovné značenie a piktogramy realizujeme metódou stierkovania studeným plastom Kaltplastik. Nanášame ich na rôzne povrchy bez nutnosti zásahu do pôvodných konštrukcií.',
      'Schému, vzor, farebný odtieň aj rozloženie prvkov prispôsobíme vašej požiadavke. Technológia spĺňa metodiku navrhovania debarierizačných opatrení pre osoby s obmedzenou schopnosťou pohybu a orientácie na pozemných komunikáciách v zmysle platnej vyhlášky MŽP SR č. 532/2002 Z. z. a vyhlášky MV SR č. 9/2009 Z. z.',
      'Druhou metódou je inštalácia odolných mosadzných a nerezových indikátorov. Nevidiacich a slabozrakých informujú a varujú pred prekážkou alebo nebezpečenstvom.',
    ],
    zoznamy: [
      {
        titulok: 'Exteriér',
        polozky: [
          'Varovný pás',
          'Signálny pás',
          'Špeciálny varovný pás',
          'Vodiaca línia',
          'Vodiaca línia v priechode pre chodcov',
          'Nerezové indikátory v exteriéri',
        ],
      },
      {
        titulok: 'Interiér',
        polozky: ['Varovný pás', 'Vodiaca línia'],
      },
    ],
    normy: ['vyhláška MŽP SR č. 532/2002 Z. z.', 'vyhláška MV SR č. 9/2009 Z. z.'],
    // Nie partnerstvo: pôvodný web na Úniu odkazuje ako na miesto, kde sa
    // dajú získať konzultácie a stanoviská. Viac v komentári vo `firma.js`.
    konzultacie: {
      stitok: 'Kam po konzultáciu',
      nazov: 'Únia nevidiacich a slabozrakých Slovenska',
      popis:
        'Poskytuje konzultácie k riešeniam architektonickej prístupnosti pre ľudí so zrakovým postihnutím v exteriéri aj interiéri, vydáva stanoviská k projektovej dokumentácii a konzultuje aplikáciu debarierizačných prvkov priamo na mieste realizácie.',
      url: 'https://architektonickebariery.sk/',
    },
    znacky: ['Kaltplastik'],
    dlazdica: {
      src: '00-ZubaC48Dka-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Vodiaca línia a varovné pásy na nástupišti, Zubačka',
      miesto: 'Zubačka',
      isteMiesto: true,
    },
    fotky: [
      {
        src: '12-ZubaC48Dka-scaled.jpg',
        w: 1400,
        h: 1050,
        alt: 'Vodiaca línia a varovné pásy na nástupišti, Zubačka',
        miesto: 'Zubačka',
        isteMiesto: true,
      },
      {
        src: '27-Tornala.jpg',
        w: 1400,
        h: 1050,
        alt: 'Červený signálny pás a vodiaca línia na dlažbe, Tornaľa',
        miesto: 'Tornaľa',
        isteMiesto: true,
      },
      {
        src: '25-BA_nivy_hbreavis-scaled.jpg',
        w: 1200,
        h: 1600,
        alt: 'Vodiaca línia a varovný pás medzi obrubníkmi, Bratislava Nivy',
        miesto: 'Bratislava Nivy',
        isteMiesto: true,
      },
      {
        src: '39-BA_nivy-1-scaled.jpg',
        w: 1200,
        h: 1600,
        alt: 'Vodiaca línia z nerezových indikátorov v interiéri, Bratislava Nivy',
        miesto: 'Bratislava Nivy',
        isteMiesto: true,
      },
    ],
    suvisiace: ['vodorovne-dopravne-znacenie', 'stitky-braillovo-pismo', 'protismykovy-nater'],
    seo: {
      title: 'Značenie pre nevidiacich a slabozrakých | Cestné prvky',
      description:
        'Varovné a signálne pásy, vodiace línie a nerezové indikátory. Stierkovanie studeným plastom Kaltplastik v zmysle vyhlášok 532/2002 a 9/2009.',
    },
  },

  {
    slug: 'vodorovne-dopravne-znacenie',
    nazov: 'Vodorovné dopravné značenie',
    nazovKratky: 'Vodorovné značenie',
    skupina: 'debarierizacia-a-znacenie',
    perex:
      'Trvalé značenie jazdných pruhov, cyklistických chodníkov, priechodov pre chodcov, priemyselných a skladovacích zón, letísk, parkovacích miest aj podzemných garáží.',
    odseky: [
      'Od moderného dopravného značenia sa žiada vysoká bezpečnosť dopravy, dlhá životnosť a ľahké spracovanie. Inštalácie realizujeme na zákazku z materiálov ColdPlastic a riešenie prispôsobíme vášmu zadaniu.',
      'Studený plast ColdPlastic neobsahuje rozpúšťadlá a je určený na dopravné značenie. Použite ho na trvalé značenie jazdných pruhov, cyklistických chodníkov, priechodov pre chodcov, priemyselných a skladovacích zón, letísk, parkovacích miest aj podzemných garáží.',
      'Materiál odoláva poveternostným vplyvom aj mechanickému poškodeniu pri vysokom zaťažení dopravnou premávkou a použijete ho na všetkých pochôdznych povrchoch.',
    ],
    zoznamy: [
      {
        titulok: 'Studený plast ColdPlastic',
        polozky: [
          'Priechod pre chodcov',
          'Vodiaca línia v priechode pre chodcov',
          'Opticko-akustická brzda',
          'Piktogramy',
        ],
      },
      {
        titulok: 'Jednozložkový náter',
        polozky: [
          'Priechody pre chodcov',
          'Čiary a parkovacie boxy',
          'Výstražné značenie ostrovčekov a obrubníkov',
          'Obnova značenia vo firemných priestoroch',
        ],
      },
    ],
    znacky: ['ColdPlastic'],
    dlazdica: {
      src: '02-PD-1-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Vodorovné dopravné značenie jazdných pruhov a parkovacích boxov',
      miesto: 'Realizácia klienta',
      isteMiesto: false,
    },
    fotky: [
      {
        src: '14-PD-1.jpg',
        w: 721,
        h: 1600,
        alt: 'Obnovené vodorovné dopravné značenie na miestnej komunikácii',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
      {
        src: '02-PD-1-600x390.jpg',
        w: 600,
        h: 390,
        alt: 'Vodorovné dopravné značenie jazdných pruhov a parkovacích boxov',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
      {
        src: '31-Vodiaca-linia-v-priechode-BA.jpg',
        w: 444,
        h: 333,
        alt: 'Vodiaca línia v priechode pre chodcov, Bratislava',
        miesto: 'Bratislava',
        isteMiesto: true,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: mená európskych výrobcov materiálov ColdPlastic, ktoré smieme uviesť namiesto všeobecnej formulácie o dodávateľoch.]',
      '[DOPLNÍ KLIENT: fotografie cyklochodníka, opticko-akustickej brzdy a parkovacích boxov realizovaných studeným plastom.]',
    ],
    suvisiace: ['znacenie-pre-nevidiacich', 'odstranenie-znacenia', 'cyklotrasy'],
    seo: {
      title: 'Vodorovné dopravné značenie studeným plastom | Cestné prvky',
      description:
        'Priechody, jazdné pruhy, cyklochodníky, parkovacie boxy a piktogramy z materiálov ColdPlastic bez rozpúšťadiel. Aj jednozložkový náter.',
    },
  },

  {
    slug: 'lepene-obrubniky',
    nazov: 'Lepené obrubníky',
    nazovKratky: 'Lepené obrubníky',
    skupina: 'prvky-vo-vozovke',
    perex:
      'Nízke obrubníky lepené k podkladu akrylovým tmelom: pri rekonštrukciách, rozširovaní chodníkov, dobudovaní ostrovčekov, kruhových križovatiek, parkovacích prahov a dorazov.',
    odseky: [
      'Nízke obrubníky lepíme k podkladu tmelom na báze akrylovej živice. Realizácia je rýchla a komunikáciu zaťaží len na krátko.',
      'Metóda sa hodí pri rekonštrukciách, pri rozširovaní alebo novom budovaní chodníkov pre peších na už existujúcich komunikáciách, pri dobudovaní cestných ostrovčekov, kruhových križovatiek, parkovacích prahov, dorazov a ďalších konštrukcií, ktoré zasahujú do vozovky a používajú sa v nich cestné obrubníky.',
      'Odpadá veľké množstvo búracích prác a nepotrebujete ťažké mechanizmy. Po nalepení na stanovené miesto nadobudnú obrubníky 100 % svojej pevnosti už po 30 minútach, takže môžete pokračovať v ďalších stavebných prácach.',
      'Tým sa minimalizujú dopravné obmedzenia na funkčných komunikáciách aj náklady, ktoré s nimi súvisia. Zálievkové hmoty nie sú potrebné, lepidlo vytvorí styk medzi obrubníkom a vozovkou.',
    ],
    zoznamy: [
      {
        titulok: 'Čo lepíme',
        polozky: [
          'Lepené ostrovčeky',
          'Lepené vodiace línie z obrubníkov',
          'Lepené parkovacie dorazy',
          'Doplnkový materiál ku ostrovčekom a obrubníkom',
        ],
      },
    ],
    dlazdica: {
      src: '01-Medeny_Hamor_1-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Lepený cestný obrubník na novom asfaltovom kryte, Medený Hámor',
      miesto: 'Medený Hámor',
      isteMiesto: true,
    },
    fotky: [
      {
        src: '13-Medeny_Hamor_1-scaled.jpg',
        w: 960,
        h: 1280,
        alt: 'Lepený cestný obrubník na novom asfaltovom kryte, Medený Hámor',
        miesto: 'Medený Hámor',
        isteMiesto: true,
      },
      {
        src: '01-Medeny_Hamor_1-600x390.jpg',
        w: 600,
        h: 390,
        alt: 'Detail spoja lepeného obrubníka s vozovkou, Medený Hámor',
        miesto: 'Medený Hámor',
        isteMiesto: true,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: fotografie lepených ostrovčekov, parkovacích dorazov a doplnkového materiálu; v podkladoch je len Medený Hámor.]',
      '[DOPLNÍ KLIENT: názov tmelu na báze akrylovej živice a jeho výrobca.]',
    ],
    suvisiace: ['spomalovace-dopravy', 'vodorovne-dopravne-znacenie', 'zalievkove-a-vyspravkove-hmoty'],
    seo: {
      title: 'Lepené cestné obrubníky | Cestné prvky s.r.o.',
      description:
        'Nízke obrubníky lepené akrylovým tmelom: 100 % pevnosti po 30 minútach, bez búracích prác a ťažkých mechanizmov. Ostrovčeky aj parkovacie dorazy.',
    },
  },

  {
    slug: 'spomalovace-dopravy',
    nazov: 'Spomaľovače dopravy (retardéry)',
    nazovKratky: 'Spomaľovače dopravy',
    skupina: 'prvky-vo-vozovke',
    perex:
      'Retardéry DEBUZ® Kölner Teller z liateho hliníka na upokojovanie dopravy. Používajú sa na nebezpečných miestach, pri školách, škôlkach a na priechodoch v areáloch.',
    odseky: [
      'DEBUZ® retardéry Kölner Teller z liateho hliníka slúžia ako prvky na upokojovanie dopravy a v praxi sa uplatňujú už 25 rokov.',
      'Výška 35 a 50 mm a usporiadanie osadeného DEBUZ® – Kölner Teller nútia vodiča zachovať určenú rýchlosť. Osádzame ich na nebezpečných miestach, pri školách, škôlkach a na priechodoch pre chodcov v areáloch, kde potrebujete dosiahnuť žiaduce spomalenie.',
    ],
    zoznamy: [
      {
        titulok: 'Kam ich osádzame',
        polozky: [
          'Nebezpečné miesta na komunikácii',
          'Okolie škôl a škôlok',
          'Priechody pre chodcov v areáloch',
          'Autobusové pruhy (typ KT – 35)',
        ],
      },
    ],
    vyhody: [
      'Nízke investičné náklady',
      'Dlhá životnosť a plná recyklovateľnosť',
      'Možnosť rôzneho umiestnenia jednotlivých prvkov',
      'Osadené taniere zvyšujú bezpečnosť cyklistov a umožňujú bezproblémový prejazd invalidných vozíkov',
      'Jednoduchá inštalácia',
      'Priľnavosť na všetkých typoch asfaltových a betónových vozoviek zabezpečuje DEBUZ® dvojzložkové lepidlo, takže povrch vozovky sa nepoškodí',
      'Jednoduché odstránenie a opakované použitie',
    ],
    tabulka: {
      titulok: 'Technický popis: DEBUZ® – Kölner Teller',
      hlavicka: ['', 'Typ KT – 50', 'Typ KT – 35 *'],
      riadky: [
        ['Odporúčaná rýchlosť', '< 30 km / h', '> 30 km / h'],
        ['Rozmery (Ø / H)', '300 / ca. 60', '300 / ca. 35'],
        ['Hmotnosť', '2,5 kg', '2,0 kg'],
        ['Lepidlo', 's inštaláciou šablóny', 'bez inštalácie šablón, 1,0 kg'],
      ],
      poznamka: '* S možnosťou použitia pre autobusové pruhy.',
    },
    navod: {
      titulok: 'Návod na inštaláciu',
      kroky: [
        'Retardéry DEBUZ Kölner Teller osádzajte v dvojrade s rozostupom 500 mm.',
        'Šablónu položte na vopred vyznačené pomocné linky.',
        'Rozmiešajte DEBUZ® dvojzložkové lepidlo, nalejte ho do otvorov a zarovnajte špachtľou. Prebytočné lepidlo môže zostať na hrane šablóny a použijete ho znova.',
        'Vybratia v lepiacej šablóne zodpovedajú spodnej časti DEBUZ® – Kölner Teller.',
        'Retardéry osaďte do lepidla po okrajoch a pomocou podporných rebier. Vertikálne stĺpiky smerujú do rebrovanej podpornej dosky.',
        'Otvor s priemerom 6 mm slúži na odvetrávanie, nie ako značenie.',
      ],
    },
    znacky: ['DEBUZ® – Kölner Teller', 'DEBUZ® dvojzložkové lepidlo'],
    dlazdica: {
      src: '03-MT_1-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Spomaľovače dopravy Kölner Teller osadené v dvojrade na vozovke',
      miesto: 'Realizácia klienta',
      isteMiesto: false,
    },
    fotky: [
      {
        src: '03-MT_1-600x390.jpg',
        w: 600,
        h: 390,
        alt: 'Spomaľovače dopravy Kölner Teller osadené v dvojrade na vozovke',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: potvrdiť riadok Lepidlo v technickej tabuľke; pôvodný web uvádza „Lepidlo s inštaláciou šablóny, bez inštalácie šablón 1,0 kg“ bez jednoznačného priradenia k stĺpcom Typ KT – 50 a Typ KT – 35.]',
      '[DOPLNÍ KLIENT: ďalšie fotografie osadených retardérov (pri škole, v areáli, v autobusovom pruhu).]',
    ],
    suvisiace: ['lepene-obrubniky', 'vodorovne-dopravne-znacenie', 'protismykovy-nater'],
    seo: {
      title: 'Spomaľovače dopravy DEBUZ Kölner Teller | Cestné prvky',
      description:
        'Retardéry z liateho hliníka vo výške 35 a 50 mm na upokojovanie dopravy pri školách a priechodoch. Technické parametre KT 50 a KT 35 a návod na inštaláciu.',
    },
  },

  {
    slug: 'zalievkove-a-vyspravkove-hmoty',
    nazov: 'Zálievkové a vysprávkové hmoty',
    nazovKratky: 'Zálievkové hmoty',
    skupina: 'udrzba-a-povrchy',
    perex:
      'Zálievkové a vysprávkové hmoty do krytu vozovky. Používame značky Chipfill a Coldfill.',
    znacky: ['Chipfill', 'Coldfill'],
    dlazdica: {
      src: '04-zalievkove_hmoty_01-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Aplikácia zálievkovej hmoty do škáry v kryte vozovky',
      miesto: 'Realizácia klienta',
      isteMiesto: false,
    },
    fotky: [
      {
        src: '04-zalievkove_hmoty_01-600x390.jpg',
        w: 600,
        h: 390,
        alt: 'Aplikácia zálievkovej hmoty do škáry v kryte vozovky',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: technický popis zálievkových a vysprávkových hmôt Chipfill a Coldfill, postup aplikácie, teplotný rozsah a čas do sprejazdnenia.]',
      '[DOPLNÍ KLIENT: prípady použitia (škáry, trhliny, výtlky) a fotografie hotových opráv.]',
    ],
    suvisiace: ['lepene-obrubniky', 'odstranenie-znacenia', 'protismykovy-nater'],
    seo: {
      title: 'Zálievkové a vysprávkové hmoty | Cestné prvky s.r.o.',
      description:
        'Zálievka škár a oprava výtlkov v kryte vozovky hmotami Chipfill a Coldfill. Pýtajte si obhliadku a cenu pre konkrétny úsek.',
    },
  },

  {
    slug: 'protismykovy-nater',
    nazov: 'Bezpečnostný protišmykový náter',
    nazovKratky: 'Protišmykový náter',
    skupina: 'udrzba-a-povrchy',
    perex:
      'Protišmykové pásy a nátery na miestach so zvýšeným rizikom šmyku.',
    dlazdica: {
      src: '05-Protismykove-pasy-Filakovo3-416x390.jpg',
      w: 416,
      h: 390,
      alt: 'Protišmykové pásy na schodiskovom stupni, Fiľakovo',
      miesto: 'Fiľakovo',
      isteMiesto: true,
    },
    fotky: [
      {
        src: '05-Protismykove-pasy-Filakovo3-416x390.jpg',
        w: 416,
        h: 390,
        alt: 'Protišmykové pásy na schodiskovom stupni, Fiľakovo',
        miesto: 'Fiľakovo',
        isteMiesto: true,
      },
      {
        src: '19-Znacenie-pre-nevidiacich-varovny-pas-a-protismykovy-nater-sc.jpg',
        w: 1600,
        h: 1200,
        alt: 'Protišmykový náter hrany nástupišťa a modrý signálny pás',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: technický popis náteru, použité materiály, hodnota protišmykovosti, hrúbka vrstvy a životnosť.]',
      '[DOPLNÍ KLIENT: na aké povrchy sa náter aplikuje a za akých podmienok (teplota, vlhkosť, čas zaschnutia).]',
    ],
    suvisiace: ['znacenie-pre-nevidiacich', 'vodorovne-dopravne-znacenie', 'zalievkove-a-vyspravkove-hmoty'],
    seo: {
      title: 'Bezpečnostný protišmykový náter | Cestné prvky s.r.o.',
      description:
        'Protišmykový náter na hrany schodiskových stupňov, rampy, nástupištia a ďalšie pochôdzne aj pojazdné plochy so zvýšeným rizikom šmyku.',
    },
  },

  {
    slug: 'cyklotrasy',
    nazov: 'Cyklotrasy',
    nazovKratky: 'Cyklotrasy',
    skupina: 'prvky-vo-vozovke',
    perex:
      'Prvky a značenie pre cyklistické trasy.',
    dlazdica: {
      src: '06-IMG_1565-480x390.jpg',
      w: 480,
      h: 390,
      alt: 'Cyklotrasa s farebným povrchom a piktogramom bicykla',
      miesto: 'Realizácia klienta',
      isteMiesto: false,
    },
    fotky: [
      {
        src: '06-IMG_1565-480x390.jpg',
        w: 480,
        h: 390,
        alt: 'Cyklotrasa s farebným povrchom a piktogramom bicykla',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: čo presne na cyklotrasách realizujeme (farebný povrch, piktogramy, deliace prvky, značenie križovaní), použité materiály a rozsah prác.]',
      '[DOPLNÍ KLIENT: fotografie dokončených cyklotrás s miestom realizácie.]',
    ],
    suvisiace: ['vodorovne-dopravne-znacenie', 'lepene-obrubniky', 'protismykovy-nater'],
    seo: {
      title: 'Cyklotrasy | Cestné prvky s.r.o.',
      description:
        'Značenie a bezpečnostné prvky cyklistických trás a ich napojení na pozemné komunikácie. Dohodnite si obhliadku úseku.',
    },
  },

  {
    slug: 'stitky-braillovo-pismo',
    nazov: 'Štítky – Braillovo písmo, gravírovanie, hmatové mapy',
    nazovKratky: 'Štítky a hmatové mapy',
    skupina: 'debarierizacia-a-znacenie',
    perex:
      'Orientačné štítky s Braillovým písmom, gravírovanie a hmatové mapy pre ľudí so zrakovým postihnutím.',
    dlazdica: {
      src: '07-Braill-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Orientačné štítky s Braillovým písmom a piktogramami',
      miesto: 'Realizácia klienta',
      isteMiesto: false,
    },
    fotky: [
      {
        src: '07-Braill-600x390.jpg',
        w: 600,
        h: 390,
        alt: 'Orientačné štítky s Braillovým písmom a piktogramami',
        miesto: 'Realizácia klienta',
        isteMiesto: false,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: materiály a rozmery štítkov, technológia gravírovania, spracovanie Braillovho písma a rozsah hmatových máp.]',
      '[DOPLNÍ KLIENT: fotografie osadených štítkov a hmatovej mapy v budove.]',
    ],
    suvisiace: ['znacenie-pre-nevidiacich', 'protismykovy-nater', 'vodorovne-dopravne-znacenie'],
    seo: {
      title: 'Štítky s Braillovým písmom a hmatové mapy | Cestné prvky',
      description:
        'Orientačné štítky, gravírovanie a hmatové mapy pre ľudí so zrakovým postihnutím do budov a verejných priestorov.',
    },
  },

  {
    slug: 'odstranenie-znacenia',
    nazov: 'Odstránenie starého vodorovného dopravného značenia',
    nazovKratky: 'Odstránenie značenia',
    skupina: 'udrzba-a-povrchy',
    perex:
      'Odstránenie prekonaného vodorovného dopravného značenia.',
    dlazdica: {
      src: '08-BA_Bosakova-600x390.jpg',
      w: 600,
      h: 390,
      alt: 'Priechod pre chodcov s vodorovným značením, Bratislava Bosákova',
      miesto: 'Bratislava Bosákova',
      isteMiesto: true,
    },
    fotky: [
      {
        src: '08-BA_Bosakova-600x390.jpg',
        w: 600,
        h: 390,
        alt: 'Priechod pre chodcov s vodorovným značením, Bratislava Bosákova',
        miesto: 'Bratislava Bosákova',
        isteMiesto: true,
      },
    ],
    chyba: [
      '[DOPLNÍ KLIENT: metóda odstraňovania (frézovanie, tryskanie, iné), vplyv na povrch vozovky a rozsah prác.]',
      '[DOPLNÍ KLIENT: fotografie úseku pred odstránením a po ňom.]',
    ],
    suvisiace: ['vodorovne-dopravne-znacenie', 'zalievkove-a-vyspravkove-hmoty', 'protismykovy-nater'],
    seo: {
      title: 'Odstránenie starého vodorovného značenia | Cestné prvky',
      description:
        'Odstránenie prekonaného vodorovného dopravného značenia pred obnovou úseku alebo zmenou organizácie dopravy.',
    },
  },
])

/** Služba podľa slugu; vracia `undefined`, ak slug neexistuje (route 404). */
// Dočasný alias, kým stránky prejdú z `partner` na `konzultacie`.
// Odstrániť pri záverečnej integrácii kola 3.
for (const s of SLUZBY) if (s.konzultacie && !s.partner) s.partner = s.konzultacie

export const sluzbaPodlaSlugu = (slug) => SLUZBY.find((s) => s.slug === slug)

/** Služby jednej skupiny v poradí z navigácie. */
export const sluzbyPodlaSkupiny = (idSkupiny) => SLUZBY.filter((s) => s.skupina === idSkupiny)

/** Skupina podľa id (pre drobček a nadpis celku). */
export const skupinaPodlaId = (id) => SKUPINY.find((s) => s.id === id)

/** Všetky slugy v poradí z navigácie (pre routy a audit). */
export const SLUGY = SLUZBY.map((s) => s.slug)
