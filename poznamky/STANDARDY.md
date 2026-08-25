# ŠTANDARDY PNH — destilát z vaultu pre quality loop (2026-08-23)

Zdroje: `me/06-Working-with-Claude.md` §2–§4, `me/05-Opinions-Values.md` §8 a 18 session
notes z `claude_conversations/Sessions/` (wdcwc ×8, Edstrex ×3, Sabir, Doktor Zub, Beyke ×2,
Dům na klíč, SEO Česko, KukiDream, Dáma na ťahu, Gensor). Každý bod má pôvod, aby sa dal
overiť. Loop kontroluje **každý** bod v každej iterácii; bod = riadok v audite (✅/❌).

## A. Copy a poctivosť (06 §2, 05 §8)
- A1 Žiadne em/en-dash v našej copy; doslovné názvy produktov sú výnimka (`DEBUZ® – Kölner Teller`, `Typ KT – 50`).
- A2 Žiadne slop slová: úprimne, narovinu, ještě dnes, stvořeno, inovatívne riešenia, synergia, lídri na trhu, komplexné riešenia, špičkový; žiadne prázdne superlatívy (garantujeme 100 %).
- A3 Žiadne vymyslené údaje: IČO, DIČ, hodiny, 24/7, počty, roky skúseností, certifikáty, recenzie, logá klientov. Neznáme = `[DOPLNIŤ]`.
- A4 CTA = akcia + benefit, nikdy `Odoslať`. Telefón vždy viditeľný ako `tel:` (header + kontakt), na mobile aspoň ikona 44 px.
- A5 Jazyk SK bez čechizmov (které, již, ještě, zde, společnost), bez anglických UI stringov.
- A6 Fakty doslova: Cestné prvky s.r.o. · Borová 3295/36, 010 01 Žilina · info@cestneprvky.sk · +421 911 87 87 89 · 2012 · 9 služieb s názvami z webu.
- A7 Žiadna stopa po šablóne MaisonCo (Connor, Observatory, Recent Posts, lorem).

## B. Vizuál (06 §2; Gensor QUALITY-LOOP; Edstrex „pod hero“)
- B1 Žiadne číslované dlaždice 01/02/03, žiadne hviezdičky, žiadne stock tváre, žiadny macOS chrome.
- B2 Žiadny `box-shadow` v sekciách (DemoBadge chassis je výnimka). Vlasové rámy 1 px.
- B3 Paleta: akcent iba `#F03314` (hover `#C5250D`), ink `#26292C`/`#3F4448`, bg `#FFFFFF`/`#F4F5F6`, modrá `#0E74BC` len v logu. 0 cudzích hexov (#0e5c66, #f6a21c, #3970ff, fialové).
- B4 Rezy: žiadny ≥ 700; hierarchia veľkosťou. Max 2 rodiny + mono len na technické (eyebrow, vyhlášky, tabuľka).
- B5 Rytmus pásiem v „aktoch“ (tmavá → svetlá → tmavá…), nikdy dve tmavé za sebou (Dům na klíč 07-14), žiadne mŕtve čierne pásy z `min-h-screen` na obsahových sekciách (wdcwc 07-02).
- B6 Každá sekcia má jeden zmysel; žiadne tri rovnaké orámované boxy za sebou (CHECK slop: tripletSections).
- B7 Kontrast: 4,5:1 telo, 3:1 ≥ 24 px alebo ≥ 19 px 600+, merané na reálne použitých dvojiciach (aj biely text na scrime hero).

## C. Hero a hlavička (Sabir, Edstrex, wdcwc, Dům na klíč, Dáma na ťahu, Gensor)
- C1 Hero = presne jedna obrazovka: `min-height: 100svh` (NIE `100vh`; Dům na klíč 07-14, wdcwc 07-02). Pri full-page screenshote treba override min-height.
- C2 Výšku hero nikdy neodvodzovať z `window.innerHeight` v JS; na touch zariadeniach ignorovať resize, ktorý mení len výšku (URL bar / klávesnica; Doktor Zub 07-20).
- C3 Priehľadná hlavička nad hero → po 24 px scrollu plná. Hlavička `fixed`, hero začína pod ňou (Edstrex: sticky header zaberá miesto; Dáma na ťahu: hide-on-scroll = chyba).
- C4 Nad svetlými sekciami musí byť hlavička čitateľná (tmavý text), nad tmavou fotkou biely (Edstrex adaptívny header).
- C5 Video v hero: `muted playsInline autoplay loop preload="metadata"`, poster = LCP `<img fetchpriority="high">`, video len ≥ 1024 px, nie pri `prefers-reduced-motion` ani `Save-Data`; prelínať až po `canplay`. Žiadne stock zábery: len materiál klienta (wdcwc 07-13/07-30, Sabir 07-18).
- C6 Video 16:9 na portrait telefóne = `object-cover` orež na prúžok; na mobile poster alebo `aspect-video` band (wdcwc 07-02). Alfa video = VP9 webm + HEVC mov pre Safari (wdcwc 07-13).
- C7 `backdrop-filter`/`filter` na predkovi robí z `position: fixed` potomka absolútne pozíciovanie → mobilné menu/overlay NIKDY vnútri rozmazanej hlavičky (demo-cestneprvky 08-23).
- C8 Logo klienta v pôvodnom pomere, nerekresľovať; na tmavom podklade verzia s alfou, nie biela doska.

## D. Mobil 390 px (wdcwc audit 07-02, SEO Česko 07-07, Beyke 07-03, Sabir)
- D1 `document.documentElement.scrollWidth === viewport` (0 horizontálny overflow). Príčiny: absolútne/rotované dekorácie → `hidden sm:block`; `truncate` → `sm:truncate`; `initial={{x:-28}}` na okraji → zmenšiť; dlhé slová → `overflow-wrap: anywhere` v gride, v hero `normal` + zastropovaná veľkosť. Nájsť cez hide-and-measure bisect.
- D2 Tap targety ≥ 44 px (nav, CTA, tel, menu).
- D3 Inputy `font-size ≥ 16px` (iOS zoom; Beyke 07-03).
- D4 Mobilná oprava = len mobilný breakpoint; desktop 1440 musí byť pixel-identický (PIL diff pred/po). „Desktop is sacred.“
- D5 Žiadny scroll jump: reveal komponenty rezervujú miesto (placeholder + `absolute inset-0`), prerender = rovnaký DOM ako hydratácia (Doktor Zub 07-20, wdcwc 07-10).
- D6 IntersectionObserver hlási len zmenené entries → aktívne stavy držať vo vlastnom `Set` (PST 08-06).

## E. Pohyb (06 §2; Gensor; Edstrex story)
- E1 Iba fade/slide/stagger/hover + jeden „wow“ sticky-scrub na stránku; žiadny bounce, žiadny wheel-hijack (natívny scroll + rAF progress).
- E2 `prefers-reduced-motion` vypne všetko vrátane videa a meshu.
- E3 Scroll-linked `useTransform` vstupný rozsah v [0,1], prísne rastúci (inak WAAPI offsets error = prázdna stránka; 08-23).
- E4 Žiadny `scroll-behavior: smooth` v CSS (bije sa s Lenisom). Lenis = manuálny rAF, nie autoRaf.
- E5 Scroll-scrubované prekryvy potrebujú tvrdý clip na hranici suseda (wdcwc 07-14).

## F. Výkon a médiá (wdcwc 07-13/07-18, Sabir, pnhmedia 07-30)
- F1 Fotky ≤ 250 kB, max 1920 px, `width/height` + `loading="lazy"` mimo LCP. Hero video ≤ 3 MB, poster ≤ 250 kB.
- F2 Nikdy neznižovať rozlíšenie grafiky, ktorú klient vníma ako ostrú (pnhmedia 07-30) — len re-encode.
- F3 Lighthouse merať na produkcii, nie na localhoste (Edstrex 07-19). Ciele mobile: Performance ≥ 90, A11y ≥ 95, SEO ≥ 90, CLS 0. Nikdy UX za skóre.
- F4 `noindex` na deme, `lang="sk"`, jeden H1, title ≤ 70 a description ≤ 160 znakov, alt na každej fotke.

## G. Proces (06 §3, §6)
- G1 Measure, don't eyeball: `getComputedStyle`, `getBoundingClientRect`, pageerror stack, screenshoty 1440 + 390.
- G2 Max 3 opravy na iteráciu, build zelený, potom meranie toho istého.
- G3 Nič v `chassis/`; iba `site/src/sections`, `tokens.css`, `global.json`, `public/`.
- G4 Publish až po zelenom builde; živá URL 200; Actions zelené.
- G5 Každá iterácia = riadok v `QUALITY-LOG.md`; sporné rozhodnutie (fakty, štruktúra) = zastaviť a napísať Petrovi.
