# QUALITY LOOP — demo-cestneprvky

Jedna iterácia = **audit → max 3 opravy → build → meranie (1440 + 390) → publish → riadok
do QUALITY-LOG.md**. Loop beží, kým §6 nie je splnená celá. Nerob redizajn, dolaď ho:
každá iterácia má stránku posunúť, nie prekopať.

---

## 1. Kde to žije

| | |
|---|---|
| Job id | `4daa0bdb-77b8-4dec-87a7-d4a899e8ecd4` |
| Zdroj | `~/Desktop/pnh_media/cestne_prvky/` |
| Sekcie | `src/sections/*.jsx` · tokeny `src/styles/tokens.css` · texty `src/content/global.json` · fotky `public/assets/` |
| Build | `npm run build` v `site/` |
| Náhľad | `npx vite preview --port 4320 --strictPort` → `http://localhost:4320/demo-cestneprvky/` |
| Publish | `POST http://127.0.0.1:3117/api/jobs/4daa0bdb-77b8-4dec-87a7-d4a899e8ecd4/publish` s cookie z `/login` (heslo = `DEMOGEN_PASSWORD` v `demogen/.env`) |
| Actions | `GET /api/jobs/<id>/workflow` |
| Živé | https://devpnh.github.io/demo-cestneprvky/ |
| Zadanie | `poznamky/PROMPT.md` (fakty §1, paleta §2.1, estetika §3) |

Klient: Cestné prvky s.r.o., Žilina, dopravné stavby a bezpečnostné prvky komunikácií (B2B:
mestá, župy, správcovia ciest, stavebné firmy). Originál: https://www.cestneprvky.sk/
(HTTP 466 pre ne-prehliadačový UA). Referencie: `original-logo.png`, `original-titulka.jpg`.

---

## 2. Štandardy — zdroj pravdy je vault, nie tvoj vkus

Autorita: `~/Desktop/Vaults/me/06-Working-with-Claude.md` §2 a §3, doplnkovo
`05-Opinions-Values.md` §8. **Na začiatku každej iterácie si §2 a §3 prečítaj znova.**

### 2.1 Zakázané (okamžité odmietnutie)
- Em-dash `—` / en-dash `–` v našej copy (výnimka: doslovné názvy produktov ako `DEBUZ® – Kölner Teller`).
- Číslované karty `01/02/03` ako dekorácia.
- Hviezdičkové recenzie, vymyslené mená, stock avatary, tvár bez mena (`janko.jpg`).
- AI-slop: úprimne, narovinu, ještě dnes, stvořeno, inovatívne riešenia, synergia, lídri na trhu, komplexné riešenia, špičkový; prázdne superlatívy (garantujeme 100 %).
- Vymyslené údaje: IČO, DIČ, hodiny, 24/7, počty realizácií, roky skúseností, certifikáty, logá klientov.
- Čokoľvek z MaisonCo demo stránok (Connor Flores, Manhattan, Observatory, Recent Posts).
- CTA `Odoslať`. CTA = akcia + benefit.
- `box-shadow`, rezy ≥ 700, cudzie hexy z iných dém (#0e5c66, #f6a21c, #3970ff, fialové).
- `scroll-behavior: smooth` v CSS (bije sa s Lenisom).

### 2.2 Chcené
Moderný čistý minimalistický B2B web: presný, inžiniersky, švajčiarsko-nemecký priemyselný
katalóg prenesený do webu. Biela dominuje, #F03314 vedie oko (málo a presne), jedno tmavé
#26292C pásmo pre hĺbku. Vlasové rámy, uppercase mikro-labely, charakterný grotesk 500–600.
Konverzná doktrína: dôvera → dôkaz → kontakt; `tel:` vždy viditeľný.

### 2.3 Tvrdé pravidlá procesu
1. **Desktop is sacred.** Mobilná oprava mení iba mobilný breakpoint; po nej porovnaj 1440 px pred/po.
2. **Measure, don't eyeball.** `getComputedStyle`, `getBoundingClientRect`, vyrátaný kontrast, screenshoty.
3. QA na 390 aj 1440 px pred vyhlásením „hotové".
4. Nikdy neobetuj UX za skóre.
5. Nemeniť `chassis/`; iba `site/src/sections`, `src/styles/tokens.css`, `src/content/global.json`, `public/assets`.

---

## 3. Čo sa NESMIE rozbiť

- **Fakty doslova:** Cestné prvky s.r.o. · Borová 3295/36, 010 01 Žilina · info@cestneprvky.sk · +421 911 87 87 89 · založené 2012.
- **Paleta:** akcent iba `#F03314` (hover `#C5250D`), ink `#26292C`/`#3F4448`, bg `#FFFFFF`/`#F4F5F6`, modrá `#0E74BC` len v logu. Biely text na #F03314 len ≥ 18 px alebo 600+.
- **9 služieb** s názvami doslova z webu.
- Fotky = reálne realizácie klienta s pravdivými popismi (miesto + prvok).
- `noindex`, `lang="sk"`, jeden H1, meta description ≤ 160 znakov.
- **Poradie sekcií:** uvod → sluzby → debarierizacia (sticky, tmavá) → technologie (#F4F5F6) → realizacie → o-nas (#F4F5F6) → kontakt + footer (#26292C).
- **Písmo:** Archivo (display, 500–600), IBM Plex Sans (telo), IBM Plex Mono (eyebrow, vyhlášky, tabuľka DEBUZ). H1 84 px/600 desktop, 48 px mobil. Žiadny rez 700.
- **Hero:** biely split, fotka terčíkov (10-titulka_o_firme.jpg) + karta Vodiaca línia · Bratislava, trust line „Od roku 2012 · Žilina · vyhláška 532/2002“, CTA „Dohodnúť obhliadku a cenu“.
- **useFaza() v Debarierizacia.jsx:** vstupný rozsah useTransform musí ostať v [0,1] a prísne rastúci (inak prázdna stránka).
- Logo `assets/90-logo-cestne-prvky.png` v headeri aj footeri.

---

## 4. Známe otvorené porušenia
Viď `QUALITY-LOG.md` → „Zostáva“. Stav po iterácii 2: publish blokovaný viditeľnosťou repa; Lighthouse nezmeraný; proof strip na mobile kozmetika.

---

## 5. Postup jednej iterácie

1. Načítaj štandardy: `STANDARDY.md` (destilát vaultu) + znovu `me/06-Working-with-Claude.md` §2–§3.
2. `cd site && npm run build && (npx vite preview --port 4320 --strictPort &)`; potom
   `node poznamky/audit.mjs --shots poznamky/shots --tag iterN`
   (29 mechanických kontrol). K tomu vizuálna kontrola screenshotov 1440 + 390 podľa STANDARDY §B a §C
   (kompozícia, rytmus, „vyzerá lacno?“), ktorú audit nevie.
3. Vyber max 3 najzávažnejšie nálezy.
4. Oprav. Texty po slovensky, vecne.
5. Over: `npm run build` zelený, znova zmeraj to, čo si opravoval, screenshoty oboch breakpointov do `poznamky/iterN-*.jpeg`. Skontroluj §3.
6. Publikuj, počkaj na zelený Actions beh, `curl -sI` živej URL → 200.
7. Zapíš riadok do `QUALITY-LOG.md`: dátum, nález, oprava, overenie, čo zostáva.

---

## 6. Výstupná podmienka (všetko naraz, overené v tej istej iterácii)

- [ ] 0 pomlčiek v našej copy, 0 slop slov, 0 `Odoslať`, 0 dekoratívnych `01/02/03`
- [ ] 0 vymyslených údajov; každý fakt sedí s PROMPT.md §1 a `facts.json`
- [ ] 0 stôp po MaisonCo, 0 anglických UI stringov, 0 českých slov
- [ ] 0 `box-shadow`, 0 cudzích hexov, 0 rezov ≥ 700
- [ ] kontrast prešiel na každej reálne použitej dvojici (4,5:1 telo, 3:1 veľký text)
- [ ] hero fotka ≥ 45 % šírky na 1440, žiadny overflow na 390, `tel:` nad foldom na mobile
- [ ] `npm run build` zelený, Actions zelené, živá URL 200, Lighthouse mobile P ≥ 90 / A11y ≥ 95 / SEO ≥ 90
- [ ] screenshoty 1440 + 390 poslednej iterácie v `poznamky/`
- [ ] `audit.mjs` 29/29 ✅ dvakrát po sebe
- [ ] posledná iterácia nenašla nič nové

Zastav aj vtedy, keď dve iterácie po sebe nenájdu nič opraviteľné, alebo pri rozhodnutí,
ktoré patrí Petrovi (fakty, štruktúra, niečo, čo by sa dotklo klienta). Napíš to a skonči.

---

## 7. Ako reportovať
Po každej iterácii: čo si našiel, čo si opravil, čím si to overil, čo zostáva. Čísla a súbory.
