# HANDOVER — demo Cestné prvky s.r.o. (v5, 2026-08-25)

Čo je otvorené, čo potrebujeme od klienta a čo musí rozhodnúť Peter, kým demo pôjde ďalej.
Web je v `~/Desktop/pnh_media/cestne_prvky`, náhľad `npx vite preview --port 4320 --strictPort`
→ `http://localhost:4320/demo-cestneprvky/`.

---

## 1. Rozhodnutia pre Petra

### 1.1 Kontrast primárneho CTA (jediný nález Lighthouse v prístupnosti)
Biela na `#F03314` má **4,04:1**. `STANDARDY` B7 to povoľuje, lebo tlačidlo má 19 px pri reze 600
a pre veľký text platí limit 3:1 — je to vedomé rozhodnutie z iterácie 3 v auguste. `axe`
(a teda Lighthouse) však počíta „bold“ až od rezu 700, ktorý dizajnový systém zakazuje (B4),
takže hlási chybu a prístupnosť ostáva na **96** namiesto 100.

| Možnosť | Dôsledok |
|---|---|
| Nechať tak (dnešný stav) | Web spĺňa vlastný štandard, Lighthouse A11y 96, formálne AA pri prísnom čítaní nesplnené |
| Výplň `--color-accent-deep` `#c5250d` | 5,76:1, plné AA bez výnimky — ale mení sa firemná červená na najviditeľnejšom prvku |
| Text CTA na 24 px | 18 pt = veľký text pri každom výklade, brand ostáva — tlačidlo bude opticky ťažšie |

**Bez pokynu neurobím ani jedno.**

### 1.2 Priebeh spolupráce je náš návrh, nie klientov text
Sekcia „Ako prebieha spolupráca“ (`PROCES` vo `firma.js`) v podkladoch klienta **neexistuje** —
o priebehu zákazky nemá na webe ani vetu. Texty sú prepísané tak, aby klientovi nevkladali do úst
záväzok, ktorý nedal (žiadne lehoty, ceny ani spoločná preberačka), a vety o technológii sú zúžené
na prvky, pri ktorých ich pôvodný web naozaj tvrdí. **Klient musí štyri kroky potvrdiť alebo opraviť.**

### 1.3 Únia nevidiacich a slabozrakých Slovenska
Pôvodný web na ÚNSS **len odkazuje** ako na miesto, kde sa dajú získať konzultácie a stanoviská.
Prvá verzia dema z nej urobila „Partnera“ a „Spoluprácu“ — to je tvrdenie o tretej strane bez jej
vedomia a je opravené: blok sa volá „Kam po konzultáciu“ a hovorí o tom, čo robí Únia, nie o tom,
čo robíme s ňou. **Ak firma s ÚNSS naozaj spolupracuje, treba na to doklad a formuláciu potvrdiť.**

### 1.4 Publikovanie
Repo `devpnh/demo-cestneprvky` je verejné a Pages bežia. Push som **nespustil** — čaká na tvoje slovo
podľa pokynu „najprv lokálne, potom gh“.

---

## 2. Čo dopĺňa klient (18 položiek, všetky sú viditeľné aj na webe)

| # | Kde | Čo potrebujeme |
|---|---|---|
| 1 | Vodorovné značenie | mená európskych výrobcov materiálov ColdPlastic, ktoré smieme uviesť |
| 2 | Vodorovné značenie | fotografie cyklochodníka, opticko-akustickej brzdy a parkovacích boxov |
| 3 | Lepené obrubníky | fotografie lepených ostrovčekov, parkovacích dorazov a doplnkového materiálu |
| 4 | Lepené obrubníky | názov tmelu na báze akrylovej živice a jeho výrobca |
| 5 | Spomaľovače dopravy | potvrdiť riadok „Lepidlo“ v technickej tabuľke (pôvodný web nepriraďuje 1,0 kg jednoznačne k typu) |
| 6 | Spomaľovače dopravy | fotografie osadených retardérov (pri škole, v areáli, v autobusovom pruhu) |
| 7 | Zálievkové hmoty | technický popis Chipfill a Coldfill, postup aplikácie, teplotný rozsah, čas do sprejazdnenia |
| 8 | Zálievkové hmoty | prípady použitia a fotografie hotových opráv |
| 9 | Protišmykový náter | technický popis, materiály, hodnota protišmykovosti, hrúbka vrstvy, životnosť |
| 10 | Protišmykový náter | na aké povrchy a za akých podmienok sa aplikuje |
| 11 | Cyklotrasy | čo presne sa realizuje, materiály a rozsah prác |
| 12 | Cyklotrasy | fotografie dokončených cyklotrás s miestom |
| 13 | Štítky a hmatové mapy | materiály, rozmery, technológia gravírovania, rozsah hmatových máp |
| 14 | Štítky a hmatové mapy | fotografie osadených štítkov a hmatovej mapy v budove |
| 15 | Odstránenie značenia | metóda (frézovanie, tryskanie, iné), vplyv na povrch, rozsah prác |
| 16 | Odstránenie značenia | fotografie úseku pred odstránením a po ňom |
| 17 | Značky | technický popis a parametre hmôt Chipfill a Coldfill |
| 18 | Aktuality | odkaz na článok o ostrovčekoch a názov média, ktoré ho vydalo |

Ďalej mimo tohto zoznamu:
- **Logo v SVG.** Dnešné je PNG 145 × 86 px, v hlavičke sa renderuje na 81 × 48 px, čiže pri
  dvojnásobnej hustote pixelov je mierne rozmazané. Je to prvý prvok vľavo hore na každej stránke
  a kódom sa to opraviť nedá.
- **Fakturačné údaje:** IČO, DIČ, otváracie hodiny a meno konateľa na webe klienta nie sú,
  na `/kontakt` sú preto označené štítkom „Doplní klient“. Nič sme nevymýšľali.
- **Endpoint formulára:** `VITE_FORM_ENDPOINT` (Formspark). Bez neho beží demo režim a odoslanie
  zobrazí potvrdenie bez odoslania, čo je v paneli napísané.
- **Plné názvy miest pri skratkách z názvov fotografií:** `PD` (odhad Prievidza), `MT` (Martin),
  `BB` (Banská Bystrica), `TN` (Trenčín), `TT` (Trnava). Na webe stojí pravdivé označenie bez mesta,
  odhady sú len tu a v `MAPA-OBSAHU.md`.
- **Roky realizácií** — v podkladoch nie sú, na webe preto nie sú nikde.

---

## 3. Čo sme vedome nepreniesli z pôvodného webu

Šablónový balast témy MaisonCo, ktorý na cestneprvky.sk nikdy nepatril: `Δ` (honeypot Elementora),
„Recent Posts“, filtre galérie „All / Environment / Building Progress / Views / Visualizing Complex“,
stránky `/about-us/`, `/faq/`, `/our-team/`, `/residences/`, `/apartment-amenities/` a spol.
Portrét `janko.jpg` sme nepoužili — nemáme meno ani súhlas.

Zoznam riadok po riadku aj so zdôvodnením je v `poznamky/MAPA-OBSAHU.md`.

---

## 4. Technické poznámky

- **SPA na GitHub Pages:** `scripts/postbuild.mjs` kopíruje `dist/index.html` → `dist/404.html`,
  takže hlboké routy fungujú. Lokálny `vite preview` vracia na neexistujúcu cestu HTTP 200
  (obslúži ju fallback), Pages vrátia korektne 404 — nie je to chyba webu.
- **`noindex` ostáva**, kým je to demo. Preto je Lighthouse SEO 63 a vyššie sa dostať nedá;
  po odovzdaní stačí prepnúť `seo.noindex` v `src/content/global.json`.
- **Base cesta** je `/demo-cestneprvky/` (`.env` → `DEMOGEN_BASE`), lokálny build ju číta cez
  `loadEnv`, aby sa náhľad správal ako produkcia.
- **Audit:** `node poznamky/audit.mjs --routes all --tag <tag>` — 43 kontrol, 239 riadkov,
  15 ciest × 1440/768/390. Musí byť 239/239 pred každým odovzdaním.
- **Hero video** `public/hero/hero.mp4` (2,6 MB) sa prehráva len od 1024 px, nie pri
  `prefers-reduced-motion` ani `Save-Data`. Poster má tri veľkosti (960/1440/1920) a preload.
- **Nevyriešené mimo auditovaných viewportov:** na 360 × 640 px je obsah hero vyšší než okno
  (711 vs 640). Audit meria 390 a 768, tam je to v poriadku.
