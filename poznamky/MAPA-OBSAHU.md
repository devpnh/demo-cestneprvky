# MAPA OBSAHU — pôvodný web → nový viacstránkový web

Zdroj: `poznamky/OBSAH-ORIGINAL.md` (vyčistený scrape cestneprvky.sk, 8 stránok),
doplnkovo `pipeline/facts.json` a `pipeline/structure.json`.
Cieľové súbory: `src/content/sluzby.js`, `src/content/realizacie.js`,
`src/content/firma.js`, `src/content/routes.js`, `src/content/global.json` (NAP a SEO,
nemenené v tomto kole).

Inventár má **51 unikátnych obsahových riadkov**. Tri z nich sú jednoriadkové bloky
celých stránok (lepené obrubníky, vodorovné značenie, spomaľovače), preto sú v tabuľke
rozpísané na vety a položky. Tabuľka má **75 riadkov** a **každý má rozhodnutie**.

---

## 1. Spoločné prvky (hlavička, pätička, opakované na všetkých stránkach)

| # | Riadok originálu | Kam ide (route · sekcia · pole) |
|---|---|---|
| 001 | `Dohodnúť stretnutie` (10×, Elementor popup) | Všetky routy · hlavička a CTA pásma → `ObhliadkaDialog`, text CTA `Dohodnúť obhliadku a cenu` (`global.json` → `contact.ctaLabel`). Akcia + benefit namiesto holého „stretnutie". |
| 002 | `Δ` | **Vypustené** — artefakt Elementor honeypotu vo formulári, nie obsah. |
| 007 | `O NÁS` (nadpis) | `/o-firme` · H1 pásmo · `routes.js` → `/o-firme.label`; v pätičke ako nadpis stĺpca. |
| 019 | `Firma Cestné prvky s.r.o. bola založená v roku 2012. V oblasti dopravných stavieb používame naše inovatívne technológie. Spolupracujeme s významnými európskymi spoločnosťami z tejto oblasti.` | `/o-firme` · úvod → `firma.js` → `FIRMA.uvod[0..2]`. **Prepísané:** „inovatívne technológie" nahradené menami postupov (stierkovanie studeným plastom, lepenie obrubníkov akrylovým tmelom, osádzanie retardérov na dvojzložkové lepidlo); „významnými európskymi spoločnosťami" nahradené konkrétom „materiály a technológie od európskych výrobcov" (mená firiem → §11, položka 1). |
| 009 | tá istá veta v hero verzii (s preklepom „dopravých") | Zlúčené s 019, preklep neprenášame. |
| 008 | `ŠETRÍME VÁŠ ČAS AJ PENIAZE !` | `/o-firme` a `/` · claim → `firma.js` → `FIRMA.claim` (bez verzálok a bez medzery pred výkričníkom). |
| 020 | `KONTAKT` | `/kontakt` · H1 → `routes.js` → `/kontakt`; v pätičke nadpis stĺpca. |
| 021 | `Adresa: Borová 3295/36, 010 01` | `/kontakt` · NAP + pätička → `global.json` → `nap.street`, `nap.postalCode`. |
| 022 | `Žilina, Slovensko` | `/kontakt` · NAP + pätička → `global.json` → `nap.city`, `nap.country`. |
| 023 | `E-mail: info@cestneprvky.sk` | `/kontakt` · NAP + pätička + `mailto:` → `global.json` → `nap.email`. |
| 024 | `Telefón: +421 911 87 87 89` | `/kontakt` · NAP + pätička + `tel:` v hlavičke → `global.json` → `nap.phone`. |
| 025 | `NOVINKY` | `/o-firme` · sekcia Aktuality → `firma.js` → `FIRMA.aktuality`. |
| 026 | `Recent Posts` | **Vypustené** — anglický nadpis widgetu zo šablóny MaisonCo, duplikuje `NOVINKY`. |
| 027 | `Žilinská župa buduje bezpečnostné ostrovčeky, odborníci to vítajú` | `/o-firme` · Aktuality → `firma.js` → `FIRMA.aktuality[0].titulok`, `rok: 2021`. Telo článku nemáme, nevymýšľame ho. `url: null` (viď poznámku pod tabuľkou). |
| 028 | `NAPÍŠTE NÁM` | `/kontakt` · formulár → existujúci `ZadanieForm`; nadpis v hlase klienta, tlačidlo nikdy „Odoslať". |

**Poznámka k 027:** presnú URL článku podklady neobsahujú. `pipeline/structure.json`
pozná z pôvodného webu len výpis `https://www.cestneprvky.sk/novinky/`, samotný článok
nie. Preto `url: null` a §11, položka 18.

---

## 2. Domov (`https://www.cestneprvky.sk/`)

| # | Riadok originálu | Kam ide |
|---|---|---|
| 003 | `Značenie pre nevidiacich a slabozrakých` (hero dlaždica) | `/` · sekcia Služby (nosná trojica) a `/sluzby` → `sluzby.js` → `SLUZBY[0].nazov`; stránka `/sluzby/znacenie-pre-nevidiacich`. |
| 005 | `Lepené cestné obrubníky` (hero dlaždica) | `/` · sekcia Služby → `SLUZBY[2]`. Názov zjednotený na `Lepené obrubníky` (tak ho uvádza zoznam služieb aj `facts.json`); „cestné" ostáva v texte odsekov a v alt fotiek. |
| 006 | `Vodorovné dopravné značenie` (hero dlaždica) | `/` · sekcia Služby → `SLUZBY[1]`; stránka `/sluzby/vodorovne-dopravne-znacenie`. |
| 004 | `VIAC INFORMÁCIÍ` (3×) | Transformované — odkaz na kartách služieb; text v hlase klienta, nie verzálky zo šablóny. |
| 010 | `Naše služby` (nadpis) | `/sluzby` · H1 → `routes.js` → `/sluzby.label` = `Služby`. |
| 011 | `Viac informácii` (18×, preklep) | Transformované — jeden odkaz na kartu služby, preklep neprenášame. |
| 012 | `Lepené obrubníky` | `SLUZBY[2].nazov` → `/sluzby/lepene-obrubniky`. |
| 013 | `Spomaľovače dopravy` | `SLUZBY[3].nazov` = `Spomaľovače dopravy (retardéry)` → `/sluzby/spomalovace-dopravy`. Zátvorka je z `facts.json` a z tela pôvodnej stránky („DEBUZ® retardéry"); pôvodný názov ostáva ako podreťazec aj v `nazovKratky`. |
| 014 | `Zálievkové a vysprávkové hmoty` | `SLUZBY[4].nazov` → `/sluzby/zalievkove-a-vyspravkove-hmoty`. |
| 015 | `Bezpečnostný protišmykový náter` | `SLUZBY[5].nazov` → `/sluzby/protismykovy-nater`. |
| 016 | `Cyklotrasy` | `SLUZBY[6].nazov` → `/sluzby/cyklotrasy`. |
| 017 | `Štítky – Braillovo písmo, gravírovanie, hmatové mapy` | `SLUZBY[7].nazov` → `/sluzby/stitky-braillovo-pismo`. Pomlčka ostáva, je súčasťou doslovného názvu (výnimka z pravidla A1). |
| 018 | `Odstránenie starého vodorovného dopravného značenia` | `SLUZBY[8].nazov` → `/sluzby/odstranenie-znacenia`. |

---

## 3. Galéria (`/galeria/`)

| # | Riadok originálu | Kam ide |
|---|---|---|
| 029 | `Galéria` | `/realizacie` · H1 → `routes.js` → `/realizacie`. Premenované na „Realizácie", lebo obsahom sú hotové práce, nie fotogaléria. |
| 030 | `All` | **Vypustené** — anglický filter zo šablóny MaisonCo. Nahradený filtrom „Všetko" nad reálnymi dátami. |
| 031 | `Environment` | **Vypustené** — kategória šablóny MaisonCo, nesúvisí s obsahom klienta. |
| 032 | `Building Progress` | **Vypustené** — kategória šablóny MaisonCo. |
| 033 | `Views` | **Vypustené** — kategória šablóny MaisonCo. |
| 034 | `Visualizing Complex` | **Vypustené** — kategória šablóny MaisonCo. |

Namiesto nich má `/realizacie` filtre nad skutočnými dátami:
`realizacie.js` → `TYPY_PRVKOV` (14 typov), `MIESTA` (8 hodnôt), `PROSTREDIA`
(Exteriér, Interiér — delenie, ktoré používa aj pôvodná stránka služby 1).

---

## 4. Kontakt (`/contact/`)

| # | Riadok originálu | Kam ide |
|---|---|---|
| 035 | `Kontaktujte nás` | `/kontakt` · H1 → `routes.js` → `/kontakt.label` = `Kontakt`. |

Stránka v origináli okrem nadpisu a pätičky nič neobsahovala. Nový `/kontakt` dostáva
NAP z `global.json`, `tel:`, `mailto:`, statickú mapu a `ZadanieForm` (§3 promptu).

---

## 5. Značenie pre nevidiacich a slabozrakých (`/apartment/znacenie-pre-nevidiacich/`)

| # | Riadok originálu | Kam ide |
|---|---|---|
| 036 | `Naše služby > Značenie pre nevidiacich a slabozrakých` | `/sluzby/znacenie-pre-nevidiacich` · drobček → `routes.js` → `ROUTY_SLUZIEB[].rodic = '/sluzby'`. |
| 037 | odsek o ÚNSS (konzultácie, stanoviská, odkaz architektonickebariery.sk) | `SLUZBY[0].partner` (`nazov`, `popis`, `url`) a `FIRMA.partner`. |
| 038 | „Nová technológia … stierkovania studeným plastom Kaltplastik … bez nutnosti zásahu do pôvodných konštrukcií." | `SLUZBY[0].odseky[0]`. |
| 039 | „Schéma, vzor, farebný odtieň … vyhlášky MŽP SR č. 532/2002 Z. z. a vyhlášky MV SR č. 9/2009 Z. z." | `SLUZBY[0].odseky[1]` + `SLUZBY[0].normy` + `FIRMA.normy` + `FIRMA.fakty[2..3]`. |
| 040 | „Ďalšou metódou je inštalácia odolných mosadzných a nerezových indikátorov…" | `SLUZBY[0].odseky[2]`. |
| 041 | `EXTERIÉR` | `SLUZBY[0].zoznamy[0].titulok`. |
| 042 | `Varovný pás` | `zoznamy[0].polozky[0]` a `zoznamy[1].polozky[0]` (interiér); zároveň typ prvku v galérii. |
| 043 | `Signálny pás` | `zoznamy[0].polozky[1]`; typ prvku v galérii. |
| 044 | `Špeciálny varovný pás` | `zoznamy[0].polozky[2]`. Fotku tohto prvku v podkladoch nemáme, v galérii preto nemá záznam. |
| 045 | `Vodiaca línia` | `zoznamy[0].polozky[3]` a `zoznamy[1].polozky[1]`; typ prvku v galérii. |
| 046 | `Vodiaca línia v priechode pre chodcov` | `zoznamy[0].polozky[4]`; typ prvku v galérii; zároveň `SLUZBY[1].zoznamy[0].polozky[1]`. |
| 047 | `Nerezové indikátory v exteriéri` | `zoznamy[0].polozky[5]`; typ prvku `Nerezové indikátory` v galérii. |
| 048 | `INTERIÉR` | `SLUZBY[0].zoznamy[1].titulok`; v galérii pole `prostredie`. |

---

## 6. Lepené obrubníky (`/apartment/lepene-obrubniky/`) — riadok 049 rozpísaný

| # | Veta / položka originálu | Kam ide |
|---|---|---|
| 049.1 | `Lepené cestné obrubníky – rýchlo a kvalitne` (nadpis) | Prenesené obsahovo do `SLUZBY[2].perex` a `odseky[0]` („Realizácia je rýchla…"). Pomlčka v nadpise sa neprenáša (A1), nie je to názov produktu. |
| 049.2 | „Metóda lepenia nízkych obrubníkov k podkladu tmelom na báze akrylovej živice." | `SLUZBY[2].odseky[0]`. |
| 049.3 | `Použitie` (podnadpis) | `SLUZBY[2].odseky[1]` (veta „Metóda sa hodí pri…"). |
| 049.4 | „Ideálne riešenie pri rekonštrukciách … kde sa používajú cestné obrubníky." | `SLUZBY[2].odseky[1]`. |
| 049.5 | `Rýchlosť realizácie je vysoká` (podnadpis) | `SLUZBY[2].odseky[2]` + `FIRMA.pristup[1].nazov`. |
| 049.6 | „Pri lepených obrubníkoch odpadá problém s veľkým množstvom búracích prác … 100 % svojej pevnosti … ďalších stavebných prácach." | `SLUZBY[2].odseky[2]` + `FIRMA.pristup[0]` + `FIRMA.pristup[1].popis`. |
| 049.7 | „Týmto sa minimalizujú dopravné obmedzenia na funkčných komunikáciách a … náklady." | `SLUZBY[2].odseky[3]` + `FIRMA.pristup[1].popis`. |
| 049.8 | „Pri lepených obrubníkoch nie je potrebné používanie zálievkových hmôt, nakoľko lepidlo vytvorí dokonalý styk…" | `SLUZBY[2].odseky[3]`. Slovo „dokonalý" vypustené ako prázdny superlatív, technický obsah ostáva. |
| 049.9 | `Lepené ostrovčeky` | `SLUZBY[2].zoznamy[0].polozky[0]`. |
| 049.10 | `Lepené vodiace línie z obrubníkov` | `SLUZBY[2].zoznamy[0].polozky[1]`. |
| 049.11 | `Lepené parkovacie dorazy` | `SLUZBY[2].zoznamy[0].polozky[2]`. |
| 049.12 | `Doplnkový materiál ku ostrovčekom a obrubníkom` | `SLUZBY[2].zoznamy[0].polozky[3]`. Pôvodný web mal na to samostatnú URL `/apartment/doplnkovy-material-pre-komunikacie-a-parkoviska/`, ale scrape z nej nemá žiadny text; ostáva ako podkategória, nie ako desiata služba. |

---

## 7. Vodorovné dopravné značenie (`/apartment/vodorovne-dopravne-znacenie/`) — riadok 050 rozpísaný

| # | Veta / položka originálu | Kam ide |
|---|---|---|
| 050.1 | „Vysoká bezpečnosť dopravy, dlhá životnosť a ľahké spracovanie sú požiadavky na moderné dopravné značenie." | `SLUZBY[1].odseky[0]`. |
| 050.2 | „Ponúkame na zákazku inštalácie z našich „ColdPlastik" materiálov. V prípade záujmu vieme dodať akékoľvek riešenie na mieru." | `SLUZBY[1].odseky[0]`. Pravopis značky zjednotený na `ColdPlastic` (tak ju web píše v ďalších vetách aj `facts.json`). |
| 050.3 | „ColdPlastic studený plast, používame od popredných svetových výrobcov, ktorí nám garantujú najvyššiu akosť materiálu, ktorý neobsahuje žiadne rozpúšťadlá, je určený pre použitie pri dopravnom značení." | `SLUZBY[1].odseky[1]` — **prepísané**: „poprední svetoví výrobcovia" a „garantujú najvyššiu akosť" sú nemenované superlatívy (A2/A3), ostáva overiteľná vlastnosť (bez rozpúšťadiel, určený na dopravné značenie). Mená výrobcov → §11, položka 1 (`SLUZBY[1].chyba[0]`). |
| 050.4 | „Ideálny pre trvalé značenie jazdných pruhov, cyklistických chodníkov, prechodov pre chodcov, priemyselných a skladovacích zón, letísk, parkovacích miest, aj v podzemných garážach." | `SLUZBY[1].odseky[1]`. |
| 050.5 | „Extrémne odolný voči poveternostným vplyvom a mechanickému poškodeniu a to aj pri vysokom zaťažení dopravnou premávkou." | `SLUZBY[1].odseky[2]`, bez zosilňovača „extrémne". |
| 050.6 | „Použiteľnosť na všetkých pochôdznych povrchoch." | `SLUZBY[1].odseky[2]`. |
| 050.7 | `Vodorovné dopravné značenie studeným plastom (ColdPlastic):` + Priechod pre chodcov · Vodiaca línia v priechode pre chodcov · Opticko-akustická brzda · Piktogramy | `SLUZBY[1].zoznamy[0]` (titulok + 4 položky). |
| 050.8 | `Vodorovné dopravné značenie:` + Jednozložkový náter priechodov pre chodcov · Jednozložkový náter čiar a parkovacích boxov · Výstražné značenie ostrovčekov, obrubníkov · Obnova značenia vo firemných priestoroch | `SLUZBY[1].zoznamy[1]`, titulok zjednoznačnený na `Jednozložkový náter` (v origináli mal rovnaký titulok ako sekcia, čo nedáva zmysel v zozname). |

---

## 8. Spomaľovače dopravy (`/apartment/spomalovace-dopravy/`) — riadok 051 rozpísaný

| # | Veta / položka originálu | Kam ide |
|---|---|---|
| 051.1 | „DEBUZ® retardéry Kölner Teller z vysokokvalitného liateho hliníka sa používajú ako prvky na upokojovanie dopravy a v praxi nachádzajú výborné uplatnenie už 25 rokov." | `SLUZBY[3].odseky[0]`, bez „vysokokvalitného" a „výborné" (A2). Údaj 25 rokov je vlastnosť produktu DEBUZ®, nie skúsenosť firmy, preto ostáva. |
| 051.2 | „Výška 35 a 50mm a usporiadanie inštalovaného DEBUZ® – Kölner Teller (retardéra) núti vodiča, aby zachovával určitú rýchlosť." | `SLUZBY[3].odseky[1]`. |
| 051.3 | „Používa sa na nebezpečných miestach, pri školách, škôlkach, na priechodoch pre chodcov v areáloch atd. pre dosiahnutie žiadúceho obmedzenia – spomalenia." | `SLUZBY[3].odseky[1]` + `SLUZBY[3].zoznamy[0]` (Kam ich osádzame). |
| 051.4 | `Ďalšie výhody DEBUZ® – Kölner Teller:` + 7 odrážok | `SLUZBY[3].vyhody[0..6]`, všetkých sedem doslovne v hlase klienta. |
| 051.5 | `Technický popis: DEBUZ® – Kölner Teller` + tabuľka (Typ KT – 50 / Typ KT – 35, odporúčaná rýchlosť, rozmery Ø/H, hmotnosť, lepidlo) + poznámka `*) S možnosťou použitia pre autobusové pruhy` | `SLUZBY[3].tabulka` (`titulok`, `hlavicka`, 4 `riadky`, `poznamka`). Riadok „Lepidlo" je v origináli nejednoznačný → prenesený v pôvodnom poradí + `chyba[0]` na potvrdenie klientom. |
| 051.6 | `Návod na inštaláciu` + 6 krokov (dvojrad, rozostup 500 mm, šablóna, lepidlo, podporné rebrá, 6 mm odvetrávací otvor) | `SLUZBY[3].navod.kroky[0..5]`, prepísané do rozkazovacieho spôsobu (hlas klienta). |
| 051.7 | „Procesné technológie pre spracovanie DEBUZ® – Dvojzložkové lepidlo DEBUZ®." | `SLUZBY[3].znacky` a `FIRMA.znacky` (DEBUZ® – Kölner Teller, DEBUZ® dvojzložkové lepidlo). |

---

## 9. Služby 5 až 9 — čo originál nemal

Služby `Zálievkové a vysprávkové hmoty`, `Bezpečnostný protišmykový náter`,
`Cyklotrasy`, `Štítky – Braillovo písmo, gravírovanie, hmatové mapy` a
`Odstránenie starého vodorovného dopravného značenia` mali v origináli **len názov,
dlaždicu a odkaz**. Na nový web idú s:

- názvom doslova (`nazov`),
- jednou vetou „pre koho a kedy", odvodenou výlučne z názvu (`perex`),
- fotkou z pôvodnej dlaždice (`dlazdica`, `fotky`),
- súvisiacimi službami a CTA,
- poľom `chyba` s presným zadaním pre klienta (žiadne vymyslené technológie ani parametre).

Chipfill a Coldfill sú pri službe 5 vedené **len ako názvy značiek**
(`SLUZBY[4].znacky`, `FIRMA.znacky`), technický popis dopĺňa klient.

---

## 10. Pokrytie

| Ukazovateľ | Hodnota |
|---|---|
| Unikátnych obsahových riadkov v `OBSAH-ORIGINAL.md` | 51 |
| Z toho jednoriadkových blokov celých stránok | 3 (049, 050, 051) |
| Riadkov v tejto mape po rozpísaní blokov | **75** |
| Prenesených na nový web | **68** (90,7 %) |
| Vypustených so zdôvodnením | **7** (9,3 %): `Δ`, `Recent Posts`, `All`, `Environment`, `Building Progress`, `Views`, `Visualizing Complex` |
| Riadkov bez rozhodnutia | **0** |
| **Pokrytie inventára** | **100 %** |

Všetkých sedem vypustených riadkov je šablónový balast MaisonCo alebo artefakt
Elementoru; ani jeden nenesie údaj klienta. Zoznam je zároveň grep kontrolou auditu
(§2.4 promptu, STANDARDY A7).

Ďalšie kontroly nad `src/content/*.js` po dopísaní dát:

| Kontrola | Výsledok |
|---|---|
| pomlčky `—` / `–` mimo doslovných názvov (`DEBUZ® – Kölner Teller`, `Typ KT – 50`, `Typ KT – 35`, `Štítky – Braillovo písmo…`) | 0 |
| slop slová (inovat, komplexn, špičkov, synerg, lídr, garantuj, najvyšš, popredn, významn, extrémne, dokonal, vysokokvalitn…) | 0 |
| čechizmy (`které`, `již`, `ještě`, `zde`, `společnost`, `jsou`, `pouze`, `díky`) | 0 |
| `IČO`, `DIČ`, `recenzi`, `hviezdič`, `rokov skúsenost`, `24/7`, otváracie hodiny, ISO | 0 |
| MaisonCo (`Connor`, `Caroline`, `Manhattan`, `Observatory`, `Recent Posts`, `Apartment`, `Visualizing`, `janko`) | 0 |
| anglické UI stringy a `Odoslať` | 0 |
| cudzie hexy | 0 |
| `title` > 70 znakov / `description` > 160 znakov | 0 / 0 (15 routov) |
| fotky uvedené v dátach, ktoré na disku neexistujú | 0 |
| fotky na disku bez záznamu v `REALIZACIE` (okrem loga a `10-titulka_o_firme.jpg`) | 0 |
| `w` a `h` v dátach vs. reálny rozmer súboru (`sips`) | 0 rozdielov |

**Pozor pri ďalších kolách:** počas tohto kola bežala paralelne optimalizácia fotiek
a zmenila rozmery siedmich súborov (`22`, `24`, `28`, `36`, `37`, `39`, `40`
z 2048/2560 px na 1600 px dlhšej strany). Rozmery v dátach boli po nej znovu zmerané
a zosynchronizované. Ak sa fotky budú znovu prevzorkovávať, treba `w` a `h`
v `sluzby.js` a `realizacie.js` premerať znova (`sips -g pixelWidth -g pixelHeight`),
inak vznikne CLS.

---

## 11. Zoznam `[DOPLNÍ KLIENT]` (18 položiek)

Texty služieb (`src/content/sluzby.js`, pole `chyba`):

1. `vodorovne-dopravne-znacenie` — mená európskych výrobcov materiálov ColdPlastic, ktoré smieme uviesť namiesto všeobecnej formulácie o dodávateľoch.
2. `vodorovne-dopravne-znacenie` — fotografie cyklochodníka, opticko-akustickej brzdy a parkovacích boxov realizovaných studeným plastom.
3. `lepene-obrubniky` — fotografie lepených ostrovčekov, parkovacích dorazov a doplnkového materiálu; v podkladoch je len Medený Hámor.
4. `lepene-obrubniky` — názov tmelu na báze akrylovej živice a jeho výrobca.
5. `spomalovace-dopravy` — potvrdiť riadok „Lepidlo" v technickej tabuľke; pôvodný web uvádza „Lepidlo s inštaláciou šablóny, bez inštalácie šablón 1,0 kg" bez jednoznačného priradenia k stĺpcom Typ KT – 50 a Typ KT – 35.
6. `spomalovace-dopravy` — ďalšie fotografie osadených retardérov (pri škole, v areáli, v autobusovom pruhu).
7. `zalievkove-a-vyspravkove-hmoty` — technický popis hmôt Chipfill a Coldfill, postup aplikácie, teplotný rozsah a čas do sprejazdnenia.
8. `zalievkove-a-vyspravkove-hmoty` — prípady použitia (škáry, trhliny, výtlky) a fotografie hotových opráv.
9. `protismykovy-nater` — technický popis náteru, použité materiály, hodnota protišmykovosti, hrúbka vrstvy a životnosť.
10. `protismykovy-nater` — na aké povrchy sa náter aplikuje a za akých podmienok (teplota, vlhkosť, čas zaschnutia).
11. `cyklotrasy` — čo presne na cyklotrasách realizujeme (farebný povrch, piktogramy, deliace prvky, značenie križovaní), materiály a rozsah prác.
12. `cyklotrasy` — fotografie dokončených cyklotrás s miestom realizácie.
13. `stitky-braillovo-pismo` — materiály a rozmery štítkov, technológia gravírovania, spracovanie Braillovho písma a rozsah hmatových máp.
14. `stitky-braillovo-pismo` — fotografie osadených štítkov a hmatovej mapy v budove.
15. `odstranenie-znacenia` — metóda odstraňovania (frézovanie, tryskanie, iné), vplyv na povrch vozovky a rozsah prác.
16. `odstranenie-znacenia` — fotografie úseku pred odstránením a po ňom.

Firemné údaje (`src/content/firma.js`):

17. `FIRMA.znacky` (Chipfill a Coldfill) — technický popis a parametre hmôt.
18. `FIRMA.aktuality[0]` — odkaz na pôvodný článok o žilinských ostrovčekoch a názov média, ktoré ho vydalo.

---

## 12. Neisté miesta fotiek — pre `HANDOVER.md`

Na webe stojí pravdivé `Realizácia klienta` (`isteMiesto: false`). Odhad je tu, nie na webe.

| Súbor | Indícia v názve | Náš odhad (na webe nie je) |
|---|---|---|
| `02-PD-1-600x390.jpg`, `14-PD-1.jpg` | `PD` | Prievidza (okresná skratka) |
| `03-MT_1-600x390.jpg` | `MT` | Martin |
| `20-BB-1-scaled.jpg` | `BB` | Banská Bystrica |
| `26-TN_1-scaled.jpg` | `TN` | Trenčín |
| `19-…-nater-sc.jpg`, `22-…-nater-sc.jpg` | pôvodné názvy `…-schodiskoveho-stupna-TT1.jpg` a `…-TT3.jpg` | Trnava |
| `04-zalievkove_hmoty_01-600x390.jpg` | žiadna | neznáme |
| `06-IMG_1565-480x390.jpg` | žiadna | neznáme |
| `07-Braill-600x390.jpg` | žiadna | produktová fotografia štítkov, nie realizácia na mieste |
| `24-…_n-2048x1536.jpg`, `32-…_n.jpg`, `38-…_n.jpg`, `41-…_n.jpg` | číselné názvy z Facebooku | neznáme |
| `30-IMAG0678.jpg` | žiadna | neznáme |
| `33-Subor_008…`, `34-Subor_009…`, `35-Subor_0031.jpg` | `Subor_00*` | neznáme |

Isté miesta (`isteMiesto: true`, na webe sa zobrazujú): Zubačka, Medený Hámor,
Fiľakovo, Tornaľa, Bratislava, Bratislava Nivy, Bratislava Bosákova.

**Miesta z `facts.json`, ku ktorým v `public/assets` fotka nie je:** Milochov,
Devínska Nová Ves, Svederník, Most pri Bratislave, Blatná na Ostrove, Podunajské
Biskupice, Slanická osada, Kysucké Nové Mesto. Na web ich nedávame (nemáme k nim
dôkaz ani fotku) → handover, nech klient pošle fotografie alebo potvrdí zoznam.

**Rozpor v zadaní, ktorý sme riešili faktami:** §2.2 promptu priraďuje fotky 30 až 35
službe „Lepené obrubníky" (Svederník, Most pri Bratislave). `pipeline/structure.json`
(pole `sourcePage`) aj obsah samotných fotografií hovoria niečo iné: všetkých šesť je
zo stránky `/apartment/znacenie-pre-nevidiacich/` a zobrazujú nerezové a mosadzné
indikátory a vodiacu líniu v priechode. Priradili sme ich podľa dôkazu, nie podľa
tabuľky v promptne. Lepené obrubníky tak majú v podkladoch len Medený Hámor
(`01`, `13`) → položka 3 v zozname `[DOPLNÍ KLIENT]`.

**`10-titulka_o_firme.jpg`** je podľa zadania vylúčená z galérie (firemná titulka).
Fotograficky ide o varovný pás z mosadzných indikátorov, takže sa dá použiť ako
obrázok stránky `/o-firme`; do `REALIZACIE` ju nedávame.

---

## 13. Zdôvodnenie zaradenia služieb do troch celkov

| Celok | Služby | Prečo takto |
|---|---|---|
| **Debarierizácia a značenie** (`debarierizacia-a-znacenie`) | Značenie pre nevidiacich a slabozrakých · Vodorovné dopravné značenie · Štítky – Braillovo písmo, gravírovanie, hmatové mapy | Prvky, ktoré **vedú a informujú** človeka: hmatové a vizuálne značenie na povrchu a hmatová informácia na štítku. Spája ich materiál (studený plast, indikátory) aj legislatíva (vyhlášky 532/2002 a 9/2009). Zákazník, ktorý rieši prístupnosť, nájde všetky tri na jednom mieste. |
| **Prvky vo vozovke** (`prvky-vo-vozovke`) | Lepené obrubníky · Spomaľovače dopravy (retardéry) · Cyklotrasy | Prvky, ktoré sa **osádzajú do vozovky alebo na jej okraj a menia jej usporiadanie**: obrubník ohraničí ostrovček, retardér zníži rýchlosť, cyklotrasa vyčlení pruh pre cyklistov. Spoločný predajný argument: bez búracích prác a bez ťažkých mechanizmov, s krátkym obmedzením dopravy. |
| **Údržba a povrchy** (`udrzba-a-povrchy`) | Zálievkové a vysprávkové hmoty · Bezpečnostný protišmykový náter · Odstránenie starého vodorovného dopravného značenia | Zásahy do **existujúceho povrchu**, ktoré predlžujú jeho životnosť alebo ho pripravia na obnovu: zálievka škáry, protišmyková úprava, odstránenie prekonaného značenia. Odstránenie značenia je tu, nie pri značení, lebo je to krok údržby a obnovy úseku, nie nový informačný prvok. |

Rozdelenie 3 + 3 + 3 drží prehľad `/sluzby` vyvážený a každý celok má na Domove
dosť obsahu na vlastný blok.

---

## 14. Vytvorené súbory a čísla

| Súbor | Obsah |
|---|---|
| `src/content/sluzby.js` | 3 skupiny, 9 služieb, 4 služby s plným textom (odseky + zoznamy), 1 služba s tabuľkou aj návodom, 7 výhod DEBUZ®, 16 položiek `[DOPLNÍ KLIENT]` |
| `src/content/realizacie.js` | 35 fotiek (`REALIZACIE`), 32 v galérii (`GALERIA`, bez 3 malých orezov duplicitných scén), 14 typov prvkov, 8 miest, 2 prostredia |
| `src/content/firma.js` | `FIRMA` (rok 2012, claim, 3 odseky úvodu, 4 argumenty prístupu, 2 vyhlášky, partner ÚNSS, 5 značiek, 5 faktov, 1 aktualita), `PROCES` (4 kroky) |
| `src/content/routes.js` | 5 statických routov + 9 stránok služieb + 404 = 15 routov, `VSETKY_CESTY` (14 URL), `NAVIGACIA` (4 položky) |
