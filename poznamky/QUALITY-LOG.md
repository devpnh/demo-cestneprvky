# QUALITY LOG — demo-cestneprvky

## 2026-08-23 · beh v1 (job 4daa0bdb) · $7.54 · parse 34 s · scrape 50 s · understand 3 min · direction 4,6 min · generate ~13 min · review 7 min (3 iterácie)

**Zásahy operátora pred GENERATE:** steering.md (zakázané MaisonCo zdroje, žiadne vymyslené údaje); facts.json: odstránené /about-us/ a /our-services/ (MaisonCo), doplnený NAP (ulica/PSČ/mesto chýbali), 9 služieb, 3 reálne stránky služieb, vyhlášky, miesta realizácií z názvov fotiek; structure.json: vyhodené gridtile/transparent (Slider Revolution), pridané logo 90-logo-cestne-prvky.png. Gate DIRECTION schválený s 5 korekciami (reuse SaaS kostier zrušené, logo, názvy miest, trust line, nav ≤ 5). Hero variant 1 (biely split, terčíky).

### Iterácia 1
- **Nález A (blocker):** stránka sa nevykreslila, `<body>` 0 znakov. `useFaza()` v Debarierizacia.jsx dávalo `useTransform` rozsah -0.001 / 1.001; motion viaže scroll-linked hodnotu na WAAPI so ScrollTimeline a rozsah berie ako offsety → `Offsets must be in [0,1]` → celý React strom spadol. REVIEW to 3× videl ako „prázdne screenshoty“, neopravil.
  **Oprava:** rozsah clampnutý na prísne rastúci v [0,1]. **Overenie:** Playwright pageerror = 0, bodyTextLength 6829 (1440) / 6810 po úprave H1.
- **Nález B:** H1 `font-bold` (700) a 5 riadkov pri 84 px. **Oprava:** `font-semibold`, copy „Bezbariérové prvky a dopravné značenie“. **Overenie:** getComputedStyle h1 = Archivo 84px/600, 4 riadky; weights na stránke {400,500,600}.
- **Nález C:** `<title>` s em-dashom, meta description 199 znakov. **Oprava:** „Cestné prvky s.r.o. · dopravné značenie a debarierizácia, Žilina“ (64), description 154 znakov.
- Screenshoty: `iter1-1440.jpeg`, `iter1-390.jpeg` (pred), `iter1b-*.jpeg` (po).

### Iterácia 2
- **Nález D (mobil):** karta „Vodiaca línia · Bratislava“ prekrývala štítok Kaltplastik na hero fotke pri 390 px. **Oprava:** štítok na mobile vpravo hore (`right-3 top-3 sm:right-auto`), od 640 px nezmenené. **Overenie:** PIL diff 1440 px hero pred/po = žiadny rozdiel (desktop is sacred), `iter2-390.jpeg` bez prekryvu.
- Grep batéria po iterácii: pomlčky 0 (mimo doslovných `DEBUZ® – Kölner Teller`, `Typ KT – 50`), slop 0, MaisonCo 0, cudzie hexy 0, bold 0, shadow v sekciách 0 (1 = DemoBadge chassis), čeština 0, janko 0, tel: 3×, `[DOPLNIŤ]` 3× v Realizácie (kódy MT/PD/TN bez plného názvu, zámerne).
- scrollWidth 390 = 390 (bez overflow), hero fotka 615 px z 1440 (43 % + karta 246 px = kompozícia > 45 %).

### Zostáva
- **PUBLISH:** repo `devpnh/demo-cestneprvky` vytvorené a pushnuté, Pages zlyhali (HTTP 422, privátny repo na free pláne). `.env` prepnutý na `GITHUB_REPO_PRIVATE=false`; zmena viditeľnosti repa je blokovaná permission classifierom → Peter: `gh repo edit devpnh/demo-cestneprvky --visibility public --accept-visibility-change-consequences`, potom `POST /api/jobs/<id>/publish`.
- Lighthouse na živej URL (až po publishi).
- Proof strip na 390 px: oddeľovače `·` začínajú riadok (kozmetika).
- CHECK slop: 3 sekcie s mriežkou 3 stĺpcov (Služby, Realizácie, Kontakt) — zámerné, sledovať.
- Bez kontaktného formulára (CTA = mailto/tel); zvážiť krátky formulár pri handoveri.

### Iterácia 3 (2026-08-23, zadanie Petra: full-screen hero s videom / priehľadným efektom, loop podľa vaultu)
- **Vault sweep:** 18 session notes + `me/06` → `STANDARDY.md` (7 okruhov, 45 bodov s pôvodom). Mechanické body kóduje `audit.mjs` (29 kontrol: grep + Playwright 1440/390/reduced-motion + pixelový kontrast nad hero).
- **Hero prerobený:** `min-h-[100svh]`, pozadie = `hero/hero.mp4` (14,4 s slučka z 3 fotiek klienta: Zubačka, Tornaľa, varovný pás; Ken Burns + prelínačky, posledný záber zoomuje späť = neviditeľný loop point; 2,6 MB, len ≥ 1024 px bez reduced-motion/Save-Data) + poster 210 kB ako LCP `fetchpriority=high`, dvojitý scrim (zdola + zľava), hlavička `fixed` priehľadná → biela po 24 px, sklená karta s popiskom záberu synchronizovaným s časom videa (typ prvku + miesto, 3 ticky), scroll cue, mobilné menu (44 px tlačidlo, overlay). Logo s alfou (`91-logo-cestne-prvky-alpha.png`) namiesto bielej dosky.
- **Nálezy auditu a opravy:** (1) `scroll-behavior: smooth` v tokens.css → `auto` (Lenis); (2) biela na #F03314 = **4,05:1** (predtým som počítal zle), primárne CTA → 19 px/600 = veľký text (limit 3:1), header CTA → biela/tmavá podľa stavu; eyebrow na tmavých pásmach → biela 72 % + akcentová čiarka (bolo 3,61:1); (3) `13-Medeny_Hamor_1` 915 kB → 234 kB; (4) logo link 40 → 44 px; (5) mobilné menu v hlavičke s `backdrop-filter` malo výšku 0 (fixed potomok filtrovaného predka) → presunuté mimo header.
- **Overenie:** audit 29/29 ✅ (chyby 0, hero 900/900 a 844/844, video hrá muted/loop/inline na 1440, žiadne na 390 ani pri reduced-motion, scrollWidth OK, tap targety OK, kontrast min 4,05:1 pri veľkom texte). Screenshoty `iter3-*.jpeg`.
- **Zostáva:** publish (viditeľnosť repa), Lighthouse na živej URL, vizuálna kontrola vkusu každú iteráciu (audit nevidí kompozíciu).

### Iterácia 4 (2026-08-23, loop beh 1)
- Audit na vstupe 29/29 ✅. Vizuálna kontrola (1440 dlaždice + 390 prehľad): **(1)** sticky Debarierizácia prichádzala zdola s prázdnym tmavým boxom (prvý záber mal pri progress 0 opacity 0) → prvý záber štartuje viditeľný, posledný ostáva pri odchode; **(2)** logo vo footeri na bielej doske (pôvodný PNG) → alfa verzia bez dosky; **(3)** audit F1a videl len literálne `assets/…` cesty, galéria skladá cestu z poľa → 7 fotiek 278–915 kB unikalo kontrole → audit rozšírený, fotky prekomprimované z originálov (1600 px, q62–80; Zubačka a Tornaľa 1400 px q70 namiesto nižšej kvality, STANDARDY F2) → všetky ≤ 245 kB.
- Overené: galéria na 390 px načíta a zobrazí všetkých 9 fotiek (prázdne miesto vo full-page screenshote = lazy-load počas sweepu, nie chyba). Audit po opravách 29/29 ✅ (`iter4-*.jpeg`).
- Publish stále blokovaný (viditeľnosť repa) — len poznámka, nič sa nepokúšalo.

### Iterácia 5 (2026-08-23, loop beh 2)
- Audit na vstupe 29/29 ✅ (druhýkrát po sebe). Vizuálna kontrola Technológie/Realizácie/footer/mobil: **(1)** tabuľka DEBUZ mala `min-w-[30rem]` v `overflow-x-auto` → na 390 px bol stĺpec KT-35 odscrollovaný mimo obraz (strata parametrov) → `min-w-0 sm:min-w-[30rem]`, 3 stĺpce sa zmestia; **(2)** popisok galérie „Štítky – Braillovo…“ s pomlčkou, inde dvojbodka → zjednotené; **(3)** produktová fotka Braillových štítkov mala `[DOPLNIŤ]` ako miesto → „Produktová fotografia“, riadok miesta sa renderuje len ak existuje.
- Overené: audit 29/29 ✅; rozdielové pásma desktopu iba hero (video snímka) a zmenený riadok popisku (7840–7906 px), tabuľka na desktope pixel-identická; mobil ukazuje KT-50 aj KT-35 (`iter5-*.jpeg`).
- Publish naďalej blokovaný viditeľnosťou repa — bez pokusu.

### Iterácia 6 (2026-08-23, loop beh 3) — ZASTAVENÉ, §6 splnené v rozsahu, ktorý nezávisí od Petra
- Audit 29/29 ✅ (tretíkrát po sebe: iter5b, iter6). Vizuálna kontrola celej stránky na 1440 (3-stĺpcový prehľad) aj 390 (4-stĺpcový prehľad): žiadny nález. Rytmus: tmavé video hero → biely proof strip → služby → tmavé sticky pásmo → svetlý technický list → galéria → svetlé O nás → tmavý kontakt + footer.
- Stav §6: ✅ copy (pomlčky/slop/Odoslať/01-02-03/MaisonCo/čeština), ✅ fakty doslova, ✅ 0 box-shadow / cudzie hexy / rezy ≥ 700, ✅ kontrast (hero pixelovo, zvyšok computed), ✅ hero = 1 obrazovka s videom (2,6 MB, len desktop, poster LCP), ✅ 0 overflow, tap targety, `tel:` nad foldom, ✅ build zelený, ✅ screenshoty 1440 + 390 (`iter6-*.jpeg`), ✅ dve po sebe idúce iterácie bez nálezu auditu + vizuál bez nálezu.
- ⛔ Nesplniteľné odtiaľto: publish, zelené Actions, živá URL 200, Lighthouse na produkcii — repo `devpnh/demo-cestneprvky` je privátne a Pages na free pláne vyžadujú public; zmena viditeľnosti aj re-publish sú blokované permission classifierom. Peter: `gh repo edit devpnh/demo-cestneprvky --visibility public --accept-visibility-change-consequences`, potom Publish na karte dema (server na 3117 beží) → Actions → Lighthouse → prípadne ešte 1 iterácia loopu podľa výsledkov.
- Handover: `[DOPLNIŤ]` pri 2 fotkách (cyklotrasa, zálievkové hmoty) — miesto dodá klient; nepoužité fotky v `site/public/assets/` (37 súborov, použitých 19) sa dajú pred odovzdaním vymazať; bez kontaktného formulára (CTA = mailto/tel).

### 2026-08-24 — spätná väzba Petra k v1 (demo zatiaľ nepublikované, hodnotené lokálne)
H1 priveľké · logo primalé · Služby nudné (len text) · chýba scroll efekt · chýbajú odkazy v nav (O nás) · niektoré sekcie syntetické. Dobré a nedotknuteľné: Debarierizácia, Realizácie, Kontakt, footer (gradient + veľkosť). → Pripravený vykonávací prompt `PROMPT-v2-uprava.md` (6 úloh, baseline pixel-diff nedotknuteľných pásiem, audit sa rozšíri na 33 kontrol). Čaká na spustenie.

## 2026-08-24 · v2 úpravy podľa spätnej väzby (PROMPT-v2-uprava.md) — vykonané
- **v2-baseline:** audit 29/29, full-page 1440 + 390, y-pásma nedotknuteľných sekcií zapísané.
- **v2-1:** H1 `--text-6xl`→`--text-5xl` (84→68 px, 4→2 riadky na 1440, 3 na 390), `max-w-[18ch]`; logo v headeri 40→48 px (strop 56 px, natívny zdroj len 145×86 — do handoveru: vypýtať väčšie logo/SVG); nav +`O nás` (6 anchorov) + scrollspy cez pozičnú matematiku (nie IO, D6), aktívna položka accent border aj v mobilnom menu.
- **v2-2:** scroll efekty — 2 px accent progress vlások pod headerom (`scaleX = scrollYProgress`), hero pozadie scale 1→1,06 pri odscrollovaní (obsah a scrim statické), `Parallax speed 0.12` na 2 fotkách v Technológiách (v overflow-hidden boxe so scale-110, žiadne odkryté okraje). Všetko vypnuté pri reduced-motion; rozsahy [0,1]. Audit rozšírený na **33 kontrol** (H1v2, LOGOv2, NAVv2, SCRLv2). Nález cestou: pomlčka v mojom komentári (audit ju chytil) — opravené.
- **v2-3:** Služby prerobené z 3×3 textovej mriežky na **explorer**: vľavo 9 riadkov v 3 skupinách (vlasové deliče, aktívny riadok = 2 px accent šev + ink text, hover prebíja scroll), vpravo sticky fotka aktívnej služby (crossfade 400 ms, pri reduced-motion okamžite) s mono popiskom miesta a počítadlom `n / 9`. Fotky = dlaždice služieb z pôvodného webu (9 reálnych fotiek, mapa v PROMPT-v2 §3.5). Mobil: riadky so 72 px náhľadmi, bez sticky. Neznáme miesta = „Vlastná realizácia“ (nie [DOPLNIŤ] — to ostáva len v galérii Realizácie).
- **v2-4:** de-syntetizácia Technológií — pás 3 reálnych parametrov pod nadpisom (100 % po 30 min · 35/50 mm DEBUZ · rozpúšťadlá: žiadne; všetko z textov klienta), mono popisky pod oboma fotkami (typ + miesto kde isté).
- **Overenie:** audit 33/33 ✅ dvakrát po sebe (v2-iter4, v2-final); pixel-diff pásiem Debarierizácia/Realizácie/Kontakt+footer voči baseline: výšky identické (±1 px), rozdiely len artefakty kamery (posun sticky pinu, snímka GradientMeshu, JPEG šum na fotografiách) — obsahovo bez zmeny, overené vizuálne na výrezoch. Scrollspy: pri #technologie svieti práve jedna položka; progress scaleX 0,502 pri 50 % dráhy; explorer prepína fotku podľa scrollu (3/9 → 6/9 → 9/9), 0 runtime chýb. Screenshoty `v2-final-*.jpeg`.
- Publish naďalej blokovaný viditeľnosťou repa — bez pokusu.

### 2026-08-24 · dve rýchle úpravy na pokyn Petra
- **Trust line v hero** („Od roku 2012 · Žilina…“): mono/uppercase font odstránený → telový IBM Plex Sans, normálny rez, 14 px, biela 82 %. Vlások aj obsah ostali.
- **Sekcia „Parametre, ktoré si viete overiť v zadaní“ (Technológie a materiály) odstránená celá** na pokyn: odpojená zo `sections/index.js`, súbor archivovaný v `poznamky/removed/TechnologieAMaterialy.jsx` (obnoviteľné), „Technológie“ vyhodené z navigácie (5 anchorov) aj z mobilného menu. Audit upravený (NAVv2: 5 anchorov bez #technologie, scrollspy testovaný na #realizacie).
- Overenie: build zelený, audit **33/33 ✅**, rytmus pásiem uvod → sluzby → debarierizacia → realizacie → o-nas → kontakt (žiadne dve tmavé za sebou), šev tmavé sticky pásmo → biela galéria čistý, screenshoty `v2-notech-*.jpeg` v shots/. DEBUZ parametre a ColdPlastic texty už na stránke nie sú — vedomé rozhodnutie Petra (obsah ostáva v archíve a na podstránkach pôvodného webu).
- **2026-08-24 (dodatok):** trust line „Od roku 2012 · Žilina…“ z hero odstránený úplne (celý StaggerItem). Obsah sa posunul nižšie k spodku obrazovky, fotke ostáva viac priestoru. Build zelený, audit 33/33 ✅, screenshoty `v2-notrust-*.jpeg`. Fakty „od roku 2012“ a vyhláška ostávajú v sekcii O nás a Debarierizácia.
- **2026-08-24 (dodatok 2):** Realizácie na pokyn zobrazujú **6 z 9** fotiek + centrované tlačidlo „Zobraziť všetky realizácie (9)“ (52 px, vlasový rám, hover akcent). Klik odkryje zvyšné 3 a tlačidlo zmizne; skryté fotky sa do kliku nenačítavajú. Overené Playwrightom (6 → 9, loaded 9, 0 chýb), audit 33/33 ✅, screenshoty `v2-gal6-*.jpeg` + `gal-btn.jpeg`.

### 2026-08-24 · v3: O nás prerobené + Služby ako typografický katalóg
- **O nás:** namiesto formulárového ‹dl› zoznamu editorial kompozícia — H2, veľký display statement („V oblasti dopravných stavieb používame vlastné technológie a spolupracujeme s významnými európskymi spoločnosťami.“), krátke telo s faktami, **nová fotka `26-TN_1`** (červená vodiaca línia bežiaca do diaľky, portrét 3:4, 232 kB, popisok „Vlastná realizácia · vodiaca línia“) a plnoformátový spec-strip 4 stĺpcov (Sídlo · Založené · Odbor · Predpisy) s tmavými vláskami. Žiadne nové čísla.
- **Služby v3 („katalóg prvkov“):** tituly služieb zväčšené na display `--text-3xl`, neaktívne muted, aktívny plný atrament + 6 px posun + akcentový šev; popisy sa na desktope presunuli do sticky panela (riadky bez layout shiftu → žiadny scroll jump, D5). Panel: fotka s crossfade + scale-settle (1,04 → 1, ease-house), akcentový progress podľa polohy v katalógu, skupina + popis s jemným fade (motion, key=active), miesto + počítadlo n/9. Riadky sú `<button>` (hover, focus aj klávesnica). Mobil: náhľad 72 px + titul + popis ako doteraz. Vzor: WDCWC „Work index“ / Edstrex ProcessTimeline — veľká typografia namiesto boxov, žiadne čísla, žiadne tiene.
- Overenie: build zelený, audit **33/33 ✅** (v3-catalog), scroll prepína fotky (5/9 v strede, 9/9 na konci), 0 runtime chýb, mobil bez overflow (390). Screenshoty `v3-catalog-*.jpeg` v shots/ + `cat-top/cat-mid/onas-new/cat-m/onas-m.jpeg`.
- **2026-08-24 (kontrola textov na pokyn):** inventár 115 unikátnych textov zo sekcií + global.json vs. korpus klienta. Pomlčky v našej copy: 0 (jediné sú doslovné názvy DEBUZ® – Kölner Teller / Typ KT – 50). Nové texty odo mňa/generátora sú buď fakty (v Žiline, 9 služieb v 3 celkoch), CTA podľa doktríny, alebo popisy odvodené z názvov súborov a stránok služieb — bez nových čísel, miest a tvrdení. **1 oprava:** popisok fotky v O nás tvrdil „vodiaca línia“, čo sa z názvu súboru TN_1 nedá doložiť → „Vlastná realizácia · značenie pre nevidiacich“ (fotka je zo stránky značenia pre nevidiacich; aj alt text zovšeobecnený). Audit 33/33 ✅.
- **2026-08-24 (dedup):** duplicitné údaje odstránené na strane O nás (Kontakt + footer nedotknuté): spec-strip Sídlo/Založené/Odbor/Predpisy zrušený (adresa bola 3× na stránke, vyhlášky 2×, „2012“ 3× v jednej sekcii), telo zjednodušené na „Firma Cestné prvky s.r.o. zo Žiliny pracuje pre mestá, župy, správcov ciest a stavebné firmy.“ Výskyty teraz: adresa len Kontakt+footer, vyhlášky len Debarierizácia, 2012 len v H2 O nás, telefón header+Kontakt+footer (zámer — konverzná doktrína). Audit 33/33 ✅, screenshoty `v3-dedup-*.jpeg`.
- **2026-08-24 (proof strip):** pás „Čo realizujeme“ so zoznamom 9 služieb pod hero odstránený úplne — bol to 1:1 duplikát katalógu Služieb hneď pod ním (rovnaká logika ako dedup v O nás). Hero teraz tečie priamo do sekcie Služby. Build zelený, audit 33/33 ✅, stránka 8 140 px (z pôvodných 10 400), screenshoty `v3-nostrip-*.jpeg`.

### 2026-08-24 · v4: Služby ako „kruhový objazd prvkov“ (na pokyn, inšpirácia radial-orbital-timeline)
- **Zapamätané:** katalógová verzia archivovaná v `removed/Sluzby-v3-typograficky-katalog.jsx` + memory `demo-cestneprvky-sluzby-versions` (návrat = kopía späť + build).
- **Nová prezentácia (len desktop ≥ lg):** orbitálna mechanika z inšpirácie preložená do domény — **kruhový objazd**: SVG vozovka (asfaltový prstenec `surface-2` 52 px, vlasové krajnice, biela prerušovaná stredová čiara), po nej obieha 9 kruhových fotiek služieb (CSS spin 80 s + protismerná kompenzácia, aby fotky stáli vzpriamene), v strede biely ostrovček s logom. Kurzor nad objazdom = pauza; hover/focus uzla = výber; klik = zamknutie (aria-pressed); auto-postup aktívnej služby á 4 s, kým nič nie je zamknuté. Aktívny uzol: akcentový prstenec + zväčšenie + mono štítok s názvom. Vľavo detail: fotka (crossfade + settle), akcentový progress, skupina, názov, popis, miesto + `n / 9`. Žiadne shadcn/karty/fialové gradienty/tiene z inšpirácie — len paleta a vlásky dema.
- **Mobil:** zoznam s náhľadmi bez zmeny (objazd sa na 390 px nezmestí zmysluplne).
- **Overenie:** build zelený, audit **33/33 ✅**; Playwright: 9 uzlov, spin running → pauza pri kurzore → klik zamkne (panel aj štítok ukazujú Cyklotrasy), auto-postup potvrdený (titulok sa zmenil po 4 s), reduced-motion = 0 animovaných prvkov; 0 runtime chýb. Pozn.: Playwright `hover()` na obiehajúcom uzle timeoutuje na „element is not stable“ — testovať cez `mouse.move` na aktuálne súradnice (zapísané aj do testu). Screenshoty `v4-orbit-*.jpeg`, `orbit-1/2.jpeg`.
- **2026-08-24 (zarovnanie objazdu):** sekcia lietala — detail vľavo menil výšku podľa dĺžky textov a grid bol `items-center`, takže sa prepočítavala aj poloha kruhu. Len alignment: grid `items-start`, titul `min-h-[62px]` bez `max-w` (najdlhší názov = presne 2 riadky), popis `min-h-[78px]` (3 riadky), fade bez y-posunu. Merané cez 4 auto-postupy: kruh 1311 px konštantne, spodný riadok (miesto + n/9) 1848 px konštantne. Audit 33/33 ✅, screenshoty `v4-align-*.jpeg`.
- **2026-08-24 (hub fix, /frontend-design):** Peter: koleso sa pri hoveri zastaví, ale fotka naskočí „úplne inde“ (vľavo) — interakcia a odozva odpojené. Oprava: **fotka aktívnej služby sa zobrazuje v strede objazdu** (kruhový ostrovček 316 px s crossfade + settle), presne v mieste pozornosti; ľavý stĺpec je už len textový detail (progress, skupina, názov, popis, miesto, n/9) so zarovnaním na stred kolesa; plávajúci štítok pri uzle zrušený (meno je vľavo, fotka v strede — koleso je tichšie); logo zo stredu von (je v headeri aj footri). Stabilita meraná cez 4 auto-postupy: kruh 1311 px, spodný riadok 1706 px konštantne. Hover test: uzol „Spomaľovače“ → hub okamžite ukazuje 03-MT_1, titulok sedí, 0 chýb. Audit 33/33 ✅, screenshoty `v4-hub-*.jpeg`, `orbit3-*.jpeg`.

## 2026-08-24 · v4: popup + Služby + mobil (PROMPT-v4-popup-sluzby-mobil.md) — vykonané, s dvomi živými pivotmi Petra
**Poradie C → B → A podľa promptu; PROMPT-v3 nebežal → `ZadanieForm` vznikol tu (v3 §2.3 ho už len osadí).**

### C — mobilná responzivita (kritické)
- Potvrdený dôkaz z promptu: `StickySection` 220vh pin s `overflow: hidden` orezával na 390/768 obsah Debarierizácie (H2 nebolo vidieť vôbec, chips a progress tiež; track 1856–2253 px).
- Oprava: `matchMedia('(min-width: 1024px)')` prepínač v Debarierizacia.jsx — pod 1024 px tečúca sekcia (eyebrow, H2, odseky, citát, ÚNSS, statická prvá fotka, chips ako wrap zoznam, bez progressu), desktop strom sa na mobile vôbec nemontuje (E3). Na 1024+ StickySection bez zmeny.
- Sweep 390 + 768 celej stránky: H2 Debarierizácie plne viditeľné (390: top 209/bottom 359; 768: 209/322), výška sekcie = výška obsahu (1248/1248 na 390), scrollWidth 390/768 čisté, 0 malých tap targetov, 0 chýb. Ďalšie orezané/pretečené prvky sweep nenašiel.

### B — Služby: obdĺžnik s overlay (medzistav, neskôr prepísané pivotom)
- Podľa promptu: objazd von, `aspect-[3/2]` fotka so scrimom (kontrast popisku pixelovo 8,9–11,8:1), pás 9 miniatúr 66×44 s akcentovým švom, ľavý blok bez riadku miesto/n:9 (presunuté na fotku). Orbit CSS zmazané. Overené Playwrightom.

### A — popup „Dohodnúť obhliadku“
- `src/lib/obhliadka.js` (CustomEvent most), `src/components/ZadanieForm.jsx` (select 9 služieb + Iné, miesto, rozsah, e-mail/telefón povinné, endpoint `VITE_FORM_ENDPOINT` — Formspark konvencia; bez neho demo režim so success panelom „Ďakujeme, ozveme sa s termínom obhliadky.“ + poznámka), `src/components/ObhliadkaDialog.jsx` (Radix, scrim `surface-2`/60 % bez blur, žiadny tieň, < 640 px celoobrazovkový sheet 100dvh, fokus sa vracia na otvárajúce CTA, Lenis stop()/start() cez `window.__lenis`).
- Zapojených 5 CTA: header, hero, mobilné menu (najprv sa zavrie), Kontakt sekcia (mailto CTA → popup; mailto/tel na kontaktoch ostali), Služby s predvyplneným typom prvku. Submit CTA je „Poslať zadanie“ (prompt žiadal „Odoslať zadanie“, ale „Odoslať“ je na tvrdom blackliste štandardov — vedomá odchýlka, konzistentná s H3 „Pošlite zadanie…“).
- Bug pri zapájaní: replace vetva pre Kontakt CTA nič nenahradila — chytené Playwright testom, opravené. Bonus nález: footer navigácia mala mŕtvu kotvu `#technologie` — odstránená (vedomý jednoriadkový zásah do inak nedotknuteľného footera).

### Pivoty Petra počas behu
1. „dúfam, že tam ten okrúhly element pridáš“ → medzikrok: mini kruhový objazd (dial 220 px, mačacie oká) v ľavom stĺpci k obdĺžniku.
2. „prerob tú sekciu s tým kruhom tak, aby fungovala normálne a projekty boli zobrazené pri hoveri cez ten kruh“ → finál: **veľký kruhový objazd späť ako hlavný selektor** (SVG vozovka, 9 obiehajúcich foto-uzlov 56 px, orbita 80 s, pauza pri kurzore, klik zamkne, auto-postup 4 s) s **projektom v strede objazdu pri hoveri** (hub 316 px, crossfade + settle). Obdĺžnik, miniatúry aj dial odstránené; detail vľavo (progress, skupina, H3, popis, miesto + n/9, CTA s predvyplnením). Fixné výšky = nič nelieta. Mobil ostal zoznam + vlastné CTA na popup.

### Audit a overenia
- Audit rozšírený na **36 kontrol** (DIALOGv4: 5/5 CTA, Esc + scrim, fokus späť, scroll-lock, 0 tieňov, prefill, mobilný sheet; SLUZBYv4: objazd 9 uzlov + hub 1 aktívna fotka + orbita beží + žiadne kruhové fotky mimo objazdu; MOBv4: H2 viditeľné 390/768, výška sekcie ~ obsah, 768 bez overflow). **36/36 ✅ dvakrát po sebe.**
- Nedotknuté pásma: pixel-diffy na 1440 ukazujú len capture artefakty (vnútorný ~50 px posun z Reveal/mesh timingu, JPEG šum fotiek) — obsah na výrezoch identický; kódový dôkaz: Realizacie.jsx a ONas.jsx dnes nezmenené, Debarierizacia desktop podstrom intaktný, Kontakt len CTA handler + mŕtva kotva.
- Screenshoty: `v4-final-{1440,390}.jpeg`, `v4-dialog-{1440,390}.jpeg`, shots/v4-*.

### Handover
- Endpoint formulára: nastaviť `VITE_FORM_ENDPOINT` (Formspark) — dovtedy demo režim s poznámkou v success paneli.
- PROMPT-v3: pri behu preskočiť tvorbu formulára v §2.3 — `ZadanieForm` existuje, len osadiť do Kontakt sekcie.
- Publish naďalej blokovaný viditeľnosťou repa (bez pokusu).
- **2026-08-24 (referenčná karta → undo):** Peter poslal screenshot radial-orbital-timeline ako zamýšľanú mechaniku → postavená verzia s kartou v strede objazdu, štítkami pod všetkými uzlami a dotočením kliknutého uzla na vrchol (overené: rotácia beží, hover otvára kartu so správnym titulkom; klik-lock mal ešte chybu). Vzápätí pokyn **„undo last change“** → obnovená predchádzajúca verzia: veľký objazd + **fotka projektu v strede pri hoveri** + detail vľavo. Referenčný variant nechávam k dispozícii v git histórii tohto logu ako popis; kód sa dá zreplikovať z QUALITY-LOG. Audit **36/36 ✅ dvakrát** na obnovenej verzii, screenshoty `v4-final-*.jpeg` prepísané aktuálnym stavom.
- **2026-08-24 (perex + mobilné koleso):** (1) perex Služieb „Deväť prvkov v troch celkoch…“ visel vpravo vo vzduchu vedľa H2 → ukotvený pod nadpis (jednostĺpcová hlavička sekcie). (2) Na pokyn pridané **koliesko so službami aj do mobilnej verzie**: objazd parametrizovaný na `KruhovyObjazd` (desktop 600/56/316, mobil 340/44/176 — uzly plných 44 px kvôli tap targetom), pod mobilným kolesom názov aktívnej služby + n/9, zoznam ostáva pod tým; tap → hub aj popisok overené (03-MT, „Spomaľovače… 5/9“). Nájdený a opravený reálny overflow: **rotujúca `inset-0` vrstva má pri otáčaní rohy do 340·√2 px** a postupne rástol scrollWidth (390→417) → `overflow-hidden` na kontajneri kolesa (scale-ované uzly ostávajú vnútri; scrollWidth stabilne 390×6 vzoriek). Audit prepnutý na viditeľné koleso (predtým rátal aj skryté = 18 uzlov). **36/36 ✅ dvakrát** (v4-mwheel2, v4-mwheel3). Screenshoty `v4-final-*.jpeg`, `v4-mobil-koleso-390.jpeg`.
- **2026-08-24 (revert mobilného kolesa):** na pokyn odstránené koliesko z mobilnej verzie — mobil je späť čistý zoznam s náhľadmi (390: scrollWidth stabilne 390, zoznam hneď pod hlavičkou sekcie). Desktop koleso nezmenené (komponent `KruhovyObjazd` ostáva, používa ho už len desktop); ponechané dve opravy z medzikroku, lebo platia aj pre desktop: `overflow-hidden` na kontajneri kolesa (rohy rotujúcej vrstvy) a audit meriaci len viditeľné koleso. Audit **36/36 ✅ dvakrát** (v4-mrevert, v4-mrevert2), screenshoty `v4-final-*.jpeg` aktualizované.
- **2026-08-24 (hlavička Služieb):** perex „Deväť prvkov v troch celkoch…“ presunutý napravo na úroveň názvu sekcie (dvojstĺpcová hlavička, spodné zarovnanie s H2) a blok dorazený na pravý okraj kontajnera (`lg:ml-auto`); koleso posunuté vyššie (`lg:mt-20` → `lg:mt-10`). Perex už sedí priamo nad stĺpcom kolesa, takže nevisí vo vzduchu. Audit 36/36 ✅, screenshoty `v4-final-*.jpeg`.

## 2026-08-24 · PUBLISH — demo je živé
- Peter: „push to gh“ → `gh repo edit devpnh/demo-cestneprvky --visibility public` (tentoraz prešlo) → `POST /api/jobs/…/publish` → push + Pages OK → Actions „Deploy demo to GitHub Pages“ **success** → **https://devpnh.github.io/demo-cestneprvky/ vracia 200**. Obsah overený markermi v bundle (perex, objazd, popup) + hero.mp4 200/2,6 MB. Hash bundle sa od lokálneho líši — Actions buildí zo zdrojov, to je v poriadku. Karta jobu ukazuje stale „failed“ z včerajšej fázy publish — kozmetika, manuálny publish beží mimo fázy.
- **Lighthouse (mobile, produkcia):** Performance 72–80 (LCP 3,6 s, SI 6,1 s, CLS 0,001, TBT 0 ms), Accessibility 96, Best practices 96, **SEO 63 zámerne** — demo má `noindex`, Lighthouse zaň penalizuje; cieľ SEO ≥ 90 je nesplniteľný, kým je demo neindexovateľné (správne). Perf pod cieľom 90: LCP poster sa objavuje až po JS (SPA) — návrh do handoveru/chassis: `<link rel="preload">` LCP postera v index.html šablóne chassis; UX sa za skóre neobetúva (doktrína).
- Loop §6: všetky body vrátane publish/Actions/živej URL ✅ (Lighthouse Perf/SEO zdokumentované s dôvodmi). Demo pripravené na poslanie klientovi.

---

# v5 — kompletná prerábka na viacstránkový web (2026-08-25)

Zadanie: `poznamky/PROMPT-v5-prerabka.md`. Manažér + subagenti, loop podľa §6.
Raster a deľba práce: `poznamky/KOMPOZICIA.md`. Mapa obsahu: `poznamky/MAPA-OBSAHU.md`.

## Kolo 0 — príprava (manažér)
- **Infra:** `audit.mjs` presunutý do repa (lokálny `playwright` ako devDependency, `SITE` odvodené z `import.meta.url`, `PNG` cez absolútnu cestu, lebo `playwright-core` neexportuje `./lib/*`). `vite.config.js` číta `DEMOGEN_BASE` cez `loadEnv`, takže **lokálny build má rovnaký base `/demo-cestneprvky/` ako Pages** (predtým lokálne `/` → preview 404). Baseline auditu na starej jednostránke: **36/36 ✅**.
- **Médiá:** 9 fotiek bolo nad limitom 250 kB (max 720 kB). `sips` na časti zlyhal (veľké rozmery, ICC), dorobené v PIL: dlhá hrana ≤ 1600 px, JPEG q52–82, `optimize+progressive`, `exif_transpose` pred uložením. Výsledok **38 súborov, max 244 kB** (bolo 7,9 MB → 5,7 MB). Jediné vizuálne duplikáty sú dve verzie loga (s alfou a bez).
- **Zdieľaný kit** `src/components/kit/`: `Sekcia`+`Kontajner`, `StranHlavicka`, `SekciaHlavicka`, `MonoStitok`, `Tlacidlo`, `Fotka`, `PasFaktov`, `Lajna` (prerušovaná deliaca linka v reči vodorovného značenia). Dôvod: štyri paralelné ruky by inak vyrobili štyri rôzne weby. Pridaný token `--color-accent-deep: #c5250d` (hover akcentu, z palety klienta).
  - Pasca, na ktorú sa narazilo hneď: `aspect-[${pomer}]` sa **nikdy nevygeneruje** — Tailwind v4 skenuje zdroj staticky, trieda zložená za behu v CSS nevznikne. Pomer ide inline cez `style={{ aspectRatio }}`.
- **Dáta (Architekt):** `src/content/{sluzby,realizacie,firma,routes}.js` — 9 služieb (1 až 4 s plným textom vrátane tabuľky DEBUZ a návodu, 5 až 9 s perexom a poľom `chyba`), 35 fotiek (32 v galérii), 15 routov. Pokrytie inventára originálu **100 %** (68 riadkov prenesených, 7 vypustených so zdôvodnením = šablónový balast MaisonCo). Grep batéria nad dátami: pomlčky mimo doslovných názvov 0, slop 0, čechizmy 0, vymyslené údaje 0, MaisonCo 0.
  - **Oprava zadania na základe dôkazu:** prompt priraďoval fotky 30–35 k lepeným obrubníkom; podľa `structure.json` sú zo stránky značenia pre nevidiacich a na záberoch sú indikátory, nie obrubníky. Priradené podľa dôkazu, nie podľa promptu.
  - Rozmery fotiek sa merali dvakrát, lebo manažér medzitým prevzorkoval assety. Krížová kontrola manažéra po oboch zásahoch: **60 fotoodkazov, 0 nezrovnalostí** medzi `w`/`h` v dátach a súbormi na disku.
- **Shell (Staviteľ Layout):** `react-router-dom` v7, `basename` z `import.meta.env.BASE_URL`, lazy stránky, prechod fade + 12 px / 300 ms cez `AnimatePresence mode="wait"`, `ScrollToTop` s fokusom na `<main>`, `Header` (fixed, priehľadný len na `/`, mobilné menu ako súrodenec headera kvôli `backdrop-filter`), `Footer` s odkazmi na routy (starý mŕtvy `#technologie` je preč), `Seo` s props na routu, `scripts/postbuild.mjs` kopíruje `index.html` → `404.html`. Overené: 14 ciest 200, 0 pageerror, 1× h1, `scrollWidth` 390 na všetkých.
  - Odchýlka od kontraktu: dáta exportujú `ROUTY`/`NAVIGACIA`, nie `ROUTES` → shell má adaptér `src/components/layout/routy.js`, aby sa prípadné premenovanie riešilo na jednom mieste.

## Kolo 1 — stavba stránok, prvý audit, výkon
- **Štyria stavitelia paralelne** na disjunktných súboroch (Domov 5 sekcií · Služby prehľad + 9 detailov + objazd · Realizácie sticky + galéria · O firme + Kontakt). Kompozíciu Domova a stuby sekcií napísal manažér vopred, aby sa nikto nebil o `index.jsx` a build ostal zelený počas celého behu.
- **Tri chyby zdieľaného kitu našli stavitelia, nie audit** (a všetky sú z rodiny „Tailwind nerozhoduje podľa poradia tried v reťazci“):
  1. `PasFaktov` mal `whitespace-nowrap` na celej položke → fakt „Konzultácie: Únia nevidiacich…“ má na 390 px cez 440 px a ťahal `scrollWidth` dokumentu na 461. Oprava: text sa láme, nezlomiteľný je len oddeľovač (NBSP + `·`).
  2. `Tlacidlo` malo `px-7` v základe, takže `px-0` vo variante `tichy` sa nikdy neuplatnilo a tichý odkaz začínal o 28 px vpravo od mriežky. Oprava: padding je vo variantoch, nie v základe.
  3. Drobčekový odkaz v `StranHlavicka` je inline, takže meral 49×15 px. Oprava: `inline-flex min-h-[44px]`.
  Obe lokálne obchádzky, ktoré si stavitelia museli spraviť, sú odstránené — pravda ostáva na jednom mieste.
- **Nález staviteľa Realizácií v odsúhlasenom kóde:** `useTransform` s rozsahom, ktorý nekončí na 1, dostane od WAAPI implicitný záverečný keyframe s pôvodnou hodnotou štýlu. Prvý záber sa preto lineárne vracal do plnej viditeľnosti (0,07 → 0,27 → 0,47 → 1,0) a presvital popod celý scrub. Ten istý bug bol aj v pôvodnej `src/sections/Debarierizacia.jsx`. Každý rozsah dnes explicitne pokrýva `[0 … 1]`.
- **Nový audit** (`poznamky/audit.mjs` + `audit-utils.mjs` + `audit-meranie.mjs`): 43 kontrol = 19 súborových + 14 na každú z 15 ciest + 10 viazaných na stránky, spolu **239 riadkov**, viewporty 1440/768/390, `--json` na porovnávanie kôl. Nové oproti v4: `F1d` (rozmery v dátach == rozmery súborov, čiže budúci CLS), `F1e`, `S1` (dist/404.html == index.html), `S3` (nikto neimportuje mŕtve `src/sections`), `F5` (width+height na každom `<img>`), `B3r` (žiadna farba mimo tokenov, tolerancia ΔRGB ≤ 8 vrátane lineárnych zmesí), `ALIGN` (ľavé hrany sekcií na kontajneri ±1 px), `NAVv5`, `NAPv5`, `ROUTEv5`, `OBSAHv5`. Audítor si sám overil, že audit odhalí zavedenú chybu (druhý H1, tieň, dlhý title) — a chybu do repa nevložil.
- Prvý beh nad hotovými stránkami: **217/239, 22 ❌ = tri reálne nálezy** (kontrast akcentových oddeľovačov, drobček 49×15 px, 404 bez `data-pasmo`). Po opravách **239/239 ✅ a druhý raz po sebe 239/239 ✅**.
- Mŕtve `src/sections/**` zmazané.

### Výkon (Lighthouse na lokálnom builde)
| | pred | po |
|---|---|---|
| Mobile performance | 72 | **94** |
| Mobile LCP | 5,3 s | **2,9 s** |
| Desktop performance | 75 → 95 | **99** |
| CLS (desktop) | **0,404** | 0,017 |
| CLS (mobile) | 0,003 | 0,003 |

Tri príčiny a opravy:
1. **CLS 0,404** — `lazy` stránky: Suspense vykreslil fallback vysoký 60 vh, pätička sedela hneď pod ním a po dorazení chunku spadla o tisíce pixelov (Lighthouse ukázal presne `body > div#root > footer`, skóre 0,4). Chunky stránok mali pritom 1 až 28 kB proti spoločnému balíku 496 kB, takže delenie neušetrilo nič. `lazy` odstránené.
2. **Render-blocking 2,1 s na mobile** — hárok Google Fonts. Presunutý z `@import` v `tokens.css` do `index.html` a načítaný asynchrónne (`media="print"` + `onload`), s `<noscript>` fallbackom. Rez 700 sa už nesťahuje, dizajnový systém ho zakazuje.
3. **LCP 5,3 s / 222 kB navyše** — poster hero sa na telefón sťahoval v 1920 px a začal až po vykreslení Reactom. Pribudli `poster-960.jpg` (90 kB) a `poster-1440.jpg` (182 kB), `srcSet` + `sizes="100vw"` v `Hero.jsx` a `<link rel="preload" imagesrcset>` v `index.html`.

**Otvorené rozhodnutie pre Petra:** Lighthouse Accessibility je 96, jediný nález je primárne CTA — biela na `#F03314` = 4,04:1 pri 19 px. `STANDARDY` B7 to povoľuje (veľký text ≥ 19 px pri reze 600+ má limit 3:1) a je to vedomé rozhodnutie z iterácie 3 v auguste. `axe` však počíta „bold“ až od rezu 700, ktorý dizajnový systém zakazuje (B4). Cesty von sú tri: nechať tak (dnešný stav), dať tlačidlu výplň `--color-accent-deep` (biela na `#c5250d` = 5,76:1, ale mení sa firemná červená na hlavnom prvku), alebo zväčšiť text CTA na 24 px. Bez pokynu neurobím ani jedno.

## Kolo 2 a 3 — kontrola obsahu, vkusu a sadzby

### Obsahový kontrolór našiel to, čo audit ani kritik nevideli
Pokrytie pôvodného obsahu 88,3 % (text stránok kompletný, tabuľka DEBUZ 7/7 riadkov, návod 6/6 krokov, 7 výhod 7/7). Podstatný bol ale **opačný smer: 13 skupín tvrdení bez opory v podkladoch.** Najzávažnejšie:
- **ÚNSS ako „Partner“ a „Spolupráca“** — pôvodný web na Úniu nevidiacich a slabozrakých len odkazuje ako na miesto, kde sa dajú získať konzultácie a stanoviská. Web tvrdil vzťah s existujúcou organizáciou bez jej vedomia, aj v meta description. Chyba vznikla v zadaní (`PROMPT-v5` §2.1 to napísal ako „Partner“). Opravené: blok sa volá „Kam po konzultáciu“ a hovorí o tom, čo robí Únia.
- **Celý blok `PROCES`** vkladal klientovi do úst obhliadku na mieste, cenovú ponuku, spoločnú preberačku a odovzdanie diela, a zovšeobecňoval „bez búracích prác“ na všetkých 9 služieb vrátane frézovania značenia.
- **„Pracujeme pre mestá, župy, správcov ciest, stavebné firmy a developerov“** stálo ako perex hero — vymyslená klientela.
- **Fotka `08-BA_Bosakova`** bola označená „Odstránené značenie“, hoci na nej sú pásy priechodu kompletné; `07-Braill` je produktová fotografia, nie záber z osadenia.
- Deväť perexov služieb vymenúvalo cieľové skupiny, ktoré v podkladoch nie sú, a pri chudobných službách odpovedalo na to, na čo sa `[DOPLNÍ KLIENT]` na tej istej stránke pýta.
- **8 miest realizácií** (Milochov, Svederník, Blatná na Ostrove, Podunajské Biskupice, Slanická osada, Kysucké Nové Mesto, Devínska Nová Ves, Most pri Bratislave) z webu vypadlo, hoci sú doložené rovnako ako tie s fotkou. Vrátené ako `MIESTA_REALIZACII` — zároveň je to konečne dôkaz pod tvrdením „realizácie po celom Slovensku“.

### Vizuálny kritik, dve kolá
Priemer rubriky **7,9 → 8,6**. Kolo 1: dva blockery (`[DOPLNÍ KLIENT: …]` sa vypisoval surový aj so zátvorkami; chudobné stránky služieb mali prázdne pásma) a 8 vkusových nálezov — `/sluzby` boli trikrát ten istý riadok orámovaných kariet, claim klienta bol nadpisom CTA na 12 stránkach zo 14, 17 z 32 dlaždíc galérie malo popisok „Realizácia klienta“, 24 filtrových čipov pred prvou fotkou.
Kolo 2: jeden nový blocker — **v sticky sekcii ležali pri prelínačkách dva mono popisky na tej istej súradnici, oba na opacite ~0,5** (nečitateľná šmuha v štvrtine rozsahu scrubu). Opravené disjunktnými rozsahmi popiskov, takže kolízia neexistuje pri žiadnej hustote vzorkovania; prelínačka fotiek zúžená z 10 % na 2 %.

### Sadzba (pokyn Petra: „pozri si, ako je to opticky“)
Odsek o technológiách mal všetky merania v poriadku a pritom vyzeral zle — **výpočet troch technológií bol vysádzaný ako veta s dvojbodkou**. Prerobené na zoznam, stĺpce opticky vyvážené (text 46 ch, fotka na výšku, spoločná spodná linka namiesto 180 px prázdna pod fotkou).
Pri pohľade na render sa ukázalo, že riadok končí spojkou „a“. Vznikol `src/lib/sadzba.js`: nezlomiteľné medzery po jednopísmenových predložkách a spojkách a medzi číslom a jednotkou. Najprv bežal len nad `src/content/*`, takže nadpis dialógu sa lámal „vrátime sa **s** / termínom obhliadky“ — teraz prechádzajú sadzbou aj texty v kite, dialógu a formulári. **Pravidlo je odvtedy merateľné: kontrola `SADZBA` v audite skladá riadky z rámčekov jednotlivých slov a hlási každý riadok končiaci jednopísmenovým slovom.**

### Ďalšie opravy kola 3
Jedno pravidlo popisku fotiek pre celý web (tá istá trieda fotiek mala tri rôzne vety: „Vlastná realizácia“, „Realizácia klienta“, nič) · sľub „vrátime sa s termínom obhliadky“ odstránený aj z dialógu a z CTA na `/realizacie` · galéria na mobile 17 666 → 8 592 px (12 dlaždíc + tlačidlo, zvyšok sa nevkladá do DOM) · rytmus pásiem na detailoch sa počíta z pásiem, ktoré naozaj vznikli (tri biele za sebou na 4 cestách → 0) · 7 výhod DEBUZ v jednom stĺpci (sedem je prvočíslo, v dvoch stĺpcoch vždy osirie posledná) · perex Služieb späť do pravého stĺpca hlavičky · kroky Procesu skrátené na rovnakú dĺžku.

### Pasce, ktoré stoja za zapamätanie
1. **Tailwind v4 nerozhoduje podľa poradia tried v reťazci, ale podľa poradia pravidiel v CSS** — `px-0` vo variante neprebilo `px-7` v základe tlačidla. Rovnaká rodina: trieda zložená za behu (`aspect-[${pomer}]`) sa nikdy nevygeneruje, lebo Tailwind skenuje zdroj staticky.
2. **`useTransform` s rozsahom, ktorý nekončí na 1**, dostane od WAAPI implicitný záverečný keyframe s pôvodnou hodnotou — vrstva sa nenápadne vráti do plnej viditeľnosti.
3. **Meranie kontrastu preskakuje prvok s `opacity: 0`, ale nie jeho deti** — popisok skladaný z vnorených `<span>`ov spôsobil 18 falošných pádov B7.
4. **NBSP je sadzba, nie obsah** — porovnávanie reťazcov v audite musí normalizovať obe strany.
5. **Lazy-loading stránok v SPA = veľký CLS**, ak Suspense fallback nemá výšku obsahu (0,404 na pätičke).

### Stav na konci behu
| | |
|---|---|
| Audit | **254/254 ✅** (43 kontrol, 15 ciest × 1440/768/390), zelený štyrikrát po sebe |
| Lighthouse mobile | perf **94** · a11y 96 · best practices 96 · LCP 2,9 s · CLS 0,002 |
| Lighthouse desktop | perf **99** · LCP 0,9 s |
| SEO | 63 zámerne — demo má `noindex`, vyššie sa dostať nedá |
| Rubrika kritika | 8,6 z 10; výstupná podmienka §6.3 (každý bod ≥ 9) nesplnená, zvyšné nálezy sú vkus a kozmetika |

## 2026-08-26 · nález: `whileInView` v tomto projekte nespúšťa animácie

Pri oprave pipeline v sekcii Proces sa ukázalo, že animácie viazané na
`whileInView` z knižnice `motion` sa nespúšťajú vôbec. Dôkaz je jednoznačný:
prvok 8 000 px pod okrajom okna má `opacity: 1` a **žiadny inline `style`**,
teda `initial` sa naň nikdy nepoužilo. Rovnako sa správa `Reveal` aj `Lajna`
— na konci vyzerajú správne, lebo cieľový stav je totožný s tým, čo sa
vykreslí bez animácie, a preto si toho nikto nevšimol.

Sekcia Proces je odvtedy postavená na vlastnom `IntersectionObserver`
a prechodoch v CSS. Namerané po oprave (vzorkovanie po 110 ms): pred vstupom
do viewportu `linky [0,0,0]`, `uzly [0,0,0,0]`, potom sekvencia
`uzol → úsečka → uzol` a po ~880 ms všetko na 1.

**Otvorené:** to isté treba preveriť pri `Reveal`, `Stagger` a `Lajna`, ktoré
`whileInView` používajú naprieč webom. Nie je to vec jednej sekcie a nemá to
vplyv na obsah ani na audit (cieľový stav je správny), ale znamená to, že
väčšina vstupných animácií na webe dnes v skutočnosti nebeží.

## 2026-08-26 · hero podstránok, dve pásma, mapa a údaje z registra
- **Faktový pás pod hero na Domove odstránený** (pokyn Petra). Rytmus `/` je `t b b t b b t`.
- **Sekcia Služby na Domove prerobená z kruhového objazdu na mriežku 3 × 3 fotografií.** Objazd nesedel na mriežke (ľavý okraj 717 px proti stĺpcom 136 a 752, vpravo 67 px medzera), stĺpce nesedeli dole (749 vs 899) a deväť kruhových náhľadov po ~50 px nekomunikovalo nič. Nová mriežka má ľavé hrany 136/536/936 s odchýlkou 0 px na 1024 až 1920 px.
- **Dve pásma namiesto troch** (pokyn Petra): sivá zrušená, ostáva svetlé a tmavé. Z toho plynie pravidlo zapísané do `KOMPOZICIA.md`: keď rytmus nerobí farba, musí ho robiť obsah — sekcia s vyše ~300 px súvislého textu bez obrazového prvku sa vracia.
- **Hero podstránok je tmavé a farebne spracované** (vzor doktorzub.com): eyebrow v `--color-accent-svetly` s prestrkom 0,2 em, biely H1, akcentová linka pod titulom. Nový token `--color-accent-svetly: #ff6a4d` — samotný akcent má na tmavom pásme len 3,61:1, tento 5,17:1. Hlavička webu sa už neriadi cestou, ale **prvým `data-pasmo` v `<main>`**, takže je priehľadná nad každým tmavým pásmom; `main` stratil `pt-[72px]` a odsadenie si drží prvé pásmo samo.
- **Mapa miest realizácií** na `/realizacie`: vlastné inline SVG, obrys Natural Earth 1:10m zjednodušený na 223 bodov, 15 miest podľa skutočných súradníc, prepojené hoverom so zoznamom. Žiadny externý mapový podklad ani cookies.
- **Údaje z registra namiesto zástupných textov.** Finstat je za Cloudflare (HTTP 403), preto sa čerpalo z **Obchodného registra SR** (Okresný súd Žilina) a z **RPO Štatistického úradu SR**: IČO 46 875 891, obchodné meno „Cestné prvky, s.r.o.“, deň zápisu 10. 11. 2012, vložka Sro/57757/L, konateľ Ján Lešňovský. Dátum narodenia konateľa register zverejňuje, na web nejde. **DIČ ani IČ DPH tieto registre nezverejňujú**, riadok sa preto vypúšťa, nevymýšľa.

## 2026-08-27 · koreňová príčina: na webe nebežala ANI JEDNA vstupná animácia

Otvorený bod z 26. 8. („to isté treba preveriť pri `Reveal`, `Stagger` a
`Lajna`“) je uzavretý a odpoveď je horšia, než sa čakalo: `whileInView`
nespúšťal nič **nikde na webe**, nielen v sekcii Proces.

**Meranie.** Na `/o-firme` je 23 `Reveal`ov. Pred opravou mali všetky prvky
pod ohybom `opacity: 1` a **žiadny inline `style`**, teda `initial="hidden"`
sa na ne nikdy nepoužilo. Nešlo o `prefers-reduced-motion` (matchMedia
vracalo `false`) ani o chýbajúci `IntersectionObserver` — inštrumentovaný
build ukázal, že komponent išiel správnou vetvou (`data-reveal="motion"`,
23 z 23).

**Príčina.** Wrapper prechodu routov v `App.jsx`:
`<AnimatePresence><motion.div key={pathname} initial={{opacity:0,y:12}}>`.
Ten `motion.div` je rodičom celého stromu stránky, takže si jeho potomkovia
počiatočný variant neuplatnia — čakajú na propagáciu variantu od rodiča,
ktorý žiadne varianty nemá. **Dôkaz:** po odstránení toho jedného wrappera
mali tie isté prvky `opacity: 0; transform: translateY(24px)`.

Web preto od zavedenia routera (v5 kolo 0) vyzeral staticky — komponenty na
animácie mal, ale cieľový stav bol totožný s tým, čo sa vykreslí bez
animácie, takže si toho nikto nevšimol. Presne to bola Petrova výtka
„vyzerá to celé ako cez WordPress, ako vygenerované“.

**Oprava.** Celá odhaľovacia vrstva je preč z knižnice: `src/lib/odhalenie.js`
je jeden zdieľaný `IntersectionObserver`, ktorý prepne `data-odhal` na `in`,
a prechody sú v CSS. Nemá rodičovský kontext, ktorý by ju vedel takto
potichu vypnúť, a rovnaký postup už raz zabral v sekcii Proces. Skrytý
východiskový stav visí na triede `js-motion`, ktorú nasadí `main.jsx` —
bez JavaScriptu sa nenasadí a obsah je celý viditeľný.

**Overenie po oprave** (prah 0, rootMargin `-8 %`, meranie na šiestich
cestách): pred scrollom skrytých 29 `/`, 9 `/sluzby`, 20 `/o-firme`,
6 `/kontakt`, 5 `/sluzby/cyklotrasy`; po prejdení stránky **0** na každej
z nich. Prechod routov je dnes CSS animácia na obyčajnom `<div>` s
`key={pathname}` a `animation-fill-mode: backwards` — s `both` by `transform`
ostal `matrix(1,0,0,1,0,0)`, čo je síce jednotková matica, ale ako každá
hodnota okrem `none` tvorí obsahujúci blok pre `position: fixed` (audit to
zachytil ako ❌ ROUTEv5).

`src/lib/motion.js` (house variants pre `whileInView`) je zmazaný, nemal už
jediného importéra.

## 2026-08-27 · šablóna podstránok, objazd späť, upratanie galérie

- **Jedna šablóna pre všetky podstránky** — `kit/Podstranka.jsx`. Skladá
  SEO, tmavú `StranHlavicka`, obsahové pásma a záverečný `PasVyzvy`. Predtým
  si tú istú kostru skladala každá stránka sama z rovnakých dielov a líšili
  sa len texty. Na šablónu prešli `/sluzby`, `/realizacie`, `/o-firme`,
  `/kontakt` aj deväť detailov služby. Jediné pravidlo navonok: posledné
  pásmo v `children` musí byť svetlé, lebo `PasVyzvy` je tmavý (B5).
- **Podpisový motív `ZnacenieMotiv`** — jazdné pruhy zbiehajúce sa do
  úbežníka, ktoré sa pomaly posúvajú (`stroke-dashoffset`, 34 s). Beží pod
  hlavičkou podstránky a pod pásom výzvy. Nie je to abstraktný gradient, je
  to to, čo firma reálne robí; červená je v ňom jediná čiara.
- **Hlavička podstránky je sekvencia, nie jeden fade:** štítok, titul po
  slovách (`SplitText`), perex, dokreslená akcentová linka, fakty. Pásmo má
  `min-height` `clamp(22rem, 42vw, 30rem)`, obsah je dorazený k jeho spodku.
- **Kruhový objazd je späť na Domove** (pokyn Petra). Obe namerané výhrady
  z kola 4 sú opravené: štvorec objazdu je presne sedem stĺpcov mriežky —
  namerané **655 px so pravou hranou na 1 304 px**, teda na pravom okraji
  kontajnera, ľavá na 649 px na osi stĺpca (predtým 717 proti 752). Uzly
  majú 72 px namiesto 50 px, aktívny 88 px. Mriežka 3 × 3 fotiek zostáva na
  `/sluzby`; na Domove ju objazd nahradil.
- **Galéria realizácií je kontaktný hárok, nie masonry.** `columns` so
  zábermi od pomeru 0,45 po 1,54 robili rozhádzanú stenu (výtka Petra).
  Dnes je to mriežka s jedným pomerom 4:3 a jednou výškou popisku, takže
  riadky sedia na spoločnej linke. Orez je vedomá strata; celý neorezaný
  záber ukazuje lightbox.
- **`/sluzby` už nemá dva rovnaké rady dlaždíc pod sebou.** Tretí celok má
  nový variant `riadok` (fotka na štyroch stĺpcoch, text na ôsmich), takže
  tri celky majú tri rôzne tvary.
- **Hlavička webu:** podčiarknutie navigácie sa dokresľuje zľava
  (`scaleX`, `top-full` — na spodnej hrane odkazu ho kontrola kontrastu B7
  čítala ako pozadie textu, biela na akcente je 4,05:1); pás postupu
  stránkou je maskovaná prerušovaná čiara, ktorá sa naťahuje ako čerstvé
  značenie, nie plná linka. Položky mobilného menu nabiehajú po sebe.
- **Pätička:** `GradientMesh` (červenkastý opar cez spodnú tretinu
  obrazovky) je preč — bola to jediná plocha na webe bez pôvodu. Nahradila
  ju prerušovaná akcentová čiara, ktorá sa dokreslí, a stĺpce nabiehajú po
  sebe.
- **Audit po zmenách: 254/254 OK, 0 ❌** (15 ciest, 1440 / 768 / 390 px).
  Horizontálny scroll na 390 px: 0 na `/`, `/realizacie` aj `/sluzby`.

## 2026-08-27 · dve tmavé plochy za sebou: pätička je svetlá a ráta sa do rytmu

Pokyn Petra: „nesmú byť dve tmavé plochy po sebe“. Meranie ukázalo, že
**vnútri `<main>` bol rytmus v poriadku na všetkých pätnástich cestách**
(`t b b t b b t`, `t b b b t`, `t b t`, …). Chyba bola na hranici, ktorú
kontrola nemerala: **tmavé pásmo výzvy + tmavá pätička**, teda jeden súvislý
tmavý blok na 13 z 15 ciest.

- **Pätička je svetlá** (`--color-bg`, text `--color-text`, vlasové linky
  `--color-border`, hover odkazov `--color-accent-deep`). Oddeľuje ju
  prerušovaná akcentová čiara, ktorá sa dokreslí.
- **Prečo nie naopak svetlá výzva:** `/sluzby` má tri svetlé obsahové pásma
  za sebou, svetlá výzva by z nich spravila štyri a padlo by pravidlo
  „nikdy tri rovnaké za sebou“. Tmavá výzva je aj posledný dôraz stránky.
- **Kontrola B5 odo dnes ráta aj pätičku.** Pásmo si berie z jej nameraného
  pozadia (luminancia > 128), lebo pätička nie je `Sekcia` a `data-pasmo`
  nemá. Overené obojstranne: so svetlou pätičkou `/sluzby` = `t b b b t b`
  ✅, s natvrdo tmavou pätičkou tá istá cesta vráti
  ❌ `dve tmavé za sebou: section.relative → footer`.

**Vedľajší nález pri tejto oprave:** `Lajna` sa nikdy nedokreslila. CSS
čítalo stav z `[data-lajna='in']`, ale observer zapisuje `data-odhal`.
Namerané pred opravou: `data-odhal="in"`, a pritom
`transform: matrix(0,0,0,1,0,0)` a šírka 0 px. Týkalo sa to všetkých
deliacich čiar aj akcentovej linky pod titulom každej podstránky. Selektor
je opravený na `[data-lajna][data-odhal='in']`, po oprave šírka 1 168 px
a `matrix(1,0,0,1,0,0)`. Je to tá istá trieda chyby, akú mala skupina
`Stagger` — stav sa píše na jeden atribút, čítal sa z druhého.

Audit po oprave: **254/254 OK, 0 ❌**.

## 2026-08-27 · Domov je prezentačný; objazd sa dal ovládať len jedným uzlom

Peter: Domov má byť prezentačný a nie „kopa textu nahádzaná na seba“, chýba
mu prémiový pocit; objazd nefunguje a glitchuje pri prepínaní.

### Objazd — tri príčiny, nie jedna

1. **Ovládať sa dal iba posledný uzol.** Každý z deviatich uzlov visel vo
   vlastnom priehľadnom štvorci cez CELÚ plochu objazdu (`absolute
   inset-[10%]`) a tie sa navzájom prekrývali, takže všetky pohyby myši
   chytal ten posledný v poradí. Playwright to hlási doslova:
   `div.absolute.inset-[10%] intercepts pointer events`, hover na uzol 6
   po 30 s vypršal. Obaly sú odteraz `pointer-events-none` a ukazovateľ si
   zapína späť samotný odkaz. Overené: hover na uzly 6, 3, 9 a 1 prepne
   detail na 6/9, 3/9, 9/9 a 1/9.
2. **Uzly obiehali, takže sa na ne nedalo trafiť.** Veniec sa točil
   (`orbit-spin`, 80 s na otáčku); uzol pod kurzorom uteká a keď sa naň
   trafíte, `onMouseEnter` objazd zastaví — kurzor však medzitým skĺzol
   vedľa a uzol uteká ďalej. Uzly odteraz **stoja** a pohyb nesie
   **akcentový oblúk**, ktorý po vozovke prebehne k aktívnej službe (uhol sa
   drží spojito a normalizuje do (−180°, 180°], takže z deviatej služby na
   prvú ide po kratšej strane, nie dookola). Overené: poloha uzla po 1,5 s
   nezmenená, oblúk sa točí 0° → 40° → 80°, pod kurzorom sa nič neposúva,
   po odchode kurzora sa posun do 5 s obnoví.
3. **Prelínačka v strede ukazovala dve fotky naraz.** Odchádzajúca aj
   prichádzajúca boli v polovici prechodu priesvitné a presvitali cez seba.
   Odchádzajúca teraz ostáva nepriehľadná pod prichádzajúcou a zhasne až
   po dobehnutí (stav `predchadzajuca`, 620 ms).

Vedľa toho: nula uzlov sedí na dvanástej hodine (`uholUzla = i · 360/počet`),
lebo uzol stojí na hornom okraji otočeného štvorca — pri pôvodnom
`−90 + i · 40` bola nula na deviatej hodine a oblúk mieril inam než uzol.

### Domov — menej textu, väčšie obrazy

- **Prečo Cestné prvky:** zo štyroch argumentov s fotkou a štvorriadkovým
  odsekom ostali štyri nadpisy na vlasovej mriežke, jeden veľký záber 16 : 9
  cez celú šírku kontajnera a číslo `30 min` vysadené veľkosťou hlavného
  nadpisu. Celé znenie argumentov je na `/o-firme`, odkiaľ sem vedie odkaz.
- **Služby:** vedľa objazdu ostal celok, meno služby v `--text-4xl`, miesto,
  počítadlo a odkaz. Bez perexu — aj v mobilnom zozname.
- **Realizácie:** šesť rovnakých dlaždíc 4 : 3 → jeden vedúci záber cez
  sedem stĺpcov a dva menšie vedľa neho. Bol to tretí pravidelný raster
  fotiek na jednej stránke.
- **Postup:** štyri kroky bez popisov, ostala linka so štyrmi menami.

Výška Domova 1440 px: 9 910 → 9 002 px. Na 390 px 10 606 px a stále 0
horizontálneho scrollu. Audit **254/254 OK, 0 ❌**, 0 chýb v konzole.

## 2026-08-27 · tmavá pätička s pohyblivým oparom, svetlá výzva nad ňou

Peter: „viac sa mi páčil tmavý footer s tým gradientom červeným, to tam
môžeme nechať a mohol by sa ten gradient nejako zaujímavo hýbať“.

Pätička je teda znova tmavá a opar sa vrátil. Aby popri tom platilo aj
predošlé zadanie („nesmú byť dve tmavé plochy po sebe“), presunula sa
svetlosť o pásmo vyššie:

- **`PasVyzvy` je svetlý** (podstránky) a **`Kontakt v skratke` na Domove
  tiež.** Dôraz výzvy nesie veľkosť titulu a červené tlačidlo, nie farba
  plochy. `ZnacenieMotiv` dostal variant `svetle` — čiary z inkoustu s
  krytím zníženým na 0,6 násobku, lebo slabá tmavá čiara je na bielej vidieť
  silnejšie než slabá biela na tmavej.
- Namerané rytmy vrátane pätičky: `/` `t b b t b b b t`, `/sluzby`
  `t b b b b t`, `/realizacie` `t b b t`, `/o-firme` `t b b t b b t`,
  `/kontakt` `t b b t`, detail `t b b b t`, 404 `b t`. **Nikde dve tmavé.**
  Štyri svetlé za sebou na `/sluzby` sú vedomé: pásma tam oddeľuje hlavička
  celku, vlasová linka a tri rôzne sadzby kariet (nosná + dve, tri naprieč,
  široké riadky), nie odtieň.

**Opar je prestavaný, nie obnovený.** Pôvodný `GradientMesh` posúval jednou
animáciou celú vrstvu naraz — tri škvrny sa hýbali ako jeden kus tapety.
Teraz má každá škvrna vlastný `@keyframes` a nesúdeliteľný čas obehu
(26 s, 34 s, 41 s), takže sa navzájom míňajú a celý obrazec sa nezopakuje
v čitateľnom takte. Overené: po 3,5 s majú všetky tri vrstvy inú maticu
a hýbu sa iným smerom aj tempom. Definície sú v `index.css`, nie v inline
`<style>` — tá sa predtým vkladala znova pri každom použití komponentu.

Krytie oparu je 0,34: pod ním stojí biely text pätičky a červená plocha pod
bielym 14 px textom má len 4,05 : 1. Kontrola B7 pri tomto krytí prešla na
všetkých pätnástich cestách.

Audit: **254/254 OK, 0 ❌**.

## 2026-08-27 · pätička bez deliacej čiary, motív mizne do stratena

Dva pokyny Petra:

- **Prerušovaná čiara z pätičky preč.** Pätičku od pásma nad ňou oddeľuje
  zmena farby plochy a to stačí; červená prerušovaná čiara cez celú šírku
  k tomu pridávala druhý, hlasnejší predel na tom istom mieste. (Pozor na
  zámenu: červená prerušovaná čiara, ktorá je pri scrolle na spodku stránky
  vidieť hore pod hlavičkou, je pás postupu stránkou v `Header`, nie
  pätička — ten ostáva.)
- **Motív nesmie ísť do jedného bodu, ale do stratena.** Úbežník bol na
  (1180, 150), teda vnútri kresby, a ešte sa v ňom kreslila bodka; čiary sa
  zbiehali do viditeľného bodu a motív vyzeral ako schéma perspektívy.
  Úbežník je odteraz **mimo `viewBox`** (x 1560 pri šírke 1200), bodka je
  preč a čiary k nemu vyblednú do nuly cez gradient na ťahu
  (`userSpaceOnUse`, aby bledli všetky rovnako a perspektíva sa nerozpadla).
  Kresba tak nemá koniec, ktorý by sa dal nájsť očami.

Overené v prehliadači: `circle` v motíve 0, `x2 = 1560`, ťah
`url(#pruh-mizne-tmave)`, animácia `pruhy-beh` beží, 2 gradienty;
`footer [data-lajna]` 0. Zároveň preverené, že sa nič nerozbilo: objazd po
hoveri na siedmy uzol prepne na `7 / 9`, opar sa po 2,5 s posunul, 0 chýb
v konzole na šiestich cestách. Audit **254/254 OK, 0 ❌**.

## 2026-08-27 · kinetický text: služba sa píše, nie preblikne

Pokyn Petra: Domov má byť prezentačnejší a moderný a má stáť na tom, čo firma
naozaj robí; ako podklad prišiel komponent `TextRotate` (21st.dev, `motion`),
kde text skáče na to, čo má návštevník práve pred očami.

Prenesený je do `src/components/primitives/TextRotate.jsx` (JSX, `cn`
zo `src/lib/utils.js`) s tromi domácimi zmenami: pri `prefers-reduced-motion`
nevzniká ani `AnimatePresence`, ani vrstva znakov (riadok sa len prepíše),
vetu nesie `sr-only` kópia a animovaná vrstva je `aria-hidden`, a rotátor
nesmie bežať vlastným taktom — vždy ho riadi `ref.jumpTo(index)`.

Riadia ho preto dva stavy, ktoré na Domove už boli:

- **Hero** — karta pri videu. Meno prvku a miesto sa prepisujú s prelínačkou
  vo videu, teda s tým, čo je práve na plátne. Meno je odteraz v displejovom
  reze 22 px, aby karta bola popisok a nie poznámka pod čiarou.
- **Služby** — celok, meno služby a miesto sa menia spolu s oblúkom na
  kruhovom objazde. Jedna udalosť, nie tri animácie vedľa seba.

Dve veci vyšli až z merania:

1. **`mode="wait"` nechal riadok 0,6 s prázdny** (starý text odletí a až
   potom priletí nový). Prvá snímka po prepnutí bola doslova prázdny stĺpec.
   Platí `popLayout`; zmerané na 40 snímkach cez celý prechod: 0 snímok bez
   jediného viditeľného znaku.
2. **Meno služby skákalo od jedného riadku po päť** (54 až 270 px na 1440 px)
   a stĺpec centrovaný na os objazdu sa s ním posúval. Veľkosť sa preto berie
   z dĺžky mena (≤ 16 znakov `--text-5xl`, ≤ 35 `--text-4xl`, inak
   `--text-3xl`), šírka sadzby je v `rem`, nie v `ch` (`ch` sa počíta
   z veľkosti písma, takže by sa menila s ňou), a blok má rezervu
   `min-h-[10.5rem]`. Namerané na 1024/1280/1440 px: blok má 203 až 210 px
   pri všetkých deviatich službách, horná hrana sa hýbe o 4 px namiesto 47.

Audit na `/`: **21/21 OK** (súborové kontroly 19/19), 0 chýb v konzole na
1440/768/390, B7 zmeral 382 textových prvkov (znaky rotátora sa merajú
jednotlivo), RMv5 bez nálezu. Celý web sa neauditoval — na pätičke a `PasVyzvy`
súbežne pracuje druhá ruka a beh by meral rozrobené pásma.

## 2026-08-27 · objazd je orbitálna os, fotky sa presunuli do pásma Prečo

Peter: kruh nech funguje samostatne, podobne ako v predlohe
(`radial-orbital-timeline`), a animácia fotiek nech ide inde, kde sa hodí.

### Objazd

Prepísaný na orbitálnu os s mechanikou predlohy, ale v palete a v pravidlách
tohto webu (žiadne fialovo-tyrkysové gradienty, žiadne tiene, **žiadne
vymyslené `status` a `energy`** — to by padlo na A3):

- Deväť uzlov obieha po asfaltovom prstenci, otáčka 96 s. Uzol vpredu (dole,
  najbližšie k divákovi) je aktívny a stĺpec vedľa neho vypisuje jeho celok
  a názov, takže **kruh ukazuje sám od seba a nečaká na klik**.
- Hĺbka je zo `sin` uhla: krytie 0,45 vzadu až 1 vpredu a `z-index` podľa
  toho istého, takže kruh pôsobí ako priestor, nie ako plochý ciferník.
- Klik uzol pripne: otáčanie zastane, uzol sa po **kratšej strane** presunie
  dopredu a uzly z toho istého celku pulzujú akcentom. Príbuznosť nie je
  vymyslený vzťah, je to `skupina` zo `sluzby.js`.
- Uzly nesú **ikony**, nie fotografie: deväť fotiek orezaných do 56 px
  koliesok nekomunikovalo nič.
- Otáčanie nejde cez React stav ako v predlohe (`setState` každých 50 ms),
  ale cez `useRef` + rAF s reálnym delta časom; transformácie sa zapisujú
  priamo do DOM. React sa prekresľuje len pri zmene aktívnej služby, teda
  raz za ~10,7 s namiesto dvadsaťkrát za sekundu.
- Polomer dráhy sa **meria v pixeloch** cez `ResizeObserver`. Percentá by
  boli chyba: `translate` počíta percentá z veľkosti samotného prvku (56 px
  uzla), nie z rodiča, takže by uzly skončili natlačené na strede.

Overené: uzly obiehajú, aktívna sa mení sama (2/9 → 1/9 za 9 s), pod
kurzorom otáčanie stojí, klik na piaty uzol dá `5 / 9` a rozpulzuje dva
príbuzné, pripnutie drží aj po odchode kurzora, 0 chýb v konzole.

### Fotky

Prelínačka zo stredu objazdu sa presťahovala do pásma **Prečo** ako
`primitives/Prelinacka.jsx`: štyri zábery cez celú šírku kontajnera v pomere
16 : 9, popisok sa mení so záberom, prepínače sú čiarky vodorovného
značenia. V strede kruhu mala fotka ~230 px a menila sa pod prstencom ikon;
tu je to jediná vec v pásme, na ktorú sa oko sústredí. Zachovaná je
mechanika správneho prelínania — odchádzajúca vrstva ostáva nepriehľadná
pod prichádzajúcou a zhasne až po dobehnutí.

### Tri nálezy z auditu na vlastnom novom kóde

- **A1:** pomlčka v `aria-label` uzla. `aria-label` je copy, číta ho čítačka
  nahlas, takže platí zákaz pomlčiek — nahradená čiarkou.
- **F5:** prvá fotka prelínačky mala `loading="eager"`, hoci stojí pod
  ohybom a LCP prvkom je nadpis. Všetky sú `lazy`.
- **D2:** prepínače prelínačky mali 34 × 44 px. Majú 44 × 44 px, viditeľná
  je z nich len 24 px čiarka.

Audit po opravách: **254/254 OK, 0 ❌**.

**Poznámka k autorstvu:** `primitives/TextRotate.jsx` a jeho zapojenie do
ľavého stĺpca sekcie Služby a do hero nie sú z tohto behu — objavili sa
v pracovnom strome súbežne. Ostávajú, sedia k objazdu (meno služby sa
vymieňa po znakoch v tom istom okamihu, keď sa mení aktívny uzol).

## 2026-08-27 · dynamická pätička a nové prvé pásmo pod hero

### Pätička sa skladá ako hero podstránok — VRÁTENÉ, pozri zápis nižšie

Pokyn Petra: „dynamický footer podobne ako hero sekcia na podstránkach“.
Má teda tie isté štyri veci v tom istom poradí ako `StranHlavicka`: logo,
mono eyebrow (`Od roku 2012, Žilina`, oba údaje z `firma.js`), veta vysadená
displejovým rezom, ktorá nabieha po slovách (`SplitText`, 15 slov), a
akcentová linka; pod nimi stĺpce, ktoré nastupujú po sebe.

Vrstvy pozadia sú dve: `GradientMesh` (prelievajúci sa červený opar) a nad
ním `ZnacenieMotiv` (5 pruhov miznúcich do stratena). Opar dáva teplo, pruhy
kresbu — samotný opar bol mäkký a nemal sa čoho chytiť.

Veta nie je nová copy, je to ten istý text, čo v pätičke stál ako drobný
odstavec. Logo sa presunulo nad ňu ako podpis; v samostatnom stĺpci pod
linkou pri ňom ostávalo ~300 px prázdna.

### Prvé pásmo pod hero má chytiť oko

Pokyn: „potrebujeme tam chytiť oko zákazníka“. Skladba je teraz:

1. **Biely nádych** — hero je tmavé a plné fotky, hneď za ním musí prísť
   vzduch. Hore je len eyebrow, claim firmy v `--text-5xl` a jedna veta.
2. **Záber cez celú šírku okna** — 1 440 × 551 px, `left = 0`, výška
   `clamp(22rem, 58vh, 40rem)`. Je to jediné miesto na webe, kde fotka
   opúšťa mriežku, a práve preto funguje ako zarážka. **Nie `w-screen`
   s posunom o polovicu**: `100vw` počíta aj so zvislým scrollbarom a
   stránka by dostala pár pixelov vodorovného pretečenia (D1). Pás je
   priamy potomok sekcie, ktorá kontajner nemá, takže je od hrany po hranu
   sám od seba. Namerané: `scrollWidth` 1 440 na desktope a 390 na mobile.
3. **Paralaxa** — fotka je v páse o 16 % vyššia a posúva sa v ňom podľa
   polohy pásu voči oknu. Meria sa v rAF a zapisuje priamo do štýlu, nie
   cez `useState` — inak by to bolo prekreslenie Reactu na každý snímok.
   Overené: `translate3d(0, −4,6 %)` → `−33,4 %` po 400 px scrollu.
4. **Prelínačka** štyroch záberov, aby sa na pás dalo pozerať dlhšie než
   dve sekundy.

Pás je zámerne až POD bielou hlavičkou a nie hneď pod hero: fotka je
opticky tmavá plocha a tesne pod tmavým hero by to boli dve tmavé plochy za
sebou (B5).

Audit: **254/254 OK, 0 ❌**, 0 chýb v konzole, 390 px bez pretečenia.

## 2026-08-27 · pätička späť na pôvodnú veľkosť, dynamika ostáva v pozadí

Skladba hero podstránok pätičku nafúkla: **1 050 px namiesto 637 px**, teda
o vyše 300 px, a začala súťažiť s pásmom výzvy nad sebou. Peter to vrátil
s tým, že „do pozadia patrí animácia, nie ďalšie poschodie“.

Obsah je preto presne taký, aký bol pred tým pokusom: logo a veta, dve
navigácie, NAP a podpis, `--section-padding-y-sm`. Odišlo len to, čo pribudlo
navyše — eyebrow, veta v displejovom reze a akcentová linka.

**Dynamika ostala a je celá v pozadí, v dvoch vrstvách:**
`GradientMesh` (tri rozostrené škvrny, dráhy 26 s, 34 s a 41 s) a nad ním
`ZnacenieMotiv` (5 jazdných pruhov miznúcich do stratena, posun
`stroke-dashoffset` 34 s). Opar dáva teplo, pruhy kresbu — samotný opar bol
mäkký a nemal sa čoho chytiť.

Namerané po vrátení: výška pätičky 637 px, 3 vrstvy oparu, 5 pruhov,
0 slov v displejovom reze. Audit **254/254 OK, 0 ❌**.

## 2026-08-27 · prvé pásmo pod hero je „Kto sme“; celoplošný záber je oddeľovač

Zadanie Petra: „hneď pod hero by malo byť skôr kto sme, čo sme, a nejako to
zaujať návštevníka niečím zaujímavým. Páči sa mi tá fotka roztiahnutá cez
celú šírku, môže tam ostať len tá šedobiela, môžeme ju použiť ako oddeľovač
sekcií.“

### Kto sme

Pásmo „Prečo Cestné prvky“ (claim `Šetríme váš čas aj peniaze`) nahradilo
pásmo **Kto sme**. Bolo to tvrdenie o prínose ešte predtým, než sa
návštevník dozvedel, s kým má do činenia. Hero hovorí, ČO firma osádza; toto
pásmo hovorí, KTO to osádza: značka (`global.brand.tagline`, doteraz
nepoužitá), rok založenia, sídlo a rozsah (`FIRMA.uvod[0]`).

Zaujať má **trojica čísel vysadených najväčším rezom, ktoré si pri vstupe
do viewportu dopočítajú hodnotu** (`kit/Cislo.jsx`): 9 služieb, 14 typov
prvkov, 15 miest realizácií. Všetky tri sa rátajú z dát (`SLUZBY`,
`TYPY_PRVKOV`, `MIESTA_REALIZACII`), takže nemôže vzniknúť číslo, ktoré by
na webe nesedelo s obsahom (A3). Rok založenia medzi nimi zámerne nie je —
dopočítavať sa k letopočtu od nuly je nezmysel a ako jediné nepočítané číslo
by v rade rušil; rok je v perexe.

Je to jediná odchýlka od slovníka pohybu (E1: fade, slide, stagger, hover) a
je obmedzená: beží raz, trvá 1,2 s a inde na webe nie je. Odpočet zapisuje
priamo do DOM cez `ref`, nie cez `useState`; hodnota je pre čítačku
v `aria-label`, aby nečítala medzistavy. Namerané: `0 0 0` pred vstupom,
`5 8 8` v polovici, `9 14 15` po dobehnutí.

Štyri tvrdenia firmy ostali ako nadpisy bez odsekov; celé znenie je na
`/o-firme`.

### Oddeľovač

Celoplošný záber sa osamostatnil do `kit/PasOddelovac.jsx` a stojí medzi
pásmami ako predel. Jeden záber (šedobiela vodiaca línia), paralaxa, **bez
popisku** — pokyn Petra; čo je na zábere, nesie `alt` pre čítačku a mono
riadok pod pásom bol len ďalší text navyše.

Je to `<div>`, nie `<section>` s `data-pasmo`: nie je to obsahové pásmo, ale
predel, takže do rytmu pásiem nevstupuje. Opticky je tmavý, preto **nesmie
ísť tesne pod tmavé pásmo** — patrí medzi dve svetlé. Namerané: šírka
1 440 px, `left = 0`, `scrollWidth` 1 440 (žiadne pretečenie, D1).

Rytmus `/` je `t b b t b b b t` (nezmenený), výška stránky 8 963 px.
Audit **254/254 OK, 0 ❌**, 0 chýb v konzole.

**Nález pri tom:** popisky čísel nešli cez `sadzba()`, takže riadok končil
na „typov prvkov v“ a jednopísmenová predložka visela sama (kontrola
SADZBA). Sadzba platí aj pre texty skladané v komponente, nielen pre dáta.

## 2026-08-27 · sekcia Služby nemala ani jednu fotku

Nález Petra: „Čo realizujeme na pozemných komunikáciách — táto sekcia vôbec
nezobrazuje fotky.“ Sedelo to. Pri prestavbe objazdu na orbitálnu os
dostali uzly ikony (deväť fotiek orezaných do 56 px koliesok
nekomunikovalo nič) a prelínačka fotiek sa presťahovala do pásma Prečo,
neskôr do oddeľovača. V sekcii tak ostali len ikony a text.

Fotografia je späť **v ostrovčeku**, nie na prstenci: má priemer 42 %
objazdu, teda **275 px** na 1 440 px, kým v prstenci by mala 56 px. Delí sa
tak práca: prstenec nesie ikony, ktoré sú čitateľné aj v malom, ostrovček
nesie skutočnú prácu vo veľkosti, na ktorú sa dá pozerať.

Prelínanie je to isté, aké sa raz už opravovalo: odchádzajúca vrstva ostáva
nepriehľadná pod prichádzajúcou a zhasne až po dobehnutí. Namerané: 9 fotiek
v sekcii, v každom okamihu **práve jedna** viditeľná (žiadne presvitanie),
`alt` sa mení s aktívnou službou.

Audit **254/254 OK, 0 ❌**.

## 2026-08-28 · „Ako to robíme“ — všetko stálo a bolo to rozhádzané

Nález Petra, doslova: „prerob Ako to robíme sekciu lebo je otrasna vsetko tam
len stoji a je to take rozhadzane“. Sedelo oboje a boli to **dve rôzne chyby**,
nie jedna.

**Stálo to.** Jediná animácia sekcie bol 6 % posun fotky vnútri rámu — pohyb
pod prahom všímavosti — a nad ním `Reveal`, ktorý celý riadok naraz posunul
o 22 px. Hýbal sa obal, nie obsah.

**Rozhádzané** to bolo od `items-center`: textový stĺpec niesol čiarku, meno
a popisok, dokopy ~150 px, vycentrovaných v stĺpci vysokom 437 px. Tri riadky
= tri malé ostrovčeky plávajúce zakaždým inde, striedavo vľavo a vpravo.

**Skladba.** `items-start` + `lg:h-full`, popisok na `mt-auto`. Prvý pokus
nechal medzi menom a popiskom 330 px diery — presne tá chyba, ktorú Peter
odmietol už pri druhom pokuse o túto sekciu („prázdno nie je vzduch“). Dieru
drží **zvislá akcentová lajna cez celú výšku záberu**: prázdno pozdĺž
nakreslenej čiary je odstup, nie diera. Nahradila vodorovnú čiarku `w-12`.
Namerané na 1440: horná hrana mena = horná hrana záberu, spodná hrana popisku
= spodná hrana záberu, **delta 0 px vo všetkých troch riadkoch** (predtým
26 / 48 px hore a 0 / −22 px dole).

**Choreografia.** Riadok je jedna `Stagger` skupina (krok 90 ms), tri doby:
záber sa **položí** cez `clip-path: inset()` od vonkajšej hrany riadku dovnútra
(0,9 s, `--ease-house`, smer sa strieda s riadkom — cikcak dostal takt),
zvislá lajna sa kreslí zhora nadol, meno (+90 ms) a popisok (+180 ms)
nastupujú zdola. Všetko cez zdieľaný `data-odhal` observer, teda CSS mimo
hlavného vlákna; animujú sa len `opacity`, `transform` a `clip-path`.
Pri `prefers-reduced-motion` stojí fotka aj výter (`clip-path: none`).

Pozn. k `Stagger`: **ref sa naň dať nesmie** — spreaduje `{...props}` až za
svoj vlastný `ref`, takže cudzí ref prepíše ten interný, `sleduj()` dostane
null a riadok ostane navždy neviditeľný. Cieľ parallaxu je preto rám fotky.

Audit **254/254 OK, 0 ❌**, horizontálny overflow 0 na 1440 aj 390.

## 2026-08-28 (2) · „Ako to robíme“ — štvrtý pokus, stoh kariet

Peter po treťom pokuse: „vyzerá jak wordpress pičovina, prerob to na niečo
modernejšie a použi 21 dev“. Mal pravdu a je to presné: **striedavé riadky
obrázok-vľavo / obrázok-vpravo sú default každého Elementor a Divi templatu.**
Navyše ju držala pri živote len zvislá lajna, ktorá vypĺňala 330 px prázdneho
stĺpca — keď skladbu drží výplň medzery, skladba je zlá.

**21st.dev:** MCP server preň v session pripojený NIE JE (nie je v zozname),
ale `@21st-dev/cli` áno, účet `simko` prihlásený. `21st get` neprešlo —
**denný limit 0/2 stiahnutí kódu**, ten istý, čo zablokoval túto sekciu už
minule. Použitý teda `21st search` (metadata sú zadarmo) a vzor
`danielpetho/stacking-cards` (id 25275) prekreslený na tokenoch projektu.

**Stoh kariet.** Každá technológia = celoplošná karta: fotka cez celú plochu,
meno a popisok na nej. Karty sa pripínajú pod hlavičku (`top` 96/112/128) a
nová sa nasúva na predošlú, ktorá ide na `scale` 0,94 / 0,97 a stmieva sa
prekryvom 0 → 0,55. Prázdny stĺpec zanikol (fotka a text sú na jednej ploche).

**Dva nálezy pri ladení, oba merané:**
1. `transform-origin` musí byť **`top center`**, nie default `center`. Pri
   strede karta pri zmenšení klesne o (1−scale)·výška/2 ≈ 19 px — presne
   toľko, koľko je odstup `top`, a stoh sa zbehne do jednej hrany. Namerané
   pred: top 115 / 119 / 219 px. Po: 96 / 112 / 219, teda presne zadané `top`.
2. Prvý scrim bol pod textom slabý (spodná tretina len 82 %). Prekreslený na
   plný `--color-accent-2` do 18 % výšky.

Jedna vetva kódu pre všetky šírky — `position: sticky` je responzívne samo
o sebe, na rozdiel od prvého pokusu (`StickySection`), ktorý mal pod 1024 px
druhý layout. Toto je ten jeden sticky-scrub na stránku, ktorý E1 povoľuje.
Pri `prefers-reduced-motion` sa sticky ani scrub nemontuje, karty sú stĺpec.

Namerané 1440 aj 390: 3 karty, scale 1 → 0,94 / 0,97 / 1, prekryv 0 → 0,55,
horizontálny overflow 0, 0 chýb v konzole. Audit **254/254 OK, 0 ❌**.

## 2026-08-28 (3) · `/o-firme` postavená nanovo: šesť tém v troch pásmach

**Výtka Petra:** „bordel v tom texte, nie je to dobre rozložené“. Merateľne:
stránka bola jeden súbor na 482 riadkov, v ktorom tri pásma niesli šesť tém.
Pásmo „Firma“ malo naraz identitu firmy, výpočet technológií so zoznamom
a záverečnú vetu o dodávateľoch; tmavé pásmo malo konzultácie, dve vyhlášky
a päť značiek materiálov (1 469 px súvislého textu). Nad tým všetkým mriežka
štyroch veľkých dopočítavaných čísel — ten istý útvar, ktorý Peter deň
predtým odmietol na Domove ako typicky generovaný.

**Rozobrané na sekcie ako Domov** (`src/pages/OFirme/sections/`), jedno
pásmo = jedna otázka: `Profil` (kto sme a čo osádzame) → `Technologie` (čím
pracujeme) → `Pristup` (čo z toho plynie) → `PasOddelovac` → `Legislativa`
(podľa čoho a kam po konzultáciu) → `Materialy` (z čoho) → `Aktuality`.
Rytmus b-t-b-[predel]-b-t-b-b, nikdy dve tmavé za sebou, posledné svetlé.
Hlavička a pätička sa nedotkli — sú spoločné pre celý web.

**Fakty ostali, útvar sa zmenil.** Veľké čísla nahradil technický list
v `Profil` (založená / sídlo / pôsobnosť / miesta, všetko počítané z dát) a
jeden údaj vysadený veľký v `Pristup` — „do 30 min“ je jediné číslo firmy,
ktoré rozhoduje o zákazke, a doteraz bolo zahrabané v odseku.

**Pohyb (`FotkaVyter`).** Fotografia sa pri vstupe do okna vytiera zdola
`clip-path`om — ten istý pohyb, akým `ObrazokSmerovy` mení zábery pri
nájazde, ale použitý ako príchod obsahu. V triptychu technológií sa tri
výtery reťazia po 110 ms a každý stĺpec má inú rýchlosť paralaxy (0,10 /
0,18 / 0,13); pri rovnakých hodnotách sa rámy hýbu unisono a paralax je
cítiť ako trhanie. Vlastný `IntersectionObserver` (ako v `Cislo`), lebo
zdieľaná vrstva `data-odhal` má stavy napevno v CSS a piaty variant kvôli
jednej stránke by sa o týždeň použil inde.

**Dva nálezy z merania na vlastnom novom kóde:**
1. Mono popisky v triptychu stáli v troch rôznych výškach (mená postupov
   majú 2 aj 3 riadky). Opravené `flex h-full flex-col` + `mt-auto`.
2. Portrétový rám 3/4 bral z fotky retardérov (600×390) pruh 292 px a ťahal
   ho na 380 px — mäkká fotka predstierajúca rozlíšenie (F2). Triptych je
   preto štvorec: tá istá fotka si berie 390 px a ostáva ostrá.

Grounding: `21st search` (metadata zadarmo, kód sa neťahal) — `rolling-list`
a `hover-list-with-sticky-image` potvrdili, že rovnaký útvar už v projekte
je (`ObrazokSmerovy`, `Stagger`), takže sa nič nepridávalo.

Namerané 1440 aj 390: výter ide `inset(0% 0% 100%)` → `inset(0%)`, po
scrolle 0 neodhalených prvkov, pri `prefers-reduced-motion` je všetko rovno
viditeľné, 0 chýb v konzole. Audit celého webu **254/254 OK, 0 ❌**.

## 2026-08-28 (4) · `/o-firme`: jedna mriežka, hlavička bez marginálií, video

**Výtka Petra:** „ten alignment toho textu ma zabíja na niektorých miestach“,
„odstráň marginálie z hero sekcie napravo“, „implementuj video z Desktopu“.

**Zmerané, nie odhadnuté.** Ľavé hrany všetkých textových blokov na 1440 px
boli pred opravou na jedenástich rôznych osiach:

    136 · 176 · 438 · 536 · 547 · 677 · 740 · 752 · 855 · 936 · 1042

Príčina: každé pásmo si delilo dvanásťstĺpcovú mriežku inak — hlavička sekcie
7/5 (perex na 855), tvrdenia 5/7 plus odrážkové odsadenie (677), vyhlášky
a aktuality 4/8 (547), značky 6/6 (752). Väčšina osí je od seba ~100 px, teda
dosť na to, aby oko videlo nesúlad, a málo na to, aby vyzeral zámerne.

**Oprava:** stránka má **jediné delenie — polovica a polovica**
(`OFirme/HlavickaPasma.jsx`, os 136 a 752) a stĺpce sú zarovnané na vrch, nie
na spodnú hranu nadpisu. Akcentová značka pri tvrdeniach je nad menom, nie
pred ním, takže text začína presne na osi stĺpca. Technický list v Profile je
`col-span-3` v dvanástich stĺpcoch, aby tretia bunka padla na 752, nie na 740.

Po oprave: **136 a 752** vo všetkých pásmach; navyše len bunky rovnakých
mriežok (triptych 536/936, list 444/1060) a zdieľaný `PasVyzvy` (855), ktorý
je spoločný pre celý web a nemenil sa.

**Hlavička podstránky** na `/o-firme` nedostáva `perex` — napravo od titulu
nestojí nič. Veta „Osádzame značenie…“ tým pádom na stránke stojí raz, v
Profile. Kit sa nemenil, `perex` je nepovinný.

**Video.** `~/Desktop/video.mp4` (8 s, 1280×720, 18,7 MB) prekódované na
`public/video/znacenie.mp4` — H.264 crf 31, bez zvuku, faststart, **2 758 kB**
(limit hero videa je 3 MB) + poster 116 kB a 960px poster 76 kB. Nasadené ako
`PasVideo` na mieste fotografického oddeľovača, teda medzi dvomi svetlými
pásmami (opticky je tmavé). Pravidlá sú tie isté ako pri hero na Domove:
poster je vždy v DOM, video sa naň prelína po `canplay`, vzniká len nad
1024 px, nie pri `prefers-reduced-motion` ani `Save-Data`, `muted playsInline
loop`, `tabIndex={-1}`.

Prvá verzia bola pruh `clamp(18rem,46vh,32rem)` a orezala 40 % obrazu; na
pokyn Petra („nekropni to tak veľmi“) je pás v natívnom pomere **16:9 cez celú
šírku okna**, teda bez orezu (poistka `max-h-[92svh]` pre ultraširoké
monitory). `alt` popisuje, čo je na zábere, a netvrdí, že je to realizácia
klienta — v katalógu `REALIZACIE` tento súbor nie je.

Audit celého webu **254/254 OK, 0 ❌**.

## 2026-09-04 · Mobilné kolo podľa `PROMPT-v6-mobil.md`

**Zadanie Petra:** „sprav celu stranku mobilne optimalizovanu, footer nech sa
zmesti na jednu stranku, cela stranka na mobile vyzera jak scroll velkych
fotiek po jednej ktore su obrovske, rozpolozenie tych sluzieb a obrazkov
vymysliet na ten mobil, uistit sa ci sa fotky a videa spravne prehravaju."

Merané na 390 x 844, `deviceScaleFactor` 2, po dorolovaní celej stránky.
Desktop 1440 kontrolovaný pixel-diffom voči záberom pred prvou zmenou.

| Kontrola | pred | po |
|---|---|---|
| pätička | 1 399 px (1,66 obr.) | **715 px (0,85 obr.)** |
| `/` | 13,1 obr. | **11,0** |
| `/o-firme` | 11,8 obr. | **9,3** |
| `/realizacie` | 10,1 obr. | **5,0** |
| `/sluzby` | 9,6 obr. | **4,3** |
| detail služby | 8,4 / 5,9 obr. | **6,0 / 3,6** |
| `/kontakt`, `/novinky` | 5,2 / 3,5 obr. | **4,2 / 2,4** |
| sekcie nad 1 700 px | 10 | **3** |
| fotky nad 60 svh | 5 | **1** (hero Domova, povolená výnimka) |
| predimenzované fotky | 9 → 24 (po zoznamoch) | **0** |
| `<img>` bez `width`/`height` | 0 | 0 |
| nenačítané fotky | 0 | 0 |
| vodorovné pretečenie | 0 | 0 |

**Iterácia 1 — pätička.** Zoznam deviatich služieb (~400 px v jednom stĺpci)
je v DOM až od 640 px; na telefóne je `Služby` položkou navigácie hneď nad tým
a výpis je jeden tap ďaleko. Meraná aj alternatíva „dva stĺpce mien“: ušetrila
127 px, skrytie 400 px, a pod 844 px sa dalo dostať len s ním. Navigácia a NAP
sú na mobile dvojstĺpcové, odsadenia mobilné. NAP sa neobetoval (A4).

**Iterácia 2 — služby.** Nový `kit/RiadokSluzby.jsx`: miniatúra 96 x 64, krátke
meno, jedna veta, šípka, výška riadku 97–101 px. `KartaSluzby` sa pod 640 px
nerendruje ako karta, ale ako tento riadok — prepína to hook `useSirsieAko`,
nie `sm:hidden`, lebo dva markupy nad sebou by telefón obidva stiahol aj
s fotkami. Domov, `/sluzby` aj „Súvisiace služby“ majú odteraz ten istý útvar.
Mriežka nebola alternatíva: mená v polovičnej šírke majú štyri riadky.

**Iterácia 3 — triptychy.** Nový `kit/PasKariet.jsx`: pod 640 px vodorovný pás
so `scroll-snap`, od 640 px pôvodná mriežka. Karta 78 vw, `touch-action: pan-y`,
bleed cez záporné okraje. **Nález:** bez `scroll-padding-inline` zarovná
`snap-start` prvú kartu na hranu okna a nie na os kontajnera — pás sa sám
odroluje o šírku odsadenia (namerané: karta na x = 0 namiesto x = 20).
Sticky stoh na Domove ostal (je to jediný „wow“ stránky, E1), len karta má na
mobile 52 svh namiesto 62 svh, takže je pod hranicou 60 svh.

**Iterácia 4 — galérie.** `/realizacie` má na telefóne dva stĺpce namiesto
jedného (6 075 px → 2 611 px za sekciu), zoznam miest tiež. Na Domove stoja
dve štvorcové fotky vedľa seba namiesto pod sebou.

**Iterácia 5 — médiá.** Nový priečinok `public/assets/240/` (deväť dlaždíc
služieb, spolu 148 kB) a `srcSetPre(..., s240)`; miniatúra 96 px už neťahá
originál 600 px. `SIZES_MRIEZKA` opravené z `100vw` na `50vw` pod 1024 px —
po prechode na dva stĺpce by inak pýtalo dvojnásobne veľký zdroj (najčastejšia
chyba pri `srcset`). **Videá overené, nie predpokladané:** na 1440 px majú obe
`readyState` 4, `paused: false`, `currentTime` 3,2 s a `muted`/`loop`/
`playsInline`/`poster` sú nastavené; na 390 px sa `<video>` nemontuje (C5)
a poster je načítaný obrázok (960 px zdroj do 390 px slotu), nie čierna plocha.
**Rozhodnutie o videu na mobile:** hero má 2 614 kB a značenie 2 758 kB, teda
obe nad rozpočtom 1,5 MB, a C5 v `STANDARDY.md` hovorí „video len ≥ 1024 px“.
Poster ostáva; keď vznikne kratšia slučka pod 1,5 MB, dá sa to prehodnotiť.

**Iterácia 6 — typografia a rytmus.** Telo textu na mobile nikde pod 16 px
(perex v riadku služby a veta v pätičke boli 14 px), žiadny nadpis nad tri
riadky na 390 px (meno postupu v stohu malo päť, titulok novinky štyri).
`--section-padding-y` je pod 640 px 64 px namiesto 80 px a
`--hlavicka-vyska` na telefóne 28 rem namiesto 34 rem — hlavička podstránky
zaberala 64 % obrazovky; najdlhší titul má aj tak štyri riadky a vzduch pod
lištou.

**Čo ostalo nad 1 700 px a prečo** (3 sekcie z 25): sticky stoh na Domove
2 008 px — kratší by zabil scrub, ktorý je jediným pohybovým prvkom stránky;
galéria realizácií 2 611 px — je to dvanásť dlaždíc v dvoch stĺpcoch, filtre
a mapa miest, ďalšie skracovanie by znamenalo schovať obsah za tap; formulár
na `/kontakt` 1 845 px — päť polí so 16 px písmom sa kratšie neurobí (D3).
Cieľ „≤ 9 obrazoviek“ na Domove sa nedosiahol (11,0): zvyšná výška sú textové
pásma, nie fotky, a ich skracovanie je rozhodnutie o obsahu, nie o rozložení.

**Desktop is sacred (D4).** Pixel-diff 1440 px, 8 strán, pred vs. po: sedem
strán bajt na bajt zhodných, Domov 95 225 px (0,76 %) — to je šum animovaného
`GradientMesh` v pätičke, overený dvomi zábermi toho istého buildu. Zmeny sú
všetky v `sm:`/`max-width: 639px` vetvách.

Audit celého webu po zmenách: **269/269 OK, 0 ❌** (17 ciest).
