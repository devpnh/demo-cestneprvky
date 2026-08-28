# Domov — analýza a zadanie (28. 8. 2026)

## Čo je zmerané

Stránka má na 1440×900 **8 963 px** a približne **2 400 px z toho je prázdna biela**.
Namerané diery: po tlačidle „Ako pracujeme" ~330 px, po objazde ~300 px, po
realizáciách ~480 px (pol obrazovky), po Postupe ~250 px. Príčina je systémová:
`SekciaHlavicka` sádže nadpis do stĺpcov 1–7 a perex do 8–12 na `items-end`, takže
pri štvorriadkovom nadpise vznikne diera v tvare L; na to sa navrch pripočíta
`--section-padding-y` (až 8,5 rem) hore aj dole na každom pásme.

## Sedem výhrad

1. **Čísla sú o webe, nie o firme.** 9 / 14 / 15 = „služieb v celkoch",
   „typov prvkov v galérii", „miest realizácií". Mesto ani stavebná firma
   nekupuje podľa veľkosti galérie. Najsilnejšie číslo firmy — **30 minút do
   100 % pevnosti lepeného obrubníka** — je zahrabané v odseku na podstránke.
2. **Nič sa nehýbe voči ničomu.** Každá animácia je tá istá udalosť: fade +
   16 px zdola, raz, pri vstupe. Na celom webe je jedna scroll-linkovaná
   animácia a je to práve tá, ktorá pôsobí najhoršie.
3. **Text a fotka nikdy nezdieľajú kompozíciu.** Pásmo je buď čistá sadzba,
   alebo stĺpec textu vedľa jednej fotky, alebo raster fotiek. Nikdy spolu.
4. **Debarierizácia (pripnutý scrub) je najslabší kus.** 260 vh dráhy na to,
   aby sa prelialo päť fotiek. Stojí 2,6 obrazovky a nesie informáciu za jednu.
   → Peter potvrdil: zrušiť.
5. **Postup je nedokončený drôtený model.** Štyri slová na vlasovej linke a
   300 px bielej. Popisy krokov v dátach existujú a nevykresľujú sa.
6. **Nikde nie je adresát.** Hero sľúbi „pre mestá a stavebné firmy" a ani
   jedno z tých slov už nikdy nezaznie.
7. **Objazd je dobrý nápad lacno vykreslený.** Deväť sivých koliesok
   s generickými ikonami na čiernom prstenci.

## Čo ostáva bez zásahu

Hero, hlavička, pätička, `/realizacie`, `/kontakt`, tokeny, jazyková disciplína
(žiadny fakt, ktorý nie je v podkladoch).

## Zadanie

1. Čísla nahradiť firemnými: **14 rokov · 30 min · 15 miest · 2 vyhlášky**.
   Všetky štyri dohľadateľné v `firma.js` / `sluzby.js`. Jednotka je súčasť
   čísla, nie popisok pod ním.
2. Zrušiť pin Debarierizácie. Na jej mieste tmavé pásmo, ktoré robí dvojicu
   text–fotka poriadne: **scroll-riadené odhaľovanie vety po slovách**
   (21st: `motiondotdev/scroll-word-reveal`) a pod ním **zoznam prvkov, kde
   nájazd myšou vytrie fotku z tej strany, z ktorej kurzor prišiel**
   (21st: `saurabh-2607/image-hover-reveal`, variant `directional`).
3. Pás miest realizácií ako pomalá marquee — web konečne povie, kde pracuje.
4. Zavrieť diery: stlačiť `--section-padding-y` medzi susednými svetlými
   pásmami, perex pod nadpis namiesto plávajúceho pravého stĺpca.
5. Postup dostane obsah (popisy krokov) a linka sa kreslí scrollom, nie raz.
6. Fotky dostanú pohyb: parallax vnútri rámu.

## Mantinely

Žiadny vymyslený fakt. `prefers-reduced-motion` rešpektované všade. Žiadny nový
farebný token. Nikdy dve tmavé pásma za sebou. Kontrast textu ≥ 4,5:1.
