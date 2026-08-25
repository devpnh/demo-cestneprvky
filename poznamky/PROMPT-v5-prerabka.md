# PROMPT v5 — kompletná prerábka webu Cestné prvky (nová hierarchia, manažér + subagenti v loope)

> Skopíruj celý súbor do Claude Code otvoreného v `~/Desktop/pnh_media/cestne_prvky`
> (bypass permissions). Je to jeden autonómny beh: Peter nesleduje terminál. **Konaj,
> nepýtaj sa.** Zastav sa iba pri rozhodnutí, ktoré by menilo fakty klienta alebo je
> nezvratné mimo tohto stroja (mazanie repa, cudzí prod). Reportuj číslami, súbormi
> a screenshotmi, nie vetami typu „vylepšil som UX“.

---

## 0. Čo sa má stať (jedným odsekom)

Z existujúceho jednostránkového dema (`src/sections/*`, hotový dizajnový systém v
`src/styles/tokens.css`) postav **kompletne nový, viacstránkový B2B web** firmy
**Cestné prvky s.r.o.** (Žilina, prvky na pozemných komunikáciách: debarierizácia,
vodorovné značenie, lepené obrubníky, retardéry…). Nová informačná architektúra,
nové rozloženie, nové sekcie, nové copy. **Štýl ostáva štýlom dema** (paleta klienta,
Archivo + IBM Plex, vlasové rámy, žiadne tiene, editoriálna disciplína). **Každý
údaj z pôvodného webu musí byť na novom webe** (inventár v §2). Výsledok: čistý,
presne zarovnaný, plynulý web s prechodmi a animáciami, ktorý prezentuje stavebnú
nišu ako spoľahlivého technologického dodávateľa pre mestá, župy, správcov ciest,
stavebné firmy a developerov. Pracuješ ako **manažér**, ktorý deleguje subtasky
subagentom a v loope ich kontroluje, kým výsledok nie je perfektný (§6).

---

## 1. Povinné čítanie PRED prvým krokom (a znova na začiatku každého kola loopu)

Poradie je dôležité, neskoršie má prednosť pred týmto promptom pri konflikte:

1. `~/Desktop/Vaults/me/06-Working-with-Claude.md` §2 Design taste, §3 Hard rules, §4 Build & deploy.
2. `~/Desktop/Vaults/me/05-Opinions-Values.md` §8 (poctivosť v copy).
3. `poznamky/STANDARDY.md` — 45 bodov A1…G5 s pôvodom. **Každý bod je kontrolný riadok auditu.**
4. `poznamky/QUALITY-LOG.md` — čo sa v tomto projekte reálne kazilo (WAAPI offsets, backdrop-filter
   vs fixed, min-w tabuľky na mobile, rohy rotujúcej vrstvy → overflow, lazy-load vo full-page shote nie je bug…).
5. `poznamky/OBSAH-ORIGINAL.md` — úplný textový inventár pôvodného webu (§2 tohto promptu ho mapuje).
6. `poznamky/PROMPT.md` §1 (fakty klienta) a §2.1 (paleta) — zdroj pravdy pre údaje a farby.
7. `~/Desktop/Vaults/work/context/PNH_EDSTREX.md` — najbližší precedens prerábky stavebnej firmy
   (adaptívny header, svetlé pásma cez pretypovanie tokenov, hlas klienta, „nula vymyslených dát“, gotchas 1–7).
8. `~/Desktop/Vaults/claude_conversations/Sessions/2026-08-24 — demo-cestneprvky review slabín a PROMPT-v3-redesign.md`
   — 8 nálezov o dôkazoch a konverzii; nový web ich nesmie zopakovať.

Ak by čokoľvek v týchto zdrojoch odporovalo tomuto promptu, platí zdroj a napíš to do `QUALITY-LOG.md`.

---

## 2. Dáta — čo musí nový web obsahovať (100 % pokrytie, nič navyše)

### 2.1 Firemné fakty (doslova, zdroj `pipeline/facts.json` + `PROMPT.md` §1)

- **Cestné prvky s.r.o.** · Borová 3295/36, 010 01 Žilina, Slovensko · info@cestneprvky.sk · +421 911 87 87 89 · založená **2012**.
- Claimy z webu: „Šetríme váš čas aj peniaze“ · „Spolupracujeme s významnými európskymi spoločnosťami z tejto oblasti“ (druhý použiť **bez superlatívu**: prepíš na konkrétum „materiály európskych výrobcov“; menované firmy si vyžiadaj v handoveri).
- Partner: **Únia nevidiacich a slabozrakých Slovenska** — konzultácie architektonickej prístupnosti, stanoviská k projektovej dokumentácii; odkaz https://architektonickebariery.sk/.
- Legislatíva: vyhláška MŽP SR č. 532/2002 Z. z., vyhláška MV SR č. 9/2009 Z. z.
- Produkty/značky: ColdPlastic (studený plast, Kaltplastik), DEBUZ® Kölner Teller (liaty hliník, KT‑35 / KT‑50), DEBUZ® dvojzložkové lepidlo, Chipfill/Coldfill (oprava výtlkov).
- Jediný článok: „Žilinská župa buduje bezpečnostné ostrovčeky, odborníci to vítajú“ (2021) — máme len titulok; zobraz ako jednu položku **Aktuality** s odkazom na pôvodný článok, telo nevymýšľaj.
- Pôvodný CTA „Dohodnúť stretnutie“ bol Elementor popup → na novom webe je to `ObhliadkaDialog` + `ZadanieForm` (už existujú, znovu použiť, len zasadiť).

### 2.2 Deväť služieb (presné názvy, poradie z navigácie) a ich obsah

| # | Služba | Obsah v origináli | Fotka (public/assets) |
|---|---|---|---|
| 1 | Značenie pre nevidiacich a slabozrakých | plný text: ÚNSS, Kaltplastik, vyhlášky, mosadzné/nerezové indikátory; **Exteriér:** varovný pás, signálny pás, špeciálny varovný pás, vodiaca línia, vodiaca línia v priechode, nerezové indikátory; **Interiér:** varovný pás, vodiaca línia | 00, 12, 19–29, 36–41 (BA Nivy, TN, Tornaľa, BB, Zubačka) |
| 2 | Vodorovné dopravné značenie | plný text: ColdPlastic bez rozpúšťadiel, použitie (jazdné pruhy, cyklochodníky, priechody, priemyselné zóny, letiská, parkoviská, garáže); **studený plast:** priechod, vodiaca línia v priechode, opticko‑akustická brzda, piktogramy; **jednozložkový náter:** priechody, čiary a parkovacie boxy, výstražné značenie ostrovčekov a obrubníkov, obnova značenia vo firemných priestoroch | 02, 14 (PD), 08 |
| 3 | Lepené obrubníky | plný text: akrylový tmel, použitie (rekonštrukcie, chodníky, ostrovčeky, kruhové križovatky, parkovacie prahy, dorazy), **30 min → 100 % pevnosti**, bez búracích prác, bez ťažkých mechanizmov, bez zálievkových hmôt; podkategórie: lepené ostrovčeky, lepené vodiace línie z obrubníkov, lepené parkovacie dorazy, doplnkový materiál | 01, 13 (Medený Hámor), 30–35 (Svederník, Most pri Bratislave…) |
| 4 | Spomaľovače dopravy (retardéry) | plný text: DEBUZ® Kölner Teller, 25 rokov v praxi, výšky 35/50 mm, miesta použitia, 7 výhod, **technická tabuľka** (KT‑50 / KT‑35: odporúčaná rýchlosť < 30 / > 30 km/h, Ø/H 300/ca.60 a 300/ca.35, hmotnosť 2,5 / 2,0 kg, lepidlo so šablónou / bez šablóny 1,0 kg, KT‑35 aj pre autobusové pruhy), **návod na inštaláciu** (dvojrad, rozostup 500 mm, šablóna, lepidlo, 6 mm odvetrávací otvor) | 03 (MT) |
| 5 | Zálievkové a vysprávkové hmoty | len názov + dlaždica | 04 |
| 6 | Bezpečnostný protišmykový náter | len názov + dlaždica | 05 (Fiľakovo) |
| 7 | Cyklotrasy | len názov + dlaždica | 06 |
| 8 | Štítky: Braillovo písmo, gravírovanie, hmatové mapy | len názov + dlaždica | 07 |
| 9 | Odstránenie starého vodorovného dopravného značenia | len názov + dlaždica | 08 |

Pri službách 5–9 **nevymýšľaj technológie ani parametre**: stránka služby má názov,
jednu vetu „pre koho/kedy“ odvoditeľnú z názvu, fotku, súvisiace služby a CTA; kde by
mal byť odsek, ktorý nemáme, je `[DOPLNÍ KLIENT: …]` s presným popisom, čo treba.
Chipfill/Coldfill patrí k službe 5 (oprava výtlkov) — máme len názvy značiek.

### 2.3 Realizácie (miesta z názvov fotiek — pravdivé popisy, nič viac)

Fiľakovo, Medený Hámor, Tornaľa, Milochov, Bratislava Nivy (HB Reavis), Bratislava
Bosákova, Bratislava (vodiaca línia, priechod), Zubačka, Devínska Nová Ves, Svederník
(most), Most pri Bratislave, Blatná na Ostrove, Podunajské Biskupice, Slanická osada,
Kysucké Nové Mesto, Martin (MT), Trenčín (TN), Banská Bystrica (BB) — skratky MT/TN/BB
sú **odvodené**: použi ich len s `[DOPLNIŤ]` v `poznamky/HANDOVER.md`, na webe uveď
„Realizácia klienta“ + typ prvku, ak plný názov nie je istý. Roky nemáme → neuvádzaj.

### 2.4 Čo sa NESMIE objaviť
MaisonCo balast (Connor, Caroline, Manhattan, Observatory, Environment/Building
Progress/Views, Recent Posts, Apartment Amenities, About Us), `janko.jpg` (tvár bez
mena), IČO/DIČ, otváracie hodiny, počty realizácií, roky skúseností, recenzie, logá
klientov, certifikáty ISO — nič z toho v podkladoch nie je. Zoznam je zároveň grep
kontrola auditu (A3, A7).

---

## 3. Nová hierarchia (informačná architektúra)

Viacstránkový SPA (`react-router-dom` v7, GitHub Pages base `/demo-cestneprvky/`,
SPA fallback: build kopíruje `dist/index.html` → `dist/404.html`). Navigácia
**max 5 položiek**: Služby · Realizácie · O firme · Kontakt + CTA „Dohodnúť obhliadku
a cenu“ (otvára `ObhliadkaDialog`), telefón viditeľný ako `tel:` aj na mobile.

```
/                       Domov
/sluzby                 Prehľad 9 služieb v 3 celkoch (Debarierizácia a značenie · Prvky vo vozovke · Údržba a povrchy)
/sluzby/<slug>          9 stránok služieb (slugy: znacenie-pre-nevidiacich, vodorovne-dopravne-znacenie,
                        lepene-obrubniky, spomalovace-dopravy, zalievkove-a-vyspravkove-hmoty,
                        protismykovy-nater, cyklotrasy, stitky-braillovo-pismo, odstranenie-znacenia)
/realizacie             Galéria s filtrom podľa typu prvku a miesta, lightbox, pravdivé popisy
/o-firme                2012, Žilina, prístup (bez búracích prác, súlad s vyhláškami, materiály EU výrobcov),
                        partner ÚNSS, Aktuality (1 položka), CTA
/kontakt                NAP, tel:, mailto:, statická mapa (obrázok alebo odkaz, nie Google embed), ZadanieForm
*                       404 v štýle webu s odkazmi na služby
```

Zloženie **Domova** (konverzná doktrína PNH: dôvera → ponuka → dôkaz → proces → kontakt):
1. Hero na jednu obrazovku (`100svh`), video z klientových fotiek už existuje (`public/hero/`),
   jedna veta pre koho, dve CTA. Fixed priehľadný header → plný po 24 px, adaptívny nad svetlými pásmami.
2. Faktový pás bez vymyslených čísel: Od roku 2012 · Žilina, realizácie po celom Slovensku ·
   vyhlášky 532/2002 a 9/2009 · Konzultácie ÚNSS.
3. Prečo Cestné prvky: 3–4 vecné argumenty z textov služieb, bez 01/02/03.
4. Služby: 3 celky × služby, nosné tri väčšie; interakcia (existujúci `KruhovyObjazd` na desktope
   môžeš zachovať alebo nahradiť, ale rozhodnutie zdôvodni v logu; mobil = čistý zoznam/carousel).
5. Jeden „wow“ sticky‑scrub na stránku: Debarierizácia (exteriér/interiér prvky, terčíky)
   — jediný povolený scroll‑linked prvok, `useTransform` rozsah v [0,1] rastúci (E3).
6. Realizácie: výber 6–9 fotiek na tmavom pásme, link na /realizacie.
7. Ako prebieha spolupráca: obhliadka/dopyt → návrh a ponuka → realizácia → odovzdanie,
   vyjadrené spojnicou, nie číslovanými dlaždicami.
8. Kontakt (skrátený) + footer (NAP, služby, `noindex` ostáva).

Stránka služby (šablóna): hero s fotkou a názvom doslova, odsek(y) z originálu v hlase
klienta, zoznam podkategórií (chips/list), technická tabuľka a návod tam, kde existujú
(retardéry), 2–4 fotky realizácií tej služby, „Súvisiace služby“, CTA obhliadka.
Každá route: vlastný `<title>` ≤ 70, description ≤ 160, presne jeden H1, `lang="sk"`.

---

## 4. Vizuál a pohyb — štýl dema, dotiahnutý

- **Tokeny** `src/styles/tokens.css` ostávajú zdrojom pravdy (paleta klienta: akcent iba
  `#F03314`, hover `#C5250D`, ink `#26292C`, bg `#FFFFFF`/`#F4F5F6`, tmavé pásmo `#26292C`;
  modrá `#0E74BC` len v logu). 0 cudzích hexov. Archivo (display, max 600) + IBM Plex Sans
  + IBM Plex Mono len na technické mikro‑labely, tabuľky a vyhlášky.
- **Zarovnanie**: jeden kontajner (78rem) pre header, sekcie a footer; 12‑stĺpcový grid;
  ľavé hrany nadpisov, textov a fotiek v sekcii sedia na tom istom stĺpci. Audit to meria
  (`getBoundingClientRect().left` prvého potomka každej sekcie = ľavý okraj kontajnera ± 1 px).
- **Rytmus pásiem** v aktoch: biela → sivá → tmavá → biela…, nikdy dve tmavé za sebou,
  vertikálny rytmus z tokenov (`--section-padding-y`), žiadne `min-h-screen` na obsahových sekciách.
- **Vlasové rámy 1 px, `box-shadow` 0**, rádius 6–12 px, žiadne pilulky na kartách.
- **Prechody medzi routami**: fade + 12 px slide‑up 300 ms (`motion` `AnimatePresence`),
  scroll na vrch pri zmene route, fokus na `<main>`; pri `prefers-reduced-motion` okamžité.
- **Animácie v sekciách**: Reveal (fade + 16–24 px), Stagger 60–80 ms na kartách, hover =
  vlasový rám do akcentu + jemný posun šípky; SplitText len v H1 hero. Nič nebounce‑uje,
  nič nehijackuje scroll. Lenis ostáva (manuálny rAF), `scroll-behavior: auto`.
- **Fotky**: iba klientove (`public/assets`), ≤ 250 kB, `width/height`, `loading="lazy"` mimo LCP,
  alt po slovensky s miestom a prvkom. Logo v pôvodnom pomere, na tmavom podklade alfa verzia.
- Hero video pravidlá C5–C6 platia (len ≥ 1024 px, nie pri reduced‑motion / Save‑Data).

---

## 5. Organizácia práce — manažér a subagenti

Ty (hlavná session) si **Manažér**. Nepíšeš kód sekcií sám; zadávaš, kontroluješ, spájaš,
rozhoduješ. Subagentov spúšťaš cez `Agent` (`subagent_type: "general-purpose"`, pre
kontrolórov, ktorí potrebujú tvoj kontext, `"fork"`). Workeri bežia **paralelne len na
disjunktných súboroch**; každý dostane brief podľa šablóny v §5.3, cesty, ktorých sa
smie dotknúť, a definíciu hotového. Nikto okrem teba nerobí `git commit`.

### 5.1 Roly

| Agent | Úloha | Smie meniť | Výstup |
|---|---|---|---|
| **Architekt** (1×, kolo 0) | IA + obsahová mapa: každý riadok `OBSAH-ORIGINAL.md` → route/sekcia; slugy; dátový model `src/content/sluzby.js`, `realizacie.js`, `firma.js` | `src/content/*`, `poznamky/MAPA-OBSAHU.md` | mapa s pokrytím 100 %, zoznam `[DOPLNÍ KLIENT]` |
| **Copywriter** (1×, kolo 0, potom na vyžiadanie) | SK copy pre všetky routy v hlase klienta (slovesá, oslovenie), bez pomlčiek a slop slov, CTA = akcia + benefit | `src/content/*` (texty) | texty + vlastný grep report (A1, A2, A5) |
| **Staviteľ Layout** | Router, `Layout` (fixed adaptívny header, mobilné menu mimo `backdrop-filter`, footer), prechody routov, `Seo` per route, 404, SPA fallback v builde | `src/App.jsx`, `src/main.jsx`, `src/components/layout/*`, `vite.config.js`, `package.json` | build zelený, všetky routy 200 v preview |
| **Staviteľ Domov** | 8 sekcií Domova podľa §3 vrátane sticky‑scrub | `src/pages/Domov/*`, `src/sections/*` (refaktor) | hotová route + vlastné screenshoty 1440/390 |
| **Staviteľ Služby** | `/sluzby` + šablóna `/sluzby/:slug` (tabuľka DEBUZ, návod, podkategórie), súvisiace služby | `src/pages/Sluzby/*` | 10 routov, dáta z `content/sluzby.js` |
| **Staviteľ Realizácie + O firme + Kontakt** | galéria s filtrom a lightboxom, O firme, Kontakt s `ZadanieForm`, `ObhliadkaDialog` zasadený | `src/pages/Realizacie/*`, `src/pages/OFirme/*`, `src/pages/Kontakt/*` | 3 routy |
| **Audítor** (každé kolo) | rozšíri `poznamky/audit.mjs` na všetky routy (zoznam v `src/content/routes.js`), spustí ho, dodá `shots/v5-*` | `poznamky/audit.mjs`, `poznamky/shots/` | `audit-vN.json` + tabuľka ✅/❌ |
| **Vizuálny kritik** (každé kolo, `fork`) | pozrie screenshoty každej route 1440 + 390 (dlaždice), hodnotí rubriku §6.2, vracia nálezy s presnou súradnicou a súborom | nič (read‑only) | `poznamky/REVIEW-koloN.md` |
| **Obsahový kontrolór** (kolo 1 a záverečné) | krížová kontrola `MAPA-OBSAHU.md` vs. vyrenderované DOM texty (Playwright `innerText` každej route); nič nechýba, nič nepribudlo | nič (read‑only) | pokrytie % + zoznam chýbajúcich riadkov |

### 5.2 Kolo 0 (príprava, sekvenčne)
1. Manažér: `git status` čistý, `npm run build` zelený, screenshoty baseline `--tag v5-baseline`.
2. Architekt → skontroluj mapu (každý riadok inventára má cieľ; služby 5–9 majú placeholdery, nie vymyslený obsah).
3. Copywriter → spusti grep batériu (`—`, `–` mimo doslovných názvov DEBUZ/KT, slop slová, čechizmy). 0 nálezov, inak vráť.
4. Až potom kolo 1.

### 5.3 Šablóna briefu pre workera (skopíruj a vyplň)
```
ROLA: <názov> · PROJEKT: ~/Desktop/pnh_media/cestne_prvky (Vite + React 19 + Tailwind v4 + motion + Lenis)
PREČÍTAJ NAJPRV: poznamky/STANDARDY.md (celé), poznamky/MAPA-OBSAHU.md, src/styles/tokens.css, <existujúce komponenty, ktoré má použiť>
ÚLOHA: <konkrétne, s odkazom na §3/§4 tohto promptu>
SMIEŠ MENIŤ IBA: <cesty>   NESMIEŠ: chassis/ui komponenty, tokens.css, cudzie stránky, git commit
PRAVIDLÁ, KTORÉ SA TU NAJČASTEJŠIE PORUŠUJÚ: box-shadow, pomlčky v copy, vymyslené čísla, 01/02/03, 100vh, fixed vnútri backdrop-filter,
  useTransform mimo [0,1], min-w na tabuľke bez sm:, absolútne dekorácie bez hidden sm:block, inputs < 16px, tap < 44px, cudzí hex
DEFINÍCIA HOTOVÉHO: npm run build zelený · 0 pageerror v Playwright · scrollWidth 390 = 390 · screenshoty 1440 + 390 v poznamky/shots/v5-<rola>-*.jpeg
  · odovzdaj zoznam zmenených súborov + čo si nevedel splniť a prečo (nič netaj)
```

### 5.4 Pravidlá manažéra
- Po každom workerovi: `npm run build` + rýchly Playwright smoke (pageerror = 0, route 200) **skôr,** než pustíš ďalšieho na tie isté súbory.
- Konflikty riešiš ty (jeden worker na súbor v jednom čase).
- Sporné rozhodnutie o faktoch alebo štruktúre = zapíš do `HANDOVER.md`, neblokuj sa.
- Max 3 opravy na jeden fix‑task (G2); menšie, overiteľné kroky.
- Každé kolo končí `git commit` s tagom `v5-koloN` v správe a riadkom v `QUALITY-LOG.md`.

---

## 6. Loop kontroly kvality — kedy je to „perfektné“

### 6.1 Priebeh jedného kola (N = 1, 2, …, max 8)
1. **Stav** — Manažér: build, smoke, screenshoty všetkých routov `--tag v5-koloN` (1440, 390, 768 pre tabuľky/galériu).
2. **Audit** — Audítor spustí `node poznamky/audit.mjs --routes all --shots poznamky/shots --tag v5-koloN`.
   Audit pokrýva STANDARDY A–G + nové kontroly: každá route (title/description/1×H1/alt), zarovnanie na kontajner,
   prechod routov bez layout shiftu (CLS 0), SPA fallback (`dist/404.html` existuje a rovná sa index), obsahové pokrytie (Obsahový kontrolór),
   grep zakázaného obsahu §2.4, kontrast reálne použitých dvojíc, tap targety, overflow na 390 a 768, reduced‑motion vetva, video pravidlá.
3. **Vizuálny kritik** hodnotí rubriku §6.2 na každej route a vracia nálezy: `route · viewport · y‑pásmo · čo je zle · ako to zmerať po oprave`.
4. **Manažér** triáž: blocker (audit ❌, chýbajúce dáta, chyba renderu) → fix ihneď; vkus (rubrika < 9) → fix‑task workerovi vlastníkovi tej route; kozmetika → batch.
5. Fix‑tasky paralelne na disjunktných súboroch → smoke → späť na krok 1.
6. **Desktop is sacred**: každý mobilný fix prejde pixel‑diffom pásma na 1440 pred/po (PIL), rozdiel len tam, kde bol zámer.

### 6.2 Rubrika Vizuálneho kritika (0–10 na každú route, každý bod)
1. Hierarchia: oko vie, kam ísť, na každom viewporte jeden dominantný prvok.
2. Zarovnanie a rytmus: hrany na gride, medzery z tokenov, žiadne „visiace“ prvky (perex vedľa H2 vo vzduchu = známa chyba).
3. Typografia: max 2 rodiny + mono, rezy ≤ 600, riadky 45–75 znakov, H1 3–4 riadky na 1440.
4. Farba: červená ≤ 5 % plochy, vedie oko na CTA; kontrast overený.
5. Fotky: reálne, ostré, pravdivé popisy, orez neodrezáva podstatu (terčíky, čiary).
6. Pohyb: plynulý, cieľavedomý, jeden wow, nič nepoškubáva, reduced‑motion čistý.
7. Copy: hlas klienta, konkrétne, CTA akcia + benefit, žiadny slop.
8. Mobil 390: čitateľné, 44 px, bez overflow, tabuľky a galéria použiteľné.
9. Dôvera B2B: fakty, vyhlášky, partner ÚNSS, proces — viditeľné do 2 obrazoviek.
10. „Popici efekt“: pôsobí to draho, nie ako šablóna; kritik napíše jednu vetu, čo by Peter vytkol ako prvé.

### 6.3 Výstupná podmienka (všetko naraz, **dve kolá po sebe**)
- audit 100 % ✅ (0 ❌, 0 preskočených), 0 `pageerror`, build zelený;
- obsahové pokrytie 100 % inventára, 0 zakázaných reťazcov, `[DOPLNÍ KLIENT]` len tam, kde dáta objektívne chýbajú (zoznam v HANDOVER);
- rubrika: každý bod ≥ 9 na každej route, priemer ≥ 9,5; kritik má 0 otvorených nálezov typu blocker/vkus;
- 390 aj 768 bez overflow na všetkých routách; 1440 pixel‑stabilný medzi dvoma poslednými kolami mimo zámerných zmien;
- Lighthouse (lokálne `npx lighthouse` na preview, mobile): Performance ≥ 85, A11y ≥ 95, Best practices ≥ 95, CLS 0; SEO je limitované `noindex` (zdokumentuj).
Ak po 8 kolách nie je splnené, zastav a napíš, ktoré body chýbajú a prečo (žiadne „skoro“).

---

## 7. Technické zásady (pre workerov, vynucuje audit)

- Stack a nástroje ostávajú: Vite, React 19, Tailwind v4 cez `@theme`/tokens, `motion`, Lenis, radix `ui/*`, `lucide-react`. Pridaj len `react-router-dom`.
- Nič v `src/components/ui/*` (chassis) sa nemení; stránky žijú v `src/pages/*`, zdieľané sekcie v `src/sections/*`, dáta v `src/content/*`.
- `Reveal` rezervuje miesto (žiadny scroll jump), IntersectionObserver aktívne stavy vo vlastnom `Set`, scroll‑spy len tam, kde treba.
- Fixed header nikdy s potomkom `position: fixed` vnútri `backdrop-filter`; mobilné menu je súrodenec headera.
- Formulár: endpoint `VITE_FORM_ENDPOINT`, bez neho demo režim s poznámkou; inputy ≥ 16 px; tlačidlo nikdy „Odoslať“.
- Galéria: lightbox s klávesnicou (Esc, šípky), fokus späť, `aria-label`; obrázky s `srcset` 800/1400.
- Tabuľka DEBUZ na mobile: 3 stĺpce sa zmestia bez horizontálneho scrollu (`min-w-0 sm:min-w-[30rem]`).
- Build kopíruje `index.html` → `404.html`; `.env` `DEMOGEN_BASE=/demo-cestneprvky/` ostáva (slug repa).
- Žiadne PNH stopy okrem `DemoBadge`; `noindex` ostáva.

---

## 8. Dokumentácia a odovzdanie

Po každom kole: riadok v `poznamky/QUALITY-LOG.md` (dátum · kolo · nálezy · opravy · dôkaz · audit x/y · rubrika).
Na konci:
1. `poznamky/HANDOVER.md`: čo klient doplní (mená európskych partnerov, plné názvy miest MT/TN/BB, roky realizácií, texty služieb 5–9, logo v SVG, form endpoint, telo článku o ostrovčekoch), otvorené rozhodnutia.
2. `README.md` projektu: štruktúra routov, dátové súbory, ako spustiť audit.
3. `git commit` finálneho stavu; **push na `origin main` až po splnení §6.3** — deploy beží cez Actions na
   https://devpnh.github.io/demo-cestneprvky/ ; over 200 a Actions zelené (G4). Ak Peter nechce push, tento bod vymaže.
4. Session note `~/Desktop/Vaults/claude_conversations/Sessions/2026-MM-DD — cestne_prvky v5 prerábka.md`
   (problém / prístup / výsledok / čo sa kazilo) + riadok v `~/Desktop/Vaults/work/context/KONVERZACIE.md`.
5. Ak sa objavilo nové pravidlo, ktoré STANDARDY neobsahovali, pridaj bod s pôvodom do `STANDARDY.md`.

---

## 9. Zakázané skratky (aby loop nebol divadlo)

- Nevyhlasuj kolo za zelené bez behu auditu a bez toho, aby si sa pozrel na screenshoty (kritik ich naozaj otvorí cez Read).
- Nefixuj audit tak, aby prešiel (žiadne zmäkčovanie kontrol bez zdôvodnenia v logu).
- Neschovávaj neúspech: čo worker nesplnil, ide do logu a do ďalšieho kola.
- Neodstraňuj dáta klienta, aby sa „ľahšie zarovnali“; obsah má prednosť pred kompozíciou, kompozícia sa prispôsobí.
- Nezavádzaj nové farby, fonty ani tiene „na oživenie“. Oživenie je pohyb, fotky a rytmus, nie dekor.
