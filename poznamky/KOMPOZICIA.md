# KOMPOZÍCIA v5 — záväzný raster pre všetky stránky

Rozhodnutie manažéra behu. Stavitelia sa ním riadia doslova; odchýlku treba
zdôvodniť v odovzdávacej správe, inak ju kontrola vráti. Cieľ: štyri ruky,
jeden web.

## 1. Zdieľaný kit — `src/components/kit/`

| Komponent | Na čo |
|---|---|
| `Sekcia` | pásmo stránky: `pasmo="biela" \| "tmava"` (dve pásma, sivá sa zrušila), `padding="plne" \| "male" \| "ziadne"`, vnútri už je kontajner 78rem a `--container-padding-x`. Dáva `data-pasmo` pre audit. |
| `Kontajner` | ten istý kontajner mimo `Sekcia` (hero, pásma na celú šírku) |
| `Podstranka` | **šablóna podstránky. Každá podstránka ide cez ňu.** SEO + `StranHlavicka` + obsahové pásma + `PasVyzvy`. Stránka dodáva obsah, nie skladbu. |
| `StranHlavicka` | hlavička podstránky: štítok alebo drobky, H1 po slovách, perex, dokreslená akcentová linka, voliteľné fakty a akcie; v pozadí `ZnacenieMotiv`. **H1 na stránke je práve tu.** |
| `PasVyzvy` | záverečné **svetlé** pásmo výzvy so značkovacím motívom (`svetle`). Jedna definícia pre celý web namiesto piatich ručne poskladaných kópií. Svetlé je kvôli rytmu — pod ním je tmavá pätička. |
| `ZnacenieMotiv` | podpisová dekorácia: jazdné pruhy zbiehajúce sa do úbežníka, pomalý posun `stroke-dashoffset`. `svetle` prepne čiary z bielej na inkoust pre svetlé pásmo. |
| `SekciaHlavicka` | hlavička sekcie vnútri stránky: štítok + H2 vľavo (col-span-7), perex vpravo dole (col-span-5, `lg:ml-auto`) |
| `MonoStitok` | mikro-label IBM Plex Mono 12 px / 0,08 em; `tmava` prepne na bielu 72 % + akcentovú čiarku |
| `Tlacidlo` | `variant="primar" \| "sekundar" \| "tichy"`, `to` (router), `href` alebo `onClick`. Primárne je napevno 19 px/600 kvôli kontrastu bielej na akcente (4,05:1 → platí limit 3:1 pre veľký text). |
| `Fotka` | `<img>` s povinnými `w`/`h`, `alt`, voliteľný `popis` (mono figcaption), `pomer` (napr. `'3/2'`), `priorita` pre LCP |
| `PasFaktov` | riadok overiteľných faktov; položka aj s oddeľovačom je nedeliteľná (`whitespace-nowrap`) |
| `Lajna` | prerušovaná deliaca linka v reči vodorovného značenia; kreslí sa pri vstupe do viewportu, pri reduced-motion je hneď celá |

Doplnkové: `src/components/primitives/` (`Reveal`, `Stagger`/`StaggerItem`,
`StickySection`, `Parallax`, `SplitText`, `GradientMesh`), `src/components/ui/`
(radix chassis — **nemeniť**), `ZadanieForm`, `ObhliadkaDialog` + `openObhliadka()`.

### 1a. Pohyb — jedna vrstva, `src/lib/odhalenie.js`

Vstupné animácie stoja na jednom zdieľanom `IntersectionObserver`, ktorý
prepne `data-odhal` na `in`; prechody sú v `src/styles/index.css`.
**`whileInView` z knižnice `motion` sa v tomto projekte nepoužíva** — pod
wrapperom prechodu routov nespúšťal nič a web tak nemal ani jednu vstupnú
animáciu (QUALITY-LOG, 27. 8. 2026). Kto potrebuje odhalenie, siahne po
`Reveal`, `Stagger` alebo `SplitText`, nie po vlastnej animácii.

Slovník pohybu má štyri slová a nič viac: **odhalenie** (fade + 22 px zdola),
**sekvencia** (to isté s krokom po `--i`), **dokreslenie čiary** (`scaleX`
zľava — `Lajna`, podčiarknutie navigácie, pás postupu) a **jeden
sticky-scrub na web** (Debarierizácia). Nekonečne bežia len dve veci:
značkovací motív a kruhový objazd.

**Nikto nepridáva farbu, font ani tieň.** Všetko ide cez tokeny v
`src/styles/tokens.css`. Kto potrebuje nový token, napíše to do odovzdávacej
správy; token pridá manažér.

## 2. Rytmus pásiem — dve farby, nie tri

**Web má svetlé a tmavé pásmo. Sivá medzivrstva je zrušená** (pokyn Petra,
2026-08-26): striedanie bielej a sivej robilo rytmus z odtieňa pozadia namiesto
z obsahu a stránka pôsobila prúžkovane. Svetlé pásma smú ísť za sebou —
oddeľuje ich hlavička sekcie, vlasová linka a `Lajna`. Tmavé pásmo je akcent
a hĺbka, používa sa striedmo a **nikdy nie dve za sebou** (STANDARDY B5).

Z toho plynie druhá povinnosť: **žiadna sekcia nesmie byť len text.** Keď
rytmus nerobí farba, musí ho robiť obsah — fotografia, tabuľka, zoznam
s náhľadmi, mapa. Sekcia s viac než ~300 px súvislého textu bez jediného
obrazového prvku sa vracia na prepracovanie.

### `/` Domov
| # | Sekcia | Pásmo | Súbor |
|---|---|---|---|
| 1 | Hero (video, 100svh, 1 H1) | tmavá | `pages/Domov/sections/Hero.jsx` |
| 2 | Pás faktov (bez vymyslených čísel) | biela, `padding="male"` | `sections/Fakty.jsx` |
| 3 | Prečo Cestné prvky (3–4 argumenty) | sivá | `sections/Preco.jsx` |
| 4 | Služby v troch celkoch | biela | `sections/SluzbyPrehlad.jsx` |
| 5 | Debarierizácia — jediný sticky-scrub na webe | tmavá | `sections/Debarierizacia.jsx` |
| 6 | Realizácie: výber 6 fotiek + odkaz na `/realizacie` | biela | `sections/RealizacieVyber.jsx` |
| 7 | Ako prebieha spolupráca (4 kroky, spojnica) | sivá | `sections/Proces.jsx` |
| 8 | Kontakt v skratke + CTA | tmavá | `sections/KontaktKratky.jsx` |
| — | Footer (spoločný, **tmavý s červeným oparom**) | tmavá | layout |

**Pätička je tmavá a ráta sa do rytmu.** Má v pozadí `GradientMesh` — tri
rozostrené škvrny s vlastnými dráhami a nesúdeliteľnými časmi obehu (pokyn
Petra, 27. 8. 2026). Kontrola B5 meria odo dnes aj pätičku; pásmo si berie
z jej nameraného pozadia, lebo `data-pasmo` nemá.

Z toho plynie záväzné pravidlo pre každú stránku: **posledné pásmo v `<main>`
musí byť SVETLÉ.** Preto je svetlý aj `PasVyzvy` na podstránkach a `Kontakt
v skratke` na Domove — dôraz výzvy nesie veľkosť titulu a červené tlačidlo,
nie farba plochy, a tmavá pätička je posledný akord stránky.

Cesta k tomu bola cez oba extrémy a oba boli chybné: najprv tmavá výzva nad
tmavou pätičkou (jeden súvislý tmavý blok na 13 z 15 ciest), potom svetlá
pätička (rytmus sedel, ale opar zmizol). Platí tretia možnosť — svetlá
výzva, tmavá pätička.

### `/sluzby`
`StranHlavicka` (biela) → 3 skupiny služieb, striedavo biela / sivá / biela →
CTA pásmo (tmavá).

### `/sluzby/:slug`
> **Odchýlka schválená v kole 3:** farby pásiem na detailoch sa nepriraďujú napevno, ale
> počítajú sa z poradia pásiem, ktoré na danej službe naozaj vznikli (`rytmusPasiem`
> v `Detail.jsx`). Chudobné služby majú menej pásiem, takže pevné priradenie im dávalo
> tri biele za sebou a 264 px prázdnej plochy. Pravidlo „nikdy dve tmavé za sebou“ platí
> ďalej, pribudlo „nikdy tri rovnaké za sebou“.

`StranHlavicka` s drobkami `Služby · <názov>` (biela) → úvod + fotka (biela) →
zoznamy podkategórií (sivá) → technická tabuľka a návod, kde existujú (biela) →
galéria služby (tmavá) → súvisiace služby (biela) → CTA (tmavá).
Služby bez plného textu majú kratšiu stránku: hlavička → fotka a perex →
`[DOPLNÍ KLIENT]` blok → súvisiace → CTA. **Prázdne miesto nevypĺňaj vatou.**

### `/realizacie`
`StranHlavicka` (biela) → filtre + galéria s lightboxom (biela) → CTA (tmavá).

### `/o-firme`
`StranHlavicka` (biela) → firma od 2012 + fotka (sivá) → prístup, 4 argumenty (biela) →
partner ÚNSS + vyhlášky + značky (tmavá) → aktuality, 1 položka (biela) → CTA (tmavá).

### `/kontakt`
`StranHlavicka` (biela) → NAP + `ZadanieForm` v dvoch stĺpcoch (biela) →
mapa ako statický odkaz, nie Google embed (sivá) → footer.

## 3. Raster a zarovnanie

- Kontajner `max-w-[var(--container-max)]` (78rem) + `px-[var(--container-padding-x)]` — vždy cez `Sekcia`/`Kontajner`, nikdy ručne.
- Mriežka `grid-cols-12` s `gap-16` na `lg`, `gap-8` nižšie. Text 7 stĺpcov, sprievodný stĺpec 5.
- Ľavé hrany nadpisu, perexu, mriežky a fotiek v tej istej sekcii sedia na tej istej zvislej osi. Audit meria `getBoundingClientRect().left` prvého potomka každej sekcie proti ľavému okraju kontajnera (tolerancia 1 px).
- Vertikálny rytmus výhradne `--section-padding-y` / `--section-padding-y-sm`. Žiadne `min-h-screen` na obsahových sekciách, žiadne `mt-[137px]`.
- Nadpisy: H1 `--text-5xl`, H2 `--text-4xl`, H3 `--text-2xl`, všetko rez 600, nikdy ≥ 700. Telo 17–18 px, riadok 45–75 znakov (`max-w-[52ch]`).
- Rádiusy: fotky a tlačidlá `--radius-sm` (2 px), karty a panely `--radius-md` (6 px). Žiadne pilulky. **Žiadny `box-shadow` nikde.**
- Rámy sú vlasové `border-[var(--color-border)]`; na tmavom pásme `color-mix(in srgb, var(--color-bg) 18%, transparent)`.

## 4. Pohyb

- Vstup do viewportu: `Reveal` (fade + 16–24 px), zoznamy `Stagger` 60–80 ms.
- Hover na karte: rám do akcentu + posun šípky o 2 px. Nič sa nezväčšuje o viac než 2 %.
- Jeden „wow“ na celom webe: sticky-scrub Debarierizácia na Domove. Nikde inde scroll-linkovaná animácia; kde predsa, `useTransform` vstup striktne rastúci v [0,1] (inak WAAPI offsets error = prázdna stránka).
- Prechod medzi routami rieši layout (fade + 12 px, 300 ms). Stránky ho neduplikujú.
- `prefers-reduced-motion` vypína všetko vrátane videa a `Lajna`.

## 5. Copy

- Slovenčina, hlas klienta: slovesá, oslovenie, technická vecnosť.
- Zakázané: pomlčky `—`/`–` v našej copy (výnimka doslovné názvy `DEBUZ® – Kölner Teller`, `Typ KT – 50`, `Štítky – Braillovo písmo…`), slop slová, čechizmy, anglické UI stringy, `Odoslať`, prázdne superlatívy, vymyslené čísla.
- Texty berie **výhradne** z `src/content/*` — v JSX nevzniká nová veta o klientovi. Výnimka sú mikro-labely typu „Zobraziť všetky“.
- CTA = akcia + benefit: „Dohodnúť obhliadku a cenu“, „Pozrieť realizácie“, „Poslať zadanie“.

## 6. Čo kontrola vracia bez diskusie

Tiene · pomlčky · vymyslené údaje · číslované dlaždice 01/02/03 · `min-h-screen`
na obsahovej sekcii · `position: fixed` potomok vnútri `backdrop-filter` ·
`useTransform` mimo [0,1] · horizontálny overflow na 390 alebo 768 px · tap
target < 44 px · input < 16 px · fotka nad 250 kB alebo bez `width`/`height` ·
`alt` po anglicky alebo prázdny · viac ako jeden H1 · nová farba mimo tokenov.
