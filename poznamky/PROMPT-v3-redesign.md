# REDIZAJN demo-cestneprvky v3 — presne a len slabiny (2026-08-24)

> Skopíruj celý súbor do Claude Code v `~/Desktop/pnh_media/demogen`. Rozsah = presne
> slabiny v §2 — čo v §2 nie je, sa nemení (vizuál, copy, poradie sekcií, tokeny,
> chassis). Nie je to nové demo. Review prebehol dvoma optikami: frontend (štruktúra,
> IA, konzistencia, assety) a presvedčivosť (dôkazy, trenie, dôvera B2B a
> samosprávneho zákazníka). Nález: dizajnový systém drží, stránka ale nepredkladá
> dôkazy a konverzná cesta končí v slepej uličke.

---

## 0. Kde to žije

| | |
|---|---|
| Site | `./` (build `npm run build`, náhľad `npx vite preview --port 4320 --strictPort` → `http://localhost:4320/demo-cestneprvky/`) |
| Sekcie | `src/sections/*.jsx` · tokeny `src/styles/tokens.css` · texty `src/content/global.json` |
| Štandardy | `poznamky/STANDARDY.md` (45 bodov) — čítaj PRED prvou zmenou |
| Audit | `node poznamky/audit.mjs --shots poznamky/shots --tag v3-iterN` (33 kontrol; v §4 ho rozšíriš na 37) |
| Loop | `QUALITY-LOOP.md` §5 (postup iterácie) a §6 (kedy skončiť), log do `QUALITY-LOG.md` |
| Job | id `4daa0bdb-77b8-4dec-87a7-d4a899e8ecd4`, server `http://127.0.0.1:3117` |

Publish je stále blokovaný viditeľnosťou repa `devpnh/demo-cestneprvky` — neskúšaj ho,
len to uveď v logu.

## 1. NAJPRV: baseline

Full-page screenshoty 1440 aj 390 (`--tag v3-baseline`) a y-pásma sekcií, ktorých sa
§2 nedotýka: hero kompozícia (okrem eyebrow, §2.8b), Služby explorer, Debarierizácia,
mriežka Realizácií, O nás (okrem jednej vety, §2.1b), footer gradient a veľkosť.
Po KAŽDEJ iterácii pixel-diff výrezu pásma voči výrezu pásma (zarovnaj podľa začiatku
sekcie; hero video pásmo z diffu vynechaj). Desktop is sacred: mobilná oprava = len
mobilný breakpoint.

---

## 2. SLABINY A ICH ODSTRÁNENIE (v poradí dôležitosti)

### 2.1 Nulový sociálny dôkaz na celej stránke (presvedčivosť — kritické)
**Zle:** Jediným dôkazom sú fotografie. Rok založenia zmizol z hero spolu s trust
line a prvýkrát sa objaví až hlboko v O nás; nikde nie sú počty, menovaní klienti ani
partneri. ÚNSS — jediný menovaný, overiteľný partner — je zakopaná ako posledná veta
odseku v tmavom pásme (`Debarierizacia.jsx`). Veta „spolupracujeme s významnými
európskymi spoločnosťami" (`ONas.jsx`) je nemenovaný superlatív — presne ten typ
tvrdenia, ktorý pôsobí synteticky a znižuje dôveru namiesto budovania.
**Zmeniť:**
a) Pás pod hero (viď §2.2) nahradiť faktovým pásom — len overiteľné fakty
   z podkladov: „Od roku 2012 · 9 prvkov v 3 celkoch · vyhláška MŽP SR č. 532/2002
   Z. z. a MV SR č. 9/2009 Z. z. · Konzultácie: Únia nevidiacich a slabozrakých
   Slovenska". Žiadne vymyslené čísla.
b) V O nás nemenovaný superlatív nahradiť konkrétami, ktoré v podkladoch sú
   (menované technológie a materiály — jedna veta, sekcia Technológie sa NEVRACIA),
   alebo vetu vypustiť. Mená spoločností vyžiadať v handoveri; na stránku bez mien
   nič nemenované nepatrí.
**Merateľne:** prvý viewport pod foldom obsahuje ≥ 3 overiteľné fakty;
`grep -r "významnými" src/` = 0.

### 2.2 Pás pod hero duplikuje sekciu Služby (štruktúra)
**Zle:** pás „ČO REALIZUJEME" vymenúva tých istých 9 služieb, ktoré hneď nasledujúca
sekcia „Čo realizujeme na pozemných komunikáciách" prechádza v exploreri — dva razy
ten istý obsah za sebou aj takmer rovnaký nadpis; najcennejší viewport hneď pod
foldom je minutý na opakovanie namiesto dôkazu. Na 390 px navyše oddeľovače „·"
visia na začiatkoch/koncoch riadkov (známa kozmetika z logu, stále neopravená).
**Zmeniť:** nahradiť faktovým pásom z §2.1a — jeden až dva riadky, mono štýl pásu
ostáva. Položka + oddeľovač = nedeliteľná jednotka (`whitespace-nowrap` so
separátorom vnútri spanu, posledná položka bez neho).
**Merateľne:** služby sa nad explorerom nevymenúvajú; na 390 px žiadny riadok pásu
nezačína ani nekončí „·".

### 2.3 CTA reťaz končí v mailto — chýba formulár (konverzia — kritické)
**Zle:** „Dohodnúť obhliadku a cenu" (hero, header, Služby, Kontakt) vedie na
`#kontakt`, kde jediná akcia je `mailto:`/`tel:`. Copy sekcie znie „Pošlite
zadanie…", ale niet kam ho poslať: mailto na firemných počítačoch často nemá
nakonfigurovaného klienta, nič neštruktúruje (typ prvku, miesto, rozsah) a nenechá
konverznú stopu. Zároveň je pravá tretina Kontakt sekcie na 1440 prázdna tmavá
plocha (`KontaktAPaticka.jsx`, pásmo Kontakt vo `v3-catalog-1440.jpeg`) — kompozícia
je nevyvážená presne tam, kde má formulár žiť.
**Zmeniť:** do prázdneho pravého stĺpca formulár „Zadanie obhliadky": select Typ
prvku (9 služieb + Iné), input Miesto, textarea Rozsah a popis, pole E-mail alebo
telefón (aspoň jedno povinné), tlačidlo „Odoslať zadanie". Endpoint cez env
(Formspark konvencia PNH), kým nie je — submit zobrazí success panel s poznámkou
demo režimu, bez reloadu. Mailto/tel ostávajú ako sekundárna cesta vľavo. Vizuál:
vlasové rámy, mono labely, štýl sekcie; žiadne box-shadow. Mobil: formulár pod
kontaktnými údajmi.
**Merateľne:** `#kontakt` obsahuje `<form>` so 4 poľami a validáciou; pravé pásmo
1440 už nie je prázdne; hero CTA → formulár = 1 klik + scroll.

### 2.4 Chýba sekcia procesu (presvedčivosť)
**Zle:** sľub „vrátime sa s termínom obhliadky" nikde nevysvetľuje, čo nasleduje.
Pre mestá, župy a stavebné firmy je predvídateľnosť postupu hlavný argument ozvať
sa — stránka medzi galériou a kontaktom nemá nič, čo by znížilo neistotu prvého
kontaktu.
**Zmeniť:** nová úzka sekcia „Ako spolupráca prebieha" medzi O nás a Kontakt (biele
pozadie, rytmus svetlé → tmavé ostáva): 4 kroky Zadanie → Obhliadka na mieste →
Cenová ponuka → Realizácia a odovzdanie, každý jedna vecná veta z faktov (nič
netvrdiť nad rámec podkladov — „obhliadka zdarma" v nich nie je). Vlasové deliče,
mono označenie krokov, bez dekoratívnych 01/02/03 (zákaz STANDARDY). Jedno CTA na
`#kontakt`. Výška do ~55 vh na 1440. Pridať do scrollspy NEtreba (sekcia bez
navigačnej kotvy alebo pod `#o-nas` — nerozširuj nav nad 5 položiek).

### 2.5 Footer navigácia: mŕtvy odkaz a chýbajúca položka (IA — bug)
**Zle:** `KontaktAPaticka.jsx:7` — footer NAV stále obsahuje „Technológie"
(`#technologie`), sekcia bola odstránená, klik nevedie nikam. Chýba „O nás", takže
footer sa líši od headera. Príčina: NAV pole je zduplikované v dvoch súboroch a už
raz sa rozišlo.
**Zmeniť:** jeden zdroj pravdy `src/content/nav.js`, import v `HlavickaAHero.jsx`
aj `KontaktAPaticka.jsx`; footer = rovnakých 5 položiek ako header.
**Merateľne:** každý `href="#…"` na stránke má existujúce `id`; footer zoznam ===
header zoznam.

### 2.6 [DOPLNIŤ] placeholder viditeľný v galérii (dôveryhodnosť — bug)
**Zle:** `Realizacie.jsx:61` a `:77` majú `miesto: '[DOPLNIŤ]'` — po rozkliknutí
„Zobraziť všetky realizácie (9)" vidí návštevník surový placeholder. Na deme, ktoré
má predať dôslednosť, pôsobí nedokončene.
**Zmeniť:** riadok miesta renderovať len ak je známe (mechanizmus z v2-iter5 už
existuje) — pre tieto dve fotky `miesto: ''`. Miesta vyžiadať v handoveri.
**Merateľne:** rendered DOM (1440 aj 390, PO rozkliknutí galérie) neobsahuje
„[DOPLNIŤ]".

### 2.7 Logo je najslabší pixel na stránke (asset)
**Zle:** jediný zdroj je 145×86 px PNG; pri 48 px výške headera je na retine mäkký
a najčastejšie opakovaný prvok značky je tak zároveň jej najhorší asset. Lokálne sa
to opraviť nedá — rekresľovanie bez klienta je zakázané.
**Zmeniť:** nerekresľovať, strop `h-12` držať, nikdy neškálovať nad natívnu šírku.
Do handoveru ako PRVÁ položka: „SVG alebo bitmapa loga ≥ 512 px šírky".

### 2.8 Mikroopravy dôveryhodnosti (copy)
a) Telefón sa zobrazuje „+421 911 87 87 89" (4×) — nezvyčajné členenie; zjednotiť
   na „+421 911 878 789". `tel:` href nemeniť.
b) Hero eyebrow „CESTNÉ PRVKY S.R.O. · ŽILINA" opakuje značku, ktorej logo je 40 px
   nad ním. Nahradiť faktom, ktorý z hero zmizol s trust line: „DOPRAVNÉ STAVBY ·
   OD ROKU 2012". Nič iné v hero nemeniť.
c) Popisky galérie: ak je pri fotke rok známy z podkladov, doplniť za miesto
   (mono „MIESTO · ROK"); neznáme roky nechať bez a do handoveru zoznam pre
   klienta. Žiadne odhady.

---

## 3. Poradie a proces

Iterácie: **(1)** §2.5 + §2.6 + §2.8 (drobné, jeden beh) → **(2)** §2.2 + §2.1
(pás + veta v O nás) → **(3)** §2.3 formulár → **(4)** §2.4 proces → §2.7 je len
handover. Po každej iterácii: build zelený, audit, full-page 1440/390
`--tag v3-iterN`, pixel-diff nedotknutých pásiem voči baseline. Nové prvky: pri
`prefers-reduced-motion` bez pohybu; scroll-linked `useTransform` rozsahy prísne
rastúce v [0, 1]; nič nové v scrollspy logike.

## 4. Audit rozšíriť (33 → 37, všetkých 37 musí prejsť 2× po sebe)

- **NAVv3:** header aj footer — každý `href="#…"` má existujúce `id`; footer ===
  header.
- **DOPLv3:** rendered DOM na 1440 aj 390, po rozkliknutí galérie, neobsahuje
  „[DOPLNIŤ]".
- **FORMv3:** `#kontakt` obsahuje form so 4 poľami; submit bez endpointu = success
  panel bez page reloadu; polia majú label a min. výšku 44 px.
- **STRIPv3:** na 390 px žiadny riadok faktového pásu nezačína ani nekončí „·".

## 5. Zákazy (nemenia sa)

- Fakty doslova; žiadne vymyslené čísla, mená, roky — neznáme patrí do handoveru,
  nie na stránku.
- Paleta: akcent len `#F03314`, modrá len v logu; žiadne cudzie hexy, box-shadow,
  rezy ≥ 700, pomlčky v našej copy, 01/02/03 dekor, marquee, wheel-hijack,
  `scroll-behavior: smooth`.
- Debarierizácia, Služby explorer, mriežka Realizácií, footer gradient a veľkosť:
  bez vizuálnej zmeny mimo §2.5, §2.6 a §2.8c.
- Hero koncept (video, scrim, sklená karta, CTA texty) sa nemení — jediná zmena je
  eyebrow (§2.8b).
- Publish neskúšať — len poznámka do logu.

## 6. Log a handover

Do `QUALITY-LOG.md` sekcia „2026-08-24 · v3 redizajn slabín" (nálezy, opravy,
overenia, screenshoty). Handover zoznam pre klienta: (1) SVG/veľké logo, (2) mená
európskych spoločností alebo súhlas s vypustením vety, (3) miesta 2 fotiek
(cyklotrasa, zálievkové hmoty), (4) roky realizácií, (5) endpoint formulára.
