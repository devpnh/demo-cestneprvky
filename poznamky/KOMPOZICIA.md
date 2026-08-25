# KOMPOZÍCIA v5 — záväzný raster pre všetky stránky

Rozhodnutie manažéra behu. Stavitelia sa ním riadia doslova; odchýlku treba
zdôvodniť v odovzdávacej správe, inak ju kontrola vráti. Cieľ: štyri ruky,
jeden web.

## 1. Zdieľaný kit — `src/components/kit/`

| Komponent | Na čo |
|---|---|
| `Sekcia` | pásmo stránky: `pasmo="biela" \| "siva" \| "tmava"`, `padding="plne" \| "male" \| "ziadne"`, vnútri už je kontajner 78rem a `--container-padding-x`. Dáva `data-pasmo` pre audit. |
| `Kontajner` | ten istý kontajner mimo `Sekcia` (hero, pásma na celú šírku) |
| `StranHlavicka` | hlavička podstránky: štítok alebo drobky, H1, perex, voliteľné fakty a akcie, ukončená `Lajna`. **Každá podstránka ju používa — H1 na stránke je práve tu.** |
| `SekciaHlavicka` | hlavička sekcie vnútri stránky: štítok + H2 vľavo (col-span-7), perex vpravo dole (col-span-5, `lg:ml-auto`) |
| `MonoStitok` | mikro-label IBM Plex Mono 12 px / 0,08 em; `tmava` prepne na bielu 72 % + akcentovú čiarku |
| `Tlacidlo` | `variant="primar" \| "sekundar" \| "tichy"`, `to` (router), `href` alebo `onClick`. Primárne je napevno 19 px/600 kvôli kontrastu bielej na akcente (4,05:1 → platí limit 3:1 pre veľký text). |
| `Fotka` | `<img>` s povinnými `w`/`h`, `alt`, voliteľný `popis` (mono figcaption), `pomer` (napr. `'3/2'`), `priorita` pre LCP |
| `PasFaktov` | riadok overiteľných faktov; položka aj s oddeľovačom je nedeliteľná (`whitespace-nowrap`) |
| `Lajna` | prerušovaná deliaca linka v reči vodorovného značenia; kreslí sa pri vstupe do viewportu, pri reduced-motion je hneď celá |

Doplnkové: `src/components/primitives/` (`Reveal`, `Stagger`/`StaggerItem`,
`StickySection`, `Parallax`, `SplitText`, `GradientMesh`), `src/components/ui/`
(radix chassis — **nemeniť**), `ZadanieForm`, `ObhliadkaDialog` + `openObhliadka()`.

**Nikto nepridáva farbu, font ani tieň.** Všetko ide cez tokeny v
`src/styles/tokens.css`. Kto potrebuje nový token, napíše to do odovzdávacej
správy; token pridá manažér.

## 2. Rytmus pásiem (STANDARDY B5: nikdy dve tmavé `<section>` za sebou)

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
| — | Footer (spoločný, tmavý) | tmavá | layout |

Sekcia 8 a footer tvoria zámerne jeden súvislý tmavý blok oddelený vlasovou linkou.

### `/sluzby`
`StranHlavicka` (biela) → 3 skupiny služieb, striedavo biela / sivá / biela →
CTA pásmo (tmavá).

### `/sluzby/:slug`
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
