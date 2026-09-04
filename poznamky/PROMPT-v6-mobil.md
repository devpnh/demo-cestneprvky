# PROMPT v6 — mobilná verzia webu Cestné prvky (390 px je hlavná verzia, nie zmenšenina)

> Skopíruj celý súbor do Claude Code otvoreného v `~/Desktop/pnh_media/cestne_prvky`
> (bypass permissions). Je to jeden autonómny beh: Peter nesleduje terminál. **Konaj,
> nepýtaj sa.** Zastav sa iba pri rozhodnutí, ktoré mení fakty klienta alebo je nezvratné
> mimo tohto stroja. Reportuj číslami zo skriptu v §7, nie vetami typu „zlepšil som mobil“.

---

## 0. Čo sa má stať (jedným odsekom)

Web je na desktope hotový a na telefóne sa **rozpadol na nekonečný scroll obrovských
fotiek po jednej**. Domov má na 390 × 844 px **13,1 obrazovky**, pätička sama **1,66
obrazovky**, jedna sekcia realizácií **7,2 obrazovky**. Nič nie je rozbité — audit
D1/D2/D3 prechádza — ale skladba je desktopová a na telefóne z nej ostal stĺpec
celoplošných obrázkov. Úloha: **prekomponovať mobilné rozloženie** (nie prefarbiť,
nie zmenšiť), aby pätička sedela na jednu obrazovku, aby fotky mali na telefóne vlastný
útvar (skupiny namiesto jednej obrovskej za druhou), aby deväť služieb malo mobilné
rozloženie, ktoré sa dá prejsť palcom, a aby sa **overilo meraním, že sa fotky a videá
naozaj načítajú a prehrávajú** — nie že sú v DOM. Desktop 1440 px sa nesmie pohnúť
ani o pixel.

---

## 1. Povinné čítanie PRED prvým krokom

1. `poznamky/STANDARDY.md` — celý; kľúčové sú **D1–D6 (mobil)**, **C1–C7 (hero, video)**,
   **F1–F4 (výkon, médiá)**. Každý bod je riadok auditu.
2. `poznamky/QUALITY-LOG.md` — čo sa v tomto projekte reálne kazilo na mobile
   (min-w tabuľky, rotované dekorácie → overflow, backdrop-filter vs fixed).
3. `poznamky/PROMPT-v4-popup-sluzby-mobil.md` — predošlé mobilné kolo; **nezopakuj,
   čo tam už je vyriešené** (dialóg obhliadky, mobilné menu).
4. `~/Desktop/Vaults/me/06-Working-with-Claude.md` §2 Design taste, §3 Hard rules.
5. Doc-komentáre v súboroch, ktoré ideš meniť. **Každý nesie dôvod, prečo to tak je**
   (napr. `PasVyzvy.jsx` — prečo stĺpce sedia na stredoch; `Footer.jsx` — prečo pätička
   nemá skladbu hero). Ak dôvod prepíšeš, prepíš aj komentár a doplň dátum.

Pri konflikte platí zdroj, nie tento prompt — a rozdiel zapíš do `QUALITY-LOG.md`.

---

## 2. Nameraný východiskový stav (390 × 844, `deviceScaleFactor: 3`, po dorolovaní)

| Stránka | Výška | Obrazoviek | Najvyššia sekcia | Fotiek | Fotiek > 60 % výšky | `<video>` |
|---|---|---|---|---|---|---|
| `/` | 11 054 px | **13,1** | 2 293 px (Ako to robíme) | 18 | 4 | 0 |
| `/o-firme` | 9 921 px | **11,8** | 2 097 px | 6 | 1 | 0 |
| `/realizacie` | 8 515 px | **10,1** | **6 075 px** (galéria) | 12 | 0 | 0 |
| `/sluzby` | 8 092 px | **9,6** | 2 114 px | 9 | 0 | 0 |
| `/sluzby/vodorovne-…` | 7 057 px | 8,4 | 1 810 px | 5 | 0 | 0 |
| `/kontakt` | 4 412 px | 5,2 | 1 861 px | 0 | 0 | 0 |
| `/novinky` | 2 946 px | 3,5 | 544 px | 0 | 0 | 0 |

**Pätička je na každej stránke 1 399 px = 1,66 obrazovky.** Skladá sa zo štyroch blokov
pod sebou (`grid-cols-1`): logo + veta, navigácia 5 položiek, **zoznam 9 služieb**,
NAP + podpis. Deväť služieb v jednom stĺpci je samo ~400 px.

**Videá na mobile neexistujú** — `<video>` sa podľa C5 rendruje až od 1024 px, na telefóne
je v DOM iba poster. To je zámer (2,3 MB súbor), ale **znamená to, že poster musí byť
plnohodnotný obraz, nie placeholder**, a že sa to musí overiť, nie predpokladať.

Čísla si na začiatku **prever skriptom z §7** (build sa medzitým mohol zmeniť) a zapíš
ako riadok „pred“ do `QUALITY-LOG.md`.

---

## 3. Externé štandardy, ktoré má mobilná verzia spĺňať

Nie sú to názory, sú to overiteľné pravidlá. Kde sa bijú s `STANDARDY.md`, platí prísnejší.

**Tap targety.** WCAG 2.2 SC 2.5.8 (AA) žiada minimum **24 × 24 CSS px**, AAA kritérium
2.5.5 žiada **44 × 44**. Apple HIG má **44 × 44 pt**, Material Design **48 × 48 dp**.
Pravidlo projektu: **44 px na všetkom, čo je primárna akcia** (CTA, telefón, položka menu,
riadok služby, dlaždica realizácie) a **nikdy menej než 24 px + 24 px odstup** na čomkoľvek
klikateľnom. To je prísnejšie než D2 a D2 tým nie je porušené.
· [WCAG 2.5.8 guide](https://testparty.ai/blog/wcag-target-size-guide)
· [Prehľad veľkostí](https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/)

**Výška viewportu.** `100vh` na mobile klame (URL bar). `svh` je bezpečný default pre hero
a plochy, ktoré sa musia zmestiť celé; `lvh` pre modály; `dvh` prepočítava pri scrolle a
spôsobuje preskoky, takže **nie je default**. Podpora nad 90 %. Na fixné lišty a spodné
akčné riadky pridaj `env(safe-area-inset-*)`. Projekt už `100svh` používa (C1) — skontroluj,
či sa niekde nevrátilo `vh`, a či `--hlavicka-vyska` (34 rem) nie je na 390 px zbytočne
vysoká vzhľadom na to, čo v nej stojí.
· [svh/lvh/dvh guide](https://csstoolkit.net/blog/css-dvh-svh-lvh-guide/)

**Video na telefóne.** Autoplay funguje len s `muted` + `playsinline` + `loop`; bez
`playsinline` iOS vytiahne video na celú obrazovku. **Low Power Mode autoplay zablokuje
vždy a vývojár s tým nič nespraví** — preto musí byť `poster` plnohodnotný obraz, ktorý
sám o sebe drží kompozíciu. Video bez `poster` ukáže čiernu plochu.
· [iOS autoplay a poster](https://www.sitelint.com/blog/fixing-html-video-autoplay-blank-poster-first-frame-and-improving-performance-in-safari-and-ios-devices)

**Obrázky.** `sizes` sa musí zhodovať so skutočnou CSS šírkou — nesúlad je najčastejšia
chyba a spôsobí, že prehliadač stiahne zlý variant a `srcset` je zbytočný. Bez `sizes`
prehliadač počíta `100vw`. Vždy `width` + `height` (rezervácia miesta → CLS blízko 0),
3–5 variantov odstupňovaných podľa veľkosti súboru.
· [srcset/sizes 2026](https://krunkit.me/blog/responsive-images-complete-guide)

**Core Web Vitals.** LCP < 2,5 s, INP < 200 ms, CLS < 0,1, merané na 75. percentile
reálnych návštev; prahy sú na mobile rovnaké ako na desktope, ale prejsť nimi je ťažšie
(mobilná úspešnosť LCP 62 %). Meraj na produkcii, nie na localhoste (F3).
· [Core Web Vitals 2026](https://www.corewebvitals.io/core-web-vitals)

---

## 4. Čo prerobiť

### 4.1 Pätička na jednu obrazovku

**Cieľ: ≤ 844 px na 390 × 844, teda ≤ 1,0 obrazovky** (dnes 1 399 px).

Pätička je na každej z 8 strán, takže je to najlacnejších ušetrených 555 px na webe.
Obsah sa nesmie stratiť — má sa presunúť alebo zhustiť:

- **Zoznam 9 služieb** je na mobile najväčší blok. Buď dve kolóny mien v malom reze
  (mená služieb sú dlhé — over, či sa nelámu do troch riadkov), alebo jeden odkaz
  **„Všetky služby →“** a zoznam ostáva len od `sm:` vyššie. Vyber podľa merania, nie
  podľa dojmu; obe varianty odfoť a čísla daj do logu.
- **NAP** (adresa, telefón, e-mail) ostáva vždy a celý — je to jediný kontakt na konci
  stránky a A4 žiada viditeľný `tel:`.
- Logo + veta, navigácia a podpis sa zmestia; skráť `py` na mobile
  (`--section-padding-y-sm` je desktopová hodnota) a `gap-10` na mobile zmenši.
- Ak by sa to nezmestilo bez obete, obetuj **duplicitnú navigáciu**, nie NAP.

Nesmie sa pritom porušiť: pätička je tmavá a pásmo nad ňou svetlé (B5), pozadie má dve
vrstvy (`GradientMesh` + `ZnacenieMotiv`) a tie ostávajú, tapovacie výšky ≥ 44 px.

### 4.2 Koniec so scrollom obrovských fotiek

**Cieľ:** `/` ≤ 9 obrazoviek, `/o-firme` a `/realizacie` ≤ 8, ostatné ≤ 6, a **žiadna
sekcia nad 1 700 px** na 390 px (dnes je nad tým šesť sekcií, jedna má 6 075 px).

Pravidlá pre fotky na mobile:

- **Žiadny obrázok vyšší než 60 svh**, s jedinou výnimkou hero na Domove.
  Dnes sú na Domove štyri také a tri z nich sú 350 × 523 px pod sebou — presne ten
  „scroll obrovských fotiek po jednej“.
- **Tri a viac fotiek vedľa seba na desktope = jeden útvar aj na mobile**, nie tri
  celoplošné pod sebou. Použi jedno z dvoch, podľa toho, čo sekcia hovorí:
  - **vodorovný scroller so `scroll-snap`** (`snap-x snap-mandatory`, karta ~78 vw,
    viditeľný kúsok ďalšej karty ako signál, že sa dá ťahať) — pre rovnocenné zábery;
  - **mriežka 2 × N s pomerom 4:3** — pre katalógový výpis, kde sa fotky prezerajú,
    nie čítajú.
  Scroller nesmie chytať zvislý scroll (`touch-action: pan-y`) a nesmie spôsobiť
  vodorovné pretečenie dokumentu (D1).
- **Celoplošný záber je predel, nie výplň**: najviac jeden na stránku, a len tam, kde
  oddeľuje dve témy.
- Pomery: na mobile **4:3 alebo 3:2**, nie 2:3 na výšku. Portrétová fotka na portrétovom
  telefóne zožerie celú obrazovku a čitateľ z nej nič nemá.

### 4.3 Rozloženie deviatich služieb na mobile

Dnes je výpis služieb 2 114 px. Na telefóne má byť **zoznam riadkov, nie mriežka dlaždíc**:

- riadok = **štvorcová miniatúra 56–72 px** vľavo, **názov služby** vedľa (jeden alebo
  dva riadky, nikdy tri) a pod ním **jedna veta „pre koho / kedy“**; celý riadok je
  odkaz s výškou ≥ 72 px, teda pohodlne nad 44;
- deliaca vlasová linka medzi riadkami, žiadne rámy okolo každého riadku (B2, B6);
- **prečo nie mriežka 2 × 5 dlaždíc:** názvy sú dlhé („Značenie pre nevidiacich
  a slabozrakých“, „Odstránenie starého vodorovného dopravného značenia“) a v polovičnej
  šírke sa lámu na tri až štyri riadky, takže mriežka nie je nižšia, len drobnejšia
  a menej čitateľná. Ak sa rozhodneš inak, dolož to screenshotom oboch variantov a číslami.
- Deväť riadkov po ~96 px = ~870 px ≈ 1 obrazovka namiesto 2,5.

To isté rozloženie použi všade, kde sa služby vypisujú (Domov, `/sluzby`, súvisiace
služby v detaile, pätička), aby sa čitateľ učil jeden útvar, nie tri.

### 4.4 Fotky a videá — over, že sa naozaj prehrávajú

Nestačí, že sú v DOM. Skript v §7 musí vypísať a ty musíš opraviť:

- **Každý `<img>`**: `naturalWidth > 0` (načítal sa), `width` + `height` v HTML,
  `sizes` zodpovedá skutočnej vykreslenej šírke (tolerancia 1,5×; väčší nesúlad =
  chyba), mimo LCP `loading="lazy"`, `alt` neprázdny alebo `aria-hidden` (F4).
  **Nájdi predimenzované súbory**: ak `naturalWidth > 2 × (CSS šírka × DPR)`, telefón
  ťahá zbytočné bajty — doplň menší variant do `srcset`.
- **Každé `<video>`** na 1440 px: po 2 s `readyState ≥ 3`, `paused === false`,
  `currentTime > 0`. Ak je `paused`, autoplay bol odmietnutý → poster musí ostať
  viditeľný a nesmie tam byť čierna plocha.
- **Na 390 px** over, že sa namiesto videa vykreslil **poster ako obrázok** a že to nie
  je prázdny obdĺžnik: `naturalWidth > 0` a vypočítaná farba plochy sa nerovná čistej
  čiernej.
- **Rozhodni, či hero video pustiť aj na mobile.** Dnes nie (C5, 2,3 MB). Ak sa dá
  pripraviť varianta ≤ 1,5 MB s kratšou slučkou, pusti ju **len** pri
  `navigator.connection.effectiveType === '4g'`, bez `saveData` a bez
  `prefers-reduced-motion`; inak ostáva poster. Ak taká varianta nevznikne, **nechaj to
  tak a napíš dôvod do doc-komentára** — poster je legitímne riešenie, nie nedostatok.
- `muted playsInline loop preload="metadata" poster="…"` na každom videu bez výnimky.

### 4.5 Typografia, formuláre, drobnosti

- Telo textu na mobile **≥ 16 px**, inputy tiež (D3 — iOS inak zoomuje).
- Riadková miera na 390 px **45–60 znakov**; kde je `max-w-[52ch]` a stĺpec je aj tak
  úzky, je to v poriadku, ale over reálny počet znakov na riadok.
- Nadpisy: `clamp()` tak, aby najdlhší nadpis nemal na 390 px viac než tri riadky.
- Skontroluj `--hlavicka-vyska` na mobile: 33 rem = 528 px je 63 % obrazovky pre štítok,
  titul a linku. Ak sa dá zmenšiť bez toho, aby titul dosadol na hlavičku, zmenši.
- Žiadny `hover`-only stav bez `:focus-visible` ekvivalentu (na telefóne hover neexistuje).

---

## 5. Čo sa nesmie stať

- **Desktop is sacred (D4).** 1440 px musí byť po zmene pixelovo identický. Pred prvou
  zmenou si urob referenčné screenshoty všetkých 8 strán na 1440 a po každej iterácii
  ich porovnaj (PIL/pixelmatch diff). Nenulový diff bez zámeru = revert.
  Mobilné opravy patria do `max-lg:` / `sm:` vetiev, nie do základných tried.
- **Žiadne nové fakty, čísla, certifikáty ani texty** (A3). Ak by nové rozloženie
  potrebovalo vetu, ktorú nemáme, použi existujúcu z `src/content/` alebo `[DOPLNÍ KLIENT: …]`.
- **Žiadne nové knižnice** na karusel, lightbox ani gestá. `scroll-snap` a CSS grid
  stačia; v projekte už je `motion/react`.
- **Žiadne tiene, žiadne číslované dlaždice, žiadny cudzí hex** (B1–B3).
- Žiadny `dvh` ako default, žiadny `100vh`, žiadny `scroll-behavior: smooth` (E4).
- Nezmenšuj rozlíšenie fotiek, ktoré klient vníma ako ostré — len pridaj menšie varianty
  do `srcset` (F2).

---

## 6. Poradie práce

Maximálne **3 zmeny na iteráciu**, po každej zelený build a to isté meranie (G2):

1. **Meranie „pred“** + referenčné desktopové screenshoty.
2. **Pätička** (§4.1) — najväčší zisk, najmenšie riziko, dotýka sa všetkých strán.
3. **Služby** (§4.3) — jeden útvar, potom ho rozvez na všetky štyri miesta.
4. **Fotky a rytmus** (§4.2) — Domov, potom `/o-firme`, potom `/realizacie`.
5. **Médiá** (§4.4) — overenie a opravy `srcset`/`sizes`/`poster`.
6. **Detaily** (§4.5).
7. **Meranie „po“**, audit, `QUALITY-LOG.md`.

Každá iterácia = jeden riadok v `QUALITY-LOG.md`: čo, prečo, číslo pred → číslo po.

---

## 7. Merací skript (spusť ho pred prvou zmenou aj po každej iterácii)

Preview beží na `npm run build && npm run preview -- --port 4177`, base je
`/demo-cestneprvky/`. Skript ulož do scratchpadu, **nie do repa**.

```js
import { chromium } from 'playwright'
const b = await chromium.launch()
const R = ['', 'sluzby', 'realizacie', 'o-firme', 'novinky', 'kontakt',
           'sluzby/vodorovne-dopravne-znacenie', 'sluzby/zalievkove-a-vyspravkove-hmoty']
for (const r of R) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 })
  await p.goto(`http://localhost:4177/demo-cestneprvky/${r}`, { waitUntil: 'networkidle' })
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } scrollTo(0, 0) })
  await p.waitForTimeout(600)
  console.log(r || '/', JSON.stringify(await p.evaluate(() => {
    const vh = innerHeight, dpr = devicePixelRatio
    const secs = [...document.querySelectorAll('main section')].map(s => Math.round(s.getBoundingClientRect().height))
    const imgs = [...document.querySelectorAll('img')]
    const foot = document.querySelector('footer')
    return {
      obrazoviek: +(document.documentElement.scrollHeight / vh).toFixed(1),
      patickaObrazoviek: +(foot.getBoundingClientRect().height / vh).toFixed(2),
      sekcieNad1700: secs.filter(h => h > 1700),
      fotkyNad60vh: imgs.filter(i => i.getBoundingClientRect().height > vh * 0.6).length,
      nenacitane: imgs.filter(i => !i.naturalWidth).map(i => i.currentSrc || i.src),
      bezRozmerov: imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
      predimenzovane: imgs.filter(i => { const w = i.getBoundingClientRect().width; return w && i.naturalWidth > 2 * w * dpr }).length,
      overflow: document.documentElement.scrollWidth - innerWidth,
    }
  })))
  await p.close()
}
await b.close()
```

Na 1440 px k tomu over videá:

```js
const v = document.querySelector('video')
;({ ready: v?.readyState, paused: v?.paused, cas: v?.currentTime })  // po 2 s: readyState ≥ 3, paused false, cas > 0
```

A na záver **celý projektový audit**: `node poznamky/audit.mjs --url http://localhost:4177/demo-cestneprvky`
(trvá ~2 min, 17 ciest). Musí skončiť na **0 ❌**.

---

## 8. Hotovo, keď

| Kontrola | Pred | Cieľ |
|---|---|---|
| Pätička na 390 px | 1 399 px (1,66 obr.) | **≤ 844 px (1,0 obr.)** |
| `/` celková výška | 13,1 obr. | **≤ 9 obr.** |
| `/o-firme`, `/realizacie` | 11,8 / 10,1 obr. | **≤ 8 obr.** |
| ostatné strany | 3,5–9,6 obr. | **≤ 6 obr.** |
| sekcie nad 1 700 px | 6 | **0** |
| fotky nad 60 svh | 4 na `/` | **0 mimo hero** |
| nenačítané fotky | ? | **0** |
| `<img>` bez `width`/`height` | ? | **0** |
| predimenzované fotky (> 2× DPR) | ? | **0** |
| vodorovné pretečenie | 0 | **0 (drž)** |
| tap targety | ≥ 44 px | **≥ 44 px (drž)** |
| video na 1440: `paused` | ? | **false, `currentTime` rastie** |
| poster na 390 | v DOM | **načítaný, nie čierna plocha** |
| desktop 1440 pixel diff | — | **0 (mimo zámerných zmien)** |
| `node poznamky/audit.mjs` | 0 ❌ | **0 ❌** |
| Lighthouse mobile na produkcii | ? | **Perf ≥ 90, A11y ≥ 95, SEO ≥ 90, CLS < 0,1** |

Na koniec: 8 screenshotov 390 px (celá strana) a 8 na 1440 px pred/po, riadok
v `QUALITY-LOG.md` a v `~/Desktop/Vaults/claude_conversations/Sessions/` polstranová
poznámka problém → postup → výsledok.
