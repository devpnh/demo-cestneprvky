# ÚPRAVA demo-cestneprvky v4 — popup, Služby bez kruhu, mobilná responzivita (2026-08-24)

> Skopíruj celý súbor do Claude Code v `~/Desktop/pnh_media/demogen`. Tri úlohy, nič
> viac: (A) popup „Dohodnúť obhliadku" — rovnaká funkcia ako na pôvodnom webe, nový
> dizajn; (B) sekcia Služby — desktop: fotka von z kruhu, normálny obdĺžnik s overlay
> efektom, popis vľavo ostáva ako je; mobil: rovnomerné karty (1 karta = 1 služba
> s fotkou a popisom) s horizontálnym swipe; (C) plná mobilná responzivita — teraz je rozbitá.
> Nezávislé od `PROMPT-v3-redesign.md`; ak už bežal, formulárový komponent z jeho
> §2.3 zdieľaj s popupom (jeden `ZadanieForm`), nič nerob dvakrát.

---

## 0. Kde to žije

| | |
|---|---|
| Site | `./` (build `npm run build`, náhľad `npx vite preview --port 4320 --strictPort` → `http://localhost:4320/demo-cestneprvky/`) |
| Sekcie | `src/sections/*.jsx` · tokeny `src/styles/tokens.css` · primitívy `src/components/primitives/` · shadcn `src/components/ui/` |
| Štandardy | `poznamky/STANDARDY.md` — čítaj PRED prvou zmenou |
| Audit | `node poznamky/audit.mjs --shots poznamky/shots --tag v4-iterN` (aktuálne 33 kontrol; §4 pridáva 3 — ak medzitým bežal PROMPT-v3, čísluj od jeho stavu) |
| Loop | `QUALITY-LOOP.md` §5/§6, log do `QUALITY-LOG.md` |
| Job | id `4daa0bdb-77b8-4dec-87a7-d4a899e8ecd4`, server `http://127.0.0.1:3117` |

Publish neskúšať (viditeľnosť repa) — len poznámka do logu.

## 1. NAJPRV: baseline

Full-page 1440 + 390 + 768 (`--tag v4-baseline`). Y-pásma sekcií, ktoré sa nemenia:
hero (mení sa len cieľ CTA), Realizácie, O nás, Kontakt + footer, Debarierizácia na
1440 (na mobile sa mení — §2.3). Po každej iterácii pixel-diff výrezov pásiem na
1440 voči baseline. Desktop is sacred: mobilná oprava = len breakpoint < 1024.

---

## 2. TRI ÚLOHY (vykonaj v poradí C → B → A)

### 2.A Popup „Dohodnúť obhliadku" (funkcia z pôvodného webu, nový dizajn)

**Predloha:** pôvodný web cestneprvky.sk má na každej stránke Elementor popup
„Dohodnúť stretnutie" s kontaktným formulárom, otváraný CTA v headeri (vidno ho
v scrape — `facts.json` má jeho text na začiatku každej stránky). Funkcia sa
preberá, dizajn NIE — žiadne preberanie Elementor vzhľadu.

**Nová podoba:** modal dialóg v house štýle nad `src/components/ui/dialog.jsx`
(Radix — focus trap, Esc, aria zadarmo), prestylovaný:
- panel: biele pozadie, vlasový rám `--color-border`, `--radius-md`, mono eyebrow
  „DOHODNÚŤ OBHLIADKU", H3 „Pošlite zadanie, vrátime sa s termínom obhliadky";
  **žiadny box-shadow** (zákaz STANDARDY) — oddelenie od pozadia rieši scrim:
  plná farba `--color-surface-2` s opacitou ~60 %, bez blur závislosti;
- obsah = `ZadanieForm` (zdieľaný komponent `src/components/ZadanieForm.jsx`):
  select Typ prvku (9 služieb + „Iné"), input Miesto, textarea Rozsah a popis,
  pole E-mail alebo telefón (aspoň jedno povinné), submit „Odoslať zadanie".
  Endpoint cez env (Formspark konvencia PNH); kým nie je, submit zobrazí success
  panel v dialógu („Ďakujeme, ozveme sa s termínom obhliadky." + poznámka demo
  režimu), bez reloadu;
- mobil < 640 px: dialóg ako celoobrazovkový sheet (100dvh, obsah scrolluje,
  zatváracie tlačidlo 44 px vpravo hore); od 640 px centrovaný panel max-w ~34rem;
- motion: fade + scale 0.98→1 cez `--ease-house`/`--duration-fast`; pri
  `prefers-reduced-motion` bez transformácie, len okamžité zobrazenie; scroll za
  dialógom zamknutý (Radix), pozor na koexistenciu s Lenis — pri otvorení Lenis
  `stop()`, pri zatvorení `start()`.

**Zapojenie (všetky CTA, ktoré dnes vedú na `#kontakt` alebo mailto s významom
„dohodnúť obhliadku"):** header „Dohodnúť obhliadku", hero „Dohodnúť obhliadku
a cenu", CTA v mobilnom menu (menu najprv zavrieť), tlačidlo v Kontakt sekcii;
v Službách „Konzultovať konkrétny prvok so zadaním" otvára popup s predvyplneným
Typom prvku = aktívna služba. `mailto:`/`tel:` odkazy na kontaktoch ostávajú ako
sekundárna cesta. „Pozrieť realizácie" sa nemení.

**Merateľne:** klik na každé z 5 CTA otvorí dialóg (Playwright); Esc aj scrim ho
zavrú; fokus sa vráti na CTA; za otvoreným dialógom sa stránka nescrolluje;
0 box-shadow; select má predvyplnenú hodnotu pri otvorení zo Služieb.

### 2.B Služby: fotka von z kruhu — obdĺžnik s overlay efektom, popis vľavo ostáva

**Stav:** `Sluzby.jsx` (desktop vetva `lg:`) renderuje „kruhový objazd": SVG
prstenec-vozovka, stredová fotka v `rounded-full` (316 px) a 9 obiehajúcich
kruhových miniatúr 56 px s `orbit-anim` rotáciou. Fotky 600×390 sú orezané do
kruhov, miniatúry sú na nerozoznanie a celé sa to točí.

**Zmena — len pravý stĺpec, ľavý popisový blok (progress vlások, skupina, H3,
popis, miesto + `n / 9`) ostáva presne ako je, vrátane stavovej logiky
(auto-postup 4 s, hover pauza, klik zamkne — nemeniť):**
- kruhový objazd celý von: SVG prstenec, stredový `rounded-full` ostrov,
  obiehajúce buttony aj `orbit-anim`/`orbit-anim-rev`/`orbit-paused` CSS (zmaž aj
  ich definície v štýloch);
- namiesto toho obdĺžniková fotka: `aspect-[3/2]` (zdroje sú 600×390) na plnú
  šírku pravého stĺpca, `--radius-sm`, vlasový rám; všetkých 9 fotiek vrstvených
  ako doteraz v strede kruhu (crossfade `opacity` + jemný `scale 1.04→1` pri
  prepnutí, `--duration-base`, `--ease-house`; reduced-motion = okamžite);
- **overlay efekt na fotke:** scrim gradient zdola (transparent →
  `--color-surface-2` ~70 %) a v ňom overlay popisok: mono uppercase miesto
  (`aktivna.miesto`) vľavo dole + `n / 9` vpravo dole — na fotke, nie pod ňou.
  Duplicitný riadok miesto + počítadlo v ľavom stĺpci potom ZMAŽ (ostáva len na
  fotke, nech nie je dvakrát). Biela na scrime musí mať kontrast ≥ 4,5:1 —
  over pixelovo ako pri hero;
- **selektor namiesto obiehajúcich krúžkov:** pás 9 obdĺžnikových miniatúr pod
  fotkou (grid 9 stĺpcov, gap 2, `aspect-[3/2]`, `--radius-sm`): aktívna = plná
  opacita + 2 px akcentový spodný šev, neaktívne stlmené (opacity ~55 %, hover
  100 %); `onMouseEnter`/`onFocus` prepína, klik zamkne — presne dnešné správanie
  buttonov z objazdu, len iná geometria; tap/klik plocha ≥ 44 px na výšku
  vrátane švu;
- **Mobil (< 1024 px) — rovnomerné karty so swipe (týka sa LEN mobilnej vetvy,
  desktop rieši len text vyššie):** dnešný zoskupený zoznam so 72 px náhľadmi
  nahraď horizontálnym kartovým carouselom: 9 rovnakých kariet, jedna karta =
  jedna služba. Karta: fotka `aspect-[3/2]` hore na plnú šírku karty
  (`--radius-sm`), pod ňou mono eyebrow skupiny (Debarierizácia a značenie /
  Konštrukčné prvky vozovky / Povrchy a údržba), H3 názov, popis, mono riadok
  miesta dole. Rovnomernosť: všetky karty rovnaká šírka ~78vw (strop ~20rem)
  a rovnaká výška (flex kontajner, `items-stretch`; miesto pripnuté k spodku
  karty cez `mt-auto`, rozdielne dĺžky popisov nesmú rozhádzať výšky);
- swipe natívne, bez JS carouselu a bez autoplay: kontajner `overflow-x-auto`
  so `scroll-snap-type: x mandatory`, karty `snap-start`, skrytý scrollbar
  (`scrollbar-width: none` + webkit ekvivalent); prvá karta zarovnaná s ľavým
  okrajom containeru, vpravo vykúka kus ďalšej karty (peek ~12 %, nech je
  swipe zrejmý); žiadne šípky ani bodky — pod carouselom vlasový progress
  (2 px, akcent) mapovaný na scrollLeft a mono počítadlo `n / 9` podľa
  najbližšej snapnutej karty;
- vertikálny scroll stránky sa nesmie uniesť (natívny overflow to rieši —
  over v emulácii touch scrollom cez kartu); `document.documentElement.scrollWidth`
  musí ostať 390 — scrolluje kontajner, nie stránka; reduced-motion: bez
  rozdielu (nič sa samo nehýbe).

**Merateľne:** v Sluzby.jsx 0× `rounded-full`, 0× `orbit`; desktop: fotka
`aspect-[3/2]` so scrimom a popiskom na fotke, 9 miniatúr, aktívna sa mení
hoverom aj auto-postupom, ľavý stĺpec pixelovo zhodný s baseline OKREM zmazaného
riadku miesto/počítadlo; mobil 390: 9 kariet s rovnakou šírkou aj výškou
(tolerancia ±2 px), snap na kartu, viditeľný peek ďalšej karty, progress sa
hýbe pri swipe, scrollWidth dokumentu = 390.

### 2.C Mobilná responzivita — Debarierizácia je na mobile nečitateľná (kritické)

**Dôkaz (live viewport screenshoty 390×844 vnútri pásma, `shots/v4-evidence-live-390-deb-*.jpeg`,
celé stránky `shots/v4-evidence-390-full.jpeg` a `-1440-full.jpeg`; over si vlastnými):** `Debarierizacia.jsx` renderuje
Panel cez `StickySection heightVh={220}` a `StickySection.jsx:32` pinuje obsah do
boxu `height: 100vh; overflow: hidden`. Panel je na 390 px vysoký ~1114 px
(jednostĺpcová vetva: nadpis + odsek + citát + ÚNSS + fotka 4:3 + chips +
progress), viewport má 844 px — `items-center` vycentruje stĺpec a **oreže ~135 px
zhora aj zdola: H2 „Bezbariérové prvky bez zásahu…" nie je vidieť VÔBEC (schovaný
pod bielym headerom), chips a progress pod fotkou tiež nikdy**. Používateľ
scrolluje ~1000 px cez zamrznutý orezaný obsah a potom cez prázdnu tmavú plochu.
To isté platí na 768 (breakpoint `lg` = 1024).

**Zmena:**
- pod 1024 px sa Debarierizácia renderuje ako normálna tečúca sekcia BEZ
  StickySection a BEZ scroll-scrubu: eyebrow, H2, odsek, citát, ÚNSS odkaz, JEDNA
  fotka (prvý záber; bez scroll-linked opacity — statická, prípadne jednoduchý
  crossfade na časovači NEROBIŤ, drž to ticho), chips ako obyčajný wrap zoznam
  s plnou opacitou, bez progress vláska. `py-[var(--section-padding-y)]`, výška
  sekcie = výška obsahu;
- od 1024 px StickySection presne ako dnes — desktop pásmo je schválené, pixel-diff
  1440 voči baseline musí byť čistý;
- implementačne: `matchMedia('(min-width: 1024px)')` prepínač v Debarierizacia.jsx
  (SSR nie je v hre, Vite SPA), NIE CSS-only skrývanie dvoch StickySection
  stromov (scrub s [0,1] rozsahmi nesmie bežať v skrytom strome — E3);
- **po oprave prejdi CELÚ stránku na 390 aj 768** (full-page sweep + viewport
  kontroly každej sekcie) a oprav, čo ešte nájdeš orezané, pretečené alebo
  neklikateľné: scrollWidth = šírka viewportu, tap targety ≥ 44 px, žiadny obsah
  odrezaný `overflow: hidden` pinom, H2 každej sekcie plne viditeľný pri scrole.
  Nálezy zapíš do logu jednotlivo (čo, kde, oprava) — „mobil je v poriadku"
  bez dôkazov sweep screenshotmi neplatí.

**Merateľne:** na 390 aj 768 je H2 Debarierizácie plne viditeľný, chips viditeľné,
výška `#debarierizacia` ≈ výška obsahu (žiadny 220vh track); na 1440 pixel-diff
pásma = čistý; scrollWidth 390 = 390, 768 = 768.

---

## 3. Proces

Poradie C → B → A (najprv rozbitý mobil, potom prestavba Služieb, popup nakoniec —
zapája sa aj do novej Sluzby CTA). Po každej úlohe: build zelený, audit, full-page
1440/390/768 `--tag v4-iterN`, pixel-diff nedotknutých pásiem. Reduced-motion: nové
prvky bez pohybu. Scroll-linked `useTransform` rozsahy prísne rastúce v [0, 1] (E3
— inak prázdna stránka). `chassis/` sa nedotýka; `StickySection.jsx` nemeň — prepínaj
jej POUŽITIE v sekcii.

## 4. Audit rozšíriť (+3, všetky musia prejsť 2× po sebe)

- **DIALOGv4:** 5 CTA otvára dialóg; Esc + scrim zatvárajú; fokus sa vracia;
  `document.body` sa za otvoreným dialógom nescrolluje; v dialógu 0 box-shadow;
  zo Služieb predvyplnený select.
- **SLUZBYv4:** v `#sluzby` na 1440: 0 elementov s `border-radius: 999px`/`9999px`
  mimo headerových pill tlačidiel; fotka s pomerom 3:2; overlay popisok kontrast
  ≥ 4,5:1 (pixelovo); 9 miniatúr. Na 390: carousel má 9 kariet, šírky aj výšky
  kariet zhodné (±2 px), `scroll-snap-type` nastavený, kontajner scrollovateľný
  (scrollLeft po programovom scrole > 0), scrollWidth dokumentu = 390.
- **MOBv4:** na 390 aj 768: H2 `#debarierizacia` má `getBoundingClientRect` plne
  vo viewporte pri scrole na sekciu; výška sekcie < 1,6× výška obsahu panelu;
  scrollWidth = šírka; tap targety ≥ 44 px.

## 5. Zákazy (nemenia sa)

- Fakty doslova; žiadne vymyslené údaje; copy formulára bez pomlčiek.
- Paleta: akcent len `#F03314`; žiadne cudzie hexy, box-shadow, rezy ≥ 700,
  01/02/03 dekor, marquee, wheel-hijack, `scroll-behavior: smooth`.
- Hero (okrem cieľa CTA), Realizácie, O nás, Kontakt obsah + footer: bez zmeny;
  Debarierizácia na 1440 bez zmeny.
- Ľavý popisový blok Služieb: bez zmeny okrem zmazaného riadku miesto/počítadlo
  (§2.B).
- Publish neskúšať.

## 6. Log a handover

`QUALITY-LOG.md`: sekcia „2026-08-24 · v4 popup + Služby obdĺžnik + mobil" —
nálezy mobilného sweepu jednotlivo, overenia, screenshoty. Handover doplniť:
endpoint formulára (Formspark), a ak PROMPT-v3 ešte nebežal, poznámka že jeho §2.3
má po v4 už hotový `ZadanieForm` na osadenie do Kontakt sekcie.
