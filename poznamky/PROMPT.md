# PROMPT — demo-cestneprvky: kompletný B2B redizajn cestneprvky.sk cez demogen + quality loop

> Skopíruj celý tento súbor do Claude Code (v `~/Desktop/pnh_media/demogen`, bypass
> permissions). Je to jeden autonómny zadaný beh: naštartuj demogen → vygeneruj demo →
> spusti loop, ktorý demo doladí podľa štandardov PNH → publikuj → zapíš do pamäte.

---

## 0. Rola a spôsob práce

Si operátor demogenu a zároveň art director PNH Media. Pracuješ sám, Peter nesleduje
terminál. **Konaj, nepýtaj sa.** Jediné, pri čom sa zastavíš, je rozhodnutie, ktoré by
menilo fakty klienta alebo čokoľvek nezvratné mimo tohto stroja (mazanie repa, zásah do
cudzieho prod webu). Reportuj stručne a vecne: čísla, súbory, screenshoty. Žiadne
„vylepšil som UX".

Pred prvým krokom si prečítaj (a po každej iterácii loopu znova, lebo majú prednosť
pred týmto promptom):

1. `~/Desktop/Vaults/me/06-Working-with-Claude.md` — §2 Design taste, §3 Hard rules,
   §4 Build & deploy, SESSION-END CHECKLIST.
2. `~/Desktop/Vaults/me/05-Opinions-Values.md` — §8 Business ethics (poctivosť v copy).
3. `~/Desktop/pnh_media/demogen/poznamky/demo-gensor/QUALITY-LOOP.md` a
   `QUALITY-LOG.md` — precedens: takto vyzerá hotový loop a čo sa v ňom reálne kazilo.
4. `~/Desktop/pnh_media/demogen/docs/GUIDE.md` (2 min) a `README.md` sekcia „Čo to robí".
5. `~/Desktop/pnh_media/demogen/memory/decisions/demo-gensor.md`,
   `edstrex.md`, `pnhmedia.md` — tri najbližšie segmenty (lokálna firma, stavebná
   firma, B2B služby). Hľadaj, čo sa osvedčilo a čo Peter odmietol.

---

## 1. Klient — overené fakty (zdroj: živý web, 2026-08-21)

**Cestné prvky s.r.o.** — dopravné stavby a bezpečnostné prvky komunikácií, Žilina.
Založená 2012. Web: https://www.cestneprvky.sk/ (WordPress 6.9 + Elementor 4.2 +
Slider Revolution, téma pre realitné projekty „MaisonCo" — prispôsobená len z polovice).

| Fakt | Hodnota (doslova) |
|---|---|
| Názov | Cestné prvky s.r.o. |
| Adresa | Borová 3295/36, 010 01 Žilina, Slovensko |
| E-mail | info@cestneprvky.sk |
| Telefón | +421 911 87 87 89 |
| Rok založenia | 2012 |
| Claim z webu | „Šetríme váš čas aj peniaze" · „Spolupracujeme s významnými európskymi spoločnosťami z tejto oblasti" |
| Partner/odkaz | Únia nevidiacich a slabozrakých Slovenska — https://architektonickebariery.sk/ |
| Legislatíva v copy | vyhláška MŽP SR č. 532/2002 Z. z., vyhláška MV SR č. 9/2009 Z. z. |
| Produkty/značky | ColdPlastic (studený plast, Kaltplastik), DEBUZ® Kölner Teller (retardéry, liaty hliník, 35/50 mm, KT-35/KT-50), Chipfill/Coldfill (oprava výtlkov) |

**9 služieb (presné názvy z webu, poradie z navigácie):**
1. Značenie pre nevidiacich a slabozrakých
2. Vodorovné dopravné značenie
3. Lepené obrubníky
4. Spomaľovače dopravy (retardéry)
5. Zálievkové a vysprávkové hmoty
6. Bezpečnostný protišmykový náter
7. Cyklotrasy
8. Štítky: Braillovo písmo, gravírovanie, hmatové mapy
9. Odstránenie starého vodorovného dopravného značenia

Detailné texty služieb žijú na `/apartment/<slug>/` (áno, slug je z realitnej témy —
obsah je reálny). Najbohatšie: `/apartment/znacenie-pre-nevidiacich/`,
`/apartment/vodorovne-dopravne-znacenie/`, `/apartment/lepene-obrubniky/`,
`/apartment/spomalovace-dopravy/`. Odtiaľ ber terminológiu: varovný pás, signálny pás,
vodiaca línia, opticko-akustická brzda, piktogramy, lepené ostrovčeky, parkovacie dorazy,
„po nalepení 30 min. 100 % pevnosti", „bez búracích prác, bez ťažkých mechanizmov".

**Čo NIE JE fakt klienta a NESMIE sa dostať do dema** (nedokončené demo stránky témy):
`/about-us/` (MaisonCo, Manhattan, „Connor Flores", „Caroline Vaughn", „MILLION + web
pages"), `/faq/` (86th Floor Observatory), `/our-team/`, `/residences/`, `/the-building/`,
`/neighborhood/`, `/apartment-amenities/`, `/availability/`, `/demo/`, `/landing-page/`,
`/home-1/`, `/icons/`, `/ukazka-strany/`, `/2021/01/03/ahoj-svet/`, galéria s kategóriami
„Environment / Building Progress / Views". Ani jedno meno, číslo ani veta odtiaľ.
**Žiadny IČO/DIČ, otváracie hodiny, počet realizácií, roky skúseností ani recenzie** —
na webe nie sú, takže ich nevymýšľaj (`neuvádzame vymyslené údaje`). Kde by demo
potrebovalo číslo, ktoré nemáme, použi formuláciu bez čísla alebo `[DOPLNÍ KLIENT]`.

**Technická poznámka k scrape:** server vracia HTTP 466 „Access Forbidden" pre
ne-prehliadačové User-Agenty (curl default). Playwright Chromium prejde; ak `facts.json`
vyjde prázdny alebo s titulkom „Access Forbidden", nastav v adaptéri reálny Chrome UA
a zopakuj SCRAPE.

---

## 2. Vizuálna identita — čo sa preberá z originálu

Brief znie: **kompletný redizajn, ale farebnosť klienta ostáva.** Nie je to šablóna
ani refactor: štruktúra, písmo, komponenty a texty vznikajú nanovo; paleta a fotky sú
klientove.

### 2.1 Paleta (zmerané z CSS a loga)

```
--color-accent:      #F03314   /* červeno-oranžová z CSS, 16× — JEDINÝ akcent: CTA, aktívne stavy, mikro-labely */
--color-accent-deep: #C5250D   /* tmavšia červená — hover/pressed, nikdy ako plocha   */
--color-brand-blue:  #0E74BC   /* modrá z loga (písmená C/P) — len v logu a max. 1 drobný detail, napr. focus ring */
--color-ink:         #26292C   /* hlavný text, tmavé pásmo                             */
--color-ink-2:       #3F4448   /* sekundárny text (13× v CSS originálu)                */
--color-muted:       #9EA0A6   /* meta text — POZOR: na bielej nemá 4,5:1, len na >= 18 px alebo ako dekor */
--color-bg:          #FFFFFF
--color-bg-2:        #F4F5F6   /* jemná sivá pre striedanie pásiem (odvodená, nie z originálu — povolené, je to neutrál) */
--color-hairline:    rgba(38,41,44,0.12)
```

Pravidlá: červená je signálna farba dopravného značenia, tak s ňou aj zaobchádzaj —
**málo a presne**. Biela dominuje, červená vedie oko. Nikdy červené pozadie celej sekcie,
nikdy gradient červená→modrá, žiadne neóny. Biely text na #F03314 má kontrast ~3,9:1:
na CTA použi **text ≥ 18 px alebo 600+**, inak #26292C text na bielom tlačidle s
červeným rámom. Na každú dvojicu farieb over kontrast výpočtom, nie od oka.

### 2.2 Logo a fotky

- Logo: `https://www.cestneprvky.sk/wp-content/uploads/2018/12/logo-v2_small2.png`
  (145×86, modré C/P + červený text). Ak scraper neuloží lepšie, použi toto v headeri
  v pôvodnom pomere; nikdy nerekresľuj logo.
- Hero/úvod: `uploads/2021/01/titulka_o_firme.jpg` — mosadzné hmatové terčíky na
  dlažbe (silná, „remeselná" fotka, ideálny hero alebo úvod sekcie o službách).
- Hero slider originálu: `uploads/2022/08/Medeny_Hamor_1-scaled.jpg`,
  `uploads/2022/08/PD-1.jpg`, `uploads/2022/08/ZubaC48Dka-scaled.jpg`.
- Galéria realizácií (2022/08): `BA_Nivy_*`, `BA_Bosakova`, `Medeny_Hamor_*`, `MT_1`,
  `Filakovo`, `Milochov`, `NO_1`, `TN_1`, `Tornala`, `BB_*`, `Braill.jpg`.
- Staršie realizácie s popisnými názvami (2018/12): `Priechod-pre-chodcov-Devinska-
  Nova-Ves2`, `Vodiaca-linia-z-lepenych-obrubnikov-na-moste-Svedernik2`,
  `Lepeny-ostrovcek-Most-pri-Bratislave`, `Opticko-akusticka-brzda-Blatna-na-Ostrove`,
  `Protismykove-pasy-Filakovo3`, `spomalovace_dopravy_0*.jpg`, `Debuz.jpg`.
- `uploads/2021/01/janko.jpg` je portrét osoby (400×400) — **nepoužívaj**, nemáme meno
  ani súhlas a tvár bez mena = „fake face".

Fotky sú reálne realizácie s miestami — používaj ich s pravdivým popisom (mesto z názvu
súboru, typ prvku), nie ako anonymné dekorácie. Ak scraper stiahne menej než 6 použiteľných,
dotiahni ich ručne do `./public/assets/` (Chrome UA!),
skomprimuj (≤ 250 kB, WebP alebo JPEG q80, max 1920 px) a referencuj cez
`${import.meta.env.BASE_URL}assets/<súbor>` s `width`/`height`/`loading="lazy"`.

### 2.3 Čo sa z originálu NEpreberá

Marcellus SC (serif z realitnej témy), Slider Revolution, uppercase menu s 9 položkami,
„Recent Posts", „Dohodnúť stretnutie" ako jediné CTA bez benefitu, rozhádzané
Elementor rozostupy, kontaktný formulár „NAPÍŠTE NÁM" bez kontextu, cookie lišta,
MonsterInsights. Z blogu existuje jeden článok (Žilinská župa, ostrovčeky, 2021) —
do dema nejde.

---

## 3. Cieľová estetika — moderný čistý minimalistický B2B web

Segment: **B2B dodávateľ pre mestá, župy, správcov ciest, stavebné firmy a developerov**
(HB Reavis Nivy je medzi realizáciami). Publikum sú technici a investiční referenti, nie
koncoví spotrebitelia. Má to pôsobiť ako spoľahlivý technologický dodávateľ: presný,
vecný, inžiniersky, so stopou remesla. „Žiadny studený korporát, žiadny generický
AI-SaaS štýl" — ale ani teplá lokálna remeselnícka nálada ako Gensor. Referenčná
poloha: švajčiarsko-nemecký priemyselný katalóg prenesený do webu. Apple-clean
disciplína, editoriálna zdržanlivosť.

**Typografia:** jeden charakterný grotesk na nadpisy (kandidáti: Instrument Sans,
Geist, Schibsted Grotesk, Hanken Grotesk; nie Inter/Roboto ako primárny) + čitateľný
telový sans; voliteľne mono len na technické parametre (rozmery, normy). Max 2 rodiny.
Nadpisy 500–600, žiadne 800+. H1 desktop 64–80 px, H2 40–48 px, telo 17–18 px,
riadok 1,55–1,65. Uppercase mikro-labely 12–13 px s letter-spacing 0,08 em v akcente.

**Layout:** 12-stĺpcový grid, kontajner 1200–1280 px, vertikálny rytmus 96–128 px medzi
sekciami na desktope (64 na mobile). Vlasové rámy `1px` namiesto tieňov. **Žiadne
`box-shadow`.** Rádiusy 6–10 px, nie pilulky a nie ostré 0 (toto nie je Gensor).
Jasné striedanie bielej a #F4F5F6 pásiem; jedno tmavé #26292C pásmo (dôkaz/realizácie
alebo kontakt) pre hĺbku.

**Pohyb:** fade + slide-up 16–24 px pri vstupe do viewportu, stagger 60–80 ms na
kartách, hover na karte = zvýraznenie vlasového rámu do akcentu. Hero bez slideru;
maximálne pomalý crossfade dvoch fotiek alebo statická fotka. Nič iné. Všetko vypnuté pri
`prefers-reduced-motion`. Žiadny `scroll-behavior: smooth` v CSS (bije sa s Lenisom).

**Konverzná doktrína PNH:** dôvera pred ponukou → dôkaz v strede → kontakt na konci.
Navrhovaná štruktúra hlavnej stránky (DIRECTION ju môže prestavať, ale musí to zdôvodniť):

1. **Header** — logo, 4–5 položiek (Služby · Realizácie · Prečo my · Kontakt), telefón
   ako `tel:` viditeľný aj na mobile, CTA „Nezáväzný dopyt do 24 h" (alebo iný
   *akcia + benefit*, ale 24 h len ak to nie je sľub — radšej „Poslať dopyt na cenovú ponuku").
2. **Hero** — jedna veta, čo robia a pre koho (mestá, správcovia ciest, stavebné firmy),
   fotka realizácie ≥ 45 % šírky, dve CTA (primárne dopyt, sekundárne „Pozrieť služby").
   Pod hero tenký pás s tromi faktami BEZ čísel, ktoré nemáme: „Od roku 2012" ·
   „Žilina, realizácie po celom Slovensku" · „Materiály európskych výrobcov".
3. **Prečo Cestné prvky** — 3–4 vecné argumenty odvodené z textov služieb (bez búracích
   prác, rýchlosť realizácie, súlad s vyhláškami, certifikované materiály). Bez `01/02/03`.
4. **Služby** — 9 služieb v mriežke 3×3, každá s ikonou-linkou (vlastné SVG, jednotný
   stroke), názvom doslova z webu a jednou vetou „pre koho / kedy". Prvé tri sú nosné
   (značenie pre nevidiacich, vodorovné značenie, lepené obrubníky) — môžu byť väčšie.
5. **Realizácie** — galéria 6–9 fotiek s pravdivými popismi (miesto + prvok), na tmavom
   pásme. Žiadne logá klientov, ktoré nevieme doložiť.
6. **Ako prebieha spolupráca** — obhliadka/dopyt → návrh a ponuka → realizácia →
   odovzdanie; poradie vyjadri vizuálnym spojením, nie číslovanými dlaždicami.
7. **Kontakt** — adresa, `tel:`, `mailto:`, mapa (statický obrázok alebo odkaz, nie
   Google embed) a krátky formulár (meno, firma/obec, telefón alebo e-mail, čo riešite).
   CTA = akcia + benefit. Nikdy `Odoslať`.
8. **Footer** — fakty, služby, `noindex` ostáva (demo).

Jazyk: **slovenčina**, vecná, technická, bez marketingových fráz. Žiadne anglicizmy
v UI („Recent Posts"). Pravopis a diakritika bez chýb.

---

## 4. Spustenie demogenu — presný postup

### 4.1 Prostredie

```bash
cd ~/Desktop/pnh_media/demogen
git status --short | head            # vieš, kde si; nič necommituj bez pokynu
grep -E '^(ADAPTER_|AUTO_APPROVE_GATE|REVIEW_MAX|PUBLISH_|GITHUB_ORG|CLAUDE_CODE_MODEL_GENERATE)' .env
```

Očakávané: `ADAPTER_LLM=claude-code`, `ADAPTER_SCRAPE=playwright`,
`ADAPTER_PUBLISH=github`, `AUTO_APPROVE_GATE=false`, `GITHUB_ORG=devpnh`. Ak niečo
chýba, oprav `.env` (nie `.env.example`). Pozor na `GITHUB_REPO_PRIVATE`: v `.env` je
dnes `true`, ale GitHub Pages z privátneho repa fungujú len na platenom pláne — ak
publish prejde a Pages vrátia 404, prepni na `false` a publishni znova (demo-gensor
takto žije verejne; `noindex` v chassis ho drží mimo vyhľadávačov). Over `claude --version` a `gh auth status`
(musí byť prihlásený účet s prístupom do org `devpnh`). Skontroluj, či port 3117 nebeží
(`lsof -i :3117`); ak áno, použi ten server, neštartuj druhý.

Server spusti na pozadí s logom do scratchpadu:
```bash
node --experimental-strip-types src/index.ts > /tmp/demogen-cestneprvky.log 2>&1 &
```
a sleduj `tail -f`. Prihlásenie pre API: heslo je v `.env` ako `DEMOGEN_PASSWORD`.
```bash
curl -s -c /tmp/dg.cookie -H 'Content-Type: application/json' \
  -d "{\"password\":\"$(grep ^DEMOGEN_PASSWORD .env | cut -d= -f2)\"}" http://127.0.0.1:3117/login
```

### 4.2 Over policy ešte pred vytvorením jobu

Režim `redesign` dáva všetky osi na „nové". Vízia nižšie ich má prebiť na
`palette: keep` a `assets: reuse`. Over to mechanicky:

```bash
curl -s -b /tmp/dg.cookie -H 'Content-Type: application/json' \
  -d @/tmp/policy-preview.json http://127.0.0.1:3117/api/policy/preview | jq
```
kde `/tmp/policy-preview.json` má `{"mode":"redesign","visionText":"<text z 4.3>"}`.
Požadovaný výsledok: `palette: keep`, `typography: new`, `assets: reuse`,
`structure: rebuild`, `components: bespoke`, `copy: rewrite`. (Text v 4.3 bol
2026-08-21 prehnaný priamo cez `resolvePolicy()` a dáva presne toto; override palety sa
chytá na „Firemné farby musia zostať", override fotiek na „použite pôvodné fotografie".) Ak vízia niektorú os
netrafí, **nepiš ďalšie vety** — pošli osi explicitne cez `policy` v tele jobu (najsilnejšia
vrstva): `"policy":{"palette":"keep","assets":"reuse"}`.

### 4.3 Vytvorenie jobu

```bash
curl -s -b /tmp/dg.cookie -H 'Content-Type: application/json' \
  -d @/tmp/job.json http://127.0.0.1:3117/api/jobs | jq
```

`/tmp/job.json`:
```json
{
  "repoName": "demo-cestneprvky",
  "clientUrl": "https://www.cestneprvky.sk/",
  "mode": "redesign",
  "policy": { "palette": "keep", "assets": "reuse" },
  "visionText": "<presne text nižšie>"
}
```

**visionText** (jeden odsek, napísaný tak, aby mechanická detekcia osí trafila správne;
nemeň slová „farby musia zostať", „fotky máme dobré", „od základov", „prepísať texty"):

> Cestné prvky s.r.o. zo Žiliny, založené 2012, robia dopravné stavby a bezpečnostné
> prvky komunikácií pre mestá, župy, správcov ciest a stavebné firmy: značenie pre
> nevidiacich, vodorovné dopravné značenie studeným plastom, lepené obrubníky,
> spomaľovače DEBUZ, zálievkové hmoty, protišmykové nátery, cyklotrasy, štítky v
> Braillovom písme a odstraňovanie starého značenia. Chceme kompletný redizajn
> hlavnej stránky od základov, s novou štruktúrou a novým písmom, ako moderný čistý
> minimalistický B2B web pre technikov a investičných referentov, presný a inžiniersky,
> bez korporátneho chladu aj bez generického SaaS štýlu. Firemné farby musia zostať:
> červeno-oranžová F03314 ako jediný akcent, tmavá 26292C, biela, modrá 0E74BC len v
> logu. Fotky máme dobré, sú to reálne realizácie s názvami miest, použite pôvodné
> fotografie z galérie a titulku s mosadznými terčíkmi. Texty treba prepísať vecne po
> slovensky na základe detailov služieb, fakty zachovať doslova. Stránky about-us, faq,
> our-team, residences, the-building, neighborhood, apartment-amenities, availability,
> demo, landing-page a galéria s kategóriami Environment a Building Progress sú
> nedokončené demo stránky šablóny MaisonCo a nesmú byť zdrojom ani jedného faktu.
> Žiadne vymyslené čísla, recenzie, IČO ani hodiny. Telefón +421 911 87 87 89 viditeľný
> ako klikateľný, e-mail info@cestneprvky.sk, adresa Borová 3295/36, 010 01 Žilina.

Ulož si `id` z odpovede do `/tmp/dg.jobid`.

### 4.4 Dozor nad fázami (SSE alebo polling)

```bash
watch -n 20 "curl -s -b /tmp/dg.cookie http://127.0.0.1:3117/api/jobs/\$(cat /tmp/dg.jobid) | jq '{status,currentPhase,costUsd,error}'"
```

**Po SCRAPE** (skôr než UNDERSTAND minie tokeny na smeti) otvor
`pipeline/scrape-brief.md`, `facts.json`, `structure.json` a `assets/`:
- `grep -iE 'maisonco|manhattan|connor|caroline|willie|josie|observatory|intelligenthome|recent posts|apartment amenities' pipeline/*.json pipeline/*.md`
  musí vrátiť nič. Ak vráti, **okamžite** zapíš do `pipeline/steering.md`
  (číta sa pred každým ďalším LLM volaním): zoznam zakázaných zdrojov z §1 a veta, že
  jediné platné fakty sú tie v §1 tohto promptu. Ak sú smeti priamo v `facts.json`,
  vyčisti ich ručne (je to vstup pre fact-check, ktorý ich inak bude *vyžadovať*).
- Over, že v `assets/` je ≥ 6 fotiek realizácií a logo. Ak nie, pozri §2.2.
- Over telefón, e-mail, adresu doslova.

**Gate DIRECTION** (`status: awaiting_gate`): prečítaj `direction.md` celý. Schváľ iba ak:
paleta = §2.1 (červená ako jediný akcent, nie plocha), písmo = grotesk podľa §3, štruktúra
rešpektuje doktrínu dôvera → dôkaz → kontakt, fotky sú klientove, žiadny prvok zo zoznamu
zakázaných v `06-Working-with-Claude.md` §2. Ak niečo nesedí, **neschvaľuj** — zapíš
korekciu do `steering.md`, potom schváľ (steering sa aplikuje v GENERATE aj REVIEW):
```bash
curl -s -b /tmp/dg.cookie -X POST http://127.0.0.1:3117/api/jobs/$(cat /tmp/dg.jobid)/approve
```

**Gate HERO variant** (event `hero:waiting`, screenshoty v `pipeline/hero-variants/`):
pozri si všetky PNG, vyber podľa §3 (fotka ≥ 45 %, hierarchia, CTA akcia + benefit,
žiadny slider look). Rozhodni do 10 min, inak beží odporúčanie poroty:
```bash
curl -s -b /tmp/dg.cookie -H 'Content-Type: application/json' -d '{"variant":N}' \
  -X POST http://127.0.0.1:3117/api/jobs/$(cat /tmp/dg.jobid)/hero-choice
```

**Po CHECK** otvor `check.json`. Fact-check, SEO, budgety, anti-slop — každý `fail`
musí byť buď opravený v loope (§5), alebo vysvetlený v reporte. `PUBLISH_ALLOW_FAILED_CHECK`
je zapnutý, takže publish prebehne aj s failom — to nie je výhovorka, je to dlh do loopu.

**Po PUBLISH** zapíš živú URL (očakávaná `https://devpnh.github.io/demo-cestneprvky/`),
počkaj na zelený Actions beh (`GET /api/jobs/<id>/workflow`) a over `curl -sI` → 200.

Ak beh spadne: príčina je v karte aj v logu; oprav a `↻ Znova` (alebo rovnaký POST s tým
istým slugom = nová verzia, stará ide do `jobs/demo-cestneprvky.v1/`). Nikdy neštartuj
druhý job s iným slugom kvôli tomu istému klientovi.

---

## 5. Quality loop — po prvom publishi

Vytvor `poznamky/QUALITY-LOOP.md` podľa vzoru
`poznamky/demo-gensor/QUALITY-LOOP.md` (rovnaké sekcie: kde to žije, štandardy,
čo sa nesmie rozbiť, známe porušenia, postup iterácie, výstupná podmienka, reportovanie),
vyplnený pre tento job (job id, port náhľadu 4320, živá URL, fakty z §1, paleta z §2.1).
Potom spusti loop cez `/loop` (dynamické tempo, `ScheduleWakeup`) s promptom:

> Pokračuj v quality loope podľa `poznamky/QUALITY-LOOP.md`. Najprv znovu
> prečítaj `~/Desktop/Vaults/me/06-Working-with-Claude.md` §2 a §3. Jedna iterácia =
> audit → max 3 opravy → build → meranie na 1440 aj 390 px → publish → riadok do
> QUALITY-LOG.md. Skonči (`stop: true`), keď platí celá výstupná podmienka alebo dve
> iterácie po sebe nenašli nič.

### 5.1 Audit každej iterácie (merané, nie od oka)

V `./`:

```bash
# copy a slop
grep -rnE '—|–' src/sections src/content | grep -v 'facts\|DEBUZ® –\|Štítky –'   # pomlčky v našej copy (výnimka: doslovné názvy z webu)
grep -rniE 'odoslať|úprimne|narovinu|ještě dnes|stvořeno|inovatívne riešenia|synergi|lídri na trhu|garantujeme 100|24/7|špičkov|komplexné riešenia' src
grep -rnE '\b0[1-9]\b' src/sections                          # dekoratívne 01/02/03
grep -rniE 'recent posts|maisonco|connor|observatory|lorem' src
# štýl
grep -rn 'box-shadow\|shadow-' src | grep -v 'shadow-none'
grep -rniE '#0e5c66|#f6a21c|#3970ff|#7c3aed|#a855f7' src      # cudzie palety z iných dém
grep -rnE 'font-(bold|extrabold|black)|font-weight:\s*[789]00' src
grep -rn 'scroll-behavior' src
# fakty
grep -rn '+421 911 87 87 89' src | wc -l     # ≥ 2 (header + kontakt), presne tento tvar
grep -rn 'info@cestneprvky.sk' src | wc -l   # ≥ 1
grep -rn 'Borová 3295/36' src | wc -l        # ≥ 1
# jazyk: žiadna čeština v SK texte
grep -rniE '\b(které|již|ještě|zde|naše služby jsou|společnost)\b' src/content src/sections
```

Potom `npm run build` → `npx vite preview --port 4320 --strictPort` →
`http://localhost:4320/demo-cestneprvky/` a cez Playwright (alebo chrome-devtools MCP):
- screenshot celej stránky na **1440** aj **390** px do `poznamky/iterN-*.jpeg`;
- `getComputedStyle` na: farbu a veľkosť CTA textu, font-family H1/H2/telo, `box-shadow`
  všetkých `[class*=card]`, pozadia sekcií (musia striedať #FFFFFF / #F4F5F6 / #26292C);
- kontrast každej dvojice text/pozadie, ktorú stránka reálne používa (vyrátaj WCAG pomer,
  hranica 4,5:1 pre telo, 3:1 pre ≥ 24 px alebo ≥ 19 px 600+);
- `getBoundingClientRect` hero fotky na 1440 px: šírka ≥ 45 % viewportu;
- na 390 px: žiadny horizontálny overflow (`document.documentElement.scrollWidth === 390`),
  `tel:` odkaz viditeľný nad foldom, tap targety ≥ 44 px;
- Lighthouse (mobile) na živej URL po publishi: Performance ≥ 90, A11y ≥ 95, SEO ≥ 90 —
  ale **nikdy neobetuj UX za skóre**.

### 5.2 Čo sa v loope NESMIE rozbiť

- Fakty z §1 doslova. Paleta §2.1 (akcent iba #F03314). Žiadne nové sekcie bez dôvodu.
- **Desktop is sacred:** oprava pre 390 px mení výhradne mobilný breakpoint; po každej
  mobilnej oprave porovnaj 1440 px screenshot pred/po (musia byť zhodné).
- `noindex`, meta description ≤ 160 znakov, `lang="sk"`, jeden H1.
- Nič sa nemení ručne v `chassis/` — iba `./src/sections/*`,
  `src/styles/tokens.css`, `src/content/global.json`, `public/assets/`.

### 5.3 Výstupná podmienka loopu

Všetko naraz, overené v tej istej iterácii:
- [ ] 0 pomlčiek v našej copy, 0 slop slov, 0 `Odoslať`, 0 dekoratívnych `01/02/03`
- [ ] 0 vymyslených údajov; každý fakt sedí s §1 a `facts.json`
- [ ] 0 stôp po téme MaisonCo, 0 anglických UI stringov, 0 českých slov
- [ ] 0 `box-shadow`, 0 cudzích hexov, 0 rezov ≥ 700
- [ ] kontrast prešiel na každej reálne použitej dvojici
- [ ] hero fotka ≥ 45 % na 1440, žiadny overflow na 390, `tel:` nad foldom na mobile
- [ ] `npm run build` zelený, Actions zelené, živá URL 200, Lighthouse limity splnené
- [ ] screenshoty 1440 + 390 poslednej iterácie uložené v `poznamky/`
- [ ] posledná iterácia nenašla nič nové

Zastav aj pri rozhodnutí, ktoré patrí Petrovi (zmena faktov, štruktúry, niečo, čo by sa
dotklo klienta) — napíš to a skonči, nehádaj.

---

## 6. Záver behu — pamäť a zápis

1. Feedback do demogenu (učí sa len z neho): `POST /api/jobs/<id>/feedback` s hodnotením,
   minútami ručných opráv (= súčet úprav v loope) a tagmi, čo sa opravovalo; 👍/👎 na
   použité referencie cez `/rate-item`.
2. `poznamky/QUALITY-LOG.md` — riadok na iteráciu (dátum, nález, oprava,
   overenie, čo zostáva).
3. Session note `~/Desktop/Vaults/claude_conversations/Sessions/2026-MM-DD — demo-cestneprvky.md`
   (problém / postup / výsledok, pol strany, čo sa dá nabudúce použiť znova) + riadok do
   `~/Desktop/Vaults/work/context/KONVERZACIE.md`.
4. Secrets nikam (heslo dashboardu, tokeny, kľúče v `.env` — len „existuje v .env").
5. Posledná správa pre Petra: živá URL, 2 screenshoty (1440/390), zoznam toho, čo by sa
   ešte opravilo ručne, a jasne označené, čo je `[DOPLNÍ KLIENT]`.
