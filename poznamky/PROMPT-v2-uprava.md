# ÚPRAVA DEMA demo-cestneprvky v2 — spätná väzba Petra (2026-08-24)

> Skopíruj celý súbor do Claude Code v `~/Desktop/pnh_media/demogen`. Toto NIE JE nové
> demo ani redizajn — je to cielená úprava šiestich vecí na existujúcom deme, ktoré je
> inak schválené. Rozsah drž presne: čo nie je v §2, sa nemení.

Spätná väzba doslova: hlavný nadpis v hero je priveľký; logo Cestných prvkov primalé;
sekcia „Čo realizujeme na pozemných komunikáciách“ je nudná, prakticky len text; chýba
scroll efekt a pár odkazov v navigácii; niektoré sekcie pôsobia synteticky. Dobré a
nedotknuteľné: Debarierizácia, Realizácie, Kontakt, footer (gradient aj veľkosť).

---

## 0. Kde to žije

| | |
|---|---|
| Site | `./` (build `npm run build`, náhľad `npx vite preview --port 4320 --strictPort` → `http://localhost:4320/demo-cestneprvky/`) |
| Sekcie | `src/sections/*.jsx` · tokeny `src/styles/tokens.css` · texty `src/content/global.json` |
| Štandardy | `poznamky/STANDARDY.md` (45 bodov) — čítaj PRED prvou zmenou |
| Audit | `node poznamky/audit.mjs --shots poznamky/shots --tag v2-iterN` (29 kontrol, musí ostať 29/29; v §4 ho rozšíriš) |
| Loop | `QUALITY-LOOP.md` §5 (postup iterácie) a §6 (kedy skončiť), log do `QUALITY-LOG.md` |
| Job | id `4daa0bdb-77b8-4dec-87a7-d4a899e8ecd4`, server `http://127.0.0.1:3117` |

Publish je stále blokovaný viditeľnosťou repa `devpnh/demo-cestneprvky` — neskúšaj ho,
len to uveď v logu.

---

## 1. NAJPRV: baseline na dôkaz nedotknuteľnosti

Pred prvou zmenou sprav referenčné full-page screenshoty 1440 aj 390
(`--tag v2-baseline`) a zapíš si y-rozsahy sekcií `#debarierizacia`, `#realizacie`,
`#kontakt` + footer (getBoundingClientRect). Po KAŽDEJ iterácii sprav pixel-diff
(PIL, prah > 24) baseline vs. aktuál v týchto pásmach — rozdiel smie vzniknúť len
z posunu vyššieho obsahu (iná výška sekcií nad nimi), nie vo vnútri pásiem samotných.
Diffuj preto výrez pásma voči výrezu pásma (zarovnaj podľa začiatku sekcie), nie
absolútne súradnice. Hero pásmo z diffu vynechaj (video má vždy inú snímku).

---

## 2. ČO SA NESMIE ZMENIŤ

- **Sekcie doslova:** `Debarierizacia.jsx` (Bezbariérové prvky bez zásahu…),
  `Realizacie.jsx` (Osadené prvky na konkrétnych miestach), `KontaktAPaticka.jsx`
  (kontakt AJ footer vrátane gradientu a veľkosti). Ani formulácia, ani triedy, ani
  poradie. Jediná povolená zmena v týchto súboroch: pridanie `id`/scrollspy dát, ak by
  bolo technicky nutné pre §3.4 — a aj to len bez vizuálneho efektu.
- Hero koncept (video 100svh, scrim, sklená karta, trust line, CTA texty) — mení sa IBA
  veľkosť H1 (§3.1) a pridáva jemný parallax (§3.3). Video `public/hero/hero.mp4` sa negeneruje nanovo.
- Fakty doslova (PROMPT.md §1), paleta (akcent iba `#F03314`, modrá len v logu),
  typografia Archivo + IBM Plex Sans/Mono, `noindex`, `[DOPLNIŤ]` konvencia.
- Zákazy zo STANDARDY.md: žiadne 01/02/03, box-shadow, marquee, wheel-hijack,
  `scroll-behavior: smooth`, rezy ≥ 700, pomlčky v našej copy, vymyslené údaje.
- Proces: **Desktop is sacred** (mobilná oprava = len mobilný breakpoint),
  scroll-linked `useTransform` rozsahy prísne rastúce v [0, 1] (E3 — inak prázdna
  stránka), `chassis/` sa nedotýka.

---

## 3. ÚPRAVY (v tomto poradí)

### 3.1 H1 v hero menšie
`HlavickaAHero.jsx:318`: H1 má `text-[length:var(--text-6xl)]` (84 px na 1440,
4 riadky) — priveľa. Zmeň na `text-[length:var(--text-5xl)]` (68 px na 1440) a
`max-w-[14ch]` → `max-w-[18ch]`. Cieľ merateľne: H1 „Bezbariérové prvky a dopravné
značenie“ má na 1440 **max 2 riadky** (výška h1 ≤ 2,2 × line-height) a na 390 max
3 riadky. Subline a odstupy neriešiš, len ak sa po zmenšení rozpadne rytmus, dorovnaj
`mt-*` o jeden krok. Tokeny v `tokens.css` nemeň — 6xl ostáva pre prípadné iné použitie.

### 3.2 Logo väčšie
`HlavickaAHero.jsx:85`: header logo `h-10` (40 px) → **`h-12`** (48 px). Zdroj
`91-logo-cestne-prvky-alpha.png` má natívne len 145×86 px — nad ~56 px CSS výšky sa na
retine rozmaže, preto nejdi vyššie ako `h-14` a ak by ani to nestačilo, napíš do
handoveru „vypýtať od klienta logo vo väčšom rozlíšení / SVG“, nerekresľuj ho.
Footer logo je súčasť footera → nedotýkaš sa.

### 3.3 Scroll efekty (chýba scroll efekt)
Všetko cez chassis primitívy / `useScroll` z motion, všetko vypnuté pri
`prefers-reduced-motion`, rozsahy [0, 1]:
a) **Scroll-progress vlások:** 2 px linka v akcente fixne pod headerom
   (`scaleX = scrollYProgress`, `transform-origin: left`). Technický „výkresový“ prvok,
   sedí k Peak-end aj k segmentu.
b) **Hero parallax:** vrstva videa/postera sa pri scrollovaní hero von jemne škáluje
   (1 → 1,06) alebo posúva (y 0 → 48 px) — `useScroll({ target: heroRef })`. Obsah hero
   sa nehýbe. Nič nové v DOM nad scrimom.
c) **Parallax na fotkách v Technológie:** `<Parallax speed={0.1–0.15}>` na dve horné
   fotky (ColdPlastik, obrubníky). DEBUZ tabuľky a fotky retardérov sa nedotýkaj.
d) **Scrollspy v navigácii** — viď §3.4 (aktívna položka je scroll efekt sám o sebe).
Nič ďalšie: žiadny nový sticky-scrub (jeden na stránku už je — Debarierizácia),
žiadny bounce, žiadny mesh navyše.

### 3.4 Navigácia: chýbajúce odkazy + aktívny stav
`NAV` v `HlavickaAHero.jsx:6` má 5 položiek, sekcia `#o-nas` v nej chýba. Nové poradie
podľa stránky: **Služby · Debarierizácia · Technológie · Realizácie · O nás · Kontakt**
(6 anchorov, viac nie). Pridaj aj do mobilného menu. K tomu **scrollspy**: aktívna
sekcia = položka s `border-b-2` v akcente (rovnaký štýl ako hover). IntersectionObserver
hlási len zmenené entries → aktívne id drž vo vlastnom `Set`/poradí (STANDARDY D6),
nie „posledný entry vyhral“. Aktívny stav funguje v transparentnom aj bielom stave headera.

### 3.5 Služby: z textovej tabule interaktívny prehliadač prvkov
`Sluzby.jsx` (145 riadkov, 3 × 3 textové bunky) je nudný — prakticky len text. Prerob na
**explorer so skutočnými fotkami klienta** (vzor: Edstrex ProcessTimeline — hover posúva
akcentový šev + mení fotku; Peter to schválil):

- **Desktop (≥ lg):** dvojstĺpcový layout. Vľavo 9 riadkov služieb v troch skupinách
  (mono labely skupín ostávajú: Debarierizácia a značenie · Konštrukčné prvky vozovky ·
  Povrchy a údržba). Riadok = názov (presne dnešné znenie) + dnešná jedna veta popisu;
  vlasové deliče, žiadne boxy. Vpravo **sticky panel** (top pod headerom) s fotkou
  aktívnej služby, `--radius-sm`, pod ňou mono popisok (typ + miesto ak je známe).
  Aktívnu službu určuje scroll pozícia riadkov (scrollspy cez IntersectionObserver,
  žiadny scroll-jack), hover na desktope prebíja. Aktívny riadok: 2 px akcentový šev
  vľavo + text plný ink; neaktívne riadky `--color-muted`. Prechod fotiek crossfade
  200–300 ms.
- **Mobil:** žiadny sticky. Riadok = malý štvorcový náhľad 72 px vľavo (rovnaká fotka,
  `object-cover`, lazy) + názov + veta. Skupinové labely ostávajú.
- **Mapovanie fotiek** (z dlaždíc pôvodného webu — structure.json context, sú to fakty
  klienta; nikdy neprekroč ~1,2× natívnej šírky):

| Služba | Súbor v `public/assets/` | Popisok miesta |
|---|---|---|
| Značenie pre nevidiacich a slabozrakých | `00-ZubaC48Dka-600x390.jpg` | Zubačka |
| Vodorovné dopravné značenie | `02-PD-1-600x390.jpg` | `[DOPLNIŤ]` |
| Odstránenie starého vodorovného dopravného značenia | `08-BA_Bosakova-600x390.jpg` | Bratislava Bosákova |
| Lepené obrubníky | `01-Medeny_Hamor_1-600x390.jpg` | Medený Hámor |
| Spomaľovače dopravy (retardéry) | `03-MT_1-600x390.jpg` | `[DOPLNIŤ]` |
| Cyklotrasy | `06-IMG_1565-480x390.jpg` | `[DOPLNIŤ]` |
| Zálievkové a vysprávkové hmoty | `04-zalievkove_hmoty_01-600x390.jpg` | `[DOPLNIŤ]` |
| Bezpečnostný protišmykový náter | `05-Protismykove-pasy-Filakovo3-416x390.jpg` | Fiľakovo |
| Štítky: Braillovo písmo, gravírovanie, hmatové mapy | `07-Braill-600x390.jpg` | Produktová fotografia |

- Hlavička sekcie („Čo realizujeme na pozemných komunikáciách“ + perex) a záverečné CTA
  „Konzultovať konkrétny prvok so zadaním“ ostávajú. Žiadne číslovanie, žiadne tiene.
  Ak sa v galérii Realizácie tá istá fotka opakuje, je to v poriadku — sú to reálne
  realizácie, nie dekor.

### 3.6 De-syntetizácia (len sekcie mimo zoznamu dobrých)
- **Technológie a materiály:** fotkám ColdPlastik a obrubníkov pridaj mono popisky ako
  v Realizáciách (typ + miesto, len ak je miesto isté z názvu súboru — inak bez miesta,
  nie `[DOPLNIŤ]` navyše). Reálne čísla z textu vytiahni ako 2–3 veľké mono údaje na
  vlasových linkách (napr. „100 % pevnosť po 30 min“ · „DEBUZ KT-35/KT-50 · výška
  35/50 mm“). Žiadne nové čísla, žiadne karty so 4 ikonami.
- **Copy pass** cez `Sluzby.jsx`, `TechnologieAMaterialy.jsx`, `ONas.jsx`, proof strip:
  kratšie vety, konkrétne podstatné mená, von generické väzby typu „prispôsobíme
  požiadavke objednávateľa“ tam, kde sa opakujú (raz ostať smie). Fakty a názvy služieb
  doslova. Ak váhaš, nechaj pôvodné znenie.

---

## 4. Rozšír audit (aby sa spätná väzba už nevrátila)

Do `audit.mjs` pridaj 4 kontroly (spolu 33, všetky musia byť ✅):
- **H1v2**: výška h1 na 1440 ≤ 2,2 × line-height (max 2 riadky) a font-size ≤ 72 px.
- **LOGOv2**: header logo rendered height ≥ 48 px a ≤ 56 px.
- **NAVv2**: `header nav` má 6 anchorov vrátane `#o-nas`; po scrolle na `#technologie`
  má práve jedna položka aktívnu triedu (scrollspy žije).
- **SCRLv2**: scroll-progress element existuje, na `scrollY = 50 %` má `scaleX` ~0,5
  (±0,1); pri `reducedMotion: reduce` je bez transformácie alebo skrytý.

---

## 5. Proces a výstup

1. Baseline (§1) → úpravy §3.1–§3.6 po iteráciách podľa `QUALITY-LOOP.md` §5 (max 3
   zmeny na iteráciu, build + audit + screenshoty 1440/390 po každej).
2. Po poslednej iterácii: pixel-diff dôkaz nedotknuteľných pásiem (§1), audit 33/33,
   `iterN-*.jpeg` do `poznamky/`, riadky do `QUALITY-LOG.md`.
3. Vizuálna kontrola vkusu na oboch breakpointoch (STANDARDY §B, §C): explorer nesmie
   pôsobiť ako SaaS tabs, scroll-progress nesmie kričať, H1 vs. logo proporčne sedia.
4. Zápis: session note dodatok do vaultu + KONVERZACIE riadok. Publish nechaj tak.

## 6. Kontrola na záver
- [ ] H1 na 1440 max 2 riadky, na 390 max 3; hero inak nezmenené (video, scrim, karta).
- [ ] Logo v headeri 48–56 px, ostré, footer nedotknutý.
- [ ] Služby: explorer s 9 reálnymi fotkami, skupiny zachované, žiadne boxy/čísla/tiene.
- [ ] Scroll: progress vlások + hero parallax + 2× Parallax v Technológie + scrollspy;
      všetko mŕtve pri reduced-motion; žiadny nový sticky-scrub.
- [ ] Nav: 6 položiek s O nás, aktívny stav funguje v oboch stavoch headera aj v mobile menu.
- [ ] Debarierizácia, Realizácie, Kontakt, footer: pixel-diff čistý.
- [ ] Audit 33/33 ✅ dvakrát po sebe, `QUALITY-LOG.md` doplnený.
